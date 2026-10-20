-- ==============================================================================
-- FamTree — Stage 4: Database Schema Migration
-- Specification Baseline: September 2026
-- Based on: 00_FamTree_Master_Specification and 05_Data_Model_and_Database
-- ==============================================================================

-- 1. Helper function for automated updated_at timestamp management
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. TABLE: family_members
-- Preconfigured family tree individuals and lineage records
-- ==============================================================================
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  surname TEXT NOT NULL,
  father_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  mother_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  date_of_birth DATE,
  life_status TEXT NOT NULL DEFAULT 'active' CHECK (life_status IN ('active', 'deceased')),
  phone TEXT,
  primary_email TEXT,
  secondary_email TEXT,
  study_status TEXT,
  work_status TEXT,
  work_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for family matching (FR-05 - FR-07) and relationship queries
CREATE INDEX IF NOT EXISTS idx_family_members_name_search 
  ON family_members (name, father_name, mother_name, surname);

CREATE INDEX IF NOT EXISTS idx_family_members_father 
  ON family_members (father_member_id);

CREATE INDEX IF NOT EXISTS idx_family_members_mother 
  ON family_members (mother_member_id);

CREATE INDEX IF NOT EXISTS idx_family_members_phone 
  ON family_members (phone);

CREATE INDEX IF NOT EXISTS idx_family_members_email 
  ON family_members (primary_email);

CREATE TRIGGER tr_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ==============================================================================
-- 3. TABLE: accounts
-- Links Supabase Auth users to a single verified family tree member
-- Rule: Every account has exactly one linked member; a member may have no account.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_member_id UUID UNIQUE NOT NULL REFERENCES family_members(id) ON DELETE RESTRICT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'level2_admin')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accounts_auth_user 
  ON accounts (auth_user_id);

CREATE INDEX IF NOT EXISTS idx_accounts_linked_member 
  ON accounts (linked_member_id);

CREATE TRIGGER tr_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ==============================================================================
-- 4. TABLE: relationships
-- Explicit directed family relationships preserving lineage integrity
-- ==============================================================================
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  target_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('parent', 'child', 'spouse', 'sibling')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_different_members CHECK (source_member_id <> target_member_id),
  CONSTRAINT uq_member_relationship UNIQUE (source_member_id, target_member_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_relationships_source 
  ON relationships (source_member_id, relationship_type);

CREATE INDEX IF NOT EXISTS idx_relationships_target 
  ON relationships (target_member_id, relationship_type);

-- ==============================================================================
-- 5. TABLE: profile_visibility
-- Member privacy configuration for progressive disclosure in pop-up cards
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profile_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID UNIQUE NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  show_phone BOOLEAN NOT NULL DEFAULT false,
  show_primary_email BOOLEAN NOT NULL DEFAULT false,
  show_secondary_email BOOLEAN NOT NULL DEFAULT false,
  show_study_status BOOLEAN NOT NULL DEFAULT false,
  show_work_status BOOLEAN NOT NULL DEFAULT false,
  show_work_details BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_profile_visibility_updated_at
  BEFORE UPDATE ON profile_visibility
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ==============================================================================
-- 6. TABLE: verification_records
-- Secure storage for single-use expiring phone and email verification tokens
-- ==============================================================================
CREATE TABLE IF NOT EXISTS verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('email', 'phone', 'secondary_email')),
  target_value TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_target 
  ON verification_records (target_value, is_used, expires_at);

-- ==============================================================================
-- 7. TABLE: admin_contacts
-- Admin support configuration used by Contact Admin fallback flow (FR-09)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL,
  support_email TEXT NOT NULL,
  instructions TEXT DEFAULT 'Please contact your family administrator for membership matching or recovery support.',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_admin_contacts_updated_at
  BEFORE UPDATE ON admin_contacts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

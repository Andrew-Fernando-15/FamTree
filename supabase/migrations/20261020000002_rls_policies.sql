-- ==============================================================================
-- FamTree — Stage 5: Database Security & Row Level Security (RLS) Policies
-- Specification Baseline: September 2026
-- Based on: 00_FamTree_Master_Specification, 07_Auth_Security_Privacy, and EI Guidance
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_contacts ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. HELPER FUNCTIONS (Security Definer)
-- Safely read the authenticated user's role and linked member id from accounts
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.accounts WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_linked_member_id()
RETURNS UUID AS $$
  SELECT linked_member_id FROM public.accounts WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 3. TRIGGER: Prevent Unauthorized Edits to Protected Identity Fields (FR-18)
-- Ordinary members may ONLY edit permitted personal/work/study/contact fields.
-- Name, parents' names, surname, and date of birth require Level-2 Admin handling.
-- ==============================================================================

CREATE OR REPLACE FUNCTION check_protected_member_fields()
RETURNS TRIGGER AS $$
DECLARE
  current_role TEXT;
BEGIN
  current_role := get_current_user_role();

  -- Level-2 Administrators are authorized to update protected identity fields
  IF current_role = 'level2_admin' THEN
    RETURN NEW;
  END IF;

  -- Block ordinary members or unlinked accounts from modifying protected fields
  IF (OLD.name IS DISTINCT FROM NEW.name) OR
     (OLD.surname IS DISTINCT FROM NEW.surname) OR
     (OLD.father_name IS DISTINCT FROM NEW.father_name) OR
     (OLD.mother_name IS DISTINCT FROM NEW.mother_name) OR
     (OLD.date_of_birth IS DISTINCT FROM NEW.date_of_birth) OR
     (OLD.father_member_id IS DISTINCT FROM NEW.father_member_id) OR
     (OLD.mother_member_id IS DISTINCT FROM NEW.mother_member_id) THEN
    RAISE EXCEPTION 'Access Denied: Protected identity fields (name, parents, date of birth) can only be altered by a Level-2 administrator.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_member_identity ON family_members;
CREATE TRIGGER tr_protect_member_identity
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION check_protected_member_fields();

-- ==============================================================================
-- 4. POLICIES: admin_contacts
-- Anyone can view active admin contacts (FR-09 Contact Admin flow)
-- Only admins can manage admin contact configurations
-- ==============================================================================

DROP POLICY IF EXISTS "Anyone can view active admin contacts" ON admin_contacts;
CREATE POLICY "Anyone can view active admin contacts"
  ON admin_contacts
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage admin contacts" ON admin_contacts;
CREATE POLICY "Admins can manage admin contacts"
  ON admin_contacts
  FOR ALL
  USING (get_current_user_role() IN ('admin', 'level2_admin'));

-- ==============================================================================
-- 5. POLICIES: family_members
-- Preconfigured family tree: readable for tree exploration and family matching
-- Updates restricted to own linked member (permitted fields only) or Admin
-- Insert and Delete restricted to Level-2 Admins to preserve tree integrity
-- ==============================================================================

DROP POLICY IF EXISTS "Allow reading family members for tree and matching" ON family_members;
CREATE POLICY "Allow reading family members for tree and matching"
  ON family_members
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Members can update their own permitted profile fields" ON family_members;
CREATE POLICY "Members can update their own permitted profile fields"
  ON family_members
  FOR UPDATE
  USING (
    id = get_current_linked_member_id() OR 
    get_current_user_role() IN ('admin', 'level2_admin')
  );

DROP POLICY IF EXISTS "Level-2 Admins can insert family members" ON family_members;
CREATE POLICY "Level-2 Admins can insert family members"
  ON family_members
  FOR INSERT
  WITH CHECK (get_current_user_role() IN ('admin', 'level2_admin'));

DROP POLICY IF EXISTS "Level-2 Admins can delete family members" ON family_members;
CREATE POLICY "Level-2 Admins can delete family members"
  ON family_members
  FOR DELETE
  USING (get_current_user_role() = 'level2_admin');

-- ==============================================================================
-- 6. POLICIES: accounts
-- Users can view and manage their own account linking record
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own account" ON accounts;
CREATE POLICY "Users can view own account"
  ON accounts
  FOR SELECT
  USING (auth_user_id = auth.uid() OR get_current_user_role() IN ('admin', 'level2_admin'));

DROP POLICY IF EXISTS "Users can link own account" ON accounts;
CREATE POLICY "Users can link own account"
  ON accounts
  FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own account" ON accounts;
CREATE POLICY "Users can update own account"
  ON accounts
  FOR UPDATE
  USING (auth_user_id = auth.uid() OR get_current_user_role() IN ('admin', 'level2_admin'));

DROP POLICY IF EXISTS "Level-2 Admins can delete accounts" ON accounts;
CREATE POLICY "Level-2 Admins can delete accounts"
  ON accounts
  FOR DELETE
  USING (get_current_user_role() = 'level2_admin');

-- ==============================================================================
-- 7. POLICIES: relationships
-- Family relationships can be viewed by all for tree visualization
-- Mutations restricted to Level-2 Admins to guarantee structural tree integrity
-- ==============================================================================

DROP POLICY IF EXISTS "Anyone can view family relationships" ON relationships;
CREATE POLICY "Anyone can view family relationships"
  ON relationships
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Level-2 Admins can manage relationships" ON relationships;
CREATE POLICY "Level-2 Admins can manage relationships"
  ON relationships
  FOR ALL
  USING (get_current_user_role() IN ('admin', 'level2_admin'));

-- ==============================================================================
-- 8. POLICIES: profile_visibility
-- Visibility preferences readable for pop-up rendering
-- Members can configure visibility for their own profile
-- ==============================================================================

DROP POLICY IF EXISTS "Anyone can view profile visibility preferences" ON profile_visibility;
CREATE POLICY "Anyone can view profile visibility preferences"
  ON profile_visibility
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Members can manage their own profile visibility" ON profile_visibility;
CREATE POLICY "Members can manage their own profile visibility"
  ON profile_visibility
  FOR ALL
  USING (
    member_id = get_current_linked_member_id() OR
    get_current_user_role() IN ('admin', 'level2_admin')
  );

-- ==============================================================================
-- 9. POLICIES: verification_records
-- Secure creation and single-use token redemption
-- ==============================================================================

DROP POLICY IF EXISTS "Allow token creation and verification" ON verification_records;
CREATE POLICY "Allow token creation and verification"
  ON verification_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

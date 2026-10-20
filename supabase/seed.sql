-- ==============================================================================
-- FamTree — Stage 4: Sample Seed Lineage
-- Verifies structural integrity of family members and lineage relationships
-- ==============================================================================

-- 1. Insert default admin contact channels
INSERT INTO admin_contacts (id, whatsapp_number, support_email, instructions, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '+1234567890',
  'admin@gmail.com',
  'If your account cannot be matched automatically or your phone/email is inaccessible, reach out to your family admin.',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert sample family members (Generations: Grandparents -> Parents -> Children)
-- Gen 1: Grandparents (Arthur & Beatrice)
INSERT INTO family_members (id, name, father_name, mother_name, surname, date_of_birth, life_status, primary_email, phone, work_status, study_status)
VALUES 
  ('m1000000-0000-0000-0000-000000000001', 'Arthur', 'James', 'Eleanor', 'Fernando', '1945-04-12', 'active', 'arthur@gmail.com', '+15550105', 'Retired', NULL),
  ('m1000000-0000-0000-0000-000000000002', 'Beatrice', 'Henry', 'Margaret', 'Fernando', '1948-09-24', 'active', 'beatrice@gmail.com', '+15550106', 'Retired', NULL)
ON CONFLICT (id) DO NOTHING;

-- Gen 2: Parents (Charles [son of Arthur & Beatrice] & Diana)
INSERT INTO family_members (id, name, father_name, mother_name, surname, father_member_id, mother_member_id, date_of_birth, life_status, primary_email, phone, work_status, study_status)
VALUES 
  ('m2000000-0000-0000-0000-000000000001', 'Charles', 'Arthur', 'Beatrice', 'Fernando', 'm1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000002', '1970-06-15', 'active', 'charles@gmail.com', '+15550100', 'Executive', NULL),
  ('m2000000-0000-0000-0000-000000000002', 'Diana', 'Robert', 'Clara', 'Fernando', NULL, NULL, '1972-11-03', 'active', 'diana@gmail.com', '+15550101', 'Educator', NULL)
ON CONFLICT (id) DO NOTHING;

-- Gen 3: Children of Charles & Diana (Andrew, Aaron, Chloe)
INSERT INTO family_members (id, name, father_name, mother_name, surname, father_member_id, mother_member_id, date_of_birth, life_status, primary_email, phone, work_status, study_status)
VALUES 
  ('m3000000-0000-0000-0000-000000000003', 'Andrew', 'Charles', 'Diana', 'Fernando', 'm2000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000002', '1996-05-18', 'active', 'andrew@gmail.com', '+15550104', 'Product Lead', 'Alumni'),
  ('m3000000-0000-0000-0000-000000000001', 'Aaron', 'Charles', 'Diana', 'Fernando', 'm2000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000002', '1998-08-20', 'active', 'aaron@gmail.com', '+15550102', 'Software Engineer', 'Graduate Studies'),
  ('m3000000-0000-0000-0000-000000000002', 'Chloe', 'Charles', 'Diana', 'Fernando', 'm2000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000002', '2002-03-14', 'active', 'chloe@gmail.com', '+15550103', 'Designer', 'Undergraduate')
ON CONFLICT (id) DO NOTHING;


-- 3. Insert explicit lineage relationships
-- Spouses: Arthur <-> Beatrice
INSERT INTO relationships (source_member_id, target_member_id, relationship_type)
VALUES 
  ('m1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000002', 'spouse'),
  ('m1000000-0000-0000-0000-000000000002', 'm1000000-0000-0000-0000-000000000001', 'spouse')
ON CONFLICT DO NOTHING;

-- Spouses: Charles <-> Diana
INSERT INTO relationships (source_member_id, target_member_id, relationship_type)
VALUES 
  ('m2000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000002', 'spouse'),
  ('m2000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000001', 'spouse')
ON CONFLICT DO NOTHING;

-- Parent-Child: Arthur & Beatrice -> Charles
INSERT INTO relationships (source_member_id, target_member_id, relationship_type)
VALUES 
  ('m1000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000001', 'parent'),
  ('m2000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'child'),
  ('m1000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000001', 'parent'),
  ('m2000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000002', 'child')
ON CONFLICT DO NOTHING;

-- Parent-Child: Charles & Diana -> Andrew, Aaron, Chloe
INSERT INTO relationships (source_member_id, target_member_id, relationship_type)
VALUES 
  ('m2000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000003', 'parent'),
  ('m3000000-0000-0000-0000-000000000003', 'm2000000-0000-0000-0000-000000000001', 'child'),
  ('m2000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000001', 'parent'),
  ('m3000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000001', 'child'),
  ('m2000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000002', 'parent'),
  ('m3000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000001', 'child'),
  ('m2000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000003', 'parent'),
  ('m3000000-0000-0000-0000-000000000003', 'm2000000-0000-0000-0000-000000000002', 'child'),
  ('m2000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000001', 'parent'),
  ('m3000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000002', 'child'),
  ('m2000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000002', 'parent'),
  ('m3000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000002', 'child')
ON CONFLICT DO NOTHING;

-- Siblings: Andrew <-> Aaron, Andrew <-> Chloe, Aaron <-> Chloe
INSERT INTO relationships (source_member_id, target_member_id, relationship_type)
VALUES 
  ('m3000000-0000-0000-0000-000000000003', 'm3000000-0000-0000-0000-000000000001', 'sibling'),
  ('m3000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000003', 'sibling'),
  ('m3000000-0000-0000-0000-000000000003', 'm3000000-0000-0000-0000-000000000002', 'sibling'),
  ('m3000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000003', 'sibling'),
  ('m3000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000002', 'sibling'),
  ('m3000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000001', 'sibling')
ON CONFLICT DO NOTHING;

-- 4. Default profile visibility preferences
INSERT INTO profile_visibility (member_id, show_phone, show_primary_email, show_study_status, show_work_status)
VALUES 
  ('m3000000-0000-0000-0000-000000000003', true, true, true, true),
  ('m3000000-0000-0000-0000-000000000001', true, true, true, true),
  ('m3000000-0000-0000-0000-000000000002', false, true, true, false),
  ('m2000000-0000-0000-0000-000000000001', true, true, false, true),
  ('m2000000-0000-0000-0000-000000000002', true, true, false, true),
  ('m1000000-0000-0000-0000-000000000001', true, true, false, true),
  ('m1000000-0000-0000-0000-000000000002', true, true, false, true)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- FamTree — Stage 8 Fix: Ensure unauthenticated anon role can insert & verify OTPs
-- ==============================================================================

-- 1. Ensure RLS is enabled
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

-- 2. Drop any conflicting older policies
DROP POLICY IF EXISTS "Allow token creation and verification" ON verification_records;
DROP POLICY IF EXISTS "Allow anon insert verification" ON verification_records;
DROP POLICY IF EXISTS "Allow anon select verification" ON verification_records;
DROP POLICY IF EXISTS "Allow anon update verification" ON verification_records;

-- 3. Explicit policies for anon (unauthenticated visitors during registration) and authenticated
CREATE POLICY "Allow anon insert verification"
  ON verification_records
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon select verification"
  ON verification_records
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon update verification"
  ON verification_records
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Grant table privileges to anon and authenticated roles
GRANT ALL ON TABLE verification_records TO anon, authenticated;

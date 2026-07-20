-- Drop FK constraint on profiles that references auth.users
-- auth API users don't appear in auth.users table (GoTrue bypasses it)
-- so the FK was preventing profile creation for legit auth sessions
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Backfill profiles for all existing auth users who don't have one
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  CASE 
    WHEN email = 'admin@quickcashcredit.com' THEN 'admin' 
    ELSE 'merchant' 
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = CASE WHEN profiles.role = 'admin' THEN 'admin' ELSE EXCLUDED.role END;

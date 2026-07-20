CREATE OR REPLACE FUNCTION register_user(
  p_id uuid,
  p_email text,
  p_full_name text,
  p_role text DEFAULT 'merchant'
) RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (p_id, p_email, p_full_name, p_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = CASE WHEN profiles.role = 'admin' THEN 'admin' ELSE EXCLUDED.role END;
END;
$$;

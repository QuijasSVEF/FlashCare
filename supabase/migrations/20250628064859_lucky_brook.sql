-- Fix user role assignment in handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'family')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', users.role);
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Update existing users who might have wrong roles
-- This will help fix any existing caregiver accounts that were assigned 'family' role
UPDATE users 
SET role = 'caregiver' 
WHERE id IN (
  SELECT u.id 
  FROM users u 
  JOIN auth.users au ON u.id = au.id 
  WHERE au.raw_user_meta_data->>'role' = 'caregiver' 
  AND u.role = 'family'
);
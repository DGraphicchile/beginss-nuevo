-- Add profession field to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profession'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profession text;
  END IF;
END $$;

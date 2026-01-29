-- Create user_connections table to store connections between users
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  connected_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Add phone_number field to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_connections
-- Users can read their own connections
CREATE POLICY "Users can view their own connections"
  ON user_connections
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Users can create connections where they are the user_id
CREATE POLICY "Users can create their own connections"
  ON user_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

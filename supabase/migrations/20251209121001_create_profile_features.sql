/*
  # Create Profile Features Schema

  1. New Tables
    - `user_gallery`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `image_url` (text)
      - `caption` (text, optional)
      - `created_at` (timestamptz)
    
    - `daily_quotes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `quote_text` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activity_type` (text: cafecito, trueque, servicio, propuesta, espacio)
      - `activity_id` (text)
      - `title` (text)
      - `description` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_gallery table
CREATE TABLE IF NOT EXISTS user_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  image_url text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gallery"
  ON user_gallery FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own gallery"
  ON user_gallery FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own gallery"
  ON user_gallery FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create daily_quotes table
CREATE TABLE IF NOT EXISTS daily_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  quote_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote"
  ON daily_quotes FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own quote"
  ON daily_quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own quote"
  ON daily_quotes FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  activity_type text NOT NULL,
  activity_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own activities"
  ON user_activities FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_gallery_user_id ON user_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_user_id ON daily_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);

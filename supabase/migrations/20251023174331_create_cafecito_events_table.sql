/*
  # Create cafecito_events table for virtual and presencial events

  1. New Tables
    - `cafecito_events`
      - `id` (uuid, primary key)
      - `title` (text, event title)
      - `description` (text, event description)
      - `type` (text, 'virtual' or 'presencial')
      - `event_date` (date, when the event happens)
      - `event_time` (time, what time the event starts)
      - `location` (text, nullable, for presencial events)
      - `host_id` (uuid, foreign key to profiles)
      - `participants_count` (integer, current number of participants)
      - `max_participants` (integer, maximum allowed participants)
      - `image_url` (text, event cover image)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `cafecito_events` table
    - Add policy for authenticated users to read all events
    - Add policy for authenticated users to create events
    - Add policy for users to update their own events
    - Add policy for users to delete their own events
*/

CREATE TABLE IF NOT EXISTS cafecito_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('virtual', 'presencial')),
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text,
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participants_count integer DEFAULT 0,
  max_participants integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cafecito_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cafecito events"
  ON cafecito_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create cafecito events"
  ON cafecito_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own cafecito events"
  ON cafecito_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can delete their own cafecito events"
  ON cafecito_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

CREATE INDEX IF NOT EXISTS idx_cafecito_events_type ON cafecito_events(type);
CREATE INDEX IF NOT EXISTS idx_cafecito_events_date ON cafecito_events(event_date);
CREATE INDEX IF NOT EXISTS idx_cafecito_events_host ON cafecito_events(host_id);

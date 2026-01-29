/*
  # Update cafecito_events table to include host info directly

  1. Changes
    - Add host_name column
    - Add host_avatar_url column
    - Add host_bio column
    - Make host_id nullable since we may not have real auth users
    - Remove foreign key constraint on host_id

  2. Notes
    - This allows cafecito events to exist without requiring actual authenticated users
    - Host information is stored directly in the event record
*/

ALTER TABLE cafecito_events DROP CONSTRAINT IF EXISTS cafecito_events_host_id_fkey;

ALTER TABLE cafecito_events ALTER COLUMN host_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cafecito_events' AND column_name = 'host_name'
  ) THEN
    ALTER TABLE cafecito_events ADD COLUMN host_name text NOT NULL DEFAULT 'Host Beginss';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cafecito_events' AND column_name = 'host_avatar_url'
  ) THEN
    ALTER TABLE cafecito_events ADD COLUMN host_avatar_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cafecito_events' AND column_name = 'host_bio'
  ) THEN
    ALTER TABLE cafecito_events ADD COLUMN host_bio text;
  END IF;
END $$;

ALTER TABLE cafecito_events ALTER COLUMN host_name DROP DEFAULT;

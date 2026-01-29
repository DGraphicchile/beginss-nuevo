-- 1) user_activities: distinguir "creé yo" vs "me interesó de otros"
ALTER TABLE user_activities
  ADD COLUMN IF NOT EXISTS created_by_me boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN user_activities.created_by_me IS 'true = lo creó el usuario; false = lo guardó/le interesó de otro';

-- 2) Host del cafecito puede ver inscripciones de sus eventos
CREATE POLICY "Hosts can view registrations for their events"
  ON cafecito_event_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cafecito_events e
      WHERE e.id = cafecito_event_registrations.event_id
        AND e.host_id = auth.uid()
    )
  );

-- 3) Tabla: personas que mostraron interés en un listing (marketplace/trueque)
CREATE TABLE IF NOT EXISTS marketplace_listing_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, user_id)
);

ALTER TABLE marketplace_listing_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interest"
  ON marketplace_listing_interest FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Listing owner can view interest for their listings"
  ON marketplace_listing_interest FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings m
      WHERE m.id = marketplace_listing_interest.listing_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add interest"
  ON marketplace_listing_interest FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can remove own interest"
  ON marketplace_listing_interest FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE INDEX IF NOT EXISTS idx_listing_interest_listing ON marketplace_listing_interest(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_interest_user ON marketplace_listing_interest(user_id);

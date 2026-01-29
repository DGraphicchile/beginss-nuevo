-- Tabla de inscripciones a cafecitos (quién se unió a qué evento)
-- Cada fila = un usuario inscrito en un evento; participants_count se actualiza por trigger

CREATE TABLE IF NOT EXISTS cafecito_event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES cafecito_events(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE cafecito_event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON cafecito_event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can register for events"
  ON cafecito_event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own registration"
  ON cafecito_event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE INDEX IF NOT EXISTS idx_cafecito_registrations_event ON cafecito_event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_cafecito_registrations_user ON cafecito_event_registrations(user_id);

-- Función que incrementa participants_count al inscribirse (SECURITY DEFINER para poder actualizar cafecito_events)
CREATE OR REPLACE FUNCTION increment_cafecito_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  evt record;
BEGIN
  SELECT participants_count, max_participants INTO evt FROM cafecito_events WHERE id = NEW.event_id;
  IF evt.participants_count >= evt.max_participants THEN
    RAISE EXCEPTION 'No hay cupos disponibles para este cafecito';
  END IF;
  UPDATE cafecito_events
  SET participants_count = participants_count + 1,
      updated_at = now()
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_cafecito_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE cafecito_events
  SET participants_count = GREATEST(0, participants_count - 1),
      updated_at = now()
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_cafecito_registration_insert ON cafecito_event_registrations;
CREATE TRIGGER trg_cafecito_registration_insert
  AFTER INSERT ON cafecito_event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION increment_cafecito_participants();

DROP TRIGGER IF EXISTS trg_cafecito_registration_delete ON cafecito_event_registrations;
CREATE TRIGGER trg_cafecito_registration_delete
  AFTER DELETE ON cafecito_event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_cafecito_participants();

-- Campo para saber si el usuario completó el onboarding (primera vez)
-- Si es false, se muestra el modal obligatorio para completar datos

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- Usuarios que ya tenían perfil se consideran ya onboarded (no verán el modal)
UPDATE profiles SET onboarding_completed = true;

-- Los nuevos usuarios creados después de esta migración tendrán false por defecto

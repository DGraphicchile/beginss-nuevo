/*
  # Datos mock para pruebas

  Rellena perfiles existentes, crea cafecitos, listings (marketplace/trueque),
  user_activities (mis publicaciones + me interesó), intereses e inscripciones.
  Usa imágenes temáticas (Pexels/Unsplash).

  Requisito: que exista al menos un perfil en `profiles` (p. ej. de un usuario
  que ya se registró). Si no hay perfiles, solo se insertan cafecitos sin host_id.
*/

DO $$
DECLARE
  p1 uuid; p2 uuid; p3 uuid; p4 uuid; p5 uuid;
  ev1 uuid; ev2 uuid; ev3 uuid; ev4 uuid; ev5 uuid;
  li1 uuid; li2 uuid; li3 uuid; li4 uuid; li5 uuid; li6 uuid; li7 uuid;
BEGIN
  -- Obtener hasta 5 perfiles existentes
  SELECT id INTO p1 FROM profiles ORDER BY created_at LIMIT 1 OFFSET 0;
  SELECT id INTO p2 FROM profiles ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO p3 FROM profiles ORDER BY created_at LIMIT 1 OFFSET 2;
  SELECT id INTO p4 FROM profiles ORDER BY created_at LIMIT 1 OFFSET 3;
  SELECT id INTO p5 FROM profiles ORDER BY created_at LIMIT 1 OFFSET 4;

  -- Actualizar perfiles: profession y onboarding_completed
  UPDATE profiles SET profession = 'Emprendedora / Cosmética natural', onboarding_completed = true WHERE id = p1 AND (profession IS NULL OR profession = '');
  UPDATE profiles SET profession = 'Artista ceramista', onboarding_completed = true WHERE id = p2 AND (profession IS NULL OR profession = '');
  UPDATE profiles SET profession = 'Artesana textil', onboarding_completed = true WHERE id = p3 AND (profession IS NULL OR profession = '');
  UPDATE profiles SET profession = 'Coach de vida', onboarding_completed = true WHERE id = p4 AND (profession IS NULL OR profession = '');
  UPDATE profiles SET profession = 'Artista del macramé', onboarding_completed = true WHERE id = p5 AND (profession IS NULL OR profession = '');

  -- Cafecitos con host_id (solo si hay perfiles)
  IF p1 IS NOT NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_id, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    SELECT
      'Cafecito: Emprendimiento con sentido',
      'Conversemos sobre economía colaborativa y emprendimiento femenino. [Categoría: Economía y Trabajo Colaborativo]',
      'virtual', (CURRENT_DATE + interval '7 days'), '18:00:00',
      p1, COALESCE(pr.full_name, 'Anfitriona'), pr.avatar_url, LEFT(COALESCE(pr.bio, ''), 120), 0, 15,
      'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600'
    FROM profiles pr WHERE pr.id = p1
    RETURNING id INTO ev1;
  END IF;

  IF p2 IS NOT NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_id, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    SELECT
      'Cafecito: Bienestar y autocuidado',
      'Espacio para compartir prácticas de bienestar. [Categoría: Bienestar y Armonía Emocional]',
      'virtual', (CURRENT_DATE + interval '10 days'), '19:00:00',
      p2, COALESCE(pr.full_name, 'Anfitriona'), pr.avatar_url, LEFT(COALESCE(pr.bio, ''), 120), 0, 20,
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'
    FROM profiles pr WHERE pr.id = p2
    RETURNING id INTO ev2;
  END IF;

  IF p3 IS NOT NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_id, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    SELECT
      'Cafecito en el parque',
      'Encuentro presencial para conocernos. [Categoría: Medio Ambiente, Sostenibilidad en Acción]',
      'presencial', (CURRENT_DATE + interval '5 days'), '16:00:00',
      p3, COALESCE(pr.full_name, 'Anfitriona'), pr.avatar_url, LEFT(COALESCE(pr.bio, ''), 120), 0, 12,
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
    FROM profiles pr WHERE pr.id = p3
    RETURNING id INTO ev3;
  END IF;

  IF p4 IS NOT NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_id, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    SELECT
      'Cafecito: Arte con sentido',
      'Compartamos proyectos artísticos y creatividad. [Categoría: Arte con Sentido]',
      'virtual', (CURRENT_DATE + interval '14 days'), '20:00:00',
      p4, COALESCE(pr.full_name, 'Anfitriona'), pr.avatar_url, LEFT(COALESCE(pr.bio, ''), 120), 0, 18,
      'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600'
    FROM profiles pr WHERE pr.id = p4
    RETURNING id INTO ev4;
  END IF;

  IF p5 IS NOT NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_id, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    SELECT
      'Cafecito: Consumo consciente',
      'Hablemos de consumo con sentido y sostenibilidad. [Categoría: Consumo con Sentido, Sostenibilidad en Acción]',
      'presencial', (CURRENT_DATE + interval '12 days'), '11:00:00',
      p5, COALESCE(pr.full_name, 'Anfitriona'), pr.avatar_url, LEFT(COALESCE(pr.bio, ''), 120), 0, 10,
      'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=600'
    FROM profiles pr WHERE pr.id = p5
    RETURNING id INTO ev5;
  END IF;

  -- Marketplace y trueque (productos y servicios con imágenes)
  IF p1 IS NOT NULL THEN
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p1, 'Set de cosmética natural', 'Kit cuidado facial con ingredientes naturales: sérum, crema y jabón artesanal.', 'product', 'sale', 'Bienestar y Armonía Emocional', 45000, null, ARRAY['https://images.pexels.com/photos/5617511/pexels-photo-5617511.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá', ARRAY['orgánico','natural','skincare'], 'active')
    RETURNING id INTO li1;
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p1, 'Velas aromáticas de soya', 'Velas con aceites esenciales: lavanda, eucalipto, rosa.', 'product', 'barter', 'Sostenibilidad en Acción, Consumo con Sentido', null, null, ARRAY['https://images.pexels.com/photos/1350067/pexels-photo-1350067.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá', ARRAY['velas','aromaterapia'], 'active')
    RETURNING id INTO li2;
  END IF;

  IF p2 IS NOT NULL THEN
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p2, 'Taller online de cerámica', 'Aprende a crear piezas de cerámica. 4 sesiones en vivo.', 'workshop', 'sale', 'Arte con Sentido', 120000, null, ARRAY['https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Medellín', ARRAY['arte','cerámica','taller'], 'active')
    RETURNING id INTO li3;
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p2, 'Tazas de cerámica a mano', 'Tazas únicas hechas a mano. Intercambio por materiales o tiempo.', 'product', 'barter', 'Arte con Sentido, Economía y Trabajo Colaborativo', null, 15, ARRAY['https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Medellín', ARRAY['cerámica','trueque'], 'active')
    RETURNING id INTO li4;
  END IF;

  IF p3 IS NOT NULL THEN
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p3, 'Bolsos tejidos a mano', 'Bolsos artesanales con fibras naturales. Cada pieza única.', 'product', 'barter', 'Sostenibilidad en Acción, Arte con Sentido', null, 20, ARRAY['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cali', ARRAY['artesanal','reciclado','moda'], 'active')
    RETURNING id INTO li5;
  END IF;

  IF p4 IS NOT NULL THEN
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p4, 'Sesión de coaching personal', 'Sesión 1:1 de 90 min para metas personales y profesionales.', 'service', 'sale', 'Bienestar y Armonía Emocional, Economía y Trabajo Colaborativo', 80000, null, ARRAY['https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá', ARRAY['coaching','bienestar'], 'active')
    RETURNING id INTO li6;
  END IF;

  IF p5 IS NOT NULL THEN
    INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, time_points, images, location, tags, status)
    VALUES (p5, 'Macramé para decoración', 'Tapices, porta macetas y cortinas hechas a mano.', 'product', 'barter', 'Arte con Sentido, Consumo con Sentido', null, 10, ARRAY['https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cartagena', ARRAY['macramé','decoración'], 'active')
    RETURNING id INTO li7;
  END IF;

  -- user_activities: "mis publicaciones" (created_by_me true) y "me interesó" (created_by_me false)
  -- Requiere que la columna created_by_me exista (migración 20250128000000).
  IF p1 IS NOT NULL AND ev1 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'cafecito', ev1::text, 'Cafecito: Emprendimiento con sentido', 'Cafecito virtual', true);
  END IF;
  IF p1 IS NOT NULL AND li1 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'marketplace', li1::text, 'Set de cosmética natural', 'Producto a la venta', true);
  END IF;
  IF p1 IS NOT NULL AND li2 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'trueque', li2::text, 'Velas aromáticas de soya', 'Trueque', true);
  END IF;

  IF p2 IS NOT NULL AND ev2 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'cafecito', ev2::text, 'Cafecito: Bienestar y autocuidado', 'Cafecito virtual', true);
  END IF;
  IF p2 IS NOT NULL AND li3 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'marketplace', li3::text, 'Taller online de cerámica', 'Workshop', true);
  END IF;
  IF p2 IS NOT NULL AND li4 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'trueque', li4::text, 'Tazas de cerámica a mano', 'Trueque', true);
  END IF;

  IF p3 IS NOT NULL AND ev3 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p3::text, 'cafecito', ev3::text, 'Cafecito en el parque', 'Cafecito presencial', true);
  END IF;
  IF p3 IS NOT NULL AND li5 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p3::text, 'trueque', li5::text, 'Bolsos tejidos a mano', 'Trueque', true);
  END IF;

  IF p4 IS NOT NULL AND ev4 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p4::text, 'cafecito', ev4::text, 'Cafecito: Arte con sentido', 'Cafecito virtual', true);
  END IF;
  IF p4 IS NOT NULL AND li6 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p4::text, 'marketplace', li6::text, 'Sesión de coaching personal', 'Servicio', true);
  END IF;

  IF p5 IS NOT NULL AND ev5 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p5::text, 'cafecito', ev5::text, 'Cafecito: Consumo consciente', 'Cafecito presencial', true);
  END IF;
  IF p5 IS NOT NULL AND li7 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p5::text, 'trueque', li7::text, 'Macramé para decoración', 'Trueque', true);
  END IF;

  -- "Me interesó": que p1 tenga como interés eventos/listings de otros
  IF p1 IS NOT NULL AND ev2 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'cafecito', ev2::text, 'Cafecito: Bienestar y autocuidado', 'Me interesó', false);
  END IF;
  IF p1 IS NOT NULL AND ev3 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'cafecito', ev3::text, 'Cafecito en el parque', 'Me interesó', false);
  END IF;
  IF p1 IS NOT NULL AND li5 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'trueque', li5::text, 'Bolsos tejidos a mano', 'Me interesó', false);
  END IF;
  IF p1 IS NOT NULL AND li6 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p1::text, 'marketplace', li6::text, 'Sesión de coaching personal', 'Me interesó', false);
  END IF;

  IF p2 IS NOT NULL AND ev1 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'cafecito', ev1::text, 'Cafecito: Emprendimiento con sentido', 'Me interesó', false);
  END IF;
  IF p2 IS NOT NULL AND li1 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'marketplace', li1::text, 'Set de cosmética natural', 'Me interesó', false);
  END IF;
  IF p2 IS NOT NULL AND li7 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p2::text, 'trueque', li7::text, 'Macramé para decoración', 'Me interesó', false);
  END IF;

  IF p3 IS NOT NULL AND ev4 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p3::text, 'cafecito', ev4::text, 'Cafecito: Arte con sentido', 'Me interesó', false);
  END IF;
  IF p3 IS NOT NULL AND li3 IS NOT NULL THEN
    INSERT INTO user_activities (user_id, activity_type, activity_id, title, description, created_by_me)
    VALUES (p3::text, 'marketplace', li3::text, 'Taller online de cerámica', 'Me interesó', false);
  END IF;

  -- marketplace_listing_interest: personas que mostraron interés en listings
  IF p2 IS NOT NULL AND li1 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li1, p2::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;
  IF p3 IS NOT NULL AND li1 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li1, p3::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;
  IF p1 IS NOT NULL AND li5 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li5, p1::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;
  IF p4 IS NOT NULL AND li5 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li5, p4::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;
  IF p1 IS NOT NULL AND li6 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li6, p1::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;
  IF p2 IS NOT NULL AND li7 IS NOT NULL THEN
    INSERT INTO marketplace_listing_interest (listing_id, user_id) VALUES (li7, p2::text) ON CONFLICT (listing_id, user_id) DO NOTHING;
  END IF;

  -- cafecito_event_registrations: inscripciones a cafecitos (el trigger actualiza participants_count)
  IF p2 IS NOT NULL AND ev1 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev1, p2::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;
  IF p3 IS NOT NULL AND ev1 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev1, p3::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;
  IF p1 IS NOT NULL AND ev2 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev2, p1::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;
  IF p4 IS NOT NULL AND ev2 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev2, p4::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;
  IF p1 IS NOT NULL AND ev3 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev3, p1::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;
  IF p2 IS NOT NULL AND ev3 IS NOT NULL THEN
    INSERT INTO cafecito_event_registrations (event_id, user_id) VALUES (ev3, p2::text) ON CONFLICT (event_id, user_id) DO NOTHING;
  END IF;

  -- Cafecitos sin host (si no hay perfiles, al menos hay eventos para la sección Eventos)
  IF p1 IS NULL THEN
    INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
    VALUES
      ('Cafecito: Emprendimiento Femenino', 'Conversemos sobre retos y alegrías de emprender. [Categoría: Economía y Trabajo Colaborativo]', 'virtual', (CURRENT_DATE + interval '7 days'), '18:00:00', 'María González', 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100', 'Emprendedora y coach', 0, 15, 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600'),
      ('Cafecito en el Parque', 'Encuentro presencial para conocernos. [Categoría: Medio Ambiente]', 'presencial', (CURRENT_DATE + interval '5 days'), '16:00:00', 'Laura Pérez', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100', 'Amante del café', 0, 10, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

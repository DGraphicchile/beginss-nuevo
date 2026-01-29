/*
  # Eliminar usuarios específicos: Odin, Darcy Rivas, Darcy Rivas Ugalde, Kata Brown

  Borra solo estos perfiles y sus datos (por coincidencia de full_name).
  Se mantienen el resto de usuarios (p. ej. Soko Guzmán).

  Coincidencias por nombre (case-insensitive):
  - Odin
  - Darcy Rivas / Darcy Rivas Ugalde
  - Kata Brown
*/

DO $$
DECLARE
  ids_to_remove uuid[] := ARRAY[]::uuid[];
  id_val uuid;
BEGIN
  -- Obtener ids de perfiles a eliminar (Odin, Darcy Rivas, Darcy Rivas Ugalde, Kata Brown)
  SELECT ARRAY_AGG(id) INTO ids_to_remove
  FROM profiles
  WHERE full_name ILIKE '%odin%'
     OR full_name ILIKE '%darcy%rivas%'
     OR full_name ILIKE '%kata%brown%';

  IF ids_to_remove IS NULL OR array_length(ids_to_remove, 1) IS NULL THEN
    RAISE NOTICE 'No se encontraron perfiles para eliminar (Odin, Darcy Rivas, Kata Brown).';
    RETURN;
  END IF;

  -- Eliminar datos que referencian a estos usuarios (orden: hijas primero)

  -- marketplace_listing_interest (user_id es text)
  DELETE FROM marketplace_listing_interest WHERE user_id = ANY(ARRAY(SELECT id::text FROM unnest(ids_to_remove) AS id));

  -- cafecito_event_registrations (user_id es text)
  DELETE FROM cafecito_event_registrations WHERE user_id = ANY(ARRAY(SELECT id::text FROM unnest(ids_to_remove) AS id));

  -- reviews (reviewer o reviewed)
  DELETE FROM reviews WHERE reviewer_id = ANY(ids_to_remove) OR reviewed_user_id = ANY(ids_to_remove);

  -- transactions
  DELETE FROM transactions WHERE from_user_id = ANY(ids_to_remove) OR to_user_id = ANY(ids_to_remove);

  -- event_registrations
  DELETE FROM event_registrations WHERE user_id = ANY(ids_to_remove);

  -- cafecito_comments
  DELETE FROM cafecito_comments WHERE author_id = ANY(ids_to_remove);

  -- cafecito_likes
  DELETE FROM cafecito_likes WHERE user_id = ANY(ids_to_remove);

  -- cafecito_posts
  DELETE FROM cafecito_posts WHERE author_id = ANY(ids_to_remove);

  -- events (organizer)
  DELETE FROM events WHERE organizer_id = ANY(ids_to_remove);

  -- marketplace_listings (de estos usuarios; cascade quita marketplace_listing_interest de esos listings)
  DELETE FROM marketplace_listings WHERE user_id = ANY(ids_to_remove);

  -- cafecito_events cuyo host es uno de los a eliminar
  DELETE FROM cafecito_events WHERE host_id = ANY(ids_to_remove);

  -- user_activities (user_id es text)
  DELETE FROM user_activities WHERE user_id = ANY(ARRAY(SELECT id::text FROM unnest(ids_to_remove) AS id));

  -- user_connections (donde interviene alguno de estos usuarios)
  DELETE FROM user_connections WHERE user_id = ANY(ids_to_remove) OR connected_user_id = ANY(ids_to_remove);

  -- user_gallery (user_id es text)
  DELETE FROM user_gallery WHERE user_id = ANY(ARRAY(SELECT id::text FROM unnest(ids_to_remove) AS id));

  -- daily_quotes (user_id es text)
  DELETE FROM daily_quotes WHERE user_id = ANY(ARRAY(SELECT id::text FROM unnest(ids_to_remove) AS id));

  -- profiles
  DELETE FROM profiles WHERE id = ANY(ids_to_remove);

  -- auth.users
  DELETE FROM auth.users WHERE id = ANY(ids_to_remove);

  RAISE NOTICE 'Usuarios eliminados: % perfiles (Odin, Darcy Rivas, Darcy Rivas Ugalde, Kata Brown).', array_length(ids_to_remove, 1);
END $$;

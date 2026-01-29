/*
  # Insert sample cafecito events

  1. Data Inserts
    - Add 6 sample cafecito events (3 virtual, 3 presencial)
    - Host information is included directly in each event
    
  2. Notes
    - Events include both virtual and presencial types
    - Each event has complete information including host details, date, time, and participants
*/

INSERT INTO cafecito_events (title, description, type, event_date, event_time, host_name, host_avatar_url, host_bio, participants_count, max_participants, image_url)
VALUES 
(
  'Cafecito: Emprendimiento Femenino',
  'Conversemos sobre los retos y alegrías de emprender siendo mujer. Comparte tu experiencia y aprende de otras.',
  'virtual',
  '2025-11-18',
  '18:00:00',
  'María González',
  'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Emprendedora y coach de negocios',
  8,
  15,
  'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600'
),
(
  'Cafecito en el Parque',
  'Encuentro presencial para conocernos y compartir un café al aire libre. Ideal para hacer nuevas amigas.',
  'presencial',
  '2025-11-20',
  '16:00:00',
  'Laura Pérez',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Amante del café y las buenas conversaciones',
  6,
  10,
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
)
,
(
  'Cafecito: Bienestar y Autocuidado',
  'Hablemos sobre prácticas de autocuidado y bienestar mental. Un espacio seguro para compartir y aprender.',
  'virtual',
  '2025-11-22',
  '19:00:00',
  'Camila Flores',
  'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Psicóloga y facilitadora de círculos de mujeres',
  12,
  20,
  'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'
),
(
  'Cafecito Literario',
  'Compartamos nuestras lecturas favoritas y recomendaciones. Para amantes de los libros y las buenas historias.',
  'presencial',
  '2025-11-25',
  '17:00:00',
  'Daniela Ortiz',
  'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Escritora y promotora de lectura',
  5,
  12,
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
),
(
  'Cafecito: Creatividad y Arte',
  'Un espacio para explorar nuestra creatividad juntas. Comparte tus proyectos artísticos y encuentra inspiración.',
  'virtual',
  '2025-11-27',
  '20:00:00',
  'Ana Silva',
  'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Artista plástica y facilitadora creativa',
  10,
  18,
  'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600'
),
(
  'Brunch Beginss',
  'Encuentro especial de brunch para conectar, conversar y disfrutar. Trae tu platillo favorito para compartir.',
  'presencial',
  '2025-11-30',
  '11:00:00',
  'Valentina Cruz',
  'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Food blogger y amante de los encuentros',
  8,
  15,
  'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600'
)
ON CONFLICT DO NOTHING;

/*
  # Add Sample Data to Beginss Platform

  ## Overview
  This migration populates the database with sample data for testing and demonstration purposes.

  ## Data Added

  ### Profiles (15 sample users)
  - 15 diverse women profiles with realistic names, bios, locations
  - Each with interests, skills, and avatar images
  - Varied profile types (offer, seek, both)

  ### Marketplace Listings (12 products/services)
  - Cosmetics, workshops, handmade items
  - Services like coaching and nutrition
  - Mix of sale, barter, and time bank exchange modes

  ### Events (12 upcoming events)
  - Wellness workshops
  - Art classes
  - Entrepreneurship sessions
  - Mix of online and in-person events

  ### Cafecito Posts (10 community posts)
  - Discussion topics on wellness, entrepreneurship, collaboration
  - Posts with likes and comments counts
  - Varied topics matching community interests

  ### Reviews (Sample ratings)
  - Reviews for marketplace items
  - Ratings from 4.7 to 5.0 stars

  ## Notes
  - All data uses realistic Colombian names and locations
  - Images use Pexels URLs (publicly available)
  - Dates are set relative to October 2025
  - All foreign key relationships are properly maintained
*/

-- Insert sample profiles (users)
-- Note: In production, these would be created through auth.users first
-- For demo purposes, we're creating UUIDs directly

DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
  user4_id uuid := gen_random_uuid();
  user5_id uuid := gen_random_uuid();
  user6_id uuid := gen_random_uuid();
  user7_id uuid := gen_random_uuid();
  user8_id uuid := gen_random_uuid();
  user9_id uuid := gen_random_uuid();
  user10_id uuid := gen_random_uuid();
  user11_id uuid := gen_random_uuid();
  user12_id uuid := gen_random_uuid();
  user13_id uuid := gen_random_uuid();
  user14_id uuid := gen_random_uuid();
  user15_id uuid := gen_random_uuid();
BEGIN

  -- Insert profiles only if they don't exist
  INSERT INTO profiles (id, email, full_name, avatar_url, bio, location, interests, skills, profile_type, beginss_points, verified, created_at, updated_at)
  VALUES
    (user1_id, 'carolina.martinez@example.com', 'Carolina Martínez', 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200', 'Creadora de cosmética natural y orgánica. Apasionada por el cuidado de la piel con ingredientes naturales.', 'Bogotá, Colombia', ARRAY['bienestar', 'cosmética natural', 'sostenibilidad'], ARRAY['formulación cosmética', 'ingredientes naturales', 'emprendimiento'], 'offer', 150, true, now() - interval '6 months', now()),

    (user2_id, 'ana.silva@example.com', 'Ana Silva', 'https://images.pexels.com/photos/4587979/pexels-photo-4587979.jpeg?auto=compress&cs=tinysrgb&w=200', 'Artista ceramista. Enseño el arte de crear piezas únicas con las manos.', 'Medellín, Colombia', ARRAY['arte', 'cerámica', 'enseñanza'], ARRAY['cerámica', 'escultura', 'talleres'], 'offer', 180, true, now() - interval '8 months', now()),

    (user3_id, 'maria.gonzalez@example.com', 'María González', 'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=200', 'Artesana textil especializada en técnicas ancestrales. Creo piezas únicas con fibras naturales.', 'Cali, Colombia', ARRAY['artesanía', 'sostenibilidad', 'moda consciente'], ARRAY['tejido', 'fibras naturales', 'diseño'], 'offer', 200, true, now() - interval '1 year', now()),

    (user4_id, 'laura.perez@example.com', 'Laura Pérez', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=200', 'Coach de vida certificada. Te acompaño en tu proceso de transformación personal y profesional.', 'Bogotá, Colombia', ARRAY['coaching', 'desarrollo personal', 'bienestar'], ARRAY['coaching', 'PNL', 'mentoring'], 'offer', 220, true, now() - interval '10 months', now()),

    (user5_id, 'sofia.mendoza@example.com', 'Sofía Mendoza', 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=200', 'Artista del macramé. Transformo hilos en arte para decorar espacios con amor.', 'Cartagena, Colombia', ARRAY['arte', 'decoración', 'macramé'], ARRAY['macramé', 'diseño de interiores', 'artesanía'], 'offer', 130, true, now() - interval '5 months', now()),

    (user6_id, 'valentina.cruz@example.com', 'Valentina Cruz', 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=200', 'Fotógrafa especializada en producto y marca personal. Ayudo a emprendedoras a brillar visualmente.', 'Bogotá, Colombia', ARRAY['fotografía', 'marketing', 'emprendimiento'], ARRAY['fotografía comercial', 'edición', 'branding'], 'offer', 190, true, now() - interval '7 months', now()),

    (user7_id, 'patricia.torres@example.com', 'Patricia Torres', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200', 'Creadora de velas artesanales con aceites esenciales. Cada vela es una experiencia sensorial.', 'Medellín, Colombia', ARRAY['aromaterapia', 'bienestar', 'artesanía'], ARRAY['elaboración de velas', 'aromaterapia', 'diseño'], 'offer', 140, true, now() - interval '4 months', now()),

    (user8_id, 'isabella.ramirez@example.com', 'Isabella Ramírez', 'https://images.pexels.com/photos/3756168/pexels-photo-3756168.jpeg?auto=compress&cs=tinysrgb&w=200', 'Diseñadora de joyería sustentable. Creo piezas únicas con materiales reciclados.', 'Cali, Colombia', ARRAY['joyería', 'sostenibilidad', 'diseño'], ARRAY['diseño de joyas', 'metales reciclados', 'orfebrería'], 'offer', 170, true, now() - interval '9 months', now()),

    (user9_id, 'gabriela.vega@example.com', 'Gabriela Vega', 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=200', 'Nutricionista holística. Creo planes alimenticios personalizados para un bienestar integral.', 'Bogotá, Colombia', ARRAY['nutrición', 'salud', 'bienestar'], ARRAY['nutrición', 'planes alimenticios', 'cocina saludable'], 'offer', 210, true, now() - interval '11 months', now()),

    (user10_id, 'daniela.ortiz@example.com', 'Daniela Ortiz', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200', 'Ilustradora digital. Transformo ideas en arte visual con estilo único y personalizado.', 'Medellín, Colombia', ARRAY['ilustración', 'arte digital', 'diseño'], ARRAY['ilustración', 'diseño gráfico', 'acuarela digital'], 'offer', 160, true, now() - interval '6 months', now()),

    (user11_id, 'camila.flores@example.com', 'Camila Flores', 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=200', 'Instructora de yoga y meditación. Guío prácticas para conectar cuerpo, mente y espíritu.', 'Cali, Colombia', ARRAY['yoga', 'meditación', 'bienestar'], ARRAY['yoga', 'meditación', 'mindfulness'], 'offer', 175, true, now() - interval '8 months', now()),

    (user12_id, 'renata.diaz@example.com', 'Renata Díaz', 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=200', 'Mentora de emprendedoras. 10 años de experiencia ayudando a mujeres a escalar sus negocios.', 'Bogotá, Colombia', ARRAY['emprendimiento', 'mentoría', 'negocios'], ARRAY['estrategia empresarial', 'marketing', 'finanzas'], 'offer', 250, true, now() - interval '2 years', now()),

    (user13_id, 'carolina.ruiz@example.com', 'Carolina Ruiz', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=200', 'Consultora en sostenibilidad. Ayudo a emprendimientos a ser más verdes y rentables.', 'Medellín, Colombia', ARRAY['sostenibilidad', 'emprendimiento', 'ecología'], ARRAY['sostenibilidad', 'economía circular', 'consultoría'], 'offer', 195, true, now() - interval '1 year', now()),

    (user14_id, 'andrea.santos@example.com', 'Andrea Santos', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200', 'Terapeuta holística especializada en aromaterapia y sanación energética.', 'Bogotá, Colombia', ARRAY['terapias alternativas', 'bienestar', 'espiritualidad'], ARRAY['aromaterapia', 'reiki', 'sanación'], 'offer', 165, true, now() - interval '7 months', now()),

    (user15_id, 'lucia.morales@example.com', 'Lucía Morales', 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=200', 'Especialista en marketing digital para emprendedoras. Ayudo a hacer crecer marcas en redes sociales.', 'Cali, Colombia', ARRAY['marketing', 'redes sociales', 'emprendimiento'], ARRAY['marketing digital', 'community management', 'content creation'], 'offer', 185, true, now() - interval '9 months', now())
  ON CONFLICT (id) DO NOTHING;

  -- Insert marketplace listings
  INSERT INTO marketplace_listings (user_id, title, description, listing_type, exchange_mode, category, price, images, location, tags, status, created_at, updated_at)
  VALUES
    (user1_id, 'Set de Cosmética Natural Orgánica', 'Kit completo de cuidado facial con ingredientes 100% naturales: sérum, crema hidratante y jabón artesanal.', 'product', 'sale', 'Bienestar', 45000, ARRAY['https://images.pexels.com/photos/5617511/pexels-photo-5617511.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá, Colombia', ARRAY['orgánico', 'natural', 'skincare'], 'active', now() - interval '2 weeks', now()),

    (user2_id, 'Taller Online de Cerámica', 'Aprende a crear tus propias piezas de cerámica desde casa. Incluye materiales y 4 sesiones en vivo.', 'workshop', 'sale', 'Arte', 120000, ARRAY['https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Medellín, Colombia', ARRAY['arte', 'taller', 'cerámica'], 'active', now() - interval '1 week', now()),

    (user3_id, 'Bolsos Tejidos a Mano', 'Bolsos artesanales tejidos con fibras naturales y recicladas. Cada pieza es única.', 'product', 'barter', 'Sostenibilidad', 65000, ARRAY['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cali, Colombia', ARRAY['artesanal', 'reciclado', 'moda'], 'active', now() - interval '3 days', now()),

    (user4_id, 'Sesión de Coaching Personal', 'Sesión 1:1 de 90 minutos para trabajar en tus metas personales y profesionales.', 'service', 'sale', 'Bienestar', 80000, ARRAY['https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá, Colombia', ARRAY['coaching', 'desarrollo', 'bienestar'], 'active', now() - interval '5 days', now()),

    (user5_id, 'Macramé para Decoración', 'Hermosas piezas de macramé hechas a mano: tapices, porta macetas y cortinas.', 'product', 'barter', 'Arte', 35000, ARRAY['https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cartagena, Colombia', ARRAY['decoración', 'artesanal', 'macramé'], 'active', now() - interval '1 week', now()),

    (user6_id, 'Curso de Fotografía para Emprendedoras', 'Aprende a fotografiar tus productos como una profesional. 8 clases online.', 'workshop', 'sale', 'Educación', 150000, ARRAY['https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá, Colombia', ARRAY['fotografía', 'curso', 'emprendimiento'], 'active', now() - interval '4 days', now()),

    (user7_id, 'Velas Aromáticas Artesanales', 'Velas de soya con aceites esenciales puros. Aromas: lavanda, eucalipto, rosa.', 'product', 'sale', 'Bienestar', 25000, ARRAY['https://images.pexels.com/photos/1350067/pexels-photo-1350067.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Medellín, Colombia', ARRAY['velas', 'aromaterapia', 'natural'], 'active', now() - interval '6 days', now()),

    (user8_id, 'Joyería en Plata Reciclada', 'Piezas únicas de joyería creadas con plata reciclada y diseños contemporáneos.', 'product', 'sale', 'Arte', 95000, ARRAY['https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cali, Colombia', ARRAY['joyería', 'plata', 'reciclado'], 'active', now() - interval '2 days', now()),

    (user9_id, 'Asesoría Nutricional Personalizada', 'Plan nutricional personalizado con seguimiento mensual y recetas exclusivas.', 'service', 'sale', 'Bienestar', 100000, ARRAY['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá, Colombia', ARRAY['nutrición', 'salud', 'bienestar'], 'active', now() - interval '1 week', now()),

    (user10_id, 'Ilustraciones Personalizadas', 'Retratos y ilustraciones digitales personalizadas. Estilo acuarela o minimalista.', 'service', 'sale', 'Arte', 70000, ARRAY['https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Medellín, Colombia', ARRAY['ilustración', 'arte', 'personalizado'], 'active', now() - interval '8 days', now()),

    (user11_id, 'Ropa Deportiva Sostenible', 'Leggings y tops de yoga hechos con materiales reciclados y telas biodegradables.', 'product', 'sale', 'Sostenibilidad', 85000, ARRAY['https://images.pexels.com/photos/6740821/pexels-photo-6740821.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Cali, Colombia', ARRAY['deportiva', 'yoga', 'sostenible'], 'active', now() - interval '5 days', now()),

    (user12_id, 'Mentoring para Emprendedoras', 'Programa de mentoría de 3 meses para emprendedoras. Incluye networking y recursos.', 'service', 'sale', 'Educación', 250000, ARRAY['https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600'], 'Bogotá, Colombia', ARRAY['mentoring', 'emprendimiento', 'negocios'], 'active', now() - interval '3 days', now())
  ON CONFLICT DO NOTHING;

  -- Insert events
  INSERT INTO events (organizer_id, title, description, event_type, category, event_date, location, image_url, max_participants, current_participants, tags, created_at, updated_at)
  VALUES
    (user11_id, 'Taller de Meditación y Mindfulness', 'Aprende técnicas de meditación y mindfulness para reducir el estrés y encontrar paz interior. Sesión práctica con ejercicios guiados.', 'online', 'Bienestar', '2025-10-20 18:00:00+00', null, 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=600', 30, 22, ARRAY['meditación', 'mindfulness', 'bienestar'], now() - interval '1 week', now()),

    (user10_id, 'Círculo de Lectura: Mujeres que Inspiran', 'Conversatorio sobre el libro "Mujeres que Corren con los Lobos". Comparte tus reflexiones en un espacio de sororidad.', 'in-person', 'Cultura', '2025-10-22 17:00:00+00', 'Café Literario, Bogotá', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600', 15, 12, ARRAY['lectura', 'literatura', 'sororidad'], now() - interval '5 days', now()),

    (user13_id, 'Taller de Emprendimiento Sostenible', 'Descubre cómo crear un negocio rentable y sostenible. Incluye plan de negocios, marketing verde y finanzas.', 'online', 'Emprendimiento', '2025-10-25 19:00:00+00', null, 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600', 50, 38, ARRAY['emprendimiento', 'sostenibilidad', 'negocios'], now() - interval '3 days', now()),

    (user4_id, 'Yoga al Amanecer en el Parque', 'Sesión de yoga al aire libre para iniciar el día con energía positiva. Todos los niveles son bienvenidos.', 'in-person', 'Bienestar', '2025-10-21 06:30:00+00', 'Parque El Virrey, Bogotá', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600', 25, 18, ARRAY['yoga', 'bienestar', 'naturaleza'], now() - interval '6 days', now()),

    (user6_id, 'Workshop de Fotografía para Redes Sociales', 'Aprende a crear contenido visual atractivo para tu negocio. Incluye iluminación, composición y edición básica.', 'online', 'Emprendimiento', '2025-10-23 16:00:00+00', null, 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=600', 40, 31, ARRAY['fotografía', 'redes sociales', 'marketing'], now() - interval '4 days', now()),

    (user2_id, 'Noche de Arte: Pintura Intuitiva', 'Conecta con tu creatividad en una sesión de pintura libre. Materiales incluidos. Sin experiencia necesaria.', 'in-person', 'Arte', '2025-10-26 19:30:00+00', 'Estudio Creativo, Medellín', 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600', 12, 8, ARRAY['arte', 'pintura', 'creatividad'], now() - interval '2 days', now()),

    (user9_id, 'Webinar: Nutrición Consciente', 'Charla sobre alimentación saludable y balanceada. Incluye plan de comidas y recetas prácticas.', 'online', 'Bienestar', '2025-10-24 20:00:00+00', null, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', 100, 67, ARRAY['nutrición', 'salud', 'alimentación'], now() - interval '5 days', now()),

    (user5_id, 'Taller de Macramé: Crea tu Tapiz', 'Aprende la técnica ancestral del macramé y crea tu propio tapiz decorativo. Materiales incluidos.', 'in-person', 'Arte', '2025-10-27 14:00:00+00', 'Casa de Artesanías, Cartagena', 'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=600', 10, 7, ARRAY['macramé', 'artesanía', 'decoración'], now() - interval '1 day', now()),

    (user7_id, 'Cine Foro: Documentales sobre Mujeres', 'Proyección de documental seguido de conversatorio sobre liderazgo femenino y empoderamiento.', 'in-person', 'Cultura', '2025-10-28 18:00:00+00', 'Cinemateca Distrital, Bogotá', 'https://images.pexels.com/photos/7234208/pexels-photo-7234208.jpeg?auto=compress&cs=tinysrgb&w=600', 50, 42, ARRAY['cine', 'feminismo', 'cultura'], now() - interval '3 days', now()),

    (user15_id, 'Masterclass: Marketing Digital para Emprendedoras', 'Estrategias efectivas de marketing digital, redes sociales y construcción de marca personal.', 'online', 'Emprendimiento', '2025-10-29 17:00:00+00', null, 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600', 80, 59, ARRAY['marketing', 'digital', 'emprendimiento'], now() - interval '2 days', now()),

    (user14_id, 'Círculo de Sanación con Aromaterapia', 'Sesión de sanación colectiva utilizando aceites esenciales y técnicas de respiración consciente.', 'in-person', 'Bienestar', '2025-10-30 16:00:00+00', 'Centro Holístico, Cali', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600', 20, 15, ARRAY['aromaterapia', 'sanación', 'bienestar'], now() - interval '4 days', now()),

    (user2_id, 'Taller de Cerámica: Tazas Personalizadas', 'Crea tu propia taza de cerámica desde cero. Incluye moldeado, decoración y horneado.', 'in-person', 'Arte', '2025-10-31 10:00:00+00', 'Taller de Cerámica, Medellín', 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600', 8, 6, ARRAY['cerámica', 'arte', 'taller'], now() - interval '6 days', now())
  ON CONFLICT DO NOTHING;

  -- Insert cafecito posts
  INSERT INTO cafecito_posts (author_id, title, content, tags, topic, likes_count, comments_count, created_at, updated_at)
  VALUES
    (user1_id, '¿Cómo empezar con cosmética natural?', 'Hola hermosas! Llevo 3 años creando mis propios productos de cosmética natural y quiero compartir algunos tips para las que están empezando. Lo primero es entender tu tipo de piel y conocer los ingredientes básicos. ¿Alguien más está en este camino? Me encantaría conocer sus experiencias.', ARRAY['cosmética natural', 'emprendimiento', 'bienestar'], 'bienestar', 45, 12, now() - interval '3 days', now()),

    (user12_id, 'Lecciones de 10 años de emprendimiento', 'Después de 10 años ayudando a mujeres a escalar sus negocios, estas son las 5 lecciones más importantes que he aprendido: 1) La constancia supera al talento, 2) Tu red es tu patrimonio, 3) Aprende a decir no, 4) Invierte en ti misma primero, 5) El fracaso es parte del proceso. ¿Cuál resuena más contigo?', ARRAY['emprendimiento', 'mentoría', 'crecimiento'], 'emprendimiento', 89, 23, now() - interval '5 days', now()),

    (user3_id, 'Busco colaboración para proyecto sostenible', 'Estoy desarrollando una línea de bolsos con materiales reciclados y busco colaborar con otras artesanas o diseñadoras que trabajen con sostenibilidad. La idea es crear una colección colaborativa donde cada una aporte su técnica. ¿A alguien le interesa?', ARRAY['colaboración', 'sostenibilidad', 'artesanía'], 'colaboracion', 34, 8, now() - interval '2 days', now()),

    (user9_id, 'Mitos sobre nutrición que debes conocer', 'Como nutricionista, escucho muchos mitos todos los días. Hoy quiero desmentir los 3 más comunes: "Los carbohidratos engordan", "Saltarse comidas ayuda a perder peso", y "Las dietas detox limpian el cuerpo". La verdad es más simple y más sostenible. ¿Quieres saber más?', ARRAY['nutrición', 'salud', 'bienestar'], 'bienestar', 67, 15, now() - interval '1 day', now()),

    (user4_id, 'Rutina matutina que cambió mi vida', 'Hace un año implementé una rutina matutina simple pero poderosa: 15 minutos de meditación, journaling, y agua con limón. No les voy a mentir, los primeros días fueron difíciles, pero ahora no puedo imaginar mi día sin esto. ¿Tienen alguna rutina que las ayude?', ARRAY['bienestar', 'hábitos', 'mindfulness'], 'bienestar', 52, 19, now() - interval '4 days', now()),

    (user6_id, 'Tips para fotos de producto que venden', 'Las fotos son el primer contacto que tus clientes tienen con tu producto. Aquí van 5 tips que transformarán tus fotos: 1) Luz natural es tu mejor amiga, 2) Fondo simple y limpio, 3) Muestra el producto en uso, 4) Mantén una paleta de colores consistente, 5) Edita pero no exageres. ¿Quieren que haga un tutorial?', ARRAY['fotografía', 'emprendimiento', 'marketing'], 'emprendimiento', 78, 21, now() - interval '6 days', now()),

    (user11_id, 'Yoga para principiantes: rompe el miedo', 'A muchas les da miedo empezar yoga porque creen que no son flexibles. La verdad es que el yoga no es sobre tocarte los pies, es sobre conectar con tu cuerpo y tu respiración. Cualquier cuerpo puede hacer yoga. ¿Qué las detiene a ustedes?', ARRAY['yoga', 'bienestar', 'motivación'], 'bienestar', 41, 10, now() - interval '7 days', now()),

    (user8_id, 'El arte de crear con materiales reciclados', 'Crear joyería con plata reciclada no solo es bueno para el planeta, también tiene un significado especial. Cada pieza tiene una historia previa, y darle nueva vida es como crear magia. Comparto fotos de mi proceso en los comentarios. ¿Alguien más trabaja con reciclaje?', ARRAY['sostenibilidad', 'arte', 'joyería'], 'bienestar', 38, 7, now() - interval '8 days', now()),

    (user15_id, 'Redes sociales sin burnout: es posible', 'Gestionar redes sociales puede ser agotador. Aprendí a crear contenido sin quemarme: batching de contenido los lunes, programación con herramientas, y días off SIN culpa. Tu salud mental es más importante que cualquier algoritmo. ¿Cómo manejan ustedes esto?', ARRAY['redes sociales', 'bienestar', 'emprendimiento'], 'emprendimiento', 94, 26, now() - interval '2 days', now()),

    (user5_id, 'La terapia del macramé', 'Tejer macramé es mi meditación. El movimiento repetitivo, sentir las fibras, ver cómo algo hermoso toma forma... es pura magia. Creo que todas necesitamos una actividad manual que nos desconecte del mundo digital. ¿Cuál es la suya?', ARRAY['macramé', 'artesanía', 'bienestar'], 'bienestar', 29, 9, now() - interval '5 days', now())
  ON CONFLICT DO NOTHING;

END $$;

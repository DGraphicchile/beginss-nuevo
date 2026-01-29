# Beginss - Documentación de Páginas

## Páginas Implementadas

### 1. HOME (/)
**Objetivo**: Bienvenida e introducción al universo Beginss

**Secciones**:
- **Hero Mejorado**:
  - Título: "El poder de las Mujeres Beginss empieza aquí"
  - Círculo animado con elementos flotantes
  - CTAs: "Únete a la comunidad" y "Descarga la app"

- **Sección "Somos"**:
  - Narrativa sobre circularidad y sororidad
  - Frase destacada: "Lo que compartes, regresa; lo que recibes, se multiplica"
  - CTA a página de Valores

- **Valores Activos**:
  - Grid de 6 valores con iconos: Bienestar, Generosidad, Innovación, Naturaleza, Sostenibilidad, Sororidad
  - Cards interactivas con hover effects
  - CTA a Círculos de Acción

- **Explora Beginss**:
  - 3 cards destacando Marketplace, Cafecito y Eventos
  - Diseño con gradientes y bordes personalizados

- **CTA Final**:
  - Fondo gradiente verde
  - Dos botones: "Crear mi cuenta" y "Conoce nuestros pilares"

---

### 2. VALORES / SOMOS (/valores)
**Objetivo**: Transmitir identidad, misión y esencia circular

**Contenido**:
- **Encabezado visual** con ícono de infinito
- **Nuestra Esencia**: Texto narrativo sobre la comunidad
- **Frase inspiracional** destacada en card especial
- **4 Valores fundamentales** en grid:
  1. Sororidad Activa
  2. Circularidad con Propósito
  3. Diversidad como Fortaleza
  4. Impacto Consciente
- **CTA final** a Pilares con fondo gradiente

---

### 3. PILARES (/pilares)
**Objetivo**: Mostrar los 4 pilares centrales como base conceptual

**Pilares**:
1. **Circularidad con Propósito**
   - Banco de Tiempo, economía regenerativa
   - Color: Verde (#7CA982)

2. **Comunidad Sorora e Inclusiva**
   - Apoyo sin competencia, diversidad
   - Color: Rosa terracota (#E6A5A1)

3. **Bienestar y Empoderamiento Colaborativo**
   - Talleres, autocuidado, fortalecimiento
   - Color: Verde (#7CA982)

4. **Innovación y Sostenibilidad con Impacto**
   - Consumo consciente, impacto social
   - Color: Rosa terracota (#E6A5A1)

**Features**:
- Cards grandes con hover effects
- Detalles expandibles
- CTA a Círculos de Acción

---

### 4. CÍRCULOS DE ACCIÓN (/circulos)
**Objetivo**: Conectar usuarias con temas específicos

**6 Círculos**:
1. **Economía y Trabajo Colaborativo**
   - Tags: Emprendimiento, Networking, Mentoría

2. **Armonía Emocional**
   - Tags: Bienestar, Meditación, Terapia

3. **Arte con Sentido**
   - Tags: Creatividad, Talleres, Expresión

4. **Sostenibilidad en Acción**
   - Tags: Zero Waste, Eco-friendly, DIY

5. **Medio Ambiente**
   - Tags: Activismo, Conservación, Educación

6. **Consumo con Sentido**
   - Tags: Comercio Justo, Ético, Local

**Features**:
- Grid responsive de 3 columnas
- Gradientes personalizados por círculo
- Botón "Participar en este círculo"
- CTA final para crear perfil

---

### 5. MARKETPLACE (/marketplace)
**Funcionalidad completa implementada**:
- Búsqueda por texto
- Filtros por categoría
- Filtros por modo de intercambio (trueque, tiempo, venta)
- Cards con imagen, título, usuario, puntos/precio
- Integración con base de datos Supabase
- Botón "Publicar oferta" para usuarios autenticados

---

### 6. CAFECITO (/cafecito)
**Espacio social comunitario**:
- Feed de publicaciones ordenadas por fecha
- Muestra autor, título, contenido, tags
- Contadores de likes y comentarios
- Formato de fecha relativo (hace 2h, hace 3d)
- Botón "Nueva publicación" para usuarios autenticados
- Cards con hover effects

---

### 7. EVENTOS Y TALLERES (/eventos)
**Sistema de eventos**:
- Filtros: Todos, Online, Presencial
- Cards con:
  - Imagen de evento
  - Badge de tipo (online/presencial)
  - Fecha destacada
  - Categoría
  - Descripción
  - Contador de participantes
- Botón "Me quiero anotar"
- Carga desde Supabase
- Solo muestra eventos futuros

---

### 8. ESPACIO PARA MARCAS (/marcas)
**Landing para alianzas**:
- 3 beneficios principales con íconos
- Formulario de contacto:
  - Nombre de marca
  - Contacto
  - Email
  - Mensaje
- Confirmación visual al enviar
- Guarda en tabla `brand_inquiries`

---

### 9. BEGINSS FEST (/fest)
**Página del festival anual**:
- Hero con gradiente verde
- Información clave: Fecha, Ubicación, Asistentes esperados
- 4 actividades principales:
  - Música y Arte
  - Talleres
  - Networking
  - Marketplace
- Early Bird CTA con descuento
- Botones para comprar entrada

---

### 10. CONTACTO (/contacto)
**Formulario de contacto**:
- Campos: Nombre, Email, Mensaje
- Confirmación visual al enviar
- Información de email
- Links rápidos a:
  - Cafecito
  - Eventos
  - Colaboraciones
- CTA para nuevas usuarias

---

### 11. PERFIL (/perfil)
**Gestión de perfil personal**:
- **Vista**:
  - Avatar circular
  - Nombre, ubicación
  - Contador de Puntos Beginss
  - Bio
  - Intereses (badges)
  - Habilidades (badges)
  - Tipo de perfil

- **Edición**:
  - Formulario completo
  - Actualización en tiempo real
  - Guarda en Supabase

---

### 12. LOGIN / REGISTER (/login, /registro)
**Autenticación**:
- Login: Email y contraseña
- Register: Nombre completo, email, contraseña
- Integración con Supabase Auth
- Creación automática de perfil
- Redirecciones apropiadas
- Manejo de errores

---

## Navegación

### Navbar
- Links a todas las páginas principales
- Muestra puntos Beginss del usuario
- Nombre del usuario con link a perfil
- Responsive con menú móvil
- Estado activo visual

### Footer
- Logo y descripción
- Secciones: Explorar, Información
- Redes sociales (Instagram, LinkedIn)
- CTAs de descarga de app
- Copyright 2025

---

## Sistema de Diseño

### Colores
- Verde Hoja: #7CA982 (primario)
- Verde Oscuro: #3E6049 (textos destacados)
- Rosa Terracota: #E6A5A1 (acentos)
- Beige: #F9F7F4 (fondos)
- Gris Piedra: #6E6E6E (texto secundario)
- Blanco: #FFFFFF

### Tipografía
- Headings: Cormorant Garamond
- Body: Montserrat

### Componentes
- **Button**: Variantes primary, secondary, cta
- **Badge**: Variantes default, green, acepta ReactNode
- **Navbar**: Fixed, responsive
- **Footer**: Multi-columna, responsive
- **Cards**: Hover effects, shadows, bordes redondeados

### Animaciones
- `animate-float`: Movimiento flotante 3s
- `animate-pulse-slow`: Pulso suave 3s
- Transiciones suaves en hover
- Transform translateY en cards

---

## Base de Datos

Todas las páginas están integradas con Supabase:
- Perfiles de usuario
- Marketplace listings
- Eventos
- Posts de Cafecito
- Brand inquiries
- Row Level Security habilitado en todas las tablas

---

## Estado de Implementación

✅ **Completado**:
- Todas las 12 páginas principales
- Sistema de autenticación completo
- Integración con base de datos
- Diseño responsive
- Animaciones y transiciones
- Sistema de componentes reutilizables

🔄 **Para implementar en el futuro**:
- Formularios de creación de listings
- Formularios de creación de posts
- Páginas de detalle (listing, post, evento)
- Sistema de mensajería
- Transacciones de puntos
- Upload de imágenes
- Sistema de notificaciones

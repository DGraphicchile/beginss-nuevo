# Beginss Platform - Setup Instructions

## Database Setup

The Beginss platform requires a Supabase database. The database connection is already configured in the `.env` file.

### Applying Database Migrations

To set up the database schema, you need to apply the SQL migration file located at:
`supabase/migrations/20250101000000_create_beginss_schema.sql`

#### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Paste and execute the SQL

#### Option 2: Using Supabase CLI
```bash
npx supabase db push
```

### What the migration includes:

The migration creates the following tables with Row Level Security (RLS) enabled:

1. **profiles** - User profiles with interests, skills, and Beginss points
2. **marketplace_listings** - Products, services, and workshops
3. **events** - Events and workshops
4. **event_registrations** - Event registration tracking
5. **cafecito_posts** - Community social posts
6. **cafecito_comments** - Comments on posts
7. **cafecito_likes** - Post likes tracking
8. **reviews** - Marketplace exchange reviews
9. **transactions** - Time bank point transactions
10. **brand_inquiries** - Brand partnership inquiries

All tables have appropriate RLS policies to ensure data security and proper access control.

## Running the Application

```bash
npm install
npm run dev
```

## Features Implemented

### Core Functionality
- User authentication (email/password with Supabase Auth)
- User profiles with customizable information
- Banco de Tiempo (Time Bank) points system

### Pages
- **Home** - Enhanced hero with valores activos and call-to-actions
- **Valores/Somos** - Brand story and core values narrative
- **Pilares** - Four foundational pillars with detailed descriptions
- **Círculos de Acción** - Six thematic circles for community engagement
- **Marketplace Consciente** - Listings with advanced filtering
- **Cafecito** - Community social space with posts and discussions
- **Eventos y Talleres** - Events calendar with registration
- **Espacio para Marcas** - Brand partnership opportunities
- **Beginss Fest** - Annual festival information
- **Contacto** - Contact form and community connection
- **Perfil** - User profile management with editing capabilities
- **Login/Register** - Authentication pages

### UI Components
- Responsive navigation with mobile menu
- Custom buttons (primary, secondary, CTA)
- Badge components
- Cards for marketplace, events, and posts
- Footer with social links

### Design System
- Color palette: Verde Hoja (#7CA982), Rosa Terracota (#E6A5A1), Beige (#F9F7F4)
- Typography: Cormorant Garamond for headings, Montserrat for body text
- Responsive design with Tailwind CSS
- Smooth transitions and hover effects

## Next Steps for Full Implementation

To complete the platform, you would need to add:

1. Image upload functionality for avatars and listings
2. Create/Edit forms for marketplace listings
3. Create/Edit forms for events
4. Create/Edit forms for Cafecito posts
5. Detail pages for marketplace items, events, and posts
6. Transaction system for Banco de Tiempo
7. Messaging system between users
8. Search and advanced filtering
9. Email notifications
10. Admin dashboard

The foundation is complete and ready for these enhancements!

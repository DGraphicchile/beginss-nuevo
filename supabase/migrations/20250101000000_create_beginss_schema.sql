/*
  # Beginss Platform Schema

  ## Overview
  Complete database schema for Beginss circular women's community platform including:
  - User profiles and authentication
  - Marketplace for products, services, and workshops
  - Community social space (Cafecito)
  - Events and workshops
  - Banco de Tiempo (time bank points system)
  - Brand partnerships
  - Reviews and ratings

  ## New Tables

  ### `profiles`
  User profile information with interests, skills, and offerings
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `avatar_url` (text)
  - `bio` (text)
  - `location` (text)
  - `interests` (text array)
  - `skills` (text array)
  - `profile_type` (text: 'offer', 'seek', 'both')
  - `beginss_points` (integer, default 100) - Time bank balance
  - `verified` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `marketplace_listings`
  Marketplace posts for products, services, and workshops
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `listing_type` (text: 'product', 'service', 'workshop')
  - `exchange_mode` (text: 'barter', 'time_bank', 'sale')
  - `category` (text)
  - `price` (numeric, nullable)
  - `time_points` (integer, nullable)
  - `images` (text array)
  - `location` (text)
  - `tags` (text array)
  - `status` (text: 'active', 'completed', 'inactive')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `events`
  Events and workshops
  - `id` (uuid, primary key)
  - `organizer_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `event_type` (text: 'online', 'in-person')
  - `category` (text)
  - `event_date` (timestamptz)
  - `location` (text)
  - `image_url` (text)
  - `max_participants` (integer, nullable)
  - `current_participants` (integer, default 0)
  - `tags` (text array)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `event_registrations`
  Event registration tracking
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events)
  - `user_id` (uuid, references profiles)
  - `status` (text: 'registered', 'cancelled', 'attended')
  - `created_at` (timestamptz)

  ### `cafecito_posts`
  Community social posts and discussions
  - `id` (uuid, primary key)
  - `author_id` (uuid, references profiles)
  - `title` (text)
  - `content` (text)
  - `tags` (text array)
  - `topic` (text)
  - `likes_count` (integer, default 0)
  - `comments_count` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `cafecito_comments`
  Comments on Cafecito posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, references cafecito_posts)
  - `author_id` (uuid, references profiles)
  - `content` (text)
  - `created_at` (timestamptz)

  ### `cafecito_likes`
  Track post likes
  - `id` (uuid, primary key)
  - `post_id` (uuid, references cafecito_posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `reviews`
  Reviews and ratings for marketplace exchanges
  - `id` (uuid, primary key)
  - `listing_id` (uuid, references marketplace_listings)
  - `reviewer_id` (uuid, references profiles)
  - `reviewed_user_id` (uuid, references profiles)
  - `rating` (integer, 1-5)
  - `comment` (text)
  - `created_at` (timestamptz)

  ### `transactions`
  Track exchanges and time bank transactions
  - `id` (uuid, primary key)
  - `listing_id` (uuid, references marketplace_listings, nullable)
  - `from_user_id` (uuid, references profiles)
  - `to_user_id` (uuid, references profiles)
  - `points_amount` (integer)
  - `transaction_type` (text: 'exchange', 'transfer', 'reward')
  - `status` (text: 'pending', 'completed', 'cancelled')
  - `created_at` (timestamptz)

  ### `brand_inquiries`
  Brand partnership inquiries
  - `id` (uuid, primary key)
  - `brand_name` (text)
  - `contact_name` (text)
  - `email` (text)
  - `message` (text)
  - `status` (text: 'new', 'contacted', 'closed')
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read their own profile data and public profiles
  - Users can create/update/delete their own content
  - All marketplace listings are publicly readable
  - Community posts are publicly readable
  - Events are publicly readable
  - Transactions require proper authorization
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  interests text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  profile_type text DEFAULT 'both' CHECK (profile_type IN ('offer', 'seek', 'both')),
  beginss_points integer DEFAULT 100,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  listing_type text NOT NULL CHECK (listing_type IN ('product', 'service', 'workshop')),
  exchange_mode text NOT NULL CHECK (exchange_mode IN ('barter', 'time_bank', 'sale')),
  category text NOT NULL,
  price numeric,
  time_points integer,
  images text[] DEFAULT '{}',
  location text,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('online', 'in-person')),
  category text NOT NULL,
  event_date timestamptz NOT NULL,
  location text,
  image_url text,
  max_participants integer,
  current_participants integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create cafecito_posts table
CREATE TABLE IF NOT EXISTS cafecito_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  topic text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cafecito_comments table
CREATE TABLE IF NOT EXISTS cafecito_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES cafecito_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cafecito_likes table
CREATE TABLE IF NOT EXISTS cafecito_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES cafecito_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  points_amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('exchange', 'transfer', 'reward')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create brand_inquiries table
CREATE TABLE IF NOT EXISTS brand_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafecito_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafecito_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafecito_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for marketplace_listings
CREATE POLICY "Listings are viewable by everyone"
  ON marketplace_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own listings"
  ON marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cafecito_posts
CREATE POLICY "Posts are viewable by everyone"
  ON cafecito_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON cafecito_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts"
  ON cafecito_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts"
  ON cafecito_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for cafecito_comments
CREATE POLICY "Comments are viewable by everyone"
  ON cafecito_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON cafecito_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON cafecito_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for cafecito_likes
CREATE POLICY "Likes are viewable by everyone"
  ON cafecito_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create likes"
  ON cafecito_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their likes"
  ON cafecito_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for brand_inquiries
CREATE POLICY "Anyone can create brand inquiries"
  ON brand_inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_user_id ON marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_cafecito_posts_author_id ON cafecito_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_cafecito_comments_post_id ON cafecito_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_cafecito_likes_post_id ON cafecito_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_user_id ON transactions(to_user_id);

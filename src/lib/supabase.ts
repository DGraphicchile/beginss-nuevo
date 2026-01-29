import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone_number?: string;
  profession?: string;
  interests: string[];
  skills: string[];
  profile_type: 'offer' | 'seek' | 'both';
  beginss_points: number;
  verified: boolean;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  listing_type: 'product' | 'service' | 'workshop';
  exchange_mode: 'barter' | 'time_bank' | 'sale';
  category: string;
  price?: number;
  time_points?: number;
  images: string[];
  location?: string;
  tags: string[];
  status: 'active' | 'completed' | 'inactive';
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_type: 'online' | 'in-person';
  category: string;
  event_date: string;
  location?: string;
  image_url?: string;
  max_participants?: number;
  current_participants: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface CafecitoPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  tags: string[];
  topic?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

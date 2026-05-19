export interface User {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'agent' | 'admin';
  created_at: Date;
}

export interface Agent {
  id: number;
  user_id: number;
  agency: string;
  license_number: string | null;
  rating: number;
  review_count: number;
  bio: string | null;
  specialties: string[];
  verified: boolean;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  price_type: 'short_term' | 'long_term';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  property_type: 'house' | 'condo' | 'apartment' | 'loft' | 'villa' | 'studio';
  images: string[];
  description: string;
  features: string[];
  year_built: number | null;
  parking: number;
  agent_id: number | null;
  lat: number;
  lng: number;
  listed_date: string;
  status: 'active' | 'pending' | 'sold' | 'inactive';
  available_from: string | null;
  available_to: string | null;
  min_stay_nights: number | null;
  max_stay_nights: number | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author_id: number;
  status: 'draft' | 'published';
  published_at: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SavedProperty {
  id: number;
  user_id: number;
  property_id: number;
  created_at: Date;
}

export interface SavedSearch {
  id: number;
  user_id: number;
  query_json: Record<string, unknown>;
  created_at: Date;
}

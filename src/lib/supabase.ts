import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl === 'your_supabase_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') return false;
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  resume_url: string | null;
  email: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  location: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  category: string;
  featured: boolean;
  order_index: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  order_index: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  type: 'work' | 'education';
  order_index: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  order_index: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

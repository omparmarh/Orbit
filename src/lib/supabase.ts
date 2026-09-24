import { createClient } from '@supabase/supabase-js';

// These are PUBLIC keys - safe to include in client code
// Supabase anon key is designed for browser use with Row Level Security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { User, Session } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// Prefer NEXT_PUBLIC_ vars (for client-side) but also support server-only vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables missing! Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env or .env.local file.'
  );
}

/**
 * FamTree Supabase Client
 * Initialized with public anon key for safe client-side database and authentication operations.
 * NOTE: service_role key must NEVER be used on the client.
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

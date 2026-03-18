import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseClient(
  url?: string,
  key?: string
): SupabaseClient {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase credentials. Provide url/key arguments or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

export { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseClient } from '@repo/database/supabase';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabase = createSupabaseClient();

export default supabase;

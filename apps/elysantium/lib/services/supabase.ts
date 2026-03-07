import { createClient } from '@supabase/supabase-js';

export const supabaseUrl: string = 'https://zfzxflfhxkzkggphkmqz.supabase.co';

const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

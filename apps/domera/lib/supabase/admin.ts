import 'server-only';

import { createClient } from '@repo/database/supabase';

export const PROFILE_BUCKET = 'domera-images';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

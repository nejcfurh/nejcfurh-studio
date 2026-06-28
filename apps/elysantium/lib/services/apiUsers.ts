import supabase from '@/lib/services/supabase';

export interface AppUser {
  id: string;
  email: string;
  fullName: string | null;
  avatar: string | null;
  createdAt: string;
}

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  created_at: string;
}

// Lists all registered users from the `profiles` table (mirrors auth.users).
export async function getUsers(): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProfileRow[]).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatar: row.avatar,
    createdAt: row.created_at
  }));
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export async function deleteImageSupabase(imageName: string) {
  const { error } = await supabase.storage
    .from('card-images')
    .remove([imageName]);

  if (error) {
    console.error('Error deleting image:', error.message);
    return false;
  }
  return true;
}

export async function deleteAvatarSupabase(imageName: string) {
  const { error } = await supabase.storage
    .from('avatar-images')
    .remove([imageName]);

  if (error) {
    console.error('Error deleting avatar:', error.message);
    return false;
  }
  return true;
}

import { createSupabaseClient } from '@repo/database/supabase';

const supabase = createSupabaseClient();

export default supabase;

export async function deleteImageSupabase(imageName: string) {
  const { error } = await supabase.storage
    .from('card-images-to-do-cards')
    .remove([imageName]);

  if (error) {
    console.error('Error deleting image:', error.message);
    return false;
  }
  return true;
}

export async function deleteAvatarSupabase(imageName: string) {
  const { error } = await supabase.storage
    .from('avatar-images-to-do-cards')
    .remove([imageName]);

  if (error) {
    console.error('Error deleting avatar:', error.message);
    return false;
  }
  return true;
}

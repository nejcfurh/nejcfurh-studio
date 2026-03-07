import supabase, { supabaseUrl } from '@/lib/services/supabase';

interface NewCabin {
  image: any;
  [key: string]: any;
}

export async function getCabins(): Promise<any[]> {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

export async function createEditCabin(
  newCabin: NewCabin,
  id?: number
): Promise<any> {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName: string =
    `${Math.random()}-${newCabin.image.name}`.replaceAll('/', '');

  const imagePath: string = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/Edit cabin
  let data: any;
  let error: any;

  if (id) {
    // EDIT
    const result = await supabase
      .from('cabins')
      .update({ ...newCabin, image: imagePath })
      .eq('id', id)
      .select()
      .single();
    data = result.data;
    error = result.error;
  } else {
    // CREATE
    const result = await supabase
      .from('cabins')
      .insert([{ ...newCabin, image: imagePath }])
      .select()
      .single();
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created or modified!');
  }

  // 2. Upload image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);
  // if data storage error
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and cabin was not created!'
    );
  }

  return data;
}

export async function deleteCabin(id: number): Promise<void> {
  const { error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be deleted!');
  }
}

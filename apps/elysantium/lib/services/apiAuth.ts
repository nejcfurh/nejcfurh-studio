import supabase, { supabaseUrl } from '@/lib/services/supabase';

interface SignupParams {
  fullName: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface UpdateCurrentUserParams {
  password?: string;
  fullName?: string;
  avatar?: File | null;
}

// SignUp function
export async function signup({
  fullName,
  email,
  password
}: SignupParams): Promise<any> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName: fullName,
        avatar: ''
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Login function
export async function login({ email, password }: LoginParams): Promise<any> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Getting current user from localStorage or Supabase
export async function getCurrentUser(): Promise<any> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data?.user;
}

// Getting user logged
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

// Updating User
export async function updateCurrentUser({
  password,
  fullName,
  avatar
}: UpdateCurrentUserParams): Promise<any> {
  const updateData: Record<string, any> = {};
  if (password) Object.assign(updateData, { password });
  if (fullName) Object.assign(updateData, { data: { fullName } });

  // 1. Update password OR fullName

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) {
    throw new Error(error.message);
  }

  if (!avatar) return data;

  // 2. Upload the avatar image

  const fileName: string = `avatar-${data.user.id}-${Math.random()}`;

  const { error: avatarError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar);

  if (avatarError) {
    throw new Error(avatarError.message);
  }

  // 3. Update avatar in the user's profile

  const { data: updatedUser, error: updateAvatarError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`
      }
    });

  if (updateAvatarError) {
    throw new Error(updateAvatarError.message);
  }

  return updatedUser;
}

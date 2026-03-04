'use server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { revalidatePath } from 'next/cache';

export async function getAccountInfo() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) throw new Error('User not found');

  return JSON.parse(JSON.stringify(user));
}

export async function updateAvatar(avatarUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  if (!avatarUrl) throw new Error('Avatar URL is required');

  await connectDB();
  const user = await User.findOneAndUpdate(
    { _id: session.user.id },
    { $set: { avatar: avatarUrl } },
    { new: true }
  );

  if (!user) throw new Error('User not found');

  revalidatePath('/account');
  return JSON.parse(JSON.stringify(user));
}

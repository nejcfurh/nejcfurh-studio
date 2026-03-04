'use server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const imageLink = (formData.get('imageLink') as string) || '';

  if (!title || !content || !author) {
    return { error: 'Title, content, and author are required.' };
  }

  await connectDB();

  await Post.create({
    title,
    content,
    date: Date.now(),
    author,
    imageLink
  });

  revalidatePath('/');
  redirect('/');
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  await Post.findByIdAndDelete(postId);
  revalidatePath('/');
}

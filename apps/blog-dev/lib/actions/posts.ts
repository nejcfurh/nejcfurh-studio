'use server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/post';
import { composeSchema } from '@/lib/schemas/post';
import { invalid, type ActionResult } from '@repo/validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // A server action is a public endpoint — the client schema does not bind it,
  // so the payload is re-validated here rather than trusted.
  const parsed = composeSchema.safeParse(input);

  if (!parsed.success) {
    return invalid(parsed.error);
  }

  await connectDB();

  await Post.create({
    ...parsed.data,
    date: Date.now()
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

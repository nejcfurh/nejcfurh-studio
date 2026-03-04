'use server';

import { signIn, signOut } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcrypt';

const DAILY_LIST = {
  name: 'Daily',
  url: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  body: 'Daily tasks!'
};

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    lists: [DAILY_LIST]
  });

  await signIn('credentials', {
    email,
    password,
    redirectTo: '/todos'
  });
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/todos'
    });
  } catch (error) {
    if ((error as Error).message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: 'Invalid email or password!' };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}

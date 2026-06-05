'use client';

// Client-side NextAuth API, re-exported so apps consume it via @repo/auth
// instead of depending on `next-auth` directly.
export {
  SessionProvider,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut,
  useSession
} from 'next-auth/react';

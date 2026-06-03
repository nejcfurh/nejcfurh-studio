import 'server-only';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { cache } from 'react';

const SESSION_COOKIE_NAME = 'firebase-session';
const USERS_COLLECTION = 'users';

export type CurrentUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string | null;
  createdAt: Date | null;
  lastSignInAt: Date | null;
};

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null;

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const snapshot = await adminDb
      .collection(USERS_COLLECTION)
      .doc(decoded.uid)
      .get();

    if (!snapshot.exists) return null;
    const data = snapshot.data() ?? {};

    return {
      uid: decoded.uid,
      email: (data.email as string | null) ?? null,
      displayName: (data.displayName as string | null) ?? null,
      photoURL: (data.photoURL as string | null) ?? null,
      provider: (data.provider as string | null) ?? null,
      createdAt: toDate(data.createdAt),
      lastSignInAt: toDate(data.lastSignInAt)
    };
  } catch {
    return null;
  }
});

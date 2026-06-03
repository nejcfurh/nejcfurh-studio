'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'firebase-session';
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
const USERS_COLLECTION = 'users';

export const createSession = async (idToken: string) => {
  const decoded = await adminAuth.verifyIdToken(idToken);
  await upsertUser(decoded.uid);

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_DURATION_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};

export const destroySession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};

const upsertUser = async (uid: string) => {
  const user = await adminAuth.getUser(uid);
  const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
  const snapshot = await docRef.get();

  const baseData = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    provider: user.providerData[0]?.providerId ?? null,
    lastSignInAt: FieldValue.serverTimestamp()
  };

  if (snapshot.exists) {
    await docRef.set(baseData, { merge: true });
  } else {
    await docRef.set({
      ...baseData,
      createdAt: FieldValue.serverTimestamp()
    });
  }
};

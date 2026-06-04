import 'server-only';

import { SESSION_COOKIE_NAME } from '@/features/auth/constants';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export const requireUid = async (): Promise<string> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Not authenticated.');
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  return decoded.uid;
};

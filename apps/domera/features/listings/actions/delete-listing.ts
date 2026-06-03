'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { PROFILE_BUCKET, supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'firebase-session';
const LISTINGS_COLLECTION = 'listings';

const extractStoragePath = (publicUrl: string): string | null => {
  const marker = `/${PROFILE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
};

export const deleteListing = async (listingId: string): Promise<void> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Not authenticated.');
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const uid = decoded.uid;

  const ref = adminDb.collection(LISTINGS_COLLECTION).doc(listingId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error('Listing not found.');
  const data = snap.data();
  if (data?.ownerUid !== uid) {
    throw new Error('You can only delete your own listings.');
  }

  const urls = (data?.imageUrls as string[] | undefined) ?? [];
  const paths = urls
    .map((url) => extractStoragePath(url))
    .filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    await supabaseAdmin.storage
      .from(PROFILE_BUCKET)
      .remove(paths)
      .catch(() => {
        // Best-effort cleanup — proceed with Firestore delete regardless.
      });
  }

  await ref.delete();
  revalidatePath('/profile');
};

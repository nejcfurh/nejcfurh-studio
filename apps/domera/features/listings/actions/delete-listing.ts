'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { adminDb } from '@/lib/firebase/admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import { revalidatePath } from 'next/cache';

const extractStoragePath = (publicUrl: string): string | null => {
  const marker = `/${STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
};

export const deleteListing = async (listingId: string): Promise<void> => {
  const uid = await requireUid();

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
      .from(STORAGE_BUCKET)
      .remove(paths)
      .catch(() => {
        // Best-effort cleanup — proceed with Firestore delete regardless.
      });
  }

  await ref.delete();
  revalidatePath('/profile');
};

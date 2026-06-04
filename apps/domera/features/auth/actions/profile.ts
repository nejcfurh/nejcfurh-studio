'use server';

import { USERS_COLLECTION } from '@/features/auth/constants';
import { requireUid } from '@/features/auth/utils/require-uid';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

const extractStoragePath = (publicUrl: string): string | null => {
  const marker = `/${STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
};

const removePreviousAvatar = async (previousUrl: string | null | undefined) => {
  if (!previousUrl) return;
  const path = extractStoragePath(previousUrl);
  if (!path || !path.startsWith('avatars/')) return;
  await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([path])
    .catch(() => {
      // Best-effort cleanup — don't fail the update over a stale file.
    });
};

export type UpdateProfileInput = {
  displayName?: string;
  /** Path under `_pending/<uid>/...` from `requestAvatarUploadTicket`. */
  photoPendingPath?: string;
};

export const updateProfile = async (input: UpdateProfileInput) => {
  const uid = await requireUid();

  const updates: { displayName?: string; photoURL?: string } = {};
  let previousPhotoURL: string | null = null;

  if (typeof input.displayName === 'string') {
    const trimmed = input.displayName.trim();
    if (trimmed) updates.displayName = trimmed;
  }

  if (input.photoPendingPath) {
    const pendingPrefix = `_pending/${uid}/`;
    if (
      !input.photoPendingPath.startsWith(pendingPrefix) ||
      input.photoPendingPath.includes('..')
    ) {
      throw new Error('Invalid upload path.');
    }
    const ext = input.photoPendingPath.split('.').pop() ?? 'jpg';
    const finalPath = `avatars/${uid}-${Date.now()}.${ext}`;

    const existing = await adminDb.collection(USERS_COLLECTION).doc(uid).get();
    previousPhotoURL = (existing.data()?.photoURL as string | null) ?? null;

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .move(input.photoPendingPath, finalPath);
    if (error) {
      throw new Error(`Could not finalize avatar upload: ${error.message}`);
    }

    const {
      data: { publicUrl }
    } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(finalPath);
    updates.photoURL = publicUrl;
  }

  if (Object.keys(updates).length === 0) return;

  await adminAuth.updateUser(uid, updates);

  await adminDb
    .collection(USERS_COLLECTION)
    .doc(uid)
    .set(
      { ...updates, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

  if (updates.photoURL && previousPhotoURL) {
    await removePreviousAvatar(previousPhotoURL);
  }

  revalidatePath('/profile');
};

'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { PROFILE_BUCKET, supabaseAdmin } from '@/lib/supabase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'firebase-session';
const USERS_COLLECTION = 'users';
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const requireUid = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Not authenticated.');
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  return decoded.uid;
};

const uploadPhoto = async (uid: string, file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('Image must be 5MB or smaller.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `avatars/${uid}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PROFILE_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true
    });
  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl }
  } = supabaseAdmin.storage.from(PROFILE_BUCKET).getPublicUrl(path);

  return publicUrl;
};

export const updateProfile = async (formData: FormData) => {
  const uid = await requireUid();

  const displayNameRaw = formData.get('displayName');
  const photoRaw = formData.get('photo');

  const updates: { displayName?: string; photoURL?: string } = {};

  if (typeof displayNameRaw === 'string') {
    const trimmed = displayNameRaw.trim();
    if (trimmed) updates.displayName = trimmed;
  }

  if (photoRaw instanceof File && photoRaw.size > 0) {
    updates.photoURL = await uploadPhoto(uid, photoRaw);
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

  revalidatePath('/profile');
};

'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import {
  ALLOWED_IMAGE_MIME,
  isAllowedImageMime,
  MAX_IMAGES
} from '@/features/listings/constants';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';

export type UploadTicket = {
  path: string;
  token: string;
  contentType: string;
};

const mintTicket = async (
  uid: string,
  mimeType: string,
  prefix: 'avatar' | 'listing'
): Promise<UploadTicket> => {
  if (!isAllowedImageMime(mimeType)) {
    throw new Error('Only JPG, PNG, or WebP images are allowed.');
  }
  const ext = ALLOWED_IMAGE_MIME[mimeType];
  const path = `_pending/${uid}/${prefix}-${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error('Could not create upload URL.');
  }
  return { path: data.path, token: data.token, contentType: mimeType };
};

export const requestListingUploadTickets = async (
  mimeTypes: string[]
): Promise<UploadTicket[]> => {
  const uid = await requireUid();
  if (!Array.isArray(mimeTypes) || mimeTypes.length === 0) {
    throw new Error('Request at least one upload slot.');
  }
  if (mimeTypes.length > MAX_IMAGES) {
    throw new Error(`Up to ${MAX_IMAGES} images allowed.`);
  }
  return Promise.all(mimeTypes.map((mime) => mintTicket(uid, mime, 'listing')));
};

export const requestAvatarUploadTicket = async (
  mimeType: string
): Promise<UploadTicket> => {
  const uid = await requireUid();
  return mintTicket(uid, mimeType, 'avatar');
};

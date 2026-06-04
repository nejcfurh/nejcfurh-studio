'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { listingServerSchema } from '@/features/listings/schemas';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export type UpdateListingInput = {
  type: 'sell' | 'rent';
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  description: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number | null;
};

export const updateListing = async (
  listingId: string,
  input: UpdateListingInput
): Promise<void> => {
  const uid = await requireUid();

  const parsed = listingServerSchema.parse({
    type: input.type,
    name: input.name,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    parking: input.parking,
    furnished: input.furnished,
    address: input.address,
    description: input.description,
    offer: input.offer,
    regularPrice: input.regularPrice,
    discountedPrice: input.discountedPrice ?? undefined
  });

  const ref = adminDb.collection(LISTINGS_COLLECTION).doc(listingId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error('Listing not found.');
  if (snap.data()?.ownerUid !== uid) {
    throw new Error('You can only edit your own listings.');
  }

  await ref.update({
    type: parsed.type,
    name: parsed.name,
    bedrooms: parsed.bedrooms,
    bathrooms: parsed.bathrooms,
    parking: parsed.parking,
    furnished: parsed.furnished,
    address: parsed.address,
    description: parsed.description,
    offer: parsed.offer,
    regularPrice: parsed.regularPrice,
    discountedPrice: parsed.offer ? (parsed.discountedPrice ?? null) : null,
    updatedAt: FieldValue.serverTimestamp()
  });

  revalidatePath('/profile');
};

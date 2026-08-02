'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { listingServerSchema } from '@/features/listings/schemas';
import { adminDb } from '@/lib/firebase/admin';
import {
  invalid,
  rejected,
  succeeded,
  type ActionResult
} from '@repo/validation';
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
): Promise<ActionResult<void>> => {
  const uid = await requireUid();

  const parsed = listingServerSchema.safeParse({
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

  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const listing = parsed.data;

  const ref = adminDb.collection(LISTINGS_COLLECTION).doc(listingId);
  const snap = await ref.get();
  if (!snap.exists) return rejected('Listing not found.');
  if (snap.data()?.ownerUid !== uid) {
    return rejected('You can only edit your own listings.');
  }

  await ref.update({
    type: listing.type,
    name: listing.name,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    parking: listing.parking,
    furnished: listing.furnished,
    address: listing.address,
    description: listing.description,
    offer: listing.offer,
    regularPrice: listing.regularPrice,
    discountedPrice: listing.offer ? (listing.discountedPrice ?? null) : null,
    updatedAt: FieldValue.serverTimestamp()
  });

  revalidatePath('/profile');

  return succeeded(undefined);
};

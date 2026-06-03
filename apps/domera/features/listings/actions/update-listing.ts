'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'firebase-session';
const LISTINGS_COLLECTION = 'listings';

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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Not authenticated.');
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const uid = decoded.uid;

  const ref = adminDb.collection(LISTINGS_COLLECTION).doc(listingId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error('Listing not found.');
  if (snap.data()?.ownerUid !== uid) {
    throw new Error('You can only edit your own listings.');
  }

  if (
    input.offer &&
    (input.discountedPrice === null ||
      input.discountedPrice >= input.regularPrice)
  ) {
    throw new Error('Discounted price must be lower than the regular price.');
  }

  await ref.update({
    type: input.type,
    name: input.name.trim(),
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    parking: input.parking,
    furnished: input.furnished,
    address: input.address.trim(),
    description: input.description.trim(),
    offer: input.offer,
    regularPrice: input.regularPrice,
    discountedPrice: input.offer ? input.discountedPrice : null,
    updatedAt: FieldValue.serverTimestamp()
  });

  revalidatePath('/profile');
};

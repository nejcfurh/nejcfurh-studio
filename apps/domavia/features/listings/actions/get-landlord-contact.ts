'use server';

import { USERS_COLLECTION } from '@/features/auth/constants';
import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { adminDb } from '@/lib/firebase/admin';

export type LandlordContact = {
  email: string;
  displayName: string;
};

export const getLandlordContact = async (
  listingId: string
): Promise<LandlordContact> => {
  await requireUid();

  const listing = await adminDb
    .collection(LISTINGS_COLLECTION)
    .doc(listingId)
    .get();
  if (!listing.exists) throw new Error('Listing not found.');

  const ownerUid = listing.data()?.ownerUid as string | undefined;
  if (!ownerUid) throw new Error('Listing owner unavailable.');

  const owner = await adminDb.collection(USERS_COLLECTION).doc(ownerUid).get();
  if (!owner.exists) throw new Error('Listing owner unavailable.');

  const data = owner.data() ?? {};
  const email = (data.email as string | null) ?? null;
  if (!email) throw new Error('Listing owner has no contact email.');

  return {
    email,
    displayName: (data.displayName as string | null) ?? 'the landlord'
  };
};

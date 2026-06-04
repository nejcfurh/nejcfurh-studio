import 'server-only';

import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { adminDb } from '@/lib/firebase/admin';
import { cache } from 'react';

import type { Listing } from '../types';
import { mapListing } from './map-listing';

export const getListing = cache(
  async (listingId: string): Promise<Listing | null> => {
    const snap = await adminDb
      .collection(LISTINGS_COLLECTION)
      .doc(listingId)
      .get();
    if (!snap.exists) return null;
    return mapListing(snap);
  }
);

export type LandlordPublicProfile = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export const getLandlord = cache(
  async (uid: string): Promise<LandlordPublicProfile | null> => {
    const snap = await adminDb.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    const data = snap.data() ?? {};
    return {
      displayName: (data.displayName as string | null) ?? null,
      email: (data.email as string | null) ?? null,
      photoURL: (data.photoURL as string | null) ?? null
    };
  }
);

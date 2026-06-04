import 'server-only';

import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { adminDb } from '@/lib/firebase/admin';
import { cache } from 'react';

import type { Listing } from '../types';
import { mapListing } from './map-listing';

export const getUserListings = cache(
  async (uid: string): Promise<Listing[]> => {
    const snapshot = await adminDb
      .collection(LISTINGS_COLLECTION)
      .where('ownerUid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(mapListing);
  }
);

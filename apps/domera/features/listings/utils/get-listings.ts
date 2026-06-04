import 'server-only';

import { LISTINGS_COLLECTION } from '@/features/listings/constants';
import { adminDb } from '@/lib/firebase/admin';
import { cache } from 'react';

import type { Listing } from '../types';
import { mapListing } from './map-listing';

export const getRecentListings = cache(async (max = 5): Promise<Listing[]> => {
  const snap = await adminDb
    .collection(LISTINGS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return snap.docs.map(mapListing);
});

export const getOfferListings = cache(async (max = 4): Promise<Listing[]> => {
  const snap = await adminDb
    .collection(LISTINGS_COLLECTION)
    .where('offer', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return snap.docs.map(mapListing);
});

export const getListingsByType = cache(
  async (type: 'sell' | 'rent', max = 4): Promise<Listing[]> => {
    const snap = await adminDb
      .collection(LISTINGS_COLLECTION)
      .where('type', '==', type)
      .orderBy('createdAt', 'desc')
      .limit(max)
      .get();
    return snap.docs.map(mapListing);
  }
);

export type PaginatedListings = {
  listings: Listing[];
  nextCursor: string | null;
};

const fetchPaginated = async (
  builder: FirebaseFirestore.Query,
  max: number,
  afterId?: string
): Promise<PaginatedListings> => {
  let q = builder;
  if (afterId) {
    const cursorSnap = await adminDb
      .collection(LISTINGS_COLLECTION)
      .doc(afterId)
      .get();
    if (cursorSnap.exists) q = q.startAfter(cursorSnap);
  }
  const snap = await q.limit(max).get();
  const listings = snap.docs.map(mapListing);
  const nextCursor =
    snap.docs.length === max ? snap.docs[snap.docs.length - 1].id : null;
  return { listings, nextCursor };
};

export const getOfferListingsPaginated = async (
  max = 8,
  afterId?: string
): Promise<PaginatedListings> => {
  return fetchPaginated(
    adminDb
      .collection(LISTINGS_COLLECTION)
      .where('offer', '==', true)
      .orderBy('createdAt', 'desc'),
    max,
    afterId
  );
};

export const getListingsByTypePaginated = async (
  type: 'sell' | 'rent',
  max = 8,
  afterId?: string
): Promise<PaginatedListings> => {
  return fetchPaginated(
    adminDb
      .collection(LISTINGS_COLLECTION)
      .where('type', '==', type)
      .orderBy('createdAt', 'desc'),
    max,
    afterId
  );
};

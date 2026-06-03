import 'server-only';

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp, type DocumentData } from 'firebase-admin/firestore';
import { cache } from 'react';

import type { Listing } from '../types';

const LISTINGS_COLLECTION = 'listings';

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null;

const mapListing = (id: string, data: DocumentData): Listing => ({
  id,
  ownerUid: (data.ownerUid as string) ?? '',
  type: (data.type as 'sell' | 'rent') ?? 'sell',
  name: (data.name as string) ?? '',
  bedrooms: (data.bedrooms as number) ?? 0,
  bathrooms: (data.bathrooms as number) ?? 0,
  parking: Boolean(data.parking),
  furnished: Boolean(data.furnished),
  address: (data.address as string) ?? '',
  description: (data.description as string) ?? '',
  offer: Boolean(data.offer),
  regularPrice: (data.regularPrice as number) ?? 0,
  discountedPrice: (data.discountedPrice as number | null) ?? null,
  imageUrls: (data.imageUrls as string[]) ?? [],
  coverImage: (data.coverImage as string | null) ?? null,
  geolocation:
    (data.geolocation as { lat: number; lng: number } | null) ?? null,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt)
});

export const getRecentListings = cache(async (max = 5): Promise<Listing[]> => {
  const snap = await adminDb
    .collection(LISTINGS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return snap.docs.map((doc) => mapListing(doc.id, doc.data()));
});

export const getOfferListings = cache(async (max = 4): Promise<Listing[]> => {
  const snap = await adminDb
    .collection(LISTINGS_COLLECTION)
    .where('offer', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return snap.docs.map((doc) => mapListing(doc.id, doc.data()));
});

export const getListingsByType = cache(
  async (type: 'sell' | 'rent', max = 4): Promise<Listing[]> => {
    const snap = await adminDb
      .collection(LISTINGS_COLLECTION)
      .where('type', '==', type)
      .orderBy('createdAt', 'desc')
      .limit(max)
      .get();
    return snap.docs.map((doc) => mapListing(doc.id, doc.data()));
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
  const listings = snap.docs.map((doc) => mapListing(doc.id, doc.data()));
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

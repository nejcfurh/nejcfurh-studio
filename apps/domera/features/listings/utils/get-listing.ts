import 'server-only';

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { cache } from 'react';

import type { Listing } from '../types';

const LISTINGS_COLLECTION = 'listings';

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null;

export const getListing = cache(
  async (listingId: string): Promise<Listing | null> => {
    const snap = await adminDb
      .collection(LISTINGS_COLLECTION)
      .doc(listingId)
      .get();
    if (!snap.exists) return null;
    const data = snap.data() ?? {};

    return {
      id: snap.id,
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
    };
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

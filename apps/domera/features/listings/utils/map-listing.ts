import 'server-only';

import {
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot
} from 'firebase-admin/firestore';

import type { Listing } from '../types';

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null;

export const mapListing = (
  snap: DocumentSnapshot | QueryDocumentSnapshot
): Listing => {
  const data: DocumentData = snap.data() ?? {};
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
};

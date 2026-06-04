'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION, MAX_IMAGES } from '@/features/listings/constants';
import { listingServerSchema } from '@/features/listings/schemas';
import { adminDb } from '@/lib/firebase/admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

type Geocode = { lat: number; lng: number } | null;

export type CreateListingInput = {
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
  discountedPrice?: number;
  /** Paths under `_pending/<uid>/...` returned by `requestListingUploadTickets`. */
  imagePaths: string[];
};

export type CreateListingResult = { listingId: string };

const geocodeAddress = async (address: string): Promise<Geocode> => {
  const key = process.env.LOCATIONIQ_GEOCODE_API_KEY;
  if (!key) return null;
  try {
    const url = `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat?: string; lon?: string }[];
    const first = Array.isArray(data) ? data[0] : null;
    if (!first?.lat || !first?.lon) return null;
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
};

const removeUploadedFiles = async (paths: string[]) => {
  if (paths.length === 0) return;
  await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove(paths)
    .catch(() => {
      // Best-effort cleanup — don't mask the original error.
    });
};

export const createListing = async (
  input: CreateListingInput
): Promise<CreateListingResult> => {
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
    discountedPrice: input.discountedPrice
  });

  if (!Array.isArray(input.imagePaths) || input.imagePaths.length === 0) {
    throw new Error('Add at least one image.');
  }
  if (input.imagePaths.length > MAX_IMAGES) {
    throw new Error(`Up to ${MAX_IMAGES} images allowed.`);
  }

  const pendingPrefix = `_pending/${uid}/`;
  for (const path of input.imagePaths) {
    if (!path.startsWith(pendingPrefix) || path.includes('..')) {
      throw new Error('Invalid upload path.');
    }
  }

  const movedPaths: string[] = [];
  try {
    for (const pendingPath of input.imagePaths) {
      const filename = pendingPath.slice(pendingPrefix.length);
      const finalPath = `listings/${uid}/${filename}`;
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .move(pendingPath, finalPath);
      if (error) {
        throw new Error(`Could not finalize upload: ${error.message}`);
      }
      movedPaths.push(finalPath);
    }

    const imageUrls = movedPaths.map(
      (p) =>
        supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(p).data
          .publicUrl
    );

    const geolocation = await geocodeAddress(parsed.address);

    const docRef = await adminDb.collection(LISTINGS_COLLECTION).add({
      ownerUid: uid,
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
      imageUrls,
      coverImage: imageUrls[0],
      geolocation,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    revalidatePath('/profile');
    return { listingId: docRef.id };
  } catch (err) {
    await removeUploadedFiles(movedPaths);
    throw err instanceof Error ? err : new Error('Failed to create listing.');
  }
};

'use server';

import { requireUid } from '@/features/auth/utils/require-uid';
import { LISTINGS_COLLECTION, MAX_IMAGES } from '@/features/listings/constants';
import { listingServerSchema } from '@/features/listings/schemas';
import { adminDb } from '@/lib/firebase/admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import {
  failed,
  invalid,
  rejected,
  succeeded,
  type ActionResult
} from '@repo/validation';
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

/** The images live on the form as one field, so their rules report there. */
const imagesRejected = (
  message: string
): ActionResult<CreateListingResult> => ({
  status: 'invalid',
  fieldErrors: { images: [message] }
});

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
): Promise<ActionResult<CreateListingResult>> => {
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
    discountedPrice: input.discountedPrice
  });

  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const listing = parsed.data;

  if (!Array.isArray(input.imagePaths) || input.imagePaths.length === 0) {
    return imagesRejected('Add at least one image.');
  }
  if (input.imagePaths.length > MAX_IMAGES) {
    return imagesRejected(`Up to ${MAX_IMAGES} images allowed.`);
  }

  const pendingPrefix = `_pending/${uid}/`;
  for (const path of input.imagePaths) {
    if (!path.startsWith(pendingPrefix) || path.includes('..')) {
      return rejected('Invalid upload path.');
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

    const geolocation = await geocodeAddress(listing.address);

    const docRef = await adminDb.collection(LISTINGS_COLLECTION).add({
      ownerUid: uid,
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
      imageUrls,
      coverImage: imageUrls[0],
      geolocation,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    revalidatePath('/profile');
    return succeeded({ listingId: docRef.id });
  } catch (err) {
    // Roll back both sides of the move: what already landed under `listings/`
    // and what is still sitting in `_pending/`. Missing the latter is how a
    // failed submit leaves orphans no later request will ever reference.
    const unmoved = input.imagePaths.slice(movedPaths.length);
    await removeUploadedFiles([...movedPaths, ...unmoved]);

    // Retryable: the uploads were rolled back, so the same payload can be resent.
    return failed(
      err instanceof Error ? err.message : 'Failed to create listing.'
    );
  }
};

'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { PROFILE_BUCKET, supabaseAdmin } from '@/lib/supabase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'firebase-session';
const LISTINGS_COLLECTION = 'listings';
const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type Geocode = { lat: number; lng: number } | null;
type UploadedImage = { path: string; publicUrl: string };

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
    .from(PROFILE_BUCKET)
    .remove(paths)
    .catch(() => {
      // Best-effort cleanup — don't mask the original error.
    });
};

export type CreateListingResult = { listingId: string };

export const createListing = async (
  formData: FormData
): Promise<CreateListingResult> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Not authenticated.');
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const uid = decoded.uid;

  const typeRaw = formData.get('type');
  const type = typeRaw === 'sell' || typeRaw === 'rent' ? typeRaw : null;
  if (!type) throw new Error('Invalid listing type.');

  const name = String(formData.get('name') ?? '').trim();
  const bedrooms = Number(formData.get('bedrooms'));
  const bathrooms = Number(formData.get('bathrooms'));
  const parking = formData.get('parking') === 'true';
  const furnished = formData.get('furnished') === 'true';
  const address = String(formData.get('address') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const offer = formData.get('offer') === 'true';
  const regularPrice = Number(formData.get('regularPrice'));
  const discountedRaw = formData.get('discountedPrice');
  const discountedPrice =
    offer && discountedRaw != null ? Number(discountedRaw) : null;

  if (offer && (discountedPrice === null || discountedPrice >= regularPrice)) {
    throw new Error('Discounted price must be lower than the regular price.');
  }

  const images = formData
    .getAll('images')
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (images.length === 0) throw new Error('Add at least one image.');
  if (images.length > MAX_IMAGES) {
    throw new Error(`Up to ${MAX_IMAGES} images allowed.`);
  }

  // Track every path that lands in storage so we can clean up on later failure.
  const uploadedPaths: string[] = [];

  const uploadOne = async (file: File): Promise<UploadedImage> => {
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error('Each image must be 5MB or smaller.');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed.');
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `listings/${uid}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from(PROFILE_BUCKET)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false
      });
    if (error) throw new Error(`Image upload failed: ${error.message}`);

    uploadedPaths.push(path);

    const {
      data: { publicUrl }
    } = supabaseAdmin.storage.from(PROFILE_BUCKET).getPublicUrl(path);
    return { path, publicUrl };
  };

  try {
    // Wait for every upload to finish (success or failure) so we can clean up
    // partial-success scenarios — Promise.all short-circuits on the first
    // rejection while other uploads keep running in the background.
    const uploadResults = await Promise.allSettled(images.map(uploadOne));
    const firstFailure = uploadResults.find((r) => r.status === 'rejected');
    if (firstFailure) {
      throw firstFailure.status === 'rejected' &&
        firstFailure.reason instanceof Error
        ? firstFailure.reason
        : new Error('Image upload failed.');
    }
    const imageUrls = uploadResults.map(
      (r) => (r as PromiseFulfilledResult<UploadedImage>).value.publicUrl
    );

    const geolocation = await geocodeAddress(address);

    const docRef = await adminDb.collection(LISTINGS_COLLECTION).add({
      ownerUid: uid,
      type,
      name,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      address,
      description,
      offer,
      regularPrice,
      discountedPrice,
      imageUrls,
      coverImage: imageUrls[0],
      geolocation,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    revalidatePath('/profile');
    return { listingId: docRef.id };
  } catch (err) {
    await removeUploadedFiles(uploadedPaths);
    throw err instanceof Error ? err : new Error('Failed to create listing.');
  }
};

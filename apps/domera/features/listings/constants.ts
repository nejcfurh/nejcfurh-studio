export const LISTINGS_COLLECTION = 'listings';
export const MAX_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
} as const;

export type AllowedImageMime = keyof typeof ALLOWED_IMAGE_MIME;

export const isAllowedImageMime = (mime: string): mime is AllowedImageMime =>
  mime in ALLOWED_IMAGE_MIME;

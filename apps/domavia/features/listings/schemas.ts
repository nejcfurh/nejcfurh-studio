import { z } from '@repo/validation';

import { MAX_IMAGES } from './constants';

const baseListingShape = {
  type: z.enum(['sell', 'rent']),
  name: z
    .string()
    .trim()
    .min(10, 'Name must be at least 10 characters')
    .max(64, 'Name must be 64 characters or fewer'),
  bedrooms: z.number().int().min(1).max(50),
  bathrooms: z.number().int().min(1).max(50),
  parking: z.boolean(),
  furnished: z.boolean(),
  address: z.string().trim().min(1, 'Address is required').max(500),
  description: z.string().trim().min(1, 'Description is required').max(10_000),
  offer: z.boolean(),
  regularPrice: z.number().int().min(50).max(400_000_000),
  discountedPrice: z.number().int().min(50).max(400_000_000).optional()
};

const offerRefinement = (data: {
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
}) =>
  !data.offer ||
  (data.discountedPrice !== undefined &&
    data.discountedPrice < data.regularPrice);

const offerRefinementOpts = {
  message: 'Discounted price must be lower than the regular price',
  path: ['discountedPrice']
};

export const createListingSchema = z
  .object({
    ...baseListingShape,
    images: z
      .array(z.instanceof(File))
      .min(1, 'Add at least one image')
      .max(MAX_IMAGES, `Up to ${MAX_IMAGES} images`)
  })
  .refine(offerRefinement, offerRefinementOpts);

export type CreateListingValues = z.infer<typeof createListingSchema>;

export const editListingSchema = z
  .object(baseListingShape)
  .refine(offerRefinement, offerRefinementOpts);

export type EditListingValues = z.infer<typeof editListingSchema>;

export const listingServerSchema = z
  .object(baseListingShape)
  .refine(offerRefinement, offerRefinementOpts);

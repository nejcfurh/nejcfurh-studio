import { z } from '@repo/validation';

/** The file input yields a FileList; an existing cabin carries a URL string. */
const fileList = z.custom<FileList>(
  (value) => typeof FileList !== 'undefined' && value instanceof FileList
);

/**
 * Editing keeps whatever image the cabin already has, so the photo is only
 * required when creating one — which is why this is a factory.
 */
export const cabinSchema = (isEditSession: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, 'This field is required!'),
      // The numeric inputs register with valueAsNumber, so these stay plain
      // numbers — an empty input arrives as NaN and trips the `error` message.
      maxCapacity: z
        .number({ error: 'This field is required!' })
        .int()
        .min(1, 'The minimum value for capacity should be 1!'),
      regularPrice: z
        .number({ error: 'This field is required!' })
        .min(100, 'The minimum price for the cabin is 100$!'),
      discount: z
        .number({ error: 'This field is required!' })
        .min(0, 'Discount cannot be negative!'),
      description: z.string().trim().min(1, 'This field is required!'),
      image: z.union([z.string(), fileList])
    })
    .refine((cabin) => cabin.discount < cabin.regularPrice, {
      message: 'Discount must be lower than the regular price!',
      path: ['discount']
    })
    .refine(
      (cabin) =>
        isEditSession ||
        (typeof cabin.image !== 'string' && cabin.image.length > 0),
      { message: 'The image is required!', path: ['image'] }
    );

export type CabinFormValues = z.infer<ReturnType<typeof cabinSchema>>;

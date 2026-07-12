'use client';

import { createListing } from '@/features/listings/actions/create-listing';
import { requestListingUploadTickets } from '@/features/listings/actions/request-upload-tickets';
import {
  ALLOWED_IMAGE_MIME,
  MAX_IMAGE_BYTES,
  MAX_IMAGES
} from '@/features/listings/constants';
import {
  createListingSchema,
  type CreateListingValues
} from '@/features/listings/schemas';
import { supabaseBrowser } from '@/lib/supabase/client';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AnimatedButton,
  AnimatedDiv,
  AnimatedSpan
} from '@repo/ui/animation/core';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { toast } from '@repo/ui/components/sonner';
import { Textarea } from '@repo/ui/components/textarea';
import { Loader2, Save, X } from '@repo/ui/icons/lucide';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ACCEPTED_MIME = Object.keys(ALLOWED_IMAGE_MIME);

type ListingFormValues = CreateListingValues;

const defaultValues: ListingFormValues = {
  type: 'rent',
  name: '',
  bedrooms: 1,
  bathrooms: 1,
  parking: false,
  furnished: false,
  address: '',
  description: '',
  offer: false,
  regularPrice: 0,
  discountedPrice: undefined,
  images: []
};

export const CreateListingForm = () => {
  const router = useRouter();
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const isSubmitting = formState.isSubmitting;
  // eslint-disable-next-line react-hooks/incompatible-library
  const type = watch('type');
  const offer = watch('offer');
  const images = watch('images');

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewURLs(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const onSubmit = async (data: ListingFormValues) => {
    try {
      const mimeTypes = data.images.map((file) => file.type);
      const tickets = await requestListingUploadTickets(mimeTypes);

      await Promise.all(
        data.images.map(async (file, i) => {
          const ticket = tickets[i];
          const { error } = await supabaseBrowser.storage
            .from(STORAGE_BUCKET)
            .uploadToSignedUrl(ticket.path, ticket.token, file, {
              contentType: ticket.contentType,
              upsert: false
            });
          if (error) throw new Error(error.message);
        })
      );

      await createListing({
        type: data.type,
        name: data.name,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parking: data.parking,
        furnished: data.furnished,
        address: data.address,
        description: data.description,
        offer: data.offer,
        regularPrice: data.regularPrice,
        discountedPrice: data.discountedPrice,
        imagePaths: tickets.map((t) => t.path)
      });
      toast.success('Listing created.');
      router.push('/profile');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (incoming.length === 0) return;

    const invalidType = incoming.find(
      (file) => !ACCEPTED_MIME.includes(file.type)
    );
    if (invalidType) {
      toast.error('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    const tooLarge = incoming.find((file) => file.size > MAX_IMAGE_BYTES);
    if (tooLarge) {
      toast.error(`Each image must be 5MB or smaller.`);
      return;
    }

    const next = [...images, ...incoming].slice(0, MAX_IMAGES);
    if (incoming.length + images.length > MAX_IMAGES) {
      toast.error(`Only ${MAX_IMAGES} images allowed — the rest were dropped.`);
    }
    setValue('images', next, { shouldValidate: true });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    setValue('images', next, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sell or Rent</FormLabel>
              <AnimatedDiv className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={field.value === 'sell' ? 'default' : 'outline'}
                  onClick={() => field.onChange('sell')}
                  className="h-12 text-base"
                >
                  Sell
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'rent' ? 'default' : 'outline'}
                  onClick={() => field.onChange('rent')}
                  className="h-12 text-base"
                >
                  Rent
                </Button>
              </AnimatedDiv>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Cozy 2-bed loft near the river"
                  className="h-12 min-h-12 px-4 text-base md:text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AnimatedDiv className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={50}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-12 min-h-12 px-4 text-base md:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={50}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-12 min-h-12 px-4 text-base md:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AnimatedDiv>

        <FormField
          control={control}
          name="parking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking spot</FormLabel>
              <AnimatedDiv className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={field.value === true ? 'default' : 'outline'}
                  onClick={() => field.onChange(true)}
                  className="h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={field.value === false ? 'default' : 'outline'}
                  onClick={() => field.onChange(false)}
                  className="h-12 text-base"
                >
                  No
                </Button>
              </AnimatedDiv>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="furnished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Furnished</FormLabel>
              <AnimatedDiv className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={field.value === true ? 'default' : 'outline'}
                  onClick={() => field.onChange(true)}
                  className="h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={field.value === false ? 'default' : 'outline'}
                  onClick={() => field.onChange(false)}
                  className="h-12 text-base"
                >
                  No
                </Button>
              </AnimatedDiv>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Street, city, country"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell future tenants/buyers about the place."
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="offer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special offer</FormLabel>
              <AnimatedDiv className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={field.value === true ? 'default' : 'outline'}
                  onClick={() => field.onChange(true)}
                  className="h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={field.value === false ? 'default' : 'outline'}
                  onClick={() => field.onChange(false)}
                  className="h-12 text-base"
                >
                  No
                </Button>
              </AnimatedDiv>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="regularPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Regular price{type === 'rent' ? ' ($ / month)' : ' ($)'}
              </FormLabel>
              <FormControl>
                <AnimatedDiv className="relative">
                  <AnimatedSpan className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base">
                    $
                  </AnimatedSpan>
                  <Input
                    type="text"
                    inputMode="numeric"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={
                      field.value ? field.value.toLocaleString('en-US') : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      field.onChange(raw === '' ? 0 : Number(raw));
                    }}
                    className="h-12 min-h-12 pr-4 pl-8 text-base md:text-base"
                  />
                </AnimatedDiv>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {offer ? (
          <FormField
            control={control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Discounted price
                  {type === 'rent' ? ' ($ / month)' : ' ($)'}
                </FormLabel>
                <FormControl>
                  <AnimatedDiv className="relative">
                    <AnimatedSpan className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base">
                      $
                    </AnimatedSpan>
                    <Input
                      type="text"
                      inputMode="numeric"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={
                        field.value != null
                          ? field.value.toLocaleString('en-US')
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        field.onChange(raw === '' ? undefined : Number(raw));
                      }}
                      className="h-12 min-h-12 pr-4 pl-8 text-base md:text-base"
                    />
                  </AnimatedDiv>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormDescription>
                The first image is used as the cover. JPG, PNG, or WebP, up to{' '}
                {MAX_IMAGES} images, 5MB each.
              </FormDescription>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handleImagesChange}
                  disabled={isSubmitting || images.length >= MAX_IMAGES}
                  className="file:bg-muted h-12 min-h-12 cursor-pointer px-3 py-2 text-base file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-sm file:font-medium md:text-base"
                />
              </FormControl>

              {previewURLs.length > 0 ? (
                <AnimatedDiv className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {previewURLs.map((url, index) => (
                    <AnimatedDiv
                      key={url}
                      className="group relative aspect-square overflow-hidden rounded-md border"
                    >
                      <Image
                        src={url}
                        alt={`Listing image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {index === 0 ? (
                        <AnimatedSpan className="bg-foreground text-background absolute top-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                          Cover
                        </AnimatedSpan>
                      ) : null}
                      <AnimatedButton
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="size-3.5" />
                      </AnimatedButton>
                    </AnimatedDiv>
                  ))}
                </AnimatedDiv>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full text-base"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
          {isSubmitting ? 'Creating listing' : 'Create listing'}
        </Button>
      </form>
    </Form>
  );
};

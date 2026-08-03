'use client';

import { updateListing } from '@/features/listings/actions/update-listing';
import {
  editListingSchema,
  type EditListingValues
} from '@/features/listings/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatedDiv } from '@repo/ui/animation/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@repo/ui/components/alert-dialog';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@repo/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { toast } from '@repo/ui/components/sonner';
import { Textarea } from '@repo/ui/components/textarea';
import { applyActionResult } from '@repo/ui/forms';
import { Loader2, Save } from '@repo/ui/icons/lucide';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { Listing } from '../types';

const toDefaults = (listing: Listing): EditListingValues => ({
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
  discountedPrice: listing.discountedPrice ?? undefined
});

type Props = {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditListingDialog = ({ listing, open, onOpenChange }: Props) => {
  const router = useRouter();

  const form = useForm<EditListingValues>({
    resolver: zodResolver(editListingSchema),
    mode: 'onTouched',
    defaultValues: toDefaults(listing)
  });

  const { control, handleSubmit, reset, formState } = form;
  const isSubmitting = formState.isSubmitting;
  const type = useWatch({ control, name: 'type' });
  const offer = useWatch({ control, name: 'offer' });
  const [discardPrompted, setDiscardPrompted] = useState(false);

  useEffect(() => {
    if (open) reset(toDefaults(listing));
  }, [open, listing, reset]);

  // Esc and the overlay reach the same handler as Cancel, so all three routes
  // out of a half-finished edit are gated here rather than on the button.
  const handleOpenChange = (next: boolean) => {
    if (!next && formState.isDirty && !isSubmitting) {
      setDiscardPrompted(true);
      return;
    }
    onOpenChange(next);
  };

  const discardChanges = () => {
    setDiscardPrompted(false);
    reset(toDefaults(listing));
    onOpenChange(false);
  };

  const onSubmit = async (values: EditListingValues) => {
    form.clearErrors('root');

    try {
      const result = await updateListing(listing.id, {
        type: values.type,
        name: values.name,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        parking: values.parking,
        furnished: values.furnished,
        address: values.address,
        description: values.description,
        offer: values.offer,
        regularPrice: values.regularPrice,
        discountedPrice: values.discountedPrice ?? null
      });

      if (!applyActionResult(form, result)) return;

      toast.success('Listing updated.');
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      // The action never returned — transport failure, not a rejection.
      form.setError('root', {
        message:
          err instanceof Error ? err.message : 'Failed to update listing.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit listing</DialogTitle>
          <DialogDescription>
            Update your listing&apos;s details. Images can&apos;t be changed
            here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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
                    >
                      Sell
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'rent' ? 'default' : 'outline'}
                      onClick={() => field.onChange('rent')}
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
                    <Input {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedDiv>

            <AnimatedDiv className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="parking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking spot</FormLabel>
                    <AnimatedDiv className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={field.value === true ? 'default' : 'outline'}
                        onClick={() => field.onChange(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === false ? 'default' : 'outline'}
                        onClick={() => field.onChange(false)}
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
                    <AnimatedDiv className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={field.value === true ? 'default' : 'outline'}
                        onClick={() => field.onChange(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === false ? 'default' : 'outline'}
                        onClick={() => field.onChange(false)}
                      >
                        No
                      </Button>
                    </AnimatedDiv>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedDiv>

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
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
                    <Textarea {...field} rows={4} />
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
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === false ? 'default' : 'outline'}
                      onClick={() => field.onChange(false)}
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
                    />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormRootError />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                {isSubmitting ? 'Saving' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <AlertDialog open={discardPrompted} onOpenChange={setDiscardPrompted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This listing has edits you haven&apos;t saved. Closing now loses
              them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={discardChanges}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

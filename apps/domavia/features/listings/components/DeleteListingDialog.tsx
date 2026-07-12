'use client';

import { deleteListing } from '@/features/listings/actions/delete-listing';
import { AnimatedSpan } from '@repo/ui/animation/core';
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
import { toast } from '@repo/ui/components/sonner';
import { Loader2 } from '@repo/ui/icons/lucide';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  listingId: string;
  listingName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteListingDialog = ({
  listingId,
  listingName,
  open,
  onOpenChange
}: Props) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await deleteListing(listingId);
      toast.success('Listing deleted.');
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete listing.'
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            <AnimatedSpan className="text-foreground font-medium">
              {listingName}
            </AnimatedSpan>{' '}
            will be permanently removed along with its uploaded images. This
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {pending && <Loader2 className="animate-spin" />}
            {pending ? 'Deleting' : 'Delete listing'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

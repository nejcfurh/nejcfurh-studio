'use client';

import { Button } from '@/components/ui/button';
import { ListingItem } from '@/features/listings/components/ListingItem';
import type { PaginatedListings } from '@/features/listings/utils/get-listings';
import {
  AnimatedDiv,
  AnimatedList,
  AnimatedText
} from '@repo/ui/animation/core';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { Listing } from '../types';

type LoadMoreFn = (afterId: string) => Promise<PaginatedListings>;

type Props = {
  initialListings: Listing[];
  initialCursor: string | null;
  loadMore: LoadMoreFn;
  emptyMessage?: string;
};

export const PaginatedListingsGrid = ({
  initialListings,
  initialCursor,
  loadMore,
  emptyMessage = 'Nothing here yet.'
}: Props) => {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [pending, startTransition] = useTransition();

  const handleLoadMore = () => {
    if (!cursor || pending) return;
    startTransition(async () => {
      try {
        const result = await loadMore(cursor);
        setListings((prev) => [...prev, ...result.listings]);
        setCursor(result.nextCursor);
      } catch {
        toast.error('Could not load more listings.');
      }
    });
  };

  if (listings.length === 0) {
    return (
      <AnimatedText className="text-muted-foreground py-12 text-center">
        {emptyMessage}
      </AnimatedText>
    );
  }

  return (
    <AnimatedDiv className="flex flex-col gap-10">
      <AnimatedList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingItem key={listing.id} listing={listing} />
        ))}
      </AnimatedList>
      {cursor ? (
        <AnimatedDiv className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={pending}
            className="min-w-32"
          >
            {pending ? <Loader2 className="animate-spin" /> : null}
            {pending ? 'Loading' : 'Load more'}
          </Button>
        </AnimatedDiv>
      ) : null}
    </AnimatedDiv>
  );
};

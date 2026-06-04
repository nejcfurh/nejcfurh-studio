'use client';

import { ListingItem } from '@/features/listings/components/ListingItem';
import { listingsGridVariants } from '@/features/listings/utils/listing-motion';
import { AnimatedList } from '@repo/ui/animation/core';

import type { Listing } from '../types';

type Props = {
  listings: Listing[];
  className?: string;
};

// A listings grid that softly staggers its cards in as it scrolls into view.
// Cards consume `listingCardVariants` (set on each ListingItem) via this
// container's "hidden"/"visible" orchestration.
export const ListingsGrid = ({ listings, className }: Props) => (
  <AnimatedList
    variants={listingsGridVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    className={className}
  >
    {listings.map((listing) => (
      <ListingItem key={listing.id} listing={listing} />
    ))}
  </AnimatedList>
);

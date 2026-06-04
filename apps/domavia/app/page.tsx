import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { FeaturedListingsCarousel } from '@/features/listings/components/FeaturedListingsCarousel';
import { ListingsGrid } from '@/features/listings/components/ListingsGrid';
import type { Listing } from '@/features/listings/types';
import {
  getListingsByType,
  getOfferListings,
  getRecentListings
} from '@/features/listings/utils/get-listings';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SectionProps = {
  title: string;
  href: string;
  ctaLabel: string;
  listings: Listing[];
};

const ListingSection = ({ title, href, ctaLabel, listings }: SectionProps) => {
  if (listings.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <Link
          href={href}
          className="text-foreground hover:text-foreground/80 inline-flex shrink-0 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <ListingsGrid
        listings={listings}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </section>
  );
};

export default async function Home() {
  const [featured, offers, rent, sell] = await Promise.all([
    getRecentListings(5),
    getOfferListings(4),
    getListingsByType('rent', 4),
    getListingsByType('sell', 4)
  ]);

  return (
    <div className="flex w-full flex-col">
      <FeaturedListingsCarousel listings={featured} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 p-4 sm:p-6 lg:gap-16 lg:p-10">
        <ListingSection
          title="Recent offers"
          href="/offers"
          ctaLabel="Show more offers"
          listings={offers}
        />
        <ListingSection
          title="Places for rent"
          href="/category/rent"
          ctaLabel="Show more places for rent"
          listings={rent}
        />
        <ListingSection
          title="Places for sale"
          href="/category/sell"
          ctaLabel="Show more places for sale"
          listings={sell}
        />
      </div>

      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.DOMAVIA
        }}
      />
    </div>
  );
}

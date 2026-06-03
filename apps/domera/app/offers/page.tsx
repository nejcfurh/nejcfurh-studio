import { loadMoreOffers } from '@/features/listings/actions/load-more-listings';
import { PaginatedListingsGrid } from '@/features/listings/components/PaginatedListingsGrid';
import { getOfferListingsPaginated } from '@/features/listings/utils/get-listings';

export const metadata = {
  title: 'Offers — Domera'
};

const OffersPage = async () => {
  const { listings, nextCursor } = await getOfferListingsPaginated(8);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Offers
        </h1>
        <p className="text-muted-foreground">
          Listings with a special discount, sorted by most recent.
        </p>
      </header>

      <PaginatedListingsGrid
        initialListings={listings}
        initialCursor={nextCursor}
        loadMore={loadMoreOffers}
        emptyMessage="There are no current offers."
      />
    </section>
  );
};

export default OffersPage;

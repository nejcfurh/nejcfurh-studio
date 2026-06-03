import {
  loadMoreRent,
  loadMoreSell
} from '@/features/listings/actions/load-more-listings';
import { PaginatedListingsGrid } from '@/features/listings/components/PaginatedListingsGrid';
import { getListingsByTypePaginated } from '@/features/listings/utils/get-listings';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ categoryName: string }>;
};

const CATEGORY_COPY: Record<
  'sell' | 'rent',
  { title: string; subtitle: string; empty: string }
> = {
  sell: {
    title: 'Places for sale',
    subtitle: 'Browse properties available to purchase.',
    empty: 'No places for sale right now.'
  },
  rent: {
    title: 'Places for rent',
    subtitle: 'Browse properties available to rent.',
    empty: 'No places for rent right now.'
  }
};

export async function generateMetadata({ params }: Props) {
  const { categoryName } = await params;
  if (categoryName !== 'sell' && categoryName !== 'rent') {
    return { title: 'Domera' };
  }
  return { title: `${CATEGORY_COPY[categoryName].title} — Domera` };
}

const CategoryPage = async ({ params }: Props) => {
  const { categoryName } = await params;
  if (categoryName !== 'sell' && categoryName !== 'rent') {
    notFound();
  }

  const { listings, nextCursor } = await getListingsByTypePaginated(
    categoryName,
    8
  );

  const copy = CATEGORY_COPY[categoryName];
  const loadMore = categoryName === 'sell' ? loadMoreSell : loadMoreRent;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.title}
        </h1>
        <p className="text-muted-foreground">{copy.subtitle}</p>
      </header>

      <PaginatedListingsGrid
        initialListings={listings}
        initialCursor={nextCursor}
        loadMore={loadMore}
        emptyMessage={copy.empty}
      />
    </section>
  );
};

export default CategoryPage;

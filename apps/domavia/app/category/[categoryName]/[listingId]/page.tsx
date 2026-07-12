import { getCurrentUser } from '@/features/auth/utils/get-current-user';
import { ContactLandlordDialog } from '@/features/listings/components/ContactLandlordDialog';
import { ListingGallery } from '@/features/listings/components/ListingGallery';
import { ListingMap } from '@/features/listings/components/ListingMap';
import { ShareButton } from '@/features/listings/components/ShareButton';
import { getListing } from '@/features/listings/utils/get-listing';
import { Bath, Bed, Car, MapPin, Sofa } from '@repo/ui/icons/lucide';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

const formatPrice = (n: number) => n.toLocaleString('en-US');

type Props = {
  params: Promise<{ categoryName: string; listingId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { listingId } = await params;
  const listing = await getListing(listingId);
  if (!listing) return { title: 'Listing not found' };
  return {
    title: `${listing.name} — Domavia`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.name,
      description: listing.description.slice(0, 160),
      images: listing.coverImage ? [listing.coverImage] : []
    }
  };
}

const ListingPage = async ({ params }: Props) => {
  const { categoryName, listingId } = await params;
  const listing = await getListing(listingId);
  if (!listing) notFound();
  if (listing.type !== categoryName) notFound();

  const me = await getCurrentUser();
  const isOwner = me?.uid === listing.ownerUid;

  const hasDiscount = listing.offer && listing.discountedPrice != null;
  const displayPrice = hasDiscount
    ? listing.discountedPrice!
    : listing.regularPrice;
  const savings = hasDiscount
    ? listing.regularPrice - listing.discountedPrice!
    : 0;
  const priceSuffix = listing.type === 'rent' ? ' / month' : '';

  return (
    <article className="flex w-full flex-col">
      <div className="relative w-full">
        <ListingGallery images={listing.imageUrls} name={listing.name} />
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <ShareButton />
          {isOwner ? null : (
            <ContactLandlordDialog
              listingId={listing.id}
              listingName={listing.name}
              viewerSignedIn={me !== null}
            />
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 p-4 sm:p-6 lg:p-10">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <section className="flex flex-col justify-start gap-5 p-2">
            <div className="flex items-stretch gap-2">
              <span
                className={`flex-1 rounded-full px-4 py-2 text-center text-base font-semibold tracking-wide uppercase shadow-sm ${
                  listing.type === 'rent'
                    ? 'bg-[#aa00ff] text-white'
                    : 'bg-[#00e676] text-black'
                }`}
              >
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {hasDiscount ? (
                <span className="rounded-full bg-emerald-500 px-4 py-2 text-base font-semibold tracking-wide text-white uppercase shadow-sm">
                  ${formatPrice(savings)} off
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {listing.name}
              </h1>
              <div className="text-muted-foreground flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium">{listing.address}</p>
              </div>
            </div>

            <ul className="border-border grid grid-cols-2 gap-y-3 border-t pt-4 text-sm">
              <li className="flex items-center gap-2">
                <Bed className="text-muted-foreground size-4" />
                <span className="font-medium">
                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Bath className="text-muted-foreground size-4" />
                <span className="font-medium">
                  {listing.bathrooms}{' '}
                  {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Car className="text-muted-foreground size-4" />
                <span className="font-medium">
                  {listing.parking ? 'Parking' : 'No parking'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Sofa className="text-muted-foreground size-4" />
                <span className="font-medium">
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </span>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-5 p-2">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-base font-semibold tracking-widest uppercase">
                {hasDiscount ? 'Offer price' : 'Price'}
              </p>
              <p className="text-5xl font-bold tracking-tight md:text-6xl">
                ${formatPrice(displayPrice)}
                <span className="text-muted-foreground ml-1 text-xl font-medium md:text-2xl">
                  {priceSuffix}
                </span>
              </p>
              {hasDiscount ? (
                <p className="text-muted-foreground text-base line-through">
                  ${formatPrice(listing.regularPrice)}
                  {priceSuffix}
                </p>
              ) : null}
            </div>

            <div className="border-border flex flex-col gap-2 border-t pt-4">
              <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                Description
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.createdAt ? (
              <p className="border-border text-muted-foreground border-t pt-4 text-sm">
                Listed{' '}
                {formatDistanceToNow(listing.createdAt, { addSuffix: true })}
              </p>
            ) : null}
          </section>

          <section className="overflow-hidden rounded-2xl">
            {listing.geolocation ? (
              <div className="h-full min-h-[280px] w-full">
                <ListingMap
                  lat={listing.geolocation.lat}
                  lng={listing.geolocation.lng}
                  label={listing.address}
                />
              </div>
            ) : (
              <div className="bg-muted text-muted-foreground flex h-full min-h-[280px] items-center justify-center p-6 text-center text-sm">
                Location not available
              </div>
            )}
          </section>
        </div>
      </div>
    </article>
  );
};

export default ListingPage;

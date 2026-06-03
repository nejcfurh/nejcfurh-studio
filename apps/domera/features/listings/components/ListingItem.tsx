'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DeleteListingDialog } from '@/features/listings/components/DeleteListingDialog';
import { EditListingDialog } from '@/features/listings/components/EditListingDialog';
import { formatDistanceToNow } from 'date-fns';
import { Bath, Bed, Car, MapPin, Sofa } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import type { Listing } from '../types';

type ListingItemProps = {
  listing: Listing;
};

const formatPrice = (n: number) => n.toLocaleString('en-US');

const stopLinkNav = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const ListingItem = ({ listing }: ListingItemProps) => {
  const { user } = useAuth();
  const isOwner = user?.uid === listing.ownerUid;
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteOpen(true);
  };

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const hasDiscount = listing.offer && listing.discountedPrice != null;
  const displayPrice = hasDiscount
    ? listing.discountedPrice!
    : listing.regularPrice;
  const priceSuffix = listing.type === 'rent' ? '/mo' : '';
  const images = listing.imageUrls.length > 0 ? listing.imageUrls : [];
  const hasMultiple = images.length > 1;

  return (
    <li className="group bg-card text-card-foreground overflow-hidden rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/category/${listing.type}/${listing.id}`} className="block">
        <div className="relative aspect-16/10 overflow-hidden">
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            className="absolute inset-0"
          >
            <CarouselContent className="ml-0 h-full">
              {images.length > 0 ? (
                images.map((url, i) => (
                  <CarouselItem key={url} className="relative h-full pl-0">
                    <Image
                      src={url}
                      alt={`${listing.name} — image ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="bg-muted h-full pl-0" />
              )}
            </CarouselContent>

            {hasMultiple && (
              <div onClick={stopLinkNav}>
                <CarouselPrevious className="left-2 size-8 bg-white/90 text-gray-900 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white" />
                <CarouselNext className="right-2 size-8 bg-white/90 text-gray-900 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white" />
              </div>
            )}
          </Carousel>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/15" />

          <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide shadow-sm ${
                listing.type === 'rent'
                  ? 'bg-[#aa00ff] text-white'
                  : 'bg-[#00e676] text-black'
              }`}
            >
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {hasDiscount && (
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
                Offer
              </span>
            )}
          </div>

          {listing.createdAt && (
            <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {formatDistanceToNow(listing.createdAt, { addSuffix: true })}
            </span>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap items-end gap-2">
            <span className="inline-flex items-baseline rounded-full bg-white px-4 py-2 text-xl font-bold text-gray-900 shadow-lg">
              ${formatPrice(displayPrice)}
              {priceSuffix && (
                <span className="ml-1 text-base font-medium text-gray-500">
                  {priceSuffix}
                </span>
              )}
            </span>
            {hasDiscount && (
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white line-through backdrop-blur">
                ${formatPrice(listing.regularPrice)}
              </span>
            )}
          </div>

          {hasMultiple && (
            <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1">
              {images.map((url, i) => (
                <span
                  key={url}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === selectedIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="text-foreground truncate text-base font-semibold">
            {listing.name}
          </p>

          <div className="text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <p className="truncate text-sm">{listing.address}</p>
          </div>

          <div className="border-border mt-1 flex items-center justify-between border-t pt-3 text-sm">
            <div className="text-muted-foreground flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Bed className="size-4" />
                <span className="font-medium">{listing.bedrooms}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="size-4" />
                <span className="font-medium">{listing.bathrooms}</span>
              </span>
              {listing.parking && (
                <span
                  className="flex items-center gap-1.5"
                  title="Parking included"
                >
                  <Car className="size-4" />
                </span>
              )}
              {listing.furnished && (
                <span className="flex items-center gap-1.5" title="Furnished">
                  <Sofa className="size-4" />
                </span>
              )}
            </div>

            {isOwner && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleEditClick}
                  aria-label="Edit listing"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-8 cursor-pointer place-items-center rounded-md transition-colors"
                >
                  <FiEdit2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  aria-label="Delete listing"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive grid size-8 cursor-pointer place-items-center rounded-md transition-colors"
                >
                  <FiTrash2 className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {isOwner && (
        <>
          <EditListingDialog
            listing={listing}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteListingDialog
            listingId={listing.id}
            listingName={listing.name}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </li>
  );
};

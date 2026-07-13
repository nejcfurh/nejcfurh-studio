'use client';

import {
  AnimatedDiv,
  AnimatedSpan,
  AnimatedSubTitle,
  AnimatedText
} from '@repo/ui/animation/core';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@repo/ui/components/carousel';
import { MapPin } from '@repo/ui/icons/lucide';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { Listing } from '../types';

const formatPrice = (n: number) => n.toLocaleString('en-US');

type Props = {
  listings: Listing[];
};

export const FeaturedListingsCarousel = ({ listings }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (listings.length === 0) return null;

  const hasMultiple = listings.length > 1;

  return (
    <AnimatedDiv className="relative h-[60svh] w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="h-full w-full"
      >
        <CarouselContent className="ml-0 h-full">
          {listings.map((listing, i) => {
            const hasDiscount =
              listing.offer && listing.discountedPrice != null;
            const price = hasDiscount
              ? listing.discountedPrice!
              : listing.regularPrice;
            const priceSuffix = listing.type === 'rent' ? ' / month' : '';

            return (
              <CarouselItem key={listing.id} className="relative h-full pl-0">
                <Link
                  href={`/category/${listing.type}/${listing.id}`}
                  className="group absolute inset-0 block"
                >
                  {listing.coverImage && (
                    <Image
                      src={listing.coverImage}
                      alt={listing.name}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  )}
                  <AnimatedDiv className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <AnimatedDiv className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 p-6 text-white sm:p-10 lg:p-16">
                    <AnimatedDiv className="flex flex-wrap items-center gap-2">
                      <AnimatedSpan
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide shadow-sm ${
                          listing.type === 'rent'
                            ? 'bg-[#aa00ff] text-white'
                            : 'bg-[#00e676] text-black'
                        }`}
                      >
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                      </AnimatedSpan>
                      {hasDiscount ? (
                        <AnimatedSpan className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
                          Offer
                        </AnimatedSpan>
                      ) : null}
                    </AnimatedDiv>

                    <AnimatedSubTitle className="line-clamp-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                      {listing.name}
                    </AnimatedSubTitle>

                    <AnimatedDiv className="flex flex-wrap items-baseline justify-between gap-4">
                      <AnimatedDiv className="flex items-center gap-1.5 text-white/85">
                        <MapPin className="size-4 shrink-0" />
                        <AnimatedText className="line-clamp-1 text-sm sm:text-base">
                          {listing.address}
                        </AnimatedText>
                      </AnimatedDiv>
                      <AnimatedText className="text-2xl font-bold sm:text-3xl">
                        ${formatPrice(price)}
                        <AnimatedSpan className="ml-1 text-base font-medium text-white/80">
                          {priceSuffix}
                        </AnimatedSpan>
                      </AnimatedText>
                    </AnimatedDiv>
                  </AnimatedDiv>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {hasMultiple ? (
          <>
            <CarouselPrevious className="left-4 size-11 border-0 bg-white/90 text-gray-900 shadow-md hover:bg-white" />
            <CarouselNext className="right-4 size-11 border-0 bg-white/90 text-gray-900 shadow-md hover:bg-white" />
          </>
        ) : null}
      </Carousel>

      {hasMultiple ? (
        <AnimatedDiv className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {listings.map((listing, i) => (
            <AnimatedSpan
              key={listing.id}
              className={`h-1.5 rounded-full bg-white transition-all duration-200 ${
                i === selectedIndex ? 'w-8 opacity-100' : 'w-1.5 opacity-60'
              }`}
            />
          ))}
        </AnimatedDiv>
      ) : null}
    </AnimatedDiv>
  );
};

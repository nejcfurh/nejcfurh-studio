'use client';

import {
  AnimatedButton,
  AnimatedDiv,
  AnimatedSpan
} from '@repo/ui/animation/core';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@repo/ui/components/carousel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@repo/ui/components/dialog';
import { X } from '@repo/ui/icons/lucide';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ListingGalleryProps = {
  images: string[];
  name: string;
};

export const ListingGallery = ({ images, name }: ListingGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(selectedIndex, true);
    }
  }, [lightboxOpen, lightboxApi, selectedIndex]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  return (
    <>
      <AnimatedDiv className="relative h-[45svh] w-full overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="h-full w-full"
        >
          <CarouselContent className="ml-0 h-full">
            {hasImages ? (
              images.map((url, i) => (
                <CarouselItem key={url} className="relative h-full pl-0">
                  <AnimatedButton
                    type="button"
                    onClick={() => openLightbox(i)}
                    aria-label={`View image ${i + 1} fullscreen`}
                    className="absolute inset-0 cursor-zoom-in"
                  >
                    <Image
                      src={url}
                      alt={`${name} — image ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </AnimatedButton>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="bg-muted h-full pl-0" />
            )}
          </CarouselContent>

          {hasMultiple ? (
            <>
              <CarouselPrevious className="left-4 size-10 border-0 bg-white/90 text-gray-900 shadow-md hover:bg-white" />
              <CarouselNext className="right-4 size-10 border-0 bg-white/90 text-gray-900 shadow-md hover:bg-white" />
            </>
          ) : null}
        </Carousel>

        {hasMultiple ? (
          <AnimatedDiv className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((url, i) => (
              <AnimatedSpan
                key={url}
                className={`h-1.5 rounded-full bg-white transition-all duration-200 ${
                  i === selectedIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-60'
                }`}
              />
            ))}
          </AnimatedDiv>
        ) : null}
      </AnimatedDiv>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="block h-svh w-screen max-w-none gap-0 overflow-hidden rounded-none border-0 bg-black p-0 sm:h-[90svh] sm:max-w-[95vw] sm:rounded-lg"
        >
          <DialogTitle className="sr-only">
            {name} — full-size images
          </DialogTitle>
          <DialogDescription className="sr-only">
            Browse the full-size photos for {name}.
          </DialogDescription>
          <DialogClose
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </DialogClose>

          <Carousel
            setApi={setLightboxApi}
            opts={{ loop: true }}
            className="h-full w-full"
          >
            <CarouselContent className="ml-0 h-full">
              {images.map((url, i) => (
                <CarouselItem key={url} className="relative h-full pl-0">
                  <Image
                    src={url}
                    alt={`${name} — image ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    className="object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultiple ? (
              <>
                <CarouselPrevious className="left-4 size-12 border-0 bg-white/15 text-white backdrop-blur hover:bg-white/25" />
                <CarouselNext className="right-4 size-12 border-0 bg-white/15 text-white backdrop-blur hover:bg-white/25" />
              </>
            ) : null}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

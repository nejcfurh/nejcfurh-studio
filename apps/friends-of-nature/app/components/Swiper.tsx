'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import AnimatedView from './AnimatedView';

const items: Array<{ label: string; labelBold?: string; source: string }> = [
  {
    label: 'Nourish butterflies with the ',
    labelBold: 'Butterfly Feeder.',
    source: '/images/butterfly_feeder_carusel_square.png'
  },
  {
    label: 'Boost pollination with the ',
    labelBold: 'Bee Hotel.',
    source: '/images/bee_hotel_carousel_square.png'
  },
  {
    label: 'Nurture native plants in the ',
    labelBold: 'Plant Nursery.',
    source: '/images/plant_nursery_carousel_square.png'
  },
  {
    label: 'Help beneficial bugs with the ',
    labelBold: 'Bug Hotel',
    source: '/images/bug_hotel_carousel_square.png'
  },
  {
    label: 'Hydrate birds with the ',
    labelBold: 'Water Fountain',
    source: '/images/water_fountain_carousel_square.png'
  },
  {
    label: 'Welcome pollinators with the ',
    labelBold: 'Plant Base',
    source: '/images/base_carousel_square.png'
  }
];

const SwiperWrapper = (): React.ReactNode => {
  // Configure Embla to align items to the center and ensure snapping
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center' // Centers active item
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Ensure snapping when the user stops dragging manually
  const onPointerUp = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(emblaApi.selectedScrollSnap()); // Snap to nearest item
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      setScrollSnaps(Array.from({ length: items.length }, (_, i) => i)); // Fix pagination dots
      emblaApi.on('select', onSelect);
      onSelect();
    }
  }, [emblaApi, onSelect, onPointerUp]);

  return (
    <AnimatedView className="mt-[-48px] sm:mt-[-50px]">
      <div className="embla relative overflow-x-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {items.map((item, index) => (
            <div
              key={`${index}${item.label}`}
              className="embla__slide flex min-w-[70%] flex-col items-center gap-8 md:min-w-[50%] lg:min-w-[40%] xl:min-w-[30%]"
            >
              <Image
                className="relative"
                src={item.source}
                alt={item.label}
                width={270}
                height={270}
              />
            </div>
          ))}
        </div>
      </div>
      <AnimatedView className="mx-auto mb-6 mt-4 flex w-2/3 justify-center md:w-full">
        <label className=" font-raleway block w-full text-center text-2xl font-thin text-[#003333] md:mt-10 md:text-3xl">
          {items[selectedIndex].label}{' '}
          <span className="w-60vw font-bold text-black">
            <strong>{items[selectedIndex].labelBold}</strong>
          </span>
        </label>
      </AnimatedView>
      {/* Pagination Dots - Fixed */}
      <div className="mt-6 flex justify-center gap-2">
        {scrollSnaps.map((index) => (
          <button
            type="button"
            key={`dot-${index}`}
            onClick={(): void => emblaApi?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === selectedIndex ? 'w-6 bg-[#6FA8D1]' : 'bg-[#6FA8D14D]'
            }`}
          />
        ))}
      </div>
    </AnimatedView>
  );
};

export default SwiperWrapper;

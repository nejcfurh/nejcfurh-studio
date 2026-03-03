'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import AnimatedView from './AnimatedView';

const items: Array<{ label: string; source: string }> = [
  { label: 'Butterfly Feeder', source: '/images/butterfly-monarch.png' },
  { label: 'Bee Hotel', source: '/images/bumblebee_image.png' },
  { label: 'Plant Nursery', source: '/images/ladybug_image.png' },
  { label: 'Bug Hotel', source: '/images/ruby_image.png' },
  { label: 'Base', source: '/images/bee_image.png' },
  { label: 'Water Fountain', source: '/images/jewel_image.png' }
];

const SwiperNaturePics = (): React.ReactNode => {
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
              className="embla__slide flex min-w-[85%] flex-col items-center gap-8 md:min-w-[70%] lg:min-w-[40%] xl:min-w-[30%]"
            >
              <Image
                className="relative h-auto w-[350px] md:w-[650px]"
                src={item.source}
                alt={item.label}
                sizes="100%"
                width={0}
                height={0}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Label - Fixed */}
      <AnimatedView className="mt-4 mb-6 hidden w-full justify-center">
        <label className="font-raleway block w-full text-center text-2xl font-bold text-[#003333] md:text-3xl">
          {items[selectedIndex].label}
        </label>
      </AnimatedView>
      {/* Pagination Dots - Fixed */}
      <div className="mt-6 hidden justify-center gap-2">
        {scrollSnaps.map((index) => (
          <button
            type="button"
            key={`dot-${index}`}
            onClick={(): void => emblaApi?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === selectedIndex ? 'w-6 bg-[#FFFFFF]' : 'bg-[#FFFFFF4D]'
            }`}
          />
        ))}
      </div>
    </AnimatedView>
  );
};

export default SwiperNaturePics;

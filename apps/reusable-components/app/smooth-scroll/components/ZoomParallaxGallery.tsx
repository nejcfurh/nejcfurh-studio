'use client';

import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

const ZoomParallaxGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 4]); // its 4 - because our image is 25% of the screen,
  const scale5x = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6x = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8x = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9x = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const IMAGES = [
    {
      src: '/images/smooth-scroll/space-x-image.jpg',
      scale: scaleBg
    },
    {
      src: '/images/smooth-scroll/space-x-image-1.jpg',
      scale: scale5x
    },
    {
      src: '/images/smooth-scroll/space-x-image-2.jpg',
      scale: scale6x
    },
    {
      src: '/images/smooth-scroll/space-x-image-5.jpg',
      scale: scale6x
    },
    {
      src: '/images/smooth-scroll/space-x-image-3.jpg',
      scale: scale8x
    },
    {
      src: '/images/smooth-scroll/space-x-image-4.jpg',
      scale: scale9x
    }
  ];

  return (
    <div ref={containerRef} className="relative my-20 h-[300vh]">
      <div className="absolute right-0 bottom-0 left-0 z-50 h-56 bg-linear-to-b from-transparent to-zinc-950" />
      <div className="sticky top-0 h-screen overflow-hidden">
        {IMAGES.map((image, index) => (
          <AnimatedDiv
            style={{ scale: image.scale }}
            key={image.src + image.scale}
            className="absolute top-0 flex h-full w-full items-center justify-center"
          >
            <div
              className={`relative shadow-2xl shadow-black/50 ${
                index === 1
                  ? 'top-[-32vh] h-[28vh] w-[20vw] overflow-hidden rounded-lg'
                  : index === 2
                    ? 'top-[-10vh] left-[-27.5vw] h-[35vh] w-[25vw] overflow-hidden rounded-lg'
                    : index === 3
                      ? 'top-[-10vh] left-[27.5vw] h-[30vh] w-[25vw] overflow-hidden rounded-lg'
                      : index === 4
                        ? 'top-[30vh] left-[20vw] h-[28vh] w-[35vw] overflow-hidden rounded-lg'
                        : index === 5
                          ? 'top-[30vh] left-[-20.5vw] h-[25vh] w-[30vw] overflow-hidden rounded-lg'
                          : 'h-[25%] w-[25%] shadow-none'
              }`}
            >
              <Image
                src={image.src}
                alt="Space X Image"
                fill
                placeholder="blur"
                blurDataURL={image.src}
                className="object-cover"
              />
            </div>
          </AnimatedDiv>
        ))}
      </div>
    </div>
  );
};

export default ZoomParallaxGallery;

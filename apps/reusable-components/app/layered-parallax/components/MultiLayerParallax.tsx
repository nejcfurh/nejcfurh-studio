'use client';

import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import AnimatedTitle from '@/components/animation-core/AnimatedTitle';
import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const MultiLayerParallax = () => {
  const wrappingDivRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrappingDivRef,
    offset: ['start start', 'end start']
  });

  const backgroundImageYPosition = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  const textYPosition = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  return (
    <div
      ref={wrappingDivRef}
      className="relative grid h-screen w-full place-items-center overflow-hidden"
    >
      <AnimatedTitle
        style={{ y: textYPosition }}
        className="relative z-10 mb-48 text-7xl font-bold text-white md:text-9xl"
      >
        Mountaintopia
      </AnimatedTitle>
      <AnimatedDiv
        className="absolute inset-0 z-0"
        style={{
          y: backgroundImageYPosition,
          backgroundImage: `url('/images/layered-parallax/full-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom'
        }}
      />
      <AnimatedDiv
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `url('/images/layered-parallax/parallax-image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom'
        }}
      />
    </div>
  );
};

export default MultiLayerParallax;

'use client';

import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import AnimatedTitle from '@/components/animation-core/AnimatedTitle';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';

const MultiLayerParallax = () => {
  const wrappingDivRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrappingDivRef,
    offset: ['start start', 'end start'],
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
      className="w-full h-screen overflow-hidden relative grid place-items-center"
    >
      <AnimatedTitle
        style={{ y: textYPosition }}
        className="text-7xl md:text-9xl text-white font-bold relative z-10 mb-48"
      >
        Mountaintopia
      </AnimatedTitle>
      <AnimatedDiv
        className="absolute inset-0 z-0"
        style={{
          y: backgroundImageYPosition,
          backgroundImage: `url('/images/layered-parallax/full-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />
      <AnimatedDiv
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `url('/images/layered-parallax/parallax-image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />
    </div>
  );
};

export default MultiLayerParallax;

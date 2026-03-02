'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'motion/react';
import ParallaxImages from './ParallaxImages';

const SECTION_HEIGHT = 1500;

const Hero = () => {
  const { scrollY } = useScroll();

  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ['170%', '100%']
  );

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  return (
    <div
      className="relative w-full"
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
    >
      {/* BACKGROUND IMAGE */}
      <motion.div
        className="sticky top-0 h-screen w-full"
        style={{
          backgroundImage: `url('/images/smooth-scroll/hero-image.jpg')`,
          backgroundSize,
          clipPath,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity,
        }}
      />
      {/* GRADIENT BUFFER BETWEEN SECTIONS */}
      <div className="absolute bottom-0 h-72 left-0 right-0 bg-linear-to-b from-transparent to-zinc-950" />
      <ParallaxImages />
    </div>
  );
};

export default Hero;

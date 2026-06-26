'use client';

import ScrollDownIndicator from '@/components/ScrollDownIndicator';
import { motion, useScroll, useTransform } from '@repo/ui/animation';

/**
 * Fixed "Explore" hint anchored to the first viewport. Fades out as soon as the
 * user starts scrolling so it doesn't linger over the globe and the continents.
 */
const ScrollHint = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-10"
    >
      <ScrollDownIndicator />
    </motion.div>
  );
};

export default ScrollHint;

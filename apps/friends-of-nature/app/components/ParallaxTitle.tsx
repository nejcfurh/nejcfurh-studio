'use client';

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from 'framer-motion';
import { useRef } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  color?: string;
}

const ParallaxTitle = ({
  children,
  color = ''
}: ParallaxProps): React.ReactNode => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px 0px 0px 0px' });

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 80,
    stiffness: 200
  });

  // Set velocity only when in view
  const baseVelocity = isInView ? 3 : 0;

  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, baseVelocity],
    {
      clamp: false
    }
  );

  const customWrap = (min: number, max: number, v: number): number => {
    const range = max - min;

    return ((((v - min) % range) + range) % range) + min;
  };

  const x = useTransform(baseX, (v) => `${customWrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    if (!isInView) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() - moveBy);
  });

  return (
    <div
      ref={ref}
      className={`m-0 flex text-[${color}] h-24 flex-nowrap overflow-hidden whitespace-nowrap
      font-decoy`}
      style={{ color }}
    >
      <motion.div
        className="flex flex-nowrap whitespace-nowrap text-6xl font-semibold md:text-8xl"
        style={{ x }}
      >
        <span className="mr-8 block">{children}</span>
        <span className="mr-8 block">{children}</span>
        <span className="mr-8 block">{children}</span>
        <span className="mr-8 block">{children}</span>
      </motion.div>
    </div>
  );
};

export default ParallaxTitle;

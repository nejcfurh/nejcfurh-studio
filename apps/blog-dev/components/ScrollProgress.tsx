'use client';

import { useScroll, useSpring } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { JSX } from 'react';

const ScrollProgress = (): JSX.Element => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return <AnimatedDiv className="scroll-progress" style={{ scaleX }} />;
};

export default ScrollProgress;

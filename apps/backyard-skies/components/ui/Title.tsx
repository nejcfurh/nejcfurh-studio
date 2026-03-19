'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const Title = () => {
  return (
    <div className="mt-5 flex flex-col items-center">
      <AnimatedDiv
        className="mb-2 text-center font-serif text-7xl leading-none font-black tracking-tighter text-white italic drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
        initial={{ opacity: 0, scale: 0.85, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
      >
        Backyard Skies
      </AnimatedDiv>
      <AnimatedDiv
        className="font-geist-sans mb-4 text-4xl font-black tracking-tighter text-white/80 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
      >
        Wings of Survival
      </AnimatedDiv>
    </div>
  );
};

export default Title;

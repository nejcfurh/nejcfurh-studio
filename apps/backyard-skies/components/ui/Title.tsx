'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';

const Title = () => {
  return (
    <div className="mt-5 flex flex-col items-center">
      <AnimatedDiv
        className="mb-2 text-center font-serif text-7xl leading-none font-black tracking-tighter text-white italic [text-shadow:0_10px_20px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, scale: 0.85, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.25, delay: 0.05 }}
      >
        Backyard Skies
      </AnimatedDiv>
      <AnimatedDiv
        className="font-geist-sans mb-4 text-4xl font-black tracking-tighter text-white/80 [text-shadow:0_10px_20px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.25, delay: 0.2 }}
      >
        Wings of Survival
      </AnimatedDiv>
    </div>
  );
};

export default Title;

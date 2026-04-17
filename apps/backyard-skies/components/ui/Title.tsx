'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';

const Title = () => {
  return (
    <div className="mt-10 flex flex-col items-center">
      <AnimatedDiv
        className="mb-2 text-center font-serif text-7xl leading-none font-black tracking-tight text-white italic [text-shadow:0_10px_20px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, scale: 0.85, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.25, delay: 0.05 }}
      >
        Backyard Skies
      </AnimatedDiv>
      <AnimatedDiv
        className="font-display flex items-center gap-3 text-lg font-bold tracking-[0.3em] text-white/80 uppercase [text-shadow:0_4px_14px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.25, delay: 0.25 }}
      >
        <span className="inline-block h-px w-4 bg-white/40" />
        Wings of Survival
        <span className="inline-block h-px w-4 bg-white/40" />
      </AnimatedDiv>
    </div>
  );
};

export default Title;

'use client';

import { AnimatedButton, AnimatedDiv } from '@repo/ui/animation/core';
import { BiChevronLeft } from '@repo/ui/icons/react-icons/bi';
import { ReactNode } from 'react';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function PageHeader({
  title,
  onBack,
  rightSlot
}: {
  title: string;
  onBack: () => void;
  rightSlot?: ReactNode;
}) {
  return (
    <AnimatedDiv
      className="relative flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15 }}
    >
      <AnimatedButton
        onClick={onBack}
        className="relative z-10 flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-white"
        whileTap={{ scale: 0.85 }}
        transition={spring}
        aria-label="Back"
      >
        <BiChevronLeft className="text-3xl" />
      </AnimatedButton>
      <h1 className="font-display pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-widest whitespace-nowrap text-white/90 uppercase [text-shadow:0_4px_14px_rgba(0,0,0,0.5)]">
        {title}
      </h1>
      <div className="relative z-10">
        {rightSlot ?? <div className="h-[38px] w-[38px]" />}
      </div>
    </AnimatedDiv>
  );
}

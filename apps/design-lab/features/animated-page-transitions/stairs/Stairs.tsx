'use client';

import { motion, type Variants } from '@repo/ui/animation';
import { useState, type ReactNode } from 'react';

import { expand, opacity } from './anim';

const NB_OF_COLUMNS = 5;

// WHEN ANIMATING: INITIAL → ENTER. WHEN NOT: MOUNT STRAIGHT INTO THE SETTLED `REST` STATE WITH NO ANIMATION (FIRST LOAD / SILENT TOGGLE SWAPS).
const anim = (variants: Variants, animateEnter: boolean, custom?: number) => ({
  variants,
  custom,
  initial: animateEnter ? 'initial' : false,
  animate: animateEnter ? 'enter' : 'rest',
  exit: 'exit'
});

export default function Stairs({
  children,
  animateEnter: animateEnterProp = true
}: {
  children: ReactNode;
  animateEnter?: boolean;
}) {
  // FREEZE AT MOUNT SO THE PARENT FLIPPING THE FLAG CAN'T INTERRUPT A RUNNING ENTER ANIMATION.
  const [animateEnter] = useState(animateEnterProp);

  return (
    <div className="relative min-h-screen">
      {/* Dimming backdrop behind the columns. */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-1 h-screen w-full bg-(--transition-color)"
        {...anim(opacity, animateEnter)}
      />

      {/* Equal-width columns that stagger like a staircase. */}
      <div className="pointer-events-none fixed top-0 left-0 z-2 flex h-screen w-screen">
        {Array.from({ length: NB_OF_COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            className="relative h-full w-full bg-(--transition-color)"
            {...anim(expand, animateEnter, NB_OF_COLUMNS - i)}
          />
        ))}
      </div>

      {children}
    </div>
  );
}

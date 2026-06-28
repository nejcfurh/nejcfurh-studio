'use client';

import { motion } from '@repo/ui/animation';

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

interface LogoProps {
  expanded: boolean;
  reduce: boolean;
}

function Logo({ expanded, reduce }: LogoProps) {
  return (
    <div
      aria-label="Elysantium"
      className="ml-1.5 flex h-9 items-center justify-start px-3 text-2xl font-light tracking-wider text-[#d4a954] uppercase"
    >
      {/* The "E" is always shown; "lysantium" grows out of it. */}
      <span aria-hidden>E</span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ maxWidth: expanded ? 220 : 0, opacity: expanded ? 1 : 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }
        }
        className="overflow-hidden whitespace-nowrap"
      >
        lysantium
      </motion.span>
    </div>
  );
}

export default Logo;

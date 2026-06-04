import type { Variants } from '@repo/ui/animation';

// Subtle, refined easing — gentle ease-out, no overshoot.
const easeOut = [0.22, 0.61, 0.36, 1] as const;

// Container for the listings grid: orchestrates a soft stagger of its cards.
export const listingsGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  }
};

// Each card: a short fade + 8px rise.
export const listingCardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: easeOut
    }
  }
};

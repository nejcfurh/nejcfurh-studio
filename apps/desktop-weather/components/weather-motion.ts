import type { Variants } from '@repo/ui/animation';

// Subtle, refined easing — gentle ease-out, no overshoot.
const easeOut = [0.22, 0.61, 0.36, 1] as const;

/**
 * The hero lines carry explicit props rather than variant labels. A label on an
 * ancestor propagates down, and a clock digit mounting after that ancestor has
 * already settled on "visible" would adopt it as its initial state and never
 * animate. Explicit targets opt each line out of that propagation.
 */
export const heroLineMotion = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: easeOut, delay }
});

// For blocks that mount whenever their query happens to resolve.
export const revealMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: easeOut }
};

/**
 * A digit is keyed by its value, so it only remounts on the ticks it actually
 * changes on: most seconds move a single glyph and leave the rest still. This
 * runs 86400 times a day, so it stays on opacity and transform only.
 */
export const digitMotion = {
  initial: { opacity: 0, y: '-0.18em' },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: easeOut }
};

// Crossfades when an hourly refetch reports a different condition.
export const conditionSwapMotion = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.28, ease: easeOut }
};

// The forecast columns all mount together when the query resolves, so they can
// safely be staggered from their container.
export const forecastRowVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  }
};

export const forecastColumnVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOut
    }
  }
};

import type { Transition, Variants } from '@repo/ui/animation';

/**
 * Shared motion presets, aligned with nejcfurh.dev:
 * ease-out curve [0.16, 1, 0.3, 1] and 0.4–0.85s durations. Consumers wrap
 * these in `@repo/ui/animation/core` components and respect reduced motion
 * via `useReducedMotion` where the component is interactive.
 */

// The site-wide ease-out curve used across nejcfurh.dev.
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeOut } }
};

// Container that staggers its children's `visible` state.
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

// Card entrance: fade + rise into place.
export const cardItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};

// Viewport config for scroll-triggered reveals.
export const viewportOnce = { once: true, amount: 0.2 } as const;

export const reducedTransition: Transition = { duration: 0 };

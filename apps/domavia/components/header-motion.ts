import type { Variants } from '@repo/ui/animation';

// Subtle, refined easing — matches the rest of the app.
const easeOut = [0.22, 0.61, 0.36, 1] as const;

// The nav fades its links in slightly after the header bar has settled.
export const navContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.08
    }
  }
};

export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easeOut
    }
  }
};

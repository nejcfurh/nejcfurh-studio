import type { Variants } from '@repo/ui/animation';

// SHARED CUBIC-BEZIER EASINGS (TYPED AS TUPLES SO MOTION ACCEPTS THEM).
const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1];

export const text: Variants = {
  initial: {
    opacity: 1
  },
  enter: {
    opacity: 0,
    top: -100,
    transition: { duration: 0.75, delay: 0.35, ease: EASE_IN_OUT },
    transitionEnd: { top: '47.5%' }
  },
  exit: {
    opacity: 1,
    top: '40%',
    transition: { duration: 0.5, delay: 0.4, ease: EASE_OUT }
  }
};

export const curve = (initialPath: string, targetPath: string): Variants => ({
  initial: {
    d: initialPath
  },
  enter: {
    d: targetPath,
    transition: { duration: 0.75, delay: 0.35, ease: EASE_IN_OUT }
  },
  exit: {
    d: initialPath,
    transition: { duration: 0.75, ease: EASE_IN_OUT }
  }
});

export const translate: Variants = {
  initial: {
    top: '-300px'
  },
  enter: {
    top: '-100vh',
    transition: { duration: 0.75, delay: 0.35, ease: EASE_IN_OUT },
    transitionEnd: { top: '100vh' }
  },
  exit: {
    top: '-300px',
    transition: { duration: 0.75, ease: EASE_IN_OUT }
  }
};

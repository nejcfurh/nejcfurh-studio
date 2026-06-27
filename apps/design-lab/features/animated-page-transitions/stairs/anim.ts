import type { Variants } from '@repo/ui/animation';

const EASE: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

// `REST` IS THE SETTLED (COLLAPSED / INVISIBLE) END STATE, USED WITH INITIAL=FALSE TO MOUNT WITHOUT ANIMATING ON FIRST LOAD AND ON SILENT TOGGLES.
export const expand: Variants = {
  initial: {
    top: 0
  },
  enter: (i: number) => ({
    top: '100vh',
    transition: { duration: 0.4, delay: 0.05 * i, ease: EASE },
    transitionEnd: { height: '0', top: '0' }
  }),
  exit: (i: number) => ({
    height: '100vh',
    transition: { duration: 0.4, delay: 0.05 * i, ease: EASE }
  }),
  rest: {
    top: '0',
    height: '0'
  }
};

export const opacity: Variants = {
  initial: {
    opacity: 0.5
  },
  enter: {
    opacity: 0
  },
  exit: {
    opacity: 0.5
  },
  rest: {
    opacity: 0
  }
};

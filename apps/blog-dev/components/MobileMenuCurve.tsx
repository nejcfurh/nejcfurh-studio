'use client';

import { motion } from '@repo/ui/animation';
import { JSX, useMemo, useSyncExternalStore } from 'react';

const EASE = [0.76, 0, 0.24, 1] as const;

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getHeight = (): number => window.innerHeight;

/**
 * The flexing left edge of the sliding menu — a curved SVG that bulges outward
 * as the panel enters and flattens once it settles (ported from design-lab's
 * curved-menu animation). Its fill is the menu background so it reads as one
 * continuous surface.
 */
const MobileMenuCurve = (): JSX.Element | null => {
  const height = useSyncExternalStore(subscribe, getHeight, () => 0);

  const paths = useMemo(() => {
    if (height === 0) return null;

    // Filled panel shape (whole closed region).
    const fillInitial = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
    const fillTarget = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

    // Just the left curved edge, so the stroke only traces that side.
    const edgeInitial = `M100 ${height} Q-100 ${height / 2} 100 0`;
    const edgeTarget = `M100 ${height} Q100 ${height / 2} 100 0`;

    return {
      fill: {
        initial: { d: fillInitial },
        enter: { d: fillTarget, transition: { duration: 1, ease: EASE } },
        exit: { d: fillInitial, transition: { duration: 0.8, ease: EASE } }
      },
      edge: {
        initial: { d: edgeInitial },
        enter: { d: edgeTarget, transition: { duration: 1, ease: EASE } },
        exit: { d: edgeInitial, transition: { duration: 0.8, ease: EASE } }
      }
    };
  }, [height]);

  if (!paths) return null;

  return (
    <svg
      viewBox={`0 0 200 ${height}`}
      preserveAspectRatio="none"
      className="absolute top-0 -left-[99px] h-full w-[100px]"
      aria-hidden="true"
    >
      <motion.path
        variants={paths.fill}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fill-(--background)"
      />
      <motion.path
        variants={paths.edge}
        initial="initial"
        animate="enter"
        exit="exit"
        fill="none"
        className="stroke-(--accent)"
        strokeWidth={2}
        strokeOpacity={0.3}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default MobileMenuCurve;

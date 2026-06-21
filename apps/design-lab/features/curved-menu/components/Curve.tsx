'use client';

import { motion } from '@repo/ui/animation';
import { useMemo, useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getHeight() {
  return window.innerHeight;
}

const Curve = () => {
  const height = useSyncExternalStore(subscribe, getHeight, () => 0);

  const curve = useMemo(() => {
    if (height === 0) return null;

    const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
    const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

    const ease = [0.76, 0, 0.24, 1] as const;

    return {
      initial: { d: initialPath },
      enter: {
        d: targetPath,
        transition: { duration: 1, ease }
      },
      exit: {
        d: initialPath,
        transition: { duration: 0.8, ease }
      }
    };
  }, [height]);

  if (!curve) return null;

  return (
    <svg
      viewBox={`0 0 200 ${height}`}
      preserveAspectRatio="none"
      className="absolute top-0 -left-[99px] h-full w-[100px] fill-amber-50 stroke-none"
      aria-hidden="true"
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

export default Curve;

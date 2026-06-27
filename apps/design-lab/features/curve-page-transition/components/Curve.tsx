'use client';

import { motion, type Variants } from '@repo/ui/animation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { curve, text, translate } from '../anim';
import { ROUTE_LABELS } from '../constants';
import FrozenRouter from './FrozenRouter';

const anim = (variants: Variants) => ({
  variants,
  initial: 'initial',
  animate: 'enter',
  exit: 'exit'
});

export default function Curve({ children }: { children: ReactNode }) {
  // READ THE PATHNAME LIVE SO THE OVERLAY LABEL IS THE DESTINATION PAGE (IT FLIPS ON CLICK, EVEN ON THE STILL-MOUNTED EXITING CURVE). THE COLOR COMES FROM THE --CURVE-COLOR CSS VARIABLE ON THE PERSISTENT WRAPPER.
  const pathname = usePathname();
  const label = ROUTE_LABELS[pathname] ?? '';

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* COLORED COVER SHOWN UNTIL THE VIEWPORT IS MEASURED — PREVENTS A FLASH OF UN-REVEALED CONTENT ON FIRST PAINT, BEFORE THE SVG TAKES OVER. */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-40 h-[calc(100vh+600px)] w-screen bg-(--curve-color) transition-opacity delay-100 duration-0 ease-linear"
        style={{ opacity: dimensions.width === 0 ? 1 : 0 }}
      />

      <motion.p
        className="pointer-events-none fixed top-[40%] left-1/2 z-50 -translate-x-1/2 text-center text-[46px] text-white"
        {...anim(text)}
      >
        {label}
      </motion.p>

      {dimensions.width > 0 && (
        <Svg width={dimensions.width} height={dimensions.height} />
      )}

      <FrozenRouter>{children}</FrozenRouter>
    </div>
  );
}

function Svg({ width, height }: { width: number; height: number }) {
  const initialPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height + 300}
    Q${width / 2} ${height + 600} 0 ${height + 300}
    L0 0
  `;

  const targetPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
  `;

  return (
    <motion.svg
      className="pointer-events-none fixed top-0 left-0 z-40 h-[calc(100vh+600px)] w-screen fill-(--curve-color)"
      {...anim(translate)}
    >
      <motion.path {...anim(curve(initialPath, targetPath))} />
    </motion.svg>
  );
}

'use client';

import { motion, type Variants } from '@repo/ui/animation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { ROUTE_LABELS } from '../constants';
import { curve, text, translate } from './anim';

// WHEN ANIMATING: INITIAL → ENTER (THE WIPE). WHEN NOT: MOUNT STRAIGHT INTO THE SETTLED `REST` STATE WITH NO ANIMATION (FIRST LOAD / SILENT TOGGLE SWAPS).
const anim = (variants: Variants, animateEnter: boolean) => ({
  variants,
  initial: animateEnter ? 'initial' : false,
  animate: animateEnter ? 'enter' : 'rest',
  exit: 'exit'
});

export default function Curve({
  children,
  animateEnter: animateEnterProp = true
}: {
  children: ReactNode;
  animateEnter?: boolean;
}) {
  // FREEZE AT MOUNT SO THE PARENT FLIPPING THE FLAG CAN'T INTERRUPT A RUNNING ENTER ANIMATION.
  const [animateEnter] = useState(animateEnterProp);

  // READ THE PATHNAME LIVE SO THE OVERLAY LABEL IS THE DESTINATION PAGE. THE COLOR COMES FROM THE --TRANSITION-COLOR CSS VARIABLE ON THE PERSISTENT WRAPPER.
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
      {/* COLORED COVER THAT BRIDGES THE MEASURE GAP BEFORE THE SVG RENDERS — ONLY WHILE ACTUALLY ENTERING, SO IT NEVER FLASHES ON FIRST LOAD OR ON TOGGLE. */}
      {animateEnter && (
        <div
          className="pointer-events-none fixed top-0 left-0 z-40 h-[calc(100vh+600px)] w-screen bg-(--transition-color) transition-opacity delay-100 duration-0 ease-linear"
          style={{ opacity: dimensions.width === 0 ? 1 : 0 }}
        />
      )}

      <motion.p
        className="pointer-events-none fixed top-[40%] left-1/2 z-50 -translate-x-1/2 text-center text-[46px] text-white"
        {...anim(text, animateEnter)}
      >
        {label}
      </motion.p>

      {dimensions.width > 0 && (
        <Svg
          width={dimensions.width}
          height={dimensions.height}
          animateEnter={animateEnter}
        />
      )}

      {children}
    </div>
  );
}

function Svg({
  width,
  height,
  animateEnter
}: {
  width: number;
  height: number;
  animateEnter: boolean;
}) {
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
      className="pointer-events-none fixed top-0 left-0 z-40 h-[calc(100vh+600px)] w-screen fill-(--transition-color)"
      {...anim(translate, animateEnter)}
    >
      <motion.path {...anim(curve(initialPath, targetPath), animateEnter)} />
    </motion.svg>
  );
}

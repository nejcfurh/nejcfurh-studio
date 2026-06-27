'use client';

import BackButton from '@/components/buttons/BackButton';
import { AnimatePresence } from '@repo/ui/animation';
import { usePathname } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

import { FALLBACK_COLOR, ROUTE_COLORS } from '../constants';
import Curve from './Curve';
import CurveNav from './CurveNav';

export default function CurveTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Drive the curve color from a CSS variable on this persistent wrapper. It
  // flips to the TARGET route the instant navigation starts and cascades to both
  // the entering AND the still-mounted exiting curve, so the wipe is always the
  // target page's color (motion never needs to re-apply it).
  const color = ROUTE_COLORS[pathname] ?? FALLBACK_COLOR;

  return (
    <div style={{ '--curve-color': color } as CSSProperties}>
      <BackButton className="top-5 left-5" />
      <CurveNav />

      {/* AnimatePresence lives in the persistent layout (not in the swapping
          page), keyed by pathname, so it can run the exit of the old curve
          before the new one enters. */}
      <AnimatePresence mode="wait">
        <Curve key={pathname}>{children}</Curve>
      </AnimatePresence>
    </div>
  );
}

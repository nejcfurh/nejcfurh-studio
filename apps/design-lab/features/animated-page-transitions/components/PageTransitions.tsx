'use client';

import BackButton from '@/components/buttons/BackButton';
import { AnimatePresence } from '@repo/ui/animation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

import { FALLBACK_COLOR, ROUTE_COLORS } from '../constants';
import Curve from '../curve/Curve';
import Stairs from '../stairs/Stairs';
import FrozenRouter from './FrozenRouter';
import Nav from './Nav';
import TransitionToggle, { type TransitionMode } from './TransitionToggle';

export default function PageTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<TransitionMode>('curve');

  // DETERMINISTICALLY FALSE ON THE FIRST COMMITTED RENDER, TRUE AFTER MOUNT — SO OVERLAYS MOUNTED ON FIRST LOAD FREEZE ANIMATEENTER=FALSE (NO ENTRANCE).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // DRIVE THE TRANSITION COLOR FROM A CSS VARIABLE ON THIS PERSISTENT WRAPPER (USED BY BOTH THE CURVE AND THE STAIRS). IT FLIPS TO THE TARGET ROUTE THE INSTANT NAVIGATION STARTS AND CASCADES TO BOTH THE ENTERING AND THE STILL-MOUNTED EXITING OVERLAY.
  const color = ROUTE_COLORS[pathname] ?? FALLBACK_COLOR;

  return (
    <div style={{ '--transition-color': color } as CSSProperties}>
      <BackButton className="top-5 left-5" />
      <Nav />
      <TransitionToggle mode={mode} onChange={setMode} />

      {/* initial={false} HARD-STOPS ANY ENTRANCE ANIMATION ON THE FIRST LOAD. KEYED BY PATHNAME ONLY, SO TOGGLING NEVER RE-KEYS (NO TRANSITION). */}
      <AnimatePresence mode="wait" initial={false}>
        <Stage key={pathname} mode={mode} ready={mounted}>
          <FrozenRouter>{children}</FrozenRouter>
        </Stage>
      </AnimatePresence>
    </div>
  );
}

function Stage({
  mode,
  ready,
  children
}: {
  mode: TransitionMode;
  ready: boolean;
  children: ReactNode;
}) {
  // animateEnter IS TRUE ONLY ON THIS STAGE'S MOUNT RENDER (A NAVIGATION) AND ONLY AFTER THE APP HAS MOUNTED (NOT FIRST LOAD). ON A TOGGLE THE STAGE JUST RE-RENDEERS, SO IT'S FALSE: THE NEW STYLE SWAPS IN AT REST (SILENT) AND IS THEN READY TO ANIMATE ITS EXIT ON THE NEXT NAVIGATION. THE OVERLAY FREEZES THIS VALUE, SO THE LATER FLIP TO FALSE CAN'T INTERRUPT A RUNNING ENTER.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    // MUST RUN POST-COMMIT: THE FIRST COMMITTED RENDER NEEDS ENTERED=FALSE SO THE OVERLAY CAPTURES ANIMATEENTER=TRUE ON A NAVIGATION MOUNT.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntered(true);
  }, []);

  const animateEnter = ready && !entered;

  return mode === 'stairs' ? (
    <Stairs animateEnter={animateEnter}>{children}</Stairs>
  ) : (
    <Curve animateEnter={animateEnter}>{children}</Curve>
  );
}

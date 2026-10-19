'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, useReducedMotion } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import {
  PiBirdBold,
  PiHandGrabbingBold,
  PiHandTapBold,
  PiWarningBold
} from '@repo/ui/icons/react-icons/pi';
import {
  ComponentType,
  useEffect,
  useState,
  useSyncExternalStore
} from 'react';

import {
  advanceTutorial,
  INITIAL_TUTORIAL_STATE,
  TutorialSnapshot,
  TutorialState,
  TutorialStep
} from './tutorialFlow';

const STORAGE_KEY = 'backyard-skies-tutorial-done';
const EAGLE_RED = '#FF5252';

const doneListeners = new Set<() => void>();

export function readTutorialDone(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function writeTutorialDone(done: boolean): void {
  try {
    if (done) localStorage.setItem(STORAGE_KEY, 'true');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the tutorial then simply shows again.
  }
  doneListeners.forEach((listener) => listener());
}

function subscribeDone(listener: () => void): () => void {
  doneListeners.add(listener);
  return () => doneListeners.delete(listener);
}

/** True once the player finished or skipped the first-run prompts. */
export function useTutorialDone(): boolean {
  return useSyncExternalStore(subscribeDone, readTutorialDone, () => true);
}

type GameSnapshot = ReturnType<typeof useGameStore.getState>;

function toSnapshot(s: GameSnapshot): TutorialSnapshot {
  return {
    sceneReady: s.sceneReady,
    gameState: s.gameState,
    gameTime: s.gameTime,
    flapsThisRun: s.flapsThisRun,
    isGliding: s.isGliding,
    threatType: s.threatType,
    eagleAltitudeHunt: s.eagleAltitudeHunt
  };
}

interface Prompt {
  title: string;
  detail?: string;
  Icon: ComponentType<{ className?: string }>;
  danger?: boolean;
}

function promptFor(step: TutorialStep, gameState: string): Prompt {
  switch (step) {
    case 'flap':
      return { title: 'Tap to flap', Icon: PiHandTapBold };
    case 'glide':
      return {
        title: 'Hold to glide',
        detail: 'Drag left or right to steer',
        Icon: PiHandGrabbingBold
      };
    case 'food':
      return {
        title: 'Find food & water',
        detail: 'Follow the glowing edges',
        Icon: EdgeDots
      };
    case 'perch':
      return {
        title: gameState === 'drinking' ? 'Drinking!' : 'Eating!',
        detail: 'Tap to fly away before the meter fills',
        Icon: PiBirdBold
      };
    case 'eagle':
      return {
        title: 'Eagle!',
        detail: 'Turn hard or dive',
        Icon: PiWarningBold,
        danger: true
      };
  }
}

function EdgeDots({ className }: { className?: string }) {
  return (
    <span className={['flex items-center gap-1', className].join(' ')}>
      <span className="h-2 w-2 rounded-full bg-[#4CAF50] shadow-[0_0_6px_#4CAF50]" />
      <span className="h-2 w-2 rounded-full bg-[#00AEEF] shadow-[0_0_6px_#00AEEF]" />
    </span>
  );
}

export default function Tutorial() {
  const [doneAtStart] = useState(readTutorialDone);
  const [skipped, setSkipped] = useState(false);
  const [state, setState] = useState<TutorialState>(INITIAL_TUTORIAL_STATE);
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const catThreat = useGameStore((s) => s.threatType === 'cat');
  const perched = gameState === 'feeding' || gameState === 'drinking';
  const flightWarning = useGameStore(
    (s) =>
      s.gameState === 'flight' &&
      (s.threatType === 'eagle' || s.groundTimer > 0)
  );
  const reduceMotion = useReducedMotion();

  const active = !doneAtStart && !skipped;

  useEffect(() => {
    if (!active) return;
    let current = INITIAL_TUTORIAL_STATE;
    let runId = useGameStore.getState().runId;
    const apply = (s: GameSnapshot) => {
      const base = s.runId === runId ? current : INITIAL_TUTORIAL_STATE;
      runId = s.runId;
      const next = advanceTutorial(base, toSnapshot(s));
      if (next === current) return;
      current = next;
      setState(next);
    };
    apply(useGameStore.getState());
    return useGameStore.subscribe(apply);
  }, [active]);

  useEffect(() => {
    if (state.finished) writeTutorialDone(true);
  }, [state.finished]);

  const skip = () => {
    setSkipped(true);
    writeTutorialDone(true);
  };

  // The cat overlay owns the lower screen while perched; it already says to fly away.
  const visible =
    active && !isPaused && !catThreat && gameState !== 'dying' && state.step;
  const prompt =
    visible && state.step ? promptFor(state.step, gameState) : null;
  const offset = reduceMotion ? 0 : 12;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-40 flex justify-center px-4"
      // The perch meter and the flight warning pill use the 60px slot; stack above them.
      style={{
        bottom: `calc(max(30px, env(safe-area-inset-bottom)) + ${perched || flightWarning ? 124 : 60}px)`
      }}
    >
      <AnimatePresence mode="wait">
        {prompt && state.step && (
          <AnimatedDiv
            key={state.step}
            role="status"
            className="flex max-w-full items-center gap-3 rounded-[18px] border bg-black/45 py-2.5 pr-2 pl-3 backdrop-blur-xl"
            style={{
              borderColor: prompt.danger
                ? 'rgba(255,61,0,0.35)'
                : 'rgba(255,255,255,0.12)'
            }}
            initial={{ opacity: 0, y: offset, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: offset / 2 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-base"
              style={{
                background: prompt.danger
                  ? 'rgba(255,82,82,0.18)'
                  : 'rgba(255,255,255,0.1)',
                color: prompt.danger ? EAGLE_RED : '#fff'
              }}
            >
              <prompt.Icon />
            </span>
            <span className="flex min-w-0 flex-col">
              <span
                className="font-display text-sm leading-tight font-extrabold tracking-[0.04em] uppercase"
                style={{ color: prompt.danger ? EAGLE_RED : '#fff' }}
              >
                {prompt.title}
              </span>
              {prompt.detail && (
                <span className="text-xs leading-snug text-white/80">
                  {prompt.detail}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={skip}
              className="font-display pointer-events-auto ml-1 shrink-0 cursor-pointer self-stretch rounded-[12px] px-2 text-[10px] font-bold tracking-[0.12em] text-white/45 uppercase"
              aria-label="Skip tutorial"
            >
              Skip
            </button>
          </AnimatedDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

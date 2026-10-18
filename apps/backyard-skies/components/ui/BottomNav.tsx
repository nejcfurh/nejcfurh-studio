'use client';

import { useGameStore } from '@/store/gameStore';
import {
  PiArrowUpBold,
  PiPauseFill,
  PiPlayFill,
  PiX
} from '@repo/ui/icons/react-icons/pi';

import { useTutorialDone } from './Tutorial';

const FLAP_HINT_LIMIT = 5;

export default function BottomNav() {
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const flapsThisRun = useGameStore((s) => s.flapsThisRun);
  const tutorialDone = useTutorialDone();

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking';

  if (!isPlaying) return null;

  // First runs get the tutorial prompts in this hint's place instead.
  const showHint = tutorialDone && flapsThisRun < FLAP_HINT_LIMIT;

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-50 flex items-center justify-between gap-2 px-4 pb-[max(30px,env(safe-area-inset-bottom))]">
      <button
        onClick={isPaused ? resumeGame : pauseGame}
        className="pointer-events-auto flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl"
        aria-label={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <PiPlayFill className="text-lg" />
        ) : (
          <PiPauseFill className="text-lg" />
        )}
      </button>

      {/* Tap to flap / hold to glide hint — centered, fades after flaps */}
      <div
        className={[
          'pointer-events-none flex min-w-0 items-center gap-1.5 rounded-[18px] border border-white/10 bg-white/5 py-2.5 pr-2.5 pl-2 backdrop-blur-xl',
          'transition-all duration-400 ease-out',
          showHint ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        ].join(' ')}
        aria-hidden={!showHint}
      >
        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
          <PiArrowUpBold className="text-sm" />
        </div>
        <span className="font-display text-[10.5px] font-bold tracking-[0.04em] whitespace-nowrap text-white/80 uppercase">
          Tap to Flap · Hold to Glide
        </span>
      </div>

      <button
        onClick={() => setGameState('menu')}
        className="pointer-events-auto flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-xl"
        aria-label="Exit to menu"
      >
        <PiX className="text-lg" />
      </button>
    </div>
  );
}

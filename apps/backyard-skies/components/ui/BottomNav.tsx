'use client';

import { useGameStore } from '@/store/gameStore';
import {
  PiArrowUpBold,
  PiPauseFill,
  PiPlayFill,
  PiX
} from '@repo/ui/icons/react-icons/pi';

const FLAP_HINT_LIMIT = 5;

export default function BottomNav() {
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const flapsThisRun = useGameStore((s) => s.flapsThisRun);

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking';

  if (!isPlaying) return null;

  const showHint = flapsThisRun < FLAP_HINT_LIMIT;

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-50 flex items-center justify-between px-4 pb-[max(30px,env(safe-area-inset-bottom))]">
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

      {/* Tap to flap hint — centered, fades after flaps */}
      <div
        className={[
          'pointer-events-none flex items-center gap-2.5 rounded-[18px] border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-xl',
          'transition-all duration-400 ease-out',
          showHint ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        ].join(' ')}
        aria-hidden={!showHint}
      >
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-white/10 text-white">
          <PiArrowUpBold className="text-sm" />
        </div>
        <span className="font-display text-xs font-bold tracking-widest text-white/80 uppercase">
          Tap to Flap
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

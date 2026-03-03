'use client';

import { useGameStore } from '@/store/gameStore';
import { PiPause, PiPlay, PiX } from 'react-icons/pi';

export default function BottomNav() {
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const setGameState = useGameStore((s) => s.setGameState);

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking';

  if (!isPlaying) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-between px-6 pb-[max(16px,env(safe-area-inset-bottom))]">
      <button
        onClick={isPaused ? resumeGame : pauseGame}
        className="pointer-events-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white backdrop-blur-xl"
      >
        {isPaused ? (
          <PiPlay className="text-3xl" />
        ) : (
          <PiPause className="text-3xl" />
        )}
      </button>

      <button
        onClick={() => setGameState('menu')}
        className="pointer-events-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white/60 backdrop-blur-xl"
      >
        <PiX className="text-3xl" />
      </button>
    </div>
  );
}

'use client';

import { useGameStore } from '@/store/gameStore';
import { PiPause, PiPlay, PiX } from 'react-icons/pi';

export default function BottomNav() {
  const gameState = useGameStore(s => s.gameState);
  const isPaused = useGameStore(s => s.isPaused);
  const pauseGame = useGameStore(s => s.pauseGame);
  const resumeGame = useGameStore(s => s.resumeGame);
  const setGameState = useGameStore(s => s.setGameState);

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking';

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between px-6 pb-[max(16px,env(safe-area-inset-bottom))]">
      <button
        onClick={isPaused ? resumeGame : pauseGame}
        className="pointer-events-auto w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-white text-2xl cursor-pointer flex items-center justify-center"
      >
        {isPaused ? (
          <PiPlay className="text-3xl" />
        ) : (
          <PiPause className="text-3xl" />
        )}
      </button>

      <button
        onClick={() => setGameState('menu')}
        className="pointer-events-auto w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-white/60 text-2xl cursor-pointer flex items-center justify-center"
      >
        <PiX className="text-3xl" />
      </button>
    </div>
  );
}

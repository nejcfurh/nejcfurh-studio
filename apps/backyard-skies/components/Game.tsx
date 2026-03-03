'use client';

import BottomNav from '@/components/ui/BottomNav';
import DeathTransition from '@/components/ui/DeathTransition';
import FeederDirectionHint from '@/components/ui/FeederDirectionHint';
import GameOverScreen from '@/components/ui/GameOverScreen';
import HUD from '@/components/ui/HUD';
import SettingsScreen from '@/components/ui/SettingsScreen';
import SpeciesSelect from '@/components/ui/SpeciesSelect';
import StartMenu from '@/components/ui/StartMenu';
import ThreatWarning from '@/components/ui/ThreatWarning';
import { useGameStore } from '@/store/gameStore';
import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#0a1628' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full"
          style={{
            border: '4px solid rgba(0,174,239,0.2)',
            borderTopColor: '#00AEEF'
          }}
        />
        <p
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            letterSpacing: '0.15em'
          }}
        >
          LOADING...
        </p>
      </div>
    </div>
  )
});

function MobileOnly() {
  return (
    <div className="bg-background fixed inset-0 z-100 hidden flex-col items-center justify-center px-8 text-center md:flex">
      <p className="mb-6 text-5xl">🐦</p>
      <h1 className="mb-3 text-2xl font-bold text-white">Mobile Only</h1>
      <p className="max-w-sm text-base leading-relaxed text-white/50">
        Backyard Skies is designed for mobile devices. Open this page on your
        phone to play.
      </p>
    </div>
  );
}

export default function Game() {
  const gameState = useGameStore((s) => s.gameState);

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking' ||
    gameState === 'dying';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#0a1628',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <MobileOnly />

      {/* 3D Canvas */}
      <GameCanvas />

      {/* UI overlays */}
      {gameState === 'menu' && <StartMenu />}
      {gameState === 'species-select' && <SpeciesSelect />}
      {gameState === 'game-over' && <GameOverScreen />}
      {gameState === 'settings' && <SettingsScreen />}

      {isPlaying && (
        <>
          <HUD />
          <ThreatWarning />
          <BottomNav />
          <FeederDirectionHint />
        </>
      )}

      {gameState === 'dying' && <DeathTransition />}
    </div>
  );
}

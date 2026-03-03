'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/gameStore';
import StartMenu from '@/components/ui/StartMenu';
import SpeciesSelect from '@/components/ui/SpeciesSelect';
import GameOverScreen from '@/components/ui/GameOverScreen';
import SettingsScreen from '@/components/ui/SettingsScreen';
import HUD from '@/components/ui/HUD';
import ThreatWarning from '@/components/ui/ThreatWarning';
import BottomNav from '@/components/ui/BottomNav';
import FeederDirectionHint from '@/components/ui/FeederDirectionHint';
import DeathTransition from '@/components/ui/DeathTransition';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#0a1628' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            border: '4px solid rgba(0,174,239,0.2)',
            borderTopColor: '#00AEEF',
          }}
        />
        <p
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            letterSpacing: '0.15em',
          }}
        >
          LOADING...
        </p>
      </div>
    </div>
  ),
});

function MobileOnly() {
  return (
    <div className="hidden md:flex fixed inset-0 z-100 bg-background flex-col items-center justify-center px-8 text-center">
      <p className="text-5xl mb-6">🐦</p>
      <h1 className="text-2xl font-bold text-white mb-3">Mobile Only</h1>
      <p className="text-base text-white/50 max-w-sm leading-relaxed">
        Backyard Skies is designed for mobile devices. Open this page on your
        phone to play.
      </p>
    </div>
  );
}

export default function Game() {
  const gameState = useGameStore(s => s.gameState);

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
        userSelect: 'none',
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

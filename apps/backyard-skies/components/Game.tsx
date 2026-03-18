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
import { useEffect, useState } from 'react';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 flex items-center justify-center"
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

const TIPS = [
  {
    icon: '\u{1F54A}',
    title: 'Flying',
    tips: [
      'Tap/click to flap and gain altitude',
      'Tap left to turn left, right to turn right',
      'Stop flapping to glide and descend'
    ]
  },
  {
    icon: '\u{1F33E}',
    title: 'Food & Water',
    tips: [
      'Watch the gauges \u2014 they drain as you fly',
      'Land on feeders to eat, birdbaths to drink',
      'Green glow = feeder, Blue glow = birdbath'
    ]
  },
  {
    icon: '\u{1F431}',
    title: 'Dangers',
    tips: [
      'Some feeders have a cat lurking nearby',
      'Eagles hunt you periodically during flight',
      'Hit the ground and a cat catches you'
    ]
  },
  {
    icon: '\u{1F985}',
    title: 'Eagle Evasion',
    tips: [
      'Turn hard (90\u00B0) during the dodge window',
      'Near altitude limit? Tap rapidly (3 taps)',
      'Dodging an eagle earns bonus points!'
    ]
  },
  {
    icon: '\u{2B06}',
    title: 'Altitude',
    tips: [
      'Fly too high and an eagle hunts you',
      '4 seconds to descend \u2014 stop flapping!',
      'Drop below warning level to escape'
    ]
  },
  {
    icon: '\u{2B50}',
    title: 'Scoring',
    tips: [
      'Score increases over time as you fly',
      'Eating and drinking earns extra points',
      'Each bird species has different stats'
    ]
  }
];

function DesktopBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glowing orbs */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: 500,
          height: 500,
          top: '-10%',
          left: '-5%',
          background:
            'radial-gradient(circle, rgba(0,174,239,0.15) 0%, transparent 70%)'
        }}
      />
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: 600,
          height: 600,
          bottom: '-15%',
          right: '-8%',
          background:
            'radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%)'
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: 400,
          height: 400,
          top: '50%',
          left: '15%',
          transform: 'translateY(-50%)',
          background:
            'radial-gradient(circle, rgba(224,64,251,0.08) 0%, transparent 70%)'
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: 350,
          height: 350,
          top: '20%',
          right: '10%',
          background:
            'radial-gradient(circle, rgba(0,174,239,0.1) 0%, transparent 70%)'
        }}
      />

      {/* Floating particles (same as mobile menu) */}
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            left: `${(i * 13) % 100}%`,
            top: `${(i * 19) % 100}%`,
            background:
              i % 3 === 0
                ? 'rgba(0,174,239,0.4)'
                : i % 3 === 1
                  ? 'rgba(76,175,80,0.35)'
                  : 'rgba(255,255,255,0.25)',
            animation: `float-particle ${3 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.2) % 4}s`
          }}
        />
      ))}
    </div>
  );
}

function DesktopTipsPanel({ side }: { side: 'left' | 'right' }) {
  const tipsSlice = side === 'left' ? TIPS.slice(0, 3) : TIPS.slice(3, 6);

  return (
    <div
      className="pointer-events-none flex w-64 shrink-0 flex-col gap-3"
      style={{
        opacity: 0.85
      }}
    >
      {side === 'left' && (
        <div className="mb-2">
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase"
            style={{ color: 'rgba(0,174,239,0.6)' }}
          >
            Tips & Tricks
          </p>
        </div>
      )}
      {tipsSlice.map((section) => (
        <div
          key={section.title}
          className="rounded-2xl border border-white/6 p-4"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white/80">
            <span>{section.icon}</span> {section.title}
          </p>
          <ul className="flex list-none flex-col gap-1.5 pl-0">
            {section.tips.map((tip, i) => (
              <li key={i} className="text-xs leading-relaxed text-white/40">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {side === 'right' && (
        <div className="mt-2 text-center">
          <p className="text-[10px] text-white/20">
            Click to flap &middot; Desktop mode
          </p>
        </div>
      )}
    </div>
  );
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, #0d1f3c 0%, #060e1a 50%, #030810 100%)'
      }}
    >
      <DesktopBackground />

      {/* Layout: tips - phone - tips */}
      <div className="relative z-10 flex items-center gap-10">
        {/* Left tips */}
        <div className="hidden xl:flex">
          <DesktopTipsPanel side="left" />
        </div>

        {/* iPhone shell */}
        <div
          className="relative shrink-0"
          style={{
            width: 375,
            height: 725,
            maxHeight: 'calc(100vh - 40px)',
            borderRadius: 50,
            border: '6px solid #1a1a1a',
            boxShadow:
              '0 0 0 2px #333, 0 0 80px rgba(0,174,239,0.08), 0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 2px #111',
            overflow: 'hidden',
            background: '#0a1628'
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 z-60"
            style={{
              transform: 'translateX(-50%)',
              width: 150,
              height: 28,
              background: '#1a1a1a',
              borderRadius: '0 0 20px 20px'
            }}
          />
          {/* Screen content — transform creates a containing block for fixed children */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ transform: 'translateZ(0)' }}
          >
            {children}
          </div>
        </div>

        {/* Right tips */}
        <div className="hidden xl:flex">
          <DesktopTipsPanel side="right" />
        </div>
      </div>
    </div>
  );
}

function GameContent() {
  const gameState = useGameStore((s) => s.gameState);

  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking' ||
    gameState === 'dying';

  return (
    <>
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
    </>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

export default function Game() {
  const isDesktop = useIsDesktop();

  const content = (
    <div className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
      <GameContent />
    </div>
  );

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
      {isDesktop ? <IPhoneFrame>{content}</IPhoneFrame> : content}
    </div>
  );
}

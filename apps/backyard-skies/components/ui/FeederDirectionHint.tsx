'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { isFeederLocked } from '@/lib/feederManager';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { useEffect, useState } from 'react';

function normalizeAngle(a: number): number {
  let r = a % (Math.PI * 2);
  if (r > Math.PI) r -= Math.PI * 2;
  if (r < -Math.PI) r += Math.PI * 2;
  return r;
}

interface Hint {
  color: string;
  relAngle: number;
  urgency: number;
}

type GameSnapshot = ReturnType<typeof useGameStore.getState>;

const HINT_REFRESH_MS = 100;

function nearestOfType(
  state: GameSnapshot,
  type: FeederData['type']
): FeederData | null {
  const [px, , pz] = state.position;
  let best: FeederData | null = null;
  let bestDist = Infinity;
  for (const f of state.feeders) {
    if (f.type !== type || isFeederLocked(f, state.gameTime)) continue;
    const d = Math.hypot(f.position[0] - px, f.position[2] - pz);
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  return best;
}

function computeHints(state: GameSnapshot): Hint[] {
  if (state.gameState !== 'flight') return [];
  const { attributes } = BIRD_SPECIES[state.selectedSpecies];
  const [px, , pz] = state.position;

  const toHint = (
    feeder: FeederData | null,
    color: string,
    fill: number
  ): Hint[] => {
    if (!feeder) return [];
    const worldAngle = Math.atan2(
      feeder.position[0] - px,
      feeder.position[2] - pz
    );
    return [
      {
        color,
        relAngle: normalizeAngle(worldAngle - state.rotation),
        urgency: 0.15 + 0.55 * (1 - fill)
      }
    ];
  };

  return [
    ...toHint(
      nearestOfType(state, 'feeder'),
      '#4CAF50',
      state.food / attributes.maxFood
    ),
    ...toHint(
      nearestOfType(state, 'birdbath'),
      '#00AEEF',
      state.water / attributes.maxWater
    )
  ];
}

function hintsDiffer(a: Hint[], b: Hint[]): boolean {
  if (a.length !== b.length) return true;
  return a.some(
    (h, i) =>
      h.color !== b[i].color ||
      Math.abs(h.relAngle - b[i].relAngle) > 0.03 ||
      Math.abs(h.urgency - b[i].urgency) > 0.01
  );
}

// Polled at 10 Hz instead of selecting position/rotation, which change every frame.
export default function FeederDirectionHint() {
  const gameState = useGameStore((s) => s.gameState);
  const [hints, setHints] = useState<Hint[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = computeHints(useGameStore.getState());
      setHints((prev) => (hintsDiffer(prev, next) ? next : prev));
    }, HINT_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (gameState !== 'flight' || hints.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {hints.map((hint, idx) => (
        <EdgeGlow
          key={idx}
          color={hint.color}
          relAngle={hint.relAngle}
          urgency={hint.urgency}
        />
      ))}
    </div>
  );
}

function EdgeGlow({
  color,
  relAngle,
  urgency
}: {
  color: string;
  relAngle: number;
  urgency: number;
}) {
  // MAP RELATIVE ANGLE TO EDGE OPACITIES
  // 0 → AHEAD → TOP; ±π/2 → LEFT/RIGHT; π → BEHIND → BOTTOM
  // CAMERA IS BEHIND BIRD LOOKING FORWARD, SO "AHEAD" IN BIRD'S FACING = TOP OF SCREEN
  const topWeight = Math.max(0, Math.cos(relAngle));
  const bottomWeight = Math.max(0, -Math.cos(relAngle));
  const rightWeight = Math.max(0, Math.sin(relAngle));
  const leftWeight = Math.max(0, -Math.sin(relAngle));

  const edges = [
    { side: 'top' as const, weight: topWeight },
    { side: 'bottom' as const, weight: bottomWeight },
    { side: 'left' as const, weight: leftWeight },
    { side: 'right' as const, weight: rightWeight }
  ];

  return (
    <>
      {edges.map(({ side, weight }) => {
        const opacity = weight * urgency;
        if (opacity < 0.02) return null;

        const style: React.CSSProperties = {
          position: 'absolute',
          opacity,
          animation: 'pulse 2s ease-in-out infinite'
        };

        if (side === 'top') {
          style.top = 0;
          style.left = 0;
          style.right = 0;
          style.height = '80px';
          style.background = `linear-gradient(to bottom, ${color}, transparent)`;
        } else if (side === 'bottom') {
          style.bottom = 0;
          style.left = 0;
          style.right = 0;
          style.height = '80px';
          style.background = `linear-gradient(to top, ${color}, transparent)`;
        } else if (side === 'left') {
          style.top = 0;
          style.bottom = 0;
          style.left = 0;
          style.width = '80px';
          style.background = `linear-gradient(to right, ${color}, transparent)`;
        } else {
          style.top = 0;
          style.bottom = 0;
          style.right = 0;
          style.width = '80px';
          style.background = `linear-gradient(to left, ${color}, transparent)`;
        }

        return <div key={side} style={style} />;
      })}
    </>
  );
}

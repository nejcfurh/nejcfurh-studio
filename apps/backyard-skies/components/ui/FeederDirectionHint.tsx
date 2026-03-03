'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BIRD_SPECIES } from '@/lib/birdSpecies';

function normalizeAngle(a: number): number {
  let r = a % (Math.PI * 2);
  if (r > Math.PI) r -= Math.PI * 2;
  if (r < -Math.PI) r += Math.PI * 2;
  return r;
}

export default function FeederDirectionHint() {
  const position = useGameStore(s => s.position);
  const rotation = useGameStore(s => s.rotation);
  const feeders = useGameStore(s => s.feeders);
  const food = useGameStore(s => s.food);
  const water = useGameStore(s => s.water);
  const selectedSpecies = useGameStore(s => s.selectedSpecies);
  const gameState = useGameStore(s => s.gameState);

  const species = BIRD_SPECIES[selectedSpecies];

  const hints = useMemo(() => {
    if (gameState !== 'flight') return [];

    const unlocked = feeders.filter(
      f => !f.lockedUntil || f.lockedUntil <= new Date().getTime(),
    );
    const nearestFeeder = unlocked
      .filter(f => f.type === 'feeder')
      .reduce<{ dist: number; f: (typeof unlocked)[0] } | null>((best, f) => {
        const dx = f.position[0] - position[0];
        const dz = f.position[2] - position[2];
        const d = Math.sqrt(dx * dx + dz * dz);
        return !best || d < best.dist ? { dist: d, f } : best;
      }, null);

    const nearestBath = unlocked
      .filter(f => f.type === 'birdbath')
      .reduce<{ dist: number; f: (typeof unlocked)[0] } | null>((best, f) => {
        const dx = f.position[0] - position[0];
        const dz = f.position[2] - position[2];
        const d = Math.sqrt(dx * dx + dz * dz);
        return !best || d < best.dist ? { dist: d, f } : best;
      }, null);

    const result: Array<{
      color: string;
      relAngle: number;
      urgency: number;
    }> = [];

    if (nearestFeeder) {
      const worldAngle = Math.atan2(
        nearestFeeder.f.position[0] - position[0],
        nearestFeeder.f.position[2] - position[2],
      );
      const relAngle = normalizeAngle(worldAngle - rotation);
      const urgency = 0.15 + 0.55 * (1 - food / species.attributes.maxFood);
      result.push({ color: '#4CAF50', relAngle, urgency });
    }

    if (nearestBath) {
      const worldAngle = Math.atan2(
        nearestBath.f.position[0] - position[0],
        nearestBath.f.position[2] - position[2],
      );
      const relAngle = normalizeAngle(worldAngle - rotation);
      const urgency = 0.15 + 0.55 * (1 - water / species.attributes.maxWater);
      result.push({ color: '#00AEEF', relAngle, urgency });
    }

    return result;
  }, [gameState, feeders, position, rotation, food, water, species]);

  if (gameState !== 'flight' || hints.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
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
  urgency,
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
    { side: 'right' as const, weight: rightWeight },
  ];

  return (
    <>
      {edges.map(({ side, weight }) => {
        const opacity = weight * urgency;
        if (opacity < 0.02) return null;

        const style: React.CSSProperties = {
          position: 'absolute',
          opacity,
          animation: 'pulse 2s ease-in-out infinite',
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

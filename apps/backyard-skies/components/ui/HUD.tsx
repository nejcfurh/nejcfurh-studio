'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { ACCENT } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import {
  RESOURCE_CRITICAL_THRESHOLD,
  RESOURCE_WARNING_THRESHOLD
} from '@/utils/constants';
import { AnimatePresence, useReducedMotion } from '@repo/ui/animation';
import { AnimatedSpan } from '@repo/ui/animation/core';
import { BsFillDropletFill } from '@repo/ui/icons/react-icons/bs';
import { FaWheatAwn } from '@repo/ui/icons/react-icons/fa6';
import { PiCompassBold } from '@repo/ui/icons/react-icons/pi';
import { useEffect, useId, useState } from 'react';

const FOOD_COLOR = '#b9f05a';
const FOOD_DEEP = '#3a5a1a';
const WATER_COLOR = '#65e7ff';
const WATER_DEEP = '#0a4a6a';
// Per-frame time and distance points stay far below this; only one-off bonuses reach it.
const SCORE_BURST_MIN = 25;
const SCORE_BURST_MS = 1100;

export default function HUD() {
  // Selectors round to what is displayed so the HUD re-renders on visible change, not per frame.
  const foodPct = useGameStore((s) =>
    Math.round(
      (s.food / BIRD_SPECIES[s.selectedSpecies].attributes.maxFood) * 100
    )
  );
  const waterPct = useGameStore((s) =>
    Math.round(
      (s.water / BIRD_SPECIES[s.selectedSpecies].attributes.maxWater) * 100
    )
  );
  const score = useGameStore((s) => Math.floor(s.score));
  const distance = useGameStore((s) => Math.round(s.distance * 100) / 100);
  const gameState = useGameStore((s) => s.gameState);

  const showFeedingState = gameState === 'feeding' || gameState === 'drinking';

  return (
    <div className="pointer-events-none absolute inset-0 z-50 md:mt-5">
      {/* TOP BAR */}
      <div className="flex items-start justify-between px-4 pt-[max(18px,env(safe-area-inset-top))]">
        <ResourceRing
          value={foodPct}
          color={FOOD_COLOR}
          deep={FOOD_DEEP}
          label="FIND FEEDER"
          Icon={FaWheatAwn}
        />

        {/* SCORE + DISTANCE */}
        <div className="mt-[-6px] flex flex-col items-center">
          <span className="relative">
            <span
              className="font-display text-[42px] leading-none font-extrabold tracking-[-0.03em] text-white"
              style={{
                textShadow: `0 2px 20px rgba(0,0,0,0.8), 0 0 30px ${ACCENT.main}66`
              }}
            >
              {score.toLocaleString()}
            </span>
            <ScoreBursts />
          </span>
          <span className="mt-1 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-[3px] backdrop-blur-md">
            <PiCompassBold
              className="text-[10px]"
              style={{ color: ACCENT.main }}
            />
            <span className="font-display text-[10px] font-bold tracking-[0.05em] text-white">
              {distance.toFixed(2)} KM
            </span>
          </span>
        </div>

        <ResourceRing
          value={waterPct}
          color={WATER_COLOR}
          deep={WATER_DEEP}
          label="FIND BATH"
          Icon={BsFillDropletFill}
        />
      </div>

      {showFeedingState && <FeedingIndicator gameState={gameState} />}
    </div>
  );
}

interface ScoreBurst {
  id: number;
  amount: number;
}

// Derived from score jumps so fly-away and dodge bonuses read as rewards, not a counter tick.
function ScoreBursts() {
  const [bursts, setBursts] = useState<ScoreBurst[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let previous = useGameStore.getState().score;
    let nextId = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const unsubscribe = useGameStore.subscribe((s) => {
      const delta = s.score - previous;
      previous = s.score;
      if (delta < SCORE_BURST_MIN) return;
      const id = ++nextId;
      setBursts((list) => [...list, { id, amount: Math.round(delta) }]);
      const timer = setTimeout(() => {
        timers.delete(timer);
        setBursts((list) => list.filter((b) => b.id !== id));
      }, SCORE_BURST_MS);
      timers.add(timer);
    });
    return () => {
      unsubscribe();
      timers.forEach(clearTimeout);
    };
  }, []);

  const rise = reduceMotion ? 0 : 1;

  return (
    <AnimatePresence>
      {bursts.map((burst) => (
        <AnimatedSpan
          key={burst.id}
          className="font-display absolute top-0 left-full ml-1.5 text-lg leading-none font-extrabold whitespace-nowrap"
          style={{
            color: ACCENT.main,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
          initial={{ opacity: 0, y: 6 * rise }}
          animate={{ opacity: 1, y: -6 * rise }}
          exit={{ opacity: 0, y: -20 * rise }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          +{burst.amount}
        </AnimatedSpan>
      ))}
    </AnimatePresence>
  );
}

function ResourceRing({
  value,
  color,
  deep,
  label,
  Icon
}: {
  value: number;
  color: string;
  deep: string;
  label: string;
  Icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}) {
  const size = 66;
  const sw = 5;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const critical = pct < RESOURCE_CRITICAL_THRESHOLD;
  const warning = pct < RESOURCE_WARNING_THRESHOLD;
  const strokeColor = critical ? '#ff4d6d' : warning ? '#ff9800' : color;
  // useId can contain characters that break a url(#id) reference.
  const glowId = `ring-glow-${useId().replace(/[^\w-]/g, '')}`;
  // Room around the ring for its glow; an SVG clips anything drawn past its box.
  const pad = 8;
  const box = size + pad * 2;
  const centre = box / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={[
          'relative',
          critical ? 'animate-[pulse_0.8s_ease-in-out_infinite]' : ''
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ width: size, height: size }}
      >
        <svg
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
          className="pointer-events-none absolute -rotate-90"
          style={{ left: -pad, top: -pad }}
        >
          <defs>
            <filter
              id={glowId}
              x={0}
              y={0}
              width={box}
              height={box}
              filterUnits="userSpaceOnUse"
            >
              <feGaussianBlur stdDeviation={2.5} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={centre}
            cy={centre}
            r={r}
            fill="rgba(0,0,0,0.4)"
            stroke={deep}
            strokeWidth={sw}
          />
          <circle
            cx={centre}
            cy={centre}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={sw}
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,stroke] duration-300"
            filter={`url(#${glowId})`}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: strokeColor }}
        >
          <Icon style={{ fontSize: 22 }} />
        </div>
      </div>
      {warning && pct > 0 && (
        <span
          className="font-display flex animate-[pulse_1.2s_ease-in-out_infinite] items-center justify-center rounded-full bg-black/50 px-2 py-1 text-[10px] font-extrabold tracking-[0.2em] uppercase backdrop-blur-md"
          style={{ color: strokeColor }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function FeedingIndicator({ gameState }: { gameState: string }) {
  const threatMeter = useGameStore((s) => Math.round(s.threatMeter));
  const catNear = useGameStore((s) => s.threatType === 'cat');
  const isFeeding = gameState === 'feeding';
  const label = isFeeding ? 'EATING' : 'DRINKING';
  const tone = isFeeding ? FOOD_COLOR : WATER_COLOR;

  const danger = catNear || threatMeter > 30;

  // Sits just above the pause/exit row: in the feeding close-up the bird is in
  // the upper half of the screen and the stalking cat in the middle.
  return (
    <div
      className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      style={{ bottom: 'calc(max(30px, env(safe-area-inset-bottom)) + 58px)' }}
    >
      {danger ? (
        <span className="font-display animate-[bounce-y_0.6s_ease-in-out_infinite] rounded-full border border-[rgba(255,61,0,0.45)] bg-[rgba(183,28,28,0.88)] px-4 py-1.5 text-[13px] font-extrabold tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_4px_18px_rgba(183,28,28,0.45)]">
          {catNear ? 'Cat! Tap to fly away' : 'Danger — tap to fly away'}
        </span>
      ) : (
        <span
          className="font-display rounded-full border px-4 py-1.5 text-[13px] font-extrabold tracking-[0.18em] whitespace-nowrap uppercase backdrop-blur-2xl"
          style={{
            background: `${tone}26`,
            borderColor: `${tone}66`,
            color: tone
          }}
        >
          {label}
        </span>
      )}
      <div className="h-2.5 w-56 overflow-hidden rounded-full bg-black/50 backdrop-blur-md">
        <div
          className="h-full rounded-full transition-[width,background] duration-200"
          style={{
            width: `${threatMeter}%`,
            background:
              threatMeter > 60
                ? '#ff4d6d'
                : threatMeter > 30
                  ? '#ff9800'
                  : FOOD_COLOR,
            boxShadow: '0 0 12px currentColor'
          }}
        />
      </div>
    </div>
  );
}

'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { ACCENT } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import {
  RESOURCE_CRITICAL_THRESHOLD,
  RESOURCE_WARNING_THRESHOLD
} from '@/utils/constants';
import { BsFillDropletFill } from 'react-icons/bs';
import { FaWheatAwn } from 'react-icons/fa6';
import { PiCompassBold } from 'react-icons/pi';

const FOOD_COLOR = '#b9f05a';
const FOOD_DEEP = '#3a5a1a';
const WATER_COLOR = '#65e7ff';
const WATER_DEEP = '#0a4a6a';

export default function HUD() {
  const food = useGameStore((s) => s.food);
  const water = useGameStore((s) => s.water);
  const score = useGameStore((s) => s.score);
  const distance = useGameStore((s) => s.distance);
  const selectedSpecies = useGameStore((s) => s.selectedSpecies);
  const gameState = useGameStore((s) => s.gameState);

  const species = BIRD_SPECIES[selectedSpecies];
  const foodPct = (food / species.attributes.maxFood) * 100;
  const waterPct = (water / species.attributes.maxWater) * 100;

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
          <span
            className="font-display text-[42px] leading-none font-extrabold tracking-[-0.03em] text-white"
            style={{
              textShadow: `0 2px 20px rgba(0,0,0,0.8), 0 0 30px ${ACCENT.main}66`
            }}
          >
            {Math.floor(score).toLocaleString()}
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
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="rgba(0,0,0,0.4)"
            stroke={deep}
            strokeWidth={sw}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={sw}
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,stroke] duration-300"
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
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
  const threatMeter = useGameStore((s) => s.threatMeter);
  const isFeeding = gameState === 'feeding';
  const label = isFeeding ? 'EATING' : 'DRINKING';
  const tone = isFeeding ? FOOD_COLOR : WATER_COLOR;

  return (
    <div className="absolute top-[110px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5">
      <span
        className="font-display rounded-full border px-4 py-1.5 text-sm font-extrabold tracking-[0.18em] uppercase backdrop-blur-2xl"
        style={{
          background: `${tone}26`,
          borderColor: `${tone}66`,
          color: tone
        }}
      >
        {label}
      </span>
      <div className="h-3 w-64 overflow-hidden rounded-full bg-black/50 backdrop-blur-md">
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
      {threatMeter > 30 && (
        <span className="font-display mt-1 animate-[pulse_0.8s_ease-in-out_infinite] text-base font-extrabold tracking-[0.22em] text-[#bc0a2b] uppercase [text-shadow:0_2px_12px_rgba(255,77,109,0.6),0_0_24px_rgba(0,0,0,0.8)]">
          Danger — Fly Away
        </span>
      )}
    </div>
  );
}

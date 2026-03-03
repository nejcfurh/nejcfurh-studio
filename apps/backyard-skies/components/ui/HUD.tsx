'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { useGameStore } from '@/store/gameStore';
import {
  RESOURCE_CRITICAL_THRESHOLD,
  RESOURCE_WARNING_THRESHOLD
} from '@/utils/constants';

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
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* TOP BAR */}
      <div className="flex items-start justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
        {/* FOOD CIRCLE + WARNING - LEFT */}
        <div className="flex flex-col items-center gap-1.5">
          <ResourceCircle
            value={foodPct}
            color="#4CAF50"
            bgColor="#1B5E20"
            icon="🌾"
          />
          {foodPct < RESOURCE_WARNING_THRESHOLD && foodPct > 0 && (
            <span className="animate-[pulse_1.5s_ease-in-out_infinite] rounded-xl bg-black/50 px-2.5 py-1 text-[9px] font-bold whitespace-nowrap text-[#FF9800] backdrop-blur-md">
              FIND FEEDER
            </span>
          )}
        </div>

        {/* SCORE & DISTANCE - CENTER */}
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-white">
            {Math.floor(score).toLocaleString()}
          </span>
          <span className="text-xs font-medium text-white/50">
            {distance.toFixed(1)} km
          </span>
        </div>

        {/* WATER CIRCLE + WARNING - RIGHT */}
        <div className="flex flex-col items-center gap-1.5">
          <ResourceCircle
            value={waterPct}
            color="#00AEEF"
            bgColor="#01579B"
            icon="💧"
          />
          {waterPct < RESOURCE_WARNING_THRESHOLD && waterPct > 0 && (
            <span className="animate-[pulse_1.5s_ease-in-out_infinite] rounded-xl bg-black/50 px-2.5 py-1 text-[9px] font-bold whitespace-nowrap text-[#4FC3F7] backdrop-blur-md">
              FIND BATH
            </span>
          )}
        </div>
      </div>

      {/* FEEDING/DRINKING STATE */}
      {showFeedingState && <FeedingIndicator gameState={gameState} />}
    </div>
  );
}

function ResourceCircle({
  value,
  color,
  bgColor,
  icon
}: {
  value: number;
  color: string;
  bgColor: string;
  icon: string;
}) {
  const size = 68;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const isCritical = value < RESOURCE_CRITICAL_THRESHOLD;
  const isWarning = value < RESOURCE_WARNING_THRESHOLD;
  const strokeColor = isCritical ? '#FF3D00' : isWarning ? '#FF9800' : color;

  return (
    <div
      className={`relative ${isCritical ? 'animate-[pulse_0.8s_ease-in-out_infinite]' : ''}`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgba(0,0,0,0.4)"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        {icon}
      </div>
    </div>
  );
}

function FeedingIndicator({ gameState }: { gameState: string }) {
  const threatMeter = useGameStore((s) => s.threatMeter);
  const label = gameState === 'feeding' ? 'EATING' : 'DRINKING';
  const color = gameState === 'feeding' ? '#4CAF50' : '#00AEEF';

  return (
    <div className="absolute top-[120px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
      <span
        className="rounded-xl px-3.5 py-1 text-[10px] font-bold backdrop-blur-lg"
        style={{ background: `${color}30`, color }}
      >
        {label}
      </span>

      <div className="h-1.5 w-40 overflow-hidden rounded-[3px] bg-black/40 backdrop-blur-md">
        <div
          className="h-full rounded-[3px] transition-[width] duration-200"
          style={{
            width: `${threatMeter}%`,
            background:
              threatMeter > 60
                ? '#FF3D00'
                : threatMeter > 30
                  ? '#FF9800'
                  : '#4CAF50'
          }}
        />
      </div>
      {threatMeter > 30 && (
        <span className="pointer-events-auto animate-[pulse_0.8s_ease-in-out_infinite] text-[10px] font-bold text-[#FF3D00]">
          DANGER — TAP TO FLY AWAY
        </span>
      )}
    </div>
  );
}

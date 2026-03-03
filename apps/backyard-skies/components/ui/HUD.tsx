'use client';

import { useGameStore } from '@/store/gameStore';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import {
  RESOURCE_WARNING_THRESHOLD,
  RESOURCE_CRITICAL_THRESHOLD,
} from '@/utils/constants';

export default function HUD() {
  const food = useGameStore(s => s.food);
  const water = useGameStore(s => s.water);
  const score = useGameStore(s => s.score);
  const distance = useGameStore(s => s.distance);
  const selectedSpecies = useGameStore(s => s.selectedSpecies);
  const gameState = useGameStore(s => s.gameState);

  const species = BIRD_SPECIES[selectedSpecies];
  const foodPct = (food / species.attributes.maxFood) * 100;
  const waterPct = (water / species.attributes.maxWater) * 100;

  const showFeedingState = gameState === 'feeding' || gameState === 'drinking';

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* TOP BAR */}
      <div className="flex justify-between items-start px-4 pt-[max(16px,env(safe-area-inset-top))]">
        {/* FOOD CIRCLE + WARNING - LEFT */}
        <div className="flex flex-col items-center gap-1.5">
          <ResourceCircle
            value={foodPct}
            color="#4CAF50"
            bgColor="#1B5E20"
            icon="🌾"
          />
          {foodPct < RESOURCE_WARNING_THRESHOLD && foodPct > 0 && (
            <span className="text-[9px] font-bold text-[#FF9800] bg-black/50 py-1 px-2.5 rounded-xl backdrop-blur-md animate-[pulse_1.5s_ease-in-out_infinite] whitespace-nowrap">
              FIND FEEDER
            </span>
          )}
        </div>

        {/* SCORE & DISTANCE - CENTER */}
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-white">
            {Math.floor(score).toLocaleString()}
          </span>
          <span className="text-xs text-white/50 font-medium">
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
            <span className="text-[9px] font-bold text-[#4FC3F7] bg-black/50 py-1 px-2.5 rounded-xl backdrop-blur-md animate-[pulse_1.5s_ease-in-out_infinite] whitespace-nowrap">
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
  icon,
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
  const threatMeter = useGameStore(s => s.threatMeter);
  const label = gameState === 'feeding' ? 'EATING' : 'DRINKING';
  const color = gameState === 'feeding' ? '#4CAF50' : '#00AEEF';

  return (
    <div className="absolute top-[120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span
        className="text-[10px] font-bold py-1 px-3.5 rounded-xl backdrop-blur-lg"
        style={{ background: `${color}30`, color }}
      >
        {label}
      </span>

      <div className="w-40 h-1.5 bg-black/40 rounded-[3px] overflow-hidden backdrop-blur-md">
        <div
          className="h-full rounded-[3px] transition-[width] duration-200"
          style={{
            width: `${threatMeter}%`,
            background:
              threatMeter > 60
                ? '#FF3D00'
                : threatMeter > 30
                  ? '#FF9800'
                  : '#4CAF50',
          }}
        />
      </div>
      {threatMeter > 30 && (
        <span className="text-[10px] text-[#FF3D00] font-bold animate-[pulse_0.8s_ease-in-out_infinite] pointer-events-auto">
          DANGER — TAP TO FLY AWAY
        </span>
      )}
    </div>
  );
}

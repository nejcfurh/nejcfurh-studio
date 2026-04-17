'use client';

import { ACCENT, BG_IMAGE, SPECIES_ICON } from '@/lib/designTokens';
import { BirdSpeciesId, LeaderboardEntry } from '@/types';
import { AnimatedDiv } from '@repo/ui/animation/core';
import Image from 'next/image';

import PageHeader from './PageHeader';
import { Aurora } from './primitives';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const PODIUM_COLORS = ['#ffd24b', '#d4d4d4', '#c08060'];

const SPECIES_PRETTY: Record<BirdSpeciesId, string> = {
  cardinal: 'Northern Cardinal',
  tanager: 'Scarlet Tanager',
  bunting: 'Indigo Bunting',
  starling: 'Common Starling'
};

const Leaderboard = ({
  handleBack,
  leaderboard
}: {
  handleBack: () => void;
  leaderboard: LeaderboardEntry[];
}) => {
  const top3 = leaderboard.slice(0, 3);
  const podium = [top3[1], top3[0], top3[2]];

  return (
    <AnimatedDiv
      className="absolute inset-0 z-60 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
    >
      <Aurora colors={[ACCENT.main, '#4a8cff']} opacity={0.5} />

      <div className="relative z-10 my-5 flex h-full flex-col gap-3 px-[22px]">
        <PageHeader title="High Flyers" onBack={handleBack} />

        {/* PODIUM */}
        {top3.length >= 3 && (
          <div className="my-1 flex items-end justify-center gap-2.5">
            {podium.map((entry, i) => {
              const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const h = actualRank === 1 ? 86 : actualRank === 2 ? 60 : 48;
              const color = PODIUM_COLORS[actualRank - 1];
              const icon = SPECIES_ICON[entry.species as BirdSpeciesId];
              return (
                <div
                  key={actualRank}
                  className="flex flex-1 flex-col items-center"
                >
                  {icon && (
                    <Image
                      src={icon}
                      alt={entry.species}
                      width={44}
                      height={44}
                      className="mb-1 h-13 w-13 object-contain"
                      style={{ filter: `drop-shadow(0 4px 10px ${color}66)` }}
                    />
                  )}
                  <div className="font-display text-base font-extrabold text-white">
                    {entry.name}
                  </div>
                  <div
                    className="font-display mb-1.5 text-xs font-extrabold tracking-[0.05em]"
                    style={{ color }}
                  >
                    {Math.floor(entry.score).toLocaleString()}
                  </div>
                  <div
                    className="font-display flex w-full items-start justify-center rounded-t-[12px] border pt-1.5 text-[18px] font-extrabold"
                    style={{
                      height: h,
                      background: `linear-gradient(180deg, ${color}33 0%, ${color}11 100%)`,
                      borderColor: `${color}55`,
                      color
                    }}
                  >
                    {actualRank}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST */}
        <div
          className="scroll flex flex-1 flex-col gap-2 overflow-auto pr-0.5 pb-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => {
              const rank = i + 1;
              const icon = SPECIES_ICON[entry.species as BirdSpeciesId];
              const pretty =
                SPECIES_PRETTY[entry.species as BirdSpeciesId] ?? entry.species;
              const isTop = rank <= 3;
              return (
                <AnimatedDiv
                  key={i}
                  className="flex items-center gap-2.5 rounded-[14px] border px-3 py-2.5"
                  style={{
                    background: isTop
                      ? `${ACCENT.main}12`
                      : 'rgba(255,255,255,0.04)',
                    borderColor: isTop
                      ? `${ACCENT.main}33`
                      : 'rgba(255,255,255,0.06)'
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.1 + i * 0.04 }}
                >
                  <div
                    className="font-display flex h-[26px] w-[26px] items-center justify-center rounded-[8px] text-[12px] font-extrabold"
                    style={{
                      background: isTop
                        ? ACCENT.main
                        : 'rgba(255,255,255,0.08)',
                      color: isTop ? '#0a0a0a' : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {rank}
                  </div>
                  {icon && (
                    <Image
                      src={icon}
                      alt={pretty}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-[14px] font-bold text-white">
                      {entry.name}
                    </p>
                    <p className="truncate text-[11px] text-white/40">
                      {pretty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[14px] font-extrabold text-white">
                      {Math.floor(entry.score).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/35">
                      {entry.distance.toFixed(1)} km
                    </p>
                  </div>
                </AnimatedDiv>
              );
            })
          ) : (
            <p className="py-12 text-center text-[13px] text-white/30">
              No flights yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default Leaderboard;

'use client';

import { ACCENT, SPECIES_ICON } from '@/lib/designTokens';
import { BirdSpeciesId, LeaderboardEntry } from '@/types';
import { BiChevronRight } from '@repo/ui/icons/react-icons/bi';
import { FaTrophy } from '@repo/ui/icons/react-icons/fa';
import Image from 'next/image';

import { GlassCard } from './primitives';

const MEDALS = ['#ffd24b', '#d4d4d4', '#c08060'];

const SPECIES_PRETTY: Record<BirdSpeciesId, string> = {
  cardinal: 'Northern Cardinal',
  tanager: 'Scarlet Tanager',
  bunting: 'Indigo Bunting',
  starling: 'Common Starling'
};

const Top3Leaderboard = ({
  topPlayers,
  handleViewAllRankings
}: {
  topPlayers: LeaderboardEntry[];
  handleViewAllRankings: () => void;
}) => {
  return (
    <GlassCard onClick={handleViewAllRankings} className="cursor-pointer p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <span style={{ color: ACCENT.main }}>
            <FaTrophy />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.02em]">
            High Flyers
          </span>
        </div>
        <span
          className="font-display flex items-center gap-1 text-sm font-bold tracking-[0.15em] uppercase"
          style={{ color: ACCENT.main }}
        >
          All <BiChevronRight className="text-lg" />
        </span>
      </div>

      {topPlayers.length > 0 ? (
        <div className="flex flex-col gap-3">
          {topPlayers.map((entry, i) => {
            const speciesId = entry.species as BirdSpeciesId;
            const icon = SPECIES_ICON[speciesId];
            const pretty = SPECIES_PRETTY[speciesId] ?? entry.species;
            const medal = MEDALS[i];
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="font-display flex h-[30px] w-[30px] items-center justify-center rounded-md text-lg font-extrabold"
                  style={{
                    background: `${medal}22`,
                    color: medal
                  }}
                >
                  {i + 1}
                </div>
                {icon ? (
                  <Image
                    src={icon}
                    alt={pretty}
                    width={26}
                    height={26}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <span className="h-8 w-8" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display truncate text-base font-bold text-white">
                    {entry.name}
                  </p>
                  <p className="truncate text-xs text-white/35 capitalize italic">
                    {pretty}
                  </p>
                </div>
                <p className="font-display text-[13px] font-bold text-white">
                  {entry.distance.toFixed(1)}
                  <span className="ml-0.5 text-[9px] text-white/30">KM</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="py-3 text-center text-sm text-white/40">
          No flights yet. Be the first!
        </p>
      )}
    </GlassCard>
  );
};

export default Top3Leaderboard;

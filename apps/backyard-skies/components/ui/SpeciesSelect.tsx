'use client';

import { SPECIES_LIST } from '@/lib/birdSpecies';
import { useGameStore } from '@/store/gameStore';
import { BirdSpeciesId } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';

const STAT_CONFIG = [
  { key: 'speed', label: 'SPEED', color: '#00AEEF', max: 10 },
  { key: 'flapPower', label: 'POWER', color: '#E040FB', max: 1.5 },
  { key: 'stamina', label: 'STAMINA', color: '#FF9800', max: 100 },
  { key: 'maxFood', label: 'FOOD CAP', color: '#4CAF50', max: 100 },
  { key: 'maxWater', label: 'WATER CAP', color: '#00AEEF', max: 100 },
  { key: 'feedRate', label: 'FEED RATE', color: '#FFD700', max: 15 }
] as const;

const SPECIES_ICONS: Record<BirdSpeciesId, string> = {
  cardinal: '/bird-icons/Northern-Cardinal.png',
  tanager: '/bird-icons/Scarlet-Tanager.png',
  bunting: '/bird-icons/Indigo-Bunding.png',
  starling: '/bird-icons/Starling.png'
};

const SPECIES_TAGLINES: Record<BirdSpeciesId, string> = {
  cardinal: 'Balanced & reliable',
  tanager: 'Fast but hungry',
  bunting: 'Agile & efficient',
  starling: 'Tough survivor'
};

export default function SpeciesSelect() {
  const selectSpecies = useGameStore((s) => s.selectSpecies);
  const startGame = useGameStore((s) => s.startGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const [selectedId, setSelectedId] = useState<BirdSpeciesId>('cardinal');

  const selected = SPECIES_LIST.find((s) => s.id === selectedId)!;

  const handleSelect = () => {
    selectSpecies(selectedId);
    startGame();
  };

  return (
    <div className="h-100dvh z-50 flex w-full flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="flex h-full flex-col overflow-auto px-6 pt-7 pb-10">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={() => setGameState('menu')}
            className="absolute left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-lg text-white"
          >
            <BiChevronLeft className="text-black" />
          </button>
          <span className="text-lg font-bold tracking-[0.25em] text-black/70 uppercase">
            Pick Your Bird
          </span>
        </div>

        {/* Species cards row */}
        <div className="mb-4 flex justify-center gap-4">
          {SPECIES_LIST.map((sp) => {
            const isActive = selectedId === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => setSelectedId(sp.id)}
                className={`flex w-[74px] flex-none cursor-pointer flex-col items-center gap-2 rounded-2xl pt-3 pb-2 transition-all duration-200 ${
                  isActive
                    ? 'scale-[1.05] border-2'
                    : 'scale-100 border-2 border-black/6 bg-black/3'
                }`}
                style={
                  isActive
                    ? {
                        background: `${sp.colors.body}18`,
                        borderColor: sp.colors.body
                      }
                    : undefined
                }
              >
                {/* Bird icon */}
                <Image
                  src={SPECIES_ICONS[sp.id]}
                  alt={sp.name}
                  width={100}
                  height={100}
                  className="h-10 w-10 object-contain"
                  style={{
                    filter: isActive ? 'none' : 'brightness(0.6)'
                  }}
                />
                <span
                  className={`font-bold tracking-wide uppercase ${
                    isActive
                      ? 'text-[10px] text-black'
                      : 'text-[8px] text-black/50'
                  }`}
                >
                  {sp.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected bird info */}
        <div className="mx-auto mb-4 w-full max-w-[360px] rounded-2xl border border-black/10 bg-black/20 p-5 backdrop-blur-2xl">
          {/* Name + tagline */}
          <div className="mb-5 text-center">
            <h3 className="text-3xl leading-tight font-bold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              {selected.name}
            </h3>
            <p
              className="mt-1 text-sm font-medium tracking-wider italic"
              style={{ color: selected.colors.body }}
            >
              {selected.scientificName}
            </p>
            <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs text-white/80 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              {SPECIES_TAGLINES[selectedId]}
            </p>
          </div>

          {/* Stat bars */}
          <div className="flex flex-col gap-1">
            {STAT_CONFIG.map(({ key, label, color, max }) => {
              const value = selected.attributes[
                key as keyof typeof selected.attributes
              ] as number;
              const pct = Math.min((value / max) * 100, 100);
              return (
                <div key={key}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[9px] font-semibold tracking-[0.15em] text-white/45 uppercase">
                      {label}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-white/80">
                      {typeof value === 'number' && value % 1 !== 0
                        ? value.toFixed(1)
                        : value}
                    </span>
                  </div>
                  <div className="bg-white/6] h-1.5 overflow-hidden rounded-[3px]">
                    <div
                      className="h-full rounded-[3px] transition-[width] duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}CC)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <p className="mx-auto mb-6 px-3 text-center text-sm leading-relaxed font-semibold text-white italic drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
          {selected.description}
        </p>
        {/* Select button */}
        <button
          onClick={handleSelect}
          className="mx-auto mb-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border-none py-5 text-lg font-extrabold tracking-wide text-white"
          style={{
            background: `linear-gradient(135deg, ${selected.colors.body}, ${selected.colors.body}BB)`,
            boxShadow: `0 6px 28px ${selected.colors.body}40`
          }}
        >
          FLY AS {selected.name.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

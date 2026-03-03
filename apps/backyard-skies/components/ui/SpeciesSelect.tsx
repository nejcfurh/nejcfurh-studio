'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SPECIES_LIST } from '@/lib/birdSpecies';
import { BirdSpeciesId } from '@/types';
import Image from 'next/image';
import { BiChevronLeft } from 'react-icons/bi';

const STAT_CONFIG = [
  { key: 'speed', label: 'SPEED', color: '#00AEEF', max: 10 },
  { key: 'flapPower', label: 'POWER', color: '#E040FB', max: 1.5 },
  { key: 'stamina', label: 'STAMINA', color: '#FF9800', max: 100 },
  { key: 'maxFood', label: 'FOOD CAP', color: '#4CAF50', max: 100 },
  { key: 'maxWater', label: 'WATER CAP', color: '#00AEEF', max: 100 },
  { key: 'feedRate', label: 'FEED RATE', color: '#FFD700', max: 15 },
] as const;

const SPECIES_ICONS: Record<BirdSpeciesId, string> = {
  cardinal: '/bird-icons/Northern-Cardinal.png',
  tanager: '/bird-icons/Scarlet-Tanager.png',
  bunting: '/bird-icons/Indigo-Bunding.png',
  starling: '/bird-icons/Starling.png',
};

const SPECIES_TAGLINES: Record<BirdSpeciesId, string> = {
  cardinal: 'Balanced & reliable',
  tanager: 'Fast but hungry',
  bunting: 'Agile & efficient',
  starling: 'Tough survivor',
};

export default function SpeciesSelect() {
  const selectSpecies = useGameStore(s => s.selectSpecies);
  const startGame = useGameStore(s => s.startGame);
  const setGameState = useGameStore(s => s.setGameState);
  const [selectedId, setSelectedId] = useState<BirdSpeciesId>('cardinal');

  const selected = SPECIES_LIST.find(s => s.id === selectedId)!;

  const handleSelect = () => {
    selectSpecies(selectedId);
    startGame();
  };

  return (
    <div className="w-full h-100dvh z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="flex flex-col h-full pt-7 px-6 pb-10 overflow-auto">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={() => setGameState('menu')}
            className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-white text-lg cursor-pointer"
          >
            <BiChevronLeft className="text-black" />
          </button>
          <span className="text-lg font-bold text-black/70 tracking-[0.25em] uppercase">
            Pick Your Bird
          </span>
        </div>

        {/* Species cards row */}
        <div className="flex gap-4 justify-center mb-4">
          {SPECIES_LIST.map(sp => {
            const isActive = selectedId === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => setSelectedId(sp.id)}
                className={`flex-none w-[74px] pt-3 pb-2 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'scale-[1.05] border-2'
                    : 'scale-100 bg-black/3 border-2 border-black/6'
                }`}
                style={
                  isActive
                    ? {
                        background: `${sp.colors.body}18`,
                        borderColor: sp.colors.body,
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
                  className="w-10 h-10 object-contain"
                  style={{
                    filter: isActive ? 'none' : 'brightness(0.6)',
                  }}
                />
                <span
                  className={`font-bold tracking-wide uppercase ${
                    isActive
                      ? 'text-black text-[10px]'
                      : 'text-black/50 text-[8px]'
                  }`}
                >
                  {sp.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected bird info */}
        <div className="w-full max-w-[360px] mx-auto bg-black/20 backdrop-blur-2xl rounded-2xl p-5 border border-black/10 mb-4">
          {/* Name + tagline */}
          <div className="text-center mb-5">
            <h3 className="text-3xl font-bold text-white leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              {selected.name}
            </h3>
            <p
              className="text-sm italic font-medium tracking-wider mt-1"
              style={{ color: selected.colors.body }}
            >
              {selected.scientificName}
            </p>
            <p className="text-xs text-white/80 mt-2 bg-white/20 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] inline-block py-1 px-3 rounded-full">
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
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] text-white/45 tracking-[0.15em] font-semibold uppercase">
                      {label}
                    </span>
                    <span className="text-[10px] text-white/80 font-bold font-mono">
                      {typeof value === 'number' && value % 1 !== 0
                        ? value.toFixed(1)
                        : value}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-[3px] overflow-hidden bg-white/6]">
                    <div
                      className="h-full rounded-[3px] transition-[width] duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm px-3 text-white italic text-center mx-auto mb-6 font-semibold leading-relaxed drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
          {selected.description}
        </p>
        {/* Select button */}
        <button
          onClick={handleSelect}
          className="mb-10 w-full mx-auto py-5 rounded-3xl font-extrabold text-lg text-white border-none cursor-pointer flex items-center justify-center gap-2 tracking-wide"
          style={{
            background: `linear-gradient(135deg, ${selected.colors.body}, ${selected.colors.body}BB)`,
            boxShadow: `0 6px 28px ${selected.colors.body}40`,
          }}
        >
          FLY AS {selected.name.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

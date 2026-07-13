'use client';

import { BIRD_SPECIES, SPECIES_LIST } from '@/lib/birdSpecies';
import {
  BG_IMAGE,
  shade,
  SPECIES_ICON,
  SPECIES_TAGLINE,
  SPECIES_TINT
} from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import { BirdSpeciesId } from '@/types';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { BiChevronRight } from '@repo/ui/icons/react-icons/bi';
import Image from 'next/image';
import { useState } from 'react';

import PageHeader from './PageHeader';
import { ArcadeButton, GlassCard, Particles } from './primitives';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const STATS = [
  { key: 'speed', label: 'Speed', max: 10 },
  { key: 'flapPower', label: 'Power', max: 1.5 },
  { key: 'stamina', label: 'Stamina', max: 100 },
  { key: 'maxFood', label: 'Food Cap', max: 100 },
  { key: 'maxWater', label: 'Water Cap', max: 100 },
  { key: 'feedRate', label: 'Feed Rate', max: 15 }
] as const;

export default function SpeciesSelect() {
  const selectSpecies = useGameStore((s) => s.selectSpecies);
  const startGame = useGameStore((s) => s.startGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const storeSelected = useGameStore((s) => s.selectedSpecies);
  const [selectedId, setSelectedId] = useState<BirdSpeciesId>(storeSelected);

  const selected = BIRD_SPECIES[selectedId];
  const tint = SPECIES_TINT[selectedId];

  const handleSelect = () => {
    selectSpecies(selectedId);
    startGame();
  };

  const flyLabel = selected.name.split(' ').slice(-1)[0];

  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col overflow-hidden transition-[background] duration-500 ease-out"
      style={{
        background: `radial-gradient(100% 60% at 50% 20%, ${tint.glow} 0%, transparent 55%), ${BG_IMAGE}`
      }}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={spring}
    >
      <Particles count={25} color={tint.main} />

      <div className="relative z-10 my-5 flex h-full flex-col px-5">
        <div className="mb-3.5">
          <PageHeader
            title="Choose Your Bird"
            onBack={() => setGameState('menu')}
          />
        </div>

        {/* Hero portrait */}
        <div className="relative flex h-[210px] flex-none items-center justify-center">
          <div
            className="absolute h-[200px] w-[200px] rounded-full blur-[20px]"
            style={{
              background: `radial-gradient(circle, ${tint.main}44 0%, transparent 70%)`
            }}
          />
          <div
            className="absolute h-[180px] w-[180px] animate-[spin-slow_30s_linear_infinite] rounded-full"
            style={{ border: `1px dashed ${tint.main}55` }}
          />
          <Image
            key={selectedId}
            src={SPECIES_ICON[selectedId]}
            alt={selected.name}
            width={180}
            height={180}
            priority
            className="h-[180px] w-[180px] animate-[hover-y_3s_ease-in-out_infinite] object-contain"
            style={{ filter: `drop-shadow(0 20px 30px ${tint.main}88)` }}
          />
        </div>

        {/* Species name */}
        <div className="mt-1 mb-3 text-center">
          <div className="font-display text-[26px] leading-none font-extrabold tracking-[-0.02em] text-white">
            {selected.name}
          </div>
          <div
            className="font-display mt-1 text-[11px] tracking-[0.05em] italic"
            style={{ color: tint.main }}
          >
            {selected.scientificName}
          </div>
          <div
            className="font-display mt-2 inline-block rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-white uppercase"
            style={{
              background: `${tint.main}22`,
              borderColor: `${tint.main}44`
            }}
          >
            {SPECIES_TAGLINE[selectedId]}
          </div>
        </div>

        {/* Species picker row */}
        <div className="mb-3 flex gap-2">
          {SPECIES_LIST.map((s) => {
            const active = s.id === selectedId;
            const sTint = SPECIES_TINT[s.id as BirdSpeciesId];
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id as BirdSpeciesId)}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-[14px] px-1 py-2 transition-all duration-200"
                style={{
                  background: active
                    ? `${sTint.main}25`
                    : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${active ? sTint.main : 'rgba(255,255,255,0.08)'}`
                }}
              >
                <Image
                  src={SPECIES_ICON[s.id as BirdSpeciesId]}
                  alt={s.name}
                  width={36}
                  height={36}
                  className={[
                    'h-9 w-9 object-contain transition-[filter] duration-200',
                    active ? '' : 'brightness-75 grayscale-[0.6]'
                  ].join(' ')}
                />
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <GlassCard className="scroll flex-1 overflow-auto px-4 py-3.5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {STATS.map((stat) => {
              const val = selected.attributes[
                stat.key as keyof typeof selected.attributes
              ] as number;
              const pct = Math.min((val / stat.max) * 100, 100);
              return (
                <div key={stat.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-display text-[9px] font-bold tracking-[0.15em] text-white/50 uppercase">
                      {stat.label}
                    </span>
                    <span className="font-display text-[11px] font-extrabold text-white">
                      {val % 1 !== 0 ? val.toFixed(1) : val}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-[2px] bg-white/10">
                    <div
                      className="h-full rounded-[2px] transition-[width] duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${tint.main}, ${shade(tint.main, 30)})`,
                        boxShadow: `0 0 8px ${tint.main}88`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-white/70 italic">
            {selected.description}
          </p>
        </GlassCard>

        {/* CTA */}
        <div className="mt-3">
          <ArcadeButton accent={tint.main} onClick={handleSelect}>
            Fly as {flyLabel}
            <BiChevronRight className="text-sm" color="#0a0a0a" />
          </ArcadeButton>
        </div>
      </div>
    </AnimatedDiv>
  );
}

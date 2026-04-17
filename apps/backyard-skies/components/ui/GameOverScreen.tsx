'use client';

import { ACCENT, BG_IMAGE, SPECIES_ICON } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import { BirdSpeciesId, DeathReason } from '@/types';
import { SCORE_EAGLE_DODGE_BONUS } from '@/utils/constants';
import Image from 'next/image';
import { ComponentType, useEffect, useState } from 'react';
import { BsFillDropletFill } from 'react-icons/bs';
import { FaWheatAwn } from 'react-icons/fa6';
import {
  PiArrowClockwiseBold,
  PiBirdFill,
  PiCatFill,
  PiHouseBold,
  PiMedalFill
} from 'react-icons/pi';

import { ArcadeButton, GlassCard, Particles } from './primitives';

type Death = {
  title: string;
  sub: string;
  color: string;
  Icon: ComponentType<{ size?: number; color?: string; className?: string }>;
};

const DEATHS: Record<Exclude<DeathReason, null>, Death> = {
  food: {
    title: 'Starved Mid-Flight',
    sub: 'Your bird ran out of strength.',
    color: '#ff9a3d',
    Icon: FaWheatAwn
  },
  water: {
    title: 'Dehydrated',
    sub: 'Lack of hydration brought you down.',
    color: '#65e7ff',
    Icon: BsFillDropletFill
  },
  eagle: {
    title: 'Snatched!',
    sub: 'An eagle caught your bird mid-air.',
    color: '#ff4d6d',
    Icon: PiBirdFill
  },
  cat: {
    title: 'Ambushed!',
    sub: 'A cat pounced at the feeder.',
    color: '#ff4d6d',
    Icon: PiCatFill
  },
  ground: {
    title: 'Grounded!',
    sub: 'You touched ground. Cats are fast.',
    color: '#ff4d6d',
    Icon: PiCatFill
  }
};

const DEFAULT_DEATH: Death = {
  title: 'Flight Over',
  sub: 'Your bird has landed.',
  color: '#ff4d6d',
  Icon: PiBirdFill
};

function useCountUp(target: number, duration: number, delay: number) {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      const start = performance.now();
      let raf: number;

      function tick() {
        const elapsed = performance.now() - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.floor(eased * target));
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        }
      }
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [target, duration, delay]);

  return { value, visible };
}

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const distance = useGameStore((s) => s.distance);
  const deathReason = useGameStore((s) => s.deathReason);
  const leaderboard = useGameStore((s) => s.leaderboard);
  const setGameState = useGameStore((s) => s.setGameState);
  const startGame = useGameStore((s) => s.startGame);
  const eagleDodges = useGameStore((s) => s.eagleDodges);
  const feedingScore = useGameStore((s) => s.feedingScore);
  const loadLeaderboard = useGameStore((s) => s.loadLeaderboard);
  const playerName = useGameStore((s) => s.playerName);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const death = (deathReason && DEATHS[deathReason]) || DEFAULT_DEATH;
  const topPlayers = leaderboard.slice(0, 3);

  const myIndex = leaderboard.findIndex(
    (e) =>
      e.name === (playerName || 'Player') &&
      Math.abs(Math.floor(e.score) - Math.floor(score)) < 1
  );
  const rank = myIndex >= 0 ? myIndex + 1 : null;

  const eagleBonus = eagleDodges * SCORE_EAGLE_DODGE_BONUS;
  const flightScore = Math.max(
    0,
    Math.floor(score) - eagleBonus - Math.floor(feedingScore)
  );

  const flight = useCountUp(flightScore, 800, 300);
  const feeding = useCountUp(Math.floor(feedingScore), 800, 600);
  const eagles = useCountUp(eagleBonus, 800, 900);
  const total = useCountUp(Math.floor(score), 1000, 1400);

  const DeathIcon = death.Icon;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 50% at 50% 20%, ${death.color}33 0%, transparent 60%)`
        }}
      />
      <Particles count={20} color={death.color} />

      <div className="relative z-10 mt-5 flex h-full flex-col gap-3 px-6 md:mt-10">
        {/* Death card */}
        <div className="text-center">
          <div
            className="mb-3 inline-flex h-[68px] w-[68px] items-center justify-center rounded-[20px] border"
            style={{
              background: `${death.color}22`,
              borderColor: `${death.color}66`,
              color: death.color
            }}
          >
            <DeathIcon size={32} />
          </div>
          <h1 className="font-display text-[30px] font-extrabold tracking-[-0.02em] text-white">
            {death.title}
          </h1>
          <p className="mt-1 text-[13px] text-white/50">{death.sub}</p>
        </div>

        {/* Flight log */}
        <GlassCard className="px-[18px] py-4">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="font-display text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase">
              Flight Log
            </span>
            {rank !== null && (
              <div
                className="flex items-center gap-1.5 rounded-[8px] px-2 py-[3px]"
                style={{
                  background: `${ACCENT.main}22`,
                  color: ACCENT.main
                }}
              >
                <PiMedalFill />
                <span className="font-display text-[10px] font-extrabold tracking-widest uppercase">
                  #{rank} Today
                </span>
              </div>
            )}
          </div>

          <ScoreRow
            label="Flight"
            value={flight.value}
            visible={flight.visible}
          />
          <ScoreRow
            label="Feeding"
            value={feeding.value}
            visible={feeding.visible}
          />
          <ScoreRow
            label="Eagle Dodges"
            value={eagles.value}
            visible={eagles.visible}
          />
          <div className="my-2.5 h-px w-full bg-white/10" />
          <div
            className="flex items-baseline justify-between transition-opacity duration-300"
            style={{ opacity: total.visible ? 1 : 0 }}
          >
            <span className="font-display text-[11px] font-bold tracking-[0.25em] text-white/70 uppercase">
              Total
            </span>
            <span
              className="font-display bg-clip-text text-[32px] font-extrabold tracking-[-0.02em] text-transparent"
              style={{
                background: `linear-gradient(180deg, #fff, ${ACCENT.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {total.value.toLocaleString()}
            </span>
          </div>
          <div
            className="mt-1 flex items-center justify-between transition-opacity duration-300"
            style={{ opacity: total.visible ? 1 : 0 }}
          >
            <span className="text-[11px] text-white/40">Distance</span>
            <span className="font-display text-[13px] font-bold text-white/70">
              {distance.toFixed(1)} km
            </span>
          </div>
        </GlassCard>

        {/* Mini leaderboard */}
        <GlassCard className="px-3.5 py-3">
          <div className="mb-2 flex items-center gap-2">
            <PiMedalFill
              className="text-[13px]"
              style={{ color: ACCENT.main }}
            />
            <span className="font-display text-lg font-bold tracking-[0.05em] text-white">
              High Flyers
            </span>
          </div>
          {topPlayers.length > 0 ? (
            topPlayers.map((entry, i) => {
              const icon = SPECIES_ICON[entry.species as BirdSpeciesId];
              return (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="font-display w-3.5 text-xs font-extrabold text-white/30">
                    {i + 1}
                  </span>
                  {icon && (
                    <Image
                      src={icon}
                      alt={entry.species}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  <span className="font-display flex-1 text-base font-bold text-white">
                    {entry.name}
                  </span>
                  <span className="font-display text-base font-bold text-white">
                    {Math.floor(entry.score).toLocaleString()}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="py-2 text-center text-[12px] text-white/40">
              No flights yet.
            </p>
          )}
        </GlassCard>
        <div className="mt-3 flex gap-4 md:mt-2">
          <ArcadeButton accent={ACCENT.main} onClick={() => startGame()}>
            <PiArrowClockwiseBold className="text-sm" color="#0a0a0a" /> Fly
            Again
          </ArcadeButton>
          <ArcadeButton secondary onClick={() => setGameState('menu')}>
            <PiHouseBold className="text-sm" /> Home
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  visible
}: {
  label: string;
  value: number;
  visible: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-1 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)'
      }}
    >
      <span className="font-display text-[11px] font-semibold tracking-[0.15em] text-white/45 uppercase">
        {label}
      </span>
      <span className="font-display text-[16px] font-extrabold text-white">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

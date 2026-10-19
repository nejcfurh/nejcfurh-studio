'use client';

import { ACCENT, BG_IMAGE, SPECIES_ICON } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import { BirdSpeciesId, DeathReason } from '@/types';
import { BsFillDropletFill } from '@repo/ui/icons/react-icons/bs';
import { FaWheatAwn } from '@repo/ui/icons/react-icons/fa6';
import {
  PiArrowClockwiseBold,
  PiBirdFill,
  PiCatFill,
  PiHouseBold,
  PiMedalFill
} from '@repo/ui/icons/react-icons/pi';
import Image from 'next/image';
import { ComponentType, useEffect, useState } from 'react';

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
  const timeScore = useGameStore((s) => s.timeScore);
  const distanceScore = useGameStore((s) => s.distanceScore);
  const feedingScore = useGameStore((s) => s.feedingScore);
  const dodgeScore = useGameStore((s) => s.dodgeScore);
  const loadLeaderboard = useGameStore((s) => s.loadLeaderboard);
  const playerName = useGameStore((s) => s.playerName);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const death = (deathReason && DEATHS[deathReason]) || DEFAULT_DEATH;
  const topPlayers = leaderboard.slice(0, 5);

  const myIndex = leaderboard.findIndex(
    (e) =>
      e.name === (playerName || 'Player') &&
      Math.abs(Math.floor(e.score) - Math.floor(score)) < 1
  );
  const rank = myIndex >= 0 ? myIndex + 1 : null;

  const flight = useCountUp(Math.floor(timeScore), 800, 300);
  const travel = useCountUp(Math.floor(distanceScore), 800, 500);
  const feeding = useCountUp(Math.floor(feedingScore), 800, 700);
  const eagles = useCountUp(Math.floor(dodgeScore), 800, 900);
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

      <div className="relative z-10 flex h-full flex-col px-6 pt-5 pb-[max(20px,env(safe-area-inset-bottom))] md:pt-9">
        {/* Scrolls on very short screens so the buttons below stay reachable. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_calc(100%-20px),transparent)] pb-5">
          {/* Death card */}
          <div className="text-center">
            <div
              className="mb-2 inline-flex h-[52px] w-[52px] items-center justify-center rounded-[16px] border"
              style={{
                background: `${death.color}22`,
                borderColor: `${death.color}66`,
                color: death.color
              }}
            >
              <DeathIcon size={26} />
            </div>
            <h1 className="font-display text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-white">
              {death.title}
            </h1>
            <p className="mt-0.5 text-[13px] text-white/50">{death.sub}</p>
          </div>

          {/* Flight log */}
          <GlassCard className="px-[18px] py-4">
            <div className="mb-3 flex items-center justify-between">
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

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <ScoreStat
                label="Flight"
                value={flight.value}
                visible={flight.visible}
              />
              <ScoreStat
                label="Distance"
                value={travel.value}
                visible={travel.visible}
              />
              <ScoreStat
                label="Feeding"
                value={feeding.value}
                visible={feeding.visible}
              />
              <ScoreStat
                label="Eagle Dodges"
                value={eagles.value}
                visible={eagles.visible}
              />
            </div>
            <div className="my-3 h-px w-full bg-white/10" />
            <div
              className="flex items-end justify-between transition-opacity duration-300"
              style={{ opacity: total.visible ? 1 : 0 }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-display text-[11px] font-bold tracking-[0.25em] text-white/70 uppercase">
                  Total
                </span>
                <span className="font-display text-[12px] font-bold text-white/45">
                  {distance.toFixed(1)} km flown
                </span>
              </div>
              <span
                className="font-display bg-clip-text text-[32px] leading-none font-extrabold tracking-[-0.02em] text-transparent"
                style={{
                  background: `linear-gradient(180deg, #fff, ${ACCENT.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {total.value.toLocaleString()}
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
                  <div key={i} className="flex items-center gap-2 py-0.5">
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
                    <span className="font-display flex-1 truncate text-[15px] font-bold text-white">
                      {entry.name}
                    </span>
                    <span className="font-display text-[15px] font-bold text-white">
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
        </div>
        <div className="mt-3 flex shrink-0 gap-4">
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

function ScoreStat({
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
      className="flex flex-col gap-0.5 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)'
      }}
    >
      <span className="font-display text-[10px] font-semibold tracking-[0.15em] text-white/45 uppercase">
        {label}
      </span>
      <span className="font-display text-[18px] leading-tight font-extrabold text-white">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PiBird } from 'react-icons/pi';
import { BiChevronLeft } from 'react-icons/bi';
import { SCORE_EAGLE_DODGE_BONUS } from '@/utils/constants';

const DEATH_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  food: {
    title: 'Starved Mid-Flight',
    subtitle: 'Your bird could not fly anymore!',
  },
  water: {
    title: 'Dehydrated',
    subtitle: 'Lack of hydration brought your bird down!',
  },
  ground: {
    title: 'Grounded!',
    subtitle: 'A cat caught your bird on the ground!',
  },
  eagle: { title: 'Snatched!', subtitle: 'An eagle caught your bird mid-air!' },
  cat: {
    title: 'Ambushed!',
    subtitle: 'A cat caught your bird at the feeder!',
  },
};

const DEFAULT_DEATH = {
  title: 'Flight Over',
  subtitle: 'Your bird has landed!',
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
        // Ease-out curve
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
  const score = useGameStore(s => s.score);
  const distance = useGameStore(s => s.distance);
  const deathReason = useGameStore(s => s.deathReason);
  const leaderboard = useGameStore(s => s.leaderboard);
  const setGameState = useGameStore(s => s.setGameState);
  const startGame = useGameStore(s => s.startGame);
  const saveScore = useGameStore(s => s.saveScore);
  const storedName = useGameStore(s => s.playerName);
  const eagleDodges = useGameStore(s => s.eagleDodges);
  const feedingScore = useGameStore(s => s.feedingScore);
  const [playerName, setPlayerName] = useState(storedName || '');
  const [saved, setSaved] = useState(false);

  const topPlayers = leaderboard.slice(0, 4);
  const death = (deathReason && DEATH_MESSAGES[deathReason]) || DEFAULT_DEATH;

  // Calculate score breakdown
  const eagleBonus = eagleDodges * SCORE_EAGLE_DODGE_BONUS;
  const flightScore = Math.max(
    0,
    Math.floor(score) - eagleBonus - Math.floor(feedingScore),
  );

  // Staggered animated count-ups
  const flight = useCountUp(flightScore, 800, 300);
  const feeding = useCountUp(Math.floor(feedingScore), 800, 600);
  const eagles = useCountUp(eagleBonus, 800, 900);
  const total = useCountUp(Math.floor(score), 1000, 1400);

  const handleSave = () => {
    if (playerName.trim()) {
      saveScore(playerName.trim());
      setSaved(true);
    }
  };

  return (
    <div className="w-full h-full z-50 flex flex-col bg-linear-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]">
      <div className="flex flex-col items-center justify-between h-full pt-3 px-6 pb-8 gap-2">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white">{death.title}</h1>
          <p className="text-white/35 text-[13px] my-1">{death.subtitle}</p>
        </div>

        {/* Score breakdown */}
        <div className="w-full max-w-80 bg-white/4 backdrop-blur-xl rounded-[18px] px-6 py-3 flex flex-col items-center gap-3">
          {/* Breakdown lines */}
          <div className="w-full flex flex-col ">
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
              label={`Eagle Dodges`}
              value={eagles.value}
              visible={eagles.visible}
            />

            <div className="w-full h-px bg-white/10 my-1" />
            {/* Total */}
            <div
              className="flex items-center justify-between transition-opacity duration-300"
              style={{ opacity: total.visible ? 1 : 0 }}
            >
              <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">
                Total
              </span>
              <span className="text-3xl font-semibold text-white">
                {total.value.toLocaleString()}
              </span>
            </div>
            <div
              className="flex items-center justify-between transition-opacity duration-300"
              style={{ opacity: total.visible ? 1 : 0 }}
            >
              <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">
                Distance
              </span>
              <span className="text-lg font-light text-white/50">
                {distance.toFixed(1)} km
              </span>
            </div>
          </div>

          {!saved ? (
            <div className="w-full flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={16}
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-white/8 border-none text-white text-[13px] outline-none"
              />
              <button
                onClick={handleSave}
                className="py-2.5 px-[18px] rounded-xl bg-[#00AEEF] border-none text-white text-[13px] font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-xs text-[#4CAF50]">Score saved!</p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="w-full max-w-80 bg-white/4 backdrop-blur-xl rounded-[18px] py-4 px-[18px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">High Flyers</span>
            <span className="text-[9px] font-bold text-[#FFD700] uppercase tracking-wider bg-[rgba(255,215,0,0.1)] py-[3px] px-2 rounded-[10px]">
              World Records
            </span>
          </div>

          {topPlayers.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {topPlayers.map((entry, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/30 w-4 font-bold">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-[13px] text-white font-medium">
                        {entry.name}
                      </p>
                      <p className="text-[9px] text-white/30 capitalize">
                        {entry.species}
                      </p>
                    </div>
                  </div>
                  <span className="text-[13px] text-white font-bold">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-white/20 text-center py-3">
              No records yet
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full max-w-80 flex flex-col gap-2.5">
          <button
            onClick={() => startGame()}
            className="w-full mt-1 py-[18px] rounded-2xl font-bold text-[17px] text-white bg-linear-to-br from-[#00AEEF] to-[#0077BB] shadow-[0_6px_30px_rgba(0,174,239,0.35)] border-none cursor-pointer flex items-center justify-center gap-2"
          >
            FLY AGAIN{' '}
            <span>
              <PiBird />
            </span>
          </button>

          <button
            onClick={() => setGameState('menu')}
            className="flex items-center justify-center gap-2 w-full rounded-2xl font-thin text-lg text-white/50  border-none cursor-pointer mt-1"
          >
            <BiChevronLeft className="scale-150" /> Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  visible,
}: {
  label: string;
  value: number;
  visible: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      <span className="text-[11px] text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-lg font-bold text-white/80">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

'use client';

import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { PiBird, PiGear } from 'react-icons/pi';

import FloatingParticles from './FloatingParticles';
import Leaderboard from './Leaderboard';
import Title from './Title';
import Top3Leaderboard from './Top3Leaderboard';

export default function StartMenu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const leaderboard = useGameStore((s) => s.leaderboard);
  const loadLeaderboard = useGameStore((s) => s.loadLeaderboard);
  const [showRankings, setShowRankings] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const topPlayers = leaderboard.slice(0, 3);

  return (
    <div className="h-100dvh z-50 flex w-full flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <FloatingParticles />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-between px-8 pb-10">
        {/* TITLE */}
        <Title />
        {/* BIRD OF THE DAY */}
        <Link
          href="https://www.onebirdaday.com"
          className="mt-4 flex items-center rounded-full bg-green-900/50 px-3 py-1.5 backdrop-blur-xl"
        >
          <div>
            <p className="flex animate-pulse items-center gap-0.5 text-center text-lg font-semibold tracking-wider text-white/70 uppercase">
              Bird of the Day <BiChevronRight />
            </p>
          </div>
        </Link>

        {/* START BUTTON */}
        <div className="w-full max-w-80">
          <button
            onClick={() => {
              const hasProfile = localStorage.getItem('backyard-skies-name');
              setGameState(hasProfile ? 'species-select' : 'settings');
            }}
            className="my-6 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-none bg-linear-to-br from-[#00AEEF] to-[#0077BB] px-6 py-[18px] text-[17px] font-bold text-white shadow-[0_6px_30px_rgba(0,174,239,0.35)] transition-transform active:scale-[0.96]"
          >
            START FLYING
            <span className="text-xl">
              <PiBird />
            </span>
          </button>
        </div>

        {/* LEADERBOARD */}
        <Top3Leaderboard
          topPlayers={topPlayers}
          handleViewAllRankings={() => setShowRankings(true)}
        />

        {/* BOTTOM NAV */}
        <div className="flex items-end gap-9 pb-2">
          <button
            onClick={() => setGameState('settings')}
            className="flex cursor-pointer flex-col items-center gap-1 border-none bg-transparent text-base font-semibold tracking-wide text-white/70"
          >
            <span className="text-4xl">
              <PiGear />
            </span>
            <span>SETTINGS</span>
          </button>
        </div>
      </div>

      {/* ALL RANKINGS */}
      {showRankings && (
        <Leaderboard
          handleBack={() => setShowRankings(false)}
          leaderboard={leaderboard}
        />
      )}
    </div>
  );
}

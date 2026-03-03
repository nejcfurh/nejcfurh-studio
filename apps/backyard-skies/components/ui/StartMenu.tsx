'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import FloatingParticles from './FloatingParticles';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import { PiBird, PiGear } from 'react-icons/pi';
import Leaderboard from './Leaderboard';
import Top3Leaderboard from './Top3Leaderboard';
import Title from './Title';

export default function StartMenu() {
  const setGameState = useGameStore(s => s.setGameState);
  const leaderboard = useGameStore(s => s.leaderboard);
  const loadLeaderboard = useGameStore(s => s.loadLeaderboard);
  const [showRankings, setShowRankings] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const topPlayers = leaderboard.slice(0, 3);

  return (
    <div className="w-full h-100dvh z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <FloatingParticles />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-between px-8 pb-10">
        {/* TITLE */}
        <Title />
        {/* BIRD OF THE DAY */}
        <Link
          href="https://www.onebirdaday.com"
          className="mt-4 flex items-center bg-green-900/50 backdrop-blur-xl rounded-full py-1.5 px-3"
        >
          <div>
            <p className="text-lg flex items-center gap-0.5 text-white/70 font-semibold uppercase tracking-wider text-center animate-pulse">
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
            className="my-6 w-full py-[18px] px-6 rounded-2xl font-bold text-[17px] text-white bg-linear-to-br from-[#00AEEF] to-[#0077BB] shadow-[0_6px_30px_rgba(0,174,239,0.35)] border-none cursor-pointer flex items-center justify-center gap-2.5 transition-transform active:scale-[0.96]"
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
        <div className="flex gap-9 pb-2 items-end">
          <button
            onClick={() => setGameState('settings')}
            className="flex flex-col items-center gap-1 text-white/70 text-base font-semibold tracking-wide bg-transparent border-none cursor-pointer"
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

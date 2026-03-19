'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence } from '@repo/ui/animation';
import { AnimatedButton, AnimatedDiv } from '@repo/ui/animation/core';
import { useEffect, useState } from 'react';
import { PiBird, PiGear } from 'react-icons/pi';

import FloatingParticles from './FloatingParticles';
import Leaderboard from './Leaderboard';
import Title from './Title';
import Top3Leaderboard from './Top3Leaderboard';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

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
    <AnimatedDiv
      className="h-100dvh z-50 flex w-full flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-center bg-no-repeat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <FloatingParticles />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-between px-8 pb-10 md:pt-5">
        {/* TITLE */}
        <AnimatedDiv
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <Title />
        </AnimatedDiv>

        {/* START BUTTON */}
        <AnimatedDiv
          className="my-5 w-full max-w-80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <AnimatedButton
            onClick={() => {
              const hasProfile = localStorage.getItem('backyard-skies-name');
              setGameState(hasProfile ? 'species-select' : 'settings');
            }}
            className="my-6 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-none bg-linear-to-br from-[#00AEEF] to-[#0077BB] px-6 py-[18px] text-[17px] font-bold text-white shadow-[0_6px_30px_rgba(0,174,239,0.35)]"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={spring}
          >
            START FLYING
            <span className="text-xl">
              <PiBird />
            </span>
          </AnimatedButton>
        </AnimatedDiv>

        {/* LEADERBOARD */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
          className="w-full max-w-80"
        >
          <Top3Leaderboard
            topPlayers={topPlayers}
            handleViewAllRankings={() => setShowRankings(true)}
          />
        </AnimatedDiv>

        {/* BOTTOM NAV */}
        <AnimatedDiv
          className="flex items-end gap-9 pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.7 }}
        >
          <button
            onClick={() => setGameState('settings')}
            className="flex cursor-pointer flex-col items-center gap-1 border-none bg-transparent text-base font-semibold tracking-wide text-white/70"
          >
            <span className="text-4xl">
              <PiGear />
            </span>
            <span>SETTINGS</span>
          </button>
        </AnimatedDiv>
      </div>

      {/* ALL RANKINGS */}
      <AnimatePresence>
        {showRankings && (
          <Leaderboard
            handleBack={() => setShowRankings(false)}
            leaderboard={leaderboard}
          />
        )}
      </AnimatePresence>
    </AnimatedDiv>
  );
}

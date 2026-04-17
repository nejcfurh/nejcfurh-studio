'use client';

import { ACCENT, BG_IMAGE } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import { AnimatePresence } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { useEffect, useState } from 'react';
import { PiGear, PiPlayFill } from 'react-icons/pi';

import Leaderboard from './Leaderboard';
import { ArcadeButton, Particles } from './primitives';
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

  const handlePlay = () => {
    const hasProfile = localStorage.getItem('backyard-skies-name');
    setGameState(hasProfile ? 'species-select' : 'settings');
  };

  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 opacity-50 contrast-[1.05] saturate-110"
        style={{
          background: `
            radial-gradient(80% 50% at 50% 15%, ${ACCENT.main}22 0%, transparent 60%),
            url('/menu-bg.jpg') center/cover no-repeat
          `
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(5,10,26,0.4)_50%,rgba(5,10,26,0.95)_100%)]" />
      <Particles count={40} color={ACCENT.main} />

      {/* MAIN CONTENT */}
      <div className="relative z-10 my-5 flex h-full flex-col px-6">
        {/* TITLE */}
        <div className="flex flex-col items-center">
          <Title />
        </div>
        {/* CTA */}
        <AnimatedDiv
          className="mt-auto mb-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <ArcadeButton accent={ACCENT.main} onClick={handlePlay}>
            <PiPlayFill className="text-sm" color="#0a0a0a" /> Start Flying
          </ArcadeButton>
        </AnimatedDiv>

        {/* LEADERBOARD */}
        <AnimatedDiv
          className="my-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
        >
          <Top3Leaderboard
            topPlayers={topPlayers}
            handleViewAllRankings={() => setShowRankings(true)}
          />
        </AnimatedDiv>

        {/* SETTINGS */}
        <AnimatedDiv
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.7 }}
        >
          <button
            onClick={() => setGameState('settings')}
            className="cursor-pointer bg-transparent p-2 text-5xl text-white/70"
            aria-label="Settings"
          >
            <PiGear />
          </button>
        </AnimatedDiv>
      </div>

      {/* LEADERBOARD OVERLAY */}
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

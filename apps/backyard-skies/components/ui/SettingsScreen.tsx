'use client';

import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { BsQuestion } from 'react-icons/bs';

import TermsConditions from './TermsConditions';
import Tips from './Tips';

export default function SettingsScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const [name, setName] = useState(playerName);
  const isMuted = useGameStore((s) => s.isMuted);
  const setMuted = useGameStore((s) => s.setMuted);
  const [saved, setSaved] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const isFirstTime = !playerName;

  const handleSave = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (showTips) {
    return <Tips handleBack={() => setShowTips(false)} />;
  }

  if (showTerms) {
    return <TermsConditions handleBack={() => setShowTerms(false)} />;
  }

  return (
    <div className="z-50 flex h-full w-full flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="h-100dvh flex flex-col justify-between px-6 py-6">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between gap-3">
          {!isFirstTime ? (
            <button
              onClick={() => setGameState('menu')}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-lg text-black"
            >
              <BiChevronLeft />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <span className="text-lg font-bold tracking-[0.25em] text-black/70 uppercase">
            {isFirstTime ? 'Welcome' : 'Settings'}
          </span>
          <button
            onClick={() => setShowTips(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-lg text-black"
          >
            <BsQuestion />
          </button>
        </div>

        {/* PLAYER NAME SECTION */}
        <div className="mx-auto mb-4 w-full max-w-[360px] rounded-[20px] border border-black/6 bg-black/40 p-5 backdrop-blur-xl">
          <p className="mb-3 text-base font-semibold tracking-[0.2em] text-white/70 uppercase">
            Player Name
          </p>

          <div className="flex gap-2">
            <div
              className="relative flex-1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                placeholder="Enter your name..."
                maxLength={16}
                className="w-full rounded-xl border border-black/10 bg-white/40 px-3.5 py-3 font-[inherit] text-sm text-black outline-none placeholder:text-black/30"
              />
            </div>
            <button
              onClick={handleSave}
              className={`cursor-pointer rounded-xl border-none px-5 py-3 text-[13px] font-bold text-white transition-colors ${
                saved ? 'bg-[#4CAF50]' : 'bg-[#3f494c]'
              }`}
            >
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* SOUND */}
        <div className="mx-auto w-full max-w-[360px] rounded-[20px] border border-black/6 bg-black/30 p-5 backdrop-blur-xl">
          <p className="mb-3.5 text-base font-semibold tracking-[0.2em] text-white/70 uppercase">
            Sound
          </p>
          <button
            onClick={() => setMuted(!isMuted)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3.5 ${
              isMuted
                ? 'border-2 border-white/6 bg-black/3'
                : 'border-2 border-[#00AEEF] bg-[rgba(0,174,239,0.12)]'
            }`}
          >
            <span className="text-[13px] font-bold text-white/80">
              Sound Effects
            </span>
            <span
              className={`text-sm font-bold ${isMuted ? 'text-white/30' : 'text-[#00AEEF]'}`}
            >
              {isMuted ? 'OFF' : 'ON'}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowTerms(true)}
          className="my-5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/40 bg-black/3 px-4 py-3.5 text-white"
        >
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-white/80">
              Terms & Conditions
            </span>
          </div>
          <span className="text-sm text-white/50">
            <BiChevronRight />
          </span>
        </button>

        <button
          onClick={() => {
            if (name.trim()) {
              setPlayerName(name.trim());
            }
            setGameState('species-select');
          }}
          className="mx-auto my-5 flex w-full max-w-[360px] cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-none bg-linear-to-br from-[#00AEEF] to-[#0077BB] py-[18px] text-[17px] font-extrabold tracking-wide text-white shadow-[0_6px_28px_rgba(0,174,239,0.40)]"
        >
          CHOOSE YOUR BIRD
        </button>

        {/* APP INFO */}
        <div className="fixed right-0 bottom-0 left-0 mt-2 mb-4 text-center">
          <p className="mt-1 text-[10px] text-white/20">
            Version 0.0.1 · by Nejc Furh
          </p>
        </div>
      </div>
    </div>
  );
}

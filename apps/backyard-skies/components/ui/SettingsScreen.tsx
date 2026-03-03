'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { BsQuestion } from 'react-icons/bs';
import TermsConditions from './TermsConditions';
import Tips from './Tips';

export default function SettingsScreen() {
  const setGameState = useGameStore(s => s.setGameState);
  const playerName = useGameStore(s => s.playerName);
  const setPlayerName = useGameStore(s => s.setPlayerName);
  const [name, setName] = useState(playerName);
  const isMuted = useGameStore(s => s.isMuted);
  const setMuted = useGameStore(s => s.setMuted);
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
    <div className="w-full h-full z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="flex flex-col justify-between py-6 px-6  h-100dvh">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {!isFirstTime ? (
            <button
              onClick={() => setGameState('menu')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-black text-lg cursor-pointer"
            >
              <BiChevronLeft />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <span className="text-lg font-bold text-black/70 tracking-[0.25em] uppercase">
            {isFirstTime ? 'Welcome' : 'Settings'}
          </span>
          <button
            onClick={() => setShowTips(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-black text-lg cursor-pointer"
          >
            <BsQuestion />
          </button>
        </div>

        {/* PLAYER NAME SECTION */}
        <div className="w-full max-w-[360px] mx-auto mb-4 bg-black/40 backdrop-blur-xl rounded-[20px] p-5 border border-black/6">
          <p className="text-base text-white/70 tracking-[0.2em] uppercase font-semibold mb-3">
            Player Name
          </p>

          <div className="flex gap-2">
            <div
              className="flex-1 relative"
              onPointerDown={e => e.stopPropagation()}
            >
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                placeholder="Enter your name..."
                maxLength={16}
                className="w-full py-3 px-3.5 rounded-xl bg-white/40 border border-black/10 text-black text-sm outline-none font-[inherit] placeholder:text-black/30"
              />
            </div>
            <button
              onClick={handleSave}
              className={`py-3 px-5 rounded-xl border-none text-white text-[13px] font-bold cursor-pointer transition-colors ${
                saved ? 'bg-[#4CAF50]' : 'bg-[#3f494c]'
              }`}
            >
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* SOUND */}
        <div className="w-full max-w-[360px] mx-auto bg-black/30 backdrop-blur-xl rounded-[20px] p-5 border border-black/6">
          <p className="text-base text-white/70 tracking-[0.2em] uppercase font-semibold mb-3.5">
            Sound
          </p>
          <button
            onClick={() => setMuted(!isMuted)}
            className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-between cursor-pointer ${
              isMuted
                ? 'bg-black/3 border-2 border-white/6'
                : 'bg-[rgba(0,174,239,0.12)] border-2 border-[#00AEEF]'
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
          className="w-full my-5 flex items-center justify-between py-3.5 px-4 rounded-xl bg-black/3 border border-white/40 text-white cursor-pointer"
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
          className="w-full max-w-[360px] mx-auto my-5 py-[18px] rounded-2xl font-extrabold text-[17px] text-white bg-linear-to-br from-[#00AEEF] to-[#0077BB] shadow-[0_6px_28px_rgba(0,174,239,0.40)] border-none cursor-pointer flex items-center justify-center gap-2.5 tracking-wide"
        >
          CHOOSE YOUR BIRD
        </button>

        {/* APP INFO */}
        <div className=" fixed bottom-0 left-0 right-0 text-center mt-2 mb-4">
          <p className="text-[10px] text-white/20 mt-1">
            Version 0.0.1 · by Nejc Furh
          </p>
        </div>
      </div>
    </div>
  );
}

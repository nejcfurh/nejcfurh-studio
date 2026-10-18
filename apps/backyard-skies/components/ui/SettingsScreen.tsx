'use client';

import { ACCENT, BG_IMAGE } from '@/lib/designTokens';
import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, useReducedMotion } from '@repo/ui/animation';
import { AnimatedDiv, AnimatedSpan } from '@repo/ui/animation/core';
import { BiChevronRight } from '@repo/ui/icons/react-icons/bi';
import {
  PiCheckBold,
  PiHandTapBold,
  PiInfoBold,
  PiPlayFill,
  PiQuestionBold,
  PiSpeakerHighBold,
  PiUserBold,
  PiXBold
} from '@repo/ui/icons/react-icons/pi';
import { ComponentType, ReactNode, useState } from 'react';

import PageHeader from './PageHeader';
import { ArcadeButton, GlassCard } from './primitives';
import TermsConditions from './TermsConditions';
import Tips from './Tips';
import { useTutorialDone, writeTutorialDone } from './Tutorial';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

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
  const tutorialDone = useTutorialDone();
  const isFirstTime = !playerName;

  const handleSave = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleContinue = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
    }
    setGameState('species-select');
  };

  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-30%' }}
      transition={spring}
    >
      <div className="absolute inset-0 bg-[rgba(5,8,20,0.55)] backdrop-blur-[10px]" />

      <div className="relative z-10 my-5 flex h-full flex-col gap-5 overflow-y-auto px-6">
        <PageHeader
          title={isFirstTime ? 'Welcome' : 'Settings'}
          onBack={() => setGameState('menu')}
          rightSlot={
            <button
              onClick={() => setShowTips(true)}
              className="flex cursor-pointer items-center justify-center text-white/60"
              aria-label="Tips"
            >
              <PiQuestionBold className="text-3xl" />
            </button>
          }
        />

        {/* PLAYER NAME */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.25 }}
        >
          <GlassCard className="p-[18px]">
            <SectionLabel icon={PiUserBold} accent={ACCENT.main}>
              Player Name
            </SectionLabel>
            <div
              className="mt-3 flex gap-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                placeholder="Enter your name…"
                maxLength={16}
                className="font-display min-w-0 flex-1 rounded-[12px] border border-white/10 bg-white/5 px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-white/30"
              />
              <SaveButton saved={saved} onClick={handleSave} />
            </div>
          </GlassCard>
        </AnimatedDiv>

        {/* Toggles */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
        >
          <GlassCard className="py-1">
            <SettingRow
              Icon={PiSpeakerHighBold}
              accent={ACCENT.main}
              title="Sound Effects"
              value={!isMuted}
              onToggle={() => setMuted(!isMuted)}
            />
            <SettingRow
              Icon={PiHandTapBold}
              accent={ACCENT.main}
              title="Show Tutorial"
              value={!tutorialDone}
              onToggle={() => writeTutorialDone(!tutorialDone)}
            />
          </GlassCard>
        </AnimatedDiv>

        {/* TERMS */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.45 }}
        >
          <button
            onClick={() => setShowTerms(true)}
            className="flex w-full cursor-pointer items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3.5 text-left text-white backdrop-blur-xl"
          >
            <span className="flex items-center gap-3">
              <span
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px]"
                style={{
                  background: `${ACCENT.main}22`,
                  color: ACCENT.main
                }}
              >
                <PiInfoBold />
              </span>
              <span className="font-display text-[15px] font-bold text-white">
                Terms &amp; Conditions
              </span>
            </span>
            <BiChevronRight className="text-white/50" />
          </button>
        </AnimatedDiv>

        <div className="flex-1" />

        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
        >
          <ArcadeButton accent={ACCENT.main} onClick={handleContinue}>
            <PiPlayFill className="text-sm" color="#0a0a0a" />
            {isFirstTime ? 'Start Flying' : 'Choose Your Bird'}
          </ArcadeButton>
        </AnimatedDiv>

        {!isFirstTime && (
          <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.6 }}
          >
            <ArcadeButton secondary onClick={() => setGameState('menu')}>
              <PiXBold className="text-sm" /> Back to Menu
            </ArcadeButton>
          </AnimatedDiv>
        )}

        <p className="mt-2 text-center text-[10px] text-white/30">
          Version 0.0.1 · by Nejc Furh
        </p>
      </div>

      <AnimatePresence>
        {showTips && <Tips key="tips" handleBack={() => setShowTips(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showTerms && (
          <TermsConditions key="terms" handleBack={() => setShowTerms(false)} />
        )}
      </AnimatePresence>
    </AnimatedDiv>
  );
}

const SAVE_SWAP = { duration: 0.3, ease: 'easeOut' } as const;

function SaveButton({
  saved,
  onClick
}: {
  saved: boolean;
  onClick: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, filter: 'blur(6px)', scale: 0.85 };
  const shown = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, filter: 'blur(0px)', scale: 1 };

  return (
    <button
      onClick={onClick}
      aria-label={saved ? 'Saved' : 'Save'}
      className={[
        'font-display grid cursor-pointer place-items-center rounded-[12px] border border-white/10 px-5 py-3 text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 ease-out',
        saved ? 'bg-[#4CAF50] text-[#0a0a0a]' : 'bg-white/10 text-white'
      ].join(' ')}
    >
      {/* Always in the cell, so the button keeps the width of its label. */}
      <span aria-hidden className="invisible [grid-area:1/1]">
        Save
      </span>
      <AnimatePresence initial={false}>
        {saved ? (
          <AnimatedSpan
            key="saved"
            aria-hidden
            className="flex [grid-area:1/1]"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={SAVE_SWAP}
          >
            <PiCheckBold className="text-[17px]" />
          </AnimatedSpan>
        ) : (
          <AnimatedSpan
            key="save"
            aria-hidden
            className="[grid-area:1/1]"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={SAVE_SWAP}
          >
            Save
          </AnimatedSpan>
        )}
      </AnimatePresence>
    </button>
  );
}

function SectionLabel({
  icon: IconComp,
  accent,
  children
}: {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
        style={{ background: `${accent}22`, color: accent }}
      >
        <IconComp className="text-lg" />
      </span>
      <span className="font-display text-sm font-bold tracking-[0.2em] text-white uppercase">
        {children}
      </span>
    </div>
  );
}

function SettingRow({
  Icon,
  accent,
  title,
  value,
  onToggle
}: {
  Icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  title: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center px-4 py-4">
      <div
        className="mr-3 flex h-[34px] w-[34px] items-center justify-center rounded-[10px]"
        style={{ background: `${accent}22`, color: accent }}
      >
        <Icon className="text-lg" />
      </div>
      <div className="font-display flex-1 text-[15px] font-bold text-white">
        {title}
      </div>
      <button
        onClick={onToggle}
        className="relative h-[26px] w-[46px] cursor-pointer rounded-full border-0 transition-[background] duration-200"
        style={{
          background: value ? accent : 'rgba(255,255,255,0.1)'
        }}
        aria-pressed={value}
        aria-label={title}
      >
        <span
          className="absolute top-[2px] block h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-[left] duration-200"
          style={{ left: value ? 22 : 2 }}
        />
      </button>
    </div>
  );
}

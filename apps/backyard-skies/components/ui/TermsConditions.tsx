'use client';

import { ACCENT, BG_IMAGE } from '@/lib/designTokens';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { ReactNode } from 'react';

import PageHeader from './PageHeader';
import { Aurora, GlassCard } from './primitives';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

type Clause = { n: number; title: string; body: ReactNode };

const CLAUSES: Clause[] = [
  {
    n: 1,
    title: 'Acceptance of Terms',
    body: 'By downloading, installing, or using Backyard Skies (“the Game”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Game.'
  },
  {
    n: 2,
    title: 'Game Description',
    body: 'Backyard Skies is a casual bird flight simulation game developed by Nejc Furh. The Game allows users to control virtual birds, explore procedurally generated environments, and compete on leaderboards.'
  },
  {
    n: 3,
    title: 'User Data',
    body: 'The Game stores your player name and high scores locally on your device using browser storage. No personal data is transmitted to external servers. You may clear this data at any time by clearing your browser storage.'
  },
  {
    n: 4,
    title: 'Intellectual Property',
    body: 'All content within the Game, including graphics, designs, game mechanics, and audio, is the property of Nejc Furh and is protected by applicable intellectual property laws.'
  },
  {
    n: 5,
    title: 'User Conduct',
    body: 'You agree not to exploit bugs, use automated tools, or engage in any activity that disrupts the intended gameplay experience. Leaderboard manipulation or fraudulent score submissions are prohibited.'
  },
  {
    n: 6,
    title: 'Disclaimer of Warranties',
    body: 'The Game is provided “as is” without warranties of any kind, express or implied. Nejc Furh does not guarantee uninterrupted or error-free gameplay.'
  },
  {
    n: 7,
    title: 'Limitation of Liability',
    body: 'In no event shall Nejc Furh be liable for any indirect, incidental, or consequential damages arising from your use of the Game.'
  },
  {
    n: 8,
    title: 'Changes to Terms',
    body: 'Nejc Furh reserves the right to modify these Terms at any time. Continued use of the Game after changes constitutes acceptance of the updated Terms.'
  },
  {
    n: 9,
    title: 'Contact',
    body: (
      <>
        For questions regarding these Terms, please contact us at{' '}
        <span style={{ color: ACCENT.main }}>support@backyardskies.com</span>.
      </>
    )
  }
];

const TermsConditions = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
    >
      <Aurora colors={[ACCENT.main, '#4aa0ff']} opacity={0.4} />
      <div className="absolute inset-0 bg-[rgba(5,8,20,0.55)] backdrop-blur-[10px]" />

      <div className="relative z-10 my-5 flex h-full flex-col gap-4 px-6">
        <PageHeader title="Terms & Conditions" onBack={handleBack} />

        <div
          className="scroll flex flex-1 flex-col gap-2.5 overflow-auto pr-1 pb-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {CLAUSES.map((c, i) => (
            <AnimatedDiv
              key={c.n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 + i * 0.04 }}
            >
              <GlassCard className="p-4">
                <div className="mb-2 flex items-center gap-2.5">
                  <span
                    className="font-display flex h-[28px] w-[28px] items-center justify-center rounded-[9px] text-[12px] font-extrabold"
                    style={{
                      background: `${ACCENT.main}22`,
                      color: ACCENT.main
                    }}
                  >
                    {c.n}
                  </span>
                  <span className="font-display text-[14px] font-bold text-white">
                    {c.title}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.6] text-white/70">
                  {c.body}
                </p>
              </GlassCard>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default TermsConditions;

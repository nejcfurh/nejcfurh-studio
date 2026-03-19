'use client';

import { AnimatedButton, AnimatedDiv } from '@repo/ui/animation/core';
import { BiChevronLeft } from 'react-icons/bi';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const TermsConditions = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-center bg-no-repeat"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
    >
      <div className="flex h-full flex-col px-6 pt-6 pb-6">
        {/* Header */}
        <AnimatedDiv
          className="mb-4 flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <AnimatedButton
            onClick={handleBack}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-base text-black"
            whileTap={{ scale: 0.85 }}
            transition={spring}
          >
            <BiChevronLeft />
          </AnimatedButton>
          <span className="text-base font-bold tracking-[0.05em] text-black/70 uppercase">
            Terms & Conditions
          </span>
          <div className="h-10 w-10" />
        </AnimatedDiv>

        {/* Terms content */}
        <AnimatedDiv
          style={{ scrollbarWidth: 'none' }}
          className="flex-1 overflow-auto rounded-2xl border border-black/6 bg-black/5 p-5 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <div className="text-xs leading-[1.8] text-black/60">
            <p className="mb-3 text-sm font-bold text-black">
              Backyard Skies - Terms & Conditions
            </p>
            <p className="mb-3">Last updated: February 2026</p>

            <p className="mb-1.5 font-bold text-black/80">
              1. Acceptance of Terms
            </p>
            <p className="mb-4">
              By downloading, installing, or using Backyard Skies (&quot;the
              Game&quot;), you agree to be bound by these Terms and Conditions.
              If you do not agree, please do not use the Game.
            </p>

            <p className="mb-1.5 font-bold text-black/80">
              2. Game Description
            </p>
            <p className="mb-4">
              Backyard Skies is a casual bird flight simulation game developed
              by Nejc Furh. The Game allows users to control virtual birds,
              explore procedurally generated environments, and compete on
              leaderboards.
            </p>

            <p className="mb-1.5 font-bold text-black/80">3. User Data</p>
            <p className="mb-4">
              The Game stores your player name and high scores locally on your
              device using browser storage. No personal data is transmitted to
              external servers. You may clear this data at any time by clearing
              your browser storage.
            </p>

            <p className="mb-1.5 font-bold text-black/80">
              4. Intellectual Property
            </p>
            <p className="mb-4">
              All content within the Game, including but not limited to
              graphics, designs, game mechanics, and audio, is the property of
              Nejc Furh and is protected by applicable intellectual property
              laws.
            </p>

            <p className="mb-1.5 font-bold text-black/80">5. User Conduct</p>
            <p className="mb-4">
              You agree not to exploit bugs, use automated tools, or engage in
              any activity that disrupts the intended gameplay experience.
              Leaderboard manipulation or fraudulent score submissions are
              prohibited.
            </p>

            <p className="mb-1.5 font-bold text-black/80">
              6. Disclaimer of Warranties
            </p>
            <p className="mb-4">
              The Game is provided &quot;as is&quot; without warranties of any
              kind, express or implied. Nejc Furh does not guarantee
              uninterrupted or error-free gameplay.
            </p>

            <p className="mb-1.5 font-bold text-black/80">
              7. Limitation of Liability
            </p>
            <p className="mb-4">
              In no event shall Nejc Furh be liable for any indirect,
              incidental, or consequential damages arising from your use of the
              Game.
            </p>

            <p className="mb-1.5 font-bold text-black/80">
              8. Changes to Terms
            </p>
            <p className="mb-4">
              Nejc Furh reserves the right to modify these Terms at any time.
              Continued use of the Game after changes constitutes acceptance of
              the updated Terms.
            </p>

            <p className="mb-1.5 font-bold text-black/80">9. Contact</p>
            <p className="mb-4">
              For questions regarding these Terms, please contact us at
              support@backyardskies.com.
            </p>
          </div>
        </AnimatedDiv>
      </div>
    </AnimatedDiv>
  );
};

export default TermsConditions;

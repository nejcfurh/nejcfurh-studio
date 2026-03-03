import { BiChevronLeft } from 'react-icons/bi';

const TermsConditions = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="flex flex-col h-full pt-6 px-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-black text-base cursor-pointer"
          >
            <BiChevronLeft />
          </button>
          <span className="text-lg font-bold uppercase text-black/70 tracking-[0.05em]">
            Terms & Conditions
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Terms content */}
        <div
          style={{ scrollbarWidth: 'none' }}
          className="flex-1 overflow-auto bg-black/5 backdrop-blur-2xl rounded-2xl p-5 border border-black/6"
        >
          <div className="text-xs text-black/60 leading-[1.8]">
            <p className="font-bold text-black text-sm mb-3">
              Backyard Skies - Terms & Conditions
            </p>
            <p className="mb-3">Last updated: February 2026</p>

            <p className="font-bold text-black/80 mb-1.5">
              1. Acceptance of Terms
            </p>
            <p className="mb-4">
              By downloading, installing, or using Backyard Skies (&quot;the
              Game&quot;), you agree to be bound by these Terms and Conditions.
              If you do not agree, please do not use the Game.
            </p>

            <p className="font-bold text-black/80 mb-1.5">
              2. Game Description
            </p>
            <p className="mb-4">
              Backyard Skies is a casual bird flight simulation game developed
              by Nejc Furh. The Game allows users to control virtual birds,
              explore procedurally generated environments, and compete on
              leaderboards.
            </p>

            <p className="font-bold text-black/80 mb-1.5">3. User Data</p>
            <p className="mb-4">
              The Game stores your player name and high scores locally on your
              device using browser storage. No personal data is transmitted to
              external servers. You may clear this data at any time by clearing
              your browser storage.
            </p>

            <p className="font-bold text-black/80 mb-1.5">
              4. Intellectual Property
            </p>
            <p className="mb-4">
              All content within the Game, including but not limited to
              graphics, designs, game mechanics, and audio, is the property of
              Nejc Furh and is protected by applicable intellectual property
              laws.
            </p>

            <p className="font-bold text-black/80 mb-1.5">5. User Conduct</p>
            <p className="mb-4">
              You agree not to exploit bugs, use automated tools, or engage in
              any activity that disrupts the intended gameplay experience.
              Leaderboard manipulation or fraudulent score submissions are
              prohibited.
            </p>

            <p className="font-bold text-black/80 mb-1.5">
              6. Disclaimer of Warranties
            </p>
            <p className="mb-4">
              The Game is provided &quot;as is&quot; without warranties of any
              kind, express or implied. Nejc Furh does not guarantee
              uninterrupted or error-free gameplay.
            </p>

            <p className="font-bold text-black/80 mb-1.5">
              7. Limitation of Liability
            </p>
            <p className="mb-4">
              In no event shall Nejc Furh be liable for any indirect,
              incidental, or consequential damages arising from your use of the
              Game.
            </p>

            <p className="font-bold text-black/80 mb-1.5">
              8. Changes to Terms
            </p>
            <p className="mb-4">
              Nejc Furh reserves the right to modify these Terms at any time.
              Continued use of the Game after changes constitutes acceptance of
              the updated Terms.
            </p>

            <p className="font-bold text-black/80 mb-1.5">9. Contact</p>
            <p className="mb-4">
              For questions regarding these Terms, please contact us at
              support@backyardskies.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

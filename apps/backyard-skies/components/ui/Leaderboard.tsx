import { LeaderboardEntry } from '@/types';
import { BiChevronLeft } from 'react-icons/bi';

const Leaderboard = ({
  handleBack,
  leaderboard
}: {
  handleBack: () => void;
  leaderboard: LeaderboardEntry[];
}) => {
  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="flex h-full flex-col px-6 pt-6">
        {/* HEADER */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={handleBack}
            className="absolute left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-lg text-black"
          >
            <BiChevronLeft />
          </button>
          <span className="text-lg font-bold tracking-[0.25em] text-black/70 uppercase">
            All Rankings
          </span>
        </div>

        {/* RANKINGS LIST */}
        <div
          style={{ scrollbarWidth: 'none' }}
          className="flex-1 overflow-auto"
        >
          {leaderboard.length > 0 ? (
            <div className="flex flex-col gap-2">
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                    i < 3
                      ? 'border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.15)]'
                      : 'border border-white/6 bg-black/40'
                  } backdrop-blur-xl`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 text-lg font-bold ${i < 3 ? 'text-[#FFD700]' : 'text-white/50'}`}
                    >
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-base font-medium text-white">
                        {entry.name}
                      </p>
                      <p className="text-xs text-white/50 capitalize">
                        {entry.species}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-white">
                      {Math.floor(entry.score).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/40">
                      {entry.distance.toFixed(1)} km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-[13px] text-white/20">
              No flights yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

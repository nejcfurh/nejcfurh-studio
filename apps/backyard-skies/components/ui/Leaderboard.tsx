import { LeaderboardEntry } from '@/types';
import { BiChevronLeft } from 'react-icons/bi';

const Leaderboard = ({
  handleBack,
  leaderboard,
}: {
  handleBack: () => void;
  leaderboard: LeaderboardEntry[];
}) => {
  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="flex flex-col h-full pt-6 px-6">
        {/* HEADER */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={handleBack}
            className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-black text-lg cursor-pointer"
          >
            <BiChevronLeft />
          </button>
          <span className="text-lg font-bold text-black/70 tracking-[0.25em] uppercase">
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
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                    i < 3
                      ? 'bg-[rgba(255,215,0,0.15)] border border-[rgba(255,215,0,0.2)]'
                      : 'bg-black/40 border border-white/6'
                  } backdrop-blur-xl`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold w-7 ${i < 3 ? 'text-[#FFD700]' : 'text-white/50'}`}
                    >
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-base text-white font-medium">
                        {entry.name}
                      </p>
                      <p className="text-xs text-white/50 capitalize">
                        {entry.species}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base text-white font-bold">
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
            <p className="text-[13px] text-white/20 text-center py-12">
              No flights yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

import { LeaderboardEntry } from '@/types';
import { FaTrophy } from 'react-icons/fa';
import { GoDash } from 'react-icons/go';

const Top3Leaderboard = ({
  topPlayers,
  handleViewAllRankings
}: {
  topPlayers: LeaderboardEntry[];
  handleViewAllRankings: () => void;
}) => {
  return (
    <div className="mb-5 min-h-[200px] w-full max-w-80 rounded-[18px] bg-black/40 px-[18px] py-4 backdrop-blur-xl">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>
            <FaTrophy />
          </span>
          <span className="text-lg font-bold text-white">High Flyers</span>
        </div>
        <span className="rounded-[10px] bg-[rgba(255,217,0,0.34)] px-2 py-[3px] text-xs font-bold tracking-wider text-[#FFD700] uppercase">
          World Records
        </span>
      </div>

      {topPlayers.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {topPlayers.map((entry, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 text-lg font-bold text-white">
                  {i + 1}.
                </span>
                <div className="flex items-center gap-1">
                  <p className="text-base font-medium text-white">
                    {entry.name}
                  </p>
                  <GoDash />
                  <p className="text-sm text-white/80 capitalize">
                    {entry.species}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold text-white">
                  {entry.distance.toFixed(1)}
                </span>
                <span className="ml-[3px] text-[9px] text-white/30">km</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 py-4 text-center text-base text-white/50">
          No flights yet. Be the first!
        </p>
      )}

      {topPlayers.length > 0 && (
        <button
          onClick={handleViewAllRankings}
          className="mt-3.5 w-full cursor-pointer border-none bg-transparent text-center text-[11px] font-semibold text-[#00AEEF]"
        >
          VIEW ALL RANKINGS
        </button>
      )}
    </div>
  );
};

export default Top3Leaderboard;

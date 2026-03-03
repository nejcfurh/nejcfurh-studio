import { FaTrophy } from 'react-icons/fa';
import { LeaderboardEntry } from '@/types';
import { GoDash } from 'react-icons/go';

const Top3Leaderboard = ({
  topPlayers,
  handleViewAllRankings,
}: {
  topPlayers: LeaderboardEntry[];
  handleViewAllRankings: () => void;
}) => {
  return (
    <div className="mb-5 w-full min-h-[200px] max-w-80 bg-black/40 backdrop-blur-xl rounded-[18px] py-4 px-[18px]">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span>
            <FaTrophy />
          </span>
          <span className="text-lg font-bold text-white">High Flyers</span>
        </div>
        <span className="text-xs font-bold text-[#FFD700] tracking-wider uppercase bg-[rgba(255,217,0,0.34)] py-[3px] px-2 rounded-[10px]">
          World Records
        </span>
      </div>

      {topPlayers.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {topPlayers.map((entry, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg text-white w-4 font-bold">
                  {i + 1}.
                </span>
                <div className="flex gap-1 items-center">
                  <p className="text-base text-white font-medium">
                    {entry.name}
                  </p>
                  <GoDash />
                  <p className="text-sm text-white/80 capitalize">
                    {entry.species}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[13px] text-white font-bold">
                  {entry.distance.toFixed(1)}
                </span>
                <span className="text-[9px] text-white/30 ml-[3px]">km</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base mt-10 text-white/50 text-center py-4">
          No flights yet. Be the first!
        </p>
      )}

      {topPlayers.length > 0 && (
        <button
          onClick={handleViewAllRankings}
          className="w-full mt-3.5 text-center text-[11px] text-[#00AEEF] font-semibold bg-transparent border-none cursor-pointer"
        >
          VIEW ALL RANKINGS
        </button>
      )}
    </div>
  );
};

export default Top3Leaderboard;

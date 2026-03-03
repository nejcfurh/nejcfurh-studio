'use client';

import { useGameStore } from '@/store/gameStore';

export default function ThreatWarning() {
  const threatType = useGameStore((s) => s.threatType);
  const threatWarningActive = useGameStore((s) => s.threatWarningActive);
  const eagleDodgeWindow = useGameStore((s) => s.eagleDodgeWindow);
  const eagleAltitudeHunt = useGameStore((s) => s.eagleAltitudeHunt);
  const eagleTimer = useGameStore((s) => s.eagleTimer);
  const eagleDodgeTaps = useGameStore((s) => s.eagleDodgeTaps);
  const position = useGameStore((s) => s.position);
  const gameState = useGameStore((s) => s.gameState);
  const flyAway = useGameStore((s) => s.flyAway);
  const groundTimer = useGameStore((s) => s.groundTimer);

  const isOnGround = groundTimer > 0;

  if (!threatWarningActive && !threatType && !isOnGround) return null;

  const isEagle = threatType === 'eagle';
  const isCat = threatType === 'cat';
  const isPerched = gameState === 'feeding' || gameState === 'drinking';
  const isDodgePhase = isEagle && eagleDodgeWindow > 0;
  const nearAltitudeLimit = position[1] > 20; // EAGLE_ALTITUDE_THRESHOLD(25) - 5
  const tapsRemaining = Math.max(0, 3 - eagleDodgeTaps);

  return (
    <>
      {/* Predator detected — centered red text */}
      {isEagle && !isDodgePhase && !eagleAltitudeHunt && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-black uppercase tracking-widest animate-[pulse_0.8s_ease-in-out_infinite]"
            style={{
              color: '#FF3D00',
              textShadow: '0 0 20px rgba(255,61,0,0.6), 0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            PREDATOR DETECTED
          </span>
        </div>
      )}


      {/* Screen vignette */}
      {(isDodgePhase || eagleAltitudeHunt || (isCat && isPerched)) && (
        <div className="fixed inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,61,0,0.35)_100%)] animate-[pulse_1s_ease-in-out_infinite]" />
      )}

      {/* Altitude hunt countdown */}
      {isEagle && eagleAltitudeHunt && !isDodgePhase && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-black/65 backdrop-blur-xl rounded-[18px] py-6 px-9 flex flex-col items-center gap-2 border border-[rgba(255,61,0,0.3)]">
            <span className="text-xs text-[#FF5252] font-bold tracking-wider">TOO HIGH</span>
            <span className="text-[48px] font-black text-white leading-none">
              {Math.ceil(Math.max(0, eagleTimer))}
            </span>
            <span className="text-sm text-white/60 font-semibold">FLY LOWER TO ESCAPE</span>
            <span className="text-[10px] text-white/30">STOP FLAPPING</span>
          </div>
        </div>
      )}

      {/* Eagle dodge prompt */}
      {isDodgePhase && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-black/65 backdrop-blur-xl rounded-[18px] py-6 px-9 flex flex-col items-center gap-2 border border-[rgba(255,61,0,0.3)] animate-[bounce-y_0.6s_ease-in-out_infinite]">
            <span className="text-xs text-[#FF5252] font-bold tracking-wider">ESCAPE NOW</span>
            {nearAltitudeLimit ? (
              <>
                <span className="text-[26px] font-black text-white">TAP TO FLAP</span>
                <span className="text-lg text-white/70 font-bold">{tapsRemaining} {tapsRemaining === 1 ? 'tap' : 'taps'} left</span>
                <span className="text-[10px] text-white/40">FLAP RAPIDLY TO SCARE IT OFF</span>
              </>
            ) : (
              <>
                <span className="text-[26px] font-black text-white">TURN 90°</span>
                <span className="text-[10px] text-white/40">CHANGE DIRECTION TO EVADE</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cat flee prompt — tap anywhere to flee */}
      {isCat && isPerched && (
        <div
          onPointerDown={(e) => { e.stopPropagation(); flyAway(); }}
          className="fixed inset-0 z-30 flex flex-col items-center justify-end pb-[140px] pointer-events-auto cursor-pointer"
        >
          <span
            className="text-2xl font-black uppercase tracking-widest animate-[pulse_0.8s_ease-in-out_infinite] mb-4"
            style={{
              color: '#FF3D00',
              textShadow: '0 0 20px rgba(255,61,0,0.6), 0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            PREDATOR DETECTED
          </span>
          <div className="bg-[rgba(183,28,28,0.85)] backdrop-blur-[10px] rounded-[18px] py-4 px-8 flex flex-col items-center gap-1 border border-[rgba(255,61,0,0.3)] animate-[bounce-y_0.6s_ease-in-out_infinite]">
            <span className="text-xs text-[rgba(255,200,200,0.8)] font-bold">ESCAPE!</span>
            <span className="text-[22px] font-black text-white">FLY AWAY</span>
            <span className="text-[9px] text-[rgba(255,200,200,0.5)]">TAP ANYWHERE</span>
          </div>
        </div>
      )}

      {/* Grounded warning — flap to take off before cat catches you */}
      {isOnGround && !isPerched && (
        <>
          <div className="fixed inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,61,0,0.35)_100%)] animate-[pulse_1s_ease-in-out_infinite]" />
          <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-black/65 backdrop-blur-xl rounded-[18px] py-6 px-9 flex flex-col items-center gap-2 border border-[rgba(255,61,0,0.3)] animate-[bounce-y_0.6s_ease-in-out_infinite]">
              <span className="text-xs text-[#FF5252] font-bold tracking-wider">GROUNDED</span>
              <span className="text-[48px] font-black text-white leading-none">
                {Math.ceil(Math.max(0, 3 - groundTimer))}
              </span>
              <span className="text-sm text-white/60 font-semibold">TAP TO FLY</span>
              <span className="text-[10px] text-white/30">A CAT IS APPROACHING</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

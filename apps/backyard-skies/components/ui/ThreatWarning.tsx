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
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <span
            className="animate-[pulse_0.8s_ease-in-out_infinite] text-2xl font-black tracking-widest uppercase"
            style={{
              color: '#FF3D00',
              textShadow:
                '0 0 20px rgba(255,61,0,0.6), 0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            PREDATOR DETECTED
          </span>
        </div>
      )}

      {/* Screen vignette */}
      {(isDodgePhase || eagleAltitudeHunt || (isCat && isPerched)) && (
        <div className="pointer-events-none fixed inset-0 z-20 animate-[pulse_1s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,61,0,0.35)_100%)]" />
      )}

      {/* Altitude hunt countdown */}
      {isEagle && eagleAltitudeHunt && !isDodgePhase && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 rounded-[18px] border border-[rgba(255,61,0,0.3)] bg-black/65 px-9 py-6 backdrop-blur-xl">
            <span className="text-xs font-bold tracking-wider text-[#FF5252]">
              TOO HIGH
            </span>
            <span className="text-[48px] leading-none font-black text-white">
              {Math.ceil(Math.max(0, eagleTimer))}
            </span>
            <span className="text-sm font-semibold text-white/60">
              FLY LOWER TO ESCAPE
            </span>
            <span className="text-[10px] text-white/30">STOP FLAPPING</span>
          </div>
        </div>
      )}

      {/* Eagle dodge prompt */}
      {isDodgePhase && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <div className="flex animate-[bounce-y_0.6s_ease-in-out_infinite] flex-col items-center gap-2 rounded-[18px] border border-[rgba(255,61,0,0.3)] bg-black/65 px-9 py-6 backdrop-blur-xl">
            <span className="text-xs font-bold tracking-wider text-[#FF5252]">
              ESCAPE NOW
            </span>
            {nearAltitudeLimit ? (
              <>
                <span className="text-[26px] font-black text-white">
                  TAP TO FLAP
                </span>
                <span className="text-lg font-bold text-white/70">
                  {tapsRemaining} {tapsRemaining === 1 ? 'tap' : 'taps'} left
                </span>
                <span className="text-[10px] text-white/40">
                  FLAP RAPIDLY TO SCARE IT OFF
                </span>
              </>
            ) : (
              <>
                <span className="text-[26px] font-black text-white">
                  TURN 90°
                </span>
                <span className="text-[10px] text-white/40">
                  CHANGE DIRECTION TO EVADE
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cat flee prompt — tap anywhere to flee */}
      {isCat && isPerched && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            flyAway();
          }}
          className="pointer-events-auto fixed inset-0 z-30 flex cursor-pointer flex-col items-center justify-end pb-[140px]"
        >
          <span
            className="mb-4 animate-[pulse_0.8s_ease-in-out_infinite] text-2xl font-black tracking-widest uppercase"
            style={{
              color: '#FF3D00',
              textShadow:
                '0 0 20px rgba(255,61,0,0.6), 0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            PREDATOR DETECTED
          </span>
          <div className="flex animate-[bounce-y_0.6s_ease-in-out_infinite] flex-col items-center gap-1 rounded-[18px] border border-[rgba(255,61,0,0.3)] bg-[rgba(183,28,28,0.85)] px-8 py-4 backdrop-blur-[10px]">
            <span className="text-xs font-bold text-[rgba(255,200,200,0.8)]">
              ESCAPE!
            </span>
            <span className="text-[22px] font-black text-white">FLY AWAY</span>
            <span className="text-[9px] text-[rgba(255,200,200,0.5)]">
              TAP ANYWHERE
            </span>
          </div>
        </div>
      )}

      {/* Grounded warning — flap to take off before cat catches you */}
      {isOnGround && !isPerched && (
        <>
          <div className="pointer-events-none fixed inset-0 z-20 animate-[pulse_1s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,61,0,0.35)_100%)]" />
          <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
            <div className="flex animate-[bounce-y_0.6s_ease-in-out_infinite] flex-col items-center gap-2 rounded-[18px] border border-[rgba(255,61,0,0.3)] bg-black/65 px-9 py-6 backdrop-blur-xl">
              <span className="text-xs font-bold tracking-wider text-[#FF5252]">
                GROUNDED
              </span>
              <span className="text-[48px] leading-none font-black text-white">
                {Math.ceil(Math.max(0, 3 - groundTimer))}
              </span>
              <span className="text-sm font-semibold text-white/60">
                TAP TO FLY
              </span>
              <span className="text-[10px] text-white/30">
                A CAT IS APPROACHING
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

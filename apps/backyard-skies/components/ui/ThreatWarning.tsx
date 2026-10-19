'use client';

import { useGameStore } from '@/store/gameStore';
import {
  EAGLE_DODGE_TAPS,
  EAGLE_DODGE_TURN_DEGREES,
  GROUND_DEATH_TIME
} from '@/utils/constants';

export default function ThreatWarning() {
  // Every selector returns a coarse primitive so the overlay re-renders on visible change, not per frame.
  const threatType = useGameStore((s) => s.threatType);
  const threatWarningActive = useGameStore((s) => s.threatWarningActive);
  const dodgeWindowOpen = useGameStore((s) => s.eagleDodgeWindow > 0);
  const eagleAltitudeHunt = useGameStore((s) => s.eagleAltitudeHunt);
  const huntCountdown = useGameStore((s) =>
    s.eagleAltitudeHunt ? Math.ceil(Math.max(0, s.eagleTimer)) : 0
  );
  const tapsRemaining = useGameStore((s) =>
    Math.max(0, EAGLE_DODGE_TAPS - s.eagleDodgeTaps)
  );
  const nearAltitudeLimit = useGameStore((s) => s.nearAltitudeLimit);
  const gameState = useGameStore((s) => s.gameState);
  const flyAway = useGameStore((s) => s.flyAway);
  const isOnGround = useGameStore((s) => s.groundTimer > 0);
  const groundCountdown = useGameStore((s) =>
    Math.ceil(Math.max(0, GROUND_DEATH_TIME - s.groundTimer))
  );

  if (gameState === 'dying') return null;
  if (!threatWarningActive && !threatType && !isOnGround) return null;

  const isEagle = threatType === 'eagle';
  const isCat = threatType === 'cat';
  const isPerched = gameState === 'feeding' || gameState === 'drinking';
  const isDodgePhase = isEagle && dodgeWindowOpen;

  const pill = flightPill({
    isEagle,
    isDodgePhase,
    eagleAltitudeHunt,
    nearAltitudeLimit,
    tapsRemaining,
    huntCountdown,
    grounded: isOnGround && !isPerched,
    groundCountdown
  });

  return (
    <>
      {/* Screen vignette */}
      {(isDodgePhase ||
        eagleAltitudeHunt ||
        (isCat && isPerched) ||
        (isOnGround && !isPerched)) && (
        <div className="pointer-events-none absolute inset-0 z-20 animate-[pulse_1s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,61,0,0.35)_100%)]" />
      )}

      {/* Flight warnings share one compact slot above the pause/exit row, so
          the eagle diving in from above and the bird stay in view. */}
      {pill && (
        <div
          className="pointer-events-none absolute inset-x-0 z-30 flex justify-center"
          style={{ bottom: THREAT_PILL_BOTTOM }}
        >
          <span
            className={[
              'font-display flex items-center gap-2 rounded-full border border-[rgba(255,61,0,0.45)] bg-[rgba(183,28,28,0.9)] py-1.5 pr-4 text-[13px] font-extrabold tracking-[0.14em] whitespace-nowrap text-white uppercase shadow-[0_4px_18px_rgba(183,28,28,0.45)]',
              pill.countdown === undefined ? 'pl-4' : 'pl-1.5',
              pill.urgent
                ? 'animate-[bounce-y_0.6s_ease-in-out_infinite]'
                : 'animate-[pulse_0.8s_ease-in-out_infinite]'
            ].join(' ')}
          >
            {pill.countdown !== undefined && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[13px] font-black text-[#b71c1c]">
                {pill.countdown}
              </span>
            )}
            {pill.text}
          </span>
        </div>
      )}

      {/* Cat flee: the whole screen is the tap target; the prompt itself is
          drawn by the HUD above the threat meter, clear of the cat. */}
      {isCat && isPerched && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            flyAway();
          }}
          aria-label="Fly away"
          role="button"
          className="pointer-events-auto absolute inset-0 z-30 cursor-pointer"
        />
      )}
    </>
  );
}

/** Bottom offset of the warning pill: just above the pause/exit row. */
export const THREAT_PILL_BOTTOM =
  'calc(max(30px, env(safe-area-inset-bottom)) + 58px)';

interface FlightPill {
  text: string;
  countdown?: number;
  urgent: boolean;
}

function flightPill(f: {
  isEagle: boolean;
  isDodgePhase: boolean;
  eagleAltitudeHunt: boolean;
  nearAltitudeLimit: boolean;
  tapsRemaining: number;
  huntCountdown: number;
  grounded: boolean;
  groundCountdown: number;
}): FlightPill | null {
  if (f.isDodgePhase) {
    return {
      text: f.nearAltitudeLimit
        ? `Tap ${f.tapsRemaining}\u00d7 or dive!`
        : `Turn ${EAGLE_DODGE_TURN_DEGREES}\u00b0 or dive!`,
      urgent: true
    };
  }
  if (f.isEagle && f.eagleAltitudeHunt) {
    return {
      text: 'Too high \u2014 fly lower',
      countdown: f.huntCountdown,
      urgent: true
    };
  }
  if (f.isEagle) return { text: 'Eagle incoming!', urgent: false };
  if (f.grounded) {
    return {
      text: 'Grounded \u2014 tap to fly',
      countdown: f.groundCountdown,
      urgent: true
    };
  }
  return null;
}

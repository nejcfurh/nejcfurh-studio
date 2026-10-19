// Pure eagle + cat threat state machines — no store, no audio.

import { ThreatType } from '@/types';
import {
  EAGLE_ALTITUDE_HUNT_TIME,
  EAGLE_ALTITUDE_LIMIT_MARGIN,
  EAGLE_ALTITUDE_THRESHOLD,
  EAGLE_DODGE_DIVE_DEPTH,
  EAGLE_DODGE_TAPS,
  EAGLE_DODGE_TURN_DEGREES,
  EAGLE_DODGE_WINDOW,
  EAGLE_FIRST_MIN_DELAY,
  EAGLE_HUNT_RESUME_MIN,
  EAGLE_INTERVAL_JITTER,
  EAGLE_INTERVAL_MIN_BASE,
  EAGLE_INTERVAL_RAMP,
  EAGLE_INTERVAL_START,
  EAGLE_WARNING_TIME,
  THREAT_METER_BASE_RATE,
  THREAT_METER_CAT_RATE,
  THREAT_METER_MAX
} from '@/utils/constants';

const DODGE_TURN_RADIANS = (EAGLE_DODGE_TURN_DEGREES * Math.PI) / 180;

/** Seconds until the next eagle; the base shrinks as the run goes on. */
export function computeEagleInterval(
  elapsed: number,
  random: () => number = Math.random
): number {
  const base = Math.max(
    EAGLE_INTERVAL_MIN_BASE,
    EAGLE_INTERVAL_START - EAGLE_INTERVAL_RAMP * elapsed
  );
  return base + (random() * 2 - 1) * EAGLE_INTERVAL_JITTER;
}

export function computeFirstEagleDelay(
  random: () => number = Math.random
): number {
  return Math.max(EAGLE_FIRST_MIN_DELAY, computeEagleInterval(0, random));
}

/** Near the hunt threshold the dodge needs taps instead of a turn. */
export function isNearAltitudeLimit(altitude: number): boolean {
  return altitude > EAGLE_ALTITUDE_THRESHOLD - EAGLE_ALTITUDE_LIMIT_MARGIN;
}

export interface EagleThreatInput {
  altitude: number;
  rotation: number;
  delta: number;
  eagleTimer: number;
  eagleDodgeWindow: number;
  eagleDodgeStartRotation: number;
  eagleDodgeStartAltitude: number;
  eagleDodgeTaps: number;
  eagleAltitudeHunt: boolean;
  /** The regular countdown saved when the altitude hunt began. */
  eagleResumeTimer: number;
  threatType: ThreatType;
  threatWarningActive: boolean;
  /** Seconds of game time since the run started; drives the difficulty ramp. */
  elapsed: number;
  random?: () => number;
}

export type EagleAction =
  | { type: 'none' }
  | { type: 'start_altitude_hunt' }
  | { type: 'end_altitude_hunt' }
  | { type: 'altitude_caught' }
  | { type: 'start_warning' }
  | { type: 'start_dodge_window' }
  | { type: 'dodged' }
  | { type: 'caught' };

export interface EagleThreatResult {
  action: EagleAction;
  eagleTimer: number;
  eagleDodgeWindow: number;
  eagleResumeTimer: number;
}

export function tickEagleThreat(input: EagleThreatInput): EagleThreatResult {
  const {
    altitude,
    rotation,
    delta,
    eagleDodgeStartRotation,
    eagleDodgeStartAltitude,
    eagleDodgeTaps,
    eagleAltitudeHunt,
    eagleResumeTimer,
    threatType,
    threatWarningActive,
    elapsed,
    random
  } = input;
  let { eagleTimer, eagleDodgeWindow } = input;

  // Altitude-based eagle hunting
  if (altitude > EAGLE_ALTITUDE_THRESHOLD && !eagleAltitudeHunt) {
    return {
      action: { type: 'start_altitude_hunt' },
      eagleTimer: EAGLE_ALTITUDE_HUNT_TIME,
      // An open dodge window would block the hunt from ever ending.
      eagleDodgeWindow: 0,
      eagleResumeTimer: eagleTimer
    };
  }

  if (
    altitude <= EAGLE_ALTITUDE_THRESHOLD &&
    eagleAltitudeHunt &&
    eagleDodgeWindow <= 0
  ) {
    // The regular countdown kept running during the hunt, so a quick climb
    // above the threshold cannot push the next eagle further away.
    const huntElapsed = EAGLE_ALTITUDE_HUNT_TIME - eagleTimer;
    const resumed = Math.min(
      eagleResumeTimer - huntElapsed,
      computeEagleInterval(elapsed, random)
    );
    return {
      action: { type: 'end_altitude_hunt' },
      eagleTimer: Math.max(EAGLE_HUNT_RESUME_MIN, resumed),
      eagleDodgeWindow,
      eagleResumeTimer
    };
  }

  // Timer countdown
  eagleTimer -= delta;

  // Altitude hunt timer expired
  if (eagleAltitudeHunt && eagleTimer <= 0) {
    return {
      action: { type: 'altitude_caught' },
      eagleTimer,
      eagleDodgeWindow,
      eagleResumeTimer
    };
  }

  // Warning phase
  if (
    eagleTimer <= EAGLE_WARNING_TIME &&
    eagleTimer > 0 &&
    !threatWarningActive
  ) {
    return {
      action: { type: 'start_warning' },
      eagleTimer,
      eagleDodgeWindow,
      eagleResumeTimer
    };
  }

  // Dodge phase (non-altitude)
  if (!eagleAltitudeHunt && eagleTimer <= 0 && threatType === 'eagle') {
    if (eagleDodgeWindow <= 0) {
      return {
        action: { type: 'start_dodge_window' },
        eagleTimer,
        eagleDodgeWindow: EAGLE_DODGE_WINDOW,
        eagleResumeTimer
      };
    }

    const dived = eagleDodgeStartAltitude - altitude >= EAGLE_DODGE_DIVE_DEPTH;
    const evaded = isNearAltitudeLimit(altitude)
      ? eagleDodgeTaps >= EAGLE_DODGE_TAPS
      : turnAngle(rotation, eagleDodgeStartRotation) >= DODGE_TURN_RADIANS;
    if (dived || evaded) {
      return {
        action: { type: 'dodged' },
        eagleTimer,
        eagleDodgeWindow,
        eagleResumeTimer
      };
    }

    eagleDodgeWindow -= delta;
    if (eagleDodgeWindow <= 0) {
      return {
        action: { type: 'caught' },
        eagleTimer,
        eagleDodgeWindow,
        eagleResumeTimer
      };
    }
  }

  return {
    action: { type: 'none' },
    eagleTimer,
    eagleDodgeWindow,
    eagleResumeTimer
  };
}

function turnAngle(rotation: number, startRotation: number): number {
  const angle = Math.abs(rotation - startRotation) % (Math.PI * 2);
  return angle > Math.PI ? Math.PI * 2 - angle : angle;
}

export interface CatThreatInput {
  threatMeter: number;
  hasCat: boolean;
  delta: number;
  threatWarningActive: boolean;
}

export interface CatThreatResult {
  threatMeter: number;
  caught: boolean;
  warning: boolean;
}

export function tickCatThreat(input: CatThreatInput): CatThreatResult {
  const { hasCat, delta, threatWarningActive } = input;

  const threatRate = hasCat ? THREAT_METER_CAT_RATE : THREAT_METER_BASE_RATE;

  const threatMeter = input.threatMeter + threatRate * delta;
  const caught = threatMeter >= THREAT_METER_MAX;

  const warningThreshold = hasCat ? 20 : 60;
  const warning = !threatWarningActive && threatMeter > warningThreshold;

  return {
    threatMeter: Math.min(THREAT_METER_MAX, threatMeter),
    caught,
    warning
  };
}

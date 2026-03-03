// Pure eagle + cat threat state machines — no store, no audio.

import {
  EAGLE_WARNING_TIME,
  EAGLE_DODGE_WINDOW,
  EAGLE_ALTITUDE_THRESHOLD,
  THREAT_METER_BASE_RATE,
  THREAT_METER_CAT_MULTIPLIER,
  THREAT_METER_MAX,
} from '@/utils/constants';
import { ThreatType } from '@/types';

export interface EagleThreatInput {
  altitude: number;
  rotation: number;
  delta: number;
  eagleTimer: number;
  eagleDodgeWindow: number;
  eagleDodgeStartRotation: number;
  eagleDodgeTaps: number;
  eagleAltitudeHunt: boolean;
  threatType: ThreatType;
  threatWarningActive: boolean;
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
}

export function tickEagleThreat(input: EagleThreatInput): EagleThreatResult {
  const {
    altitude,
    rotation,
    delta,
    eagleDodgeStartRotation,
    eagleDodgeTaps,
    eagleAltitudeHunt,
    threatType,
    threatWarningActive,
  } = input;
  let { eagleTimer, eagleDodgeWindow } = input;

  // Altitude-based eagle hunting
  if (altitude > EAGLE_ALTITUDE_THRESHOLD && !eagleAltitudeHunt) {
    return {
      action: { type: 'start_altitude_hunt' },
      eagleTimer: 4,
      eagleDodgeWindow,
    };
  }

  if (
    altitude <= EAGLE_ALTITUDE_THRESHOLD &&
    eagleAltitudeHunt &&
    eagleDodgeWindow <= 0
  ) {
    return {
      action: { type: 'end_altitude_hunt' },
      eagleTimer: 30 + Math.random() * 60,
      eagleDodgeWindow,
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
    };
  }

  // Dodge phase (non-altitude)
  if (!eagleAltitudeHunt && eagleTimer <= 0 && threatType === 'eagle') {
    if (eagleDodgeWindow <= 0) {
      return {
        action: { type: 'start_dodge_window' },
        eagleTimer,
        eagleDodgeWindow: EAGLE_DODGE_WINDOW,
      };
    }

    const nearAltitudeLimit = altitude > EAGLE_ALTITUDE_THRESHOLD - 5;

    if (nearAltitudeLimit) {
      if (eagleDodgeTaps >= 3) {
        return { action: { type: 'dodged' }, eagleTimer, eagleDodgeWindow };
      }
    } else {
      let angleDiff =
        Math.abs(rotation - eagleDodgeStartRotation) % (Math.PI * 2);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      if (angleDiff >= Math.PI / 2) {
        return { action: { type: 'dodged' }, eagleTimer, eagleDodgeWindow };
      }
    }

    eagleDodgeWindow -= delta;
    if (eagleDodgeWindow <= 0) {
      return { action: { type: 'caught' }, eagleTimer, eagleDodgeWindow };
    }
  }

  return { action: { type: 'none' }, eagleTimer, eagleDodgeWindow };
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

  const threatRate = hasCat
    ? THREAT_METER_BASE_RATE * THREAT_METER_CAT_MULTIPLIER
    : THREAT_METER_BASE_RATE;

  const threatMeter = input.threatMeter + threatRate * delta;
  const caught = threatMeter >= THREAT_METER_MAX;

  const warningThreshold = hasCat ? 20 : 60;
  const warning = !threatWarningActive && threatMeter > warningThreshold;

  return {
    threatMeter: Math.min(THREAT_METER_MAX, threatMeter),
    caught,
    warning,
  };
}

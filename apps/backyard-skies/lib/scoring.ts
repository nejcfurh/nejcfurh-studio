// Pure score + distance computation — no store.

import { FeederData } from '@/types';
import {
  SCORE_DODGE_STREAK_CAP,
  SCORE_DODGE_STREAK_STEP,
  SCORE_DRINK_BONUS,
  SCORE_EAGLE_DODGE_BONUS,
  SCORE_FEED_BONUS,
  SCORE_FLY_AWAY_MIN_BONUS,
  SCORE_FLY_AWAY_MIN_FRACTION,
  SCORE_PER_DISTANCE_UNIT,
  SCORE_PER_SECOND
} from '@/utils/constants';

export interface ScoreResult {
  points: number;
  newAccumulator: number;
}

/** Adds a fractional amount and pays out only whole points, so every score component stays an integer. */
export function accruePoints(accumulator: number, amount: number): ScoreResult {
  const updated = accumulator + amount;
  // Epsilon keeps float drift (0.1 + 0.2 ...) from withholding a point that was earned.
  const points = Math.floor(updated + 1e-9);
  return { points, newAccumulator: updated - points };
}

export function computeFlightScore(
  accumulator: number,
  delta: number
): ScoreResult {
  return accruePoints(accumulator, SCORE_PER_SECOND * delta);
}

export function computeDistanceScore(
  accumulator: number,
  horizontalDistance: number
): ScoreResult {
  return accruePoints(
    accumulator,
    SCORE_PER_DISTANCE_UNIT * horizontalDistance
  );
}

export function computeDistance(
  prevX: number,
  prevY: number,
  prevZ: number,
  newX: number,
  newY: number,
  newZ: number
): number {
  const dx = newX - prevX;
  const dy = newY - prevY;
  const dz = newZ - prevZ;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function computeHorizontalDistance(
  prevX: number,
  prevZ: number,
  newX: number,
  newZ: number
): number {
  const dx = newX - prevX;
  const dz = newZ - prevZ;
  return Math.sqrt(dx * dx + dz * dz);
}

/** Bonus for leaving a perch, proportional to how much of the resource this perch restored. */
export function computeFlyAwayBonus(
  feederType: FeederData['type'],
  restoredAmount: number,
  maxAmount: number
): number {
  if (maxAmount <= 0) return 0;
  const fraction = Math.min(1, Math.max(0, restoredAmount / maxAmount));
  if (fraction < SCORE_FLY_AWAY_MIN_FRACTION) return 0;
  const base = feederType === 'feeder' ? SCORE_FEED_BONUS : SCORE_DRINK_BONUS;
  return Math.max(SCORE_FLY_AWAY_MIN_BONUS, Math.round(base * fraction));
}

/** Dodge bonus for the n-th consecutive dodge of a streak (1-based). */
export function computeDodgeBonus(streak: number): number {
  const step = Math.max(1, streak) - 1;
  const multiplier = Math.min(
    SCORE_DODGE_STREAK_CAP,
    Math.pow(SCORE_DODGE_STREAK_STEP, step)
  );
  return Math.round(SCORE_EAGLE_DODGE_BONUS * multiplier);
}

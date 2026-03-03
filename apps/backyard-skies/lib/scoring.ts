// Pure score + distance computation — no store.

import { SCORE_PER_SECOND } from '@/utils/constants';

export interface ScoreResult {
  points: number;
  newAccumulator: number;
}

export function computeFlightScore(accumulator: number, delta: number): ScoreResult {
  const updated = accumulator + SCORE_PER_SECOND * delta;
  const points = Math.floor(updated);
  return { points, newAccumulator: updated - points };
}

export function computeDistance(
  prevX: number, prevY: number, prevZ: number,
  newX: number, newY: number, newZ: number,
): number {
  const dx = newX - prevX;
  const dy = newY - prevY;
  const dz = newZ - prevZ;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

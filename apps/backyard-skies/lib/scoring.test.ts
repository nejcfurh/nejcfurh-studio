import { describe, expect, it } from 'vitest';

import {
  accruePoints,
  computeDistanceScore,
  computeDodgeBonus,
  computeFlightScore,
  computeFlyAwayBonus,
  computeHorizontalDistance
} from './scoring';

describe('accruePoints', () => {
  it('pays out whole points and carries the fraction forward', () => {
    const first = accruePoints(0, 0.7);
    expect(first.points).toBe(0);
    const second = accruePoints(first.newAccumulator, 0.7);
    expect(second.points).toBe(1);
    expect(second.newAccumulator).toBeCloseTo(0.4);
  });
});

const accrueOver = (
  steps: number,
  step: (accumulator: number) => { points: number; newAccumulator: number }
) => {
  let accumulator = 0;
  let points = 0;
  for (let i = 0; i < steps; i++) {
    const result = step(accumulator);
    accumulator = result.newAccumulator;
    points += result.points;
  }
  return points;
};

describe('computeFlightScore', () => {
  it('pays a quarter point per second of flight', () => {
    expect(accrueOver(2400, (a) => computeFlightScore(a, 1 / 60))).toBe(10);
  });
});

describe('computeDistanceScore', () => {
  it('pays 0.18 points per world unit flown', () => {
    expect(accrueOver(1000, (a) => computeDistanceScore(a, 0.5))).toBe(90);
  });

  it('makes a cruising bird earn more from distance than from time', () => {
    const cruiseSpeed = 4.2;
    const time = computeFlightScore(0, 100).points;
    const distance = computeDistanceScore(0, cruiseSpeed * 100).points;
    expect(distance).toBeGreaterThan(time * 2);
  });

  it('keeps cruising at about one point per second, like the old leaderboard', () => {
    const cruiseSpeed = 4.2;
    const seconds = 60;
    const time = computeFlightScore(0, seconds).points;
    const distance = computeDistanceScore(0, cruiseSpeed * seconds).points;
    const perSecond = (time + distance) / seconds;
    expect(perSecond).toBeGreaterThan(0.9);
    expect(perSecond).toBeLessThan(1.1);
  });
});

describe('computeHorizontalDistance', () => {
  it('ignores altitude changes so bobbing up and down scores nothing', () => {
    expect(computeHorizontalDistance(0, 0, 0, 0)).toBe(0);
    expect(computeHorizontalDistance(0, 0, 3, 4)).toBe(5);
  });
});

describe('computeFlyAwayBonus', () => {
  it('pays nothing after a perch that restored almost nothing', () => {
    expect(computeFlyAwayBonus('feeder', 0.5, 85)).toBe(0);
    expect(computeFlyAwayBonus('birdbath', 0, 75)).toBe(0);
  });

  it('pays nothing below a fifth of the maximum restored', () => {
    expect(computeFlyAwayBonus('feeder', 85 * 0.19, 85)).toBe(0);
  });

  it('pays the minimum bonus once a fifth of the maximum is restored', () => {
    expect(computeFlyAwayBonus('feeder', 85 * 0.2, 85)).toBe(10);
    expect(computeFlyAwayBonus('birdbath', 75 * 0.2, 75)).toBe(10);
  });

  it('pays in proportion to the fraction restored', () => {
    expect(computeFlyAwayBonus('feeder', 85 * 0.7, 85)).toBe(35);
    expect(computeFlyAwayBonus('birdbath', 75 * 0.5, 75)).toBe(20);
  });

  it('pays the full bonus for a full refill and never more', () => {
    expect(computeFlyAwayBonus('feeder', 85, 85)).toBe(50);
    expect(computeFlyAwayBonus('birdbath', 75, 75)).toBe(40);
    expect(computeFlyAwayBonus('feeder', 200, 85)).toBe(50);
  });
});

describe('computeDodgeBonus', () => {
  it('pays the base bonus for the first dodge of a streak', () => {
    expect(computeDodgeBonus(1)).toBe(100);
  });

  it('multiplies the bonus by 1.5 for each consecutive dodge', () => {
    expect(computeDodgeBonus(2)).toBe(150);
    expect(computeDodgeBonus(3)).toBe(225);
  });

  it('caps the streak multiplier at three times the base bonus', () => {
    expect(computeDodgeBonus(4)).toBe(300);
    expect(computeDodgeBonus(10)).toBe(300);
  });

  it('treats a streak below one as the first dodge', () => {
    expect(computeDodgeBonus(0)).toBe(100);
  });
});

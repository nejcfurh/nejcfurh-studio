import { BirdAttributes } from '@/types';
import { describe, expect, it } from 'vitest';

import { replenishFromFeeder, restStamina } from './resourceSystem';

const attrs: BirdAttributes = {
  speed: 7,
  flapPower: 1,
  stamina: 80,
  maxFood: 85,
  maxWater: 75,
  feedRate: 10,
  drinkRate: 8,
  foodDrain: 2,
  waterDrain: 1.5
};

describe('replenishFromFeeder', () => {
  it('scores two points per unit of food actually restored', () => {
    const result = replenishFromFeeder(40, 50, 'feeder', attrs, 1);
    expect(result.food).toBe(50);
    expect(result.restored).toBe(10);
    expect(result.scoreGained).toBe(20);
  });

  it('scores nothing while perched on a feeder with food already full', () => {
    const result = replenishFromFeeder(85, 50, 'feeder', attrs, 1);
    expect(result.food).toBe(85);
    expect(result.restored).toBe(0);
    expect(result.scoreGained).toBe(0);
  });

  it('scores only the part that fits when food is nearly full', () => {
    const result = replenishFromFeeder(84, 50, 'feeder', attrs, 1);
    expect(result.food).toBe(85);
    expect(result.restored).toBe(1);
    expect(result.scoreGained).toBe(2);
  });

  it('scores nothing at a bird bath with water already full', () => {
    const result = replenishFromFeeder(40, 75, 'birdbath', attrs, 1);
    expect(result.water).toBe(75);
    expect(result.restored).toBe(0);
    expect(result.scoreGained).toBe(0);
  });

  it('restores water at the bird bath without touching food', () => {
    const result = replenishFromFeeder(40, 30, 'birdbath', attrs, 0.5);
    expect(result.food).toBe(40);
    expect(result.water).toBe(34);
    expect(result.restored).toBe(4);
  });
});

describe('restStamina', () => {
  it('regenerates fifteen stamina per second while perched', () => {
    expect(restStamina(20, attrs, 1)).toBe(35);
  });

  it('never regenerates past the species maximum', () => {
    expect(restStamina(75, attrs, 1)).toBe(80);
  });
});

// Pure resource depletion + replenishment — no store, no audio.

import { BirdAttributes } from '@/types';

export interface DepletionResult {
  food: number;
  water: number;
  stamina: number;
  depletedResource: 'food' | 'water' | null;
}

export function depleteResources(
  food: number,
  water: number,
  stamina: number,
  attrs: BirdAttributes,
  delta: number,
): DepletionResult {
  const newFood = Math.max(0, food - attrs.foodDrain * delta);
  const newWater = Math.max(0, water - attrs.waterDrain * delta);
  // Regenerate stamina slowly during flight
  const newStamina = Math.min(attrs.stamina, stamina + 3 * delta);

  let depletedResource: 'food' | 'water' | null = null;
  if (newFood <= 0) depletedResource = 'food';
  else if (newWater <= 0) depletedResource = 'water';

  return { food: newFood, water: newWater, stamina: newStamina, depletedResource };
}

export interface ReplenishResult {
  food: number;
  water: number;
  scoreGained: number;
}

export function replenishFromFeeder(
  food: number,
  water: number,
  feederType: 'feeder' | 'birdbath',
  attrs: BirdAttributes,
  delta: number,
): ReplenishResult {
  if (feederType === 'feeder') {
    const amount = attrs.feedRate * delta;
    return {
      food: Math.min(attrs.maxFood, food + amount),
      water,
      scoreGained: amount * 2,
    };
  } else {
    const amount = attrs.drinkRate * delta;
    return {
      food,
      water: Math.min(attrs.maxWater, water + amount),
      scoreGained: amount * 2,
    };
  }
}

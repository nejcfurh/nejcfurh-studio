// Pure resource depletion + replenishment — no store, no audio.

import { BirdAttributes } from '@/types';
import {
  SCORE_PER_RESOURCE_RESTORED,
  STAMINA_FLIGHT_REGEN,
  STAMINA_REST_REGEN
} from '@/utils/constants';

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
  delta: number
): DepletionResult {
  const newFood = Math.max(0, food - attrs.foodDrain * delta);
  const newWater = Math.max(0, water - attrs.waterDrain * delta);
  const newStamina = Math.min(
    attrs.stamina,
    stamina + STAMINA_FLIGHT_REGEN * delta
  );

  let depletedResource: 'food' | 'water' | null = null;
  if (newFood <= 0) depletedResource = 'food';
  else if (newWater <= 0) depletedResource = 'water';

  return {
    food: newFood,
    water: newWater,
    stamina: newStamina,
    depletedResource
  };
}

export interface ReplenishResult {
  food: number;
  water: number;
  /** Units of food or water actually added this tick (zero once full). */
  restored: number;
  scoreGained: number;
}

export function replenishFromFeeder(
  food: number,
  water: number,
  feederType: 'feeder' | 'birdbath',
  attrs: BirdAttributes,
  delta: number
): ReplenishResult {
  if (feederType === 'feeder') {
    const newFood = Math.max(
      food,
      Math.min(attrs.maxFood, food + attrs.feedRate * delta)
    );
    const restored = newFood - food;
    return {
      food: newFood,
      water,
      restored,
      scoreGained: restored * SCORE_PER_RESOURCE_RESTORED
    };
  }
  const newWater = Math.max(
    water,
    Math.min(attrs.maxWater, water + attrs.drinkRate * delta)
  );
  const restored = newWater - water;
  return {
    food,
    water: newWater,
    restored,
    scoreGained: restored * SCORE_PER_RESOURCE_RESTORED
  };
}

export function restStamina(
  stamina: number,
  attrs: BirdAttributes,
  delta: number
): number {
  return Math.min(attrs.stamina, stamina + STAMINA_REST_REGEN * delta);
}

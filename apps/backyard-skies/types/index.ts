export type BirdSpeciesId = 'cardinal' | 'tanager' | 'bunting' | 'starling';

export interface BirdAttributes {
  speed: number;
  flapPower: number;
  stamina: number;
  maxFood: number;
  maxWater: number;
  feedRate: number;
  drinkRate: number;
  foodDrain: number;
  waterDrain: number;
}

export interface BirdSpecies {
  id: BirdSpeciesId;
  name: string;
  scientificName: string;
  description: string;
  attributes: BirdAttributes;
  colors: BirdColors;
  bodyScale: [number, number, number];
  wingSpan: number;
  hasCrest: boolean;
}

export interface BirdColors {
  body: string;
  wing: string;
  head: string;
  belly: string;
  beak: string;
  eye: string;
  tail: string;
  accent?: string;
}

export type GameState = 'menu' | 'species-select' | 'settings' | 'flight' | 'feeding' | 'drinking' | 'dying' | 'game-over';

export type ThreatType = 'eagle' | 'cat' | null;

export type DeathReason = 'food' | 'water' | 'ground' | 'eagle' | 'cat' | null;

export interface FeederData {
  id: number;
  position: [number, number, number];
  hasCat: boolean;
  type: 'feeder' | 'birdbath';
  lockedUntil?: number; // timestamp when feeder unlocks
}

export interface LeaderboardEntry {
  name: string;
  species: BirdSpeciesId;
  score: number;
  distance: number;
  date: string;
}

export interface PlayerState {
  food: number;
  water: number;
  stamina: number;
  score: number;
  distance: number;
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  isFlapping: boolean;
  flapCooldown: number;
}

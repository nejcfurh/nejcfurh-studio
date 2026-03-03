import { create } from 'zustand';
import {
  BirdSpeciesId,
  GameState,
  ThreatType,
  DeathReason,
  LeaderboardEntry,
  FeederData,
} from '@/types';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import {
  SCORE_FEED_BONUS,
  SCORE_DRINK_BONUS,
  SCORE_EAGLE_DODGE_BONUS,
  DISTANCE_PER_UNIT,
} from '@/utils/constants';
import { audioManager } from '@/lib/audioManager';
import {
  generateFeeders,
  cullDistantFeeders,
  spawnNearbyFeeders,
} from '@/lib/feederManager';
import { computePerchPosition } from '@/lib/perchPositions';
import { loadLeaderboardFromStorage, saveLeaderboardEntry } from '@/lib/leaderboard';

interface GameStore {
  // Game state
  gameState: GameState;
  selectedSpecies: BirdSpeciesId;
  isPaused: boolean;
  playerName: string;
  deathReason: DeathReason;

  // Player resources
  food: number;
  water: number;
  stamina: number;
  score: number;
  distance: number;

  // Player position & movement
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  isFlapping: boolean;
  flapCooldown: number;
  flapStrength: number;

  // Threats
  threatType: ThreatType;
  threatMeter: number;
  threatWarningActive: boolean;
  eagleTimer: number;
  eagleDodgeWindow: number;
  eagleDodgeStartRotation: number;
  eagleDodgeTaps: number;
  eagleAltitudeHunt: boolean;
  groundTimer: number;

  // Feeders
  feeders: FeederData[];
  activeFeeder: FeederData | null;
  feederCooldown: number;
  perchTime: number;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Audio
  isMuted: boolean;

  // Score breakdown tracking
  eagleDodges: number;
  feedingScore: number;

  // Actions
  setGameState: (state: GameState) => void;
  selectSpecies: (species: BirdSpeciesId) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: (reason?: DeathReason) => void;
  finalizeDeath: () => void;

  // Player actions
  flap: () => void;
  setRotation: (rotation: number) => void;
  updatePosition: (pos: [number, number, number]) => void;
  updateVelocity: (vel: [number, number, number]) => void;
  setFlapCooldown: (cooldown: number) => void;

  // Resource actions
  depleteFood: (amount: number) => void;
  depleteWater: (amount: number) => void;
  depleteStamina: (amount: number) => void;
  replenishFood: (amount: number) => void;
  replenishWater: (amount: number) => void;
  replenishStamina: (amount: number) => void;
  addScore: (amount: number) => void;
  addDistance: (amount: number) => void;

  // Threat actions
  setThreat: (type: ThreatType) => void;
  setThreatMeter: (value: number) => void;
  setThreatWarning: (active: boolean) => void;
  setEagleTimer: (time: number) => void;
  setEagleDodgeWindow: (time: number) => void;
  setEagleAltitudeHunt: (active: boolean) => void;
  dodgeEagle: () => void;

  // Feeder actions
  landOnFeeder: (feeder: FeederData) => void;
  flyAway: () => void;
  refreshFeeders: () => void;
  setFeederCooldown: (time: number) => void;

  // Player profile
  setPlayerName: (name: string) => void;

  // Audio
  setMuted: (muted: boolean) => void;

  // Leaderboard
  loadLeaderboard: () => void;
  saveScore: (name: string) => void;
}


export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  selectedSpecies: 'cardinal',
  isPaused: false,
  playerName:
    typeof window !== 'undefined'
      ? localStorage.getItem('backyard-skies-name') || ''
      : '',
  deathReason: null,

  food: 100,
  water: 100,
  stamina: 100,
  score: 0,
  distance: 0,

  position: [0, 10, 0],
  velocity: [0, 0, 0],
  rotation: 0,
  isFlapping: false,
  flapCooldown: 0,
  flapStrength: 1,

  threatType: null,
  threatMeter: 0,
  threatWarningActive: false,
  eagleTimer: 45,
  eagleDodgeWindow: 0,
  eagleDodgeStartRotation: 0,
  eagleDodgeTaps: 0,
  eagleAltitudeHunt: false,
  groundTimer: 0,

  feeders: [],
  activeFeeder: null,
  feederCooldown: 0,
  perchTime: 0,

  leaderboard: [],
  isMuted:
    typeof window !== 'undefined'
      ? localStorage.getItem('backyard-skies-muted') === 'true'
      : false,
  eagleDodges: 0,
  feedingScore: 0,

  // Initialize audio mute state from stored preference
  ...(typeof window !== 'undefined' && localStorage.getItem('backyard-skies-muted') === 'true'
    ? (() => { audioManager.setMuted(true); return {}; })()
    : {}),

  // State transitions
  setGameState: state => {
    audioManager.stopAllLoops();
    set({ gameState: state });
  },

  selectSpecies: species => set({ selectedSpecies: species }),

  startGame: () => {
    audioManager.stopAllLoops();
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({
      gameState: 'flight',
      food: species.attributes.maxFood,
      water: species.attributes.maxWater,
      stamina: species.attributes.stamina,
      score: 0,
      distance: 0,
      position: [0, 15, 0],
      velocity: [0, 0, 0],
      rotation: 0,
      isFlapping: false,
      flapCooldown: 0,
      flapStrength: 1,
      threatType: null,
      threatMeter: 0,
      threatWarningActive: false,
      eagleTimer: 30 + Math.random() * 60,
      eagleDodgeWindow: 0,
      eagleDodgeStartRotation: 0,
      eagleDodgeTaps: 0,
      eagleAltitudeHunt: false,
      groundTimer: 0,
      activeFeeder: null,
      feederCooldown: 0,
      feeders: generateFeeders(),
      isPaused: false,
      deathReason: null,
      eagleDodges: 0,
      feedingScore: 0,
    });
  },

  pauseGame: () => {
    audioManager.stopAllLoops();
    set({ isPaused: true });
  },
  resumeGame: () => set({ isPaused: false }),

  gameOver: reason => {
    set({ gameState: 'dying', deathReason: reason || null });
    audioManager.stopAllLoops();
    audioManager.play('death');
  },

  finalizeDeath: () => {
    const { score, distance, selectedSpecies, playerName } = get();
    set({ gameState: 'game-over' });
    const leaderboard = saveLeaderboardEntry(
      playerName || 'Player', selectedSpecies, score, distance,
    );
    set({ leaderboard });
  },

  // Player actions
  flap: () => {
    const {
      flapCooldown,
      stamina,
      gameState,
      eagleDodgeWindow,
      eagleDodgeTaps,
    } = get();
    if (flapCooldown > 0 || stamina <= 0) return;
    if (gameState !== 'flight') return;
    set({ isFlapping: true, flapCooldown: 0.15 });
    audioManager.play('flap', { rate: 0.9 + Math.random() * 0.2 });
    if (eagleDodgeWindow > 0) {
      set({ eagleDodgeTaps: eagleDodgeTaps + 1 });
    }
    setTimeout(() => set({ isFlapping: false }), 200);
  },

  setRotation: rotation => set({ rotation }),
  updatePosition: position => set({ position }),
  updateVelocity: velocity => set({ velocity }),
  setFlapCooldown: cooldown => set({ flapCooldown: cooldown }),

  // Resources
  depleteFood: amount => {
    const food = Math.max(0, get().food - amount);
    set({ food });
    if (food <= 0) get().gameOver('food');
  },

  depleteWater: amount => {
    const water = Math.max(0, get().water - amount);
    set({ water });
    if (water <= 0) get().gameOver('water');
  },

  depleteStamina: amount =>
    set({ stamina: Math.max(0, get().stamina - amount) }),

  replenishFood: amount => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({ food: Math.min(species.attributes.maxFood, get().food + amount) });
  },

  replenishWater: amount => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({ water: Math.min(species.attributes.maxWater, get().water + amount) });
  },

  replenishStamina: amount => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({
      stamina: Math.min(species.attributes.stamina, get().stamina + amount),
    });
  },

  addScore: amount => set({ score: get().score + amount }),

  addDistance: amount =>
    set({ distance: get().distance + amount * DISTANCE_PER_UNIT }),

  // Threats
  setThreat: type => set({ threatType: type }),
  setThreatMeter: value =>
    set({ threatMeter: Math.min(100, Math.max(0, value)) }),
  setThreatWarning: active => set({ threatWarningActive: active }),
  setEagleTimer: time => set({ eagleTimer: time }),
  setEagleDodgeWindow: time => set({ eagleDodgeWindow: time }),
  setEagleAltitudeHunt: active => set({ eagleAltitudeHunt: active }),

  dodgeEagle: () => {
    set({
      threatType: null,
      threatWarningActive: false,
      eagleDodgeWindow: 0,
      eagleAltitudeHunt: false,
      eagleTimer: 30 + Math.random() * 60,
      eagleDodges: get().eagleDodges + 1,
    });
    get().addScore(SCORE_EAGLE_DODGE_BONUS);
    audioManager.play('dodge');
  },

  // Feeders
  landOnFeeder: feeder => {
    const newState = feeder.type === 'feeder' ? 'feeding' : 'drinking';
    const perch = computePerchPosition(feeder);

    set({
      gameState: newState as GameState,
      activeFeeder: feeder,
      threatMeter: 0,
      perchTime: 0,
      position: perch.position,
      rotation: perch.rotation,
      velocity: [0, 0, 0],
    });
    audioManager.stopLoop('wind');
    const soundName = feeder.type === 'feeder' ? 'eat' : 'drink';
    audioManager.play(soundName, { loop: true, volume: 0.15 });
  },

  flyAway: () => {
    const { activeFeeder, position, feeders } = get();
    if (!activeFeeder) return;
    audioManager.stopLoop('eat');
    audioManager.stopLoop('drink');
    const bonus =
      activeFeeder.type === 'feeder' ? SCORE_FEED_BONUS : SCORE_DRINK_BONUS;
    // Lock this feeder for 60 seconds (predator assumed nearby)
    const lockTime = Date.now() + 60_000;
    const updatedFeeders = feeders.map(f =>
      f.id === activeFeeder.id ? { ...f, lockedUntil: lockTime } : f,
    );
    set({
      gameState: 'flight',
      activeFeeder: null,
      threatMeter: 0,
      threatType: null,
      threatWarningActive: false,
      feederCooldown: 1.5,
      feeders: updatedFeeders,
      position: [position[0], position[1] + 5, position[2]],
      velocity: [0, 3, 0],
    });
    get().addScore(bonus);
    set({ feedingScore: get().feedingScore + bonus });
  },

  setFeederCooldown: time => set({ feederCooldown: time }),

  refreshFeeders: () => {
    const { position, feeders } = get();
    const culled = cullDistantFeeders(feeders, position[0], position[2], 80);
    if (culled.length < 6) {
      const newFeeders = generateFeeders(position[0], position[2]);
      set({ feeders: [...culled, ...newFeeders] });
    } else {
      // Maintain density with incremental spawning
      const withSpawns = spawnNearbyFeeders(
        culled, position[0], position[2],
        /* targetCount */ 4,
        /* spawnDistance */ 50,
        /* minSpacing */ 15,
        /* seedBase */ Date.now(),
      );
      set({ feeders: withSpawns });
    }
  },

  // Player profile
  setPlayerName: name => {
    localStorage.setItem('backyard-skies-name', name);
    set({ playerName: name });
  },

  // Audio
  setMuted: (muted) => {
    localStorage.setItem('backyard-skies-muted', String(muted));
    set({ isMuted: muted });
    audioManager.setMuted(muted);
  },

  // Leaderboard
  loadLeaderboard: () => set({ leaderboard: loadLeaderboardFromStorage() }),

  saveScore: name => {
    const { score, distance, selectedSpecies } = get();
    const leaderboard = saveLeaderboardEntry(name, selectedSpecies, score, distance);
    set({ leaderboard });
  },
}));

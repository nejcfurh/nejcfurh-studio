import { audioManager } from '@/lib/audioManager';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import {
  cullDistantFeeders,
  generateFeeders,
  lockFeeder,
  spawnNearbyFeeders
} from '@/lib/feederManager';
import { cruiseSpeed } from '@/lib/flightPhysics';
import {
  loadLeaderboardFromStorage,
  saveLeaderboardEntry
} from '@/lib/leaderboard';
import { computePerchPosition } from '@/lib/perchPositions';
import { computeDodgeBonus, computeFlyAwayBonus } from '@/lib/scoring';
import {
  computeEagleInterval,
  computeFirstEagleDelay
} from '@/lib/threatSystem';
import {
  BirdSpeciesId,
  DeathReason,
  FeederData,
  GameState,
  LeaderboardEntry,
  ThreatType
} from '@/types';
import {
  DISTANCE_PER_UNIT,
  EAGLE_WARNING_TIME,
  FLAP_COOLDOWN,
  FLAP_VISUAL_DURATION
} from '@/utils/constants';
import { create } from 'zustand';

interface GameStore {
  // Game state
  gameState: GameState;
  selectedSpecies: BirdSpeciesId;
  isPaused: boolean;
  playerName: string;
  deathReason: DeathReason;
  // False until every asset of the 3D scene has loaded; the simulation waits on it.
  sceneReady: boolean;
  runId: number;
  // Seconds of unpaused simulation this run; every gameplay timer is measured in it.
  gameTime: number;

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
  // Forward speed: cruise in level flight, faster in a dive or glide.
  speed: number;
  isFlapping: boolean;
  // Flaps accepted since the last simulation step; the game loop applies and clears them.
  pendingFlaps: number;
  // True while a pointer is held on the canvas past the glide delay.
  isGliding: boolean;
  // Counts down in the game loop; isFlapping clears at zero, so a pause freezes it.
  flapTimer: number;
  flapCooldown: number;
  flapStrength: number;
  // Bumps into houses and trees this run, and the gameTime of the last one.
  bumpCount: number;
  lastBumpAt: number;

  // Threats
  threatType: ThreatType;
  threatMeter: number;
  threatWarningActive: boolean;
  eagleTimer: number;
  eagleDodgeWindow: number;
  eagleDodgeStartRotation: number;
  eagleDodgeStartAltitude: number;
  eagleDodgeTaps: number;
  eagleDodgeStreak: number;
  eagleAltitudeHunt: boolean;
  // The regular eagle countdown, saved while an altitude hunt replaces it.
  eagleResumeTimer: number;
  nearAltitudeLimit: boolean;
  groundTimer: number;

  // Feeders
  feeders: FeederData[];
  activeFeeder: FeederData | null;
  feederCooldown: number;
  perchTime: number;
  // Food or water restored during the current perch; sizes the fly-away bonus.
  perchRestored: number;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Audio
  isMuted: boolean;

  // Score breakdown tracking
  eagleDodges: number;
  timeScore: number;
  distanceScore: number;
  feedingScore: number;
  dodgeScore: number;
  flapsThisRun: number;

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
  setGliding: (gliding: boolean) => void;
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
  sceneReady: false,
  runId: 0,
  gameTime: 0,

  food: 100,
  water: 100,
  stamina: 100,
  score: 0,
  distance: 0,

  position: [0, 10, 0],
  velocity: [0, 0, 0],
  rotation: 0,
  speed: 0,
  isFlapping: false,
  pendingFlaps: 0,
  isGliding: false,
  flapTimer: 0,
  flapCooldown: 0,
  flapStrength: 1,
  bumpCount: 0,
  lastBumpAt: -Infinity,

  threatType: null,
  threatMeter: 0,
  threatWarningActive: false,
  eagleTimer: 60,
  eagleDodgeWindow: 0,
  eagleDodgeStartRotation: 0,
  eagleDodgeStartAltitude: 0,
  eagleDodgeTaps: 0,
  eagleDodgeStreak: 0,
  eagleAltitudeHunt: false,
  eagleResumeTimer: 0,
  nearAltitudeLimit: false,
  groundTimer: 0,

  feeders: [],
  activeFeeder: null,
  feederCooldown: 0,
  perchTime: 0,
  perchRestored: 0,

  leaderboard: [],
  isMuted:
    typeof window !== 'undefined'
      ? localStorage.getItem('backyard-skies-muted') === 'true'
      : false,
  eagleDodges: 0,
  timeScore: 0,
  distanceScore: 0,
  feedingScore: 0,
  dodgeScore: 0,
  flapsThisRun: 0,

  // Initialize audio mute state from stored preference
  ...(typeof window !== 'undefined' &&
  localStorage.getItem('backyard-skies-muted') === 'true'
    ? (() => {
        audioManager.setMuted(true);
        return {};
      })()
    : {}),

  // State transitions
  setGameState: (state) => {
    audioManager.stopAllLoops();
    set({ gameState: state });
  },

  selectSpecies: (species) => set({ selectedSpecies: species }),

  startGame: () => {
    audioManager.stopAllLoops();
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({
      gameState: 'flight',
      sceneReady: false,
      runId: get().runId + 1,
      gameTime: 0,
      food: species.attributes.maxFood,
      water: species.attributes.maxWater,
      stamina: species.attributes.stamina,
      score: 0,
      distance: 0,
      position: [0, 15, 0],
      velocity: [0, 0, 0],
      rotation: 0,
      speed: cruiseSpeed(species.attributes),
      isFlapping: false,
      pendingFlaps: 0,
      isGliding: false,
      flapTimer: 0,
      flapCooldown: 0,
      flapStrength: 1,
      bumpCount: 0,
      lastBumpAt: -Infinity,
      threatType: null,
      threatMeter: 0,
      threatWarningActive: false,
      eagleTimer: computeFirstEagleDelay(),
      eagleDodgeWindow: 0,
      eagleDodgeStartRotation: 0,
      eagleDodgeStartAltitude: 0,
      eagleDodgeTaps: 0,
      eagleDodgeStreak: 0,
      eagleAltitudeHunt: false,
      eagleResumeTimer: 0,
      nearAltitudeLimit: false,
      groundTimer: 0,
      activeFeeder: null,
      feederCooldown: 0,
      perchTime: 0,
      perchRestored: 0,
      feeders: generateFeeders(),
      isPaused: false,
      deathReason: null,
      eagleDodges: 0,
      timeScore: 0,
      distanceScore: 0,
      feedingScore: 0,
      dodgeScore: 0,
      flapsThisRun: 0
    });
  },

  pauseGame: () => {
    audioManager.stopAllLoops();
    set({ isPaused: true, isGliding: false });
  },
  resumeGame: () => set({ isPaused: false }),

  gameOver: (reason) => {
    set({ gameState: 'dying', deathReason: reason || null, isGliding: false });
    audioManager.stopAllLoops();
    audioManager.play('death');
  },

  finalizeDeath: async () => {
    const {
      score,
      distance,
      selectedSpecies,
      playerName,
      deathReason,
      eagleDodges,
      feedingScore
    } = get();
    set({ gameState: 'game-over' });
    const leaderboard = await saveLeaderboardEntry(
      playerName || 'Player',
      selectedSpecies,
      score,
      distance,
      deathReason,
      eagleDodges,
      feedingScore
    );
    set({ leaderboard });
  },

  // Player actions
  flap: () => {
    const {
      flapCooldown,
      stamina,
      gameState,
      isPaused,
      eagleDodgeWindow,
      eagleDodgeTaps
    } = get();
    if (flapCooldown > 0 || stamina <= 0) return;
    if (gameState !== 'flight' || isPaused) return;
    set({
      isFlapping: true,
      pendingFlaps: get().pendingFlaps + 1,
      flapTimer: FLAP_VISUAL_DURATION,
      flapCooldown: FLAP_COOLDOWN,
      flapsThisRun: get().flapsThisRun + 1
    });
    audioManager.play('flap', { rate: 0.9 + Math.random() * 0.2 });
    if (eagleDodgeWindow > 0) {
      set({ eagleDodgeTaps: eagleDodgeTaps + 1 });
    }
  },

  setGliding: (gliding) => {
    const { gameState, isPaused } = get();
    set({ isGliding: gliding && gameState === 'flight' && !isPaused });
  },

  setRotation: (rotation) => set({ rotation }),
  updatePosition: (position) => set({ position }),
  updateVelocity: (velocity) => set({ velocity }),
  setFlapCooldown: (cooldown) => set({ flapCooldown: cooldown }),

  // Resources
  depleteFood: (amount) => {
    const food = Math.max(0, get().food - amount);
    set({ food });
    if (food <= 0) get().gameOver('food');
  },

  depleteWater: (amount) => {
    const water = Math.max(0, get().water - amount);
    set({ water });
    if (water <= 0) get().gameOver('water');
  },

  depleteStamina: (amount) =>
    set({ stamina: Math.max(0, get().stamina - amount) }),

  replenishFood: (amount) => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({ food: Math.min(species.attributes.maxFood, get().food + amount) });
  },

  replenishWater: (amount) => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({ water: Math.min(species.attributes.maxWater, get().water + amount) });
  },

  replenishStamina: (amount) => {
    const species = BIRD_SPECIES[get().selectedSpecies];
    set({
      stamina: Math.min(species.attributes.stamina, get().stamina + amount)
    });
  },

  addScore: (amount) => set({ score: get().score + amount }),

  addDistance: (amount) =>
    set({ distance: get().distance + amount * DISTANCE_PER_UNIT }),

  // Threats
  setThreat: (type) => set({ threatType: type }),
  setThreatMeter: (value) =>
    set({ threatMeter: Math.min(100, Math.max(0, value)) }),
  setThreatWarning: (active) => set({ threatWarningActive: active }),
  setEagleTimer: (time) => set({ eagleTimer: time }),
  setEagleDodgeWindow: (time) => set({ eagleDodgeWindow: time }),
  setEagleAltitudeHunt: (active) => set({ eagleAltitudeHunt: active }),

  dodgeEagle: () => {
    const { eagleDodges, eagleDodgeStreak, gameTime, score, dodgeScore } =
      get();
    const streak = eagleDodgeStreak + 1;
    const bonus = computeDodgeBonus(streak);
    set({
      threatType: null,
      threatWarningActive: false,
      eagleDodgeWindow: 0,
      eagleAltitudeHunt: false,
      eagleTimer: computeEagleInterval(gameTime),
      eagleDodges: eagleDodges + 1,
      eagleDodgeStreak: streak,
      score: score + bonus,
      dodgeScore: dodgeScore + bonus
    });
    audioManager.play('dodge');
  },

  // Feeders
  landOnFeeder: (feeder) => {
    const newState = feeder.type === 'feeder' ? 'feeding' : 'drinking';
    const perch = computePerchPosition(feeder);
    const { eagleTimer, gameTime, threatType } = get();
    // Reaching cover ends a warned or attacking eagle. Left set, its state
    // stalls the eagle machine for the rest of the run and masks the cat.
    const eagleEncounter =
      threatType === 'eagle' || eagleTimer <= EAGLE_WARNING_TIME;

    set({
      gameState: newState as GameState,
      activeFeeder: feeder,
      threatMeter: 0,
      perchTime: 0,
      perchRestored: 0,
      eagleDodgeStreak: 0,
      position: perch.position,
      rotation: perch.rotation,
      velocity: [0, 0, 0],
      speed: cruiseSpeed(BIRD_SPECIES[get().selectedSpecies].attributes),
      pendingFlaps: 0,
      isGliding: false,
      ...(eagleEncounter && {
        threatType: null,
        eagleAltitudeHunt: false,
        threatWarningActive: false,
        eagleDodgeWindow: 0,
        eagleTimer: computeEagleInterval(gameTime)
      })
    });
    // The game loop starts the eat/drink loop, so it also restarts after a pause.
    audioManager.stopLoop('wind');
  },

  flyAway: () => {
    const {
      activeFeeder,
      position,
      feeders,
      gameTime,
      perchRestored,
      selectedSpecies,
      score,
      feedingScore,
      isPaused
    } = get();
    if (!activeFeeder || isPaused) return;
    audioManager.stopLoop('eat');
    audioManager.stopLoop('drink');
    const { maxFood, maxWater } = BIRD_SPECIES[selectedSpecies].attributes;
    const bonus = computeFlyAwayBonus(
      activeFeeder.type,
      perchRestored,
      activeFeeder.type === 'feeder' ? maxFood : maxWater
    );
    // Locked feeders assume a predator is nearby.
    const updatedFeeders = lockFeeder(feeders, activeFeeder.id, gameTime);
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
      perchRestored: 0,
      score: score + bonus,
      feedingScore: feedingScore + bonus
    });
  },

  setFeederCooldown: (time) => set({ feederCooldown: time }),

  refreshFeeders: () => {
    const { position, feeders } = get();
    const culled = cullDistantFeeders(feeders, position[0], position[2], 80);
    if (culled.length < 6) {
      const newFeeders = generateFeeders(position[0], position[2]);
      set({ feeders: [...culled, ...newFeeders] });
    } else {
      // Maintain density with incremental spawning
      const withSpawns = spawnNearbyFeeders(
        culled,
        position[0],
        position[2],
        /* targetCount */ 4,
        /* spawnDistance */ 50,
        /* minSpacing */ 15,
        /* seedBase */ Date.now()
      );
      set({ feeders: withSpawns });
    }
  },

  // Player profile
  setPlayerName: (name) => {
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
  loadLeaderboard: async () => {
    const leaderboard = await loadLeaderboardFromStorage();
    set({ leaderboard });
  }
}));

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { __gameStore: typeof useGameStore }).__gameStore =
    useGameStore;
}

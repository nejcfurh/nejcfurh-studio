// Physics
export const GRAVITY = -9.8;
export const FLAP_COOLDOWN = 0.15; // seconds between flaps
export const GLIDE_DRAG = 0.98;
export const TURN_SPEED = 2.5;
export const FORWARD_SPEED_BASE = 12;
export const MAX_ALTITUDE = 40;
export const MIN_ALTITUDE = 0.3;
export const GROUND_LEVEL = 0.3;
export const GROUND_DEATH_TIME = 3; // seconds on ground before death

// Resources
export const RESOURCE_WARNING_THRESHOLD = 30;
export const RESOURCE_CRITICAL_THRESHOLD = 15;

// Feeders
export const FEEDER_PROXIMITY = 4;
export const FEEDER_COUNT = 6;
export const BIRDBATH_COUNT = 4;
export const THREAT_METER_BASE_RATE = 8; // per second
export const THREAT_METER_CAT_MULTIPLIER = 5;
export const THREAT_METER_MAX = 100;

// Threats
export const EAGLE_MIN_INTERVAL = 30;
export const EAGLE_MAX_INTERVAL = 90;
export const EAGLE_WARNING_TIME = 2.5;
export const EAGLE_DODGE_WINDOW = 1.5;
export const EAGLE_ALTITUDE_THRESHOLD = 25; // eagle hunts above this altitude

// Scoring
export const SCORE_PER_SECOND = 1;
export const SCORE_FEED_BONUS = 50;
export const SCORE_DRINK_BONUS = 40;
export const SCORE_EAGLE_DODGE_BONUS = 100;
export const DISTANCE_PER_UNIT = 0.01; // km per world unit

// World
export const WORLD_SIZE = 200;
export const HOUSE_COUNT = 12;
export const TREE_COUNT = 40;

// Colors (from wireframe)
export const COLORS = {
  primary: '#00AEEF',
  primaryDark: '#0088CC',
  accent: '#FFD700',
  food: '#4CAF50',
  foodBg: '#2E7D32',
  water: '#00AEEF',
  waterBg: '#0077AA',
  stamina: '#FF9800',
  staminaBg: '#E65100',
  danger: '#FF3D00',
  dangerBg: '#B71C1C',
  warning: '#FF9800',
  warningBg: '#E65100',
  dark: '#1A1A2E',
  darkCard: '#16213E',
  darkSurface: '#0F3460',
  white: '#FFFFFF',
  textLight: '#E0E0E0',
  textMuted: '#9E9E9E',
  success: '#4CAF50',
  ground: '#4A7C59',
  sky: '#87CEEB',
} as const;

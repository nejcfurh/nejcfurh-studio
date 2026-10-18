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
export const FLAP_VISUAL_DURATION = 0.2; // seconds isFlapping stays true after a tap

// Flight speed, as multiples of the species' cruise speed (FORWARD_SPEED_BASE * speed / 20)
export const SPEED_MIN_FACTOR = 0.8;
export const SPEED_MAX_FACTOR = 2;
export const SPEED_DIVE_GAIN = 0.5; // forward speed gained per unit of sink rate, per second
export const SPEED_CLIMB_BLEED = 0.5; // forward speed lost per unit of climb rate, per second
export const SPEED_RECOVERY_RATE = 0.4; // 1/s pull back toward cruise speed

// Glide (pointer held on the canvas)
export const GLIDE_HOLD_DELAY = 0.15; // seconds a press must last before it becomes a glide
export const GLIDE_GRAVITY_FACTOR = 0.35; // applied to gravity while sinking
export const GLIDE_SPEED_GAIN = 0.15; // forward speed gained per second
export const TAP_STEER_DURATION = 0.3; // seconds a tap's steering lasts

// Bumping into houses and trees
// The drawn bird's body sits above its position, so the collision sphere does too.
export const BIRD_COLLISION_RADIUS = 0.5;
export const BIRD_COLLISION_OFFSET_Y = 0.6;
export const BUMP_STAMINA_COST = 10;
export const BUMP_COOLDOWN = 0.4; // seconds before another bump costs stamina again
export const BUMP_ROOF_BOUNCE = 3; // upward speed after hitting a roof or canopy top
export const BUMP_SHAKE_DURATION = 0.25;
export const BUMP_SHAKE_AMPLITUDE = 0.2; // world units of camera offset

// Resources
export const RESOURCE_WARNING_THRESHOLD = 30;
export const RESOURCE_CRITICAL_THRESHOLD = 15;
export const STAMINA_FLIGHT_REGEN = 3; // per second while flying
export const STAMINA_REST_REGEN = 15; // per second while perched

// Feeders
export const FEEDER_PROXIMITY = 4;
export const FEEDER_COUNT = 6;
export const BIRDBATH_COUNT = 4;
export const FEEDER_LOCK_DURATION = 60; // seconds of game time after flying away
export const PERCH_MIN_TIME = 2; // seconds perched before a tap flies away
export const THREAT_METER_BASE_RATE = 8; // per second
export const THREAT_METER_CAT_RATE = 30; // per second with a cat present
export const THREAT_METER_MAX = 100;

// Threats
// Interval between eagles: max(MIN_BASE, START - RAMP * elapsed) +/- JITTER
export const EAGLE_INTERVAL_START = 60;
export const EAGLE_INTERVAL_RAMP = 0.1; // seconds shorter per second of run
export const EAGLE_INTERVAL_MIN_BASE = 20;
export const EAGLE_INTERVAL_JITTER = 10;
export const EAGLE_FIRST_MIN_DELAY = 45;
export const EAGLE_WARNING_TIME = 3;
export const EAGLE_DODGE_WINDOW = 1.8;
export const EAGLE_DODGE_TURN_DEGREES = 70;
// Free fall from rest covers ~4.1 units in the 1.8 s window, so 6 is unreachable.
export const EAGLE_DODGE_DIVE_DEPTH = 3;
export const EAGLE_DODGE_TAPS = 3;
export const EAGLE_ALTITUDE_THRESHOLD = 28; // eagle hunts above this altitude
export const EAGLE_ALTITUDE_LIMIT_MARGIN = 5; // taps replace turns this close to the threshold
export const EAGLE_ALTITUDE_HUNT_TIME = 5;
export const EAGLE_HUNT_RESUME_MIN = 10; // seconds of countdown left after an altitude hunt ends

// Scoring
// Sized so a cardinal cruising at 4.2 u/s earns ~1 pt/s, the rate the
// existing leaderboard entries were scored at.
export const SCORE_PER_SECOND = 0.25;
export const SCORE_PER_DISTANCE_UNIT = 0.18; // per horizontal world unit flown
export const SCORE_PER_RESOURCE_RESTORED = 2;
export const SCORE_FEED_BONUS = 50;
export const SCORE_DRINK_BONUS = 40;
export const SCORE_FLY_AWAY_MIN_FRACTION = 0.2; // of max restored before any bonus
export const SCORE_FLY_AWAY_MIN_BONUS = 10;
export const SCORE_EAGLE_DODGE_BONUS = 100;
export const SCORE_DODGE_STREAK_STEP = 1.5;
export const SCORE_DODGE_STREAK_CAP = 3;
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
  sky: '#87CEEB'
} as const;

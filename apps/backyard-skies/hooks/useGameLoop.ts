'use client';

import { audioManager } from '@/lib/audioManager';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { isFeederLocked } from '@/lib/feederManager';
import {
  computeFlightStep,
  cruiseSpeed,
  FlightResult
} from '@/lib/flightPhysics';
import {
  depleteResources,
  replenishFromFeeder,
  restStamina
} from '@/lib/resourceSystem';
import {
  accruePoints,
  computeDistance,
  computeDistanceScore,
  computeFlightScore,
  computeHorizontalDistance
} from '@/lib/scoring';
import {
  createObstacleHit,
  isRoofHit,
  reflectHeading,
  resolveObstacleCollision
} from '@/lib/terrain/terrainCollision';
import {
  isNearAltitudeLimit,
  tickCatThreat,
  tickEagleThreat
} from '@/lib/threatSystem';
import { useGameStore } from '@/store/gameStore';
import { BirdAttributes } from '@/types';
import {
  BUMP_COOLDOWN,
  BUMP_ROOF_BOUNCE,
  BUMP_STAMINA_COST,
  DISTANCE_PER_UNIT,
  FEEDER_PROXIMITY,
  GROUND_DEATH_TIME,
  MIN_ALTITUDE,
  SPEED_MIN_FACTOR
} from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';

type GameStoreState = ReturnType<typeof useGameStore.getState>;

interface ScoreAccumulators {
  time: number;
  distance: number;
  feeding: number;
}

export function useGameLoop(joystickXRef: MutableRefObject<number>) {
  const accumulators = useRef<ScoreAccumulators>({
    time: 0,
    distance: 0,
    feeding: 0
  });
  const lastPosition = useRef(new THREE.Vector3());
  const feederRefreshTimer = useRef(0);
  const windStarted = useRef(false);
  const perchSoundStarted = useRef(false);
  const eagleSoundPlayed = useRef(false);
  const runIdRef = useRef(-1);
  const wasPerched = useRef(false);

  useFrame((_, delta) => {
    const frameStart = useGameStore.getState();
    const isPerched =
      frameStart.gameState === 'feeding' || frameStart.gameState === 'drinking';

    // pauseGame stops every audio loop, so these flags make them restart on resume.
    if (frameStart.isPaused) {
      windStarted.current = false;
      perchSoundStarted.current = false;
      return;
    }
    if (frameStart.gameState !== 'flight') windStarted.current = false;
    if (!isPerched) perchSoundStarted.current = false;

    if (!frameStart.sceneReady) return;

    if (runIdRef.current !== frameStart.runId) {
      runIdRef.current = frameStart.runId;
      lastPosition.current.set(...frameStart.position);
      accumulators.current = { time: 0, distance: 0, feeding: 0 };
      feederRefreshTimer.current = 0;
    }

    if (frameStart.gameState !== 'flight' && !isPerched) return;

    // Landing snaps the bird onto the perch and flying away hops it up; neither
    // jump was flown, so keep the distance anchor on the bird while perched.
    if (isPerched || wasPerched.current) {
      lastPosition.current.set(...frameStart.position);
    }
    wasPerched.current = isPerched;

    const clamped = Math.min(delta, 0.05);
    advanceClocks(frameStart, clamped);

    const state = useGameStore.getState();
    const species = BIRD_SPECIES[state.selectedSpecies];

    if (state.gameState === 'flight') {
      if (!windStarted.current) {
        windStarted.current = true;
        audioManager.play('wind', { loop: true, volume: 0.08 });
      }

      const speed = Math.sqrt(
        state.velocity[0] * state.velocity[0] +
          state.velocity[1] * state.velocity[1] +
          state.velocity[2] * state.velocity[2]
      );
      audioManager.setWindVolume(Math.min(0.15, speed * 0.012));

      if (state.threatType === 'eagle' && !eagleSoundPlayed.current) {
        eagleSoundPlayed.current = true;
        audioManager.play('eagle', { volume: 0.2 });
      }
      if (state.threatType !== 'eagle') {
        eagleSoundPlayed.current = false;
      }

      updateFlight(state, species, {
        joystickX: joystickXRef.current,
        delta: clamped,
        accumulators,
        lastPosition
      });

      feederRefreshTimer.current += clamped;
      if (feederRefreshTimer.current > 3) {
        feederRefreshTimer.current = 0;
        state.refreshFeeders();
      }
    } else if (state.activeFeeder) {
      if (!perchSoundStarted.current) {
        perchSoundStarted.current = true;
        const soundName =
          state.activeFeeder.type === 'feeder' ? 'eat' : 'drink';
        audioManager.play(soundName, { loop: true, volume: 0.15 });
      }
      updateFeeding(state, species, clamped, accumulators);
    }
  });
}

/** Game time and the flap pose only advance on unpaused frames. */
function advanceClocks(state: GameStoreState, delta: number) {
  const flapTimer = Math.max(0, state.flapTimer - delta);
  useGameStore.setState({
    gameTime: state.gameTime + delta,
    flapTimer,
    isFlapping: state.isFlapping && flapTimer > 0
  });
}

interface FlightContext {
  joystickX: number;
  delta: number;
  accumulators: MutableRefObject<ScoreAccumulators>;
  lastPosition: MutableRefObject<THREE.Vector3>;
}

function updateFlight(
  state: GameStoreState,
  species: (typeof BIRD_SPECIES)[string],
  ctx: FlightContext
) {
  const { joystickX, delta, accumulators, lastPosition } = ctx;
  const attrs = species.attributes;

  const stepped = computeFlightStep({
    position: state.position,
    velocity: state.velocity,
    rotation: state.rotation,
    speed: state.speed,
    flaps: state.pendingFlaps,
    flapCooldown: state.flapCooldown,
    flapStrength: state.flapStrength,
    gliding: state.isGliding,
    joystickX,
    attrs,
    delta
  });
  const bounced = bounceOffObstacles(stepped, attrs);
  const flight = bounced ?? stepped;
  const isNewBump =
    bounced !== null && state.gameTime - state.lastBumpAt >= BUMP_COOLDOWN;

  let groundTimer = state.groundTimer;
  if (flight.onGround) {
    groundTimer += delta;
    if (groundTimer >= GROUND_DEATH_TIME) {
      state.gameOver('ground');
      return;
    }
  } else {
    groundTimer = 0;
  }

  const staminaAfterFlaps = state.stamina - flight.staminaCost;
  const resources = depleteResources(
    state.food,
    state.water,
    isNewBump
      ? Math.min(
          staminaAfterFlaps,
          Math.max(0, staminaAfterFlaps - BUMP_STAMINA_COST)
        )
      : staminaAfterFlaps,
    attrs,
    delta
  );

  if (resources.depletedResource) {
    state.gameOver(resources.depletedResource);
    return;
  }

  // Score from this frame's own movement, so teleports (perch snap, fly-away hop) never count.
  const timePoints = computeFlightScore(accumulators.current.time, delta);
  const distancePoints = computeDistanceScore(
    accumulators.current.distance,
    computeHorizontalDistance(
      state.position[0],
      state.position[2],
      flight.position[0],
      flight.position[2]
    )
  );

  const dist = computeDistance(
    lastPosition.current.x,
    lastPosition.current.y,
    lastPosition.current.z,
    flight.position[0],
    flight.position[1],
    flight.position[2]
  );
  if (dist > 0.01) {
    lastPosition.current.set(
      flight.position[0],
      flight.position[1],
      flight.position[2]
    );
  }

  if (state.feederCooldown <= 0) {
    for (const feeder of state.feeders) {
      if (isFeederLocked(feeder, state.gameTime)) continue;
      const dx = flight.position[0] - feeder.position[0];
      const dy = flight.position[1] - feeder.position[1];
      const dz = flight.position[2] - feeder.position[2];
      const distToFeeder = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (
        distToFeeder < FEEDER_PROXIMITY &&
        flight.position[1] < feeder.position[1] + 4
      ) {
        state.landOnFeeder(feeder);
        return;
      }
    }
  }

  const eagle = tickEagleThreat({
    altitude: flight.position[1],
    rotation: flight.rotation,
    delta,
    eagleTimer: state.eagleTimer,
    eagleDodgeWindow: state.eagleDodgeWindow,
    eagleDodgeStartRotation: state.eagleDodgeStartRotation,
    eagleDodgeStartAltitude: state.eagleDodgeStartAltitude,
    eagleDodgeTaps: state.eagleDodgeTaps,
    eagleAltitudeHunt: state.eagleAltitudeHunt,
    eagleResumeTimer: state.eagleResumeTimer,
    threatType: state.threatType,
    threatWarningActive: state.threatWarningActive,
    elapsed: state.gameTime
  });

  let eagleUpdates: Partial<GameStoreState> = {
    eagleTimer: eagle.eagleTimer,
    eagleDodgeWindow: eagle.eagleDodgeWindow,
    eagleResumeTimer: eagle.eagleResumeTimer
  };

  switch (eagle.action.type) {
    case 'altitude_caught':
    case 'caught':
      state.gameOver('eagle');
      return;
    case 'start_altitude_hunt':
      eagleUpdates = {
        eagleAltitudeHunt: true,
        threatWarningActive: true,
        threatType: 'eagle',
        eagleTimer: eagle.eagleTimer,
        eagleDodgeWindow: eagle.eagleDodgeWindow,
        eagleResumeTimer: eagle.eagleResumeTimer
      };
      break;
    case 'end_altitude_hunt':
      eagleUpdates = {
        ...eagleUpdates,
        eagleAltitudeHunt: false,
        threatType: null,
        threatWarningActive: false
      };
      break;
    case 'start_warning':
      eagleUpdates = {
        ...eagleUpdates,
        threatWarningActive: true,
        threatType: 'eagle'
      };
      break;
    case 'start_dodge_window':
      eagleUpdates = {
        ...eagleUpdates,
        eagleDodgeStartRotation: flight.rotation,
        eagleDodgeStartAltitude: flight.position[1],
        eagleDodgeTaps: 0
      };
      break;
    case 'dodged':
      // dodgeEagle schedules the next eagle and adds the bonus; do not overwrite them below.
      state.dodgeEagle();
      eagleUpdates = {};
      break;
    case 'none':
      break;
  }

  accumulators.current.time = timePoints.newAccumulator;
  accumulators.current.distance = distancePoints.newAccumulator;
  const latest = useGameStore.getState();

  useGameStore.setState({
    position: flight.position,
    velocity: flight.velocity,
    rotation: flight.rotation,
    speed: flight.speed,
    pendingFlaps: 0,
    flapCooldown: flight.flapCooldown,
    food: resources.food,
    water: resources.water,
    stamina: resources.stamina,
    score: latest.score + timePoints.points + distancePoints.points,
    timeScore: latest.timeScore + timePoints.points,
    distanceScore: latest.distanceScore + distancePoints.points,
    distance: state.distance + (dist > 0.01 ? dist * DISTANCE_PER_UNIT : 0),
    feederCooldown: Math.max(0, state.feederCooldown - delta),
    nearAltitudeLimit: isNearAltitudeLimit(flight.position[1]),
    groundTimer,
    ...(isNewBump && {
      bumpCount: state.bumpCount + 1,
      lastBumpAt: state.gameTime
    }),
    ...eagleUpdates
  });
}

const obstacleHit = createObstacleHit();

/**
 * A bird that flew into a house or tree is pushed back out of it at minimum
 * speed, turned away from a wall or bounced up off a roof. Null when clear.
 */
function bounceOffObstacles(
  flight: FlightResult,
  attrs: BirdAttributes
): FlightResult | null {
  const [x, y, z] = flight.position;
  if (!resolveObstacleCollision(x, y, z, obstacleHit)) return null;

  const roof = isRoofHit(obstacleHit);
  const rotation = roof
    ? flight.rotation
    : reflectHeading(flight.rotation, obstacleHit.nx, obstacleHit.nz);
  const vy = roof
    ? Math.max(flight.velocity[1], BUMP_ROOF_BOUNCE)
    : flight.velocity[1];
  const speed = cruiseSpeed(attrs) * SPEED_MIN_FACTOR;
  return {
    ...flight,
    position: [obstacleHit.x, obstacleHit.y, obstacleHit.z],
    velocity: [Math.sin(rotation) * speed, vy, Math.cos(rotation) * speed],
    rotation,
    speed,
    onGround: obstacleHit.y <= MIN_ALTITUDE
  };
}

function updateFeeding(
  state: GameStoreState,
  species: (typeof BIRD_SPECIES)[string],
  delta: number,
  accumulators: MutableRefObject<ScoreAccumulators>
) {
  const { activeFeeder, perchTime } = state;
  if (!activeFeeder) return;

  const attrs = species.attributes;

  const replenish = replenishFromFeeder(
    state.food,
    state.water,
    activeFeeder.type,
    attrs,
    delta
  );

  const cat = tickCatThreat({
    threatMeter: state.threatMeter,
    hasCat: activeFeeder.hasCat,
    delta,
    threatWarningActive: state.threatWarningActive
  });

  if (cat.caught) {
    useGameStore.setState({ threatType: 'cat', threatMeter: cat.threatMeter });
    state.gameOver('cat');
    return;
  }

  const feedPoints = accruePoints(
    accumulators.current.feeding,
    replenish.scoreGained
  );
  accumulators.current.feeding = feedPoints.newAccumulator;

  const updates: Partial<GameStoreState> = {
    perchTime: perchTime + delta,
    perchRestored: state.perchRestored + replenish.restored,
    food: replenish.food,
    water: replenish.water,
    stamina: restStamina(state.stamina, attrs, delta),
    score: state.score + feedPoints.points,
    feedingScore: state.feedingScore + feedPoints.points,
    threatMeter: cat.threatMeter
  };

  if (cat.warning) {
    updates.threatWarningActive = true;
    updates.threatType = 'cat';
  }

  useGameStore.setState(updates);
}

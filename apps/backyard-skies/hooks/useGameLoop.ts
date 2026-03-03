'use client';

import { useRef, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { FEEDER_PROXIMITY, DISTANCE_PER_UNIT, GROUND_DEATH_TIME } from '@/utils/constants';
import { audioManager } from '@/lib/audioManager';
import { computeFlightStep } from '@/lib/flightPhysics';
import { tickEagleThreat, tickCatThreat } from '@/lib/threatSystem';
import { depleteResources, replenishFromFeeder } from '@/lib/resourceSystem';
import { computeFlightScore, computeDistance } from '@/lib/scoring';
import * as THREE from 'three';

export function useGameLoop(joystickXRef: MutableRefObject<number>) {
  const scoreAccumulator = useRef(0);
  const lastPosition = useRef(new THREE.Vector3());
  const feederRefreshTimer = useRef(0);
  const flapApplied = useRef(false);
  const windStarted = useRef(false);
  const eagleSoundPlayed = useRef(false);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.isPaused) {
      windStarted.current = false;
      return;
    }

    if (state.gameState !== 'flight') {
      windStarted.current = false;
    }

    const clamped = Math.min(delta, 0.05);
    const species = BIRD_SPECIES[state.selectedSpecies];
    const joystickX = joystickXRef.current;

    if (state.gameState === 'flight') {
      // Audio: start wind loop
      if (!windStarted.current) {
        windStarted.current = true;
        audioManager.play('wind', { loop: true, volume: 0.08 });
      }

      // Audio: modulate wind volume
      const speed = Math.sqrt(
        state.velocity[0] * state.velocity[0] +
        state.velocity[1] * state.velocity[1] +
        state.velocity[2] * state.velocity[2]
      );
      audioManager.setWindVolume(Math.min(0.15, speed * 0.012));

      // Audio: eagle screech
      if (state.threatType === 'eagle' && !eagleSoundPlayed.current) {
        eagleSoundPlayed.current = true;
        audioManager.play('eagle', { volume: 0.2 });
      }
      if (state.threatType !== 'eagle') {
        eagleSoundPlayed.current = false;
      }

      updateFlight(state, species, joystickX, clamped, scoreAccumulator, lastPosition, flapApplied);

      // Periodically refresh feeders
      feederRefreshTimer.current += clamped;
      if (feederRefreshTimer.current > 3) {
        feederRefreshTimer.current = 0;
        state.refreshFeeders();
      }
    } else if (state.gameState === 'feeding' || state.gameState === 'drinking') {
      updateFeeding(state, species, clamped);
    }
  });
}

function updateFlight(
  state: ReturnType<typeof useGameStore.getState>,
  species: (typeof BIRD_SPECIES)[string],
  joystickX: number,
  delta: number,
  scoreAccumulator: MutableRefObject<number>,
  lastPosition: MutableRefObject<THREE.Vector3>,
  flapAppliedRef: MutableRefObject<boolean>,
) {
  const attrs = species.attributes;

  // --- Flight physics ---
  const flight = computeFlightStep({
    position: state.position,
    velocity: state.velocity,
    rotation: state.rotation,
    isFlapping: state.isFlapping,
    flapCooldown: state.flapCooldown,
    flapStrength: state.flapStrength,
    flapApplied: flapAppliedRef.current,
    joystickX,
    attrs,
    delta,
  });

  flapAppliedRef.current = flight.flapApplied;

  // --- Ground timer: 3 seconds to take off before death ---
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

  // --- Resources ---
  const resources = depleteResources(
    state.food, state.water, state.stamina - flight.staminaCost, attrs, delta,
  );

  if (resources.depletedResource) {
    state.gameOver(resources.depletedResource);
    return;
  }

  // --- Scoring ---
  const score = computeFlightScore(scoreAccumulator.current, delta);
  scoreAccumulator.current = score.newAccumulator;

  const dist = computeDistance(
    lastPosition.current.x, lastPosition.current.y, lastPosition.current.z,
    flight.position[0], flight.position[1], flight.position[2],
  );
  if (dist > 0.01) {
    lastPosition.current.set(flight.position[0], flight.position[1], flight.position[2]);
  }

  // --- Feeder proximity ---
  let landed = false;
  if (state.feederCooldown <= 0) {
    const now = Date.now();
    for (const feeder of state.feeders) {
      if (feeder.lockedUntil && feeder.lockedUntil > now) continue;
      const dx = flight.position[0] - feeder.position[0];
      const dy = flight.position[1] - feeder.position[1];
      const dz = flight.position[2] - feeder.position[2];
      const distToFeeder = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distToFeeder < FEEDER_PROXIMITY && flight.position[1] < feeder.position[1] + 4) {
        state.landOnFeeder(feeder);
        landed = true;
        break;
      }
    }
  }

  if (landed) return;

  // --- Eagle threat ---
  const eagle = tickEagleThreat({
    altitude: flight.position[1],
    rotation: flight.rotation,
    delta,
    eagleTimer: state.eagleTimer,
    eagleDodgeWindow: state.eagleDodgeWindow,
    eagleDodgeStartRotation: state.eagleDodgeStartRotation,
    eagleDodgeTaps: state.eagleDodgeTaps,
    eagleAltitudeHunt: state.eagleAltitudeHunt,
    threatType: state.threatType,
    threatWarningActive: state.threatWarningActive,
  });

  // Handle eagle actions
  switch (eagle.action.type) {
    case 'start_altitude_hunt':
      useGameStore.setState({
        eagleAltitudeHunt: true,
        threatWarningActive: true,
        threatType: 'eagle',
        eagleTimer: eagle.eagleTimer,
      });
      useGameStore.setState({
        position: flight.position,
        velocity: flight.velocity,
        rotation: flight.rotation,
        flapCooldown: flight.flapCooldown,
        food: resources.food,
        water: resources.water,
        stamina: resources.stamina,
        score: state.score + score.points,
        distance: state.distance + (dist > 0.01 ? dist * DISTANCE_PER_UNIT : 0),
        feederCooldown: Math.max(0, state.feederCooldown - delta),
        groundTimer,
      });
      return;
    case 'end_altitude_hunt':
      useGameStore.setState({
        eagleAltitudeHunt: false,
        threatType: null,
        threatWarningActive: false,
        eagleTimer: eagle.eagleTimer,
      });
      break;
    case 'altitude_caught':
    case 'caught':
      state.gameOver('eagle');
      return;
    case 'start_warning':
      useGameStore.setState({
        threatWarningActive: true,
        threatType: 'eagle',
        eagleTimer: eagle.eagleTimer,
      });
      break;
    case 'start_dodge_window':
      useGameStore.setState({
        eagleDodgeWindow: eagle.eagleDodgeWindow,
        eagleDodgeStartRotation: flight.rotation,
        eagleDodgeTaps: 0,
        eagleTimer: eagle.eagleTimer,
      });
      useGameStore.setState({
        position: flight.position,
        velocity: flight.velocity,
        rotation: flight.rotation,
        flapCooldown: flight.flapCooldown,
        food: resources.food,
        water: resources.water,
        stamina: resources.stamina,
        score: state.score + score.points,
        distance: state.distance + (dist > 0.01 ? dist * DISTANCE_PER_UNIT : 0),
        feederCooldown: Math.max(0, state.feederCooldown - delta),
        groundTimer,
      });
      return;
    case 'dodged':
      state.dodgeEagle();
      break;
    case 'none':
      break;
  }

  // --- Batch state update ---
  useGameStore.setState({
    position: flight.position,
    velocity: flight.velocity,
    rotation: flight.rotation,
    flapCooldown: flight.flapCooldown,
    food: resources.food,
    water: resources.water,
    stamina: resources.stamina,
    score: state.score + score.points,
    distance: state.distance + (dist > 0.01 ? dist * DISTANCE_PER_UNIT : 0),
    feederCooldown: Math.max(0, state.feederCooldown - delta),
    eagleTimer: eagle.eagleTimer,
    eagleDodgeWindow: eagle.eagleDodgeWindow,
    groundTimer,
  });
}

function updateFeeding(
  state: ReturnType<typeof useGameStore.getState>,
  species: (typeof BIRD_SPECIES)[string],
  delta: number,
) {
  const { activeFeeder, gameState, perchTime } = state;
  if (!activeFeeder) return;

  const attrs = species.attributes;

  // Replenish resources
  const replenish = replenishFromFeeder(
    state.food, state.water, activeFeeder.type, attrs, delta,
  );

  // Cat threat
  const cat = tickCatThreat({
    threatMeter: state.threatMeter,
    hasCat: activeFeeder.hasCat,
    delta,
    threatWarningActive: state.threatWarningActive,
  });

  if (cat.caught) {
    useGameStore.setState({ threatType: 'cat', threatMeter: cat.threatMeter });
    state.gameOver('cat');
    return;
  }

  const updates: Record<string, unknown> = {
    perchTime: perchTime + delta,
    food: replenish.food,
    water: replenish.water,
    score: state.score + replenish.scoreGained,
    threatMeter: cat.threatMeter,
  };

  if (cat.warning) {
    updates.threatWarningActive = true;
    updates.threatType = 'cat';
  }

  useGameStore.setState(updates);
}

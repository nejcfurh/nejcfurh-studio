'use client';

import { useGameStore } from '@/store/gameStore';
import { TURN_SPEED } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { BumpPuff } from './effects/BumpPuff';
import GltfBirdModel, { BirdPose } from './GltfBirdModel';

// REUSABLE VECTOR3 FOR POSITION DAMPING — AVOIDS ALLOCATION PER FRAME
const _birdTarget = new THREE.Vector3();

/**
 * Where the bird is drawn during the death tumble. The store position stops
 * at the point of death while the model keeps falling, and the death camera
 * follows this instead.
 */
export const renderedBirdPosition = new THREE.Vector3();

const MAX_PITCH = THREE.MathUtils.degToRad(20);
const MAX_BANK = THREE.MathUtils.degToRad(35);

// Damping rates (1/s); each matches the old per-frame lerp factor at 60 fps.
const POSITION_DAMPING = 10;
const YAW_DAMPING = 6.3;
const SCALE_DAMPING = 5;
const BANK_DAMPING = 5;
// Each flap kicks the vertical speed up by several units at once; pitch follows a
// low-passed copy so one tap tilts the nose gradually instead of snapping it.
const CLIMB_DAMPING = 1.2;
const PITCH_DAMPING = 3;
// The heading jumps on a wall bounce; smooth the turn rate before it banks the bird.
const TURN_RATE_DAMPING = 12;
const DEATH_REST_HEIGHT = 0.3;
const DEATH_MIN_DURATION = 1.2;

const damp = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

export default function PlayerBird() {
  const groupRef = useRef<THREE.Group>(null);
  const birdRef = useRef<THREE.Group>(null);
  const dyingTimer = useRef(0);
  const dyingFallSpeed = useRef(0);
  const dyingFinalized = useRef(false);
  const runIdRef = useRef(-1);
  const lastRotation = useRef(0);
  const climb = useRef(0);
  const turnRate = useRef(0);
  const poseRef = useRef<BirdPose>({
    flapId: 0,
    perched: false,
    frozen: false
  });

  const selectedSpecies = useGameStore((s) => s.selectedSpecies);
  const gameState = useGameStore((s) => s.gameState);

  const isPerched = gameState === 'feeding' || gameState === 'drinking';
  const isDying = gameState === 'dying';

  // BIRD SCALE: SMALL WHEN PERCHED, LARGER IN FLIGHT FOR VISIBILITY
  // GltfBirdModel HAS BASE SCALE=5, OUTER GROUP MULTIPLIES ON TOP
  const targetScale = isPerched ? (gameState === 'feeding' ? 0.6 : 0.8) : 2.4;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const s = useGameStore.getState();
    const dt = Math.min(delta, 0.05);
    renderedBirdPosition.copy(group.position);

    const pose = poseRef.current;
    pose.flapId = s.flapsThisRun;
    pose.perched = isPerched;
    // The death tumble spins the bird as it is; the wings hold their last pose.
    pose.frozen = s.isPaused || isDying;

    // A new run teleports the bird, so snap instead of flying across the map.
    if (runIdRef.current !== s.runId) {
      runIdRef.current = s.runId;
      group.position.set(s.position[0], s.position[1], s.position[2]);
      group.rotation.set(0, s.rotation, 0);
      lastRotation.current = s.rotation;
      climb.current = 0;
      turnRate.current = 0;
    }

    // RESET DYING STATE WHEN STARTING A NEW GAME
    if (gameState === 'flight' && dyingTimer.current > 0) {
      dyingTimer.current = 0;
      dyingFallSpeed.current = 0;
      dyingFinalized.current = false;
    }

    // DYING TUMBLE ANIMATION
    if (isDying) {
      if (s.isPaused) return;
      dyingTimer.current += dt;

      // TUMBLE ROTATION — SPIN ON X AND Z AXES
      group.rotation.x += dt * 3;
      group.rotation.z += dt * 2;

      // ACCELERATING FALL (GRAVITY), COMING TO REST ON THE GROUND
      dyingFallSpeed.current += 9.8 * dt;
      group.position.y = Math.max(
        DEATH_REST_HEIGHT,
        group.position.y - dyingFallSpeed.current * dt
      );

      // A perch is only ~2 units up, so the ground arrives in ~0.6 s; hold the
      // sequence long enough for the cat's pounce and the fade to play.
      const grounded = group.position.y <= DEATH_REST_HEIGHT;
      if (
        !dyingFinalized.current &&
        (dyingTimer.current > 2 ||
          (grounded && dyingTimer.current > DEATH_MIN_DURATION))
      ) {
        dyingFinalized.current = true;
        useGameStore.getState().finalizeDeath();
      }
      renderedBirdPosition.copy(group.position);
      return;
    }

    group.scale.setScalar(damp(group.scale.x, targetScale, SCALE_DAMPING, dt));

    _birdTarget.set(s.position[0], s.position[1], s.position[2]);
    group.position.lerp(_birdTarget, 1 - Math.exp(-POSITION_DAMPING * dt));

    group.rotation.y = damp(group.rotation.y, s.rotation, YAW_DAMPING, dt);
    // The outer group only yaws and banks; pitch lives on the inner group.
    group.rotation.x = damp(group.rotation.x, 0, YAW_DAMPING, dt);

    // BANK INTO TURNS FROM THE ACTUAL TURN RATE (NO BANK WHEN PERCHED)
    const rawTurnRate = dt > 0 ? (s.rotation - lastRotation.current) / dt : 0;
    lastRotation.current = s.rotation;
    turnRate.current = damp(
      turnRate.current,
      rawTurnRate,
      TURN_RATE_DAMPING,
      dt
    );
    const bankTarget =
      gameState === 'flight'
        ? -THREE.MathUtils.clamp(turnRate.current / TURN_SPEED, -1, 1) *
          MAX_BANK
        : 0;
    group.rotation.z = damp(group.rotation.z, bankTarget, BANK_DAMPING, dt);

    const bird = birdRef.current;
    if (!bird) return;
    // The perched pose (standing, pecking) comes from the model's own clips.
    climb.current = damp(
      climb.current,
      isPerched ? 0 : s.velocity[1],
      CLIMB_DAMPING,
      dt
    );
    // NOSE UP WHEN CLIMBING, DOWN WHEN DIVING (POSITIVE X DIPS THE NOSE)
    const pitchTarget = isPerched
      ? 0
      : THREE.MathUtils.clamp(
          -Math.atan2(climb.current, Math.max(s.speed, 0.1)),
          -MAX_PITCH,
          MAX_PITCH
        );
    bird.rotation.x = damp(bird.rotation.x, pitchTarget, PITCH_DAMPING, dt);
    bird.rotation.y = damp(bird.rotation.y, 0, POSITION_DAMPING, dt);
  });

  return (
    <>
      <group ref={groupRef}>
        <group ref={birdRef}>
          <GltfBirdModel
            isFlapping={false}
            scale={5}
            speciesId={selectedSpecies}
            poseRef={poseRef}
          />
        </group>
      </group>
      <BumpPuff />
    </>
  );
}

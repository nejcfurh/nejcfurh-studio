'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { cruiseSpeed } from '@/lib/flightPhysics';
import {
  createObstacleHit,
  resolveObstacleCollision
} from '@/lib/terrain/terrainCollision';
import { useGameStore } from '@/store/gameStore';
import {
  BUMP_SHAKE_AMPLITUDE,
  BUMP_SHAKE_DURATION,
  SPEED_MAX_FACTOR
} from '@/utils/constants';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { renderedBirdPosition } from './PlayerBird';

const CHASE_DISTANCE = 10;
const CHASE_HEIGHT = 4;
const LOOK_AHEAD = 8;
const LERP_SPEED = 3; // 1/s

// FOV WIDENS WITH SPEED: BASE AT CRUISE, MAX AT TOP SPEED
const BASE_FOV = 60;
const MAX_FOV = 72;
const FOV_DAMPING = 2.5; // 1/s

// DEATH CAMERA
const DEATH_CHASE_DISTANCE = 18;
const DEATH_CHASE_HEIGHT = 8;

// REUSABLE VECTOR3 — AVOIDS ALLOCATIONS IN THE RENDER LOOP
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _shake = new THREE.Vector3();

/** Frame-rate independent blend factor for a damping rate in 1/s. */
const damping = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

const ARM_STEPS = 12;
const ARM_BISECTIONS = 4;
const ARM_PIVOT_HEIGHT = 1;
// Shorter than this, the camera would sit on the bird; it holds instead.
const ARM_MIN_FRACTION = 0.3;
const _hit = createObstacleHit();
const _pivot = new THREE.Vector3();
const _probe = new THREE.Vector3();

const isBlocked = (p: THREE.Vector3) =>
  resolveObstacleCollision(p.x, p.y, p.z, _hit);

/**
 * Spring arm: the fraction of the bird→camera segment that is clear of houses
 * and trees, with the camera point pulled in to it. Bisects between steps so
 * the camera glides in rather than jumping a whole step per frame.
 */
function pullInFromObstacles(
  bird: readonly [number, number, number],
  camera: THREE.Vector3
): number {
  _pivot.set(bird[0], bird[1] + ARM_PIVOT_HEIGHT, bird[2]);
  let blockedAt = -1;
  for (let i = 1; i <= ARM_STEPS; i++) {
    _probe.lerpVectors(_pivot, camera, i / ARM_STEPS);
    if (isBlocked(_probe)) {
      blockedAt = i;
      break;
    }
  }
  if (blockedAt < 0) return 1;
  let clear = (blockedAt - 1) / ARM_STEPS;
  let blocked = blockedAt / ARM_STEPS;
  for (let k = 0; k < ARM_BISECTIONS; k++) {
    const mid = (clear + blocked) / 2;
    _probe.lerpVectors(_pivot, camera, mid);
    if (isBlocked(_probe)) blocked = mid;
    else clear = mid;
  }
  camera.lerpVectors(_pivot, camera, clear);
  return clear;
}

export default function ThirdPersonCamera() {
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3(0, 15, -10));
  const dyingTimer = useRef(0);
  const { camera } = useThree();

  useFrame((frame, delta) => {
    const {
      position,
      rotation,
      gameState,
      activeFeeder,
      speed,
      selectedSpecies,
      gameTime,
      lastBumpAt
    } = useGameStore.getState();
    const dt = Math.min(delta, 0.05);

    const sinR = Math.sin(rotation);
    const cosR = Math.cos(rotation);

    // RESET DYING TIMER WHEN RETURNING TO FLIGHT
    if (gameState === 'flight' && dyingTimer.current > 0) {
      dyingTimer.current = 0;
    }

    if (gameState === 'dying') {
      dyingTimer.current += dt;
      const t = Math.min(dyingTimer.current / 2, 1); // 0 TO 1 OVER 2 SECONDS

      // INTERPOLATE CHASE DISTANCE AND HEIGHT
      const dist = CHASE_DISTANCE + (DEATH_CHASE_DISTANCE - CHASE_DISTANCE) * t;
      const height = CHASE_HEIGHT + (DEATH_CHASE_HEIGHT - CHASE_HEIGHT) * t;

      // The store position froze at the moment of death; the model keeps falling.
      const fallY = renderedBirdPosition.y;
      _targetPos.set(
        position[0] - sinR * dist,
        fallY + height,
        position[2] - cosR * dist
      );
      // SLOWER LERP FOR CINEMATIC FEEL
      cameraPosition.current.lerp(_targetPos, damping(LERP_SPEED * 0.4, dt));

      // LOOK AT THE FALLING BIRD
      _targetLook.set(position[0], fallY, position[2]);
      cameraTarget.current.lerp(_targetLook, damping(LERP_SPEED * 0.6, dt));
    } else if (
      (gameState === 'feeding' || gameState === 'drinking') &&
      activeFeeder
    ) {
      // FIXED 45-DEGREE DIAGONAL VIEW — AVOIDS CLIPPING THROUGH FEEDER PLANES
      const fx = activeFeeder.position[0];
      const fy = activeFeeder.position[1];
      const fz = activeFeeder.position[2];

      if (activeFeeder.type === 'feeder') {
        // DIAGONAL FRONT-RIGHT, ELEVATED ABOVE TRAY LEVEL
        _targetPos.set(fx + 2.2, fy + 3.0, fz + 2.2);
        // LOOK AT TRAY AREA (NOT THE BIRD — FIXED POINT)
        _targetLook.set(fx, fy + 1.7, fz + 0.5);
      } else {
        // DIAGONAL FRONT-RIGHT OF BASIN — FURTHER BACK FOR BETTER VIEW
        _targetPos.set(fx + 3.5, fy + 4.0, fz + 3.5);
        // LOOK AT BASIN RIM AREA
        _targetLook.set(fx, fy + 2.2, fz);
      }

      cameraPosition.current.lerp(_targetPos, damping(LERP_SPEED * 0.5, dt));
      cameraTarget.current.lerp(_targetLook, damping(LERP_SPEED, dt));
    } else {
      // CHASE CAMERA BEHIND THE BIRD
      _targetPos.set(
        position[0] - sinR * CHASE_DISTANCE,
        position[1] + CHASE_HEIGHT,
        position[2] - cosR * CHASE_DISTANCE
      );
      // Right after a wall bounce the bird faces away from the wall and the
      // arm behind it is blocked: hold the camera on the open side and watch
      // the bird until it has flown far enough for the arm to clear.
      const armClear = pullInFromObstacles(position, _targetPos);
      const holding = armClear < ARM_MIN_FRACTION;
      if (!holding) {
        cameraPosition.current.lerp(_targetPos, damping(LERP_SPEED, dt));
      }
      pullInFromObstacles(position, cameraPosition.current);

      // LOOK AHEAD OF BIRD IN ITS FLIGHT DIRECTION, OR AT IT WHILE HOLDING
      const lookAhead = holding ? 0 : LOOK_AHEAD;
      _targetLook.set(
        position[0] + sinR * lookAhead,
        position[1],
        position[2] + cosR * lookAhead
      );
      cameraTarget.current.lerp(_targetLook, damping(LERP_SPEED, dt));
    }

    camera.position.copy(cameraPosition.current);
    const sinceBump = gameTime - lastBumpAt;
    if (gameState === 'flight' && sinceBump < BUMP_SHAKE_DURATION) {
      // Decaying sines at unrelated rates, so the jolt has no visible rhythm.
      const amp = BUMP_SHAKE_AMPLITUDE * (1 - sinceBump / BUMP_SHAKE_DURATION);
      camera.position.add(
        _shake.set(
          amp * Math.sin(sinceBump * 97),
          amp * Math.sin(sinceBump * 71 + 1.3),
          amp * Math.sin(sinceBump * 83 + 2.1)
        )
      );
    }
    camera.lookAt(cameraTarget.current);

    const lens = frame.camera;
    if (lens instanceof THREE.PerspectiveCamera) {
      const cruise = cruiseSpeed(BIRD_SPECIES[selectedSpecies].attributes);
      const rush =
        gameState === 'flight'
          ? THREE.MathUtils.clamp(
              (speed - cruise) / (cruise * (SPEED_MAX_FACTOR - 1)),
              0,
              1
            )
          : 0;
      const fov = THREE.MathUtils.lerp(
        lens.fov,
        BASE_FOV + (MAX_FOV - BASE_FOV) * rush,
        damping(FOV_DAMPING, dt)
      );
      if (Math.abs(fov - lens.fov) > 0.01) {
        lens.fov = fov;
        lens.updateProjectionMatrix();
      }
    }
  });

  return null;
}

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import GltfBirdModel from './GltfBirdModel';
import * as THREE from 'three';

// REUSABLE VECTOR3 FOR POSITION LERP — AVOIDS ALLOCATION PER FRAME
const _birdTarget = new THREE.Vector3();

export default function PlayerBird() {
  const groupRef = useRef<THREE.Group>(null);
  const birdRef = useRef<THREE.Group>(null);
  const dyingTimer = useRef(0);
  const dyingFallSpeed = useRef(0);
  const dyingFinalized = useRef(false);

  const position = useGameStore(s => s.position);
  const rotation = useGameStore(s => s.rotation);
  const isFlapping = useGameStore(s => s.isFlapping);
  const selectedSpecies = useGameStore(s => s.selectedSpecies);
  const gameState = useGameStore(s => s.gameState);

  const isPerched = gameState === 'feeding' || gameState === 'drinking';
  const isDying = gameState === 'dying';

  // BIRD SCALE: SMALL WHEN PERCHED, LARGER IN FLIGHT FOR VISIBILITY
  // GltfBirdModel HAS BASE SCALE=5, OUTER GROUP MULTIPLIES ON TOP
  const targetScale = isPerched ? (gameState === 'feeding' ? 0.6 : 0.8) : 2.4;

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // RESET DYING STATE WHEN STARTING A NEW GAME
    if (gameState === 'flight' && dyingTimer.current > 0) {
      dyingTimer.current = 0;
      dyingFallSpeed.current = 0;
      dyingFinalized.current = false;
    }

    // DYING TUMBLE ANIMATION
    if (isDying) {
      dyingTimer.current += delta;

      // TUMBLE ROTATION — SPIN ON X AND Z AXES
      groupRef.current.rotation.x += delta * 3;
      groupRef.current.rotation.z += delta * 2;

      // ACCELERATING FALL (GRAVITY)
      dyingFallSpeed.current += 9.8 * delta;
      groupRef.current.position.y -= dyingFallSpeed.current * delta;

      // TRANSITION AFTER 2S OR GROUND HIT
      if (
        !dyingFinalized.current &&
        (dyingTimer.current > 2 || groupRef.current.position.y < 0.5)
      ) {
        dyingFinalized.current = true;
        useGameStore.getState().finalizeDeath();
      }
      return;
    }

    // SMOOTH SCALE TRANSITION
    const curScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(curScale, targetScale, 0.08);
    groupRef.current.scale.setScalar(newScale);

    // SMOOTH POSITION INTERPOLATION
    _birdTarget.set(position[0], position[1], position[2]);
    groupRef.current.position.lerp(_birdTarget, 0.15);

    // ROTATE BIRD TO FACE DIRECTION OF TRAVEL
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation,
      0.1,
    );

    // KEEP BIRD LEVEL — NO PITCH ROTATION ON FLAP
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0,
      0.1,
    );

    // SUBTLE BANK ON TURNS ONLY (NO BANK WHEN PERCHED)
    const bankTarget =
      gameState === 'flight'
        ? -Math.sin(rotation - groupRef.current.rotation.y) * 0.15
        : 0;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      bankTarget,
      0.08,
    );

    // PERCHED PECKING/BOBBING ANIMATION
    if (birdRef.current) {
      if (isPerched) {
        const t = clock.getElapsedTime();
        // HEAD-BOB: QUICK DIP DOWN THEN BACK UP, REPEATING
        const bobCycle = (t * 2.5) % 1; // 2.5 bobs per second
        const dip =
          bobCycle < 0.3 ? Math.sin((bobCycle / 0.3) * Math.PI) * 0.15 : 0;
        birdRef.current.rotation.x = THREE.MathUtils.lerp(
          birdRef.current.rotation.x,
          dip,
          0.25,
        );
        // SLIGHT SIDE-TO-SIDE LOOK BETWEEN BOBS
        const look = Math.sin(t * 0.8) * 0.1;
        birdRef.current.rotation.y = THREE.MathUtils.lerp(
          birdRef.current.rotation.y,
          look,
          0.1,
        );
      } else {
        birdRef.current.rotation.x = THREE.MathUtils.lerp(
          birdRef.current.rotation.x,
          0,
          0.15,
        );
        birdRef.current.rotation.y = THREE.MathUtils.lerp(
          birdRef.current.rotation.y,
          0,
          0.15,
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <group ref={birdRef}>
        <GltfBirdModel
          isFlapping={isDying ? false : isFlapping}
          isPerched={isPerched}
          scale={5}
          speciesId={selectedSpecies}
        />
      </group>
    </group>
  );
}

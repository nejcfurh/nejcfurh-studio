'use client';

import {
  CAT_STALK_YAW,
  catPerchPosition,
  catStalkPosition
} from '@/components/scene/effects/catPlacement';
import { CatModel } from '@/components/scene/Feeder';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

const CROUCH_TIME = 0.12;
const LEAP_TIME = 0.28;
const LEAP_ARC = 0.6;

const POUNCE_START = catStalkPosition(1, new THREE.Vector3()).toArray();
const _from = new THREE.Vector3();
const _to = new THREE.Vector3();

export default function DeathCat() {
  const gameState = useGameStore((s) => s.gameState);
  const deathReason = useGameStore((s) => s.deathReason);
  const activeFeeder = useGameStore((s) => s.activeFeeder);

  // ONLY SHOW WHEN DYING FROM CAT
  if (gameState !== 'dying' || deathReason !== 'cat' || !activeFeeder)
    return null;

  return (
    <group position={activeFeeder.position}>
      {/* OWN BOUNDARY: THIS COMPONENT SITS OUTSIDE THE SCENE'S SUSPENSE */}
      <Suspense fallback={null}>
        <PouncingCat type={activeFeeder.type} />
      </Suspense>
    </group>
  );
}

// Mounts when the death starts: crouch at the pole, leap onto the perch, sway.
function PouncingCat({ type }: { type: FeederData['type'] }) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;

    catStalkPosition(1, _from);
    catPerchPosition(type, _to);
    group.rotation.y = CAT_STALK_YAW;

    if (t < CROUCH_TIME) {
      const k = t / CROUCH_TIME;
      group.position.copy(_from);
      group.scale.set(1.06, 0.72 - 0.08 * k, 1.1);
      group.rotation.z = 0;
      return;
    }

    const k = Math.min((t - CROUCH_TIME) / LEAP_TIME, 1);
    group.position.lerpVectors(_from, _to, k);
    group.position.y += 4 * k * (1 - k) * LEAP_ARC;
    // Stretched mid-air, squashed on landing, then settles.
    const stretch = Math.sin(k * Math.PI);
    const settle = k < 1 ? 0 : Math.exp(-(t - CROUCH_TIME - LEAP_TIME) * 10);
    group.scale.set(
      1 - 0.06 * stretch + 0.06 * settle,
      1 + 0.12 * stretch - 0.15 * settle,
      1 + 0.15 * stretch
    );
    group.rotation.z = k < 1 ? 0 : Math.sin(clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <group ref={groupRef} position={POUNCE_START} rotation-y={CAT_STALK_YAW}>
      <CatModel />
    </group>
  );
}

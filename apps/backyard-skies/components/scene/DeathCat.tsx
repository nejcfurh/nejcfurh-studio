'use client';

import {
  CAT_POUNCE_END,
  CAT_POUNCE_LAND,
  CAT_POUNCE_TAKEOFF,
  CAT_STALK_YAW,
  catPerchPosition,
  catStalkPosition
} from '@/components/scene/effects/catPlacement';
import { CatAnimator, CatModel } from '@/components/scene/Feeder';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

const LEAP_ARC = 0.5;
const SETTLE_FADE = 0.3;

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

// Mounts when the death starts. The pounce clip animates the body in place;
// this moves the cat along the leap arc between the clip's takeoff and landing
// frames, so it lands on the perch where the bird was.
function PouncingCat({ type }: { type: FeederData['type'] }) {
  const groupRef = useRef<THREE.Group>(null);
  const animatorRef = useRef<CatAnimator | null>(null);
  const elapsed = useRef(-1);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const animator = animatorRef.current;
    if (!group || !animator || useGameStore.getState().isPaused) return;

    // The mixer advances in CatModel's own frame callback; starting the clip
    // here at t=0 keeps both clocks on the same frames.
    if (elapsed.current < 0) {
      animator.play('pounce', 0);
      animator.update(0);
      elapsed.current = 0;
    } else {
      elapsed.current += Math.min(delta, 0.05);
    }
    const t = elapsed.current;

    catStalkPosition(1, _from);
    catPerchPosition(type, _to);
    const jumpYaw = Math.atan2(_to.x - _from.x, _to.z - _from.z);
    group.rotation.y = THREE.MathUtils.lerp(
      CAT_STALK_YAW,
      jumpYaw,
      THREE.MathUtils.smoothstep(t, 0, CAT_POUNCE_TAKEOFF)
    );

    const k = THREE.MathUtils.clamp(
      (t - CAT_POUNCE_TAKEOFF) / (CAT_POUNCE_LAND - CAT_POUNCE_TAKEOFF),
      0,
      1
    );
    group.position.lerpVectors(_from, _to, k);
    group.position.y += 4 * k * (1 - k) * LEAP_ARC;

    if (t >= CAT_POUNCE_END) animator.play('idle', SETTLE_FADE);
  });

  return (
    <group ref={groupRef} position={POUNCE_START} rotation-y={CAT_STALK_YAW}>
      <CatModel animatorRef={animatorRef} frustumCulled={false} />
    </group>
  );
}

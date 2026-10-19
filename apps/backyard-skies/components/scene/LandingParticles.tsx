'use client';

import {
  ParticleLook,
  ParticlePool
} from '@/components/scene/effects/particlePool';
import { birdBeakTip, birdPecks } from '@/components/scene/GltfBirdModel';
import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// One pool serves the landing burst and the crumbs or droplets while eating.
const POOL_SIZE = 32;
const LANDING_COUNT = 12;

const LANDING: ParticleLook = { lifetime: 0.5, size: 0.08, gravity: 8 };
const CRUMB: ParticleLook = { lifetime: 0.9, size: 0.045, gravity: 6 };
const DROPLET: ParticleLook = { lifetime: 0.6, size: 0.035, gravity: 7 };

const SEED_COLORS = ['#8B6914', '#C9A66B', '#E3CF9A'].map(
  (c) => new THREE.Color(c)
);
const WATER_COLORS = ['#4A90D9', '#9AD2F5', '#D8F0FF'].map(
  (c) => new THREE.Color(c)
);

const _position = new THREE.Vector3();
const _velocity = new THREE.Vector3();

export default function LandingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const pool = useMemo(() => new ParticlePool(POOL_SIZE), []);
  const prevGameState = useRef('');
  const lastPeck = useRef(birdPecks.count);

  useEffect(() => {
    if (meshRef.current) pool.init(meshRef.current, SEED_COLORS[0]);
  }, [pool]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = useGameStore.getState();
    const perched = s.gameState === 'feeding' || s.gameState === 'drinking';
    const isWater = s.gameState === 'drinking';
    const palette = isWater ? WATER_COLORS : SEED_COLORS;
    const [px, py, pz] = s.position;

    if (perched && prevGameState.current === 'flight') {
      for (let i = 0; i < LANDING_COUNT; i++) {
        pool.spawn(mesh, {
          position: _position.set(
            px + (Math.random() - 0.5) * 0.3,
            py,
            pz + (Math.random() - 0.5) * 0.3
          ),
          velocity: _velocity.set(
            (Math.random() - 0.5) * 2,
            Math.random() * 3 + 1,
            (Math.random() - 0.5) * 2
          ),
          look: LANDING,
          color: palette[i % palette.length]
        });
      }
    }
    prevGameState.current = s.gameState;

    // One burst each time the beak strikes the tray in the bird's peck clip.
    const peck = birdPecks.count;
    if (perched && !s.isPaused && peck !== lastPeck.current) {
      const count = isWater ? 1 : 2;
      for (let i = 0; i < count; i++) {
        pool.spawn(mesh, {
          position: _position.set(
            birdBeakTip.x + (Math.random() - 0.5) * 0.06,
            birdBeakTip.y,
            birdBeakTip.z + (Math.random() - 0.5) * 0.06
          ),
          velocity: _velocity.set(
            (Math.random() - 0.5) * 2,
            isWater ? 1.4 + Math.random() * 0.8 : 0.9 + Math.random() * 0.9,
            (Math.random() - 0.5) * 2
          ),
          look: isWater ? DROPLET : CRUMB,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }
    lastPeck.current = peck;

    if (!s.isPaused) pool.update(mesh, delta);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, POOL_SIZE]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial transparent opacity={0.85} />
    </instancedMesh>
  );
}

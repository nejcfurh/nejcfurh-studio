'use client';

import {
  ParticleLook,
  ParticlePool
} from '@/components/scene/effects/particlePool';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { useGameStore } from '@/store/gameStore';
import { BIRD_COLLISION_OFFSET_Y } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const PUFF_COUNT = 10;
const PUFF: ParticleLook = { lifetime: 0.6, size: 0.12, gravity: 3 };

const _position = new THREE.Vector3();
const _velocity = new THREE.Vector3();
const _color = new THREE.Color();

/** A few feathers knocked loose where the bird bumps into a house or tree. */
export function BumpPuff() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const pool = useMemo(() => new ParticlePool(PUFF_COUNT), []);
  const seenBumps = useRef(0);
  const runId = useRef(-1);
  const sincePuff = useRef(Infinity);

  useEffect(() => {
    if (meshRef.current) pool.init(meshRef.current, _color.set('#ffffff'));
  }, [pool]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = useGameStore.getState();

    if (runId.current !== s.runId) {
      runId.current = s.runId;
      seenBumps.current = s.bumpCount;
    }
    if (s.bumpCount > seenBumps.current) {
      seenBumps.current = s.bumpCount;
      const { colors } = BIRD_SPECIES[s.selectedSpecies];
      const palette = [colors.body, colors.wing, colors.belly, colors.tail];
      const [px, py, pz] = s.position;
      for (let i = 0; i < PUFF_COUNT; i++) {
        pool.spawn(mesh, {
          position: _position.set(
            px + (Math.random() - 0.5) * 0.4,
            py + BIRD_COLLISION_OFFSET_Y + (Math.random() - 0.5) * 0.4,
            pz + (Math.random() - 0.5) * 0.4
          ),
          velocity: _velocity.set(
            (Math.random() - 0.5) * 4,
            Math.random() * 2 + 0.5,
            (Math.random() - 0.5) * 4
          ),
          look: PUFF,
          color: _color.set(palette[i % palette.length])
        });
      }
      sincePuff.current = 0;
    }

    // Hidden between puffs so it costs no draw call.
    mesh.visible = sincePuff.current <= PUFF.lifetime;
    if (!mesh.visible || s.isPaused) return;
    sincePuff.current += delta;
    pool.update(mesh, delta);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PUFF_COUNT]}
      frustumCulled={false}
      visible={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial transparent opacity={0.9} />
    </instancedMesh>
  );
}

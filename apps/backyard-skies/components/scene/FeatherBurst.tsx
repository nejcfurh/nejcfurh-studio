'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { BIRD_SPECIES } from '@/lib/birdSpecies';
import * as THREE from 'three';

const FEATHER_COUNT = 25;
const FEATHER_LIFETIME = 1.5;

interface Feather {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  age: number;
  alive: boolean;
}

export default function FeatherBurst() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const feathersRef = useRef<Feather[]>([]);
  const activeRef = useRef(false);
  const prevGameState = useRef('');
  const matrixHelper = useMemo(() => new THREE.Matrix4(), []);
  const quaternionHelper = useMemo(() => new THREE.Quaternion(), []);
  const eulerHelper = useMemo(() => new THREE.Euler(), []);
  const colorRef = useRef(new THREE.Color('#C41E3A'));

  // WATCH FOR DYING TRANSITION
  useEffect(() => {
    const unsub = useGameStore.subscribe(state => {
      if (state.gameState === 'dying' && prevGameState.current !== 'dying') {
        // TRIGGER BURST
        const pos = state.position;
        const species = BIRD_SPECIES[state.selectedSpecies];
        colorRef.current.set(species.colors.body);

        feathersRef.current = Array.from({ length: FEATHER_COUNT }, () => ({
          position: new THREE.Vector3(
            pos[0] + (Math.random() - 0.5) * 0.5,
            pos[1] + (Math.random() - 0.5) * 0.5,
            pos[2] + (Math.random() - 0.5) * 0.5,
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            Math.random() * 4 + 1,
            (Math.random() - 0.5) * 6,
          ),
          rotation: new THREE.Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
          ),
          rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4,
          ),
          age: 0,
          alive: true,
        }));
        activeRef.current = true;
      }
      prevGameState.current = state.gameState;
    });
    return unsub;
  }, []);

  useFrame((_, delta) => {
    if (!activeRef.current || !meshRef.current) return;

    let anyAlive = false;
    const feathers = feathersRef.current;

    for (let i = 0; i < feathers.length; i++) {
      const f = feathers[i];
      if (!f.alive) {
        matrixHelper.makeScale(0, 0, 0);
        meshRef.current.setMatrixAt(i, matrixHelper);
        continue;
      }

      f.age += delta;
      if (f.age > FEATHER_LIFETIME) {
        f.alive = false;
        matrixHelper.makeScale(0, 0, 0);
        meshRef.current.setMatrixAt(i, matrixHelper);
        continue;
      }

      anyAlive = true;

      // PHYSICS
      f.velocity.y -= 4 * delta; // GENTLE GRAVITY
      f.position.addScaledVector(f.velocity, delta);
      f.velocity.multiplyScalar(0.98); // AIR DRAG

      // SPIN
      f.rotation.x += f.rotationSpeed.x * delta;
      f.rotation.y += f.rotationSpeed.y * delta;
      f.rotation.z += f.rotationSpeed.z * delta;

      // Fade out via scale
      const life = 1 - f.age / FEATHER_LIFETIME;
      const scale = life * 0.15;

      eulerHelper.copy(f.rotation);
      quaternionHelper.setFromEuler(eulerHelper);
      matrixHelper.compose(
        f.position,
        quaternionHelper,
        new THREE.Vector3(scale, scale * 0.3, scale),
      );
      meshRef.current.setMatrixAt(i, matrixHelper);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (!anyAlive) {
      activeRef.current = false;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, FEATHER_COUNT]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        // eslint-disable-next-line react-hooks/refs
        color={colorRef.current}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

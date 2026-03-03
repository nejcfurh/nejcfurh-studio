'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

const PARTICLE_COUNT = 12;
const PARTICLE_LIFETIME = 0.5;

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  alive: boolean;
}

export default function LandingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const activeRef = useRef(false);
  const prevGameState = useRef('');
  const matrixHelper = useMemo(() => new THREE.Matrix4(), []);
  const colorRef = useRef(new THREE.Color('#8B6914'));

  // WATCH FOR LANDING TRANSITIONS
  useEffect(() => {
    const unsub = useGameStore.subscribe(state => {
      const isLanding =
        state.gameState === 'feeding' || state.gameState === 'drinking';
      const wasFlying = prevGameState.current === 'flight';

      if (isLanding && wasFlying) {
        const pos = state.position;
        const isWater = state.gameState === 'drinking';

        // SET COLOR BASED ON TYPE
        colorRef.current.set(isWater ? '#4A90D9' : '#8B6914');

        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
          position: new THREE.Vector3(
            pos[0] + (Math.random() - 0.5) * 0.3,
            pos[1],
            pos[2] + (Math.random() - 0.5) * 0.3,
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            Math.random() * 3 + 1,
            (Math.random() - 0.5) * 2,
          ),
          age: 0,
          alive: true,
        }));
        activeRef.current = true;

        // UPDATE MATERIAL COLOR
        if (meshRef.current) {
          const mat = meshRef.current.material as THREE.MeshBasicMaterial;
          mat.color.copy(colorRef.current);
        }
      }

      prevGameState.current = state.gameState;
    });
    return unsub;
  }, []);

  useFrame((_, delta) => {
    if (!activeRef.current || !meshRef.current) return;

    let anyAlive = false;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p.alive) {
        matrixHelper.makeScale(0, 0, 0);
        meshRef.current.setMatrixAt(i, matrixHelper);
        continue;
      }

      p.age += delta;
      if (p.age > PARTICLE_LIFETIME) {
        p.alive = false;
        matrixHelper.makeScale(0, 0, 0);
        meshRef.current.setMatrixAt(i, matrixHelper);
        continue;
      }

      anyAlive = true;

      // PHYSICS
      p.velocity.y -= 8 * delta; // gravity
      p.position.addScaledVector(p.velocity, delta);

      // FADE OUT VIA SCALE
      const life = 1 - p.age / PARTICLE_LIFETIME;
      const scale = life * 0.08;

      matrixHelper.makeTranslation(p.position.x, p.position.y, p.position.z);
      matrixHelper.scale(new THREE.Vector3(scale, scale, scale));
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
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        // eslint-disable-next-line react-hooks/refs
        color={colorRef.current}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

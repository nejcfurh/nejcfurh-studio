'use client';

import { BIRD_SPECIES } from '@/lib/birdSpecies';
import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FEATHER_COUNT = 25;
const FEATHER_LIFETIME = 1.5;
const FEATHER_OPACITY = 0.9;

interface Feather {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
}

const _matrix = new THREE.Matrix4();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();
const ZERO_SCALE = new THREE.Matrix4().makeScale(0, 0, 0);

export default function FeatherBurst() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const feathersRef = useRef<Feather[]>([]);
  const age = useRef(-1);
  const prevGameState = useRef('');
  const warmupFrames = useRef(2);

  // Creates the colour attribute up front so the burst does not recompile.
  useEffect(() => {
    feathersRef.current = Array.from({ length: FEATHER_COUNT }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      rotationSpeed: new THREE.Vector3()
    }));
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < FEATHER_COUNT; i++) {
      mesh.setMatrixAt(i, ZERO_SCALE);
      mesh.setColorAt(i, _color.set('#ffffff'));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = useGameStore.getState();
    const feathers = feathersRef.current;

    if (s.gameState === 'dying' && prevGameState.current !== 'dying') {
      // Feathers take the species' own plumage colours.
      const { colors } = BIRD_SPECIES[s.selectedSpecies];
      const palette = [colors.body, colors.wing, colors.belly, colors.tail];
      const [px, py, pz] = s.position;
      feathers.forEach((f, i) => {
        f.position.set(
          px + (Math.random() - 0.5) * 0.5,
          py + (Math.random() - 0.5) * 0.5,
          pz + (Math.random() - 0.5) * 0.5
        );
        f.velocity.set(
          (Math.random() - 0.5) * 6,
          Math.random() * 4 + 1,
          (Math.random() - 0.5) * 6
        );
        f.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        f.rotationSpeed.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4
        );
        mesh.setColorAt(i, _color.set(palette[i % palette.length]));
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      age.current = 0;
      mesh.visible = true;
    }
    prevGameState.current = s.gameState;

    if (age.current < 0) {
      // Drawn (invisibly) for the first frames so its shader is compiled
      // before the death, then hidden until a burst.
      if (warmupFrames.current > 0) warmupFrames.current--;
      else mesh.visible = false;
      return;
    }
    age.current += delta;
    if (age.current > FEATHER_LIFETIME) {
      age.current = -1;
      mesh.visible = false;
      return;
    }

    // Every feather is born together, so one material opacity fades them all.
    const life = 1 - age.current / FEATHER_LIFETIME;
    material.opacity =
      FEATHER_OPACITY * THREE.MathUtils.smoothstep(life, 0, 0.5);
    const size = 0.15 * (0.6 + 0.4 * life);

    for (let i = 0; i < feathers.length; i++) {
      const f = feathers[i];
      f.velocity.y -= 4 * delta; // GENTLE GRAVITY
      f.position.addScaledVector(f.velocity, delta);
      f.velocity.multiplyScalar(Math.exp(-1.2 * delta)); // AIR DRAG

      f.rotation.x += f.rotationSpeed.x * delta;
      f.rotation.y += f.rotationSpeed.y * delta;
      f.rotation.z += f.rotationSpeed.z * delta;

      _quaternion.setFromEuler(f.rotation);
      _matrix.compose(
        f.position,
        _quaternion,
        _scale.set(size, size * 0.3, size)
      );
      mesh.setMatrixAt(i, _matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, FEATHER_COUNT]}
      frustumCulled={false}
      castShadow={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        opacity={FEATHER_OPACITY}
      />
    </instancedMesh>
  );
}

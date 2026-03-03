'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GameEnvironment() {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const t = clock.getElapsedTime() * 0.01;
      sunRef.current.position.x = Math.sin(t) * 50;
      sunRef.current.position.z = Math.cos(t) * 50;
    }
  });

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 40, 100]} />

      <ambientLight intensity={0.5} color="#FFF8E1" />

      <directionalLight
        ref={sunRef}
        position={[30, 40, 20]}
        intensity={1.5}
        color="#FFF5E6"
      />

      <hemisphereLight args={['#87CEEB', '#4A7C59', 0.4]} />
    </>
  );
}

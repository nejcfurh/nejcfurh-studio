'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

export default function DeathCat() {
  const groupRef = useRef<THREE.Group>(null);
  const gameState = useGameStore(s => s.gameState);
  const deathReason = useGameStore(s => s.deathReason);
  const activeFeeder = useGameStore(s => s.activeFeeder);

  // ONLY SHOW WHEN DYING FROM CAT
  if (gameState !== 'dying' || deathReason !== 'cat' || !activeFeeder)
    return null;

  const fx = activeFeeder.position[0];
  const fy = activeFeeder.position[1];
  const fz = activeFeeder.position[2];

  // POSITION CAT ON THE FEEDER STRUCTURE, NEAR WHERE THE BIRD WAS PERCHED
  const catY = activeFeeder.type === 'feeder' ? fy + 1.6 : fy + 2.1;
  const catZ = fz + 0.5;

  return (
    <group
      ref={groupRef}
      position={[fx, catY, catZ]}
      rotation={[0, Math.PI * 0.8, 0]}
    >
      <CatModel />
    </group>
  );
}

function CatModel() {
  const groupRef = useRef<THREE.Group>(null);

  // SUBTLE IDLE SWAY
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;
  });

  return (
    <group ref={groupRef} scale={0.55}>
      {/* BODY - ELONGATED SITTING POSE */}
      <mesh position={[0, 0.35, 0]}>
        <capsuleGeometry args={[0.28, 0.3, 6, 10]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>

      {/* HEAD */}
      <mesh position={[0, 0.75, 0.25]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>

      {/* SNOUT */}
      <mesh position={[0, 0.7, 0.44]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>

      {/* EARS */}
      <mesh position={[0.12, 0.96, 0.22]} rotation={[0.2, 0, 0.25]}>
        <coneGeometry args={[0.07, 0.14, 4]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>
      <mesh position={[-0.12, 0.96, 0.22]} rotation={[0.2, 0, -0.25]}>
        <coneGeometry args={[0.07, 0.14, 4]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>

      {/* INNER EARS */}
      <mesh position={[0.12, 0.93, 0.24]} rotation={[0.3, 0, 0.25]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color="#D4837A" roughness={0.9} />
      </mesh>
      <mesh position={[-0.12, 0.93, 0.24]} rotation={[0.3, 0, -0.25]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color="#D4837A" roughness={0.9} />
      </mesh>

      {/* EYES - GLOWING */}
      <mesh position={[0.08, 0.78, 0.43]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial
          color="#CCFF00"
          emissive="#AADD00"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[-0.08, 0.78, 0.43]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial
          color="#CCFF00"
          emissive="#AADD00"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* PUPILS */}
      <mesh position={[0.08, 0.78, 0.465]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.08, 0.78, 0.465]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* FRONT LEGS */}
      <mesh position={[0.12, 0.12, 0.15]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>
      <mesh position={[-0.12, 0.12, 0.15]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>

      {/* TAIL - CURVING UPWARD */}
      <mesh position={[0, 0.5, -0.35]} rotation={[0.8, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.4, 4, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.85, -0.5]} rotation={[1.4, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.2, 4, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.85} />
      </mesh>
    </group>
  );
}

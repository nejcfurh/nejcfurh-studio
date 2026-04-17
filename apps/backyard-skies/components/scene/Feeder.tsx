'use client';

import { FbxModel } from '@/components/scene/FbxModel';
import { ObjMtlModel } from '@/components/scene/ObjMtlModel';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const dangerGlowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color('#FF3D00') },
    uTime: { value: 0 }
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
      float glow = pow(fresnel, 3.0);
      float pulse = 0.7 + 0.3 * sin(uTime * 3.0);
      float alpha = glow * 0.55 * pulse;
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.FrontSide
});

interface FeederProps {
  data: FeederData;
}

export default function Feeder({ data }: FeederProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Group>(null);
  const position = useGameStore((s) => s.position);
  const [isLocked, setIsLocked] = useState(false);
  const prevLockedRef = useRef(false);

  const glowMat = useMemo(() => {
    const mat = dangerGlowMaterial.clone();
    mat.uniforms.uColor.value = new THREE.Color(
      data.hasCat ? '#FF3D00' : '#FF9800'
    );
    return mat;
  }, [data.hasCat]);

  useFrame(({ clock }) => {
    const now = Date.now();
    const newLocked = !!(data.lockedUntil && data.lockedUntil > now);
    if (newLocked !== prevLockedRef.current) {
      prevLockedRef.current = newLocked;
      setIsLocked(newLocked);
    }

    // Drive shader uniforms
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.getElapsedTime();
      mat.uniforms.uColor.value.set(isLocked ? '#FF9800' : '#FF3D00');
    }

    if (markerRef.current) {
      markerRef.current.position.y =
        5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      markerRef.current.rotation.y += 0.02;
    }
  });

  const isBirdbath = data.type === 'birdbath';

  // CALCULATE DISTANCE TO PLAYER FOR MARKER VISIBILITY
  const dx = position[0] - data.position[0];
  const dz = position[2] - data.position[2];
  const dist = Math.sqrt(dx * dx + dz * dz);
  const showMarker = dist < 40 && !isLocked;

  return (
    <group position={data.position}>
      {isBirdbath ? <BirdbuddyBath /> : <BirdbuddyFeeder />}

      {/* DANGER GLOW — FRESNEL GRADIENT AURA */}
      {(data.hasCat || isLocked) && (
        <mesh ref={glowRef} position={[0, 1.5, 0]} material={glowMat}>
          <sphereGeometry args={[3.5, 24, 16]} />
        </mesh>
      )}

      {/* FLOATING MARKER (HIDDEN WHEN LOCKED) */}
      {showMarker && (
        <group ref={markerRef} position={[0, 5, 0]}>
          <mesh>
            <octahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color={isBirdbath ? '#00AEEF' : '#4CAF50'}
              emissive={isBirdbath ? '#00AEEF' : '#4CAF50'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}

      {/* LOCKED INDICATOR */}
      {isLocked && showMarker && (
        <group position={[0, 6, 0]}>
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#FF9800"
              emissive="#FF9800"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* CAT 3D MODEL FOR DANGEROUS FEEDERS */}
      {data.hasCat && (
        <ObjMtlModel
          baseUrl="/models/mycat/model"
          scale={0.03}
          position={[2.5, 0, 1.5]}
          rotation={[1.5, -3.15, -3]}
        />
      )}
    </group>
  );
}

// BIRDBUDDY-STYLE SMART FEEDER — FBX MODEL ON POLE
export function BirdbuddyFeeder() {
  return (
    <group>
      {/* GRAY BASE DISC */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.1, 12]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.8} />
      </mesh>
      {/* POLE */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.3} />
      </mesh>
      <FbxModel
        url="/models/feeders/Bird_Buddy_stylized_house_final.fbx"
        scale={0.0045}
        position={[0, 2.5, 0]}
        playAnimations={false}
      />
      <SeedsTray position={[0, 2.25, 0.02]} />
    </group>
  );
}

function SeedsTray({ position }: { position: [number, number, number] }) {
  const texture = useTexture('/models/feeders/BB_Feeder_seeds_V1.png');
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.8, 0.5]} />
      <meshStandardMaterial map={texture} transparent roughness={0.8} />
    </mesh>
  );
}

// BIRDBUDDY-STYLE BIRDBATH — FBX MODEL ON POLE
export function BirdbuddyBath() {
  return (
    <group>
      {/* GRAY BASE DISC */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.1, 12]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.8} />
      </mesh>
      {/* POLE */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.3} />
      </mesh>
      <FbxModel
        url="/models/feeders/Birdbath_V1.fbx"
        scale={0.0045}
        position={[0, 2.5, 0]}
        playAnimations={false}
      />
      <WaterSurface position={[0, 2.35, 0.08]} />
    </group>
  );
}

function WaterSurface({ position }: { position: [number, number, number] }) {
  const texture = useTexture('/models/feeders/BirdBathTexture.png');
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.78, 32]} />
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.05}
        metalness={0.4}
        opacity={0.9}
      />
    </mesh>
  );
}

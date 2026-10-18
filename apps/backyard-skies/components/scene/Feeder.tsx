'use client';

import {
  CAT_STALK_YAW,
  catStalkPosition
} from '@/components/scene/effects/catPlacement';
import { createWaterMaterial } from '@/components/scene/effects/waterMaterial';
import {
  BIRDBATH_MODEL,
  CAT_MODEL,
  FEEDER_MODEL,
  GLOSSY_SHADING,
  MATTE_SHADING,
  SEEDS_TEXTURE,
  usePhongModel,
  WATER_TEXTURE
} from '@/lib/assets';
import { isFeederLocked } from '@/lib/feederManager';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { Clone, useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
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

const CAT_GLOW = new THREE.Color('#FF3D00');
const LOCKED_GLOW = new THREE.Color('#FF9800');
const FEEDER_MARKER = new THREE.Color('#4CAF50');
const BATH_MARKER = new THREE.Color('#00AEEF');
const LOCKED_MARKER = new THREE.Color('#7A7F87');

const MARKER_HEIGHT = 5;
// Markers fade out over this distance band instead of popping.
const MARKER_FADE_NEAR = 30;
const MARKER_FADE_FAR = 45;

// A feeder without a cat still fills the threat meter; past this level a
// cat walks in from beyond the stalking path so the danger is visible.
const STRAY_CAT_METER = 40;
const STRAY_CAT_OFFSET = -0.7;

interface FeederProps {
  data: FeederData;
}

export default function Feeder({ data }: FeederProps) {
  const glowRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const markerRef = useRef<THREE.Group>(null);
  const markerMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const catRef = useRef<THREE.Group>(null);
  const lockMix = useRef(0);
  const stalk = useRef(data.hasCat ? 0 : STRAY_CAT_OFFSET);

  const isBirdbath = data.type === 'birdbath';
  const markerColor = isBirdbath ? BATH_MARKER : FEEDER_MARKER;

  const glowMat = useMemo(() => dangerGlowMaterial.clone(), []);
  useEffect(() => () => glowMat.dispose(), [glowMat]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const s = useGameStore.getState();
    const t = clock.elapsedTime;
    const locked = isFeederLocked(data, s.gameTime);
    const perchedHere =
      s.activeFeeder?.id === data.id &&
      (s.gameState === 'feeding' ||
        s.gameState === 'drinking' ||
        s.gameState === 'dying');

    // The close-up camera sits inside the glow sphere while perched here.
    const glow = glowRef.current;
    if (glow) {
      glow.visible = (data.hasCat || locked) && !perchedHere;
      if (glow.visible) {
        const { uniforms } = glow.material;
        uniforms.uTime.value = t;
        uniforms.uColor.value.copy(locked ? LOCKED_GLOW : CAT_GLOW);
      }
    }

    const marker = markerRef.current;
    const markerMat = markerMatRef.current;
    if (marker && markerMat) {
      const dx = s.position[0] - data.position[0];
      const dz = s.position[2] - data.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      const fade = perchedHere
        ? 0
        : 1 -
          THREE.MathUtils.smoothstep(dist, MARKER_FADE_NEAR, MARKER_FADE_FAR);
      marker.visible = fade > 0.01;
      if (marker.visible) {
        lockMix.current = THREE.MathUtils.damp(
          lockMix.current,
          locked ? 1 : 0,
          4,
          delta
        );
        const lock = lockMix.current;
        const pulse = 0.5 + 0.5 * Math.sin(t * 3.2 + data.id);
        marker.rotation.y += delta * THREE.MathUtils.lerp(1.6, 0.35, lock);
        marker.position.y =
          MARKER_HEIGHT + Math.sin(t * 2 + data.id) * 0.3 * (1 - lock * 0.7);
        marker.scale.setScalar(1 + 0.14 * pulse * (1 - lock));
        markerMat.color.lerpColors(markerColor, LOCKED_MARKER, lock);
        markerMat.emissive.copy(markerMat.color);
        markerMat.emissiveIntensity = THREE.MathUtils.lerp(
          0.4 + 0.5 * pulse,
          0.05,
          lock
        );
        markerMat.opacity = fade * THREE.MathUtils.lerp(1, 0.5, lock);
      }
    }

    const cat = catRef.current;
    if (cat) {
      updateStalkingCat(cat, stalk, {
        data,
        t,
        delta,
        perchedHere,
        perched: perchedHere && s.gameState !== 'dying',
        threatMeter: s.threatMeter,
        diedToCat: s.gameState === 'dying' && s.deathReason === 'cat'
      });
    }
  });

  return (
    <group position={data.position}>
      {isBirdbath ? <BirdbuddyBath /> : <BirdbuddyFeeder />}

      {/* DANGER GLOW — FRESNEL GRADIENT AURA */}
      {(data.hasCat || data.lockedUntil !== undefined) && (
        <mesh
          ref={glowRef}
          position={[0, 1.5, 0]}
          material={glowMat}
          visible={false}
        >
          <sphereGeometry args={[3.5, 24, 16]} />
        </mesh>
      )}

      {/* FLOATING MARKER — PULSES WHEN OPEN, DIMS AND SLOWS WHEN LOCKED */}
      <group ref={markerRef} position={[0, MARKER_HEIGHT, 0]} visible={false}>
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            ref={markerMatRef}
            color={markerColor}
            emissive={markerColor}
            emissiveIntensity={0.5}
            transparent
          />
        </mesh>
      </group>

      {/* STALKING CAT — CREEPS TOWARD THE POLE AS THE THREAT METER RISES */}
      <group ref={catRef} visible={false}>
        <Suspense fallback={null}>
          <CatModel />
        </Suspense>
      </group>
    </group>
  );
}

const _catPos = new THREE.Vector3();

function updateStalkingCat(
  cat: THREE.Group,
  stalk: { current: number },
  {
    data,
    t,
    delta,
    perchedHere,
    perched,
    threatMeter,
    diedToCat
  }: {
    data: FeederData;
    t: number;
    delta: number;
    perchedHere: boolean;
    perched: boolean;
    threatMeter: number;
    diedToCat: boolean;
  }
) {
  const meter = threatMeter / 100;
  let target: number;
  if (data.hasCat) {
    target = perched ? meter : 0;
  } else {
    const stray = Math.max(
      0,
      (threatMeter - STRAY_CAT_METER) / (100 - STRAY_CAT_METER)
    );
    target = perched
      ? THREE.MathUtils.lerp(STRAY_CAT_OFFSET, 1, stray)
      : STRAY_CAT_OFFSET;
  }
  if (perchedHere && diedToCat) target = 1;

  const previous = stalk.current;
  stalk.current = THREE.MathUtils.damp(
    previous,
    target,
    perched ? 6 : 1.2,
    delta
  );
  const progress = stalk.current;

  // DeathCat takes over for the pounce.
  cat.visible =
    !(perchedHere && diedToCat) &&
    (data.hasCat || progress > STRAY_CAT_OFFSET + 0.02);
  if (!cat.visible) return;

  const speed = Math.abs(progress - previous) / Math.max(delta, 1e-4);
  const walking = Math.min(1, speed * 4);
  const crouch = THREE.MathUtils.smoothstep(progress, 0.65, 0.95);

  catStalkPosition(progress, _catPos);
  cat.position.copy(_catPos);
  cat.position.y += Math.abs(Math.sin(t * 9)) * 0.04 * walking;
  // Low and wound up near the pole, with a pre-pounce wiggle.
  cat.scale.set(1 + 0.06 * crouch, 1 - 0.28 * crouch, 1 + 0.1 * crouch);
  cat.rotation.y = CAT_STALK_YAW + Math.sin(t * 16) * 0.07 * crouch;
}

useGLTF.preload(FEEDER_MODEL);
useGLTF.preload(BIRDBATH_MODEL);
useGLTF.preload(CAT_MODEL);
useTexture.preload(SEEDS_TEXTURE);
useTexture.preload(WATER_TEXTURE);

// CAT MODEL STANDING UPRIGHT — SHARED BY CAT FEEDERS AND THE DEATH SCENE
export function CatModel({
  position
}: {
  position?: [number, number, number];
}) {
  const cat = usePhongModel(CAT_MODEL, MATTE_SHADING);
  return (
    <Clone
      object={cat}
      scale={0.03}
      position={position}
      rotation={[1.5, -3.15, -3]}
    />
  );
}

// BIRDBUDDY-STYLE SMART FEEDER — GLB MODEL ON POLE
export function BirdbuddyFeeder() {
  const feeder = usePhongModel(FEEDER_MODEL, GLOSSY_SHADING);
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
      <Clone object={feeder} scale={0.0045} position={[0, 2.5, 0]} />
      <SeedsTray position={[0, 2.25, 0.02]} />
    </group>
  );
}

function SeedsTray({ position }: { position: [number, number, number] }) {
  const texture = useTexture(SEEDS_TEXTURE);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.8, 0.5]} />
      <meshStandardMaterial map={texture} transparent roughness={0.8} />
    </mesh>
  );
}

// BIRDBUDDY-STYLE BIRDBATH — GLB MODEL ON POLE
export function BirdbuddyBath() {
  const bath = usePhongModel(BIRDBATH_MODEL, GLOSSY_SHADING);
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
      <Clone object={bath} scale={0.0045} position={[0, 2.5, 0]} />
      <WaterSurface position={[0, 2.35, 0.08]} />
    </group>
  );
}

function WaterSurface({ position }: { position: [number, number, number] }) {
  const texture = useTexture(WATER_TEXTURE);
  const meshRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const material = useMemo(() => createWaterMaterial(texture), [texture]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      <circleGeometry args={[0.78, 32]} />
    </mesh>
  );
}

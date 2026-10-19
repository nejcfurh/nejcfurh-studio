'use client';

import {
  CAT_STALK_LENGTH,
  CAT_STALK_YAW,
  CAT_WALK_SPEED,
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
  useAnimatedPhongModel,
  usePhongModel,
  WATER_TEXTURE
} from '@/lib/assets';
import { isFeederLocked } from '@/lib/feederManager';
import { useGameStore } from '@/store/gameStore';
import { FeederData } from '@/types';
import { Clone, useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RefObject, Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

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
// The cat reaches the pole before the meter fills, so it has time to crouch
// and wiggle before the pounce.
const CAT_ARRIVE_METER = 80;
const STRAY_ARRIVE_METER = 90;
const CROUCH_PROGRESS = 0.97;
const STALK_RATE = 6;
const RETREAT_RATE = 0.9;
// Below this ground speed (units/s) the cat stands instead of walking.
const WALK_MIN_SPEED = 0.06;
const TURN_RATE = 8;
// Cats beyond this distance from the bird hold their pose.
const CAT_ANIMATE_DISTANCE = 45;

interface FeederProps {
  data: FeederData;
}

export default function Feeder({ data }: FeederProps) {
  const glowRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const markerRef = useRef<THREE.Group>(null);
  const markerMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const catRef = useRef<THREE.Group>(null);
  const catAnimator = useRef<CatAnimator | null>(null);
  const lockMix = useRef(0);
  const stalk = useRef<StalkState>({
    progress: data.hasCat ? 0 : STRAY_CAT_OFFSET,
    speed: 0,
    yaw: CAT_STALK_YAW
  });

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
    if (cat && !s.isPaused) {
      const dx = s.position[0] - data.position[0];
      const dz = s.position[2] - data.position[2];
      updateStalkingCat(cat, catAnimator.current, stalk.current, {
        data,
        delta,
        perchedHere,
        perched: perchedHere && s.gameState !== 'dying',
        threatMeter: s.threatMeter,
        diedToCat: s.gameState === 'dying' && s.deathReason === 'cat',
        near: dx * dx + dz * dz < CAT_ANIMATE_DISTANCE * CAT_ANIMATE_DISTANCE
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
          <CatModel animatorRef={catAnimator} />
        </Suspense>
      </group>
    </group>
  );
}

const _catPos = new THREE.Vector3();

interface StalkState {
  /** Position along the stalking path (see catStalkPosition). */
  progress: number;
  /** Smoothed ground speed, units per second. */
  speed: number;
  yaw: number;
}

function updateStalkingCat(
  cat: THREE.Group,
  animator: CatAnimator | null,
  st: StalkState,
  {
    data,
    delta,
    perchedHere,
    perched,
    threatMeter,
    diedToCat,
    near
  }: {
    data: FeederData;
    delta: number;
    perchedHere: boolean;
    perched: boolean;
    threatMeter: number;
    diedToCat: boolean;
    near: boolean;
  }
) {
  let target: number;
  if (data.hasCat) {
    target = perched ? Math.min(1, threatMeter / CAT_ARRIVE_METER) : 0;
  } else {
    const stray = THREE.MathUtils.clamp(
      (threatMeter - STRAY_CAT_METER) / (STRAY_ARRIVE_METER - STRAY_CAT_METER),
      0,
      1
    );
    target = perched
      ? THREE.MathUtils.lerp(STRAY_CAT_OFFSET, 1, stray)
      : STRAY_CAT_OFFSET;
  }
  if (perchedHere && diedToCat) target = 1;

  const previous = st.progress;
  st.progress = THREE.MathUtils.damp(
    previous,
    target,
    perched ? STALK_RATE : RETREAT_RATE,
    delta
  );
  const step = st.progress - previous;

  // DeathCat takes over for the pounce.
  cat.visible =
    !(perchedHere && diedToCat) &&
    (data.hasCat || st.progress > STRAY_CAT_OFFSET + 0.02);
  if (animator) animator.active = cat.visible && near;
  if (!cat.visible) return;

  const speed = (Math.abs(step) * CAT_STALK_LENGTH) / Math.max(delta, 1e-4);
  st.speed = THREE.MathUtils.damp(st.speed, speed, 12, delta);
  const walking = st.speed > WALK_MIN_SPEED;
  const crouching = perched && st.progress > CROUCH_PROGRESS;

  // Walks face the way they go; standing and crouching cats watch the pole.
  const yawTarget = CAT_STALK_YAW + (walking && step < 0 ? Math.PI : 0);
  const turn = THREE.MathUtils.euclideanModulo(
    yawTarget - st.yaw + Math.PI,
    Math.PI * 2
  );
  st.yaw += (turn - Math.PI) * (1 - Math.exp(-TURN_RATE * delta));

  catStalkPosition(st.progress, _catPos);
  cat.position.copy(_catPos);
  cat.rotation.y = st.yaw;

  if (!animator) return;
  if (crouching) {
    animator.play('crouch');
  } else if (walking) {
    animator.play('walk');
    // Playback follows the ground speed so planted paws do not slide.
    animator.setTimeScale(
      'walk',
      THREE.MathUtils.clamp(st.speed / CAT_WALK_SPEED, 0.3, 2.5)
    );
  } else {
    animator.play('idle');
  }
}

useGLTF.preload(FEEDER_MODEL);
useGLTF.preload(BIRDBATH_MODEL);
useGLTF.preload(CAT_MODEL);
useTexture.preload(SEEDS_TEXTURE);
useTexture.preload(WATER_TEXTURE);

export type CatClip = 'idle' | 'walk' | 'crouch' | 'pounce';
const CAT_FADE = 0.25;

/** One cat's mixer, with cross-fades between the clips in cat.glb. */
export class CatAnimator {
  /** False holds the pose: hidden or distant cats skip their mixer update. */
  active = true;
  private readonly mixer: THREE.AnimationMixer;
  private readonly actions: Record<CatClip, THREE.AnimationAction>;
  private current: CatClip | null = null;

  constructor(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(root);
    const action = (name: CatClip) => {
      const clip = THREE.AnimationClip.findByName(clips, name);
      if (!clip) throw new Error(`cat.glb has no "${name}" clip`);
      return this.mixer.clipAction(clip);
    };
    this.actions = {
      idle: action('idle'),
      walk: action('walk'),
      crouch: action('crouch'),
      pounce: action('pounce')
    };
    this.actions.pounce.setLoop(THREE.LoopOnce, 1);
    this.actions.pounce.clampWhenFinished = true;
  }

  /** Starts a clip from its first frame, fading out the one playing. */
  play(name: CatClip, fade = CAT_FADE) {
    if (name === this.current) return;
    const next = this.actions[name];
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    const prev = this.current ? this.actions[this.current] : null;
    if (prev && fade > 0) next.crossFadeFrom(prev, fade, false);
    else prev?.stop();
    this.current = name;
  }

  setTimeScale(name: CatClip, timeScale: number) {
    this.actions[name].setEffectiveTimeScale(timeScale);
  }

  update(delta: number) {
    this.mixer.update(delta);
  }

  stop() {
    this.mixer.stopAllAction();
    this.current = null;
  }
}

// Skinned meshes are culled against their bind-pose bounds; the clips reach a
// little beyond them.
const CAT_BOUNDS_MARGIN = 0.35;

// RIGGED CAT (public/models/mycat/cat.glb) — CAT FEEDERS, THE DEATH SCENE AND /test
export function CatModel({
  position,
  animatorRef,
  frustumCulled = true
}: {
  position?: [number, number, number];
  /** Receives the cat's animator; without one the cat idles on its own. */
  animatorRef?: RefObject<CatAnimator | null>;
  frustumCulled?: boolean;
}) {
  const { scene, animations } = useAnimatedPhongModel(CAT_MODEL, MATTE_SHADING);
  const rig = useMemo(() => {
    const root = cloneSkinned(scene);
    root.traverse((child) => {
      if (!(child instanceof THREE.SkinnedMesh)) return;
      child.frustumCulled = frustumCulled;
      child.computeBoundingSphere();
      if (child.boundingSphere)
        child.boundingSphere.radius += CAT_BOUNDS_MARGIN;
    });
    return { root, animator: new CatAnimator(root, animations) };
  }, [scene, animations, frustumCulled]);

  useEffect(() => {
    const { animator } = rig;
    animator.play('idle', 0);
    if (animatorRef) animatorRef.current = animator;
    return () => {
      if (animatorRef?.current === animator) animatorRef.current = null;
      animator.stop();
    };
  }, [rig, animatorRef]);

  useFrame((_, delta) => {
    const { animator } = rig;
    if (!animator.active || useGameStore.getState().isPaused) return;
    animator.update(Math.min(delta, 0.05));
  });

  return <primitive object={rig.root} position={position} />;
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

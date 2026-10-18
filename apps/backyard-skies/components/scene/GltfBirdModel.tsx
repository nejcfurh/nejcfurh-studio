'use client';

import { BIRD_MODEL, BIRD_SPECIES_TEXTURES } from '@/lib/assets';
import { BirdSpeciesId } from '@/types';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import * as THREE from 'three';

/** Pose read every frame, so a 60 Hz source does not re-render the model. */
export interface BirdPose {
  /** Increments once per flap; each increase starts a wingbeat. */
  flapId: number;
  gliding: boolean;
}

interface GltfBirdModelProps {
  isFlapping: boolean;
  isPerched?: boolean;
  scale?: number;
  speciesId?: BirdSpeciesId;
  /** When given, it replaces isFlapping as the source of wingbeats. */
  poseRef?: MutableRefObject<BirdPose>;
}

const WING_THRESHOLD = 0.8;
const FLAP_DURATION = 0.3;
const FLAP_LIFT = 0.8; // MAX Y DISPLACEMENT AT WINGTIP
const GLIDE_LIFT = 0.22; // WINGS HELD SLIGHTLY RAISED AND SPREAD
const BASE_LIFT_DAMPING = 10; // 1/s
const LIFT_EPSILON = 0.002;

export default function GltfBirdModel({
  isFlapping,
  isPerched = false,
  scale = 1,
  speciesId = 'cardinal',
  poseRef
}: GltfBirdModelProps) {
  const { scene } = useGLTF(BIRD_MODEL);
  const speciesTexture = useTexture(
    BIRD_SPECIES_TEXTURES[speciesId] || BIRD_SPECIES_TEXTURES.cardinal
  );

  // DEEP CLONE INCLUDING GEOMETRY BUFFERS SO VERTEX EDITS DON'T CORRUPT THE CACHED ORIGINAL
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry = child.geometry.clone();
        child.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // APPLY SPECIES BASE COLOR TEXTURE TO ALL MESH MATERIALS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    speciesTexture.flipY = false;
    speciesTexture.colorSpace = THREE.SRGBColorSpace;
    speciesTexture.needsUpdate = true;
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.map = speciesTexture;
        mat.color.set(1, 1, 1); // RESET TINT SO TEXTURE SHOWS TRUE COLORS
        mat.needsUpdate = true;
      }
    });
  }, [clonedScene, speciesTexture]);
  const groupRef = useRef<THREE.Group>(null);
  const flapTime = useRef(-1);
  const lastFlapId = useRef(0);
  const wasFlapping = useRef(false);
  const baseLift = useRef(0);
  // NaN forces the first frame to write the buffer.
  const appliedLift = useRef(Number.NaN);
  const originalPositions = useRef<Map<THREE.BufferGeometry, Float32Array>>(
    new Map()
  );

  const initOriginals = useCallback(() => {
    if (originalPositions.current.size > 0) return;
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const pos = child.geometry.attributes.position;
        if (pos) {
          originalPositions.current.set(
            child.geometry,
            new Float32Array(pos.array)
          );
        }
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    initOriginals();

    const pose = poseRef?.current;
    let startFlap = false;
    if (pose) {
      startFlap = pose.flapId > lastFlapId.current;
      lastFlapId.current = pose.flapId;
    } else {
      startFlap = isFlapping && !wasFlapping.current;
      wasFlapping.current = isFlapping;
    }
    if (startFlap && !isPerched) flapTime.current = 0;

    const gliding = !isPerched && (pose?.gliding ?? false);
    const baseTarget = isPerched ? -FLAP_LIFT : gliding ? GLIDE_LIFT : 0;
    baseLift.current +=
      (baseTarget - baseLift.current) *
      (1 - Math.exp(-BASE_LIFT_DAMPING * Math.min(delta, 0.05)));
    if (Math.abs(baseTarget - baseLift.current) < LIFT_EPSILON) {
      baseLift.current = baseTarget;
    }

    let lift = baseLift.current;
    if (flapTime.current >= 0) {
      flapTime.current += delta;
      const progress = Math.min(flapTime.current / FLAP_DURATION, 1);
      // SMOOTH UP-DOWN: SIN GIVES 0→1→0 OVER THE FLAP
      lift += Math.sin(progress * Math.PI) * FLAP_LIFT;
      if (progress >= 1) flapTime.current = -1;
    }

    // The buffer upload is the expensive part, so skip it while the pose holds still.
    if (lift === appliedLift.current) return;
    appliedLift.current = lift;
    applyWingLift(clonedScene, originalPositions.current, lift);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// SIMPLE Y-OFFSET LIFT: WING VERTICES MOVE UP PROPORTIONAL TO DISTANCE FROM WING ROOT
function applyWingLift(
  scene: THREE.Object3D,
  originals: Map<THREE.BufferGeometry, Float32Array>,
  lift: number
) {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const posAttr = child.geometry.attributes.position;
      const orig = originals.get(child.geometry);
      if (!posAttr || !orig) return;

      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < orig.length; i += 3) {
        const ox = orig[i];

        if (Math.abs(ox) > WING_THRESHOLD) {
          // HOW FAR THIS VERTEX IS FROM THE WING ROOT (0 AT ROOT, 1+ AT TIP)
          const dist = Math.abs(ox) - WING_THRESHOLD;
          // Y OFFSET SCALES WITH DISTANCE — WINGTIP MOVES MOST
          arr[i + 1] = orig[i + 1] + lift * dist;
        }
      }
      posAttr.needsUpdate = true;
    }
  });
}

// PRELOAD ALL SPECIES TEXTURES
Object.values(BIRD_SPECIES_TEXTURES).forEach((url) => useTexture.preload(url));

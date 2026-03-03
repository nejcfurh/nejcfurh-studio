'use client';

import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { BirdSpeciesId } from '@/types';
import * as THREE from 'three';

// MAP SPECIES ID TO TEXTURE FILE NAME
const SPECIES_TEXTURE: Record<BirdSpeciesId, string> = {
  cardinal: '/models/mybird/textures/lambert2_baseColor.png',
  tanager: '/models/mybird/textures/lambert2_baseColor-scarlet.png',
  bunting: '/models/mybird/textures/lambert2_baseColor-indigo.png',
  starling: '/models/mybird/textures/lambert2_baseColor-starling.png',
};

interface GltfBirdModelProps {
  isFlapping: boolean;
  isPerched?: boolean;
  scale?: number;
  speciesId?: BirdSpeciesId;
}

const WING_THRESHOLD = 0.8;
const FLAP_DURATION = 0.3;
const FLAP_LIFT = 0.8; // MAX Y DISPLACEMENT AT WINGTIP

export default function GltfBirdModel({
  isFlapping,
  isPerched = false,
  scale = 1,
  speciesId = 'cardinal',
}: GltfBirdModelProps) {
  const { scene } = useGLTF('/models/mybird/scene.gltf');
  const speciesTexture = useTexture(
    SPECIES_TEXTURE[speciesId] || SPECIES_TEXTURE.cardinal,
  );

  // DEEP CLONE INCLUDING GEOMETRY BUFFERS SO VERTEX EDITS DON'T CORRUPT THE CACHED ORIGINAL
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry = child.geometry.clone();
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
    clonedScene.traverse(child => {
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
  const flapActive = useRef(false);
  const originalPositions = useRef<Map<THREE.BufferGeometry, Float32Array>>(
    new Map(),
  );

  const initOriginals = useCallback(() => {
    if (originalPositions.current.size > 0) return;
    clonedScene.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const pos = child.geometry.attributes.position;
        if (pos) {
          originalPositions.current.set(
            child.geometry,
            new Float32Array(pos.array),
          );
        }
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    initOriginals();

    // TRIGGER NEW FLAP
    if (isFlapping && !flapActive.current) {
      flapActive.current = true;
      flapTime.current = 0;
    }

    if (flapTime.current >= 0) {
      flapTime.current += delta;
      const progress = Math.min(flapTime.current / FLAP_DURATION, 1);
      // SMOOTH UP-DOWN: SIN GIVES 0→1→0 OVER THE FLAP
      const lift = Math.sin(progress * Math.PI) * FLAP_LIFT;

      applyWingLift(clonedScene, originalPositions.current, lift);

      if (progress >= 1) {
        flapTime.current = -1;
        flapActive.current = false;
        resetVertices(clonedScene, originalPositions.current);
      }
    } else if (isPerched) {
      // WINGS TUCKED DOWN WHEN PERCHED
      flapActive.current = false;
      applyWingLift(clonedScene, originalPositions.current, -FLAP_LIFT);
    } else {
      // NOT FLAPPING — KEEP WINGS IN ORIGINAL MODEL POSITION
      flapActive.current = false;
      resetVertices(clonedScene, originalPositions.current);
    }
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
  lift: number,
) {
  scene.traverse(child => {
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

function resetVertices(
  scene: THREE.Object3D,
  originals: Map<THREE.BufferGeometry, Float32Array>,
) {
  scene.traverse(child => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const posAttr = child.geometry.attributes.position;
      const orig = originals.get(child.geometry);
      if (posAttr && orig) {
        (posAttr.array as Float32Array).set(orig);
        posAttr.needsUpdate = true;
      }
    }
  });
}

// PRELOAD ALL SPECIES TEXTURES
Object.values(SPECIES_TEXTURE).forEach(url => useTexture.preload(url));

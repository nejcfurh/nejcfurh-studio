'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { HouseData } from '@/lib/terrain/chunkGenerator';
import { HOUSE_MODELS } from '@/lib/terrain/chunkConstants';

export default function House({ x, z, rot, modelIndex }: HouseData) {
  const url = HOUSE_MODELS[modelIndex % HOUSE_MODELS.length];
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    return () => {
      clone.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };
  }, [clone]);

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]} scale={6.3}>
      <primitive object={clone} />
    </group>
  );
}

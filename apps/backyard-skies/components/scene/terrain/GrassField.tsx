'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { HouseData } from '@/lib/terrain/chunkGenerator';
import { CHUNK_SIZE, GRASS_MODEL } from '@/lib/terrain/chunkConstants';

export default function GrassField({
  houses,
  hasRoadX,
  hasRoadZ,
}: {
  houses: HouseData[];
  hasRoadX: boolean;
  hasRoadZ: boolean;
}) {
  const { scene } = useGLTF(GRASS_MODEL);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { geometry, material, meshMatrix, positions } = useMemo(() => {
    scene.updateMatrixWorld(true);

    let geo: THREE.BufferGeometry | null = null;
    let mat: THREE.Material | null = null;
    const mMatrix = new THREE.Matrix4();

    scene.traverse(child => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        geo = mesh.geometry;
        mat = mesh.material as THREE.Material;
        mesh.updateWorldMatrix(true, false);
        mMatrix.copy(mesh.matrixWorld);
      }
    });

    const pos: { x: number; z: number; rot: number; s: number }[] = [];
    const half = CHUNK_SIZE / 2;

    for (let gx = -half; gx < half; gx += 0.55) {
      for (let gz = -half; gz < half; gz += 0.55) {
        if (hasRoadX && Math.abs(gz) < 3.5) continue;
        if (hasRoadZ && Math.abs(gx) < 3.5) continue;

        let blocked = false;
        for (const h of houses) {
          if (Math.abs(gx - h.x) < 4 && Math.abs(gz - h.z) < 4) {
            blocked = true;
            break;
          }
        }
        if (blocked) continue;

        const hash =
          Math.abs(Math.sin(gx * 12.9898 + gz * 78.233) * 43758.5453) % 1;
        const hash2 =
          Math.abs(Math.sin(gx * 78.233 + gz * 12.9898) * 43758.5453) % 1;
        pos.push({
          x: gx + hash * 0.5 - 0.25,
          z: gz + hash2 * 0.5 - 0.25,
          rot: hash * Math.PI * 2,
          s: 0.008 + hash2 * 0.006,
        });
      }
    }

    return {
      geometry: geo!,
      material: mat!,
      meshMatrix: mMatrix,
      positions: pos,
    };
  }, [scene, houses, hasRoadX, hasRoadZ]);

  useEffect(() => {
    if (!meshRef.current || !geometry) return;
    const dummy = new THREE.Object3D();
    const tempMatrix = new THREE.Matrix4();

    positions.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, p.rot, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      tempMatrix.multiplyMatrices(dummy.matrix, meshMatrix);
      meshRef.current!.setMatrixAt(i, tempMatrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, meshMatrix, geometry]);

  if (!geometry || !material) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, positions.length]}
      frustumCulled={false}
    />
  );
}

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import {
  Instance,
  InstancedLayer,
  LoadedChunk,
  placeInGroup,
  unitPlaneGeometry
} from './InstancedLayer';

const patioMaterial = new THREE.MeshStandardMaterial({
  color: '#b0a898',
  roughness: 0.85
});

export function PatioLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const instances = useMemo(() => {
    const out: Instance[] = [];
    for (const chunk of chunks) {
      for (const h of chunk.data.houses) {
        if (!h.hasPatio) continue;
        out.push({
          matrix: placeInGroup(
            { x: chunk.ox + h.x, z: chunk.oz + h.z, rot: h.rot },
            { y: 0.03, z: -3.5, sx: h.w + 1, sz: 2.5 }
          )
        });
      }
    }
    return out;
  }, [chunks]);

  return (
    <InstancedLayer
      geometry={unitPlaneGeometry}
      material={patioMaterial}
      instances={instances}
      receiveShadow
    />
  );
}

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import {
  Instance,
  InstancedLayer,
  LoadedChunk,
  placeInGroup,
  unitBoxGeometry
} from './InstancedLayer';

const SOIL = new THREE.Color('#5c4033');
const EDGING = new THREE.Color('#9e9690');
const FLOWER_COLORS = ['#e85d75', '#ffd700', '#ff69b4'].map(
  (c) => new THREE.Color(c)
);

const bedMaterial = new THREE.MeshStandardMaterial({ roughness: 0.95 });
const flowerMaterial = new THREE.MeshStandardMaterial({ roughness: 0.7 });
const flowerGeometry = new THREE.IcosahedronGeometry(0.1, 0);

export function GardenBedLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const { beds, flowers } = useMemo(() => {
    const bedOut: Instance[] = [];
    const flowerOut: Instance[] = [];
    for (const chunk of chunks) {
      for (const g of chunk.data.gardenBeds) {
        const group = { x: chunk.ox + g.x, z: chunk.oz + g.z, rot: g.rot };
        bedOut.push({
          matrix: placeInGroup(group, { y: 0.06, sx: g.w, sy: 0.12, sz: 0.8 }),
          color: SOIL
        });
        for (const side of [-1, 1]) {
          bedOut.push({
            matrix: placeInGroup(group, {
              y: 0.08,
              z: side * 0.45,
              sx: g.w + 0.1,
              sy: 0.1,
              sz: 0.08
            }),
            color: EDGING
          });
        }
        FLOWER_COLORS.forEach((color, i) => {
          flowerOut.push({
            matrix: placeInGroup(group, { x: (i - 1) * g.w * 0.3, y: 0.18 }),
            color
          });
        });
      }
    }
    return { beds: bedOut, flowers: flowerOut };
  }, [chunks]);

  return (
    <>
      <InstancedLayer
        geometry={unitBoxGeometry}
        material={bedMaterial}
        instances={beds}
        receiveShadow
      />
      <InstancedLayer
        geometry={flowerGeometry}
        material={flowerMaterial}
        instances={flowers}
      />
    </>
  );
}

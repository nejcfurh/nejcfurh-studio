'use client';

import { CHUNK_SIZE, STREET_HALF_WIDTH } from '@/lib/terrain/chunkConstants';
import { useMemo } from 'react';
import * as THREE from 'three';

import {
  Instance,
  InstancedLayer,
  LoadedChunk,
  placeInGroup,
  unitPlaneGeometry
} from './InstancedLayer';

export const ROAD_WIDTH = 4.5;
export const ROAD_DASHES = [-16, -8, 0, 8, 16];
const SIDEWALK_WIDTH = 1.2;
const SIDEWALK_OFFSET = STREET_HALF_WIDTH - SIDEWALK_WIDTH / 2;
export { STREET_HALF_WIDTH };

export const ASPHALT = new THREE.Color('#505359');
export const ROAD_PAINT = new THREE.Color('#d8c95a');
const SIDEWALK = new THREE.Color('#c4bfa8');

export const roadMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.9
});

/**
 * Road strips laid out along local X of a chunk; `rot` turns them onto Z.
 * At a junction the centre dash is skipped so the two roads do not paint a
 * "+" in the middle of the crossing.
 */
export function pushRoad(
  out: Instance[],
  chunk: LoadedChunk,
  rot: number,
  junction: boolean
) {
  const group = { x: chunk.ox, z: chunk.oz, rot };
  out.push({
    matrix: placeInGroup(group, {
      y: 0.02,
      sx: CHUNK_SIZE,
      sz: ROAD_WIDTH
    }),
    color: ASPHALT
  });
  for (const x of ROAD_DASHES) {
    if (junction && Math.abs(x) < ROAD_WIDTH) continue;
    out.push({
      matrix: placeInGroup(group, { x, y: 0.04, sx: 3, sz: 0.12 }),
      color: ROAD_PAINT
    });
  }
}

export function RoadXLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const instances = useMemo(() => {
    const out: Instance[] = [];
    const half = CHUNK_SIZE / 2;
    const gapHalf = ROAD_WIDTH / 2;
    for (const chunk of chunks) {
      const { hasRoadX, hasRoadZ } = chunk.data;
      if (!hasRoadX) continue;
      pushRoad(out, chunk, 0, hasRoadZ);

      const group = { x: chunk.ox, z: chunk.oz, rot: 0 };
      // Sidewalks stop at the crossing road instead of running across it.
      const segments: [number, number][] = hasRoadZ
        ? [
            [-half, -gapHalf],
            [gapHalf, half]
          ]
        : [[-half, half]];
      for (const side of [-1, 1]) {
        for (const [from, to] of segments) {
          out.push({
            matrix: placeInGroup(group, {
              x: (from + to) / 2,
              y: 0.03,
              z: side * SIDEWALK_OFFSET,
              sx: to - from,
              sz: SIDEWALK_WIDTH
            }),
            color: SIDEWALK
          });
        }
      }
    }
    return out;
  }, [chunks]);

  return (
    <InstancedLayer
      geometry={unitPlaneGeometry}
      material={roadMaterial}
      instances={instances}
      receiveShadow
    />
  );
}

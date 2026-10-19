'use client';

import {
  CHUNK_SIZE,
  DETAIL_DISTANCE,
  GRASS_DISTANCE,
  RENDER_DISTANCE
} from '@/lib/terrain/chunkConstants';
import { generateChunkData } from '@/lib/terrain/chunkGenerator';
import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

import { GardenBedLayer } from './terrain/GardenBed';
import {
  GrassField,
  grassUniforms,
  LAWN_COLOR,
  LAWN_TINT_GLSL
} from './terrain/GrassField';
import { HouseLayer } from './terrain/House';
import { HousePropsLayer } from './terrain/HouseProps';
import { LoadedChunk } from './terrain/InstancedLayer';
import { PatioLayer } from './terrain/Patio';
import { RoadXLayer } from './terrain/RoadX';
import { RoadZLayer } from './terrain/RoadZ';
import { TreeLayer } from './terrain/Tree';
import { YardFenceLayer } from './terrain/YardFence';

function chunkKey(cx: number, cz: number) {
  return `${cx},${cz}`;
}

/**
 * Chunk content is laid out around the chunk origin (cx * CHUNK_SIZE), so the
 * chunk the bird is over is the nearest origin, not the floor.
 */
function loadChunks(cx: number, cz: number, previous: LoadedChunk[]) {
  const cache = new Map(previous.map((c) => [c.key, c]));
  const chunks: LoadedChunk[] = [];
  for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
    for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
      const key = chunkKey(cx + dx, cz + dz);
      const near =
        Math.abs(dx) <= DETAIL_DISTANCE && Math.abs(dz) <= DETAIL_DISTANCE;
      const grass =
        Math.abs(dx) <= GRASS_DISTANCE && Math.abs(dz) <= GRASS_DISTANCE;
      const cached = cache.get(key);
      chunks.push(
        cached
          ? { ...cached, near, grass }
          : {
              key,
              ox: (cx + dx) * CHUNK_SIZE,
              oz: (cz + dz) * CHUNK_SIZE,
              near,
              grass,
              data: generateChunkData(cx + dx, cz + dz)
            }
      );
    }
  }
  return chunks;
}

const groundMaterial = new THREE.MeshLambertMaterial({ color: LAWN_COLOR });
groundMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
varying vec2 vLawnPosition;`
    )
    .replace(
      '#include <project_vertex>',
      /* glsl */ `#include <project_vertex>
vLawnPosition = (modelMatrix * vec4(transformed, 1.0)).xz;`
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
varying vec2 vLawnPosition;
${LAWN_TINT_GLSL}`
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
diffuseColor.rgb *= lawnTint(vLawnPosition, length(vViewPosition));`
    );
};

export default function SuburbanWorld() {
  const [chunks, setChunks] = useState<LoadedChunk[]>([]);
  const lastChunkRef = useRef('');
  const groundRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const { position } = useGameStore.getState();
    grassUniforms.uTime.value = clock.getElapsedTime();
    grassUniforms.uPlayer.value.set(position[0], position[2]);
    // The ground is a flat colour, so it can follow the bird and never end.
    groundRef.current?.position.set(position[0], -0.05, position[2]);

    const cx = Math.round(position[0] / CHUNK_SIZE);
    const cz = Math.round(position[2] / CHUNK_SIZE);
    const key = chunkKey(cx, cz);
    if (key === lastChunkRef.current) return;
    lastChunkRef.current = key;
    setChunks((prev) => loadChunks(cx, cz, prev));
  });

  return (
    <group>
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        material={groundMaterial}
        receiveShadow
      >
        <planeGeometry args={[600, 600]} />
      </mesh>

      <RoadXLayer chunks={chunks} />
      <RoadZLayer chunks={chunks} />
      <PatioLayer chunks={chunks} />
      <GardenBedLayer chunks={chunks} />
      <YardFenceLayer chunks={chunks} />
      <TreeLayer chunks={chunks} />
      <HouseLayer chunks={chunks} />
      <HousePropsLayer chunks={chunks} />

      {chunks
        .filter((c) => c.grass)
        .map((c) => (
          <group key={c.key} position={[c.ox, 0, c.oz]}>
            <GrassField
              houses={c.data.houses}
              hasRoadX={c.data.hasRoadX}
              hasRoadZ={c.data.hasRoadZ}
            />
          </group>
        ))}
    </group>
  );
}

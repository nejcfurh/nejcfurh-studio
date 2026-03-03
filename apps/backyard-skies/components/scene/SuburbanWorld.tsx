'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import { CHUNK_SIZE, RENDER_DISTANCE, HOUSE_MODELS, GRASS_MODEL } from '@/lib/terrain/chunkConstants';
import { generateChunkData } from '@/lib/terrain/chunkGenerator';
import House from './terrain/House';
import Tree from './terrain/Tree';
import GrassField from './terrain/GrassField';
import YardFence from './terrain/YardFence';
import Patio from './terrain/Patio';
import GardenBed from './terrain/GardenBed';
import RoadX from './terrain/RoadX';
import RoadZ from './terrain/RoadZ';

useGLTF.preload(GRASS_MODEL);
HOUSE_MODELS.forEach(url => useGLTF.preload(url));

function chunkKey(cx: number, cz: number) {
  return `${cx},${cz}`;
}

export default function SuburbanWorld() {
  const [activeChunks, setActiveChunks] = useState<Set<string>>(new Set());
  const lastChunkRef = useRef('');

  useFrame(() => {
    const { position } = useGameStore.getState();
    const cx = Math.floor(position[0] / CHUNK_SIZE);
    const cz = Math.floor(position[2] / CHUNK_SIZE);
    const key = chunkKey(cx, cz);

    if (key === lastChunkRef.current) return;
    lastChunkRef.current = key;

    const newChunks = new Set<string>();
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        newChunks.add(chunkKey(cx + dx, cz + dz));
      }
    }
    setActiveChunks(newChunks);
  });

  const chunks = useMemo(() => Array.from(activeChunks), [activeChunks]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#4A8A50" roughness={0.92} />
      </mesh>

      {chunks.map(key => {
        const [cx, cz] = key.split(',').map(Number);
        return <Chunk key={key} cx={cx} cz={cz} />;
      })}
    </group>
  );
}

function Chunk({ cx, cz }: { cx: number; cz: number }) {
  const data = useMemo(() => generateChunkData(cx, cz), [cx, cz]);
  const ox = cx * CHUNK_SIZE;
  const oz = cz * CHUNK_SIZE;

  return (
    <group position={[ox, 0, oz]}>
      {data.hasRoadX && <RoadX />}
      {data.hasRoadZ && <RoadZ />}

      <Suspense fallback={null}>
        {data.houses.map((h, i) => (
          <group key={`hg${i}`}>
            <House {...h} />
            <YardFence
              x={h.x}
              z={h.z}
              w={h.w + 4}
              d={h.d + 6}
              rot={h.rot}
              fenceColor={h.fenceColor}
            />
            {h.hasPatio && <Patio x={h.x} z={h.z} w={h.w} rot={h.rot} />}
          </group>
        ))}
      </Suspense>

      {data.trees.map((t, i) => (
        <Tree key={`t${i}`} {...t} />
      ))}

      {data.gardenBeds.map((g, i) => (
        <GardenBed key={`gb${i}`} {...g} />
      ))}

      <Suspense fallback={null}>
        <GrassField
          houses={data.houses}
          hasRoadX={data.hasRoadX}
          hasRoadZ={data.hasRoadZ}
        />
      </Suspense>
    </group>
  );
}

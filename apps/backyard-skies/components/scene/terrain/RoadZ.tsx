'use client';

import { CHUNK_SIZE } from '@/lib/terrain/chunkConstants';

export default function RoadZ() {
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[CHUNK_SIZE, 4.5]} />
        <meshStandardMaterial color="#484848" roughness={0.85} />
      </mesh>
      {[-16, -8, 0, 8, 16].map(x => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, 0]}>
          <planeGeometry args={[3, 0.12]} />
          <meshStandardMaterial color="#D4C94A" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

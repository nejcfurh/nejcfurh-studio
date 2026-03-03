'use client';

import { GardenBedData } from '@/lib/terrain/chunkGenerator';

export default function GardenBed({ x, z, rot, w }: GardenBedData) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[w, 0.12, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.95} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={side} position={[0, 0.08, side * 0.45]}>
          <boxGeometry args={[w + 0.1, 0.1, 0.08]} />
          <meshStandardMaterial color="#9E9690" roughness={0.9} />
        </mesh>
      ))}
      {[0, 1, 2].map(i => {
        const px = (i - 1) * w * 0.3;
        const colors = ['#E85D75', '#FFD700', '#FF69B4'];
        return (
          <mesh key={i} position={[px, 0.18, 0]}>
            <sphereGeometry args={[0.1, 4, 4]} />
            <meshStandardMaterial color={colors[i]} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

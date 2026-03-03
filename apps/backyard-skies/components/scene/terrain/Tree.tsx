'use client';

import { TreeData } from '@/lib/terrain/chunkGenerator';

export default function Tree({ x, z, height, type }: TreeData) {
  return (
    <group position={[x, 0, z]}>
      {/* TRUNK */}
      <mesh position={[0, height * 0.28, 0]}>
        <cylinderGeometry args={[0.12, 0.18, height * 0.55, 6]} />
        <meshStandardMaterial color="#6B4226" roughness={0.9} />
      </mesh>

      {type === 'pine' ? (
        <>
          <mesh position={[0, height * 0.5, 0]}>
            <coneGeometry args={[1.4, height * 0.45, 6]} />
            <meshStandardMaterial color="#2A6B35" roughness={0.85} />
          </mesh>
          <mesh position={[0, height * 0.7, 0]}>
            <coneGeometry args={[1.0, height * 0.35, 6]} />
            <meshStandardMaterial color="#338040" roughness={0.85} />
          </mesh>
          <mesh position={[0, height * 0.85, 0]}>
            <coneGeometry args={[0.6, height * 0.25, 6]} />
            <meshStandardMaterial color="#3D9048" roughness={0.85} />
          </mesh>
        </>
      ) : type === 'round' ? (
        <>
          <mesh position={[0, height * 0.7, 0]}>
            <sphereGeometry args={[1.6, 8, 6]} />
            <meshStandardMaterial color="#3A8A48" roughness={0.9} />
          </mesh>
          <mesh position={[0.5, height * 0.65, 0.3]}>
            <sphereGeometry args={[1.0, 7, 5]} />
            <meshStandardMaterial color="#45994F" roughness={0.9} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, height * 0.65, 0]}>
            <dodecahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial color="#4E9A58" roughness={0.88} />
          </mesh>
          <mesh position={[0.6, height * 0.6, 0.4]}>
            <dodecahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial color="#5AAA60" roughness={0.88} />
          </mesh>
          <mesh position={[-0.4, height * 0.72, -0.3]}>
            <dodecahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#42904C" roughness={0.88} />
          </mesh>
        </>
      )}
    </group>
  );
}

'use client';

export interface PatioProps {
  x: number;
  z: number;
  w: number;
  rot: number;
}

export default function Patio({ x, z, w, rot }: PatioProps) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.03, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w + 1, 2.5]} />
        <meshStandardMaterial color="#B0A898" roughness={0.85} />
      </mesh>
    </group>
  );
}

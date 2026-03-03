'use client';

export interface YardFenceProps {
  x: number;
  z: number;
  w: number;
  d: number;
  rot: number;
  fenceColor: string;
}

export default function YardFence({ x, z, w, d, rot, fenceColor }: YardFenceProps) {
  const halfW = w / 2;
  const halfD = d / 2;
  const h = 0.85;

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {[
        [-halfW, halfD],
        [halfW, halfD],
        [-halfW, -halfD],
        [halfW, -halfD],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, h / 2, pz]}>
          <boxGeometry args={[0.06, h, 0.06]} />
          <meshStandardMaterial color={fenceColor} roughness={0.85} />
        </mesh>
      ))}

      <mesh position={[0, 0.55, halfD]}>
        <boxGeometry args={[w, 0.04, 0.04]} />
        <meshStandardMaterial color={fenceColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.55, -halfD]}>
        <boxGeometry args={[w, 0.04, 0.04]} />
        <meshStandardMaterial color={fenceColor} roughness={0.85} />
      </mesh>
      {[-halfW, halfW].map((sx, i) => (
        <mesh
          key={`sr${i}`}
          position={[sx, 0.55, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[d, 0.04, 0.04]} />
          <meshStandardMaterial color={fenceColor} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

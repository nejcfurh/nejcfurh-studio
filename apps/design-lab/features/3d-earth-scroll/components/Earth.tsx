'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useScroll, type MotionValue } from '@repo/ui/animation';
import { useRef } from 'react';
import { Mesh, TextureLoader } from 'three';

type GlobeProps = {
  scrollYProgress: MotionValue<number>;
};

const Globe = ({ scrollYProgress }: GlobeProps) => {
  const meshRef = useRef<Mesh>(null);

  const [color, normal, aoMap] = useLoader(TextureLoader, [
    '/images/3d-earth-scroll/color.jpg',
    '/images/3d-earth-scroll/normal.png',
    '/images/3d-earth-scroll/occlusion.jpg'
  ]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollYProgress.get();
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
    </mesh>
  );
};

const Earth = () => {
  const earthRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: earthRef,
    offset: ['start end', 'end start']
  });

  return (
    <Canvas ref={earthRef}>
      <ambientLight intensity={1.4} />
      <Globe scrollYProgress={scrollYProgress} />
    </Canvas>
  );
};

export default Earth;

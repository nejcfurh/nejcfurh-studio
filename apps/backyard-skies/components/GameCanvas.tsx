'use client';

import { memo, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import PlayerBird from '@/components/scene/PlayerBird';
import ThirdPersonCamera from '@/components/scene/ThirdPersonCamera';
import SuburbanWorld from '@/components/scene/SuburbanWorld';
import FeederSpawner from '@/components/scene/FeederSpawner';
import Eagle from '@/components/scene/Eagle';
import GameEnvironment from '@/components/scene/GameEnvironment';
import GameLoopRunner from '@/components/GameLoopRunner';
import FeatherBurst from '@/components/scene/FeatherBurst';
import LandingParticles from '@/components/scene/LandingParticles';
import DeathCat from '@/components/scene/DeathCat';
import { EffectComposer, Vignette, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

function DyingChromaticAberration() {
  const offsetRef = useRef(new THREE.Vector2(0, 0));
  const timerRef = useRef(0);

  useFrame((_, delta) => {
    const gameState = useGameStore.getState().gameState;
    if (gameState === 'dying') {
      timerRef.current += delta;
      const t = Math.min(timerRef.current / 2, 1);
      const offset = t * 0.008;
      offsetRef.current.set(offset, offset);
    } else {
      timerRef.current = 0;
      offsetRef.current.set(0, 0);
    }
  });

  return <ChromaticAberration offset={offsetRef.current} />;
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Vignette darkness={0.4} offset={0.3} />
      <Bloom luminanceThreshold={0.8} intensity={0.3} mipmapBlur />
      <DyingChromaticAberration />
    </EffectComposer>
  );
}

function SceneContent() {
  const gameState = useGameStore((s) => s.gameState);
  const isPlaying = gameState === 'flight' || gameState === 'feeding' || gameState === 'drinking' || gameState === 'dying';

  if (!isPlaying) return null;

  return (
    <>
      <GameEnvironment />
      <SuburbanWorld />
      <FeederSpawner />
      <Suspense fallback={null}>
        <PlayerBird />
      </Suspense>
      <Eagle />
      <DeathCat />
      <FeatherBurst />
      <LandingParticles />
      <ThirdPersonCamera />
      <GameLoopRunner />
      <PostProcessing />
    </>
  );
}

const StableCanvas = memo(function StableCanvas() {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 180 }}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1]}
    >
      <SceneContent />
    </Canvas>
  );
});

export default function GameCanvas() {
  const gameState = useGameStore((s) => s.gameState);
  const showCanvas = gameState === 'flight' || gameState === 'feeding' || gameState === 'drinking' || gameState === 'dying';

  if (!showCanvas) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <StableCanvas />
    </div>
  );
}

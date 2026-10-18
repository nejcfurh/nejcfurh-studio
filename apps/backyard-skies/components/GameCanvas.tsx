'use client';

import GameLoopRunner from '@/components/GameLoopRunner';
import DeathCat from '@/components/scene/DeathCat';
import Eagle from '@/components/scene/Eagle';
import FeatherBurst from '@/components/scene/FeatherBurst';
import FeederSpawner from '@/components/scene/FeederSpawner';
import GameEnvironment from '@/components/scene/GameEnvironment';
import LandingParticles from '@/components/scene/LandingParticles';
import PlayerBird from '@/components/scene/PlayerBird';
import SuburbanWorld from '@/components/scene/SuburbanWorld';
import ThirdPersonCamera from '@/components/scene/ThirdPersonCamera';
import { DistantFlock } from '@/components/scene/world/DistantFlock';
import { WindStreaks } from '@/components/scene/world/WindStreaks';
import { useGameStore } from '@/store/gameStore';
import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ChromaticAberration,
  EffectComposer,
  ToneMapping,
  Vignette
} from '@react-three/postprocessing';
import {
  Component,
  memo,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState
} from 'react';
import * as THREE from 'three';

// postprocessing's ToneMappingMode.NEUTRAL. The composer renders the scene
// untone-mapped into a float buffer, so tone mapping has to run as an effect.
const NEUTRAL = 8;
const EXPOSURE = 1.0;

// Always mounted at zero offset: mounting it at death rebuilt the effect pass
// and compiled its shaders on that frame (a 40 ms hitch).
function DyingChromaticAberration() {
  const offsetRef = useRef(new THREE.Vector2(0, 0));
  const timerRef = useRef(0);

  useFrame((_, delta) => {
    if (useGameStore.getState().gameState !== 'dying') {
      timerRef.current = 0;
      offsetRef.current.set(0, 0);
      return;
    }
    timerRef.current += Math.min(delta, 0.05);
    const offset = Math.min(timerRef.current / 2, 1) * 0.008;
    offsetRef.current.set(offset, offset);
  });

  // eslint-disable-next-line react-hooks/refs
  return <ChromaticAberration offset={offsetRef.current} />;
}

function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <ToneMapping mode={NEUTRAL} />
      <Vignette darkness={0.35} offset={0.3} />
      <DyingChromaticAberration />
    </EffectComposer>
  );
}

// Without post-processing the renderer's own Neutral tone mapping takes over, so
// a failed composer degrades the look instead of stopping the frame loop.
class PostProcessingBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The composer reads context attributes when passes are added, which throws
 * while the context is lost, so it is unmounted until the context returns.
 */
function useWebGLContextState() {
  const gl = useThree((s) => s.gl);
  const [state, setState] = useState({ lost: false, restores: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      setState((s) => ({ ...s, lost: true }));
      useGameStore.getState().pauseGame();
    };
    const onRestored = () => {
      setState((s) => ({ lost: false, restores: s.restores + 1 }));
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl]);

  return state;
}

// Development-only hook for measuring render cost from the browser console.
function RenderInfoProbe() {
  const gl = useThree((s) => s.gl);
  // Post-processing renders several passes per frame; reset once per frame so
  // the counters hold the whole frame instead of the last fullscreen pass.
  useFrame((state) => {
    if (process.env.NODE_ENV !== 'development') return;
    state.gl.info.autoReset = false;
    state.gl.info.reset();
  });
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const w = window as unknown as { __renderInfo?: () => object };
    w.__renderInfo = () => ({
      ...gl.info.render,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
      dpr: gl.getPixelRatio()
    });
    return () => {
      delete w.__renderInfo;
    };
  }, [gl]);
  return null;
}

// Mounts only once every sibling in its Suspense boundary has loaded.
function SceneReadySignal() {
  useEffect(() => {
    useGameStore.setState({ sceneReady: true });
  }, []);
  return null;
}

function SceneContent() {
  const gameState = useGameStore((s) => s.gameState);
  const isPlaying =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking' ||
    gameState === 'dying';

  const context = useWebGLContextState();

  if (!isPlaying) return null;

  // Anything that suspends must sit under this boundary, not the Canvas root:
  // a root-level suspension hides the scene and R3F never resumes its frame loop.
  return (
    <>
      <RenderInfoProbe />
      <GameEnvironment />
      <Suspense fallback={null}>
        <SuburbanWorld />
        <FeederSpawner />
        <PlayerBird />
        <SceneReadySignal />
      </Suspense>
      <Eagle />
      <DeathCat />
      <FeatherBurst />
      <LandingParticles />
      <WindStreaks />
      <DistantFlock />
      <ThirdPersonCamera />
      <GameLoopRunner />
      {!context.lost && (
        <PostProcessingBoundary key={context.restores}>
          <PostProcessing />
        </PostProcessingBoundary>
      )}
    </>
  );
}

function maxPixelRatio() {
  const touch =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
  return touch ? 1.75 : 2;
}

// The pixel ratio is tuned for 60 fps whatever the display refresh: drei's
// default bounds follow the fastest rate it has seen, so a 120 Hz phone
// steady at 60-100 fps never got its resolution back after a dip. The gap
// between the bounds keeps a frame rate near one of them from stepping back
// and forth.
const TARGET_FPS = 60;
function dprBounds(): [number, number] {
  return [TARGET_FPS * 0.8, TARGET_FPS * 0.95];
}

// Each step moves a quarter of the way between 1 and the cap.
const DPR_STEP = 0.25;
// After this many changes of direction the ratio settles on the lower value.
const MAX_REVERSALS = 3;

/**
 * Measures only after the scene has loaded and settled, so shader compiles
 * and model loads do not drop the pixel ratio for the whole run.
 *
 * drei's `flipflops` counts every incline, including the ones that cannot
 * raise an already capped ratio, so a device that holds full speed reached
 * its fallback after a few seconds and dropped to 1. Reversals are counted
 * here from actual changes instead.
 */
function AdaptivePixelRatio({
  onChange
}: {
  onChange: (factor: number) => void;
}) {
  const sceneReady = useGameStore((s) => s.sceneReady);
  const [armed, setArmed] = useState(false);
  const state = useRef({ factor: 1, direction: 0, reversals: 0 });

  useEffect(() => {
    if (!sceneReady) return;
    const timer = setTimeout(() => setArmed(true), 3000);
    return () => clearTimeout(timer);
  }, [sceneReady]);

  if (!armed) return null;
  return (
    <PerformanceMonitor
      factor={1}
      step={DPR_STEP}
      bounds={dprBounds}
      onChange={({ factor }) => {
        const s = state.current;
        const direction = Math.sign(factor - s.factor);
        if (direction === 0) return;
        if (s.direction !== 0 && direction !== s.direction) s.reversals++;
        // Once it has oscillated, only let it step down: a phone that heats
        // up later in the run still needs to shed resolution.
        if (s.reversals >= MAX_REVERSALS && direction > 0) return;
        s.direction = direction;
        s.factor = factor;
        onChange(factor);
      }}
    />
  );
}

const StableCanvas = memo(function StableCanvas() {
  const [maxDpr] = useState(maxPixelRatio);
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 200 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={[1, dpr]}
      shadows="percentage"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = EXPOSURE;
      }}
    >
      <AdaptivePixelRatio
        onChange={(factor) =>
          setDpr(Math.round((1 + (maxDpr - 1) * factor) * 100) / 100)
        }
      />
      <SceneContent />
    </Canvas>
  );
});

export default function GameCanvas() {
  const gameState = useGameStore((s) => s.gameState);
  const showCanvas =
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking' ||
    gameState === 'dying';

  if (!showCanvas) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <StableCanvas />
    </div>
  );
}

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { BirdbuddyFeeder, BirdbuddyBath } from '@/components/scene/Feeder';
import { ObjMtlModel } from '@/components/scene/ObjMtlModel';
import GltfBirdModel from '@/components/scene/GltfBirdModel';
import { useState, Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function TestPage() {
  const [showFeeder, setShowFeeder] = useState(true);
  const [showBath, setShowBath] = useState(true);
  const [showCatModel, setShowCatModel] = useState(true);
  const [showEagle, setShowEagle] = useState(true);
  const [showBird, setShowBird] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [birdFlap, setBirdFlap] = useState(false);
  const [showGrass, setShowGrass] = useState(true);
  const [grassScale, setGrassScale] = useState(1);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1a2e' }}>
      {/* CONTROLS */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          padding: '16px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          color: 'white',
          fontSize: '13px',
          fontFamily: 'monospace',
        }}
      >
        <span style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: 4 }}>
          Feeder Test Bench
        </span>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showFeeder}
            onChange={() => setShowFeeder(!showFeeder)}
          />
          Feeder
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showBath}
            onChange={() => setShowBath(!showBath)}
          />
          Birdbath
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showCatModel}
            onChange={() => setShowCatModel(!showCatModel)}
          />
          Cat
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showEagle}
            onChange={() => setShowEagle(!showEagle)}
          />
          Eagle
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showBird}
            onChange={() => setShowBird(!showBird)}
          />
          Bird (GLTF)
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
          />
          Grid
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={showGrass}
            onChange={() => setShowGrass(!showGrass)}
          />
          Grass Tuft
        </label>
        {showGrass && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Scale: {grassScale.toFixed(1)}
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.1"
              value={grassScale}
              onChange={e => setGrassScale(parseFloat(e.target.value))}
              style={{ width: 100 }}
            />
          </label>
        )}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            margin: '4px 0',
          }}
        />
        <button
          onClick={() => {
            setBirdFlap(true);
            setTimeout(() => setBirdFlap(false), 50);
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#00AEEF',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Flap GLTF Bird
        </button>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
          Drag to orbit / Scroll to zoom
          <br />
          Edit Feeder.tsx — to see changes live
        </span>
      </div>

      <Canvas
        camera={{ position: [4, 3, 4], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#87CEEB']} />

        <ambientLight intensity={0.5} color="#FFF8E1" />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.5}
          color="#FFF5E6"
        />
        <hemisphereLight args={['#87CEEB', '#4A7C59', 0.4]} />

        {/* GROUND */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#4A8A50" roughness={0.92} />
        </mesh>

        {showGrid && (
          <Grid
            args={[20, 20]}
            position={[0, 0.01, 0]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#666"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#999"
            fadeDistance={15}
            fadeStrength={1}
          />
        )}

        {/* FEEDER - CENTERED AT ORIGIN */}
        {showFeeder && (
          <group position={[-2, 0, 0]}>
            <BirdbuddyFeeder />
            {/* HEIGHT MARKERS */}
            <HeightMarker y={1.6} />
            <HeightMarker y={1.85} color="#ff6b6b" />
            <HeightMarker y={2.2} color="#ffd43b" />
          </group>
        )}

        {/* BIRDBATH - OFFSET TO THE RIGHT */}
        {showBath && (
          <group position={[2, 0, 0]}>
            <BirdbuddyBath />
            <HeightMarker y={0.25} />
            <HeightMarker y={0.35} color="#ff6b6b" />
          </group>
        )}

        {/* EAGLE - OBJ MODEL (BY ROBERT MIRABELLE [CC-BY] VIA POLY PIZZA) */}
        {showEagle && (
          <ObjMtlModel
            baseUrl="/models/myeagle/wind_eagle"
            scale={0.03}
            position={[0, 3, -3]}
            rotation={[0, Math.PI, 0]}
          />
        )}

        {/* BIRD GLTF MODEL */}
        {showBird && (
          <Suspense fallback={null}>
            <group position={[0, 0, 3]}>
              <GltfBirdModel isFlapping={birdFlap} scale={5} />
            </group>
          </Suspense>
        )}

        {/* CAT OBJ/MTL MODEL - CENTER, SCALED TO FIT */}
        {showCatModel && (
          <ObjMtlModel
            baseUrl="/models/mycat/model"
            scale={0.03}
            position={[3, 0, 4]}
            rotation={[1.5, -3.15, -3]}
          />
        )}

        {/* GRASS TUFT GLB MODEL */}
        {showGrass && (
          <Suspense fallback={null}>
            <GrassTestModel scale={grassScale} />
          </Suspense>
        )}

        <OrbitControls
          makeDefault
          minDistance={1.5}
          maxDistance={15}
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  );
}

function GrassTestModel({ scale }: { scale: number }) {
  const { scene } = useGLTF('/models/grass/Tuft%20of%20grass.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={[0, 0, -3]} scale={0.01}>
      <primitive object={clone} />
    </group>
  );
}

function HeightMarker({
  y,

  color = '#69db7c',
}: {
  y: number;

  color?: string;
}) {
  return (
    <group position={[0, y, 0]}>
      {/* THIN HORIZONTAL LINE */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.82, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

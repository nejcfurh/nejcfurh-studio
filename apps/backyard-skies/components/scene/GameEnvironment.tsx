'use client';

import { CHUNK_SIZE, RENDER_DISTANCE } from '@/lib/terrain/chunkConstants';
import { useGameStore } from '@/store/gameStore';
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Clouds } from './world/Clouds';

// Radial fog: depth-based fog thins out towards the screen edges and shifts
// as the camera turns, which exposes the edge of the loaded chunks. The
// distance is taken per fragment because it does not interpolate linearly
// across large triangles such as the ground plane.
THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying vec3 vFogPosition;
#endif
`;
THREE.ShaderChunk.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  vFogPosition = mvPosition.xyz;
#endif
`;
THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying vec3 vFogPosition;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif
`;
THREE.ShaderChunk.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  float vFogDepth = length( vFogPosition );
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif
`;

const SUN_ELEVATION = THREE.MathUtils.degToRad(28);
const SUN_AZIMUTH = THREE.MathUtils.degToRad(-125);
const SUN_DIRECTION = new THREE.Vector3(
  Math.cos(SUN_ELEVATION) * Math.sin(SUN_AZIMUTH),
  Math.sin(SUN_ELEVATION),
  Math.cos(SUN_ELEVATION) * Math.cos(SUN_AZIMUTH)
).normalize();

const SKY_ZENITH = '#2c6cc4';
const SKY_HORIZON = '#a9c7e2';
const SUN_GLOW = '#ffcf94';
const SUN_COLOR = '#ffd9a6';

// Chunks appear and disappear at least RENDER_DISTANCE chunks from the bird;
// the chase/death camera trails it by up to ~20 units, so everything must be
// fully fogged before that radius or the chunk swap is visible.
const FOG_NEAR = 60;
const FOG_FAR = RENDER_DISTANCE * CHUNK_SIZE - 20;

const SHADOW_HALF_EXTENT = 38;
const SHADOW_LEAD = 15;
const SHADOW_DISTANCE = 80;

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragment = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGlow;
uniform vec3 uSunDir;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = max(d.y, 0.0);
  // Eases out of the horizon colour; a steeper start draws a seam where the
  // fogged ground meets the sky.
  vec3 col = mix(uHorizon, uZenith, 1.0 - pow(1.0 - h, 2.5));
  float s = max(dot(d, uSunDir), 0.0);
  // Glow starts above the horizon so the horizon line keeps the fog colour.
  float above = smoothstep(0.0, 0.15, d.y);
  col += uGlow * (pow(s, 6.0) * 0.35 + pow(s, 48.0) * 0.5) * above;
  col += uGlow * smoothstep(0.9990, 0.9995, s) * 3.0 * above;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

function SkyDome() {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uZenith: { value: new THREE.Color(SKY_ZENITH) },
          uHorizon: { value: new THREE.Color(SKY_HORIZON) },
          uGlow: { value: new THREE.Color(SUN_GLOW) },
          uSunDir: { value: SUN_DIRECTION.clone() }
        },
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthTest: false,
        depthWrite: false
      }),
    []
  );

  useFrame(({ camera }) => {
    meshRef.current?.position.copy(camera.position);
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      renderOrder={-1000}
      frustumCulled={false}
    >
      <sphereGeometry args={[100, 24, 12]} />
    </mesh>
  );
}

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _center = new THREE.Vector3();

function Sun() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const mapSize = useMemo(() => (isTouchDevice() ? 1024 : 2048), []);
  const texel = (SHADOW_HALF_EXTENT * 2) / mapSize;
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.target = target;
    scene.add(target);
    const cam = light.shadow.camera;
    cam.left = -SHADOW_HALF_EXTENT;
    cam.right = SHADOW_HALF_EXTENT;
    cam.top = SHADOW_HALF_EXTENT;
    cam.bottom = -SHADOW_HALF_EXTENT;
    cam.near = 1;
    cam.far = SHADOW_DISTANCE * 2;
    cam.updateProjectionMatrix();
    return () => {
      scene.remove(target);
    };
  }, [scene, target]);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    const { position, rotation } = useGameStore.getState();

    // Lead the shadow box ahead of the bird: the chase camera sees far more
    // ground in front of it than behind.
    _center.set(
      position[0] + Math.sin(rotation) * SHADOW_LEAD,
      0,
      position[2] + Math.cos(rotation) * SHADOW_LEAD
    );

    // Snap the box to whole shadow-map texels in light space so static
    // shadows do not shimmer while the box follows the bird.
    _right.crossVectors(THREE.Object3D.DEFAULT_UP, SUN_DIRECTION).normalize();
    _up.crossVectors(SUN_DIRECTION, _right);
    const a = Math.round(_center.dot(_right) / texel) * texel;
    const b = Math.round(_center.dot(_up) / texel) * texel;
    const c = _center.dot(SUN_DIRECTION);
    _center
      .copy(_right)
      .multiplyScalar(a)
      .addScaledVector(_up, b)
      .addScaledVector(SUN_DIRECTION, c);

    target.position.copy(_center);
    target.updateMatrixWorld();
    light.position
      .copy(_center)
      .addScaledVector(SUN_DIRECTION, SHADOW_DISTANCE);
  });

  return (
    <directionalLight
      ref={lightRef}
      color={SUN_COLOR}
      intensity={2.5}
      castShadow
      shadow-mapSize={[mapSize, mapSize]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.04}
    />
  );
}

export default function GameEnvironment() {
  return (
    <>
      <color attach="background" args={[SKY_HORIZON]} />
      <fog attach="fog" args={[SKY_HORIZON, FOG_NEAR, FOG_FAR]} />
      <SkyDome />
      <Clouds horizon={SKY_HORIZON} />
      <hemisphereLight args={['#c4dcff', '#5e7a3c', 1.5]} />
      <Sun />
    </>
  );
}

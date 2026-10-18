'use client';

import { CHUNK_SIZE } from '@/lib/terrain/chunkConstants';
import { HouseData } from '@/lib/terrain/chunkGenerator';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const SPACING = 0.75;
const BLADES_PER_TUFT = 4;
const GRASS_BASE = new THREE.Color('#2f6a24');
const GRASS_TIP = new THREE.Color('#9ccc4c');

/** Lawn colour under the blades; also used for the ground plane. */
export const LAWN_COLOR = '#4d8a35';

/**
 * A tuft of single-triangle blades, 1 unit tall. Normals point straight up so
 * blades shade like the lawn they stand on instead of flickering with their
 * random facing; the vertex colour runs from a dark base to a light tip.
 */
function buildTuftGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  for (let b = 0; b < BLADES_PER_TUFT; b++) {
    const angle = (b / BLADES_PER_TUFT) * Math.PI + b * 0.4;
    const ox = Math.cos(angle * 2.3) * 0.08;
    const oz = Math.sin(angle * 2.3) * 0.08;
    const dx = Math.cos(angle) * 0.05;
    const dz = Math.sin(angle) * 0.05;
    const lean = 0.12 + 0.05 * b;
    const height = 0.75 + 0.25 * ((b * 7) % 3) * 0.5;
    positions.push(
      ox - dx,
      0,
      oz - dz,
      ox + dx,
      0,
      oz + dz,
      ox + Math.cos(angle + 1.6) * lean,
      height,
      oz + Math.sin(angle + 1.6) * lean
    );
    GRASS_BASE.toArray(colors, colors.length);
    GRASS_BASE.toArray(colors, colors.length);
    GRASS_TIP.toArray(colors, colors.length);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const normals = new Float32Array(positions.length);
  for (let i = 1; i < normals.length; i += 3) normals[i] = 1;
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  return geo;
}

const tuftGeometry = buildTuftGeometry();

/**
 * Lawn colour multiplier at a world position, shared by the ground plane and
 * the grass so both vary together: broad patches of lusher and drier lawn,
 * plus faint mowing stripes along the road that fade out with distance before
 * they shimmer.
 */
export const LAWN_TINT_GLSL = /* glsl */ `
float lawnHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float lawnNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(lawnHash(i), lawnHash(i + vec2(1.0, 0.0)), u.x),
    mix(lawnHash(i + vec2(0.0, 1.0)), lawnHash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
vec3 lawnTint(vec2 p, float viewDistance) {
  float n = lawnNoise(p * 0.03) * 0.65 + lawnNoise(p * 0.11 + 17.0) * 0.35;
  vec3 tint = mix(vec3(0.8, 0.9, 0.8), vec3(1.14, 1.08, 0.84), smoothstep(0.2, 0.8, n));
  float stripe = step(0.5, fract(p.y / 3.2)) * 2.0 - 1.0;
  float near = 1.0 - smoothstep(18.0, 40.0, viewDistance);
  return tint * (1.0 + stripe * 0.035 * near);
}
`;

/** Shared by every grass chunk; updated once per frame by the world. */
export const grassUniforms = {
  uTime: { value: 0 },
  uPlayer: { value: new THREE.Vector2() },
  uFadeStart: { value: CHUNK_SIZE * 0.62 },
  uFadeEnd: { value: CHUNK_SIZE * 0.95 }
};

const grassMaterial = new THREE.MeshLambertMaterial({
  vertexColors: true,
  side: THREE.DoubleSide
});
grassMaterial.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, grassUniforms);
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
uniform float uTime;
uniform vec2 uPlayer;
uniform float uFadeStart;
uniform float uFadeEnd;
${LAWN_TINT_GLSL}`
    )
    .replace(
      '#include <project_vertex>',
      /* glsl */ `
vec4 grassRoot = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vec4 grassWorld = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
// Blades sink into the lawn towards the edge of the grass ring so it ends
// without a visible border.
float grassFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, distance(grassRoot.xz, uPlayer));
grassWorld.xyz = grassRoot.xyz + (grassWorld.xyz - grassRoot.xyz) * grassFade;
float grassPhase = uTime * 1.7 + grassRoot.x * 0.31 + grassRoot.z * 0.23;
float grassSway = (sin(grassPhase) * 0.7 + sin(grassPhase * 2.37 + 1.3) * 0.3)
  * position.y * position.y * 0.12 * grassFade;
grassWorld.xz += vec2(0.8, 0.6) * grassSway;
vColor.rgb *= lawnTint(grassRoot.xz, distance(grassRoot.xyz, cameraPosition));
vec4 mvPosition = viewMatrix * grassWorld;
gl_Position = projectionMatrix * mvPosition;`
    );
  // Keep the up-facing normal on both sides of the blade; the default
  // double-sided flip would turn the back of every blade dark.
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_begin>',
    THREE.ShaderChunk.normal_fragment_begin.replace(
      'normal *= faceDirection;',
      ''
    )
  );
};

function hash(x: number, z: number, k: number) {
  return Math.abs(Math.sin(x * k + z * (k * 6.03)) * 43758.5453) % 1;
}

export function GrassField({
  houses,
  hasRoadX,
  hasRoadZ
}: {
  houses: HouseData[];
  hasRoadX: boolean;
  hasRoadZ: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const tufts = useMemo(() => {
    const out: { x: number; z: number; rot: number; s: number; t: number }[] =
      [];
    const half = CHUNK_SIZE / 2;
    for (let gx = -half; gx < half; gx += SPACING) {
      for (let gz = -half; gz < half; gz += SPACING) {
        if (hasRoadX && Math.abs(gz) < 3.5) continue;
        if (hasRoadZ && Math.abs(gx) < 3.5) continue;
        if (
          houses.some((h) => Math.abs(gx - h.x) < 4 && Math.abs(gz - h.z) < 4)
        )
          continue;
        const a = hash(gx, gz, 12.9898);
        const b = hash(gz, gx, 78.233);
        out.push({
          x: gx + (a - 0.5) * SPACING * 0.9,
          z: gz + (b - 0.5) * SPACING * 0.9,
          rot: a * Math.PI * 2,
          s: 0.32 + b * 0.22,
          t: 0.85 + a * 0.25
        });
      }
    }
    return out;
  }, [houses, hasRoadX, hasRoadZ]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    tufts.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, p.rot, 0);
      dummy.scale.set(1, p.s, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.setRGB(p.t, p.t * 1.02, p.t * 0.9));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [tufts]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[tuftGeometry, grassMaterial, tufts.length]}
      receiveShadow
    />
  );
}

'use client';

import { CHUNK_SIZE } from '@/lib/terrain/chunkConstants';
import { ChunkData, HouseData } from '@/lib/terrain/chunkGenerator';
import { HouseProp, houseProps, isPaved } from '@/lib/terrain/houseProps';
import { getChunkData } from '@/lib/terrain/terrainCollision';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  buildTuftGeometry,
  FLOWER_COLORS,
  FLOWER_EYE,
  GRASS_DENSITY_GLSL,
  grassDensity,
  TUFT_HEAD_ANCHOR
} from './grassGeometry';
import { WIND_GLSL } from './wind';

/** Grid spacing of tuft candidates; the nearest lawn keeps every one. */
const SPACING = 0.5;
/** Tufts are grouped into square tiles that are culled and thinned together. */
const TILE = 5;
const TILES = Math.ceil(CHUNK_SIZE / TILE);
// Covers a tile's corners, the tallest blade and a frame of camera movement.
const TILE_CULL_RADIUS = TILE * Math.SQRT1_2 + 2.5;

/** Lawn colour under the blades; also used for the ground plane. */
export const LAWN_COLOR = '#4d8a35';

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
  uFadeStart: { value: 56 },
  uFadeEnd: { value: 70 }
};

const tuftGeometry = buildTuftGeometry();

const v3 = (v: THREE.Vector3) =>
  `vec3(${v.x.toFixed(4)}, ${v.y.toFixed(4)}, ${v.z.toFixed(4)})`;

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
/** Chunk-local x, z; yaw; height scale. */
attribute vec4 aTuft;
/** Rank within its tile (thinning order); flower colour index, 0 for none. */
attribute vec2 aMeta;
attribute float aHead;
${LAWN_TINT_GLSL}
${WIND_GLSL}
${GRASS_DENSITY_GLSL}
vec3 flowerColor(float i) {
  return i < 1.5 ? ${v3(FLOWER_COLORS[0])} : (i < 2.5 ? ${v3(FLOWER_COLORS[1])} : ${v3(FLOWER_COLORS[2])});
}`
    )
    .replace(
      '#include <color_vertex>',
      /* glsl */ `#include <color_vertex>
vec2 grassRoot = (modelMatrix * vec4(aTuft.x, 0.0, aTuft.y, 1.0)).xz;
// Blades sink into the lawn towards the edge of the grass ring so it ends
// without a visible border, and tufts beyond the density for their distance
// shrink away in rank order.
float grassFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, distance(grassRoot, uPlayer));
float grassKeep = grassDensity(distance(vec3(grassRoot.x, 0.0, grassRoot.y), cameraPosition));
grassFade *= 1.0 - smoothstep(grassKeep - 0.08, grassKeep, aMeta.x);
float grassGust = windGust(grassRoot, uTime);
float grassFlower = step(0.5, aHead) * step(0.5, aMeta.y);
float grassEye = step(1.5, aHead);
float grassHash = lawnHash(grassRoot * 3.7);
vec3 grassTone = vec3(0.92 + grassHash * 0.16, 0.95 + fract(grassHash * 7.3) * 0.12, 0.85 + fract(grassHash * 13.1) * 0.2);
vColor.rgb *= grassTone * lawnTint(grassRoot, distance(grassRoot, cameraPosition.xz));
// Gusts flatten the blades so their lighter sides catch the sun.
vColor.rgb *= 1.0 + grassGust * 0.22 * position.y;
vColor.rgb = mix(vColor.rgb, flowerColor(aMeta.y) * mix(vec3(1.0), ${v3(FLOWER_EYE)}, grassEye), grassFlower);`
    )
    .replace(
      '#include <beginnormal_vertex>',
      'vec3 objectNormal = vec3(0.0, 1.0, 0.0);'
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `
vec3 grassLocal = mix(position, ${v3(TUFT_HEAD_ANCHOR)}, step(0.5, aHead) * (1.0 - step(0.5, aMeta.y)));
// Thinned tufts spread wider and a little taller to cover for the ones dropped.
float grassSpread = min(inversesqrt(grassKeep), 2.2);
grassLocal.y *= aTuft.w * (1.0 + 0.15 * (grassSpread - 1.0));
grassLocal.xz *= (0.55 + 0.45 * aTuft.w) * grassSpread;
float grassC = cos(aTuft.z);
float grassS = sin(aTuft.z);
grassLocal.xz = vec2(grassC * grassLocal.x - grassS * grassLocal.z, grassS * grassLocal.x + grassC * grassLocal.z);
float grassPhase = uTime * 1.7 + grassRoot.x * 0.31 + grassRoot.y * 0.23;
float grassBend = (sin(grassPhase) * 0.7 + sin(grassPhase * 2.37 + 1.3) * 0.3) * (0.08 + grassGust * 0.08)
  + grassGust * 0.32;
float grassH = position.y * position.y;
grassLocal.xz += WIND_DIR * grassBend * grassH * aTuft.w;
grassLocal.y -= abs(grassBend) * grassH * aTuft.w * 0.35;
vec3 transformed = vec3(aTuft.x, 0.0, aTuft.y) + grassLocal * grassFade;`
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

function valueNoise(x: number, z: number) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const h = (a: number, b: number) => hash(a, b, 41.17);
  const top = h(ix, iz) + (h(ix + 1, iz) - h(ix, iz)) * ux;
  const bottom = h(ix, iz + 1) + (h(ix + 1, iz + 1) - h(ix, iz + 1)) * ux;
  return top + (bottom - top) * uz;
}

interface Tile {
  /** Tile centre, chunk-local. */
  x: number;
  z: number;
  count: number;
  /** aTuft values, four per tuft, in thinning order. */
  tuft: Float32Array;
  /** aMeta values, two per tuft. */
  meta: Float32Array;
}

// Driveways, walkways and porch slabs, placed once per chunk load. Keyed by
// the memoised chunk data, so a chunk that unloads takes its entry with it.
const propsByChunk = new WeakMap<ChunkData, HouseProp[]>();
function chunkProps(cx: number, cz: number): HouseProp[] {
  const data = getChunkData(cx, cz);
  let props = propsByChunk.get(data);
  if (!props) {
    props = houseProps(data, cx, cz);
    propsByChunk.set(data, props);
  }
  return props;
}

function tileIndex(local: number) {
  return THREE.MathUtils.clamp(
    Math.floor((local + CHUNK_SIZE / 2) / TILE),
    0,
    TILES - 1
  );
}

/** The chunk's tufts, chunk-local, sorted into tiles; ox/oz is its origin. */
function buildTiles(
  houses: HouseData[],
  hasRoadX: boolean,
  hasRoadZ: boolean,
  ox: number,
  oz: number
): Tile[] {
  const half = CHUNK_SIZE / 2;
  const props = chunkProps(
    Math.round(ox / CHUNK_SIZE),
    Math.round(oz / CHUNK_SIZE)
  );
  // Only props that reach a tile are tested against its tufts.
  const tileProps = Array.from({ length: TILES * TILES }, (_, i) => {
    const tx = ox - half + ((i % TILES) + 0.5) * TILE;
    const tz = oz - half + (Math.floor(i / TILES) + 0.5) * TILE;
    return props.filter((p) => {
      const reach = Math.hypot(p.sx, p.sz) / 2 + TILE * Math.SQRT1_2 + 1;
      return Math.abs(p.x - tx) < reach && Math.abs(p.z - tz) < reach;
    });
  });
  const cells: { key: number; v: number[] }[][] = Array.from(
    { length: TILES * TILES },
    () => []
  );
  const steps = Math.round(CHUNK_SIZE / SPACING);
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const gx = -half + i * SPACING;
      const gz = -half + j * SPACING;
      if (hasRoadX && Math.abs(gz) < 3.5) continue;
      if (hasRoadZ && Math.abs(gx) < 3.5) continue;
      if (houses.some((h) => Math.abs(gx - h.x) < 4 && Math.abs(gz - h.z) < 4))
        continue;
      // World coordinates seed the randomness, so chunks do not repeat.
      const wx = ox + gx;
      const wz = oz + gz;
      const a = hash(wx, wz, 12.9898);
      const b = hash(wz, wx, 78.233);
      const x = gx + (a - 0.5) * SPACING * 0.9;
      const z = gz + (b - 0.5) * SPACING * 0.9;
      const tile = tileIndex(z) * TILES + tileIndex(x);
      const nearby = tileProps[tile];
      if (nearby.length > 0 && isPaved(nearby, ox + x, oz + z, 0.2)) continue;
      const clump = valueNoise(wx * 0.33, wz * 0.33);
      const scale = 0.34 + clump * 0.28 + b * 0.12;
      const patch = valueNoise(wx * 0.09 + 5, wz * 0.09 + 11);
      const c = hash(wx, wz, 3.137);
      let flower = 0;
      if ((patch > 0.66 && c < 0.25) || c < 0.008) {
        flower = 1 + Math.floor(valueNoise(wx * 0.05, wz * 0.05 + 40) * 3);
      }
      cells[tile].push({
        key: hash(wx, wz, 91.7),
        v: [x, z, a * Math.PI * 2, scale, flower]
      });
    }
  }
  return cells.map((list, index) => {
    list.sort((p, q) => p.key - q.key);
    const tuft = new Float32Array(list.length * 4);
    const meta = new Float32Array(list.length * 2);
    list.forEach((p, k) => {
      tuft.set(p.v.slice(0, 4), k * 4);
      meta[k * 2] = (k + 0.5) / list.length;
      meta[k * 2 + 1] = p.v[4];
    });
    return {
      x: -half + ((index % TILES) + 0.5) * TILE,
      z: -half + (Math.floor(index / TILES) + 0.5) * TILE,
      count: list.length,
      tuft,
      meta
    };
  });
}

function buildGeometry(tiles: Tile[]) {
  const total = tiles.reduce((n, t) => n + t.count, 0);
  const g = new THREE.InstancedBufferGeometry();
  g.setIndex(tuftGeometry.index?.clone() ?? null);
  for (const [name, attr] of Object.entries(tuftGeometry.attributes)) {
    g.setAttribute(name, attr.clone());
  }
  const tuft = new THREE.InstancedBufferAttribute(
    new Float32Array(Math.max(total, 1) * 4),
    4
  );
  const meta = new THREE.InstancedBufferAttribute(
    new Float32Array(Math.max(total, 1) * 2),
    2
  );
  tuft.setUsage(THREE.DynamicDrawUsage);
  meta.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('aTuft', tuft);
  g.setAttribute('aMeta', meta);
  g.instanceCount = 0;
  return g;
}

interface Lawn {
  tiles: Tile[];
  geometry: THREE.InstancedBufferGeometry;
  /** Tufts drawn per tile last frame; -1 before the first frame. */
  kept: Int32Array;
}

const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _sphere = new THREE.Sphere();
const _origin = new THREE.Vector3();
// A chunk crossing mounts a whole row of grass chunks at once; outside the
// bird's own ring they build one per frame, at the ring's faded edge.
let lastBuildFrame = -1;

/**
 * The lawn of one chunk as a single instanced draw. Each frame it keeps only
 * the tiles in view and inside the grass ring, and of each tile only as many
 * tufts as its distance from the camera calls for, so blades are dense where
 * the camera can see them and nothing is spent behind it.
 */
export function GrassField({
  houses,
  hasRoadX,
  hasRoadZ
}: {
  houses: HouseData[];
  hasRoadX: boolean;
  hasRoadZ: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lawnRef = useRef<Lawn | null>(null);

  // Built on the first frame, once the chunk group has placed the mesh: the
  // tufts need the chunk's world origin for paving and per-tuft randomness.
  useEffect(() => {
    return () => {
      lawnRef.current?.geometry.dispose();
      lawnRef.current = null;
    };
  }, [houses, hasRoadX, hasRoadZ]);

  useFrame(({ camera, gl }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.updateWorldMatrix(true, false);
    _origin.setFromMatrixPosition(mesh.matrixWorld);
    const player = grassUniforms.uPlayer.value;
    if (!lawnRef.current) {
      const urgent =
        Math.hypot(_origin.x - player.x, _origin.z - player.y) <
        CHUNK_SIZE * 1.5;
      if (!urgent && gl.info.render.frame === lastBuildFrame) return;
      lastBuildFrame = gl.info.render.frame;
      const tiles = buildTiles(
        houses,
        hasRoadX,
        hasRoadZ,
        _origin.x,
        _origin.z
      );
      lawnRef.current = {
        tiles,
        geometry: buildGeometry(tiles),
        kept: new Int32Array(TILES * TILES).fill(-1)
      };
      mesh.geometry = lawnRef.current.geometry;
    }
    const { tiles, geometry, kept } = lawnRef.current;
    _projScreen.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    _frustum.setFromProjectionMatrix(_projScreen);
    const fadeEnd = grassUniforms.uFadeEnd.value;
    const cam = camera.position;

    let changed = false;
    tiles.forEach((tile, i) => {
      const wx = _origin.x + tile.x;
      const wz = _origin.z + tile.z;
      let keep = 0;
      const toPlayer = Math.hypot(wx - player.x, wz - player.y);
      _sphere.center.set(wx, 0.3, wz);
      _sphere.radius = TILE_CULL_RADIUS;
      if (
        tile.count > 0 &&
        toPlayer - TILE_CULL_RADIUS < fadeEnd &&
        _frustum.intersectsSphere(_sphere)
      ) {
        const dx = Math.max(Math.abs(cam.x - wx) - TILE / 2, 0);
        const dz = Math.max(Math.abs(cam.z - wz) - TILE / 2, 0);
        const near = Math.sqrt(dx * dx + dz * dz + cam.y * cam.y);
        keep = Math.min(tile.count, Math.ceil(grassDensity(near) * tile.count));
      }
      if (kept[i] !== keep) {
        kept[i] = keep;
        changed = true;
      }
    });
    if (!changed) return;

    const tuft = geometry.getAttribute(
      'aTuft'
    ) as THREE.InstancedBufferAttribute;
    const meta = geometry.getAttribute(
      'aMeta'
    ) as THREE.InstancedBufferAttribute;
    let count = 0;
    tiles.forEach((tile, i) => {
      const keep = kept[i];
      if (keep <= 0) return;
      tuft.array.set(tile.tuft.subarray(0, keep * 4), count * 4);
      meta.array.set(tile.meta.subarray(0, keep * 2), count * 2);
      count += keep;
    });
    geometry.instanceCount = count;
    mesh.visible = count > 0;
    tuft.clearUpdateRanges();
    tuft.addUpdateRange(0, count * 4);
    tuft.needsUpdate = true;
    meta.clearUpdateRanges();
    meta.addUpdateRange(0, count * 2);
    meta.needsUpdate = true;
  });

  return (
    <mesh
      ref={meshRef}
      material={grassMaterial}
      frustumCulled={false}
      visible={false}
      receiveShadow
    />
  );
}

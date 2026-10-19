'use client';

import { CHUNK_SIZE } from '@/lib/terrain/chunkConstants';
import { ChunkData } from '@/lib/terrain/chunkGenerator';
import {
  HouseProp,
  HousePropLayer,
  houseProps
} from '@/lib/terrain/houseProps';
import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { Instance, LoadedChunk, NearFarLayer } from './InstancedLayer';

interface Part {
  geometry: THREE.BufferGeometry;
  at: [number, number, number];
  color: string;
  /** How much the instance colour tints this part: 1 for paint, 0 for glass. */
  tint: number;
  /** Darken towards the bottom as cheap ambient occlusion. */
  shade?: boolean;
}

/**
 * Bakes parts into one vertex-coloured geometry, normalised to a 1 x 1 x 1
 * box standing on y = 0, so each instance scales it to its prop's size.
 */
function bake(parts: Part[], size: THREE.Vector3): THREE.BufferGeometry {
  const baked = parts.map(({ geometry, at, color, tint, shade }) => {
    const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    geometry.dispose();
    geo.deleteAttribute('uv');
    geo.computeBoundingBox();
    const minY = geo.boundingBox?.min.y ?? 0;
    const spanY = Math.max((geo.boundingBox?.max.y ?? 1) - minY, 1e-3);
    const base = new THREE.Color(color);
    const pos = geo.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const tints = new Float32Array(pos.count).fill(tint);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const k = shade ? 0.65 + 0.45 * ((pos.getY(i) - minY) / spanY) : 1;
      c.copy(base)
        .multiplyScalar(k)
        .toArray(colors, i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('propTint', new THREE.BufferAttribute(tints, 1));
    geo.translate(...at);
    return geo;
  });
  const merged = mergeGeometries(baked);
  baked.forEach((g) => g.dispose());
  if (!merged) throw new Error('Prop parts could not be merged');
  merged.scale(1 / size.x, 1 / size.y, 1 / size.z);
  return merged;
}

function box(
  w: number,
  h: number,
  d: number,
  y0: number,
  z: number,
  color: string,
  tint: number
): Part {
  return {
    geometry: new THREE.BoxGeometry(w, h, d),
    at: [0, y0 + h / 2, z],
    color,
    tint
  };
}

function axle(z: number): Part {
  return {
    geometry: new THREE.CylinderGeometry(0.31, 0.31, 1.84, 8).rotateZ(
      Math.PI / 2
    ),
    at: [0, 0.31, z],
    color: '#1d1d1f',
    tint: 0
  };
}

// A hatchback in metres, 1.8 wide, 1.45 tall and 4.3 long, facing +z.
// Paint takes the instance colour; glass, tyres and trim keep their own.
function buildCar(): THREE.BufferGeometry {
  return bake(
    [
      axle(1.35),
      axle(-1.35),
      box(1.8, 0.62, 4.3, 0.28, 0, '#ffffff', 1),
      box(1.62, 0.42, 2.2, 0.9, -0.2, '#26313b', 0),
      box(1.56, 0.13, 1.8, 1.32, -0.3, '#ffffff', 1),
      box(1.82, 0.12, 0.08, 0.36, 2.11, '#3a3b3e', 0),
      box(1.82, 0.12, 0.08, 0.36, -2.11, '#3a3b3e', 0)
    ],
    new THREE.Vector3(1.8, 1.45, 4.3)
  );
}

function buildShrub(): THREE.BufferGeometry {
  return bake(
    [
      {
        geometry: new THREE.IcosahedronGeometry(0.5, 0),
        at: [0, 0.5, 0],
        color: '#ffffff',
        tint: 1,
        shade: true
      }
    ],
    new THREE.Vector3(1, 1, 1)
  );
}

function buildBox(): THREE.BufferGeometry {
  return bake([box(1, 1, 1, 0, 0, '#ffffff', 1)], new THREE.Vector3(1, 1, 1));
}

/** Lets glass and tyres keep their baked colour under the instance colour. */
function tintByAttribute(material: THREE.Material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
attribute float propTint;`
      )
      .replace(
        '#include <color_vertex>',
        /* glsl */ `#include <color_vertex>
#ifdef USE_INSTANCING_COLOR
vColor.rgb = color.rgb * mix(vec3(1.0), instanceColor.rgb, propTint);
#endif`
      );
  };
  return material;
}

const LAYERS: ReadonlyArray<{
  layer: HousePropLayer;
  build: () => THREE.BufferGeometry;
  material: THREE.Material;
}> = [
  {
    layer: 'box',
    build: buildBox,
    material: new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85
    })
  },
  {
    layer: 'shrub',
    build: buildShrub,
    material: new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.9
    })
  },
  {
    layer: 'car',
    build: buildCar,
    material: tintByAttribute(
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 })
    )
  }
];

let geometries: Record<HousePropLayer, THREE.BufferGeometry> | null = null;
function getGeometries() {
  geometries ??= Object.fromEntries(
    LAYERS.map(({ layer, build }) => [layer, build()])
  ) as Record<HousePropLayer, THREE.BufferGeometry>;
  return geometries;
}

// Chunk data objects are reused while a chunk stays loaded, so its props are
// placed once per load and dropped with it.
const propsByChunk = new WeakMap<ChunkData, HouseProp[]>();
function chunkProps(chunk: LoadedChunk): HouseProp[] {
  let props = propsByChunk.get(chunk.data);
  if (!props) {
    props = houseProps(
      chunk.data,
      Math.round(chunk.ox / CHUNK_SIZE),
      Math.round(chunk.oz / CHUNK_SIZE)
    );
    propsByChunk.set(chunk.data, props);
  }
  return props;
}

const colors = new Map<string, THREE.Color>();
function colorOf(hex: string): THREE.Color {
  let c = colors.get(hex);
  if (!c) {
    c = new THREE.Color(hex);
    colors.set(hex, c);
  }
  return c;
}

const _q = new THREE.Quaternion();
const _yAxis = new THREE.Vector3(0, 1, 0);

function propMatrix(p: HouseProp): THREE.Matrix4 {
  _q.setFromAxisAngle(_yAxis, p.rot);
  return new THREE.Matrix4().compose(
    new THREE.Vector3(p.x, p.y, p.z),
    _q,
    new THREE.Vector3(p.sx, p.sy, p.sz)
  );
}

/** Driveways, cars, porches, mailboxes, bins, hedges and shrubs. */
export function HousePropsLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const geos = getGeometries();
  const byLayer = useMemo(() => {
    const lists = Object.fromEntries(
      LAYERS.map(({ layer }) => [
        layer,
        { near: [] as Instance[], far: [] as Instance[] }
      ])
    ) as Record<HousePropLayer, { near: Instance[]; far: Instance[] }>;
    for (const chunk of chunks) {
      for (const p of chunkProps(chunk)) {
        const list = lists[p.layer];
        (chunk.near ? list.near : list.far).push({
          matrix: propMatrix(p),
          color: colorOf(p.color)
        });
      }
    }
    return lists;
  }, [chunks]);

  return (
    <>
      {LAYERS.map(({ layer, material }) => (
        <NearFarLayer
          key={layer}
          geometry={geos[layer]}
          material={material}
          near={byLayer[layer].near}
          far={byLayer[layer].far}
        />
      ))}
    </>
  );
}

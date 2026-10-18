'use client';

import { TreeData } from '@/lib/terrain/chunkGenerator';
import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { Instance, LoadedChunk, NearFarLayer } from './InstancedLayer';

type TreeType = TreeData['type'];

// Geometry is modelled at this height; instances stretch it to their own.
const BASE_HEIGHT = 5;
const TRUNK_COLOR = '#6b4226';

interface Part {
  geometry: THREE.BufferGeometry;
  at: [number, number, number];
  color: string;
  /** Darken the underside of canopy lobes as cheap ambient occlusion. */
  shade?: boolean;
}

function bake(parts: Part[]): THREE.BufferGeometry {
  const baked = parts.map(({ geometry, at, color, shade }) => {
    const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    geometry.dispose();
    geo.deleteAttribute('uv');
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    const minY = box?.min.y ?? 0;
    const spanY = Math.max((box?.max.y ?? 1) - minY, 1e-3);
    const base = new THREE.Color(color);
    const pos = geo.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const k = shade ? 0.7 + 0.4 * ((pos.getY(i) - minY) / spanY) : 1;
      c.copy(base)
        .multiplyScalar(k)
        .toArray(colors, i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.translate(...at);
    return geo;
  });
  const merged = mergeGeometries(baked);
  baked.forEach((g) => g.dispose());
  if (!merged) throw new Error('Tree parts could not be merged');
  return merged;
}

function trunk(): Part {
  const h = BASE_HEIGHT * 0.55;
  return {
    geometry: new THREE.CylinderGeometry(0.12, 0.18, h, 6, 1, true),
    at: [0, BASE_HEIGHT * 0.28, 0],
    color: TRUNK_COLOR
  };
}

function buildTreeGeometries(): Record<TreeType, THREE.BufferGeometry> {
  const H = BASE_HEIGHT;
  return {
    pine: bake([
      trunk(),
      {
        geometry: new THREE.ConeGeometry(1.4, H * 0.45, 7),
        at: [0, H * 0.5, 0],
        color: '#2a6b35',
        shade: true
      },
      {
        geometry: new THREE.ConeGeometry(1.0, H * 0.35, 7),
        at: [0, H * 0.7, 0],
        color: '#30793b',
        shade: true
      },
      {
        geometry: new THREE.ConeGeometry(0.6, H * 0.25, 7),
        at: [0, H * 0.85, 0],
        color: '#3a8a45',
        shade: true
      }
    ]),
    round: bake([
      trunk(),
      {
        geometry: new THREE.IcosahedronGeometry(1.6, 1),
        at: [0, H * 0.7, 0],
        color: '#3a8a48',
        shade: true
      },
      {
        geometry: new THREE.IcosahedronGeometry(1.0, 0),
        at: [0.6, H * 0.64, 0.35],
        color: '#45994f',
        shade: true
      },
      {
        geometry: new THREE.IcosahedronGeometry(0.95, 0),
        at: [-0.55, H * 0.8, -0.4],
        color: '#3f914c',
        shade: true
      }
    ]),
    oak: bake([
      trunk(),
      {
        geometry: new THREE.DodecahedronGeometry(1.4, 0),
        at: [0, H * 0.65, 0],
        color: '#4e9a58',
        shade: true
      },
      {
        geometry: new THREE.DodecahedronGeometry(0.9, 0),
        at: [0.6, H * 0.6, 0.4],
        color: '#5aaa60',
        shade: true
      },
      {
        geometry: new THREE.DodecahedronGeometry(0.8, 0),
        at: [-0.4, H * 0.72, -0.3],
        color: '#42904c',
        shade: true
      }
    ])
  };
}

let treeGeometries: Record<TreeType, THREE.BufferGeometry> | null = null;
function getTreeGeometries() {
  treeGeometries ??= buildTreeGeometries();
  return treeGeometries;
}

const treeMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  flatShading: true,
  roughness: 0.9
});

const TREE_TYPES: TreeType[] = ['pine', 'round', 'oak'];

function hash(x: number, z: number) {
  return Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
}

export function TreeLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const geometries = getTreeGeometries();

  const byType = useMemo(() => {
    const lists = Object.fromEntries(
      TREE_TYPES.map((t) => [
        t,
        { near: [] as Instance[], far: [] as Instance[] }
      ])
    ) as Record<TreeType, { near: Instance[]; far: Instance[] }>;
    const q = new THREE.Quaternion();
    const yAxis = new THREE.Vector3(0, 1, 0);
    for (const chunk of chunks) {
      for (const t of chunk.data.trees) {
        const x = chunk.ox + t.x;
        const z = chunk.oz + t.z;
        const r = hash(x, z);
        const sy = t.height / BASE_HEIGHT;
        // Trunk and canopy heights follow the tree height as before; widths
        // follow only partly so tall trees do not turn into blobs.
        const sxz = 0.7 + 0.3 * sy;
        q.setFromAxisAngle(yAxis, r * Math.PI * 2);
        const matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(x, 0, z),
          q,
          new THREE.Vector3(sxz, sy, sxz)
        );
        const tint = 0.9 + r * 0.2;
        const color = new THREE.Color(tint, tint * (0.97 + r * 0.06), tint);
        const list = lists[t.type];
        (chunk.near ? list.near : list.far).push({ matrix, color });
      }
    }
    return lists;
  }, [chunks]);

  return (
    <>
      {TREE_TYPES.map((type) => (
        <NearFarLayer
          key={type}
          geometry={geometries[type]}
          material={treeMaterial}
          near={byType[type].near}
          far={byType[type].far}
        />
      ))}
    </>
  );
}

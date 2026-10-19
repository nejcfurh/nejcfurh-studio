'use client';

import { treeVariant } from '@/lib/terrain/terrainCollision';
import { useFrame } from '@react-three/fiber';
import { Fragment, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { grassUniforms } from './GrassField';
import { Instance, InstancedLayer, LoadedChunk } from './InstancedLayer';
import {
  buildTreeGeometry,
  TREE_BASE_HEIGHT,
  TreeDetail,
  TreeType
} from './treeGeometry';
import { createTreeMaterials, TREE_VARIANT_ATTRIBUTE } from './treeMaterial';

const TREE_TYPES: TreeType[] = ['pine', 'round', 'oak'];
const VARIANT_ATTRIBUTES = { [TREE_VARIANT_ATTRIBUTE]: 1 };

let treeGeometries: Record<
  TreeDetail,
  Record<TreeType, THREE.BufferGeometry>
> | null = null;
function getTreeGeometries() {
  treeGeometries ??= {
    near: {
      pine: buildTreeGeometry('pine', 'near'),
      round: buildTreeGeometry('round', 'near'),
      oak: buildTreeGeometry('oak', 'near')
    },
    far: {
      pine: buildTreeGeometry('pine', 'far'),
      round: buildTreeGeometry('round', 'far'),
      oak: buildTreeGeometry('oak', 'far')
    }
  };
  return treeGeometries;
}

const { material: treeMaterial, depthMaterial: treeDepthMaterial } =
  createTreeMaterials(grassUniforms);

function hash(x: number, z: number) {
  return Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
}

export function TreeLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const geometries = getTreeGeometries();
  const groupRef = useRef<THREE.Group>(null);

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
        const sy = t.height / TREE_BASE_HEIGHT;
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
        (chunk.near ? list.near : list.far).push({
          matrix,
          color,
          attributes: { [TREE_VARIANT_ATTRIBUTE]: [treeVariant(x, z)] }
        });
      }
    }
    return lists;
  }, [chunks]);

  // The shadow pass must morph and sway like the lit pass. Layers remount
  // when their capacity grows, so the depth material is (re)attached here.
  useFrame(() => {
    for (const child of groupRef.current?.children ?? []) {
      if (child instanceof THREE.InstancedMesh) {
        child.customDepthMaterial = treeDepthMaterial;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {TREE_TYPES.map((type) => (
        <Fragment key={type}>
          {byType[type].near.length > 0 && (
            <InstancedLayer
              geometry={geometries.near[type]}
              material={treeMaterial}
              instances={byType[type].near}
              attributes={VARIANT_ATTRIBUTES}
              castShadow
              receiveShadow
            />
          )}
          {byType[type].far.length > 0 && (
            <InstancedLayer
              geometry={geometries.far[type]}
              material={treeMaterial}
              instances={byType[type].far}
              attributes={VARIANT_ATTRIBUTES}
              receiveShadow
            />
          )}
        </Fragment>
      ))}
    </group>
  );
}

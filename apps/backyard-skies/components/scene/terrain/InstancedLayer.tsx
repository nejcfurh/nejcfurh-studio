'use client';

import { ChunkData } from '@/lib/terrain/chunkGenerator';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export interface LoadedChunk {
  key: string;
  ox: number;
  oz: number;
  /** Within DETAIL_DISTANCE of the bird: gets grass and casts shadows. */
  near: boolean;
  data: ChunkData;
}

export interface Instance {
  matrix: THREE.Matrix4;
  color?: THREE.Color;
  /** Values for the layer's extra instanced attributes, by attribute name. */
  attributes?: Record<string, ArrayLike<number>>;
}

/** Extra per-instance attributes: name to item size. */
export type InstanceAttributes = Record<string, number>;

const _parent = new THREE.Matrix4();
const _local = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);

/**
 * World matrix for a part placed in a rotated group at (x, 0, z), the way the
 * chunk props were laid out: group rotation about Y, then a local offset,
 * local Y rotation and scale.
 */
export function placeInGroup(
  group: { x: number; z: number; rot: number },
  local: {
    x?: number;
    y?: number;
    z?: number;
    rotY?: number;
    sx?: number;
    sy?: number;
    sz?: number;
  }
): THREE.Matrix4 {
  _q.setFromAxisAngle(_yAxis, group.rot);
  _parent.compose(_p.set(group.x, 0, group.z), _q, _s.set(1, 1, 1));
  _q.setFromAxisAngle(_yAxis, local.rotY ?? 0);
  _local.compose(
    _p.set(local.x ?? 0, local.y ?? 0, local.z ?? 0),
    _q,
    _s.set(local.sx ?? 1, local.sy ?? 1, local.sz ?? 1)
  );
  return new THREE.Matrix4().multiplyMatrices(_parent, _local);
}

function capacityFor(n: number) {
  return Math.max(16, 2 ** Math.ceil(Math.log2(Math.max(n, 1))));
}

/**
 * Instanced attributes live on the geometry, and the near and far layers share
 * one. Each layer draws through its own geometry that reuses the shared vertex
 * buffers and adds only its instanced ones.
 */
function useLayerGeometry(
  geometry: THREE.BufferGeometry,
  attributes: InstanceAttributes | undefined,
  capacity: number
) {
  const view = useMemo(() => {
    if (!attributes) return geometry;
    const g = new THREE.BufferGeometry();
    g.setIndex(geometry.index);
    for (const [name, attr] of Object.entries(geometry.attributes)) {
      g.setAttribute(name, attr);
    }
    for (const [name, size] of Object.entries(attributes)) {
      g.setAttribute(
        name,
        new THREE.InstancedBufferAttribute(
          new Float32Array(capacity * size),
          size
        )
      );
    }
    return g;
  }, [geometry, attributes, capacity]);
  const live = useRef<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    live.current = view;
    return () => {
      live.current = null;
      if (view === geometry) return;
      // Deferred: StrictMode re-runs this effect on the same memoised view,
      // which must survive. Only a view nobody re-adopted is released.
      setTimeout(() => {
        if (live.current === view) return;
        // dispose() frees the GL buffers of every attribute still set, and the
        // position/normal/index buffers here belong to the shared base geometry.
        for (const name of Object.keys(geometry.attributes)) {
          view.deleteAttribute(name);
        }
        view.setIndex(null);
        view.dispose();
      }, 0);
    };
  }, [view, geometry]);
  return view;
}

/**
 * One draw call for every instance across all loaded chunks. Capacity grows in
 * powers of two so chunk swaps only rewrite buffers instead of rebuilding the
 * mesh.
 */
export function InstancedLayer({
  geometry,
  material,
  instances,
  attributes,
  castShadow = false,
  receiveShadow = false
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  instances: Instance[];
  attributes?: InstanceAttributes;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const capacity = capacityFor(instances.length);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const layerGeometry = useLayerGeometry(geometry, attributes, capacity);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    instances.forEach((inst, i) => {
      mesh.setMatrixAt(i, inst.matrix);
      if (inst.color) mesh.setColorAt(i, inst.color);
      if (!attributes || !inst.attributes) return;
      for (const [name, size] of Object.entries(attributes)) {
        const values = inst.attributes[name];
        const attr = layerGeometry.getAttribute(name);
        if (!values || !(attr instanceof THREE.InstancedBufferAttribute)) {
          continue;
        }
        for (let k = 0; k < size; k++) {
          attr.array[i * size + k] = values[k] ?? 0;
        }
      }
    });
    mesh.count = instances.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (attributes) {
      for (const name of Object.keys(attributes)) {
        layerGeometry.getAttribute(name).needsUpdate = true;
      }
    }
  }, [instances, capacity, attributes, layerGeometry]);

  // Instances span every loaded chunk, so the mesh is always in view.
  return (
    <instancedMesh
      key={capacity}
      ref={meshRef}
      args={[layerGeometry, material, capacity]}
      frustumCulled={false}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}

/** Splits instances so only near chunks pay for the shadow pass. */
export function NearFarLayer({
  geometry,
  material,
  near,
  far,
  attributes,
  receiveShadow = true
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  near: Instance[];
  far: Instance[];
  attributes?: InstanceAttributes;
  receiveShadow?: boolean;
}) {
  return (
    <>
      {near.length > 0 && (
        <InstancedLayer
          geometry={geometry}
          material={material}
          instances={near}
          attributes={attributes}
          castShadow
          receiveShadow={receiveShadow}
        />
      )}
      {far.length > 0 && (
        <InstancedLayer
          geometry={geometry}
          material={material}
          instances={far}
          attributes={attributes}
          receiveShadow={receiveShadow}
        />
      )}
    </>
  );
}

/** Horizontal 1x1 plane, for road paint, sidewalks and patios. */
export const unitPlaneGeometry = new THREE.PlaneGeometry(1, 1).rotateX(
  -Math.PI / 2
);

export const unitBoxGeometry = new THREE.BoxGeometry(1, 1, 1);

'use client';

import { HOUSE_MODELS } from '@/lib/terrain/chunkConstants';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import {
  Instance,
  InstanceAttributes,
  LoadedChunk,
  NearFarLayer
} from './InstancedLayer';

// Preloaded as one list: useGLTF caches by the exact key it was given, so
// per-URL preloads would not be found by the list load below and every model
// would download twice.
useGLTF.preload(HOUSE_MODELS);

const HOUSE_SCALE = 6.3;

// The models' own material names; every model uses the same five.
const ROOF_MATERIAL = 'roof';
const WALL_MATERIAL = '_defaultMat';

const HOUSE_ATTRIBUTES: InstanceAttributes = {
  instanceRoof: 3,
  instanceWall: 3
};

// The house models only differ by flat material colours, so each model is
// baked into one vertex-coloured geometry and drawn with a single material.
// Roof and wall vertices are baked white and marked in `housePart`, and each
// instance tints them with its own roof and wall colour.
const houseMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 1,
  metalness: 0.4
});
houseMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
attribute vec2 housePart;
attribute vec3 instanceRoof;
attribute vec3 instanceWall;`
    )
    .replace(
      '#include <color_vertex>',
      /* glsl */ `#include <color_vertex>
vColor.rgb *= mix(vec3(1.0), instanceRoof, housePart.x)
  * mix(vec3(1.0), instanceWall, housePart.y);`
    );
};

function bakeHouse(scene: THREE.Object3D): THREE.BufferGeometry {
  scene.updateMatrixWorld(true);
  const scale = new THREE.Matrix4().makeScale(
    HOUSE_SCALE,
    HOUSE_SCALE,
    HOUSE_SCALE
  );
  const parts: THREE.BufferGeometry[] = [];
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const material = mesh.material as THREE.MeshStandardMaterial;
    const geo = mesh.geometry.clone();
    geo.applyMatrix4(
      new THREE.Matrix4().multiplyMatrices(scale, mesh.matrixWorld)
    );
    geo.deleteAttribute('uv');
    const roof = material.name === ROOF_MATERIAL ? 1 : 0;
    const wall = material.name === WALL_MATERIAL ? 1 : 0;
    const base = roof || wall ? new THREE.Color(1, 1, 1) : material.color;
    const count = geo.getAttribute('position').count;
    const colors = new Float32Array(count * 3);
    const part = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      base.toArray(colors, i * 3);
      part[i * 2] = roof;
      part[i * 2 + 1] = wall;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('housePart', new THREE.BufferAttribute(part, 2));
    parts.push(geo.index ? geo : geo.toNonIndexed());
  });
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  if (!merged) throw new Error('House model could not be merged');
  return merged;
}

const tints = new Map<string, number[]>();
/** Linear RGB of a palette colour, cached since every house repeats them. */
function tint(hex: string): number[] {
  let rgb = tints.get(hex);
  if (!rgb) {
    rgb = new THREE.Color(hex).toArray();
    tints.set(hex, rgb);
  }
  return rgb;
}

export function HouseLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const gltfs = useGLTF(HOUSE_MODELS);
  const geometries = useMemo(
    () => gltfs.map((g) => bakeHouse(g.scene)),
    [gltfs]
  );
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  const byModel = useMemo(() => {
    const lists = HOUSE_MODELS.map(() => ({
      near: [] as Instance[],
      far: [] as Instance[]
    }));
    const q = new THREE.Quaternion();
    const yAxis = new THREE.Vector3(0, 1, 0);
    const one = new THREE.Vector3(1, 1, 1);
    for (const chunk of chunks) {
      for (const h of chunk.data.houses) {
        const list = lists[h.modelIndex % HOUSE_MODELS.length];
        q.setFromAxisAngle(yAxis, h.rot);
        const matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(chunk.ox + h.x, 0, chunk.oz + h.z),
          q,
          one
        );
        (chunk.near ? list.near : list.far).push({
          matrix,
          attributes: {
            instanceRoof: tint(h.roofColor),
            instanceWall: tint(h.wallColor)
          }
        });
      }
    }
    return lists;
  }, [chunks]);

  return (
    <>
      {geometries.map((geometry, i) => (
        <NearFarLayer
          key={HOUSE_MODELS[i]}
          geometry={geometry}
          material={houseMaterial}
          near={byModel[i].near}
          far={byModel[i].far}
          attributes={HOUSE_ATTRIBUTES}
        />
      ))}
    </>
  );
}

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import {
  Instance,
  LoadedChunk,
  NearFarLayer,
  unitBoxGeometry
} from './InstancedLayer';
import { STREET_HALF_WIDTH } from './RoadX';

const FENCE_HEIGHT = 0.85;
const RAIL_HEIGHT = 0.55;
const POST = 0.06;
const RAIL = 0.04;
// Rail pieces shorter than this after clipping are dropped.
const MIN_RAIL = 0.4;
const CLEARANCE = STREET_HALF_WIDTH + 0.15;

const fenceMaterial = new THREE.MeshStandardMaterial({ roughness: 0.85 });

type Point = [number, number];

/**
 * Parts of the segment a-b (chunk-local x, z) that stay off the streets, as
 * [from, to] fractions along it. Generated yards near a junction can reach
 * across the road, so the fence stops at the sidewalk instead. The road along
 * X runs through every chunk at z = 0; the one along Z at x = 0 where present.
 */
function offStreet(a: Point, b: Point, hasRoadZ: boolean): [number, number][] {
  const blocked: [number, number][] = [];
  const axes = hasRoadZ ? [1, 0] : [1];
  for (const axis of axes) {
    const p = a[axis];
    const d = b[axis] - p;
    if (Math.abs(d) < 1e-6) {
      if (Math.abs(p) < CLEARANCE) blocked.push([0, 1]);
      continue;
    }
    const t1 = (-CLEARANCE - p) / d;
    const t2 = (CLEARANCE - p) / d;
    const from = Math.max(0, Math.min(t1, t2));
    const to = Math.min(1, Math.max(t1, t2));
    if (from < to) blocked.push([from, to]);
  }
  blocked.sort((x, y) => x[0] - y[0]);
  const free: [number, number][] = [];
  let t = 0;
  for (const [from, to] of blocked) {
    if (from > t) free.push([t, from]);
    t = Math.max(t, to);
  }
  if (t < 1) free.push([t, 1]);
  return free;
}

const _q = new THREE.Quaternion();
const _yAxis = new THREE.Vector3(0, 1, 0);

function boxBetween(
  a: Point,
  b: Point,
  ox: number,
  oz: number,
  y: number,
  size: number
): THREE.Matrix4 {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  _q.setFromAxisAngle(_yAxis, -Math.atan2(dz, dx));
  return new THREE.Matrix4().compose(
    new THREE.Vector3(ox + (a[0] + b[0]) / 2, y, oz + (a[1] + b[1]) / 2),
    _q,
    new THREE.Vector3(Math.hypot(dx, dz), size, size)
  );
}

function postAt(p: Point, ox: number, oz: number): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(ox + p[0], FENCE_HEIGHT / 2, oz + p[1]),
    _q.identity(),
    new THREE.Vector3(POST, FENCE_HEIGHT, POST)
  );
}

function lerp(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function YardFenceLayer({ chunks }: { chunks: LoadedChunk[] }) {
  const { near, far } = useMemo(() => {
    const nearOut: Instance[] = [];
    const farOut: Instance[] = [];
    for (const chunk of chunks) {
      const out = chunk.near ? nearOut : farOut;
      for (const h of chunk.data.houses) {
        const color = new THREE.Color(h.fenceColor);
        const halfW = (h.w + 4) / 2;
        const halfD = (h.d + 6) / 2;
        const cos = Math.cos(h.rot);
        const sin = Math.sin(h.rot);
        const corners: Point[] = [
          [-halfW, halfD],
          [halfW, halfD],
          [halfW, -halfD],
          [-halfW, -halfD]
        ].map(([x, z]) => [h.x + x * cos + z * sin, h.z - x * sin + z * cos]);

        corners.forEach((a, i) => {
          const b = corners[(i + 1) % corners.length];
          const pieces = offStreet(a, b, chunk.data.hasRoadZ);
          for (const [from, to] of pieces) {
            const start = lerp(a, b, from);
            const end = lerp(a, b, to);
            if (Math.hypot(end[0] - start[0], end[1] - start[1]) < MIN_RAIL) {
              continue;
            }
            out.push({
              matrix: boxBetween(
                start,
                end,
                chunk.ox,
                chunk.oz,
                RAIL_HEIGHT,
                RAIL
              ),
              color
            });
            // A post at each end of the piece: the yard corners, or where
            // the rail stops at the sidewalk.
            out.push({ matrix: postAt(start, chunk.ox, chunk.oz), color });
            if (to < 1) {
              out.push({ matrix: postAt(end, chunk.ox, chunk.oz), color });
            }
          }
        });
      }
    }
    return { near: nearOut, far: farOut };
  }, [chunks]);

  return (
    <NearFarLayer
      geometry={unitBoxGeometry}
      material={fenceMaterial}
      near={near}
      far={far}
    />
  );
}

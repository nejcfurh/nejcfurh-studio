'use client';

import { useEffect, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import type { Group } from 'three';

interface ObjMtlModelProps {
  /** BASE URL WITHOUT EXTENSION, E.G. "/models/cat/model". LOADS model.obj AND model.mtl FROM SAME FOLDER. */
  baseUrl: string;
  /** OPTIONAL SCALE APPLIED TO THE WHOLE MODEL. */
  scale?: number | [number, number, number];
  /** OPTIONAL POSITION [x, y, z]. */
  position?: [number, number, number];
  /** OPTIONAL ROTATION [x, y, z] IN RADIANS. */
  rotation?: [number, number, number];
  children?: React.ReactNode;
}

/**
 * LOADS AN OBJ MODEL WITH ITS MTL MATERIALS (AND ANY JPG/PNG TEXTURES REFERENCED IN THE MTL).
 * PUT YOUR FILES IN PUBLIC/, E.G.:
 *   public/models/cat/model.obj
 *   public/models/cat/model.mtl
 *   public/models/cat/yourcolor.jpg   (SAME FOLDER; NAME MUST MATCH map_Kd IN .mtl)
 * THEN USE: <ObjMtlModel baseUrl="/models/cat/model" />
 */

export function ObjMtlModel({
  baseUrl,
  scale = 0.2,
  position,
  rotation,
  children,
}: ObjMtlModelProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const objUrl = `${baseUrl}.obj`;
    const mtlUrl = `${baseUrl}.mtl`;
    const baseDir = baseUrl.slice(0, baseUrl.lastIndexOf('/') + 1) || '/';
    const mtlFilename = mtlUrl.split('/').pop()!;

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(baseDir);

    mtlLoader.load(
      mtlFilename,
      materials => {
        if (cancelled) return;
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          objUrl,
          object => {
            if (!cancelled) setGroup(object);
          },
          undefined,
          err => setError((err as Error)?.message || 'Failed to load OBJ'),
        );
      },
      undefined,
      err => setError((err as Error)?.message || 'Failed to load MTL'),
    );

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  if (error) {
    return (
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
      </group>
    );
  }

  if (!group) return null;

  const scaleArr = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scaleArr as [number, number, number]}
    >
      <primitive object={group} />
      {children}
    </group>
  );
}

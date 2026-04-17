'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AnimationMixer, Group } from 'three';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

// DOWNLOAD CACHE — EACH URL IS FETCHED ONLY ONCE
const fbxCache = new Map<string, Group>();
const fbxPromises = new Map<string, Promise<Group>>();
const textureCache = new Map<string, THREE.Texture>();
const texturePromises = new Map<string, Promise<THREE.Texture>>();

function fetchFbx(url: string): Promise<Group> {
  if (fbxCache.has(url)) return Promise.resolve(fbxCache.get(url)!);
  if (fbxPromises.has(url)) return fbxPromises.get(url)!;
  const promise = new Promise<Group>((resolve, reject) => {
    const loader = new FBXLoader();
    const baseDir = url.slice(0, url.lastIndexOf('/') + 1) || '/';
    loader.setResourcePath(baseDir);
    loader.load(
      url,
      (object) => {
        fbxCache.set(url, object);
        resolve(object);
      },
      undefined,
      reject
    );
  });
  fbxPromises.set(url, promise);
  return promise;
}

function fetchTexture(url: string): Promise<THREE.Texture> {
  if (textureCache.has(url)) return Promise.resolve(textureCache.get(url)!);
  if (texturePromises.has(url)) return texturePromises.get(url)!;
  const promise = new Promise<THREE.Texture>((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;
        textureCache.set(url, tex);
        resolve(tex);
      },
      undefined,
      reject
    );
  });
  texturePromises.set(url, promise);
  return promise;
}

// CACHE FOR PREPARED MODELS (TEXTURE APPLIED)
const preparedCache = new Map<string, Group>();
const preparedPromises = new Map<string, Promise<Group>>();

function fetchPrepared(url: string, textureUrl?: string): Promise<Group> {
  const key = textureUrl ? `${url}|${textureUrl}` : url;
  if (preparedCache.has(key)) return Promise.resolve(preparedCache.get(key)!);
  if (preparedPromises.has(key)) return preparedPromises.get(key)!;
  const promise = (async () => {
    const object = await fetchFbx(url);
    if (textureUrl) {
      const tex = await fetchTexture(textureUrl);
      const newMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.7,
        side: THREE.FrontSide
      });
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
          mesh.material = newMat;
        }
      });
    }
    preparedCache.set(key, object);
    return object;
  })();
  preparedPromises.set(key, promise);
  return promise;
}

// EXTRACT MESHES FROM AN FBX GROUP — COLLECT GEOMETRY+MATERIAL PAIRS
interface MeshData {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  matrix: THREE.Matrix4;
}

const meshDataCache = new Map<string, MeshData[]>();

function extractMeshes(group: Group, key: string): MeshData[] {
  if (meshDataCache.has(key)) return meshDataCache.get(key)!;
  const meshes: MeshData[] = [];
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      // COMPUTE WORLD MATRIX RELATIVE TO THE GROUP ROOT
      mesh.updateWorldMatrix(true, false);
      meshes.push({
        geometry: mesh.geometry,
        material: mesh.material,
        matrix: mesh.matrixWorld.clone()
      });
    }
  });
  meshDataCache.set(key, meshes);
  return meshes;
}

/** PRELOAD FBX (AND OPTIONAL TEXTURE) INTO THE DOWNLOAD CACHE. */
export function preloadFbx(url: string, textureUrl?: string) {
  fetchPrepared(url, textureUrl);
}

interface FbxModelProps {
  url: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  playAnimations?: boolean;
  /** PLAY ANIMATION ONCE INSTEAD OF LOOPING (DEFAULT FALSE). */
  loop?: boolean;
  /** CALLED WHEN A NON-LOOPING ANIMATION FINISHES. */
  onComplete?: () => void;
  textureUrl?: string;
  /** APPLY A COLOR TO ALL MESHES IN THE MODEL. */
  color?: string;
  children?: React.ReactNode;
}

/**
 * STATIC MODELS: renders extracted meshes sharing GPU geometry & material.
 * ANIMATED MODELS: clones via SkeletonUtils for independent bone animation.
 */
export function FbxModel({
  url,
  scale = 1,
  position,
  rotation,
  playAnimations = true,
  loop = true,
  onComplete,
  textureUrl,
  color,
  children
}: FbxModelProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // FOR ANIMATED MODELS
  const [animGroup, setAnimGroup] = useState<Group | null>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  // FOR STATIC MODELS
  const [meshes, setMeshes] = useState<MeshData[] | null>(null);

  const cacheKey = useMemo(
    () => (textureUrl ? `${url}|${textureUrl}` : url),
    [url, textureUrl]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const original = await fetchPrepared(url, textureUrl);
        if (cancelled) return;

        const clone = skeletonClone(original) as Group;

        if (original.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(clone);
          for (const clip of original.animations) {
            const action = mixer.clipAction(clip);
            if (loop) {
              action.setLoop(THREE.LoopRepeat, Infinity);
              action.clampWhenFinished = false;
            } else {
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
            }
            action.play();
          }
          if (!loop && onComplete) {
            mixer.addEventListener('finished', () => {
              onComplete();
            });
          }
          mixerRef.current = mixer;
        }

        // APPLY COLOR TO SPECIFIC MATERIAL BY NAME (E.G. "Bird Blue")
        if (color) {
          const tintColor = new THREE.Color(color);
          clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (Array.isArray(mesh.material)) {
                mesh.material = mesh.material.map((m) => {
                  if (m.name === 'Bird Blue') {
                    const cloned = m.clone();
                    if ('color' in cloned) {
                      (cloned as THREE.MeshPhongMaterial).color.set(tintColor);
                    }
                    return cloned;
                  }
                  return m;
                });
              }
            }
          });
        }

        if (!cancelled) {
          setAnimGroup(clone);
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error)?.message || 'Failed to load FBX');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [url, textureUrl, playAnimations, cacheKey]);

  useFrame((_, delta) => {
    if (playAnimations) {
      mixerRef.current?.update(delta);
    }
  });

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

  if (!ready) return null;

  const scaleArr = Array.isArray(scale) ? scale : [scale, scale, scale];

  // ANIMATED MODEL — USE PRIMITIVE
  if (animGroup) {
    return (
      <group
        position={position}
        rotation={rotation}
        scale={scaleArr as [number, number, number]}
      >
        <primitive object={animGroup} />
        {children}
      </group>
    );
  }

  // STATIC MODEL — RENDER SHARED MESHES DIRECTLY
  if (meshes) {
    return (
      <group
        position={position}
        rotation={rotation}
        scale={scaleArr as [number, number, number]}
      >
        {meshes.map((m, i) => (
          <mesh
            key={i}
            geometry={m.geometry}
            material={m.material}
            matrixAutoUpdate={false}
            matrix={m.matrix}
          />
        ))}
        {children}
      </group>
    );
  }

  return null;
}

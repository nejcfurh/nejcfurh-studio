import { BirdSpeciesId } from '@/types';
import { useGLTF, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

export const BIRD_MODEL = '/models/mybird/bird.glb';
export const BIRD_SPECIES_TEXTURES: Record<BirdSpeciesId, string> = {
  cardinal: '/models/mybird/cardinal.webp',
  tanager: '/models/mybird/tanager.webp',
  bunting: '/models/mybird/bunting.webp',
  starling: '/models/mybird/starling.webp'
};
export const FEEDER_MODEL = '/models/feeders/feeder.glb';
export const BIRDBATH_MODEL = '/models/feeders/birdbath.glb';
export const SEEDS_TEXTURE = '/models/feeders/seeds.webp';
export const WATER_TEXTURE = '/models/feeders/water.webp';
export const CAT_MODEL = '/models/mycat/cat.glb';
export const EAGLE_MODEL = '/models/myeagle/eagle.glb';

export interface PhongShading {
  specular: THREE.ColorRepresentation;
  shininess: number;
}

// The feeder, cat and eagle sources (FBX / OBJ+MTL) were shaded with Phong materials.
// glTF stores only PBR materials, so the Phong specular is restored after loading.
export const GLOSSY_SHADING: PhongShading = {
  specular: 0xffffff,
  shininess: 256
};
export const MATTE_SHADING: PhongShading = {
  specular: 0x000000,
  shininess: 10
};

const preparedScenes = new WeakSet<THREE.Object3D>();

function applyPhongShading(scene: THREE.Object3D, shading: PhongShading) {
  if (preparedScenes.has(scene)) return scene;
  const converted = new Map<THREE.Material, THREE.MeshPhongMaterial>();
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    const source = child.material as THREE.MeshStandardMaterial;
    let phong = converted.get(source);
    if (!phong) {
      phong = new THREE.MeshPhongMaterial({
        name: source.name,
        color: source.color,
        map: source.map,
        side: source.side,
        specular: shading.specular,
        shininess: shading.shininess
      });
      converted.set(source, phong);
      source.dispose();
    }
    child.material = phong;
  });
  preparedScenes.add(scene);
  return scene;
}

/**
 * Loads a GLB once (cached by URL) and returns its scene with Phong materials and
 * shadow casting set. Render it through drei's <Clone> so every instance shares
 * the same geometry and materials.
 */
export function usePhongModel(
  url: string,
  shading: PhongShading
): THREE.Object3D {
  const { scene } = useGLTF(url);
  return useMemo(() => applyPhongShading(scene, shading), [scene, shading]);
}

/** Starts downloading every model and texture the game scene uses. */
export function preloadGameAssets(): void {
  [BIRD_MODEL, FEEDER_MODEL, BIRDBATH_MODEL, CAT_MODEL, EAGLE_MODEL].forEach(
    (url) => useGLTF.preload(url)
  );
  [
    ...Object.values(BIRD_SPECIES_TEXTURES),
    SEEDS_TEXTURE,
    WATER_TEXTURE
  ].forEach((url) => useTexture.preload(url));
}

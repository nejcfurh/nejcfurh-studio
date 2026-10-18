import { FeederData } from '@/types';
import * as THREE from 'three';

// Feeder-local ground points of the stalking cat. Both feeding cameras sit on
// the +x/+z diagonal and look across the pole, so the cat stalks in on the far
// side of the pole where the close-up can see it.
const STALK_START = new THREE.Vector3(-2.8, 0, -0.75);
const STALK_END = new THREE.Vector3(-0.75, 0, -0.2);

/** Yaw that turns the cat to face along its stalking path, toward the pole. */
export const CAT_STALK_YAW = Math.atan2(
  STALK_END.x - STALK_START.x,
  STALK_END.z - STALK_START.z
);

/**
 * Stalk progress 0 sits at the start point and 1 at the pounce point beside
 * the pole; negative values extend the path further out.
 */
export function catStalkPosition(
  progress: number,
  out: THREE.Vector3
): THREE.Vector3 {
  return out.lerpVectors(STALK_START, STALK_END, progress);
}

/** Feeder-local spot on the tray or basin rim where the cat lands. */
export function catPerchPosition(
  type: FeederData['type'],
  out: THREE.Vector3
): THREE.Vector3 {
  return out.set(0, type === 'feeder' ? 2.25 : 2.4, 0.5);
}

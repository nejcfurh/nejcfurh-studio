'use client';

import { BIRD_MODEL, BIRD_SPECIES_TEXTURES } from '@/lib/assets';
import { BirdSpeciesId } from '@/types';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

/** Pose read every frame, so a 60 Hz source does not re-render the model. */
export interface BirdPose {
  /** Increments once per flap; each increase starts a wingbeat. */
  flapId: number;
  /** Standing on a feeder or birdbath: wings folded, pecking. */
  perched: boolean;
  /** Holds the current pose (game paused, death tumble). */
  frozen: boolean;
}

interface GltfBirdModelProps {
  isFlapping: boolean;
  isPerched?: boolean;
  scale?: number;
  speciesId?: BirdSpeciesId;
  /** When given, it replaces isFlapping and isPerched as the pose source. */
  poseRef?: MutableRefObject<BirdPose>;
}

/** Beak strikes on the tray so far; crumbs and droplets spawn on each one. */
export const birdPecks = { count: 0 };
/** World position of the beak tip as of the last rendered frame. */
export const birdBeakTip = new THREE.Vector3();

// Clip names and timings authored into public/models/mybird/bird.glb.
const CLIP = {
  flap: 'flap',
  glide: 'glide',
  perch: 'perch_idle',
  peck: 'peck',
  takeoff: 'takeoff'
} as const;
const PECK_HIT_TIME = 0.168;
// The beak tip in the rig's rest pose, glTF axes.
const BEAK_REST = new THREE.Vector3(0, 0.0756, 0.0743);

const FLAP_FADE = 0.08;
// Into the glide once the upstroke is under way, so the wings settle instead of
// stopping at the top of the stroke.
const FLAP_RELEASE = 0.62;
const GLIDE_FADE = 0.22;
const PERCH_FADE = 0.25;
const TAKEOFF_FADE = 0.1;
const PECK_IN = 0.12;
const PECK_OUT = 0.2;
const FIRST_PECK_DELAY = 0.45;
const PECK_PAUSE_MIN = 0.5;
const PECK_PAUSE_MAX = 1.3;
const PECKS_MIN = 2;
const PECKS_MAX = 4;

type ActionName = 'flapA' | 'flapB' | 'glide' | 'perch' | 'peck' | 'takeoff';

interface Blend {
  weight: number;
  target: number;
  /** Weight change per second while moving toward the target. */
  rate: number;
}

const restingPose = (): BirdPose => ({
  flapId: 0,
  perched: false,
  frozen: false
});

export default function GltfBirdModel({
  isFlapping,
  isPerched = false,
  scale = 1,
  speciesId = 'cardinal',
  poseRef
}: GltfBirdModelProps) {
  const { scene, animations } = useGLTF(BIRD_MODEL);
  const speciesTexture = useTexture(
    BIRD_SPECIES_TEXTURES[speciesId] || BIRD_SPECIES_TEXTURES.cardinal
  );

  // Each instance needs its own skeleton, and its own material for the species map.
  const rig = useMemo(() => {
    const root = cloneSkinned(scene);
    root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        // The wings sweep far outside the bind-pose bounds.
        child.frustumCulled = false;
        child.material = (child.material as THREE.Material).clone();
      }
    });
    root.updateMatrixWorld(true);
    const head = root.getObjectByName('head') ?? null;
    const beakLocal = head
      ? BEAK_REST.clone().applyMatrix4(head.matrixWorld.clone().invert())
      : null;
    return { root, head, beakLocal };
  }, [scene]);

  const mixer = useMemo(() => new THREE.AnimationMixer(rig.root), [rig]);
  const actions = useMemo(() => {
    const clip = (name: string) => {
      const found = THREE.AnimationClip.findByName(animations, name);
      if (!found) throw new Error(`bird.glb has no "${name}" clip`);
      return found;
    };
    const make = (
      c: THREE.AnimationClip,
      loop: THREE.AnimationActionLoopStyles
    ) => {
      const action = mixer.clipAction(c);
      action.setLoop(loop, Infinity);
      action.clampWhenFinished = true;
      return action.setEffectiveWeight(0);
    };
    const flap = clip(CLIP.flap);
    const all: Record<ActionName, THREE.AnimationAction> = {
      // Two copies of the wingbeat, so a tap mid-stroke can cross-fade into a
      // fresh stroke instead of snapping the wings back to the start.
      flapA: make(flap, THREE.LoopOnce),
      flapB: make(flap.clone(), THREE.LoopOnce),
      glide: make(clip(CLIP.glide), THREE.LoopRepeat),
      perch: make(clip(CLIP.perch), THREE.LoopRepeat),
      peck: make(clip(CLIP.peck), THREE.LoopRepeat),
      takeoff: make(clip(CLIP.takeoff), THREE.LoopOnce)
    };
    all.glide.setEffectiveWeight(1).play();
    return all;
  }, [animations, mixer]);

  useEffect(
    () => () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(rig.root);
    },
    [mixer, rig]
  );

  // APPLY SPECIES BASE COLOR TEXTURE TO ALL MESH MATERIALS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    speciesTexture.flipY = false;
    speciesTexture.colorSpace = THREE.SRGBColorSpace;
    speciesTexture.needsUpdate = true;
    rig.root.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.map = speciesTexture;
        mat.color.set(1, 1, 1); // RESET TINT SO TEXTURE SHOWS TRUE COLORS
        mat.needsUpdate = true;
      }
    });
  }, [rig, speciesTexture]);

  const ownPose = useRef<BirdPose>(restingPose());
  const wasFlapping = useRef(false);
  const blend = useRef<Record<ActionName, Blend>>({
    flapA: { weight: 0, target: 0, rate: 1 },
    flapB: { weight: 0, target: 0, rate: 1 },
    glide: { weight: 1, target: 1, rate: 1 },
    perch: { weight: 0, target: 0, rate: 1 },
    peck: { weight: 0, target: 0, rate: 1 },
    takeoff: { weight: 0, target: 0, rate: 1 }
  });
  const director = useRef({
    lastFlapId: -1,
    perched: false,
    activeFlap: 'flapA' as 'flapA' | 'flapB',
    flapping: false,
    takingOff: false,
    perchTime: 0,
    nextPeckAt: 0,
    peckEndsAt: 0,
    pecking: false,
    lastPeckTime: 0
  });

  useFrame((_, delta) => {
    let pose = poseRef?.current;
    if (!pose) {
      pose = ownPose.current;
      if (isFlapping && !wasFlapping.current) pose.flapId++;
      wasFlapping.current = isFlapping;
      pose.perched = isPerched;
    }

    if (rig.head && rig.beakLocal) {
      birdBeakTip.copy(rig.beakLocal).applyMatrix4(rig.head.matrixWorld);
    }
    if (pose.frozen) return;

    const dt = Math.min(delta, 0.05);
    const d = director.current;
    const weights = blend.current;
    const names = Object.keys(weights) as ActionName[];
    const fadeTo = (name: ActionName, seconds: number) => {
      for (const key of names) {
        weights[key].target = key === name ? 1 : 0;
        weights[key].rate = 1 / seconds;
      }
      const action = actions[name];
      if (!action.isRunning() && weights[name].weight === 0) action.reset();
      action.play();
    };
    const restart = (name: ActionName, seconds: number) => {
      actions[name].reset();
      fadeTo(name, seconds);
    };

    if (d.lastFlapId < 0) d.lastFlapId = pose.flapId;
    const newFlap = pose.flapId > d.lastFlapId;
    d.lastFlapId = pose.flapId;

    if (pose.perched !== d.perched) {
      d.perched = pose.perched;
      d.flapping = false;
      d.pecking = false;
      if (pose.perched) {
        d.takingOff = false;
        d.perchTime = 0;
        d.nextPeckAt = FIRST_PECK_DELAY;
        fadeTo('perch', PERCH_FADE);
      } else {
        d.takingOff = true;
        restart('takeoff', TAKEOFF_FADE);
      }
    }

    if (d.perched) {
      d.perchTime += dt;
      if (!d.pecking && d.perchTime >= d.nextPeckAt) {
        const pecks =
          PECKS_MIN + Math.floor(Math.random() * (PECKS_MAX - PECKS_MIN + 1));
        const peck = actions.peck;
        restart('peck', PECK_IN);
        peck.setLoop(THREE.LoopRepeat, pecks);
        d.pecking = true;
        d.lastPeckTime = 0;
        d.peckEndsAt = d.perchTime + pecks * peck.getClip().duration;
      } else if (d.pecking && d.perchTime >= d.peckEndsAt) {
        d.pecking = false;
        d.nextPeckAt =
          d.perchTime +
          PECK_PAUSE_MIN +
          Math.random() * (PECK_PAUSE_MAX - PECK_PAUSE_MIN);
        fadeTo('perch', PECK_OUT);
      }
    } else if (d.takingOff) {
      const takeoff = actions.takeoff;
      if (takeoff.time >= takeoff.getClip().duration) {
        d.takingOff = false;
        d.flapping = true;
        d.activeFlap = d.activeFlap === 'flapA' ? 'flapB' : 'flapA';
        restart(d.activeFlap, FLAP_FADE);
      }
    } else if (newFlap) {
      d.flapping = true;
      d.activeFlap = d.activeFlap === 'flapA' ? 'flapB' : 'flapA';
      restart(d.activeFlap, FLAP_FADE);
    } else if (d.flapping) {
      const flap = actions[d.activeFlap];
      if (flap.time >= flap.getClip().duration * FLAP_RELEASE) {
        d.flapping = false;
        fadeTo('glide', GLIDE_FADE);
      }
    }

    // Weights move linearly toward their targets and are normalised to sum to 1,
    // so no blend ever leaks the bind pose in mid-fade.
    let total = 0;
    for (const key of names) {
      const w = weights[key];
      const step = w.rate * dt;
      w.weight += THREE.MathUtils.clamp(w.target - w.weight, -step, step);
      total += w.weight;
    }
    for (const key of names) {
      actions[key].setEffectiveWeight(
        total > 0 ? weights[key].weight / total : 0
      );
    }

    mixer.update(dt);

    const peck = actions.peck;
    if (d.pecking || weights.peck.weight > 0) {
      const phase = peck.time;
      if (
        d.lastPeckTime < PECK_HIT_TIME &&
        phase >= PECK_HIT_TIME &&
        peck.getEffectiveWeight() > 0.5
      ) {
        birdPecks.count++;
      }
      d.lastPeckTime = phase;
    }
  });

  return (
    <group scale={scale}>
      <primitive object={rig.root} />
    </group>
  );
}

useGLTF.preload(BIRD_MODEL);
// PRELOAD ALL SPECIES TEXTURES
Object.values(BIRD_SPECIES_TEXTURES).forEach((url) => useTexture.preload(url));

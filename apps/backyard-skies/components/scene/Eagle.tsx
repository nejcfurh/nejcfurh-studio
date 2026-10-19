'use client';

import {
  EAGLE_MODEL,
  MATTE_SHADING,
  useAnimatedPhongModel
} from '@/lib/assets';
import { useGameStore } from '@/store/gameStore';
import { EAGLE_DODGE_WINDOW, EAGLE_WARNING_TIME } from '@/utils/constants';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RefObject, Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

// EAGLE BY ROBERT MIRABELLE [CC-BY] VIA POLY PIZZA

// Approach curve in the bird's frame (x screen-right, y up, z forward): it
// appears high and far ahead, swings out to the side and dives onto the bird.
// The model's body sits above its origin, hence the low end point.
const P0 = new THREE.Vector3(0, 8, 30);
const P1 = new THREE.Vector3(9, 13, 22);
const P2 = new THREE.Vector3(4, 3, 8);
const P3 = new THREE.Vector3(0, -1, 0);
// Share of the curve flown during the warning; the dive takes the rest.
const WARNING_SHARE = 0.45;

const EXIT_DURATION = 1.5;
const EXIT_SPEED = 22;
const EXIT_CLIMB = 6;

const FACING_DAMPING = 10;
const HOVER_DAMPING = 4;

// Body animation (clips in eagle.glb). The warning opens with a climb on
// flapping wings, glides, and tucks into the stoop for the last DIVE_LEAD
// seconds before the dodge window; the strike clip ends as the window closes.
const CLIMB_TIME = 1.2;
const DIVE_LEAD = 0.5;
const EAGLE_FADE = 0.25;
// Skinned meshes are culled against their bind-pose bounds; the wingbeats and
// the strike reach a little beyond them.
const BOUNDS_MARGIN = 1.2;

type StoreState = ReturnType<typeof useGameStore.getState>;
type EagleClip = 'soar' | 'flap' | 'dive' | 'strike' | 'hover';
const CLIPS: EagleClip[] = ['soar', 'flap', 'dive', 'strike', 'hover'];

const UP = new THREE.Vector3(0, 1, 0);
const _local = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _target = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _matrix = new THREE.Matrix4();
const _quat = new THREE.Quaternion();

function bezier(s: number, out: THREE.Vector3): THREE.Vector3 {
  const u = 1 - s;
  return out
    .copy(P0)
    .multiplyScalar(u * u * u)
    .addScaledVector(P1, 3 * u * u * s)
    .addScaledVector(P2, 3 * u * s * s)
    .addScaledVector(P3, s * s * s);
}

function bezierTangent(s: number, out: THREE.Vector3): THREE.Vector3 {
  const u = 1 - s;
  return out
    .subVectors(P1, P0)
    .multiplyScalar(3 * u * u)
    .addScaledVector(_lookAt.subVectors(P2, P1), 6 * u * s)
    .addScaledVector(_lookAt.subVectors(P3, P2), 3 * s * s);
}

/** Curve parameter from the threat timers, so the dive lands as the window closes. */
function approachProgress(eagleTimer: number, dodgeWindow: number): number {
  if (dodgeWindow > 0) {
    const d = THREE.MathUtils.clamp(1 - dodgeWindow / EAGLE_DODGE_WINDOW, 0, 1);
    // Accelerates into the strike.
    return WARNING_SHARE + (1 - WARNING_SHARE) * d * (0.6 + 0.4 * d);
  }
  if (eagleTimer <= 0) return WARNING_SHARE;
  return (
    WARNING_SHARE *
    THREE.MathUtils.clamp(1 - eagleTimer / EAGLE_WARNING_TIME, 0, 1)
  );
}

/** One mixer for the eagle, with cross-fades between the clips in eagle.glb. */
class EagleAnimator {
  private readonly mixer: THREE.AnimationMixer;
  private readonly actions: Record<EagleClip, THREE.AnimationAction>;
  private current: EagleClip | null = null;
  readonly strikeDuration: number;

  constructor(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(root);
    const entries = CLIPS.map((name) => {
      const clip = THREE.AnimationClip.findByName(clips, name);
      if (!clip) throw new Error(`eagle.glb has no "${name}" clip`);
      return [name, this.mixer.clipAction(clip)] as const;
    });
    this.actions = Object.fromEntries(entries) as Record<
      EagleClip,
      THREE.AnimationAction
    >;
    this.actions.strike.setLoop(THREE.LoopOnce, 1);
    this.actions.strike.clampWhenFinished = true;
    this.strikeDuration = this.actions.strike.getClip().duration;
  }

  /** Starts a clip at `time`, fading out the one playing (no fade: snaps). */
  play(name: EagleClip, fade: number, time = 0) {
    if (name === this.current) return;
    const next = this.actions[name];
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    next.time = time;
    const prev = this.current ? this.actions[this.current] : null;
    if (prev && fade > 0) next.crossFadeFrom(prev, fade, false);
    else prev?.stop();
    this.current = name;
  }

  update(delta: number) {
    this.mixer.update(delta);
  }

  stop() {
    this.mixer.stopAllAction();
    this.current = null;
  }
}

/** The clip for the eagle's current flight phase. */
function clipFor(
  s: StoreState,
  exiting: boolean,
  strikeDuration: number
): EagleClip {
  if (exiting) return 'flap';
  if (s.eagleAltitudeHunt) return 'hover';
  if (s.eagleDodgeWindow > 0) {
    return s.eagleDodgeWindow <= strikeDuration ? 'strike' : 'dive';
  }
  if (s.eagleTimer <= DIVE_LEAD) return 'dive';
  return s.eagleTimer > EAGLE_WARNING_TIME - CLIMB_TIME ? 'flap' : 'soar';
}

/**
 * Plays the clip for this frame's phase and advances the mixer while the eagle
 * is on screen and the game runs. `wasVisible` is last frame's visibility: an
 * eagle that appears snaps to its clip instead of fading in.
 */
function animate(
  animator: EagleAnimator | null,
  s: StoreState,
  exiting: boolean,
  wasVisible: boolean,
  delta: number
) {
  if (!animator || (exiting && !wasVisible)) return;
  const clip = clipFor(s, exiting, animator.strikeDuration);
  // Joins the strike where the window stands, so the talons reach forward as
  // it closes.
  const time =
    clip === 'strike'
      ? Math.max(0, animator.strikeDuration - s.eagleDodgeWindow)
      : 0;
  animator.play(clip, wasVisible ? EAGLE_FADE : 0, time);
  if (!s.isPaused) animator.update(delta);
}

/** Bird-frame vector to world space for a bird heading `heading`. */
function toWorld(local: THREE.Vector3, heading: number, out: THREE.Vector3) {
  _forward.set(Math.sin(heading), 0, Math.cos(heading));
  _right.set(-Math.cos(heading), 0, Math.sin(heading));
  return out
    .copy(_right)
    .multiplyScalar(local.x)
    .addScaledVector(UP, local.y)
    .addScaledVector(_forward, local.z);
}

function faceDirection(
  group: THREE.Group,
  direction: THREE.Vector3,
  delta: number,
  snap: boolean
) {
  if (direction.lengthSq() < 1e-6) return;
  // +Z faces `direction`, matching Object3D.lookAt for non-camera objects.
  _lookAt.copy(group.position).add(direction);
  _matrix.lookAt(_lookAt, group.position, UP);
  _quat.setFromRotationMatrix(_matrix);
  if (snap) group.quaternion.copy(_quat);
  else group.quaternion.slerp(_quat, 1 - Math.exp(-FACING_DAMPING * delta));
}

export default function Eagle() {
  const groupRef = useRef<THREE.Group>(null);
  const animatorRef = useRef<EagleAnimator | null>(null);
  const exitTimer = useRef(-1);
  const exitStart = useRef(new THREE.Vector3());
  const exitDirection = useRef(new THREE.Vector3());
  const lastDirection = useRef(new THREE.Vector3(0, 0, -1));
  const runId = useRef(-1);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = useGameStore.getState();

    if (s.runId !== runId.current) {
      runId.current = s.runId;
      exitTimer.current = -1;
      group.visible = false;
    }

    const wasVisible = group.visible;
    const hunting = s.threatType === 'eagle' && s.gameState === 'flight';
    animate(animatorRef.current, s, !hunting, wasVisible, delta);
    if (s.isPaused) return;

    if (hunting) {
      exitTimer.current = -1;
      group.visible = true;
      // Game time stops while paused, so the hover holds still with it.
      const t = s.gameTime;

      if (s.eagleAltitudeHunt) {
        // HOVERS AHEAD OF THE BIRD, FACING IT
        _forward.set(Math.sin(s.rotation), 0, Math.cos(s.rotation));
        const dist = 10 + Math.sin(t * 1.2) * 2;
        _target
          .set(...s.position)
          .addScaledVector(_forward, dist)
          .addScaledVector(UP, 1 + Math.sin(t * 1.5) * 0.5);
        if (wasVisible) {
          group.position.lerp(_target, 1 - Math.exp(-HOVER_DAMPING * delta));
        } else {
          group.position.copy(_target);
        }
        _target.set(...s.position).sub(group.position);
        faceDirection(group, _target, delta, !wasVisible);
        lastDirection.current.copy(_target).normalize();
        return;
      }

      // During the dodge window the approach keeps the heading it had when
      // the window opened, so turning away visibly leaves the eagle's line.
      const heading =
        s.eagleDodgeWindow > 0 ? s.eagleDodgeStartRotation : s.rotation;
      const progress = approachProgress(s.eagleTimer, s.eagleDodgeWindow);
      toWorld(bezier(progress, _local), heading, _target);
      group.position.set(...s.position).add(_target);
      toWorld(bezierTangent(progress, _local), heading, _tangent);
      faceDirection(group, _tangent, delta, !wasVisible);
      lastDirection.current.copy(_tangent).normalize();
      return;
    }

    if (!wasVisible) return;

    // Dodged, caught or perched: carry on past the bird and climb away.
    if (exitTimer.current < 0) {
      exitTimer.current = 0;
      exitStart.current.copy(group.position);
      exitDirection.current.copy(lastDirection.current);
      exitDirection.current.y = Math.max(exitDirection.current.y, -0.3);
      exitDirection.current.normalize();
    }
    if (!s.isPaused) exitTimer.current += delta;
    const et = exitTimer.current;
    if (et >= EXIT_DURATION) {
      group.visible = false;
      exitTimer.current = -1;
      return;
    }
    group.position
      .copy(exitStart.current)
      .addScaledVector(exitDirection.current, EXIT_SPEED * et)
      .addScaledVector(UP, EXIT_CLIMB * et * et);
    _tangent
      .copy(exitDirection.current)
      .multiplyScalar(EXIT_SPEED)
      .addScaledVector(UP, 2 * EXIT_CLIMB * et);
    faceDirection(group, _tangent, delta, false);
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* OWN BOUNDARY: THIS COMPONENT SITS OUTSIDE THE SCENE'S SUSPENSE */}
      <Suspense fallback={null}>
        <EagleModel animatorRef={animatorRef} />
      </Suspense>
    </group>
  );
}

function EagleModel({
  animatorRef
}: {
  animatorRef: RefObject<EagleAnimator | null>;
}) {
  const { scene, animations } = useAnimatedPhongModel(
    EAGLE_MODEL,
    MATTE_SHADING
  );
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const world = useThree((state) => state.scene);
  const rig = useMemo(() => {
    const root = cloneSkinned(scene);
    root.updateMatrixWorld(true);
    root.traverse((child) => {
      if (!(child instanceof THREE.SkinnedMesh)) return;
      child.computeBoundingSphere();
      if (child.boundingSphere) child.boundingSphere.radius *= BOUNDS_MARGIN;
    });
    return { root, animator: new EagleAnimator(root, animations) };
  }, [scene, animations]);

  // The skinned Phong variant is a shader nothing else uses; compile it now
  // rather than on the frame the first eagle appears.
  useEffect(() => {
    gl.compile(rig.root, camera, world);
  }, [gl, camera, world, rig]);

  useEffect(() => {
    const { animator } = rig;
    animatorRef.current = animator;
    return () => {
      if (animatorRef.current === animator) animatorRef.current = null;
      animator.stop();
    };
  }, [rig, animatorRef]);

  // Turned so the beak points along +Z, the axis faceDirection aims.
  return (
    <primitive object={rig.root} scale={0.045} rotation={[0, Math.PI, 0]} />
  );
}

useGLTF.preload(EAGLE_MODEL);

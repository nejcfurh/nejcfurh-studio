// Pure flight physics — no store, no audio.

import { BirdAttributes } from '@/types';
import {
  FORWARD_SPEED_BASE,
  GLIDE_GRAVITY_FACTOR,
  GLIDE_SPEED_GAIN,
  GRAVITY,
  MAX_ALTITUDE,
  MIN_ALTITUDE,
  SPEED_CLIMB_BLEED,
  SPEED_DIVE_GAIN,
  SPEED_MAX_FACTOR,
  SPEED_MIN_FACTOR,
  SPEED_RECOVERY_RATE,
  TURN_SPEED
} from '@/utils/constants';

export interface FlightInput {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  /** Forward speed; clamped to the species' speed range. */
  speed: number;
  /** Flaps accepted since the previous step; each applies its own impulse. */
  flaps: number;
  flapCooldown: number;
  flapStrength: number;
  gliding: boolean;
  joystickX: number;
  attrs: BirdAttributes;
  delta: number;
}

export interface FlightResult {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  speed: number;
  flapCooldown: number;
  staminaCost: number;
  onGround: boolean;
}

export function cruiseSpeed(attrs: BirdAttributes): number {
  return (FORWARD_SPEED_BASE * attrs.speed) / 20;
}

export interface SpeedInput {
  speed: number;
  verticalVelocity: number;
  cruise: number;
  gliding: boolean;
  delta: number;
}

/** Diving trades altitude for speed, climbing trades it back, and both settle at cruise. */
export function computeSpeedStep(input: SpeedInput): number {
  const { speed, verticalVelocity, cruise, gliding, delta } = input;
  const sink = Math.max(0, -verticalVelocity);
  const climb = Math.max(0, verticalVelocity);
  const accel =
    sink * SPEED_DIVE_GAIN -
    climb * SPEED_CLIMB_BLEED +
    (gliding ? GLIDE_SPEED_GAIN : 0);
  const pushed = speed + accel * delta;
  const settled =
    cruise + (pushed - cruise) * Math.exp(-SPEED_RECOVERY_RATE * delta);
  return Math.min(
    cruise * SPEED_MAX_FACTOR,
    Math.max(cruise * SPEED_MIN_FACTOR, settled)
  );
}

export function computeFlightStep(input: FlightInput): FlightResult {
  const {
    position,
    velocity,
    flaps,
    flapStrength,
    gliding,
    joystickX,
    attrs,
    delta
  } = input;

  const rotation = input.rotation + joystickX * TURN_SPEED * delta;
  const forwardX = Math.sin(rotation);
  const forwardZ = Math.cos(rotation);

  // A glide only slows the sink; it must not stretch a flap's climb.
  let vy = velocity[1];
  const gravityScale = gliding && vy <= 0 ? GLIDE_GRAVITY_FACTOR : 1;
  vy += GRAVITY * 0.6 * gravityScale * delta;

  let staminaCost = 0;
  if (flaps > 0) {
    vy += 6.0 * attrs.flapPower * flapStrength * flaps;
    staminaCost = 2 * flaps;
  }

  // Frame-rate independent drag
  vy *= Math.exp(-1.82 * delta);

  const speed = computeSpeedStep({
    speed: input.speed,
    verticalVelocity: vy,
    cruise: cruiseSpeed(attrs),
    gliding,
    delta
  });

  const newX = position[0] + forwardX * speed * delta;
  let newY = position[1] + vy * delta;
  const newZ = position[2] + forwardZ * speed * delta;

  newY = Math.max(MIN_ALTITUDE, Math.min(MAX_ALTITUDE, newY));

  const onGround = newY <= MIN_ALTITUDE;
  if (onGround && vy <= 0) {
    vy = Math.max(0, vy);
  }

  const flapCooldown = Math.max(0, input.flapCooldown - delta);

  return {
    position: [newX, newY, newZ],
    velocity: [forwardX * speed, vy, forwardZ * speed],
    rotation,
    speed,
    flapCooldown,
    staminaCost,
    onGround
  };
}

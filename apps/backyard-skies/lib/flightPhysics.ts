// Pure flight physics — no store, no audio.

import { BirdAttributes } from '@/types';
import {
  GRAVITY,
  FORWARD_SPEED_BASE,
  TURN_SPEED,
  MAX_ALTITUDE,
  MIN_ALTITUDE,
} from '@/utils/constants';

export interface FlightInput {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  isFlapping: boolean;
  flapCooldown: number;
  flapStrength: number;
  flapApplied: boolean;
  joystickX: number;
  attrs: BirdAttributes;
  delta: number;
}

export interface FlightResult {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: number;
  flapCooldown: number;
  flapApplied: boolean;
  staminaCost: number;
  onGround: boolean;
}

export function computeFlightStep(input: FlightInput): FlightResult {
  const { position, velocity, isFlapping, flapStrength, joystickX, attrs, delta } = input;

  // Update rotation from joystick
  const rotation = input.rotation + joystickX * TURN_SPEED * delta;

  // Forward direction
  const forwardX = Math.sin(rotation);
  const forwardZ = Math.cos(rotation);
  const forwardSpeed = (FORWARD_SPEED_BASE * attrs.speed) / 20;

  // Vertical velocity
  let vy = velocity[1];
  vy += GRAVITY * 0.6 * delta;

  // Flap impulse (once per tap)
  let flapApplied = input.flapApplied;
  let staminaCost = 0;
  if (isFlapping && !flapApplied) {
    flapApplied = true;
    vy += 6.0 * attrs.flapPower * flapStrength;
    staminaCost = 2;
  }
  if (!isFlapping) {
    flapApplied = false;
  }

  // Frame-rate independent drag
  vy *= Math.exp(-1.82 * delta);

  // New position
  const newX = position[0] + forwardX * forwardSpeed * delta;
  let newY = position[1] + vy * delta;
  const newZ = position[2] + forwardZ * forwardSpeed * delta;

  // Clamp altitude
  newY = Math.max(MIN_ALTITUDE, Math.min(MAX_ALTITUDE, newY));

  // Ground detection
  const onGround = newY <= MIN_ALTITUDE;
  if (onGround && vy <= 0) {
    vy = Math.max(0, vy);
  }

  // Tick down cooldown
  const flapCooldown = Math.max(0, input.flapCooldown - delta);

  return {
    position: [newX, newY, newZ],
    velocity: [forwardX * forwardSpeed, vy, forwardZ * forwardSpeed],
    rotation,
    flapCooldown,
    flapApplied,
    staminaCost,
    onGround,
  };
}

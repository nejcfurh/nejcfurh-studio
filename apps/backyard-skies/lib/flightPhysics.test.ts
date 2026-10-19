import { BirdAttributes } from '@/types';
import {
  GLIDE_GRAVITY_FACTOR,
  SPEED_MAX_FACTOR,
  SPEED_MIN_FACTOR
} from '@/utils/constants';
import { describe, expect, it } from 'vitest';

import {
  computeFlightStep,
  computeSpeedStep,
  cruiseSpeed,
  FlightInput
} from './flightPhysics';

const cardinal: BirdAttributes = {
  speed: 7,
  flapPower: 1,
  stamina: 80,
  maxFood: 85,
  maxWater: 75,
  feedRate: 10,
  drinkRate: 8,
  foodDrain: 2,
  waterDrain: 1.5
};

const FRAME = 1 / 60;
const CRUISE = cruiseSpeed(cardinal);

const level = (overrides: Partial<FlightInput> = {}): FlightInput => ({
  position: [0, 15, 0],
  velocity: [0, 0, 0],
  rotation: 0,
  speed: CRUISE,
  flaps: 0,
  flapCooldown: 0,
  flapStrength: 1,
  gliding: false,
  joystickX: 0,
  attrs: cardinal,
  delta: FRAME,
  ...overrides
});

/** Flaps on the frame each tap lands, as the store hands them to the loop. */
function countImpulses(tapTimes: number[], seconds: number) {
  let input = level();
  let impulses = 0;
  const pending = [...tapTimes];
  for (let t = 0; t < seconds; t += FRAME) {
    let flaps = 0;
    while (pending.length > 0 && pending[0] <= t) {
      pending.shift();
      flaps++;
    }
    const step = computeFlightStep({ ...input, flaps });
    if (step.velocity[1] - input.velocity[1] > 3) impulses++;
    input = {
      ...input,
      position: step.position,
      velocity: step.velocity,
      rotation: step.rotation,
      speed: step.speed
    };
  }
  return impulses;
}

function fly(seconds: number, overrides: Partial<FlightInput> = {}) {
  let input = level(overrides);
  for (let t = 0; t < seconds; t += FRAME) {
    const step = computeFlightStep(input);
    input = {
      ...input,
      position: step.position,
      velocity: step.velocity,
      rotation: step.rotation,
      speed: step.speed
    };
  }
  return input;
}

describe('computeFlightStep flaps', () => {
  it('applies one impulse per accepted flap when taps are 0.17 s apart', () => {
    expect(countImpulses([0.1, 0.27], 1)).toBe(2);
  });

  it('applies one impulse per accepted flap when taps are 0.5 s apart', () => {
    expect(countImpulses([0.1, 0.6], 1.2)).toBe(2);
  });

  it('applies no impulse without a flap', () => {
    expect(countImpulses([], 1)).toBe(0);
  });

  it('charges stamina for every flap it applies', () => {
    expect(computeFlightStep(level({ flaps: 1 })).staminaCost).toBe(2);
    expect(computeFlightStep(level({ flaps: 0 })).staminaCost).toBe(0);
  });
});

describe('computeSpeedStep', () => {
  const step = (speed: number, verticalVelocity: number, gliding = false) =>
    computeSpeedStep({
      speed,
      verticalVelocity,
      cruise: CRUISE,
      gliding,
      delta: FRAME
    });

  it('speeds the bird up while it dives', () => {
    expect(step(CRUISE, -3)).toBeGreaterThan(CRUISE);
  });

  it('bleeds speed while the bird climbs', () => {
    expect(step(CRUISE * 1.5, 4)).toBeLessThan(CRUISE * 1.5);
  });

  it('returns to cruise speed in level flight from above and below', () => {
    let fast = CRUISE * SPEED_MAX_FACTOR;
    let slow = CRUISE * SPEED_MIN_FACTOR;
    for (let t = 0; t < 15; t += FRAME) {
      fast = step(fast, 0);
      slow = step(slow, 0);
    }
    expect(fast).toBeCloseTo(CRUISE, 1);
    expect(slow).toBeCloseTo(CRUISE, 1);
  });

  it('never exceeds the maximum speed in a sustained dive', () => {
    let speed = CRUISE;
    for (let t = 0; t < 30; t += FRAME) speed = step(speed, -50);
    expect(speed).toBeCloseTo(CRUISE * SPEED_MAX_FACTOR, 5);
  });

  it('never drops below the minimum speed in a sustained climb', () => {
    let speed = CRUISE;
    for (let t = 0; t < 30; t += FRAME) speed = step(speed, 50);
    expect(speed).toBeCloseTo(CRUISE * SPEED_MIN_FACTOR, 5);
  });

  it('gains a little speed while gliding level', () => {
    expect(step(CRUISE, 0, true)).toBeGreaterThan(step(CRUISE, 0, false));
  });
});

describe('gliding', () => {
  it('loses much less altitude than falling freely', () => {
    const falling = fly(2);
    const gliding = fly(2, { gliding: true });
    const fallLoss = 15 - falling.position[1];
    const glideLoss = 15 - gliding.position[1];
    expect(glideLoss).toBeLessThan(fallLoss * (GLIDE_GRAVITY_FACTOR + 0.05));
  });

  it('does not lengthen the climb of a flap', () => {
    const climbOf = (glide: boolean) => {
      let input = level({ flaps: 1, gliding: glide });
      let peak = input.position[1];
      for (let t = 0; t < 1.5; t += FRAME) {
        const s = computeFlightStep(input);
        peak = Math.max(peak, s.position[1]);
        input = {
          ...input,
          flaps: 0,
          position: s.position,
          velocity: s.velocity,
          speed: s.speed
        };
      }
      return peak;
    };
    expect(climbOf(true)).toBeCloseTo(climbOf(false), 1);
  });

  it('moves the bird forward at its current speed', () => {
    const s = computeFlightStep(level({ speed: CRUISE * 1.5 }));
    expect(s.position[2]).toBeGreaterThan(CRUISE * 1.4 * FRAME);
  });
});

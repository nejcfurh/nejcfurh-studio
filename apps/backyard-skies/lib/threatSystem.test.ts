import { BirdAttributes } from '@/types';
import {
  EAGLE_ALTITUDE_THRESHOLD,
  EAGLE_DODGE_DIVE_DEPTH,
  EAGLE_DODGE_TAPS,
  EAGLE_DODGE_WINDOW
} from '@/utils/constants';
import { describe, expect, it } from 'vitest';

import { computeFlightStep } from './flightPhysics';
import {
  computeEagleInterval,
  computeFirstEagleDelay,
  EagleThreatInput,
  isNearAltitudeLimit,
  tickCatThreat,
  tickEagleThreat
} from './threatSystem';

const cruising = (
  overrides: Partial<EagleThreatInput> = {}
): EagleThreatInput => ({
  altitude: 10,
  rotation: 0,
  delta: 0.016,
  eagleTimer: 30,
  eagleDodgeWindow: 0,
  eagleDodgeStartRotation: 0,
  eagleDodgeStartAltitude: 10,
  eagleDodgeTaps: 0,
  eagleAltitudeHunt: false,
  eagleResumeTimer: 30,
  threatType: null,
  threatWarningActive: false,
  elapsed: 0,
  ...overrides
});

const inDodgeWindow = (
  overrides: Partial<EagleThreatInput> = {}
): EagleThreatInput =>
  cruising({
    eagleTimer: -0.1,
    threatType: 'eagle',
    threatWarningActive: true,
    eagleDodgeWindow: 1,
    ...overrides
  });

const degrees = (d: number) => (d * Math.PI) / 180;

describe('tickEagleThreat', () => {
  it('counts the eagle timer down while cruising', () => {
    const result = tickEagleThreat(cruising({ delta: 0.5 }));
    expect(result.action.type).toBe('none');
    expect(result.eagleTimer).toBeCloseTo(29.5);
  });

  it('starts an altitude hunt when the bird climbs above the threshold', () => {
    const result = tickEagleThreat(cruising({ altitude: 30 }));
    expect(result.action.type).toBe('start_altitude_hunt');
  });

  it('catches the bird when an altitude hunt timer runs out', () => {
    const result = tickEagleThreat(
      cruising({ altitude: 30, eagleAltitudeHunt: true, eagleTimer: 0.01 })
    );
    expect(result.action.type).toBe('altitude_caught');
  });

  it('warns before the eagle attacks', () => {
    const result = tickEagleThreat(cruising({ eagleTimer: 2 }));
    expect(result.action.type).toBe('start_warning');
  });

  it('opens a dodge window once the warned attack arrives', () => {
    const result = tickEagleThreat(
      cruising({
        eagleTimer: 0.01,
        threatType: 'eagle',
        threatWarningActive: true
      })
    );
    expect(result.action.type).toBe('start_dodge_window');
    expect(result.eagleDodgeWindow).toBeGreaterThan(0);
  });

  it('counts a 90 degree turn during the dodge window as a dodge', () => {
    const result = tickEagleThreat(
      cruising({
        eagleTimer: -0.1,
        threatType: 'eagle',
        threatWarningActive: true,
        eagleDodgeWindow: 1,
        rotation: Math.PI / 2
      })
    );
    expect(result.action.type).toBe('dodged');
  });

  it('catches the bird when the dodge window closes without a turn', () => {
    const result = tickEagleThreat(
      cruising({
        eagleTimer: -0.1,
        threatType: 'eagle',
        threatWarningActive: true,
        eagleDodgeWindow: 0.01,
        delta: 0.05
      })
    );
    expect(result.action.type).toBe('caught');
  });
});

describe('tickCatThreat', () => {
  it('fills the meter at 30 per second with a cat and 8 per second without', () => {
    const calm = tickCatThreat({
      threatMeter: 0,
      hasCat: false,
      delta: 1,
      threatWarningActive: false
    });
    const cat = tickCatThreat({
      threatMeter: 0,
      hasCat: true,
      delta: 1,
      threatWarningActive: false
    });
    expect(calm.threatMeter).toBeCloseTo(8);
    expect(cat.threatMeter).toBeCloseTo(30);
  });

  it('gives the bird a little over three seconds at a feeder with a cat', () => {
    const tick = (seconds: number) =>
      tickCatThreat({
        threatMeter: 0,
        hasCat: true,
        delta: seconds,
        threatWarningActive: true
      });
    expect(tick(3.2).caught).toBe(false);
    expect(tick(3.4).caught).toBe(true);
  });

  it('catches the bird when the meter reaches the maximum', () => {
    const result = tickCatThreat({
      threatMeter: 99,
      hasCat: true,
      delta: 1,
      threatWarningActive: true
    });
    expect(result.caught).toBe(true);
    expect(result.threatMeter).toBe(100);
  });
});

describe('eagle timing', () => {
  it('schedules the first eagle no earlier than 45 seconds into a run', () => {
    for (const r of [0, 0.25, 0.5, 0.75, 1]) {
      expect(computeFirstEagleDelay(() => r)).toBeGreaterThanOrEqual(45);
    }
  });

  it('spaces eagles about a minute apart at the start of a run', () => {
    expect(computeEagleInterval(0, () => 0.5)).toBeCloseTo(60);
    expect(computeEagleInterval(0, () => 0)).toBeCloseTo(50);
    expect(computeEagleInterval(0, () => 1)).toBeCloseTo(70);
  });

  it('brings eagles closer together as the run goes on', () => {
    expect(computeEagleInterval(200, () => 0.5)).toBeCloseTo(40);
    expect(computeEagleInterval(400, () => 0.5)).toBeCloseTo(20);
  });

  it('never shortens the base interval below 20 seconds', () => {
    expect(computeEagleInterval(5000, () => 0.5)).toBeCloseTo(20);
    expect(computeEagleInterval(5000, () => 0)).toBeCloseTo(10);
  });

  it('reschedules the eagle on the ramped interval after an altitude hunt ends', () => {
    const result = tickEagleThreat(
      cruising({
        altitude: 20,
        eagleAltitudeHunt: true,
        elapsed: 400,
        random: () => 0.5
      })
    );
    expect(result.action.type).toBe('end_altitude_hunt');
    expect(result.eagleTimer).toBeCloseTo(20);
  });

  it('warns three seconds before the eagle attacks', () => {
    expect(tickEagleThreat(cruising({ eagleTimer: 2.9 })).action.type).toBe(
      'start_warning'
    );
    expect(tickEagleThreat(cruising({ eagleTimer: 3.1 })).action.type).toBe(
      'none'
    );
  });

  it('opens a dodge window of 1.8 seconds', () => {
    const result = tickEagleThreat(
      cruising({
        eagleTimer: 0.01,
        threatType: 'eagle',
        threatWarningActive: true
      })
    );
    expect(result.eagleDodgeWindow).toBeCloseTo(1.8);
  });
});

describe('eagle altitude hunt', () => {
  it('lets the bird cruise at 27 units without an altitude hunt', () => {
    expect(tickEagleThreat(cruising({ altitude: 27 })).action.type).toBe(
      'none'
    );
  });

  it('starts an altitude hunt above 28 units with five seconds to descend', () => {
    const result = tickEagleThreat(cruising({ altitude: 28.5 }));
    expect(result.action.type).toBe('start_altitude_hunt');
    expect(result.eagleTimer).toBe(5);
  });
});

describe('eagle countdown across an altitude hunt', () => {
  function climbAndReturn(eagleTimer: number, secondsAbove: number) {
    const start = tickEagleThreat(cruising({ altitude: 30, eagleTimer }));
    expect(start.action.type).toBe('start_altitude_hunt');
    let hunt = cruising({
      altitude: 30,
      eagleAltitudeHunt: true,
      threatType: 'eagle',
      threatWarningActive: true,
      eagleTimer: start.eagleTimer,
      eagleResumeTimer: start.eagleResumeTimer,
      random: () => 1
    });
    for (let i = 0; i < Math.round(secondsAbove * 10); i++) {
      const r = tickEagleThreat({ ...hunt, delta: 0.1 });
      hunt = { ...hunt, eagleTimer: r.eagleTimer };
    }
    return tickEagleThreat({ ...hunt, altitude: 20 });
  }

  it('resumes the countdown instead of restarting it', () => {
    const end = climbAndReturn(25, 1);
    expect(end.action.type).toBe('end_altitude_hunt');
    expect(end.eagleTimer).toBeCloseTo(24, 1);
  });

  it('never makes the next eagle later than before the climb', () => {
    for (const before of [12, 30, 45]) {
      expect(climbAndReturn(before, 0.5).eagleTimer).toBeLessThanOrEqual(
        before
      );
    }
  });

  it('leaves at least ten seconds before the next eagle', () => {
    expect(climbAndReturn(4, 2).eagleTimer).toBeCloseTo(10);
  });

  it('caps the resumed countdown at a fresh interval', () => {
    const end = tickEagleThreat(
      cruising({
        altitude: 20,
        eagleAltitudeHunt: true,
        eagleTimer: 4,
        eagleResumeTimer: 200,
        elapsed: 400,
        random: () => 0.5
      })
    );
    expect(end.eagleTimer).toBeCloseTo(20);
  });
});

describe('eagle dodge', () => {
  it('counts a 70 degree turn as a dodge', () => {
    const result = tickEagleThreat(inDodgeWindow({ rotation: degrees(70) }));
    expect(result.action.type).toBe('dodged');
  });

  it('does not count a 60 degree turn as a dodge', () => {
    const result = tickEagleThreat(inDodgeWindow({ rotation: degrees(60) }));
    expect(result.action.type).toBe('none');
  });

  it('counts a turn in either direction', () => {
    const result = tickEagleThreat(
      inDodgeWindow({ eagleDodgeStartRotation: 1, rotation: 1 - degrees(75) })
    );
    expect(result.action.type).toBe('dodged');
  });

  it('counts a dive of the dive depth during the window as a dodge', () => {
    const result = tickEagleThreat(
      inDodgeWindow({
        eagleDodgeStartAltitude: 14,
        altitude: 14 - EAGLE_DODGE_DIVE_DEPTH
      })
    );
    expect(result.action.type).toBe('dodged');
  });

  it('does not count a shallow dive as a dodge', () => {
    const result = tickEagleThreat(
      inDodgeWindow({
        eagleDodgeStartAltitude: 14,
        altitude: 14 - EAGLE_DODGE_DIVE_DEPTH + 0.5
      })
    );
    expect(result.action.type).toBe('none');
  });

  it('does not count a climb as a dive', () => {
    const result = tickEagleThreat(
      inDodgeWindow({ eagleDodgeStartAltitude: 10, altitude: 16 })
    );
    expect(result.action.type).toBe('none');
  });

  it('requires taps rather than a turn near the altitude limit', () => {
    const high = EAGLE_ALTITUDE_THRESHOLD - 2;
    const turn = tickEagleThreat(
      inDodgeWindow({
        altitude: high,
        eagleDodgeStartAltitude: high,
        rotation: degrees(90)
      })
    );
    expect(turn.action.type).toBe('none');

    const taps = tickEagleThreat(
      inDodgeWindow({
        altitude: high,
        eagleDodgeStartAltitude: high,
        eagleDodgeTaps: EAGLE_DODGE_TAPS
      })
    );
    expect(taps.action.type).toBe('dodged');
  });

  it('accepts a dive near the altitude limit', () => {
    const high = EAGLE_ALTITUDE_THRESHOLD - 1;
    const result = tickEagleThreat(
      inDodgeWindow({
        altitude: high - EAGLE_DODGE_DIVE_DEPTH,
        eagleDodgeStartAltitude: high
      })
    );
    expect(result.action.type).toBe('dodged');
  });
});

describe('isNearAltitudeLimit', () => {
  it('flags altitudes within five units of the hunt threshold', () => {
    expect(isNearAltitudeLimit(EAGLE_ALTITUDE_THRESHOLD - 4)).toBe(true);
    expect(isNearAltitudeLimit(EAGLE_ALTITUDE_THRESHOLD - 6)).toBe(false);
  });
});

describe('eagle dodge reachability with real flight physics', () => {
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

  function simulateWindow(options: { joystickX: number; flapEvery: number }) {
    const frame = 1 / 60;
    let position: [number, number, number] = [0, 14, 0];
    let velocity: [number, number, number] = [0, 0, 0];
    let rotation = 0;
    let speed = 0;
    let window = EAGLE_DODGE_WINDOW;
    let elapsed = 0;
    while (elapsed < EAGLE_DODGE_WINDOW + 0.1) {
      const flaps =
        options.flapEvery > 0 && elapsed % options.flapEvery < frame ? 1 : 0;
      const step = computeFlightStep({
        position,
        velocity,
        rotation,
        speed,
        flaps,
        flapCooldown: 0,
        flapStrength: 1,
        gliding: false,
        joystickX: options.joystickX,
        attrs: cardinal,
        delta: frame
      });
      position = step.position;
      velocity = step.velocity;
      rotation = step.rotation;
      speed = step.speed;
      const result = tickEagleThreat(
        cruising({
          altitude: position[1],
          rotation,
          delta: frame,
          eagleTimer: -0.1,
          threatType: 'eagle',
          threatWarningActive: true,
          eagleDodgeWindow: window,
          eagleDodgeStartRotation: 0,
          eagleDodgeStartAltitude: 14
        })
      );
      if (result.action.type !== 'none') return result.action.type;
      window = result.eagleDodgeWindow;
      elapsed += frame;
    }
    return 'none';
  }

  it('lets a bird that stops flapping dive clear within the window', () => {
    expect(simulateWindow({ joystickX: 0, flapEvery: 0 })).toBe('dodged');
  });

  it('lets a bird holding a full turn dodge within the window', () => {
    expect(simulateWindow({ joystickX: 1, flapEvery: 0.4 })).toBe('dodged');
  });

  it('catches a bird that keeps flapping straight ahead', () => {
    expect(simulateWindow({ joystickX: 0, flapEvery: 0.4 })).toBe('caught');
  });
});

describe('altitude hunt during a dodge window', () => {
  it('closes the open dodge window so descending can end the hunt', () => {
    const result = tickEagleThreat(
      inDodgeWindow({ altitude: EAGLE_ALTITUDE_THRESHOLD + 0.2 })
    );
    expect(result.action.type).toBe('start_altitude_hunt');
    expect(result.eagleDodgeWindow).toBe(0);
  });
});

import { FeederData } from '@/types';
import { describe, expect, it } from 'vitest';

import { isFeederLocked, lockFeeder } from './feederManager';

const feeder = (overrides: Partial<FeederData> = {}): FeederData => ({
  id: 1,
  position: [0, 0, 0],
  hasCat: false,
  type: 'feeder',
  ...overrides
});

describe('isFeederLocked', () => {
  it('treats a feeder that was never locked as open', () => {
    expect(isFeederLocked(feeder(), 0)).toBe(false);
  });

  it('keeps a feeder locked until the game clock reaches its unlock time', () => {
    const locked = feeder({ lockedUntil: 70 });
    expect(isFeederLocked(locked, 69.9)).toBe(true);
    expect(isFeederLocked(locked, 70)).toBe(false);
  });
});

describe('lockFeeder', () => {
  it('locks only the given feeder for sixty seconds of game time', () => {
    const feeders = [feeder({ id: 1 }), feeder({ id: 2 })];
    const updated = lockFeeder(feeders, 1, 12.5);
    expect(updated[0].lockedUntil).toBe(72.5);
    expect(updated[1].lockedUntil).toBeUndefined();
    expect(isFeederLocked(updated[0], 72)).toBe(true);
    expect(isFeederLocked(updated[0], 72.5)).toBe(false);
  });

  it('does not stay locked across a long pause because the lock uses game time', () => {
    const [locked] = lockFeeder([feeder()], 1, 10);
    // A pause stops the game clock, so the lock depends only on simulated seconds.
    expect(isFeederLocked(locked, 10 + 59)).toBe(true);
    expect(isFeederLocked(locked, 10 + 60)).toBe(false);
  });
});

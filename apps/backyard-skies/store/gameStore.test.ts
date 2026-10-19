import { EAGLE_WARNING_TIME } from '@/utils/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/audioManager', () => ({
  audioManager: new Proxy({}, { get: () => () => undefined })
}));
vi.mock('@repo/database/supabase', () => ({
  createSupabaseClient: () => ({})
}));

const { useGameStore } = await import('./gameStore');
const state = () => useGameStore.getState();

const feeder = {
  id: 1,
  position: [0, 0, 0] as [number, number, number],
  hasCat: false,
  type: 'feeder' as const
};

describe('gameStore', () => {
  beforeEach(() => {
    state().startGame();
    useGameStore.setState({ sceneReady: true, feeders: [feeder] });
  });

  it('ends the eagle encounter when the bird lands mid-dodge, and schedules the next eagle', () => {
    useGameStore.setState({
      threatType: 'eagle',
      threatWarningActive: true,
      eagleDodgeWindow: 1.2,
      eagleTimer: -0.1
    });
    state().landOnFeeder(feeder);

    expect(state().threatType).toBeNull();
    expect(state().threatWarningActive).toBe(false);
    expect(state().eagleDodgeWindow).toBe(0);
    expect(state().eagleTimer).toBeGreaterThan(EAGLE_WARNING_TIME);
  });

  it('keeps a far-off eagle countdown when landing without an encounter', () => {
    useGameStore.setState({ eagleTimer: 42 });
    state().landOnFeeder(feeder);
    expect(state().eagleTimer).toBe(42);
  });

  it('does not fly away from a feeder while paused', () => {
    state().landOnFeeder(feeder);
    useGameStore.setState({ perchTime: 3 });
    state().pauseGame();
    state().flyAway();
    expect(state().gameState).toBe('feeding');
  });
});

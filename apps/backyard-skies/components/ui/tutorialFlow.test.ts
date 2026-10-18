import { describe, expect, it } from 'vitest';

import {
  advanceTutorial,
  FOOD_PROMPT_DELAY,
  INITIAL_TUTORIAL_STATE,
  PROMPT_GAP,
  PROMPT_TIMEOUT,
  TutorialSnapshot,
  TutorialState
} from './tutorialFlow';

function snapshot(overrides: Partial<TutorialSnapshot> = {}): TutorialSnapshot {
  return {
    sceneReady: true,
    gameState: 'flight',
    gameTime: 0,
    flapsThisRun: 0,
    isGliding: false,
    threatType: null,
    eagleAltitudeHunt: false,
    ...overrides
  };
}

function run(
  snapshots: Partial<TutorialSnapshot>[],
  start: TutorialState = INITIAL_TUTORIAL_STATE
): TutorialState {
  return snapshots.reduce(
    (state, s) => advanceTutorial(state, snapshot(s)),
    start
  );
}

const AFTER_GAP = PROMPT_GAP + 0.01;

describe('advanceTutorial', () => {
  it('shows nothing until the scene is ready', () => {
    const state = run([{ sceneReady: false, gameTime: 5 }]);
    expect(state.step).toBeNull();
  });

  it('asks for a flap once the scene is ready and hides it on the first flap', () => {
    const shown = run([{ gameTime: AFTER_GAP }]);
    expect(shown.step).toBe('flap');
    const hidden = run([{ gameTime: AFTER_GAP + 1, flapsThisRun: 1 }], shown);
    expect(hidden.step).toBeNull();
  });

  it('asks for a glide after three flaps and hides it when the player glides', () => {
    const glide = run([
      { gameTime: AFTER_GAP },
      { gameTime: 1, flapsThisRun: 1 },
      { gameTime: 3, flapsThisRun: 3 }
    ]);
    expect(glide.step).toBe('glide');
    const glided = run(
      [{ gameTime: 4, flapsThisRun: 4, isGliding: true }],
      glide
    );
    expect(glided.step).toBeNull();
    const food = run([{ gameTime: 4 + AFTER_GAP, flapsThisRun: 4 }], glided);
    expect(food.step).toBe('food');
  });

  it('shows the food prompt after the delay when the player never glides', () => {
    const glide = run([
      { gameTime: AFTER_GAP },
      { gameTime: 1, flapsThisRun: 3 },
      { gameTime: 2, flapsThisRun: 3 }
    ]);
    expect(glide.step).toBe('glide');
    const timedOut = run(
      [{ gameTime: 2 + PROMPT_TIMEOUT, flapsThisRun: 5 }],
      glide
    );
    expect(timedOut.step).toBeNull();
    const food = run(
      [{ gameTime: 2 + FOOD_PROMPT_DELAY, flapsThisRun: 6 }],
      timedOut
    );
    expect(food.step).toBe('food');
  });

  it('switches to the perch prompt on landing and finishes when the bird flies away', () => {
    const perched = run([
      { gameTime: AFTER_GAP },
      { gameTime: 2, flapsThisRun: 1, gameState: 'feeding' }
    ]);
    expect(perched.step).toBe('perch');
    expect(perched.finished).toBe(false);
    const flown = run([{ gameTime: 5, flapsThisRun: 2 }], perched);
    expect(flown.step).toBeNull();
    expect(flown.finished).toBe(true);
    const later = run([{ gameTime: 20, flapsThisRun: 2 }], flown);
    expect(later.step).toBeNull();
  });

  it('still shows the eagle prompt once after the tutorial finished, then never again', () => {
    const finished: TutorialState = {
      ...INITIAL_TUTORIAL_STATE,
      seen: ['flap', 'perch'],
      finished: true
    };
    const eagle = run([{ gameTime: 30, threatType: 'eagle' }], finished);
    expect(eagle.step).toBe('eagle');
    const cleared = run([{ gameTime: 33, threatType: null }], eagle);
    expect(cleared.step).toBeNull();
    const second = run([{ gameTime: 60, threatType: 'eagle' }], cleared);
    expect(second.step).toBeNull();
  });

  it('does not teach the dodge during an altitude hunt, where the escape is to descend', () => {
    const finished: TutorialState = {
      ...INITIAL_TUTORIAL_STATE,
      seen: ['flap', 'perch'],
      finished: true
    };
    const hunt = run(
      [{ gameTime: 30, threatType: 'eagle', eagleAltitudeHunt: true }],
      finished
    );
    expect(hunt.step).toBeNull();
    const attack = run(
      [{ gameTime: 60, threatType: 'eagle', eagleAltitudeHunt: false }],
      hunt
    );
    expect(attack.step).toBe('eagle');
  });

  it('hides a prompt after eight seconds of game time', () => {
    const shown = run([{ gameTime: AFTER_GAP }]);
    const paused = run([{ gameTime: AFTER_GAP + PROMPT_TIMEOUT - 0.1 }], shown);
    expect(paused.step).toBe('flap');
    const expired = run([{ gameTime: AFTER_GAP + PROMPT_TIMEOUT }], paused);
    expect(expired.step).toBeNull();
  });

  it('returns the same state object when nothing changed', () => {
    const shown = run([{ gameTime: AFTER_GAP }]);
    expect(advanceTutorial(shown, snapshot({ gameTime: AFTER_GAP + 1 }))).toBe(
      shown
    );
  });
});

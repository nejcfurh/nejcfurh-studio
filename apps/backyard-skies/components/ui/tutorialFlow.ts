export type TutorialStep = 'flap' | 'glide' | 'food' | 'perch' | 'eagle';

export interface TutorialSnapshot {
  sceneReady: boolean;
  gameState: string;
  gameTime: number;
  flapsThisRun: number;
  isGliding: boolean;
  threatType: string | null;
  eagleAltitudeHunt: boolean;
}

export interface TutorialState {
  step: TutorialStep | null;
  // gameTime when the current step appeared, or when the last one was hidden.
  since: number;
  seen: readonly TutorialStep[];
  glideShownAt: number | null;
  hasGlided: boolean;
  // Set once the perch prompt has been answered; only the eagle prompt can follow.
  finished: boolean;
}

export const PROMPT_TIMEOUT = 8;
export const FOOD_PROMPT_DELAY = 10;
export const GLIDE_PROMPT_FLAPS = 3;
// Pause between two prompts so one does not replace another mid-read.
export const PROMPT_GAP = 0.75;

export const INITIAL_TUTORIAL_STATE: TutorialState = {
  step: null,
  since: 0,
  seen: [],
  glideShownAt: null,
  hasGlided: false,
  finished: false
};

const isPerched = (s: TutorialSnapshot) =>
  s.gameState === 'feeding' || s.gameState === 'drinking';

function stepCompleted(step: TutorialStep, s: TutorialSnapshot): boolean {
  switch (step) {
    case 'flap':
      return s.flapsThisRun >= 1;
    case 'glide':
      return s.isGliding;
    case 'food':
      return isPerched(s);
    case 'perch':
      return !isPerched(s);
    case 'eagle':
      return s.threatType !== 'eagle';
  }
}

function interruptingStep(
  state: TutorialState,
  s: TutorialSnapshot
): TutorialStep | null {
  if (isPerched(s) && !state.seen.includes('perch')) return 'perch';
  // An altitude hunt is escaped by descending, not by the dodge this teaches.
  if (
    s.threatType === 'eagle' &&
    !s.eagleAltitudeHunt &&
    !state.seen.includes('eagle')
  )
    return 'eagle';
  return null;
}

function queuedStep(
  state: TutorialState,
  s: TutorialSnapshot
): TutorialStep | null {
  if (state.finished || s.gameState !== 'flight') return null;
  if (s.gameTime - state.since < PROMPT_GAP) return null;
  const seen = (step: TutorialStep) => state.seen.includes(step);
  if (!seen('flap')) return s.flapsThisRun >= 1 ? null : 'flap';
  if (!seen('glide') && !state.hasGlided) {
    return s.flapsThisRun >= GLIDE_PROMPT_FLAPS ? 'glide' : null;
  }
  if (!seen('food')) {
    const waited =
      state.glideShownAt !== null &&
      s.gameTime - state.glideShownAt >= FOOD_PROMPT_DELAY;
    return state.hasGlided || waited ? 'food' : null;
  }
  return null;
}

function show(
  state: TutorialState,
  step: TutorialStep,
  gameTime: number
): TutorialState {
  return {
    ...state,
    step,
    since: gameTime,
    seen: state.seen.includes(step) ? state.seen : [...state.seen, step],
    glideShownAt: step === 'glide' ? gameTime : state.glideShownAt
  };
}

/** Advances the first-run prompts from one store snapshot; returns the same object when nothing changed. */
export function advanceTutorial(
  state: TutorialState,
  s: TutorialSnapshot
): TutorialState {
  if (!s.sceneReady) return state;

  let next = state;
  if (s.isGliding && !next.hasGlided) next = { ...next, hasGlided: true };
  // A player who flapped before the first prompt appeared has already learnt it.
  if (!next.seen.includes('flap') && s.flapsThisRun >= 1) {
    next = { ...next, seen: [...next.seen, 'flap'] };
  }

  if (next.step) {
    const step = next.step;
    const timedOut = s.gameTime - next.since >= PROMPT_TIMEOUT;
    if (stepCompleted(step, s) || timedOut) {
      next = {
        ...next,
        step: null,
        since: s.gameTime,
        finished: next.finished || step === 'perch'
      };
    }
  }

  const interrupt = interruptingStep(next, s);
  if (interrupt && next.step !== interrupt) {
    const finished = next.finished || next.step === 'perch';
    return show({ ...next, finished }, interrupt, s.gameTime);
  }
  if (next.step) return next;

  const queued = queuedStep(next, s);
  return queued ? show(next, queued, s.gameTime) : next;
}

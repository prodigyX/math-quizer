import type { QuizState } from './quizReducer.ts';
export const FEEDBACK_DELAY_MS = 1500;

export function scheduleTimedAdvance(state: QuizState, advance: () => void) {
  if (
    !state.started ||
    state.mode !== 'timed' ||
    state.complete ||
    (state.selected === null && !state.timedOut)
  )
    return;

  const timeout = setTimeout(advance, FEEDBACK_DELAY_MS);
  return () => clearTimeout(timeout);
}

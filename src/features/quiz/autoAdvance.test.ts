import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleTimedAdvance, FEEDBACK_DELAY_MS } from './autoAdvance.ts';
import {
  createQuizState as createWaitingQuizState,
  quizReducer,
  type Card,
} from './quizReducer.ts';
function createQuizState(...args: Parameters<typeof createWaitingQuizState>) {
  const state = createWaitingQuizState(...args);
  return quizReducer(state, { type: 'start', now: args[2] ?? 0 });
}
const card: Card = {
  question: { a: 2, b: 3, answer: 5, operation: 'add' },
  choices: [4, 5, 6, 7],
};
const initial = () =>
  createQuizState(
    { mode: 'timed', digits: 1, timeLimit: 5, operation: 'add' },
    card,
  );
for (const outcome of ['correct', 'incorrect', 'timeout'] as const) {
  test(`automatically advances after ${outcome} feedback`, (context) => {
    context.mock.timers.enable({ apis: ['setTimeout'] });
    let state =
      outcome === 'timeout'
        ? quizReducer(initial(), { type: 'tick', now: 5000 })
        : quizReducer(initial(), {
            type: 'answer',
            answer: outcome === 'correct' ? 5 : 4,
            now: 1000,
          });
    scheduleTimedAdvance(state, () => {
      state = quizReducer(state, { type: 'next', card, now: 6500 });
    });
    context.mock.timers.tick(FEEDBACK_DELAY_MS - 1);
    assert.equal(state.count, 0);
    context.mock.timers.tick(1);
    assert.equal(state.count, 1);
    assert.equal(state.secondsLeft, 5);
    assert.equal(state.selected, null);
    assert.equal(state.timedOut, false);
    assert.equal(state.score, outcome === 'correct' ? 1 : 0);
    context.mock.timers.tick(FEEDBACK_DELAY_MS);
    assert.equal(state.count, 1);
  });
}
test('cleanup cancels pending navigation when settings change or component unmounts', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const state = quizReducer(initial(), {
    type: 'answer',
    answer: 5,
    now: 1000,
  });
  let calls = 0;
  const cancel = scheduleTimedAdvance(state, () => calls++);
  cancel?.();
  context.mock.timers.tick(FEEDBACK_DELAY_MS);
  assert.equal(calls, 0);
});
test('unanswered, completed and untimed sessions do not schedule navigation', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let calls = 0;
  for (const state of [
    initial(),
    { ...initial(), complete: true, selected: 5 },
    { ...initial(), mode: 'quiz' as const, selected: 5 },
    { ...initial(), mode: 'practice' as const },
  ]) {
    assert.equal(
      scheduleTimedAdvance(state, () => calls++),
      undefined,
    );
  }
  context.mock.timers.tick(FEEDBACK_DELAY_MS);
  assert.equal(calls, 0);
});
test('last question automatically opens the results', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let state = quizReducer(
    { ...initial(), count: 9 },
    { type: 'answer', answer: 5, now: 1000 },
  );
  scheduleTimedAdvance(state, () => {
    state = quizReducer(state, { type: 'next', card, now: 2500 });
  });
  context.mock.timers.tick(FEEDBACK_DELAY_MS);
  assert.equal(state.complete, true);
  assert.equal(state.count, 9);
});

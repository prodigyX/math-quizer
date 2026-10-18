import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createQuizState as createWaitingQuizState,
  quizReducer,
  QUIZ_LENGTH,
  type Card,
  type QuizSettings,
} from './quizReducer.ts';
function createQuizState(...args: Parameters<typeof createWaitingQuizState>) {
  const state = createWaitingQuizState(...args);
  return quizReducer(state, { type: 'start', now: args[2] ?? 0 });
}
const settings: QuizSettings = {
  digits: 2,
  timeLimit: 10,
  operation: 'add',
  mode: 'quiz',
};
const card: Card = {
  question: { a: 10, b: 5, answer: 15, operation: 'add' },
  choices: [12, 15, 18, 20],
};
const initial = () => createQuizState(settings, card);
test('unanswered quizzes cannot advance', () => {
  const state = initial();
  assert.equal(quizReducer(state, { type: 'next', now: 0, card }), state);
});
test('an answer scores once, even if several answer actions are dispatched', () => {
  const state = initial();
  const answered = quizReducer(state, { type: 'answer', now: 0, answer: 15 });
  assert.equal(answered.score, 1);
  assert.equal(answered.selected, 15);
  assert.equal(
    quizReducer(answered, { type: 'answer', now: 0, answer: 15 }),
    answered,
  );
  assert.equal(state.selected, null);
});
test('incorrect answers do not score and cannot be changed', () => {
  const answered = quizReducer(initial(), {
    type: 'answer',
    now: 0,
    answer: 12,
  });
  assert.equal(answered.score, 0);
  assert.equal(
    quizReducer(answered, { type: 'answer', now: 0, answer: 15 }),
    answered,
  );
});
test('values outside the choices are ignored', () => {
  const state = initial();
  assert.equal(
    quizReducer(state, { type: 'answer', now: 0, answer: 999 }),
    state,
  );
});
test('advancing clears the previous answer and preserves the score', () => {
  const answered = quizReducer(initial(), {
    type: 'answer',
    now: 0,
    answer: 15,
  });
  const next = quizReducer(answered, { type: 'next', now: 0, card });
  assert.equal(next.count, 1);
  assert.equal(next.selected, null);
  assert.equal(next.score, 1);
  assert.equal(next.complete, false);
});
test('quiz completes after exactly ten answered questions', () => {
  let state = initial();
  for (let i = 0; i < QUIZ_LENGTH; i++) {
    state = quizReducer(state, { type: 'answer', now: 0, answer: 15 });
    assert.equal(state.complete, false);
    state = quizReducer(state, { type: 'next', now: 0, card });
    assert.equal(state.complete, i === QUIZ_LENGTH - 1);
  }
  assert.equal(state.score, QUIZ_LENGTH);
  assert.equal(quizReducer(state, { type: 'next', now: 0, card }), state);
  assert.equal(
    quizReducer(state, { type: 'answer', now: 0, answer: 15 }),
    state,
  );
});
test('reset replaces settings and clears all progress', () => {
  const answered = quizReducer(initial(), {
    type: 'answer',
    now: 0,
    answer: 15,
  });
  const nextSettings: QuizSettings = {
    digits: 3,
    timeLimit: 10,
    operation: 'divide',
    mode: 'practice',
  };
  const nextCard: Card = {
    question: { a: 12, b: 3, answer: 4, operation: 'divide' },
    choices: [3, 4, 5, 6],
  };
  assert.deepEqual(
    quizReducer(answered, {
      type: 'reset',
      now: 0,
      settings: nextSettings,
      card: nextCard,
    }),
    createWaitingQuizState(nextSettings, nextCard),
  );
});
test('flashcards can reveal and advance without scoring', () => {
  const state = createQuizState({ ...settings, mode: 'practice' }, card);
  const revealed = quizReducer(state, { type: 'reveal' });
  assert.equal(revealed.revealed, true);
  assert.equal(
    quizReducer(revealed, { type: 'answer', now: 0, answer: 15 }),
    revealed,
  );
  const next = quizReducer(revealed, { type: 'next', now: 0, card });
  assert.equal(next.revealed, false);
  assert.equal(next.count, 1);
  assert.equal(next.score, 0);
});
test('quiz mode cannot reveal the answer', () => {
  const state = initial();
  assert.equal(quizReducer(state, { type: 'reveal' }), state);
});

test('changing digit mode starts a fresh session with the selected size', () => {
  const answered = quizReducer(initial(), {
    type: 'answer',
    now: 0,
    answer: 15,
  });
  const nextSettings: QuizSettings = { ...settings, digits: 3 };
  const nextCard: Card = {
    question: { a: 123, b: 456, answer: 579, operation: 'add' },
    choices: [579, 578, 580, 600],
  };
  const reset = quizReducer(answered, {
    type: 'reset',
    now: 0,
    settings: nextSettings,
    card: nextCard,
  });
  assert.equal(reset.digits, 3);
  assert.equal(reset.score, 0);
  assert.equal(reset.count, 0);
  assert.equal(reset.selected, null);
  assert.equal(reset.question.a, 123);
  assert.equal(
    quizReducer(reset, { type: 'next', now: 0, card: nextCard }).digits,
    3,
  );
});

test('timed quiz uses elapsed time, including delayed background ticks', () => {
  const state = createQuizState({ ...settings, mode: 'timed' }, card, 1000);
  assert.equal(state.secondsLeft, 10);
  const ticking = quizReducer(state, { type: 'tick', now: 6500 });
  assert.equal(ticking.secondsLeft, 5);
  const expired = quizReducer(ticking, { type: 'tick', now: 90000 });
  assert.equal(expired.secondsLeft, 0);
  assert.equal(expired.timedOut, true);
  assert.equal(expired.score, 0);
  assert.equal(
    quizReducer(expired, { type: 'answer', answer: 15, now: 90001 }),
    expired,
  );
  const next = quizReducer(expired, { type: 'next', card, now: 100000 });
  assert.equal(next.count, 1);
  assert.equal(next.deadline, 110000);
  assert.equal(next.secondsLeft, 10);
  assert.equal(next.timedOut, false);
});
test('answers at the deadline cannot score even before the next timer tick', () => {
  const state = createQuizState({ ...settings, mode: 'timed' }, card, 1000);
  const expired = quizReducer(state, {
    type: 'answer',
    answer: 15,
    now: 11000,
  });
  assert.equal(expired.timedOut, true);
  assert.equal(expired.score, 0);
  assert.equal(expired.selected, null);
});
test('answering before the deadline stops the timer and scores once', () => {
  const state = createQuizState({ ...settings, mode: 'timed' }, card, 1000);
  const answered = quizReducer(state, {
    type: 'answer',
    answer: 15,
    now: 10999,
  });
  assert.equal(answered.score, 1);
  assert.equal(quizReducer(answered, { type: 'tick', now: 90000 }), answered);
});
test('untimed modes ignore ticks', () => {
  for (const mode of ['practice', 'quiz'] as const) {
    const state = createQuizState({ ...settings, mode }, card);
    assert.equal(quizReducer(state, { type: 'tick', now: 90000 }), state);
  }
});
test('ten timeouts finish the timed quiz with zero score', () => {
  let state = createQuizState({ ...settings, mode: 'timed' }, card);
  for (let i = 0; i < QUIZ_LENGTH; i++) {
    const now = state.deadline;
    state = quizReducer(state, { type: 'tick', now });
    state = quizReducer(state, { type: 'next', card, now });
  }
  assert.equal(state.complete, true);
  assert.equal(state.score, 0);
});
test('reset clears the old timeout and sets a fresh deadline', () => {
  const state = createQuizState({ ...settings, mode: 'timed' }, card);
  const expired = quizReducer(state, { type: 'tick', now: 40000 });
  const reset = quizReducer(expired, {
    type: 'reset',
    settings: { ...settings, mode: 'timed' },
    card,
    now: 50000,
  });
  assert.equal(reset.timedOut, false);
  assert.equal(reset.secondsLeft, 10);
  assert.equal(reset.deadline, 60000);
});

for (const timeLimit of [5, 10, 15] as const) {
  test(`${timeLimit}-second setting controls expiry and the next question`, () => {
    const state = createQuizState(
      { ...settings, mode: 'timed', timeLimit },
      card,
      1000,
    );
    assert.equal(state.secondsLeft, timeLimit);
    assert.equal(state.deadline, 1000 + timeLimit * 1000);
    const lastSecond = quizReducer(state, {
      type: 'tick',
      now: state.deadline - 1,
    });
    assert.equal(lastSecond.secondsLeft, 1);
    assert.equal(lastSecond.timedOut, false);
    const expired = quizReducer(lastSecond, {
      type: 'tick',
      now: state.deadline,
    });
    assert.equal(expired.secondsLeft, 0);
    assert.equal(expired.timedOut, true);
    const next = quizReducer(expired, { type: 'next', card, now: 100000 });
    assert.equal(next.timeLimit, timeLimit);
    assert.equal(next.secondsLeft, timeLimit);
    assert.equal(next.deadline, 100000 + timeLimit * 1000);
  });
}
test('changing time limit clears progress and starts a new countdown', () => {
  const state = createQuizState(
    { ...settings, mode: 'timed', timeLimit: 15 },
    card,
    1000,
  );
  const answered = quizReducer(state, {
    type: 'answer',
    answer: 15,
    now: 2000,
  });
  const reset = quizReducer(answered, {
    type: 'reset',
    settings: { ...settings, mode: 'timed', timeLimit: 5 },
    card,
    now: 5000,
  });
  assert.equal(reset.timeLimit, 5);
  assert.equal(reset.secondsLeft, 5);
  assert.equal(reset.deadline, 10000);
  assert.equal(reset.score, 0);
  assert.equal(reset.count, 0);
  assert.equal(reset.selected, null);
});

test('timed quiz waits for Start before counting down or accepting answers', () => {
  const state = createWaitingQuizState(
    { ...settings, mode: 'timed' },
    card,
    1000,
  );
  assert.equal(state.started, false);
  assert.equal(quizReducer(state, { type: 'tick', now: 100000 }), state);
  assert.equal(
    quizReducer(state, { type: 'answer', answer: 15, now: 100000 }),
    state,
  );
  assert.equal(quizReducer(state, { type: 'next', card, now: 100000 }), state);
  const started = quizReducer(state, { type: 'start', now: 100000 });
  assert.equal(started.started, true);
  assert.equal(started.deadline, 110000);
  assert.equal(started.secondsLeft, 10);
  assert.equal(quizReducer(started, { type: 'start', now: 105000 }), started);
});
test('restarting a timed quiz clears points and waits for Start again', () => {
  const state = createQuizState({ ...settings, mode: 'timed' }, card);
  const answered = quizReducer(state, {
    type: 'answer',
    answer: 15,
    now: 1000,
  });
  assert.equal(answered.score, 1);
  const reset = quizReducer(answered, {
    type: 'reset',
    settings: { ...settings, mode: 'timed' },
    card,
    now: 2000,
  });
  assert.equal(reset.started, false);
  assert.equal(reset.score, 0);
});

for (const mode of ['practice', 'quiz', 'timed'] as const) {
  test(`${mode} waits for Start and returns to ready on reset`, () => {
    const state = createWaitingQuizState({ ...settings, mode }, card);
    assert.equal(state.started, false);
    assert.equal(quizReducer(state, { type: 'reveal' }), state);
    assert.equal(
      quizReducer(state, { type: 'answer', answer: 15, now: 1000 }),
      state,
    );
    assert.equal(quizReducer(state, { type: 'next', card, now: 1000 }), state);
    const started = quizReducer(state, { type: 'start', now: 5000 });
    assert.equal(started.started, true);
    assert.equal(started.deadline, 15000);
    assert.equal(quizReducer(started, { type: 'start', now: 6000 }), started);
    const reset = quizReducer(started, {
      type: 'reset',
      settings: { ...settings, mode },
      card,
      now: 10000,
    });
    assert.equal(reset.started, false);
  });
}

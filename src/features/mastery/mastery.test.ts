import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  masteryQuestion,
  initialMasteryState,
  masteryReducer,
  TABLES,
} from './mastery.ts';
for (const table of TABLES) {
  test(`${table} times table runs from 1 through 12 in order`, () => {
    let state = masteryReducer(initialMasteryState, { type: 'select', table });
    state = masteryReducer(state, { type: 'start' });
    for (let step = 1; step <= 12; step++) {
      assert.equal(state.table, table);
      assert.equal(state.step, step);
      assert.equal(state.revealed, false);
      assert.equal(state.complete, false);
      assert.equal(masteryReducer(state, { type: 'next' }), state);
      state = masteryReducer(state, { type: 'reveal' });
      state = masteryReducer(state, { type: 'next' });
    }
    assert.equal(state.complete, true);
    assert.equal(state.step, 12);
    assert.equal(masteryReducer(state, { type: 'next' }), state);
  });
}
test('switching tables clears progress and starts at ×1', () => {
  const state = {
    ...initialMasteryState,
    table: 2 as const,
    step: 8,
    revealed: true,
  };
  assert.deepEqual(masteryReducer(state, { type: 'select', table: 3 }), {
    ...initialMasteryState,
    table: 3,
  });
});
test('restarting keeps the selected table', () => {
  const state = {
    ...initialMasteryState,
    table: 12 as const,
    step: 12,
    revealed: true,
    complete: true,
  };
  assert.deepEqual(masteryReducer(state, { type: 'restart' }), {
    ...initialMasteryState,
    table: 12,
  });
});

test('all operations produce ordered, valid facts for every selected number', () => {
  for (const table of TABLES) {
    for (let step = 1; step <= 12; step++) {
      assert.deepEqual(masteryQuestion('add', table, step), {
        a: table,
        b: step,
        answer: table + step,
        operation: 'add',
      });
      assert.deepEqual(masteryQuestion('subtract', table, step), {
        a: table + step,
        b: table,
        answer: step,
        operation: 'subtract',
      });
      assert.deepEqual(masteryQuestion('multiply', table, step), {
        a: table,
        b: step,
        answer: table * step,
        operation: 'multiply',
      });
      assert.deepEqual(masteryQuestion('divide', table, step), {
        a: table * step,
        b: table,
        answer: step,
        operation: 'divide',
      });
    }
  }
});
test('changing operations resets progress and retains the chosen number', () => {
  const state = {
    ...initialMasteryState,
    table: 5 as const,
    step: 9,
    revealed: true,
  };
  assert.deepEqual(
    masteryReducer(state, { type: 'operation', operation: 'divide' }),
    { ...initialMasteryState, operation: 'divide', table: 5 },
  );
});
test('switching numbers and restarting preserve the selected operation', () => {
  const state = {
    ...initialMasteryState,
    operation: 'subtract' as const,
    table: 5 as const,
    step: 12,
    revealed: true,
    complete: true,
  };
  assert.deepEqual(masteryReducer(state, { type: 'select', table: 6 }), {
    ...initialMasteryState,
    operation: 'subtract',
    table: 6,
  });
  assert.deepEqual(masteryReducer(state, { type: 'restart' }), {
    ...initialMasteryState,
    operation: 'subtract',
    table: 5,
  });
});

test('mastery waits for Start, then returns to ready when restarted or changed', () => {
  assert.equal(
    masteryReducer(initialMasteryState, { type: 'reveal' }),
    initialMasteryState,
  );
  assert.equal(
    masteryReducer(initialMasteryState, { type: 'next' }),
    initialMasteryState,
  );
  const started = masteryReducer(initialMasteryState, { type: 'start' });
  assert.equal(started.started, true);
  assert.equal(masteryReducer(started, { type: 'start' }), started);
  assert.equal(masteryReducer(started, { type: 'reveal' }).revealed, true);
  assert.equal(masteryReducer(started, { type: 'restart' }).started, false);
  assert.equal(
    masteryReducer(started, { type: 'select', table: 2 }).started,
    false,
  );
  assert.equal(
    masteryReducer(started, { type: 'operation', operation: 'add' }).started,
    false,
  );
});

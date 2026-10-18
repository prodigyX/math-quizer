import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeQuestion,
  makeChoices,
  type Operation,
  type DigitMode,
} from './maths.ts';
for (const digits of [1, 2, 3] as DigitMode[]) {
  for (const operation of [
    'add',
    'subtract',
    'multiply',
    'divide',
  ] as Operation[]) {
    test(`${digits}-digit ${operation} respects number sizes and arithmetic`, () => {
      const min = 10 ** (digits - 1),
        max = 10 ** digits - 1;
      for (let i = 0; i < 1000; i++) {
        const q = makeQuestion(operation, digits);
        assert.ok(q.a >= min && q.a <= max);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0);
        switch (operation) {
          case 'add':
            assert.equal(q.answer, q.a + q.b);
            assert.ok(q.b >= min && q.b <= max);
            break;
          case 'subtract':
            assert.equal(q.answer, q.a - q.b);
            assert.ok(q.b >= min && q.b <= max);
            break;
          case 'multiply':
            assert.equal(q.answer, q.a * q.b);
            assert.ok(q.b >= 1 && q.b <= (digits === 1 ? 9 : 12));
            break;
          case 'divide':
            assert.equal(q.answer, q.a / q.b);
            assert.ok(q.b >= 2 && q.b <= Math.min(max, 12));
            break;
        }
        const choices = makeChoices(q.answer);
        assert.equal(new Set(choices).size, 4);
        assert.ok(choices.includes(q.answer));
        assert.ok(choices.every((n) => Number.isInteger(n) && n >= 0));
      }
    });
  }
}

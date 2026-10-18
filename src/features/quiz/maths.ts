export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';
export type DigitMode = 1 | 2 | 3;
export const digitModes = [
  { value: 1, label: 'Single', range: '1–9' },
  { value: 2, label: 'Double', range: '10–99' },
  { value: 3, label: 'Triple', range: '100–999' },
] as const;
export function digitModeHint(operation: Operation): string {
  if (operation === 'multiply')
    return 'Choose the size of the first number. Multiply by a times-table number.';
  if (operation === 'divide')
    return 'Choose the size of the number being divided. Answers are always whole numbers.';
  return 'Choose the size of both numbers. Answers may have a different number of digits.';
}
export type Question = {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
};
export const operations = {
  add: { label: 'Addition', symbol: '+', verb: 'add' },
  subtract: { label: 'Subtraction', symbol: '−', verb: 'subtract' },
  multiply: { label: 'Multiplication', symbol: '×', verb: 'multiply' },
  divide: { label: 'Division', symbol: '÷', verb: 'divide' },
};
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export function makeQuestion(
  operation: Operation,
  digits: DigitMode,
  previous?: Question,
): Question {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const tableMax = digits === 1 ? 9 : 12;
  for (let attempt = 0; ; attempt++) {
    let a: number, b: number, answer: number;
    if (operation === 'divide') {
      b = random(2, Math.min(tableMax, max));
      answer = random(Math.ceil(min / b), Math.floor(max / b));
      a = answer * b;
    } else if (operation === 'multiply') {
      a = random(min, max);
      b = random(1, tableMax);
      answer = a * b;
    } else {
      a = random(min, max);
      b = random(min, max);
      if (operation === 'subtract' && b > a) [a, b] = [b, a];
      answer = operation === 'add' ? a + b : a - b;
    }
    if (
      attempt > 10 ||
      !previous ||
      a !== previous.a ||
      b !== previous.b ||
      operation !== previous.operation
    )
      return { a, b, answer, operation };
  }
}
export function makeChoices(answer: number): number[] {
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const n =
      answer +
      random(
        -Math.max(5, Math.ceil(answer * 0.15)),
        Math.max(5, Math.ceil(answer * 0.15)),
      );
    if (n >= 0) choices.add(n);
  }
  const shuffled = [...choices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

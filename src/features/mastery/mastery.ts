import type { Operation, Question } from '../quiz/maths.ts';
export const TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type Table = (typeof TABLES)[number];
export const TABLE_LENGTH = 12;
export type MasteryState = {
  started: boolean;
  operation: Operation;
  table: Table;
  step: number;
  revealed: boolean;
  complete: boolean;
};
export type MasteryAction =
  | { type: 'select'; table: Table }
  | { type: 'operation'; operation: Operation }
  | { type: 'start' }
  | { type: 'reveal' }
  | { type: 'next' }
  | { type: 'restart' };
export const initialMasteryState: MasteryState = {
  started: false,
  operation: 'multiply',
  table: 1,
  step: 1,
  revealed: false,
  complete: false,
};
export function masteryReducer(
  state: MasteryState,
  action: MasteryAction,
): MasteryState {
  switch (action.type) {
    case 'operation':
      return {
        ...initialMasteryState,
        operation: action.operation,
        table: state.table,
      };
    case 'select':
      return {
        ...initialMasteryState,
        operation: state.operation,
        table: action.table,
      };
    case 'restart':
      return {
        ...initialMasteryState,
        operation: state.operation,
        table: state.table,
      };
    case 'start':
      return state.started || state.complete
        ? state
        : { ...state, started: true };
    case 'reveal':
      return !state.started || state.complete
        ? state
        : { ...state, revealed: true };
    case 'next':
      if (!state.started || !state.revealed || state.complete) return state;
      if (state.step === TABLE_LENGTH) return { ...state, complete: true };
      return { ...state, step: state.step + 1, revealed: false };
  }
}

export function masteryQuestion(
  operation: Operation,
  table: Table,
  step: number,
): Question {
  switch (operation) {
    case 'add':
      return { a: table, b: step, answer: table + step, operation };
    case 'subtract':
      return { a: table + step, b: table, answer: step, operation };
    case 'multiply':
      return { a: table, b: step, answer: table * step, operation };
    case 'divide':
      return { a: table * step, b: table, answer: step, operation };
  }
}

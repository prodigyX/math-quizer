import type { DigitMode, Operation, Question } from './maths.ts';
export const QUIZ_LENGTH = 10;
export const TIMER_OPTIONS = [5, 10, 15] as const;
export type TimeLimit = (typeof TIMER_OPTIONS)[number];
export type QuizSettings = {
  digits: DigitMode;
  timeLimit: TimeLimit;
  operation: Operation;
  mode: 'practice' | 'quiz' | 'timed';
};
export type Card = { question: Question; choices: number[] };
export type QuizState = QuizSettings &
  Card & {
    started: boolean;
    timedOut: boolean;
    deadline: number;
    secondsLeft: number;
    revealed: boolean;
    count: number;
    score: number;
    selected: number | null;
    complete: boolean;
  };
export type QuizAction =
  | { type: 'reset'; settings: QuizSettings; card: Card; now: number }
  | { type: 'start'; now: number }
  | { type: 'reveal' }
  | { type: 'answer'; answer: number; now: number }
  | { type: 'next'; card: Card; now: number }
  | { type: 'tick'; now: number };
export function createQuizState(
  settings: QuizSettings,
  card: Card,
  now = 0,
): QuizState {
  return {
    ...settings,
    ...card,
    started: false,
    timedOut: false,
    deadline: now + settings.timeLimit * 1000,
    secondsLeft: settings.timeLimit,
    revealed: false,
    count: 0,
    score: 0,
    selected: null,
    complete: false,
  };
}
// Random values are supplied by the caller so reducer transitions stay pure.
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'reset':
      return createQuizState(action.settings, action.card, action.now);
    case 'start':
      if (state.started || state.complete) return state;
      return {
        ...state,
        started: true,
        deadline: action.now + state.timeLimit * 1000,
      };
    case 'tick': {
      if (
        !state.started ||
        state.mode !== 'timed' ||
        state.complete ||
        state.selected !== null ||
        state.timedOut
      )
        return state;
      const secondsLeft = Math.max(
        0,
        Math.ceil((state.deadline - action.now) / 1000),
      );
      if (secondsLeft === state.secondsLeft) return state;
      return { ...state, secondsLeft, timedOut: secondsLeft === 0 };
    }
    case 'reveal':
      return state.started && state.mode === 'practice' && !state.complete
        ? { ...state, revealed: true }
        : state;
    case 'answer':
      if (
        !state.started ||
        state.mode === 'practice' ||
        state.complete ||
        state.selected !== null ||
        state.timedOut ||
        !state.choices.includes(action.answer)
      )
        return state;
      if (state.mode === 'timed' && action.now >= state.deadline)
        return { ...state, timedOut: true, secondsLeft: 0 };
      return {
        ...state,
        selected: action.answer,
        score: state.score + Number(action.answer === state.question.answer),
      };
    case 'next':
      if (
        !state.started ||
        state.complete ||
        (state.mode !== 'practice' &&
          state.selected === null &&
          !state.timedOut)
      )
        return state;
      if (state.mode !== 'practice' && state.count === QUIZ_LENGTH - 1)
        return { ...state, complete: true };
      return {
        ...state,
        ...action.card,
        timedOut: false,
        deadline: action.now + state.timeLimit * 1000,
        secondsLeft: state.timeLimit,
        count: state.count + 1,
        revealed: false,
        selected: null,
      };
  }
}

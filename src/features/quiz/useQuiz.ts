import { useEffect, useReducer } from 'react';
import { makeChoices, makeQuestion } from './maths';
import { scheduleTimedAdvance } from './autoAdvance';
import {
  createQuizState,
  quizReducer,
  type QuizSettings,
  type Card,
} from './quizReducer';
const DEFAULT_SETTINGS: QuizSettings = {
  digits: 1,
  timeLimit: 10,
  operation: 'add',
  mode: 'practice',
};
function createCard(settings: QuizSettings, previous?: Card['question']): Card {
  const question = makeQuestion(settings.operation, settings.digits, previous);
  return { question, choices: makeChoices(question.answer) };
}
export function useQuiz() {
  const [state, dispatch] = useReducer(
    quizReducer,
    DEFAULT_SETTINGS,
    (settings) => createQuizState(settings, createCard(settings), Date.now()),
  );
  useEffect(() => {
    if (
      !state.started ||
      state.mode !== 'timed' ||
      state.complete ||
      state.selected !== null ||
      state.timedOut
    )
      return;
    const tick = () => dispatch({ type: 'tick', now: Date.now() });
    const interval = window.setInterval(tick, 250);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [
    state.started,
    state.mode,
    state.complete,
    state.selected,
    state.timedOut,
    state.deadline,
  ]);
  useEffect(
    () =>
      scheduleTimedAdvance(state, () => {
        dispatch({
          type: 'next',
          card: createCard(state, state.question),
          now: Date.now(),
        });
      }),
    [state],
  );
  function reset(changes: Partial<QuizSettings> = {}) {
    const settings = {
      digits: state.digits,
      timeLimit: state.timeLimit,
      operation: state.operation,
      mode: state.mode,
      ...changes,
    };
    dispatch({
      type: 'reset',
      settings,
      card: createCard(settings),
      now: Date.now(),
    });
  }
  return {
    state,
    reset,
    start: () => dispatch({ type: 'start', now: Date.now() }),
    reveal: () => dispatch({ type: 'reveal' }),
    choose: (answer: number) =>
      dispatch({ type: 'answer', answer, now: Date.now() }),
    next: () =>
      dispatch({
        type: 'next',
        card: createCard(state, state.question),
        now: Date.now(),
      }),
  };
}

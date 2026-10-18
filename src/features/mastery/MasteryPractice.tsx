import { EndSessionButton } from '../../components/EndSessionButton';
import { useReducer } from 'react';
import { operations } from '../quiz/maths';
import { MasterySettings } from './MasterySettings';
import { ArrowRight, Check, Eye, RotateCcw, Trophy, Play } from 'lucide-react';
import {
  ActivityToolbar,
  type ActivityMode,
} from '../quiz/components/ActivityToolbar';
import {
  masteryQuestion,
  type MasteryAction,
  initialMasteryState,
  masteryReducer,
  TABLES,
  TABLE_LENGTH,
} from './mastery';
type Props = {
  focus: boolean;
  onFocusChange: (focus: boolean) => void;
  onToggleFocus: () => void;
  onModeChange: (mode: ActivityMode) => void;
};
export function MasteryPractice({
  focus,
  onToggleFocus,
  onModeChange,
  onFocusChange,
}: Props) {
  const [state, send] = useReducer(masteryReducer, initialMasteryState);
  function dispatch(action: MasteryAction) {
    send(action);
    if (action.type === 'start') onFocusChange(true);
    else if (
      action.type === 'restart' ||
      action.type === 'select' ||
      action.type === 'operation'
    )
      onFocusChange(false);
  }
  const { started, operation, table, step, revealed, complete } = state;
  const nextTable = TABLES[TABLES.indexOf(table) + 1];
  const progress = complete ? TABLE_LENGTH : step - 1 + Number(revealed);
  const question = masteryQuestion(operation, table, step);
  const { symbol, label } = operations[operation];
  return (
    <>
      {!focus && (
        <MasterySettings
          operation={operation}
          table={table}
          onOperationChange={(operation) =>
            dispatch({ type: 'operation', operation })
          }
          onTableChange={(table) => dispatch({ type: 'select', table })}
        />
      )}
      <section className="activity" aria-label={`${label} mastery`}>
        <ActivityToolbar
          mode="mastery"
          focus={focus}
          onModeChange={onModeChange}
          onToggleFocus={onToggleFocus}
        />
        <p className="mastery-description">
          One number at a time. In order, at your own pace.
        </p>
        <div className={`flashcard ${operation}`}>
          {!started ? (
            <div className="quiz-start">
              <h2>
                Ready to master {operations[operation].label.toLowerCase()}?
              </h2>
              <p>
                {TABLE_LENGTH} facts with {table}, in order. No timer.
              </p>
              <button
                className="primary"
                onClick={() => dispatch({ type: 'start' })}
              >
                <Play size={20} />
                Start mastery
              </button>
              <small>Start opens focus mode.</small>
            </div>
          ) : complete ? (
            <div className="results">
              <Trophy className="trophy" size={44} />
              <h2>
                {label} with {table} complete!
              </h2>
              <p>You practised all {TABLE_LENGTH} facts. Great work!</p>
              {nextTable && (
                <button
                  className="primary"
                  onClick={() => dispatch({ type: 'select', table: nextTable })}
                >
                  Practise with {nextTable} <ArrowRight size={18} />
                </button>
              )}
              <button
                className="reveal-button"
                onClick={() => dispatch({ type: 'restart' })}
              >
                <RotateCcw size={18} />
                Practise this number again
              </button>
            </div>
          ) : (
            <>
              <div className="card-top">
                <span className="subject-tag">
                  {label} with {table}
                </span>
                <span>
                  {step} OF {TABLE_LENGTH}
                </span>
              </div>
              <div className="question-area">
                <p>
                  What is {question.a} {symbol} {question.b}?
                </p>
                <div
                  className="equation"
                  aria-label={`${question.a} ${symbol} ${question.b} equals ${revealed ? question.answer : 'what?'}`}
                >
                  <span>{question.a}</span>
                  <span className="math-symbol">{symbol}</span>
                  <span>{question.b}</span>
                  <span className="math-symbol">=</span>
                  <span className={`answer ${revealed ? 'shown' : ''}`}>
                    {revealed ? question.answer : '?'}
                  </span>
                </div>
                <div className="reveal-space" aria-live="polite">
                  {revealed ? (
                    <div className="revealed">
                      <Check size={19} />
                      {question.a} {symbol} {question.b} = {question.answer}
                    </div>
                  ) : (
                    <button
                      className="reveal-button"
                      onClick={() => dispatch({ type: 'reveal' })}
                    >
                      <Eye size={19} />
                      Reveal answer
                    </button>
                  )}
                </div>
              </div>
              <div className="card-bottom">
                {revealed
                  ? 'Say it once more to help it stick.'
                  : 'Think it through, then check your answer.'}
              </div>
            </>
          )}
        </div>
        {(started || focus) && (
          <div className="below-card session-actions">
            <EndSessionButton onEnd={() => dispatch({ type: 'restart' })} />
            {started && !complete && (
              <button
                className="primary"
                disabled={!revealed}
                onClick={() => dispatch({ type: 'next' })}
              >
                {step === TABLE_LENGTH ? 'Finish practice' : 'Next fact'}
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
        {started && (
          <progress
            aria-label="Mastery progress"
            value={progress}
            max={TABLE_LENGTH}
          />
        )}
      </section>
    </>
  );
}

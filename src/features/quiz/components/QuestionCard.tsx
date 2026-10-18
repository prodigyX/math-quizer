import { Check, Eye, X } from 'lucide-react';
import { operations } from '../maths';
import { QUIZ_LENGTH, type QuizState } from '../quizReducer';
type Props = {
  state: QuizState;
  onChoose: (answer: number) => void;
  onReveal: () => void;
};
export function QuestionCard({ state, onChoose, onReveal }: Props) {
  const {
    digits,
    operation,
    mode,
    question,
    revealed,
    count,
    selected,
    choices,
    timedOut,
  } = state;
  const op = operations[operation];
  let feedback = revealed
    ? 'Ready for another little discovery?'
    : 'Say your answer out loud, then take a peek.';
  if (mode !== 'practice') {
    if (timedOut)
      feedback = `Time’s up — no answer. The correct answer is ${question.answer}. Keep learning — you’ve got this!`;
    else if (selected === null)
      feedback = 'Choose the answer you think is right.';
    else if (selected === question.answer)
      feedback = '✨ You’ve got it! Brilliant thinking.';
    else
      feedback = `Good try! The answer is ${question.answer}. Let’s keep learning.`;
  }

  return (
    <>
      <div className="card-top">
        <span className="subject-tag">
          {op.symbol} {op.label}
        </span>
        <span>
          {digits}-DIGIT <span className="separator">/</span>{' '}
          {mode !== 'practice'
            ? `${count + 1} OF ${QUIZ_LENGTH}`
            : `CARD ${count + 1}`}
        </span>
      </div>
      <div className="question-area">
        <p>
          {mode === 'practice'
            ? 'Take your time. You’ve got this!'
            : 'Put your maths superpower to work!'}
        </p>
        <div
          className="equation"
          aria-label={`${question.a} ${op.label} ${question.b}${timedOut ? ', no answer before time ran out' : ' equals what?'}`}
        >
          <span>{question.a}</span>
          <span className="math-symbol">{op.symbol}</span>
          <span>{question.b}</span>
          <span className="math-symbol">=</span>
          <span
            className={`answer ${revealed ? 'shown' : ''} ${timedOut ? 'unanswered' : ''}`}
          >
            {timedOut ? (
              <X className="unanswered-icon" aria-hidden="true" />
            ) : revealed ? (
              question.answer
            ) : (
              '?'
            )}
          </span>
        </div>
        {mode === 'practice' ? (
          <div className="reveal-space" aria-live="polite">
            {revealed ? (
              <div className="revealed">
                <Check size={19} /> {question.a} {op.symbol} {question.b} ={' '}
                {question.answer}. Keep it up!
              </div>
            ) : (
              <button className="reveal-button" onClick={onReveal}>
                <Eye size={19} />
                Reveal answer
              </button>
            )}
          </div>
        ) : (
          <div className="choices">
            {choices.map((choice) => {
              const answered = selected !== null || timedOut;
              const isCorrect = choice === question.answer;
              let className = '';
              if (answered && isCorrect) className = 'correct';
              else if (answered && choice === selected) className = 'incorrect';
              return (
                <button
                  key={choice}
                  disabled={answered}
                  className={className}
                  onClick={() => onChoose(choice)}
                >
                  {choice}
                  {answered && isCorrect && (
                    <Check size={18} aria-label="Correct answer" />
                  )}
                  {answered && !isCorrect && choice === selected && (
                    <X size={18} aria-label="Incorrect answer" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="card-bottom" aria-live="polite">
        {mode === 'practice' && <span className="little-star">✦</span>}
        {timedOut && (
          <X className="timeout-icon" size={16} aria-hidden="true" />
        )}
        {feedback}
      </div>
    </>
  );
}

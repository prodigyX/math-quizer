import { Trophy, RotateCcw } from 'lucide-react';
import { QUIZ_LENGTH } from '../quizReducer';
export function QuizResults({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  return (
    <div className="results">
      <span className="trophy">
        <Trophy size={44} />
      </span>
      <div className="eyebrow">LOOK AT YOU GROW!</div>
      <h2>{score >= 8 ? 'Fantastic thinking!' : 'Great practice!'}</h2>
      <p>
        You got{' '}
        <strong>
          {score} out of {QUIZ_LENGTH}
        </strong>{' '}
        answers right.
      </p>
      <p>Every question helps your maths brain grow.</p>
      <button className="primary" onClick={() => onRestart()}>
        Try another round <RotateCcw size={18} />
      </button>
    </div>
  );
}

import { Timer } from 'lucide-react';
import type { TimeLimit } from '../quizReducer';
type Props = {
  secondsLeft: number;
  stopped: boolean;
  timeLimit: TimeLimit;
  isLastQuestion: boolean;
};
export function QuizTimer({
  secondsLeft,
  stopped,
  timeLimit,
  isLastQuestion,
}: Props) {
  return (
    <div className={`quiz-timer ${secondsLeft <= 5 ? 'urgent' : ''}`}>
      <div>
        <Timer size={18} />
        <strong role="timer" aria-label={`${secondsLeft} seconds remaining`}>
          {secondsLeft}s
        </strong>
        <span>
          {stopped
            ? isLastQuestion
              ? 'Your results are coming up…'
              : 'Next question coming up…'
            : `${timeLimit} seconds per question`}
        </span>
      </div>
      <progress
        max={timeLimit}
        value={secondsLeft}
        aria-label="Time remaining"
      />
    </div>
  );
}

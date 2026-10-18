import { Star } from 'lucide-react';
import { QUIZ_LENGTH } from '../quizReducer';
export function PointsCounter({ score }: { score: number }) {
  return (
    <div
      className="points-counter"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Star size={21} aria-hidden="true" />
      <strong>
        {score} / {QUIZ_LENGTH}
      </strong>
      <span>points</span>
    </div>
  );
}

import { Play } from 'lucide-react';
import { QUIZ_LENGTH, type QuizSettings } from '../quizReducer';
type Props = {
  timeLimit: QuizSettings['timeLimit'];
  mode: QuizSettings['mode'];
  onStart: () => void;
};
export function QuizStart({ timeLimit, mode, onStart }: Props) {
  const practice = mode === 'practice';
  return (
    <div className="quiz-start">
      <h2>
        {practice ? 'Ready to practise?' : 'Ready for a little challenge?'}
      </h2>
      <p>
        {practice
          ? 'Think, reveal, and learn at your own pace.'
          : `${QUIZ_LENGTH} questions${mode === 'timed' ? ` · ${timeLimit} seconds each` : ' · No timer'}`}
      </p>
      <p>
        {practice
          ? 'Say each answer aloud, then turn over the card.'
          : `Earn 1 point for each correct answer.${mode === 'timed' ? ' Questions move on automatically.' : ''}`}
      </p>
      <button className="primary" onClick={onStart}>
        <Play size={20} />
        {practice ? 'Start flashcards' : 'Start quiz'}
      </button>
      <small>
        {mode === 'timed'
          ? 'Start opens focus mode and starts your timer.'
          : 'Start opens focus mode.'}
      </small>
    </div>
  );
}

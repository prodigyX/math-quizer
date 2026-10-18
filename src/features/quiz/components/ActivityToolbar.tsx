import { BookOpen, Sparkles, Minimize, Maximize, Timer } from 'lucide-react';
import type { QuizSettings } from '../quizReducer';
export type ActivityMode = QuizSettings['mode'] | 'mastery';
type Props = {
  mode: ActivityMode;
  focus: boolean;
  onModeChange: (mode: ActivityMode) => void;
  onToggleFocus: () => void;
};
export function ActivityToolbar({
  mode,
  focus,
  onModeChange,
  onToggleFocus,
}: Props) {
  return (
    <div className="activity-toolbar">
      <div className="mode-tabs" aria-label="Practice mode">
        <button
          className={mode === 'practice' ? 'active' : ''}
          aria-pressed={mode === 'practice'}
          onClick={() => onModeChange('practice')}
        >
          <BookOpen size={16} />
          Flashcards
        </button>
        <button
          className={mode === 'quiz' ? 'active' : ''}
          aria-pressed={mode === 'quiz'}
          onClick={() => onModeChange('quiz')}
        >
          <Sparkles size={16} />
          Quick quiz
        </button>
        <button
          className={mode === 'timed' ? 'active' : ''}
          aria-pressed={mode === 'timed'}
          onClick={() => onModeChange('timed')}
        >
          <Timer size={16} />
          Timed quiz
        </button>
        <button
          className={mode === 'mastery' ? 'active' : ''}
          aria-pressed={mode === 'mastery'}
          onClick={() => onModeChange('mastery')}
        >
          <BookOpen size={16} />
          Mastery
        </button>
      </div>
      <div className="activity-controls">
        <button
          className="focus-button"
          onClick={() => onToggleFocus()}
          aria-label={focus ? 'Exit focus mode' : 'Enter focus mode'}
        >
          {focus ? <Minimize size={19} /> : <Maximize size={19} />}
          <span>{focus ? 'Exit focus' : 'Focus mode'}</span>
        </button>
      </div>
    </div>
  );
}

import { EndSessionButton } from '../../../components/EndSessionButton';
import { useQuizSound } from '../useQuizSound';
import { QuizTimer } from './QuizTimer';
import { TimerSettings } from './TimerSettings';
import { QuizStart } from './QuizStart';
import { PointsCounter } from './PointsCounter';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { QUIZ_LENGTH } from '../quizReducer';
import { ActivityToolbar } from './ActivityToolbar';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import type { useQuiz } from '../useQuiz';
type Props = {
  session: ReturnType<typeof useQuiz>;
  focus: boolean;
  onMastery: () => void;
  onToggleFocus: () => void;
};
export function QuizActivity({
  session,
  focus,
  onToggleFocus,
  onMastery,
}: Props) {
  const {
    state: {
      started,
      operation,
      mode,
      count,
      score,
      selected,
      complete,
      timedOut,
      secondsLeft,
      timeLimit,
    },
    reset,
    start,
    next,
    choose,
    reveal,
  } = session;

  const { enabled, unlock, toggle } = useQuizSound(session.state);

  return (
    <section
      className="activity"
      aria-label="Maths flashcard"
      onClickCapture={unlock}
    >
      <ActivityToolbar
        mode={mode}
        focus={focus}
        onModeChange={(mode) =>
          mode === 'mastery' ? onMastery() : reset({ mode })
        }
        onToggleFocus={onToggleFocus}
      />
      <div className="quiz-options">
        <span>
          {mode === 'timed'
            ? `${QUIZ_LENGTH} questions. Try your best before time runs out!`
            : 'Take your time — there’s no countdown.'}
        </span>
        <button
          className="sound-toggle"
          aria-pressed={enabled}
          onClick={toggle}
          aria-label={enabled ? 'Mute sound' : 'Enable sound'}
        >
          {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />} Sound{' '}
          {enabled ? 'on' : 'off'}
        </button>
      </div>
      {mode === 'timed' && (
        <TimerSettings
          value={timeLimit}
          onChange={(timeLimit) => reset({ timeLimit })}
        />
      )}
      {mode !== 'practice' && <PointsCounter score={score} />}
      {mode === 'timed' && started && !complete && (
        <QuizTimer
          secondsLeft={secondsLeft}
          timeLimit={timeLimit}
          stopped={selected !== null || timedOut}
          isLastQuestion={count === QUIZ_LENGTH - 1}
        />
      )}
      <div className={`flashcard ${operation}`}>
        {!started ? (
          <QuizStart mode={mode} timeLimit={timeLimit} onStart={start} />
        ) : complete ? (
          <QuizResults score={score} onRestart={() => reset()} />
        ) : (
          <QuestionCard
            state={session.state}
            onChoose={choose}
            onReveal={reveal}
          />
        )}
      </div>
      {(started || focus) && (
        <div className="below-card session-actions">
          <EndSessionButton onEnd={() => reset()} />
          {started && !complete && (
            <>
              <span className="progress-label">
                {mode === 'practice'
                  ? `${count} cards practised`
                  : `${score} correct so far`}
              </span>
              {mode !== 'timed' && (
                <button
                  className="primary"
                  onClick={next}
                  disabled={
                    mode !== 'practice' && selected === null && !timedOut
                  }
                >
                  {mode !== 'practice' && count === QUIZ_LENGTH - 1
                    ? 'See results'
                    : 'Next card'}
                  <ArrowRight size={18} />
                </button>
              )}
            </>
          )}
        </div>
      )}
      {mode !== 'practice' && started && !complete && (
        <progress
          aria-label="Quiz progress"
          value={count + (selected !== null || timedOut ? 1 : 0)}
          max={QUIZ_LENGTH}
        />
      )}
    </section>
  );
}

import { TIMER_OPTIONS, type TimeLimit } from '../quizReducer';
type Props = { value: TimeLimit; onChange: (seconds: TimeLimit) => void };
export function TimerSettings({ value, onChange }: Props) {
  return (
    <fieldset className="timer-settings">
      <legend>Time per question</legend>
      <div className="timer-presets">
        {TIMER_OPTIONS.map((seconds) => (
          <button
            key={seconds}
            aria-pressed={value === seconds}
            className={value === seconds ? 'active' : ''}
            onClick={() => {
              if (value !== seconds) onChange(seconds);
            }}
          >
            {seconds} seconds
          </button>
        ))}
      </div>
      <p>Changing the time starts a new quiz.</p>
    </fieldset>
  );
}

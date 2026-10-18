import { BookOpen, Check, ChevronRight, Lightbulb } from 'lucide-react';
import {
  operations,
  digitModes,
  digitModeHint,
  type DigitMode,
  type Operation,
} from '../maths';
type Props = {
  digits: DigitMode;
  onDigitsChange: (digits: DigitMode) => void;
  operation: Operation;
  onOperationChange: (operation: Operation) => void;
};
export function PracticeSettings({
  digits,
  onDigitsChange,
  operation,
  onOperationChange,
}: Props) {
  return (
    <aside className="settings">
      <div className="settings-heading">
        <span className="tiny-icon">
          <BookOpen size={17} />
        </span>
        <h2>Your practice space</h2>
      </div>
      <fieldset>
        <legend>
          1 <span>Pick a superpower</span>
        </legend>
        <div className="operation-list">
          {(Object.keys(operations) as Operation[]).map((key) => (
            <button
              key={key}
              className={`operation ${key} ${operation === key ? 'active' : ''}`}
              onClick={() => onOperationChange(key)}
              aria-pressed={operation === key}
            >
              <span className="operator">{operations[key].symbol}</span>
              <span>{operations[key].label}</span>
              {operation === key ? (
                <span className="selected-dot">
                  <Check size={12} />
                </span>
              ) : (
                <ChevronRight size={15} />
              )}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="digit-settings">
        <legend>
          2 <span>How many digits?</span>
        </legend>
        <div className="digit-tabs">
          {digitModes.map(({ value, label, range }) => (
            <button
              key={value}
              className={digits === value ? 'active' : ''}
              aria-pressed={digits === value}
              aria-label={`${label} digit: ${range}`}
              aria-describedby="digit-hint"
              onClick={() => onDigitsChange(value)}
            >
              <strong>{label}</strong>
              <span>{range}</span>
            </button>
          ))}
        </div>
        <p id="digit-hint" className="digit-hint">
          {digitModeHint(operation)}
        </p>
      </fieldset>
      <div className="tip">
        <Lightbulb size={21} />
        <div>
          <strong>Small steps, big brains.</strong>
          <p>A few minutes of practice every day can make a big difference!</p>
        </div>
      </div>
    </aside>
  );
}

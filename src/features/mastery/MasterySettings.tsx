import { BookOpen } from 'lucide-react';
import { operations, type Operation } from '../quiz/maths';
import { masteryQuestion, TABLES, TABLE_LENGTH, type Table } from './mastery';
type Props = {
  operation: Operation;
  table: Table;
  onOperationChange: (operation: Operation) => void;
  onTableChange: (table: Table) => void;
};
export function MasterySettings({
  operation,
  table,
  onOperationChange,
  onTableChange,
}: Props) {
  const first = masteryQuestion(operation, table, 1);
  const last = masteryQuestion(operation, table, TABLE_LENGTH);
  const { symbol } = operations[operation];
  return (
    <aside className="settings mastery-settings">
      <div className="settings-heading">
        <BookOpen size={18} />
        <h2>Master your maths facts</h2>
      </div>
      <fieldset>
        <legend>Choose an operation</legend>
        <div className="operation-list">
          {(Object.keys(operations) as Operation[]).map((value) => (
            <button
              key={value}
              className={`operation ${value} ${operation === value ? 'active' : ''}`}
              aria-pressed={operation === value}
              onClick={() => onOperationChange(value)}
            >
              <span className="operator">{operations[value].symbol}</span>
              <span>{operations[value].label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>
          {operation === 'subtract'
            ? 'Choose a number to subtract'
            : operation === 'divide'
              ? 'Choose a number to divide by'
              : 'Choose a number to practise'}
        </legend>
        <div className="table-options">
          {TABLES.map((value) => (
            <button
              key={value}
              aria-pressed={value === table}
              className={value === table ? 'active' : ''}
              onClick={() => onTableChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="digit-hint">
        Start at {first.a} {symbol} {first.b} and build up to {last.a} {symbol}{' '}
        {last.b}. Say each answer aloud, then reveal it.
      </p>
    </aside>
  );
}

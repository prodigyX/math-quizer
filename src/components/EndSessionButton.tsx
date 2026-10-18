import { Square } from 'lucide-react';

export function EndSessionButton({ onEnd }: { onEnd: () => void }) {
  return (
    <button
      className="end-button"
      onClick={onEnd}
      aria-label="End session and exit focus mode"
    >
      <Square size={19} fill="currentColor" aria-hidden="true" />
      End session
    </button>
  );
}

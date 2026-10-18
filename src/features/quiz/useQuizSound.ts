import { useCallback, useEffect, useRef, useState } from 'react';
import type { QuizState } from './quizReducer';
type Cue = 'correct' | 'incorrect' | 'timeout' | 'complete' | 'tick';
const notes: Record<Cue, number[]> = {
  tick: [900],
  correct: [523, 659, 784],
  incorrect: [330, 262],
  timeout: [392, 330, 262],
  complete: [523, 659, 784, 1047],
};
export function useQuizSound(state: QuizState) {
  const [enabled, setEnabled] = useState(true);
  const context = useRef<AudioContext | null>(null);
  // Called only from a user interaction so mobile browsers can unlock audio.
  function unlock() {
    if (!enabled) return;
    try {
      context.current ??= new AudioContext();
      void context.current.resume().catch(() => {});
    } catch {
      /* Sound is optional when Web Audio is unavailable. */
    }
  }
  const play = useCallback(
    (cue: Cue) => {
      const audio = context.current;
      if (!enabled || !audio || audio.state !== 'running') return;
      const duration = cue === 'tick' ? 0.045 : 0.18;
      notes[cue].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const volume = audio.createGain();
        const start = audio.currentTime + index * 0.13;
        oscillator.frequency.value = frequency;
        volume.gain.setValueAtTime(0, start);
        volume.gain.linearRampToValueAtTime(
          cue === 'tick' ? 0.025 : 0.06,
          start + 0.005,
        );
        volume.gain.exponentialRampToValueAtTime(0.001, start + duration);
        oscillator.connect(volume);
        volume.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
        oscillator.onended = () => {
          oscillator.disconnect();
          volume.disconnect();
        };
      });
    },
    [enabled],
  );
  const lastCue = useRef('');
  const { complete, timedOut, selected, count, question } = state;
  useEffect(() => {
    let cue: Cue | null = null;
    if (complete) cue = 'complete';
    else if (timedOut) cue = 'timeout';
    else if (selected !== null)
      cue = selected === question.answer ? 'correct' : 'incorrect';
    const key = cue ? `${count}-${cue}` : '';
    if (cue && key !== lastCue.current) play(cue);
    lastCue.current = key;
  }, [complete, timedOut, selected, count, question.answer, play]);
  const previousTick = useRef<{ deadline: number; secondsLeft: number } | null>(
    null,
  );
  const { mode, deadline, secondsLeft, started } = state;
  useEffect(() => {
    const previous = previousTick.current;
    previousTick.current = { deadline, secondsLeft };
    // Play only the current second, never a burst of missed ticks after backgrounding.
    if (
      !started ||
      mode !== 'timed' ||
      complete ||
      timedOut ||
      selected !== null ||
      secondsLeft <= 0 ||
      document.hidden
    )
      return;
    if (previous?.deadline === deadline && secondsLeft < previous.secondsLeft)
      play('tick');
  }, [
    mode,
    deadline,
    secondsLeft,
    complete,
    timedOut,
    selected,
    play,
    started,
  ]);
  function toggle() {
    if (enabled) void context.current?.suspend().catch(() => {});
    else {
      try {
        context.current ??= new AudioContext();
        void context.current.resume().catch(() => {});
      } catch {
        /* Keep the quiz usable without audio. */
      }
    }
    setEnabled((value) => !value);
  }
  useEffect(
    () => () => {
      void context.current?.close().catch(() => {});
      context.current = null;
    },
    [],
  );
  return { enabled, unlock, toggle, play };
}

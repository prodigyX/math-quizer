import { useState } from 'react';
import type { QuizSettings } from '../features/quiz/quizReducer';
import { MasteryPractice } from '../features/mastery/MasteryPractice';
import { Star } from 'lucide-react';
import { Header } from '../components/Header';
import { Introduction } from '../components/Introduction';
import { PracticeSettings } from '../features/quiz/components/PracticeSettings';
import { QuizActivity } from '../features/quiz/components/QuizActivity';
import { useQuiz } from '../features/quiz/useQuiz';
import { useInstall } from '../features/pwa/useInstall';
import { InstallDialog } from '../features/pwa/InstallDialog';
import { UpdateNotice } from '../features/pwa/UpdateNotice';
export function QuizPage() {
  const [mastery, setMastery] = useState(false);
  const [focus, setFocus] = useState(false);
  const quizSession = useQuiz();
  const session = {
    ...quizSession,
    start: () => {
      quizSession.start();
      setFocus(true);
    },
    reset: (changes: Partial<QuizSettings> = {}) => {
      quizSession.reset(changes);
      setFocus(false);
    },
  };
  const { install, helpOpen, closeHelp, platform, installed, installLabel } =
    useInstall();
  return (
    <div className={focus ? 'app focused' : 'app'}>
      <Header
        onInstall={install}
        installed={installed}
        installLabel={installLabel}
      />
      <main>
        {!focus && <Introduction />}
        <div className="workspace">
          {mastery ? (
            <MasteryPractice
              onFocusChange={setFocus}
              focus={focus}
              onToggleFocus={() => setFocus((value) => !value)}
              onModeChange={(mode) => {
                if (mode !== 'mastery') {
                  session.reset({ mode });
                  setMastery(false);
                }
              }}
            />
          ) : (
            <>
              {!focus && (
                <PracticeSettings
                  digits={session.state.digits}
                  onDigitsChange={(digits) => session.reset({ digits })}
                  operation={session.state.operation}
                  onOperationChange={(operation) =>
                    session.reset({ operation })
                  }
                />
              )}
              <QuizActivity
                onMastery={() => {
                  session.reset({ mode: 'practice' });
                  setMastery(true);
                }}
                session={session}
                focus={focus}
                onToggleFocus={() => setFocus((value) => !value)}
              />
            </>
          )}
        </div>
        {!focus && (
          <div className="encouragement">
            <span className="encouragement-icon">
              <Star size={19} />
            </span>
            <p>
              {session.state.mode === 'timed'
                ? 'A little challenge. A little courage. '
                : 'No timer. No rush. '}
              <strong>Just you getting a little better.</strong>
            </p>
            <span className="doodle">✧</span>
          </div>
        )}
      </main>
      <footer>
        <span>Made for curious little minds.</span>
        <span>
          Think it. Try it. Learn it. <span className="footer-flower">✳</span>
        </span>
      </footer>
      <UpdateNotice />
      <InstallDialog open={helpOpen} platform={platform} onClose={closeHelp} />
    </div>
  );
}

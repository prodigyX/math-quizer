# Little Maths

A responsive React + TypeScript maths flashcard and quiz PWA for Year 3–4 students. Built with Vite. No account, backend, analytics, or environment variables required.

## Run locally

```sh
npm install
npm run dev
```

## Check and build

```sh
npm test
npm run build
npm run preview
```

## Deploy on Vercel

Import this repository into Vercel. Select **Vite** if not detected automatically. Build command: `npm run build`. Output directory: `dist`. Deploy from the repository root. HTTPS is provided by Vercel and is needed for PWA installation and offline caching.

## Learning experience

- Large, responsive flashcards with revealable answers and focus mode.
- Addition, subtraction, multiplication, and division.
- Single (1–9), double (10–99), and triple (100–999) digit settings in both flashcards and quizzes; single is the default.
- Addition/subtraction use the selected size for both operands. Multiplication uses it for the first operand; division uses it for the dividend. Answers can have a different number of digits.
- Multiplication and division use times-table multipliers/divisors up to 12. Single-digit mode caps them at 9.
- Digit size is the difficulty setting; changing it starts a fresh session.
- These are general practice levels, not a specific national curriculum.
- Subtraction stays non-negative; division always gives whole numbers.
- Untimed 10-question quizzes with four choices, immediate feedback, and a score.
- Changing digit size, operation, or mode starts a new session. Progress is held in memory.
- Touch controls, keyboard-accessible buttons, visible focus indicators, live feedback, and reduced-motion support.

## Install and offline use

Open the deployed app online once to cache its application files. On iPhone/iPad, use Safari → Share → Add to Home Screen. Supporting Android/desktop browsers can use the in-app Install button. Installation availability depends on the browser. Once cached, practice and quizzes work offline. Google Fonts are optional: system fonts remain available offline. A banner offers to load an updated version when a new service worker is ready.

The production build generates the service worker and web app manifest through `vite-plugin-pwa`; offline mode is not enabled on the development server. Verify offline behavior against a production build or deployment.

## Code organization

```text
src/
  App.tsx                   Application entry point
  pages/
    QuizPage.tsx            Quiz page composition and focus-mode state
  components/               Shared page header and introduction
  features/
    quiz/
      components/           Settings, toolbar, question card, results, activity
      maths.ts              Framework-independent question/choice generation
      maths.test.ts         Arithmetic and answer-choice invariants
      quizReducer.ts        Pure, guarded quiz state transitions
      quizReducer.test.ts   Scoring, reset, progression, and completion tests
      useQuiz.ts            React integration and question generation
    pwa/
      useInstall.ts         Install prompt lifecycle and fallback state
      InstallDialog.tsx     Native modal dialog and installation instructions
      UpdateNotice.tsx      Service worker updates and error feedback
  styles.css                Shared visual styles and responsive breakpoints
```

Quiz state changes together through a reducer. Random question generation stays outside the reducer so transitions are deterministic and testable. UI components receive typed data and callbacks; browser installation and service worker effects stay within the PWA feature. Keep shared components in `components/` and quiz-specific components beside the quiz logic.

## Code quality

Use Node.js 22.6 or newer for the TypeScript test runner (Node.js 24 recommended).

```sh
npm run lint          # TypeScript, React Hooks, and Fast Refresh rules
npm run typecheck     # Strict TypeScript and unused-code checks
npm run format:check # Consistent formatting across source and configuration
npm test             # Arithmetic and quiz state regression tests
npm run build        # TypeScript validation and production PWA build
```

Run `npm run format` to format changes. Component/device browser checks are separate from the automated logic tests.

## Timed quiz and sound

Choose **Timed quiz** for ten questions with a choice of **5, 10, or 15 seconds** per question (default: 10). Changing the time starts a new quiz. Press **Start quiz** when ready: questions stay hidden and the countdown stays stopped until then. Changing settings or restarting returns to this ready screen. The countdown resets for each question. A visible points counter awards **1 point per correct answer**, up to 10; wrong answers and timeouts earn zero points. Answering stops the countdown. Timeouts count as unanswered, lock the choices, and show the correct answer. Timed quizzes automatically advance 1.5 seconds after an answer or timeout, and automatically show results after question ten. Changing settings, restarting, or leaving timed mode cancels a pending advance. Time continues while the app is in the background. Flashcards and Quick quiz remain untimed.

Use **Sound on/off** to control a short tick each countdown second plus gentle correct-answer, incorrect-answer, timeout, and completion tones. Ticking stops on answering, timeout, or completion, and stays silent while the page is hidden. Missed ticks are not replayed. Audio is generated locally with Web Audio, works offline, and is unlocked by interacting with the quiz. Browser/device audio restrictions may still apply. The sound preference lasts for the current page session. Timing lives in the quiz reducer/hook; audio lifecycle and feedback live in `useQuizSound.ts`.

## Mastery mode

Choose **Mastery**, an operation, and a number from **1–12**. Each session contains twelve facts in order. For the number 2:

- Addition: `2 + 1`, `2 + 2`, … `2 + 12`.
- Subtraction: `3 − 2`, `4 − 2`, … `14 − 2` (non-negative answers).
- Multiplication: `2 × 1`, `2 × 2`, … `2 × 12`.
- Division: `2 ÷ 2`, `4 ÷ 2`, … `24 ÷ 2` (whole-number answers).

Say the answer, reveal it, then select **Next fact**. After twelve facts, repeat or continue to the next number. This is untimed guided practice with progress rather than scored answers. Switching operations or numbers starts at the first fact; leaving Mastery resets its session. Mastery state and progression are isolated in `src/features/mastery/`.

## Starting a session

All four modes — Flashcards, Quick quiz, Timed quiz, and Mastery — wait on a ready screen with a Start button. Pressing Start reveals the activity and enters focus mode automatically. In Timed quiz, this also starts the countdown. Restarting or changing settings returns to the ready screen and exits focus mode. Use **End** in any mode to stop the session, clear its progress, and return to the ready screen outside focus mode. The focus toggle also lets you leave focus mode without ending the session.

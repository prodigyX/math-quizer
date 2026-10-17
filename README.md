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
- Year 3: up to two-digit addition/subtraction and multiplication/division facts up to 10.
- Year 4: up to three-digit addition/subtraction and multiplication/division facts up to 12.
- These are general practice levels, not a specific national curriculum.
- Subtraction stays non-negative; division always gives whole numbers.
- Untimed 10-question quizzes with four choices, immediate feedback, and a score.
- Changing level, operation, or mode starts a new session. Progress is held in memory.
- Touch controls, keyboard-accessible buttons, visible focus indicators, live feedback, and reduced-motion support.

## Install and offline use

Open the deployed app online once to cache its application files. On iPhone/iPad, use Safari → Share → Add to Home Screen. Supporting Android/desktop browsers can use the in-app Install button. Installation availability depends on the browser. Once cached, practice and quizzes work offline. Google Fonts are optional: system fonts remain available offline. A banner offers to load an updated version when a new service worker is ready.

The production build generates the service worker and web app manifest through `vite-plugin-pwa`; offline mode is not enabled on the development server. Verify offline behavior against a production build or deployment.

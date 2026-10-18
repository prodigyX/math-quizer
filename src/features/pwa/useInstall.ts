import { useEffect, useState } from 'react';
import { detectInstallPlatform } from './installPlatform';
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};
export function useInstall() {
  const [platform] = useState(() =>
    detectInstallPlatform(navigator.userAgent, navigator.maxTouchPoints),
  );
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
  );
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const onInstalled = () => {
      setPrompt(null);
      setInstalled(true);
      setHelpOpen(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  async function install() {
    if (platform !== 'other' || !prompt) {
      setHelpOpen(true);
      return;
    }
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      setHelpOpen(true);
    } finally {
      setPrompt(null);
    }
  }
  return {
    install,
    helpOpen,
    platform,
    installed,
    installLabel:
      platform === 'iphone'
        ? 'Add to iPhone'
        : platform === 'ipad'
          ? 'Add to iPad'
          : 'Install app',
    closeHelp: () => setHelpOpen(false),
  };
}

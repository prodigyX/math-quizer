import { useEffect, useRef } from 'react';
import type { InstallPlatform } from './installPlatform';
import { ArrowLeft, X, Share } from 'lucide-react';
export function InstallDialog({
  open,
  platform,
  onClose,
}: {
  open: boolean;
  platform: InstallPlatform;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="install-dialog"
      aria-labelledby="install-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button
          autoFocus
          className="close"
          aria-label="Close instructions"
          onClick={() => onClose()}
        >
          <X />
        </button>
        <span className="brand-icon">✳</span>
        <h2 id="install-title">A little maths, anywhere.</h2>
        {platform !== 'other' ? (
          <>
            <p>
              Add Little Maths to your{' '}
              {platform === 'iphone' ? 'iPhone' : 'iPad'} from Safari. Apple
              requires these steps:
            </p>
            <ol className="install-steps">
              <li>
                Open this website in <strong>Safari</strong>.
              </li>
              <li>
                Tap <strong>Share</strong>{' '}
                <Share size={17} aria-hidden="true" /> in the browser toolbar.
                You may need to open the <strong>More (…)</strong> menu first.
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>.
              </li>
              <li>
                If shown, turn on <strong>Open as Web App</strong>, then tap{' '}
                <strong>Add</strong>.
              </li>
            </ol>
            <p>
              Launch <strong>Little Maths</strong> from its new Home Screen
              icon.
            </p>
            <p className="install-help">
              Can’t see the option? Check Safari’s Share menu, not a menu inside
              this page. If the site opened inside another app, open the same
              link in Safari first.
            </p>
          </>
        ) : (
          <>
            <p>
              If no install prompt appears, open your browser’s menu and look
              for <strong>Install app</strong> or{' '}
              <strong>Add to Home Screen</strong>.
            </p>
            <p>
              On iPhone or iPad, open the site in Safari and use{' '}
              <strong>Share → Add to Home Screen → Add</strong>.
            </p>
          </>
        )}
        <p className="modal-note">
          Visit once while online, then practise offline. No account needed.
        </p>
        <button className="primary" onClick={() => onClose()}>
          Got it <ArrowLeft size={17} />
        </button>
      </div>
    </dialog>
  );
}

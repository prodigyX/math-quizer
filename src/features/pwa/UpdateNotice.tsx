import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
export function UpdateNotice() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  async function update() {
    setUpdating(true);
    setError(false);
    try {
      await updateServiceWorker(true);
    } catch {
      setError(true);
    } finally {
      setUpdating(false);
    }
  }
  if (!needRefresh) return null;
  return (
    <div className="update" role="status">
      {error
        ? 'Could not update. Please try again.'
        : 'A fresh version is ready.'}
      <button disabled={updating} onClick={update}>
        {updating ? 'Updating…' : 'Update app'}
      </button>
    </div>
  );
}

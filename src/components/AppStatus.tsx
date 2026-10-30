import { useEffect, useState } from 'react';
import { applyUpdate, onUpdateReady } from '../lib/serviceWorker';

/** Avisos de conexión y de nueva versión disponible. */
export function AppStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [update, setUpdate] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    const unsubscribe = onUpdateReady(setUpdate);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      unsubscribe();
    };
  }, []);

  if (online && !update) return null;

  return (
    <div className="border-b border-line bg-electric text-white" role="status" aria-live="polite">
      <div className="page-container flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 text-sm">
        {!online ? (
          <p>
            <span className="font-bold">Sin conexión.</span> El compresor sigue funcionando; el eliminador de fondos
            también, si ya lo usaste antes en este dispositivo.
          </p>
        ) : (
          <>
            <p><span className="font-bold">Hay una versión nueva de Vélix Blue.</span> Se aplicará al recargar.</p>
            <button
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900"
              type="button"
              onClick={() => update && applyUpdate(update)}
            >
              Actualizar ahora
            </button>
          </>
        )}
      </div>
    </div>
  );
}

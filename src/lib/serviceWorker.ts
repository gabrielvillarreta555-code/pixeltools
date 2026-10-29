type Listener = (waiting: ServiceWorker) => void;

const listeners = new Set<Listener>();
let waitingWorker: ServiceWorker | null = null;

function announce(worker: ServiceWorker) {
  waitingWorker = worker;
  listeners.forEach((listener) => listener(worker));
}

/** Avisa cuando hay una versión nueva instalada y esperando. */
export function onUpdateReady(listener: Listener) {
  listeners.add(listener);
  if (waitingWorker) listener(waitingWorker);
  return () => {
    listeners.delete(listener);
  };
}

export function applyUpdate(worker: ServiceWorker) {
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
  worker.postMessage('skip-waiting');
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      if (registration.waiting && navigator.serviceWorker.controller) announce(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          // Solo es una actualización si ya había una versión controlando la página.
          if (installing.state === 'installed' && navigator.serviceWorker.controller) announce(installing);
        });
      });
    } catch {
      // Sin service worker la web sigue funcionando; solo pierde el modo sin conexión.
    }
  });
}

import '@fontsource-variable/plus-jakarta-sans/wght.css';
import './style.css';
// Retire only Vélix-owned legacy caches and its previous root worker.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(registrations => { for (const registration of registrations) { const worker = registration.active || registration.waiting; if (worker && new URL(worker.scriptURL).pathname === '/sw.js') void registration.update(); } }).catch(() => {});

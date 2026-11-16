import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import './index.css';
import { registerServiceWorker } from './lib/serviceWorker';

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href);
  if (url.origin === location.origin && (url.pathname === '/' || url.pathname === '/herramientas' || url.pathname.startsWith('/juegos/'))) {
    event.preventDefault(); event.stopPropagation(); location.assign(url.href);
  }
}, { capture: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

registerServiceWorker();

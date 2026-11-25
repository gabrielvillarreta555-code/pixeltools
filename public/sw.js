// Retirement worker: replaces the old offline app without caching gaming content.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
 for (const name of await caches.keys()) if (/^(velix-|pixeltools-)/.test(name)) await caches.delete(name);
 await self.clients.claim();
 await self.registration.unregister();
})()));

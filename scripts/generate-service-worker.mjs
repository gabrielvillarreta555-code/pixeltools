// Genera dist/sw.js después del build. El service worker solo guarda archivos
// de la propia aplicación (HTML, JS, CSS, iconos, modelo y runtime ONNX); nunca
// las fotografías del usuario, que no pasan por la red.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

const toUrl = (path) => `/${relative(dist, path).split(sep).join('/')}`;
const files = (await listFiles(dist)).sort();

// Precarga: la interfaz completa para que funcione sin conexión desde la primera visita.
const precache = files
  .map(toUrl)
  .filter((url) => !url.endsWith('.map'))
  .filter((url) => !/^\/(models|ort)\//.test(url))
  .filter((url) => !['/sw.js', '/_headers', '/robots.txt', '/sitemap.xml', '/404.html', '/og-image.svg'].includes(url))
  .map((url) => url.replace(/\/index\.html$/, '/'))
  .map((url) => (url.length > 1 ? url.replace(/\/$/, '') : url));

// Recursos pesados del eliminador: se guardan la primera vez que se usan.
const heavy = files.map(toUrl).filter((url) => /^\/(models\/.*\.onnx|ort\/.*)$/.test(url));

async function digest(urls) {
  const hash = createHash('sha256');
  for (const url of urls) {
    const path = join(dist, url === '/' ? 'index.html' : url.slice(1));
    const target = url !== '/' && !url.includes('.') ? join(path, 'index.html') : path;
    hash.update(url).update(await readFile(target));
  }
  return hash.digest('hex').slice(0, 12);
}

const shellVersion = await digest(precache);
const heavyVersion = await digest(heavy);

const source = `/* PixelTools service worker · generado por scripts/generate-service-worker.mjs */
const SHELL_CACHE = 'pixeltools-shell-${shellVersion}';
const HEAVY_CACHE = 'pixeltools-ai-${heavyVersion}';
const PRECACHE = ${JSON.stringify(precache, null, 2)};
const HEAVY = new Set(${JSON.stringify(heavy)});

// Las rutas sin barra final pueden responder con una redirección; una respuesta
// redirigida no puede servir una navegación, así que se guarda una copia limpia.
async function clean(response) {
  if (!response.redirected) return response;
  const body = await response.blob();
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.all(PRECACHE.map(async (url) => {
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok) throw new Error('No se pudo precargar ' + url);
      await cache.put(url, await clean(response));
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, HEAVY_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('pixeltools-') && !keep.has(name)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname.length > 1 ? url.pathname.replace(/\\/$/, '') : url.pathname;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match(path)) || (await cache.match('/')) || Response.error();
      }
    })());
    return;
  }

  if (HEAVY.has(path)) {
    event.respondWith((async () => {
      const cache = await caches.open(HEAVY_CACHE);
      const cached = await cache.match(path);
      if (cached) return cached;
      const response = await fetch(request);
      // Se entrega la respuesta en streaming (la barra de progreso del modelo
      // avanza) y se guarda en paralelo, sin bloquear la descarga.
      if (response.status === 200) event.waitUntil(cache.put(path, response.clone()));
      return response;
    })());
    return;
  }

  if (PRECACHE.includes(path)) {
    event.respondWith((async () => {
      const cached = await caches.match(path, { cacheName: SHELL_CACHE });
      return cached || fetch(request);
    })());
  }
});
`;

await writeFile(join(dist, 'sw.js'), source);
console.log(`Service worker: ${precache.length} archivos precargados, ${heavy.length} bajo demanda.`);

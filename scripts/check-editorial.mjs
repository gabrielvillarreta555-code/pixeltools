import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { loadArticles, escapeHtml } from './editorial/content.mjs';
const articles = await loadArticles();
const paths = JSON.parse(await readFile('dist/editorial/routes.json', 'utf8'));
const old = ['/', '/comprimir-imagen', '/eliminar-fondo', '/convertir-imagen', '/redimensionar-imagen', '/recortar-imagen', '/quitar-metadatos', '/extraer-texto', '/imagenes-a-pdf', '/privacidad', '/terminos', '/contacto'];
const routes = [...new Set([...old, ...paths])];
const file = p => 'dist' + (p === '/' ? '/index.html' : p.endsWith('/') ? p + 'index.html' : p + '.html');
const robots = await readFile('dist/robots.txt', 'utf8');
const production = robots.includes('Allow: /');
const titles = new Set(), descriptions = new Set();
for (const route of routes) {
 const html = await readFile(file(route), 'utf8');
 const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description = html.match(/name="description"\s+content="([^"]+)"/)?.[1];
 assert.ok(title && description, route);
 assert.ok(!titles.has(title), `duplicate title ${route}`); titles.add(title);
 assert.ok(!descriptions.has(description), `duplicate description ${route}`); descriptions.add(description);
 const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if (production) assert.equal(canonical, `https://velixblue.com${route}`);
 else assert.match(html, /name="robots" content="noindex,/);
 if (production) assert.ok(!/name="robots" content="[^"]*noindex/.test(html), route);
 assert.ok(new URL(canonical).protocol === 'https:', route);
 if (paths.includes(route)) {
  assert.equal((html.match(/<h1[ >]/g)||[]).length, 1);
  assert.ok(!html.includes('<div id="root">'));
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
   if (/\.(svg|css|png|woff2|webmanifest)$/.test(href)) await access('dist' + href);
   else assert.ok(routes.includes(href), `${route} -> broken link ${href}`);
  }
 }
}
assert.equal(new Set(articles.map(a => a.body)).size, articles.length, 'duplicate article body');
for (const article of articles) {
 const html = await readFile(file(article.path), 'utf8');
 assert.ok(html.includes(escapeHtml(article.answer)));
 const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(data['@context'], 'https://schema.org');
 assert.equal(data['@graph'][0]['@type'], 'Article');
 assert.equal(data['@graph'][0].headline, article.title);
 assert.equal(data['@graph'][0].dateModified, article.reviewedAt);
 assert.equal(data['@graph'][1]['@type'], 'BreadcrumbList');
}
if (production) {
 const sitemap = await readFile('dist/sitemap.xml', 'utf8');
 const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
 assert.deepEqual(locs.sort(), routes.map(p => 'https://velixblue.com' + p).sort());
 assert.ok(!sitemap.includes('pages.dev'));
 assert.ok(!(await readFile('dist/_headers','utf8')).includes('X-Robots-Tag'));
} else {
 await assert.rejects(access('dist/sitemap.xml'));
 assert.ok((await readFile('dist/_headers','utf8')).includes('X-Robots-Tag: noindex'));
}
const sw = await readFile('dist/sw.js','utf8');
const precache = JSON.parse(sw.match(/const PRECACHE = (\[[\s\S]*?\]);/)[1]);
assert.ok(!precache.some(p => p.startsWith('/juegos/') || p === '/editorial/search-index.json'));
assert.ok(sw.includes('Esta guía necesita conexión'));
const home = await readFile('dist/index.html');
const css = await readFile('dist/editorial/style.css');
const js = await readFile('dist/editorial/search.js');
const index = await readFile('dist/editorial/search-index.json');
assert.ok(gzipSync(js).length < 50_000 && gzipSync(index).length < 50_000);
console.log(JSON.stringify({ mode: production ? 'production' : 'preview', routes: routes.length, articles: articles.length, gzipBytes: { html: gzipSync(home).length, css: gzipSync(css).length, js: gzipSync(js).length, search: gzipSync(index).length } }, null, 2));
console.log('SEO, links, sitemap, HTML, presupuestos y caché editorial: OK');

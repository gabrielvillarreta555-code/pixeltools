// HTTP checks against a real deployment, independent of JavaScript execution.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadArticles, escapeHtml } from './editorial/content.mjs';
const base = (process.env.E2E_BASE_URL || 'https://velixblue.com').replace(/\/$/, '');
const canonicalBase = process.env.E2E_SITE_URL || base;
const production = base === 'https://velixblue.com';
const articles = await loadArticles();
const tools = JSON.parse(await readFile('src/lib/toolCatalog.json', 'utf8')).filter(t => t.path);
const routes = ['/', '/juegos/', '/herramientas', ...tools.map(t => t.path), '/privacidad', '/terminos', '/contacto', ...articles.map(a => a.path)];
const titles = new Set(), descriptions = new Set();
for (const path of routes) {
 const response = await fetch(base + path, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
 assert.equal(response.status, 200, path);
 const html = await response.text();
 assert.ok(html.includes(`rel="canonical" href="${canonicalBase}${path}"`), `canonical ${path}`);
 const robots = html.match(/name="robots" content="([^"]+)"/)?.[1] || '';
 assert.equal(/noindex/i.test(robots), !production, `meta robots ${path}`);
 assert.equal(/noindex/i.test(response.headers.get('x-robots-tag') || ''), !production, `header robots ${path}`);
 const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description = html.match(/name="description" content="([^"]+)"/)?.[1];
 assert.ok(title && description && !titles.has(title) && !descriptions.has(description), `unique metadata ${path}`);
 titles.add(title); descriptions.add(description);
 const article = articles.find(a => a.path === path);
 if (article) {
  assert.ok(html.includes(escapeHtml(article.answer)) && html.includes(article.html), `initial content ${path}`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.equal(JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'][0]['@type'], 'Article');
 }
 console.log(`200 ${path}`);
}
const robots = await fetch(base + '/robots.txt'); assert.equal(robots.status, 200);
const rules = await robots.text();
if (production) {
 assert.match(rules, /Allow: \/\s/); assert.ok(!rules.includes('Disallow: /'));
 assert.ok(rules.includes('Sitemap: https://velixblue.com/sitemap.xml'));
 const sitemap = await fetch(base + '/sitemap.xml'); assert.equal(sitemap.status, 200);
 const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
 assert.deepEqual(urls.sort(), routes.map(p => base + p).sort());
} else {
 assert.ok(rules.includes('Disallow: /'));
 assert.equal((await fetch(base + '/sitemap.xml')).status, 404);
}
assert.equal((await fetch(base + '/juegos/velix-ruta-inexistente')).status, 404);
console.log(`HTTP real: ${routes.length} rutas, HTML inicial, canonical, robots, sitemap y 404 OK (${production ? 'producción' : 'preview'}).`);

import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from 'playwright';
import { preview } from 'vite';
import { loadArticles } from '../scripts/editorial/content.mjs';
const articles = await loadArticles();
const tools = JSON.parse(await readFile('src/lib/toolCatalog.json', 'utf8')).filter(t => t.path);
const server = process.env.E2E_BASE_URL ? null : await preview({ logLevel: 'silent', preview: { port: 4322, strictPort: true } });
const base = process.env.E2E_BASE_URL || 'http://localhost:4322';
const expectedSite = process.env.E2E_SITE_URL || 'https://velixblue.com';
const paths = ['/', '/juegos/', '/herramientas', ...articles.map(a => a.path)];
const errors = [];
await mkdir('docs/capturas', { recursive: true });
try {
 for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  if (process.env.E2E_BROWSER && process.env.E2E_BROWSER !== name) continue;
  const browser = await engine.launch();
  try {
   const context = await browser.newContext({ javaScriptEnabled: false });
   const page = await context.newPage();
   for (const path of paths) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator('h1').count(), 1, path);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `${expectedSite}${path}`);
    if (path.includes('/juegos/') && path !== '/juegos/') {
     assert.ok((await page.locator('.direct-answer').innerText()).length > 80);
     assert.ok(await page.locator('.sources a').count());
     assert.ok(await page.locator('.related a').count());
     const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
     assert.equal(data['@graph'][0]['@type'], 'Article');
    }
   }
   await context.close();
   const interactive = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
   const p = await interactive.newPage();
   p.on('pageerror', err => errors.push(`${name}: ${err.message}`));
   p.on('console', msg => { if (msg.type() === 'error') errors.push(`${name}: ${msg.text()}`); });
   const requests = [];
   p.on('request', r => requests.push(r.url()));
   await p.goto(base + '/');
   await p.getByLabel('¿Qué necesitas resolver?').fill('instagram');
   await p.locator('#search-results a').first().waitFor();
   assert.equal(await p.locator('#search-results a').count(), 1);
   assert.match(await p.locator('#search-results').innerText(), /Redimensionar/);
   await p.getByLabel('Limpiar búsqueda').click();
   assert.equal(await p.locator('#search').inputValue(), '');
   await p.locator('#search').fill('error 279');
   await p.locator('#search-results a').first().waitFor();
   await p.locator('#search-results a').first().click();
   await p.locator('.direct-answer').waitFor();
   assert.ok(!requests.some(r => /\/(ort|ocr|models)\/|assets\/.*\.js/.test(r)), 'no tool runtimes in editorial');
   for (const width of [320, 390, 768, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/juegos/', articles[0].path]) {
     await p.goto(base + path);
     assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: overflow ${path} ${width}`);
     if (name === 'chromium' && (width === 390 || width === 1440) && path !== '/juegos/') await p.screenshot({ path: `docs/capturas/${path === '/' ? 'portada' : 'consulta'}-${width}.png`, fullPage: true });
    }
   }
   for (const path of [...tools.map(t => t.path), '/privacidad', '/terminos', '/contacto']) {
    const r = await p.goto(base + path); assert.equal(r.status(), 200);
    await p.locator('h1').waitFor();
    assert.equal(await p.locator('h1').count(), 1);
   }
   await p.goto(base + '/comprimir-imagen');
   await p.getByRole('link', { name: 'Vélix Blue, inicio' }).first().click();
   await p.locator('#search').waitFor();
   await p.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Juegos', exact: true }).click();
   await p.locator('h1').waitFor();
   assert.ok(p.url().endsWith('/juegos/'));
   assert.equal(await p.locator('#root').count(), 0, 'must leave React shell');
   await interactive.close();
   console.log(`${name}: HTML sin JS, 10 consultas, 12 rutas anteriores, búsqueda, navegación y 4 anchos OK`);
  } finally { await browser.close(); }
 }
 assert.deepEqual(errors, []);
} finally { await server?.close(); }
console.log('Editorial E2E: sin errores de consola.');

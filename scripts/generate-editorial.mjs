import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { loadArticles, games, escapeHtml as e } from './editorial/content.mjs';
import { layout, articleBody, articleCards, toolCards, search, categories } from './editorial/template.mjs';
const dist = new URL('../dist/', import.meta.url);
const shell = await readFile(new URL('index.html', dist), 'utf8');
const siteUrl = shell.match(/name="velix-site-url" content="([^"]+)"/)[1];
const indexable = shell.includes('name="velix-indexable" content="true"');
const font = '/assets/' + (await readdir(new URL('assets/', dist))).find(n => /^plus-jakarta-sans-latin-wght.*woff2$/.test(n));
if (font.endsWith('undefined')) throw new Error('Falta fuente editorial local');
const tools = JSON.parse(await readFile(new URL('../src/lib/toolCatalog.json', import.meta.url), 'utf8')).filter(t => t.path);
const articles = await loadArticles();
const pages = [];
async function page(path, title, description, body, structured = [], noindex = false) {
  const file = path === '/' ? 'index.html' : path.endsWith('/') ? `${path.slice(1)}index.html` : `${path.slice(1)}.html`;
  const url = new URL(file, dist); await mkdir(new URL('./', url), { recursive: true });
  await writeFile(url, layout({ path, title, description, body, structured, noindex, siteUrl, indexable, font }));
  if (!noindex) pages.push(path);
}
const toolSection = `<section class="wrap section" id="herramientas"><div class="section-title"><div><span class="eyebrow">TU CAJA DE HERRAMIENTAS</span><h2>Crea más. Instala menos.</h2></div><a class="text-link" href="/herramientas">Ver herramientas →</a></div><p class="section-intro">Ocho herramientas gratuitas que procesan tus imágenes en tu navegador.</p><div class="tools-grid">${toolCards(tools)}</div><div class="blue-note"><img src="/blue-vivo.svg" width="72" height="86" alt="Blue, la mascota de Blue Lab Studios"><p><strong>Hola, soy Blue.</strong><br>Te acompaño mientras exploras las herramientas.</p></div></section>`;
await page('/', 'Vélix Blue — Consultas de juegos y herramientas gratuitas', 'Resuelve dudas de Free Fire, Roblox, Minecraft y Fortnite con fuentes oficiales. Usa ocho herramientas de imagen gratuitas con procesamiento local.', `<section class="wrap hero"><div class="hero-top"><span class="eyebrow">VÉLIX · JUEGA, RESUELVE, CREA</span><span class="hero-index">GUÍAS + HERRAMIENTAS</span></div><h1>Menos dudas.<br><span>Más posibilidades.</span></h1><p class="hero-copy">Respuestas claras para tus juegos.<br>Herramientas prácticas para tus ideas.</p>${search()}${categories()}</section><section class="wrap section"><div class="section-title"><div><span class="eyebrow">UN BUEN PUNTO DE PARTIDA</span><h2>Tu próxima respuesta está aquí.</h2></div><a class="text-link" href="/juegos/">Todas las consultas →</a></div><div class="questions-grid">${articleCards(articles.slice(0, 6))}</div></section>${toolSection}<section class="wrap editorial-promise"><span class="eyebrow">CLARIDAD ANTES QUE ATAJOS</span><h2>Fuentes a la vista.<br>Sin soluciones mágicas.</h2><p>Cada consulta incluye una respuesta directa, su alcance y enlaces para comprobar la información. Las herramientas trabajan con tus archivos localmente.</p><a href="/juegos/">Explorar las guías →</a></section>`);
await page('/juegos/', 'Consultas y guías de videojuegos | Vélix Blue', 'Encuentra respuestas sobre errores, compatibilidad y ajustes de Free Fire, Roblox, Minecraft y Fortnite. Guías con fuentes y fecha de revisión.', `<section class="wrap compact-hero"><span class="eyebrow">VÉLIX JUEGOS</span><h1>Una duda menos.<br><span>Una partida más.</span></h1><p>Elige tu juego. Encuentra una respuesta que puedas comprobar.</p>${search()}${categories()}</section>${Object.entries(games).map(([slug, name]) => `<section class="wrap section" id="${slug}"><h2>${e(name)}</h2><div class="questions-grid">${articleCards(articles.filter(a => a.game === slug))}</div></section>`).join('')}`);
await page('/herramientas', 'Herramientas de imagen gratuitas y locales | Vélix Blue', 'Comprime, convierte, recorta, redimensiona, elimina fondos y metadatos, extrae texto o crea PDF. Ocho herramientas locales y sin cuentas.', `<section class="wrap compact-hero"><span class="eyebrow">VÉLIX HERRAMIENTAS</span><h1>De la idea<br><span>al archivo listo.</span></h1><p>Elige una herramienta, trabaja con tu imagen y descarga el resultado.</p>${search()}</section>${toolSection}`);
for (const a of articles) await page(a.path, `${a.title} | Vélix Blue`, a.description, articleBody(a, articles), [
  { '@type': 'Article', headline: a.title, description: a.description, dateModified: a.reviewedAt, inLanguage: 'es', mainEntityOfPage: `${siteUrl}${a.path}`, author: { '@type': 'Organization', name: 'Blue Lab Studios' }, publisher: { '@type': 'Organization', name: 'Blue Lab Studios' } },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: 'Juegos', item: `${siteUrl}/juegos/` }, { '@type': 'ListItem', position: 3, name: a.title, item: `${siteUrl}${a.path}` }] }
]);
await page('/404', 'Página no encontrada | Vélix Blue', 'La página solicitada no existe. Explora los juegos o las herramientas de Vélix Blue.', '<section class="wrap compact-hero"><span class="eyebrow">ERROR 404</span><h1>Esta página no está aquí.</h1><p>Vuelve al inicio o encuentra otra respuesta.</p><a class="button" href="/">Ir al inicio</a> <a class="button" href="/juegos/">Ver juegos</a></section>', [], true);
const index = [...articles.map(a => ({ title: a.title, description: a.description, category: games[a.game], path: a.path })), ...tools.map(t => ({ title: t.name, description: t.description, category: 'Herramienta', keywords: t.keywords, path: t.path }))];
await writeFile(new URL('editorial/search-index.json', dist), JSON.stringify(index));
await writeFile(new URL('editorial/routes.json', dist), JSON.stringify(pages));
if (indexable) {
  const sitemapFile = new URL('sitemap.xml', dist);
  const existing = await readFile(sitemapFile, 'utf8');
  const extra = pages.filter(p => p !== '/').map(path => { const article = articles.find(a => a.path === path); return `  <url><loc>${e(siteUrl + path)}</loc>${article ? `<lastmod>${article.reviewedAt}</lastmod>` : ''}</url>`; }).join('\n');
  await writeFile(sitemapFile, existing.replace('</urlset>', `${extra}\n</urlset>`));
}
console.log(`Editorial: ${articles.length} consultas, HTML completo y búsqueda local.`);

import assert from 'node:assert/strict';
import { readFile,access,readdir,stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { loadArticles,escapeHtml } from './editorial/content.mjs';
import { officialMedia } from './editorial/official-media.mjs';
import { themes,retired } from './editorial/themes.mjs';
const routes=JSON.parse(await readFile('dist/editorial/routes.json','utf8'));
const articles=await loadArticles(),robots=await readFile('dist/robots.txt','utf8'),prod=robots.includes('Allow: /');
const file=p=>'dist'+(p==='/'?'/index.html':p.endsWith('/')?p+'index.html':p+'.html');
const titles=new Set(),descriptions=new Set();
assert.equal(routes.length,47);assert.equal(articles.length,30);
assert.equal(new Set(articles.map(a=>a.body)).size,articles.length);
const allowedMedia = Object.keys(officialMedia).flatMap(cover => [480,960,1600].map(size => `${cover}-${size}.webp`));
for(const route of routes){
 const html=await readFile(file(route.path),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route.path);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],desc=html.match(/name="description" content="([^"]+)"/)?.[1];
 assert.ok(title&&desc&&!titles.has(title)&&!descriptions.has(desc),route.path);titles.add(title);descriptions.add(desc);
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];assert.ok(new URL(canonical));
 if(prod){assert.equal(canonical,'https://velixblue.com'+route.path);assert.ok(!/name="robots" content="noindex/.test(html));}else assert.match(html,/name="robots" content="noindex/);
 for(const[,href]of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){
  assert.ok(!retired.includes(href),`retired link ${route.path}: ${href}`);
  if(/\.[a-z0-9]+$/.test(href))await access('dist'+href);else assert.ok(routes.some(r=>r.path===href),`broken ${href}`);
 }
 assert.ok(!/onnx|tesseract|pdf-lib|Comprimir imagen|Eliminar fondo|Herramientas digitales/i.test(html));
 for(const [match,name] of html.matchAll(/\/media\/([a-z0-9-]+\.webp)/g)) assert.ok(allowedMedia.includes(name), `${route.path}: ${match}`);
 const a=articles.find(a=>a.path===route.path);
 if(a){assert.ok(html.includes(escapeHtml(a.answer))&&html.includes(a.html));const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.ok(['Article','NewsArticle'].includes(ld['@graph'][0]['@type']));assert.equal(ld['@graph'][0].headline,a.title);const expectedImage = '/media/'+a.cover+'-1600.webp';
 if(Object.hasOwn(officialMedia,a.cover)) {
  assert.ok(ld['@graph'][0].image[0].endsWith(expectedImage));
  assert.match(html,/This material is unofficial and is not endorsed by Supercell/);
 } else {
  assert.equal(ld['@graph'][0].image, undefined);
  assert.doesNotMatch(html, /property="og:image"/);
 }}
}
if(prod){const xml=await readFile('dist/sitemap.xml','utf8');assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]).sort(),routes.map(r=>'https://velixblue.com'+r.path).sort());assert.ok(!(await readFile('dist/_headers','utf8')).includes('X-Robots-Tag'));}else{await assert.rejects(access('dist/sitemap.xml'));assert.match(await readFile('dist/_headers','utf8'),/X-Robots-Tag: noindex/);}
for(const path of retired)assert.match(await readFile(file(path),'utf8'),/name="robots" content="noindex/);
for(const dir of ['models','ort','ocr'])await assert.rejects(access('dist/'+dir));
// VX-STR-001: una sección solo existe si tiene artículos; nunca se reabre /herramientas.
const hubRoutes=routes.filter(r=>['/rendimiento/','/tecnologia/'].includes(r.path)).map(r=>r.path);
for(const hub of ['rendimiento','tecnologia']){const items=articles.filter(a=>a.section===hub);if(items.length){assert.ok(hubRoutes.includes(`/${hub}/`));const html=await readFile(file(`/${hub}/`),'utf8');for(const a of items)assert.ok(html.includes(`href="${a.path}"`),`${hub}: ${a.path}`);assert.match(await readFile('dist/index.html','utf8'),new RegExp(`href="/${hub}/"`));}else{await assert.rejects(access(file(`/${hub}/`)));assert.doesNotMatch(await readFile('dist/index.html','utf8'),new RegExp(`href="/${hub}/"`));}}
assert.ok(!routes.some(r=>r.path.startsWith('/herramientas')));
const sw=await readFile('dist/sw.js','utf8');assert.ok(sw.includes('registration.unregister()'));assert.ok(!sw.includes('fetch('));
const media=await readdir('dist/media');assert.deepEqual(media.sort(),allowedMedia.sort());
for(const name of media)assert.ok((await stat('dist/media/'+name)).size<400000,`image budget ${name}`);
const js=(await readdir('dist/assets')).filter(n=>n.endsWith('.js'));let bytes=0;for(const name of js)bytes+=gzipSync(await readFile('dist/assets/'+name)).length;
bytes+=gzipSync(await readFile('dist/editorial/search.js')).length;assert.ok(bytes<10000);
console.log(JSON.stringify({mode:prod?'production':'preview',routes:routes.length,articles:articles.length,themes:Object.keys(themes).length,responsiveImages:media.length,jsGzipBytes:bytes}));
console.log('HTML, SEO, enlaces, retiro, imágenes y presupuesto JS: OK');

import assert from 'node:assert/strict';
import { readFile,access,readdir,stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { loadArticles,escapeHtml } from './editorial/content.mjs';
import { themes,retired } from './editorial/themes.mjs';
const routes=JSON.parse(await readFile('dist/editorial/routes.json','utf8'));
const articles=await loadArticles(),robots=await readFile('dist/robots.txt','utf8'),prod=robots.includes('Allow: /');
const file=p=>'dist'+(p==='/'?'/index.html':p.endsWith('/')?p+'index.html':p+'.html');
const titles=new Set(),descriptions=new Set();
assert.equal(routes.length,32);assert.equal(articles.length,16);
assert.equal(new Set(articles.map(a=>a.body)).size,16);
assert.equal(new Set(articles.filter(a=>a.featured).map(a=>a.cover)).size,6);
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
 const a=articles.find(a=>a.path===route.path);
 if(a){assert.ok(html.includes(escapeHtml(a.answer))&&html.includes(a.html));const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.ok(['Article','NewsArticle'].includes(ld['@graph'][0]['@type']));assert.equal(ld['@graph'][0].headline,a.title);assert.ok(ld['@graph'][0].image[0].endsWith('.webp'));}
}
if(prod){const xml=await readFile('dist/sitemap.xml','utf8');assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]).sort(),routes.map(r=>'https://velixblue.com'+r.path).sort());assert.ok(!(await readFile('dist/_headers','utf8')).includes('X-Robots-Tag'));}else{await assert.rejects(access('dist/sitemap.xml'));assert.match(await readFile('dist/_headers','utf8'),/X-Robots-Tag: noindex/);}
for(const path of retired)assert.match(await readFile(file(path),'utf8'),/name="robots" content="noindex/);
for(const dir of ['models','ort','ocr'])await assert.rejects(access('dist/'+dir));
const sw=await readFile('dist/sw.js','utf8');assert.ok(sw.includes('registration.unregister()'));assert.ok(!sw.includes('fetch('));
const media=await readdir('dist/media');assert.equal(media.length,27);
for(const name of media)assert.ok((await stat('dist/media/'+name)).size<400000,`image budget ${name}`);
const js=(await readdir('dist/assets')).filter(n=>n.endsWith('.js'));let bytes=0;for(const name of js)bytes+=gzipSync(await readFile('dist/assets/'+name)).length;
bytes+=gzipSync(await readFile('dist/editorial/search.js')).length;assert.ok(bytes<10000);
console.log(JSON.stringify({mode:prod?'production':'preview',routes:routes.length,articles:articles.length,themes:Object.keys(themes).length,responsiveImages:media.length,jsGzipBytes:bytes}));
console.log('HTML, SEO, enlaces, retiro, imágenes y presupuesto JS: OK');

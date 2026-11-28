import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseArticle, loadArticles, markdown, labelTables } from '../scripts/editorial/content.mjs';
import { themes, retired, siteConfig } from '../scripts/editorial/themes.mjs';
import { jsonLd, articleBody, card } from '../scripts/editorial/template.mjs';
import { searchItems } from '../public/editorial/search.js';
import { onRequest } from '../functions/_middleware';
const source=readFileSync('content/juegos/01-roblox-280.md','utf8');
describe('publicación editorial',()=>{
 it('conserva las diez URLs originales y distribuye las lecturas destacadas entre los seis juegos',async()=>{
  const all=await loadArticles(); expect(all).toHaveLength(36);
  for(const file of execFileSync('git',['ls-tree','-r','--name-only','fa39de5','content/juegos'],{encoding:'utf8'}).trim().split('\n')){
   const old=JSON.parse(execFileSync('git',['show',`fa39de5:${file}`],{encoding:'utf8'}).split('---')[1]);
   expect(all.some(a=>a.path===`/juegos/${old.game}/${old.slug}`)).toBe(true);
  }
  for(const [game, count] of Object.entries({'gta-vi': 4, 'free-fire': 3, 'clash-royale': 6, minecraft: 1, fortnite: 2, roblox: 2})) {
   expect(all.filter(a=>a.featured&&a.game===game)).toHaveLength(count);
  }
 });
 it('valida seis temas completos con portada y ambientación distintas',()=>{
  expect(Object.keys(themes)).toHaveLength(6);
  for(const key of ['hero','texture','card','heading','background'])expect(new Set(Object.values(themes).map(t=>t[key])).size).toBe(6);
 });
 it.each([['"roblox"','"../private"'],['"published"','"scheduled"'],['"2026-11-16"','"2099-11-16"'],['"2026-11-16"','"2026-02-30"'],['"guia"','"fake"'],['https://en.help.roblox.com','javascript:alert(1)//']])('rechaza metadatos inválidos %s',(a,b)=>expect(()=>parseArticle(source.replace(a,b))).toThrow());
 it('impide H1 duplicado y ejecutables en cuerpo o JSON-LD',()=>{
  expect(()=>parseArticle(source.replace('## Primero','# Primero'))).toThrow();
  const html=markdown.render('<script>alert(1)</script>\n[x](javascript:alert(1))\n![x](https://evil.example/x.png)');
  expect(html).not.toContain('<script>');expect(html).not.toContain('href="javascript:');expect(html).not.toContain('<img');
  expect(jsonLd({x:'</script>'})).not.toContain('<');
 });
 it('búsqueda local sin tildes y sin coincidencias falsas',()=>{
  const items=[{title:'Guía Minecraft',description:'Coordenadas',category:'Minecraft'}];
  expect(searchItems(items,'GUIA coordenadas')).toEqual(items);expect(searchItems(items,'compresor')).toEqual([]);expect(searchItems(items,'')).toEqual([]);
 });
 it('protege previews incluso con SITE_URL heredado de producción',()=>{
  expect(siteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature',SITE_URL:'https://velixblue.com'}).indexable).toBe(false);
  expect(siteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main'}).indexable).toBe(true);
  expect(siteConfig({}).indexable).toBe(false);
  expect(()=>siteConfig({CF_PAGES_URL:'javascript:alert(1)'})).toThrow();
 });
});
describe('secciones transversales VX-STR-001',()=>{
 const [,front,body]=source.split(/^---\n|\n---\n/m);
 const base=JSON.parse(front);
 const make=(changes:Record<string,unknown>,drop:string[]=[])=>{const data={...base,...changes};for(const k of drop)delete data[k];return `---\n${JSON.stringify(data,null,2)}\n---\n${body}`;};
 const price={item:'Teléfono de ejemplo 128 GB',amount:199,currency:'USD',market:'PA',retailer:'Tienda',url:'https://example.com/p',observedAt:'2026-11-10'};
 const tech={section:'tecnologia',games:['Fortnite'],kind:'comparativa',handsOn:false,reviewedAt:'2026-11-16',publishedAt:'2026-11-16'};
 const today={today:'2026-11-27'};
 it('conserva todas las URLs publicadas en main al añadir secciones',async()=>{
  const paths=(await loadArticles()).map(a=>a.path);
  for(const file of execFileSync('git',['ls-tree','-r','--name-only','3aee488','content/juegos'],{encoding:'utf8'}).trim().split('\n')){
   const old=JSON.parse(execFileSync('git',['show',`3aee488:${file}`],{encoding:'utf8'}).split('---')[1]);
   expect(paths).toContain(`/juegos/${old.game}/${old.slug}`);
  }
 });
 it('ubica una pieza sin juego en su sección y exige nombrar videojuegos',()=>{
  expect(parseArticle(make(tech,['game']),'t',today).path).toBe(`/tecnologia/${base.slug}`);
  expect(()=>parseArticle(make({...tech,games:[]},['game']),'t',today)).toThrow(/videojuego/);
  expect(()=>parseArticle(make({section:'rendimiento'},['game']),'t',today)).toThrow(/videojuego/);
  expect(()=>parseArticle(make({},['game']),'t',today)).toThrow(/game o section/);
  expect(()=>parseArticle(make({section:'hardware'}),'t',today)).toThrow(/sección/);
  expect(parseArticle(make({section:'rendimiento'}),'t',today).path).toBe(`/juegos/roblox/${base.slug}`);
 });
 it('obliga a declarar si hubo prueba propia',()=>{
  expect(()=>parseArticle(make({...tech,handsOn:undefined},['game']),'t',today)).toThrow(/handsOn/);
  expect(()=>parseArticle(make({...tech,handsOn:true},['game']),'t',today)).toThrow(/methodology/);
  expect(()=>parseArticle(make({kind:'comparativa'}),'t',today)).toThrow(/sección/);
 });
 it.each([
  ['sin mercado',{...price,market:undefined}],['mercado no ISO',{...price,market:'Panamá'}],['moneda no ISO',{...price,currency:'$'}],
  ['importe no positivo',{...price,amount:0}],['tienda sin HTTPS',{...price,url:'http://example.com'}],['fecha inválida',{...price,observedAt:'2026-02-30'}],
  ['posterior a la revisión',{...price,observedAt:'2026-11-20'}],['caducado',{...price,observedAt:'2026-08-01'}],
 ])('rechaza precios %s',(_,p)=>expect(()=>parseArticle(make({...tech,kind:'compra',prices:[p]},['game']),'t',today)).toThrow(/precio/i));
 it('una guía de compra sin precios no se publica',()=>expect(()=>parseArticle(make({...tech,kind:'compra'},['game']),'t',today)).toThrow(/precios/));
 it('muestra la declaración, los juegos y los precios con mercado y fecha',()=>{
  const a=parseArticle(make({...tech,kind:'compra',prices:[price]},['game']),'t',today);
  const html=articleBody(a,[a]);
  expect(html).toContain('No hemos probado estos dispositivos');expect(html).toContain('Fortnite');
  expect(html).toContain('href="/tecnologia/"');expect(html).toContain('Precios observados');
  expect(html).toMatch(/199[,.]00\s?US\$|US\$\s?199/);expect(html).toContain('data-label="Mercado">PA</td>');expect(html).toContain('datetime="2026-11-10"');
  expect(html).not.toContain('undefined');expect(card(a)).toContain('Tecnología');
 });
});
describe('borradores y diagramas VX-ED-004',()=>{
 it('los borradores quedan fuera salvo que se pidan explícitamente',async()=>{
  const published=await loadArticles();const all=await loadArticles(undefined,{includeDrafts:true});
  expect(published.every(a=>a.status==='published')).toBe(true);
  expect(all.length).toBeGreaterThan(published.length);
  for(const a of all.filter(a=>a.status==='draft')){expect(a.section).toBeDefined();expect(a.games?.length).toBeGreaterThan(0);}
 });
 it('los borradores de tecnología declaran que no hubo prueba propia',async()=>{
  for(const a of (await loadArticles(undefined,{includeDrafts:true})).filter(a=>a.section==='tecnologia'))expect(a.handsOn).toBe(false);
 });
 it('etiqueta las celdas de las tablas para mostrarlas como fichas en móvil',()=>{
  const html=labelTables(markdown.render('| Modelo | Juego <b> |\n|---|---|\n| A | **sí** |'));
  expect(html).toContain('<table class="stack">');expect(html).toContain('<td data-label="Modelo">A</td>');expect(html).toContain('data-label="Juego &lt;b&gt;"');expect(html).not.toContain('<b>');
 });
 it('renderiza un diagrama de pasos accesible y escapa su contenido',()=>{
  const html=markdown.render('```flujo\n# Ciclo <térmico>\nCalor | El chip <b>sube</b>\nLímite | Baja la frecuencia\n```');
  expect(html).toContain('<figure class="flow-chart"><figcaption>Ciclo &lt;térmico&gt;</figcaption><ol>');
  expect(html.match(/<li>/g)).toHaveLength(2);expect(html).not.toContain('<b>');
  expect(()=>markdown.render('```flujo\nsin título\nA | b\n```')).toThrow(/Diagrama/);
  expect(()=>markdown.render('```flujo\n# T\nsolo un paso | x\n```')).toThrow(/Diagrama/);
 });
});
describe('retirada y protección por host',()=>{
 const ctx=(url:string)=>({request:new Request(url),next:async()=>new Response('normal'),env:{ASSETS:{fetch:async()=>new Response('<h1>Retirado</h1>',{headers:{'Content-Type':'text/html'}})}}});
 it.each(retired)('devuelve 410 sin redirección para %s',async(path)=>{
  for(const suffix of ['','/','.html']){const r=await onRequest(ctx(`https://velixblue.com${path}${suffix}`));expect(r.status).toBe(410);expect(r.headers.get('x-robots-tag')).toContain('noindex');expect(await r.text()).toContain('Retirado');}
 });
 it('retira modelos y runtimes sin resucitar el servicio',async()=>{for(const path of ['/models/u2netp.onnx','/ocr/worker.js','/ort/runtime.wasm'])expect((await onRequest(ctx('https://velixblue.com'+path))).status).toBe(410);});
 it('no bloquea las páginas actuales y protege alias',async()=>{
  const live=await onRequest(ctx('https://velixblue.com/juegos/'));expect(live.status).toBe(200);expect(live.headers.get('x-robots-tag')).toBeNull();
  const preview=await onRequest(ctx('https://preview.pages.dev/juegos/'));expect(preview.headers.get('x-robots-tag')).toContain('noindex');
  expect(await (await onRequest(ctx('https://preview.pages.dev/robots.txt'))).text()).toContain('Disallow: /');
 });
});

describe('actualización y accesibilidad visual',()=>{
 it('mantiene contraste de texto normal y acentos sobre cada superficie',()=>{
  const luminance=(hex:string)=>{const rgb=hex.replace('#','').match(/../g)!.map(v=>parseInt(v,16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  for(const t of Object.values(themes))for(const fg of ['#f4f2ec','#bab8b0',t.accent])for(const bg of [t.background,t.surface]){const a=luminance(fg),b=luminance(bg);expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toBeGreaterThanOrEqual(4.5);}
 });
 it('el retiro del SW limpia solo cachés de Vélix y se desregistra',async()=>{
  const {runInNewContext}=await import('node:vm');const callbacks:Record<string,Function>={};const removed:string[]=[];const events:string[]=[];let finished:Promise<unknown>;
  const self={addEventListener:(name:string,fn:Function)=>callbacks[name]=fn,skipWaiting:()=>events.push('skip'),clients:{claim:async()=>events.push('claim')},registration:{unregister:async()=>events.push('unregister')}};
  runInNewContext(readFileSync('public/sw.js','utf8'),{self,caches:{keys:async()=>['velix-shell-old','velix-ai-old','pixeltools-legacy','another-app'],delete:async(name:string)=>removed.push(name)}});
  callbacks.install();callbacks.activate({waitUntil:(p:Promise<unknown>)=>finished=p});await finished!;
  expect(removed).toEqual(['velix-shell-old','velix-ai-old','pixeltools-legacy']);expect(events).toEqual(['skip','claim','unregister']);
 });
});

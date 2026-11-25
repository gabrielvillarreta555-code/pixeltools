import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseArticle, loadArticles, markdown } from '../scripts/editorial/content.mjs';
import { themes, retired, siteConfig } from '../scripts/editorial/themes.mjs';
import { jsonLd } from '../scripts/editorial/template.mjs';
import { searchItems } from '../public/editorial/search.js';
import { onRequest } from '../functions/_middleware';
const source=readFileSync('content/juegos/01-roblox-280.md','utf8');
describe('publicación editorial',()=>{
 it('conserva las diez URLs originales y las lecturas destacadas en tres juegos',async()=>{
  const all=await loadArticles(); expect(all).toHaveLength(19);
  for(const file of execFileSync('git',['ls-tree','-r','--name-only','fa39de5','content/juegos'],{encoding:'utf8'}).trim().split('\n')){
   const old=JSON.parse(execFileSync('git',['show',`fa39de5:${file}`],{encoding:'utf8'}).split('---')[1]);
   expect(all.some(a=>a.path===`/juegos/${old.game}/${old.slug}`)).toBe(true);
  }
  for(const [game, count] of Object.entries({'gta-vi': 2, 'free-fire': 2, 'clash-royale': 5})) {
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

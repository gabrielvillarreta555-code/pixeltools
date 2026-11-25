import assert from 'node:assert/strict';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { chromium,firefox } from 'playwright';
import { loadArticles } from '../scripts/editorial/content.mjs';
import { themes,retired } from '../scripts/editorial/themes.mjs';
const base=process.env.E2E_BASE_URL||'http://localhost:4333';
const articles=await loadArticles();const routes=JSON.parse(await readFile('dist/editorial/routes.json','utf8'));
const engine=process.env.E2E_BROWSER==='firefox'?firefox:chromium;
const browser=await engine.launch();const errors=[];const metrics={};
await mkdir('docs/vx-003/capturas',{recursive:true});
try{
 const nojs=await browser.newContext({javaScriptEnabled:false});const page=await nojs.newPage();
 for(const r of routes){
  const response=await page.goto(base+r.path);assert.equal(response.status(),200,r.path);
  assert.equal(await page.locator('h1').count(),1,r.path);
  const a=articles.find(a=>a.path===r.path);if(a){assert.equal(await page.locator('.direct-answer p').innerText(),a.answer);assert.ok(await page.locator('.sources a').count());assert.equal((await page.locator('.prose').innerText()).includes('Fuentes y revisión'),true);}
  assert.equal(await page.locator('a[href="/herramientas"]').count(),0);
 }
 await nojs.close();
 const context=await browser.newContext({viewport:{width:390,height:844}});const p=await context.newPage();
 p.on('pageerror',err=>errors.push(err.message));p.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
 const network=[];p.on('request',r=>network.push(r.url()));
 await p.goto(base+'/');
 await p.locator('.search summary').click();await p.getByLabel('Buscar noticias y guías').fill('coordenadas');await p.locator('#search-results a').first().waitFor();assert.equal(await p.locator('#search-results a').count(),1);
 await p.locator('#search-results a').first().click();await p.locator('.direct-answer').waitFor();
 await p.locator('.search summary').click();await p.getByLabel('Buscar noticias y guías').fill('compresor');await p.getByText('Sin resultados.',{exact:false}).waitFor();
 await p.getByRole('button',{name:'Limpiar',exact:true}).click();assert.equal(await p.locator('#search').inputValue(),'');
 await p.goto(base+'/');await p.keyboard.press('Tab');assert.equal(await p.locator('.skip').evaluate(e=>e===document.activeElement),true);await p.keyboard.press('Enter');assert.ok(p.url().endsWith('#contenido'));
 const captures=['/','/juegos/',...Object.keys(themes).map(id=>`/juegos/${id}/`),'/noticias/','/actualizaciones/','/estrategias/','/guias/',articles.find(a=>a.id==='11-gta-lanzamiento').path];
 for(const width of [390,1440]){
  await p.setViewportSize({width,height:900});
  for(const path of captures){
   await p.goto(base+path);await p.evaluate(()=>document.fonts.ready);
   // Load lazy images before screenshots and check actual decoding.
   await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}scrollTo(0,0);});
   await p.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
   await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const themeId=Object.keys(themes).find(id=>path===`/juegos/${id}/`);
   if(themeId)assert.equal(await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()),themes[themeId].accent,'theme accent must override neutral palette');
   for(const img of await p.locator('.story-grid .story img').all()){const box=await img.boundingBox();if(box)assert.ok(box.height<box.width*1.2,`card image ratio ${path}`);}
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${path} ${width}`);
   if(engine===chromium){const name=path==='/'?'inicio':path.replace(/^\//,'').replaceAll('/','-').replace(/-$/,'');await p.screenshot({path:`docs/vx-003/capturas/${name}-${width}.jpg`,fullPage:true,type:'jpeg',quality:72});}
  }
 }
 for(const width of [320,768]){await p.setViewportSize({width,height:850});for(const path of ['/','/juegos/clash-royale/',articles[0].path]){await p.goto(base+path);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${path} ${width}`);}}
 await p.goto(base+'/');
 metrics.navigation=await p.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return{domContentLoadedMs:Math.round(n.domContentLoadedEventEnd),transferBytes:n.transferSize,resources:performance.getEntriesByType('resource').length};});
 assert.ok(!network.some(url=>/\/(models|ort|ocr)\//.test(url)),'legacy runtime requested');
 assert.deepEqual(errors,[]);
 await context.close();
 const status=await browser.newContext();
 for(const path of [...retired,...retired.map(p=>p+'.html'),...retired.map(p=>p+'/'),'/models/u2netp.onnx']){const r=await status.request.get(base+path);assert.equal(r.status(),410,path);assert.match(r.headers()['x-robots-tag'],/noindex/);assert.match(await r.text(),/Contenido retirado/);}
 assert.equal((await status.request.get(base+'/no-existe-vx003')).status(),404);
 await status.close();
 console.log(`${engine===chromium?'Chromium':'Firefox'}: 32 rutas sin JS, 16 artículos, búsqueda, teclado, 4 anchos, 26 capturas (Chromium), imágenes, 410 y 404: OK.`);
 console.log(JSON.stringify(metrics));
 if(engine===chromium)await writeFile('docs/vx-003/browser-metrics.json',JSON.stringify({environment:'Playwright, servidor local; no métricas de campo',...metrics},null,2)+'\n');
}finally{await browser.close();}

// Diagnostic deliberately remains red when hosting injects extra telemetry.
// It does not whitelist Cloudflare, hide requests or claim image-data leakage.
import { chromium } from 'playwright';
const base=process.env.E2E_BASE_URL||'https://velixblue.com';
const browser=await chromium.launch();const page=await browser.newPage();const unexpected=[];
page.on('request',r=>{if(!/^https?:/.test(r.url()))return;if(r.method()!=='GET'||new URL(r.url()).origin!==new URL(base).origin){let keys=[];try{keys=Object.keys(JSON.parse(r.postData()||'{}'));}catch{}unexpected.push({method:r.method(),url:r.url().split('?')[0],bytes:r.postDataBuffer()?.length||0,keys});}});
try{await page.goto(base+'/');await page.waitForTimeout(2500);await page.goto(base+'/juegos/');await page.waitForTimeout(1500);}finally{await browser.close();}
console.log(JSON.stringify({base,unexpected},null,2));
if(unexpected.length){console.error('PENDIENTE: la afirmación de ausencia total de solicitudes adicionales no se cumple. Revisar alojamiento; no se prueba filtración de archivos.');process.exitCode=1;}else console.log('No se observaron solicitudes adicionales durante esta muestra; no equivale a una auditoría exhaustiva de privacidad.');

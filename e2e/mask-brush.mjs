// Prueba independiente del pincel sobre el build local. No usa imágenes personales.
import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFile } from 'node:fs/promises';

const server = await preview({ logLevel: 'silent', preview: { port: 4322, strictPort: true } });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
const page = await context.newPage();
const check = (ok, label) => { if (!ok) throw new Error(label); console.log(`✓ ${label}`); };
try {
  await page.goto(`${server.resolvedUrls.local[0]}eliminar-fondo`);
  const bytes = await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 800; c.height = 600; const x = c.getContext('2d');
    x.fillStyle = '#76b476'; x.fillRect(0, 0, 800, 600); x.fillStyle = '#ba3030'; x.beginPath(); x.ellipse(400, 300, 210, 240, 0, 0, 2 * Math.PI); x.fill();
    // Un sector semitransparente comprueba que restaurar no acumule alfa.
    x.clearRect(480, 280, 40, 40); x.fillStyle = 'rgba(186,48,48,0.5)'; x.fillRect(480, 280, 40, 40);
    const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await page.locator('input[type=file]').first().setInputFiles({ name: 'sintetica.png', mimeType: 'image/png', buffer: Buffer.from(bytes) });
  await page.getByRole('button', { name: 'Eliminar fondo', exact: true }).click();
  await page.getByRole('button', { name: 'Descargar PNG' }).waitFor({ timeout: 180_000 });
  await page.getByRole('button', { name: 'Corregir bordes con pincel' }).click();
  const canvas = page.getByRole('application', { name: 'Lienzo para corregir la máscara' });
  await page.getByRole('button', { name: 'Aplicar corrección' }).waitFor({ state: 'visible' });
  await page.waitForFunction(() => { const c = document.querySelector('canvas[role=application]'); return c && c.width === 800 && c.height === 600; });
  const alpha = () => canvas.evaluate(c => c.getContext('2d').getImageData(400, 300, 1, 1).data[3]);
  check(await alpha() > 220, 'el sujeto original es visible en el centro');
  const tapCenter = async () => { const box = await canvas.boundingBox(); await canvas.tap({ position: { x: box.width / 2, y: box.height / 2 } }); };
  await tapCenter();
  check(await alpha() < 10, 'el pincel táctil borra una zona visible');
  await page.getByRole('button', { name: 'Deshacer última pincelada' }).click();
  check(await alpha() > 220, 'deshacer recupera el estado anterior de la máscara');
  await tapCenter();
  await page.getByLabel('Restaurar', { exact: true }).check();
  await tapCenter();
  check(await alpha() > 220, 'restaurar recupera los píxeles de la imagen original');
  const transparentAlpha = () => canvas.evaluate(c => c.getContext('2d').getImageData(500, 300, 1, 1).data[3]);
  const box = await canvas.boundingBox();
  await canvas.tap({ position: { x: box.width * 500 / 800, y: box.height / 2 } });
  const firstRestore = await transparentAlpha();
  await canvas.tap({ position: { x: box.width * 500 / 800, y: box.height / 2 } });
  const secondRestore = await transparentAlpha();
  check(firstRestore >= 125 && firstRestore <= 130 && secondRestore >= 125 && secondRestore <= 130, `restaurar conserva el alfa original sin acumular (${firstRestore}, ${secondRestore})`);
  await tapCenter();
  await page.getByLabel('Borrar', { exact: true }).check();
  await canvas.focus(); await page.keyboard.press('ArrowRight');
  check((await page.locator('p.sr-only[role=status]').innerText()).includes('Cursor:'), 'el teclado anuncia la posición para lectores de pantalla');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Enter');
  check(await alpha() < 10, 'el pincel también funciona con teclado');
  await page.getByRole('button', { name: 'Aplicar corrección' }).click();
  const downloadButton = page.getByRole('button', { name: 'Descargar PNG' });
  await downloadButton.waitFor({ state: 'visible' });
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('button')].find(el => el.textContent?.includes('Descargar PNG')); return b && !b.disabled; });
  const downloading = page.waitForEvent('download'); await downloadButton.click(); const file = await downloading;
  const png = await readFile(await file.path());
  const resultAlpha = await page.evaluate(async data => { const img = await createImageBitmap(new Blob([new Uint8Array(data)], { type: 'image/png' })); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const a = x.getImageData(400, 300, 1, 1).data[3]; img.close(); return a; }, [...png]);
  check(resultAlpha < 10, `la corrección se conserva en el PNG descargado (alfa=${resultAlpha})`);
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'sin desplazamiento horizontal en móvil');
} finally { await context.close(); await browser.close(); await server.close(); }

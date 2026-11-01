// Prueba la zona real enviada al OCR con una imagen sintética, sin datos privados.
import { chromium } from 'playwright';
import { preview } from 'vite';

const server = await preview({ logLevel: 'silent', preview: { port: 4461, strictPort: true } });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let failed = false;
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const requests = [];
  page.on('request', r => { if (/^https?:/.test(r.url())) requests.push({ method: r.method(), origin: new URL(r.url()).origin }); });
  await page.goto(`${base}/extraer-texto`);
  const image = await page.evaluate(async () => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 600;
    const c = canvas.getContext('2d'); c.fillStyle = 'white'; c.fillRect(0, 0, 1200, 600); c.fillStyle = 'black'; c.font = 'bold 76px Arial';
    c.fillText('SUPERIOR 111', 80, 150); c.fillText('INFERIOR 222', 80, 480);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await page.locator('input[type=file]').first().setInputFiles({ name: 'documento-prueba.png', mimeType: 'image/png', buffer: Buffer.from(image) });
  const area = page.getByRole('group', { name: /Área para leer/ });
  await area.waitFor();
  if (!/1200 × 600/.test(await area.getAttribute('aria-label'))) throw new Error('Área inicial incorrecta');
  await page.getByRole('button', { name: 'Girar derecha' }).click();
  if (!/600 × 1200/.test(await area.getAttribute('aria-label'))) throw new Error('El giro no intercambia dimensiones');
  await page.getByRole('button', { name: 'Girar izquierda' }).click();
  if (!/1200 × 600/.test(await area.getAttribute('aria-label'))) throw new Error('El giro inverso no recupera dimensiones');
  await area.scrollIntoViewIfNeeded();
  const corner = await area.locator('span').first().boundingBox(), box = await area.boundingBox();
  if (!corner || !box) throw new Error('No se ve el control de recorte');
  // Simula el arrastre de la esquina superior izquierda hasta excluir la línea superior.
  await page.mouse.move(corner.x + corner.width / 2, corner.y + corner.height / 2);
  await page.mouse.down(); await page.mouse.move(corner.x + corner.width / 2, corner.y + corner.height / 2 + box.height * 0.45, { steps: 8 }); await page.mouse.up();
  const selected = await area.getAttribute('aria-label');
  if (/1200 × 600/.test(selected)) throw new Error(`No cambió el área al arrastrar: ${selected}`);
  await page.getByRole('button', { name: 'Extraer texto' }).click();
  const output = page.locator('#ocr-result'); await output.waitFor({ timeout: 180000 });
  const text = await output.inputValue();
  if (!/INFERIOR\s+222/i.test(text) || /SUPERIOR/i.test(text)) throw new Error('El OCR no respetó el área seleccionada');
  await page.getByRole('button', { name: 'Imagen completa' }).click();
  if (await output.count()) throw new Error('El texto anterior permaneció al cambiar el recorte');
  await area.focus();
  await page.keyboard.press('Shift+ArrowLeft');
  if (/1200 × 600/.test(await area.getAttribute('aria-label'))) throw new Error('El recorte no responde al teclado');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Desbordamiento horizontal móvil');

  // Texto girado realmente en la imagen; se corrige antes de enviar al OCR.
  await page.getByRole('button', { name: 'Otra imagen' }).click();
  await page.setViewportSize({ width: 320, height: 740 });
  const sideways = await page.evaluate(async () => {
    const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 1200;
    const c = canvas.getContext('2d'); c.fillStyle = 'white'; c.fillRect(0, 0, 600, 1200);
    c.translate(600, 0); c.rotate(Math.PI / 2); c.fillStyle = 'black'; c.font = 'bold 76px Arial';
    c.fillText('SUPERIOR 111', 80, 150); c.fillText('INFERIOR 222', 80, 480);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await page.locator('input[type=file]').first().setInputFiles({ name: 'texto-girado.png', mimeType: 'image/png', buffer: Buffer.from(sideways) });
  await area.waitFor(); await page.getByRole('button', { name: 'Girar izquierda' }).click();
  if (!/1200 × 600/.test(await area.getAttribute('aria-label'))) throw new Error('El giro de la imagen vertical no se aplicó');
  await area.scrollIntoViewIfNeeded();
  const touchCorner = await area.locator('span').first().boundingBox(), touchBox = await area.boundingBox();
  if (!touchCorner || !touchBox) throw new Error('No hay control táctil');
  const x = touchCorner.x + touchCorner.width / 2, y = touchCorner.y + touchCorner.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + touchBox.height * 0.45, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  if (/1200 × 600/.test(await area.getAttribute('aria-label'))) throw new Error('El recorte no responde al tacto');
  await page.getByRole('button', { name: 'Extraer texto' }).click(); await output.waitFor({ timeout: 180000 });
  const rotatedText = await output.inputValue();
  if (!/INFERIOR\s+222/i.test(rotatedText) || /SUPERIOR/i.test(rotatedText)) throw new Error('El OCR no recibió la imagen girada y recortada');
  const boundedCanvas = await page.locator('canvas[aria-label="Vista previa de la imagen seleccionada"]').evaluate(c => c.width <= 2048 && c.height <= 2048 && c.width * c.height <= 4_000_000);
  if (!boundedCanvas) throw new Error('El lienzo supera el límite de la imagen preparada');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Desbordamiento horizontal a 320 px');
  if (!requests.every(r => r.method === 'GET' && r.origin === new URL(base).origin)) throw new Error('Solicitud externa inesperada');
  console.log('OCR: giro y recorte reales, tacto, 320/375 px, teclado, límites y privacidad: OK');
} catch (error) { failed = true; console.error(error); }
finally { await browser.close(); await server.close(); }
if (failed) process.exitCode = 1;

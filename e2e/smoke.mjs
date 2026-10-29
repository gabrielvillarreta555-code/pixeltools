// Prueba de humo E2E sobre el build de producción (Chromium + Playwright).
//
//   npm run build && npm run test:e2e
//
// Arranca `vite preview` sobre dist/, genera las imágenes de prueba en el propio
// navegador y recorre compresor, eliminador de fondos, PWA sin conexión y móvil.
// E2E_REPEAT=n repite la batería completa n veces para detectar inestabilidad y
// E2E_ONLY=escenario1,escenario2 limita la ejecución a esos escenarios y
// E2E_BASE_URL=https://… prueba un sitio ya desplegado (o `wrangler pages dev`)
// en lugar de arrancar `vite preview`.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { preview } from 'vite';

const REPEAT = Number(process.env.E2E_REPEAT || 1);
const failures = [];
const log = (message) => console.log(`  ${message}`);

function check(condition, message) {
  if (condition) log(`✓ ${message}`);
  else {
    failures.push(message);
    log(`✗ ${message}`);
  }
}

const BASE_URL = process.env.E2E_BASE_URL?.replace(/\/$/, '');

if (!BASE_URL && !existsSync('dist/sw.js')) {
  console.error('Falta dist/. Ejecuta primero `npm run build`.');
  process.exit(1);
}

// ---------- utilidades ----------

/** Genera las imágenes de prueba con Canvas para no depender de archivos binarios. */
async function createFixtures(browser) {
  const page = await browser.newPage();
  const data = await page.evaluate(async () => {
    const toBase64 = async (canvas, type, quality) => {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(binary);
    };
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // Fotografía con ruido (comprime de forma realista): 3000 × 2000.
    const photo = document.createElement('canvas');
    photo.width = 3000;
    photo.height = 2000;
    let context = photo.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 2000);
    gradient.addColorStop(0, '#202020');
    gradient.addColorStop(1, '#e0e0e0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 3000, 2000);
    const noise = context.getImageData(0, 0, 3000, 2000);
    for (let i = 0; i < noise.data.length; i += 4) {
      const n = (random() - 0.5) * 60;
      noise.data[i] += n;
      noise.data[i + 1] += n;
      noise.data[i + 2] += n;
    }
    context.putImageData(noise, 0, 0);
    context.fillStyle = '#c83c3c';
    context.beginPath();
    context.ellipse(1500, 1100, 600, 600, 0, 0, Math.PI * 2);
    context.fill();

    // PNG con transparencia: 1200 × 800.
    const transparent = document.createElement('canvas');
    transparent.width = 1200;
    transparent.height = 800;
    context = transparent.getContext('2d');
    context.fillStyle = '#1e78dc';
    context.fillRect(200, 150, 800, 500);
    context.fillStyle = 'rgba(255,255,255,0.5)';
    context.beginPath();
    context.ellipse(600, 400, 200, 150, 0, 0, Math.PI * 2);
    context.fill();

    // Silueta sobre fondo con textura para el eliminador: 1600 × 1200.
    const subject = document.createElement('canvas');
    subject.width = 1600;
    subject.height = 1200;
    context = subject.getContext('2d');
    context.fillStyle = '#78b478';
    context.fillRect(0, 0, 1600, 1200);
    context.lineWidth = 3;
    for (let i = 0; i < 300; i += 1) {
      context.strokeStyle = `rgb(${100 + random() * 40},${160 + random() * 40},100)`;
      context.beginPath();
      context.moveTo(random() * 1600, random() * 1200);
      context.lineTo(random() * 1600, random() * 1200);
      context.stroke();
    }
    context.fillStyle = '#e6bea0';
    context.beginPath();
    context.ellipse(800, 400, 150, 150, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#283ca0';
    context.beginPath();
    context.roundRect(560, 520, 480, 700, 120);
    context.fill();

    // PNG diminuto de un solo color: cualquier JPG resultante pesa más.
    const tiny = document.createElement('canvas');
    tiny.width = 16;
    tiny.height = 16;
    context = tiny.getContext('2d');
    context.fillStyle = '#2563eb';
    context.fillRect(0, 0, 16, 16);

    return {
      tiny: await toBase64(tiny, 'image/png'),
      photo: await toBase64(photo, 'image/jpeg', 0.95),
      transparent: await toBase64(transparent, 'image/png'),
      subject: await toBase64(subject, 'image/jpeg', 0.92),
    };
  });
  await page.close();
  const file = (name, mimeType, base64) => ({ name, mimeType, buffer: Buffer.from(base64, 'base64') });
  return {
    photo: (name = 'foto.jpg') => file(name, 'image/jpeg', data.photo),
    transparent: file('transparente.png', 'image/png', data.transparent),
    tiny: file('icono.png', 'image/png', data.tiny),
    subject: file('sujeto.jpg', 'image/jpeg', data.subject),
    svg: { name: 'vector.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>') },
    fakePng: { name: 'falso.png', mimeType: 'image/png', buffer: Buffer.from('no es un png') },
  };
}

/** Decodifica una imagen descargada dentro del navegador y devuelve sus datos básicos. */
async function inspectImage(page, buffer) {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes]));
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
    let alphaMin = 255;
    let alphaMax = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < alphaMin) alphaMin = pixels[i];
      if (pixels[i] > alphaMax) alphaMax = pixels[i];
    }
    const corner = Array.from(pixels.subarray(0, 3));
    return { width: bitmap.width, height: bitmap.height, alphaMin, alphaMax, corner };
  }, buffer.toString('base64'));
}

function zipEntries(buffer) {
  const end = buffer.length - 22;
  if (buffer.readUInt32LE(end) !== 0x06054b50) return null;
  const count = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  const names = [];
  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) return null;
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extra = buffer.readUInt16LE(offset + 30);
    const comment = buffer.readUInt16LE(offset + 32);
    names.push(buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8'));
    offset += 46 + nameLength + extra + comment;
  }
  return names;
}

async function download(page, trigger) {
  const [file] = await Promise.all([page.waitForEvent('download'), trigger()]);
  return { name: file.suggestedFilename(), buffer: await readFile(await file.path()) };
}

const enabledButton = (page, name) => page.locator('button:not([disabled])', { hasText: name });

async function throttleCpu(page, rate) {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate });
}

async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

// ---------- escenarios ----------

async function compressorBatch(browser, base, fx) {
  console.log('Compresor por lotes');
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.goto(`${base}/comprimir-imagen`);
  await page.locator('input[type=file]').first().setInputFiles([fx.photo(), fx.photo('foto-copia.jpg'), fx.transparent, fx.svg, fx.fakePng]);
  check(await page.getByText('vector.svg: Formato no compatible').isVisible(), 'rechaza el SVG con un mensaje accesible');
  check(await page.getByText('4 imágenes en el lote').isVisible(), 'acepta 4 archivos en el lote');

  await page.selectOption('#output-format', 'image/webp');
  await page.selectOption('#resize', '1920');
  await page.getByRole('button', { name: 'Comprimir 4 imágenes' }).click();
  await enabledButton(page, 'Descargar 3 imágenes (ZIP)').waitFor({ timeout: 60_000 });
  check(await page.getByText(/No se pudo leer la imagen/).isVisible(), 'marca el PNG dañado como error sin detener el lote');
  check(await page.getByText('3000 × 2000 → 1920 × 1280 px').isVisible(), 'redimensiona al lado mayor indicado');
  // Cada nombre del ZIP debe coincidir con la etiqueta de su fila: «comprimida»
  // solo si el resultado pesa menos que el original.
  const rows = await page.locator('ul[aria-label="Imágenes del lote"] li').allInnerTexts();
  const expected = rows
    .filter((row) => /[−+]\d/.test(row))
    .map((row) => `${row.split('\n')[0].replace(/\.[^.]+$/, '')}-${row.includes('−') ? 'comprimida' : 'convertida'}.webp`);
  const zip = await download(page, () => enabledButton(page, 'Descargar 3 imágenes (ZIP)').click());
  const names = zipEntries(zip.buffer);
  check(zip.name === 'pixeltools-imagenes.zip' && names?.length === 3, `ZIP válido con 3 archivos (${names?.join(', ')})`);
  check(JSON.stringify(names) === JSON.stringify(expected), 'los nombres del ZIP coinciden con la reducción real de cada imagen');

  const single = await download(page, () => page.getByRole('button', { name: 'Descargar foto-comprimida.webp' }).click());
  const info = await inspectImage(page, single.buffer);
  check(info.width === 1920 && info.height === 1280, 'descarga individual con las dimensiones correctas');

  await page.selectOption('#resize', 'custom');
  await page.fill('#custom-side', '5');
  check(await page.getByRole('button', { name: 'Comprimir 4 imágenes' }).isDisabled(), 'bloquea un tamaño personalizado inválido');
  await context.close();
}

async function compressorCancel(browser, base, fx) {
  console.log('Compresor: cancelación y reinicio (390 px)');
  // A 390 px todo está en una columna: cualquier cambio de altura durante el
  // lote desplazaría el botón de cancelar.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/comprimir-imagen`);
  await page.locator('input[type=file]').first().setInputFiles(
    Array.from({ length: 6 }, (_, index) => fx.photo(`foto-${index + 1}.jpg`)),
  );
  await page.evaluate(() => {
    // Registra la posición del botón en cada fotograma.
    window.__cancelTops = [];
    const sample = () => {
      const button = [...document.querySelectorAll('button')].find((element) => element.textContent.includes('Cancelar operación'));
      if (button) window.__cancelTops.push(Math.round(button.getBoundingClientRect().top + window.scrollY));
      window.__sampler = requestAnimationFrame(sample);
    };
    sample();
  });
  // CPU más lenta: la cancelación ocurre siempre con el lote en marcha.
  await throttleCpu(page, 8);
  await page.getByRole('button', { name: 'Comprimir 6 imágenes' }).click();
  const cancel = page.getByRole('button', { name: 'Cancelar operación' });
  await page.getByText(/Imagen 3 de 6/).waitFor({ timeout: 60_000 });
  const tops = await page.evaluate(() => {
    cancelAnimationFrame(window.__sampler);
    return window.__cancelTops;
  });
  const spread = Math.max(...tops) - Math.min(...tops);
  check(tops.length > 0 && spread <= 2, `el botón de cancelar no se desplaza durante el lote (variación ${spread} px)`);
  await cancel.click();
  await enabledButton(page, /Procesar \d restantes/).waitFor({ timeout: 30_000 });
  check(await page.getByText('Operación cancelada').count() === 1, 'anuncia la cancelación');
  check(await cancel.count() === 0, 'la cancelación detiene el lote y conserva las imágenes pendientes');
  await throttleCpu(page, 1);
  await page.getByRole('button', { name: 'Empezar de nuevo' }).click();
  check(await page.getByText('Arrastra tus imágenes aquí').isVisible(), 'el reinicio vuelve a la zona de subida');

  await page.locator('input[type=file]').first().setInputFiles(fx.tiny);
  await page.selectOption('#output-format', 'image/jpeg');
  check(await page.getByText('JPG no admite transparencia').isVisible(), 'avisa de que JPG rellena la transparencia en blanco');
  await page.getByRole('button', { name: 'Comprimir ahora' }).click();
  await page.getByRole('button', { name: 'Descargar resultado JPG' }).waitFor({ timeout: 30_000 });
  check(await page.getByText('más peso · no se considera comprimida').isVisible(), 'no llama «comprimida» a un resultado más pesado');
  await page.close();
}

async function backgroundRemover(browser, base, fx) {
  console.log('Eliminador de fondos y PWA');
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.goto(`${base}/eliminar-fondo`);
  await page.locator('input[type=file]').setInputFiles(fx.subject);
  await page.getByRole('button', { name: 'Eliminar fondo' }).click();
  const downloadPng = enabledButton(page, 'Descargar PNG');
  await downloadPng.waitFor({ timeout: 120_000 });

  let file = await download(page, () => downloadPng.click());
  let info = await inspectImage(page, file.buffer);
  check(file.name === 'sujeto-sin-fondo.png' && info.alphaMin === 0 && info.alphaMax === 255, `PNG transparente con alfa 0–255 (${info.width} × ${info.height})`);

  await page.getByText('Recortar al sujeto').click();
  await page.locator('figcaption', { hasText: /PNG transparente\s*(?!1600 × 1200)\d+ × \d+/ }).waitFor();
  file = await download(page, () => downloadPng.click());
  info = await inspectImage(page, file.buffer);
  check(info.width < 1600 && info.height < 1200 && info.alphaMax === 255, `recorte al sujeto (${info.width} × ${info.height})`);

  // Teclado: las flechas mueven la selección del grupo de fondos.
  await page.getByRole('radio', { name: 'Transparente' }).focus();
  await page.keyboard.press('ArrowRight');
  check(await page.getByRole('radio', { name: 'Color' }).isChecked(), 'el grupo de fondos se maneja con el teclado');
  await page.getByRole('button', { name: 'Fondo azul' }).click();
  await page.selectOption('#export-type', 'image/jpeg');
  await page.locator('figcaption', { hasText: 'JPG con fondo' }).waitFor();
  file = await download(page, () => enabledButton(page, 'Descargar JPG').click());
  info = await inspectImage(page, file.buffer);
  const [r, g, b] = info.corner;
  check(file.name.endsWith('.jpg') && b > 200 && r < 60 && g < 120, `JPG con fondo de color (esquina rgb ${info.corner.join(',')})`);

  await page.getByText('Desenfocado', { exact: true }).click();
  await page.getByText('Recortar al sujeto').click();
  await page.locator('figcaption', { hasText: /JPG con fondo\s*1600 × 1200/ }).waitFor();
  file = await download(page, () => enabledButton(page, 'Descargar JPG').click());
  info = await inspectImage(page, file.buffer);
  check(info.width === 1600 && Math.abs(info.corner[1] - 180) < 30, `fondo desenfocado a partir del original (esquina rgb ${info.corner.join(',')})`);

  const state = await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    const names = await caches.keys();
    const ai = names.find((name) => name.startsWith('pixeltools-ai'));
    const cached = ai ? (await (await caches.open(ai)).keys()).map((request) => new URL(request.url).pathname) : [];
    return { controlled: Boolean(navigator.serviceWorker.controller), cached, isolated: crossOriginIsolated };
  });
  check(state.controlled && state.isolated, 'service worker activo y página aislada (COOP/COEP)');
  check(state.cached.length === 3, `modelo y runtime guardados tras el primer uso (${state.cached.join(', ')})`);

  await context.setOffline(true);
  await page.goto(`${base}/comprimir-imagen`);
  check(await page.getByText('Sin conexión.').isVisible(), 'muestra el aviso sin conexión');
  await page.locator('input[type=file]').first().setInputFiles(fx.photo());
  await page.getByRole('button', { name: 'Comprimir ahora' }).click();
  await page.getByRole('button', { name: 'Descargar imagen comprimida' }).waitFor({ timeout: 30_000 });
  log('✓ el compresor funciona sin conexión');
  await page.goto(`${base}/eliminar-fondo`);
  await page.locator('input[type=file]').setInputFiles(fx.subject);
  await page.getByRole('button', { name: 'Eliminar fondo' }).click();
  await enabledButton(page, 'Descargar PNG').waitFor({ timeout: 120_000 });
  log('✓ el eliminador funciona sin conexión tras el primer uso');
  await context.close();
}

async function mobile(browser, base, fx) {
  console.log('Móvil 390 px con CPU ralentizada ×4 (aproximación a gama media)');
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await throttleCpu(page, 4);
  await page.goto(`${base}/comprimir-imagen`);
  await page.locator('input[type=file]').first().setInputFiles([fx.photo(), fx.transparent]);
  let start = Date.now();
  await page.getByRole('button', { name: 'Comprimir 2 imágenes' }).click();
  await enabledButton(page, 'Descargar 2 imágenes (ZIP)').waitFor({ timeout: 120_000 });
  log(`· lote de 2 imágenes (6 MP + 1 MP): ${Date.now() - start} ms`);
  check(await horizontalOverflow(page) === 0, 'compresor sin desbordamiento horizontal a 390 px');

  await page.goto(`${base}/eliminar-fondo`);
  await page.locator('input[type=file]').setInputFiles(fx.subject);
  start = Date.now();
  await page.getByRole('button', { name: 'Eliminar fondo' }).click();
  await enabledButton(page, 'Descargar PNG').waitFor({ timeout: 180_000 });
  log(`· eliminación de fondo, primer uso con descarga del modelo: ${Date.now() - start} ms`);
  // Se pulsa justo cuando aparece el resultado: el diseño no debe moverse.
  await page.getByText('Color', { exact: true }).tap();
  start = Date.now();
  await page.locator('figcaption', { hasText: 'PNG con fondo' }).waitFor({ timeout: 30_000 });
  log(`· cambio a fondo de color: ${Date.now() - start} ms`);
  check(await horizontalOverflow(page) === 0, 'eliminador sin desbordamiento horizontal a 390 px');
  await context.close();
}

// ---------- ejecución ----------

const server = BASE_URL ? null : await preview({ logLevel: 'silent', preview: { port: 4317, strictPort: false } });
const base = BASE_URL || server.resolvedUrls.local[0].replace(/\/$/, '');
console.log(`Probando ${base}`);
const browser = await chromium.launch();
try {
  const fx = await createFixtures(browser);
  for (let round = 1; round <= REPEAT; round += 1) {
    if (REPEAT > 1) console.log(`\n=== Ronda ${round} de ${REPEAT} ===`);
    // E2E_ONLY=compressorCancel,mobile ejecuta solo esos escenarios.
    const only = process.env.E2E_ONLY?.split(',');
    const scenarios = [compressorBatch, compressorCancel, backgroundRemover, mobile].filter((scenario) => !only || only.includes(scenario.name));
    for (const scenario of scenarios) {
      try {
        await scenario(browser, base, fx);
      } catch (error) {
        failures.push(`${scenario.name}: ${error.message.split('\n')[0]}`);
        log(`✗ ${scenario.name} se interrumpió: ${error.message.split('\n')[0]}`);
      }
    }
  }
} finally {
  await browser.close();
  await server?.close();
}

if (failures.length) {
  console.error(`\n${failures.length} comprobaciones fallidas.`);
  process.exit(1);
}
console.log('\nTodas las comprobaciones E2E superadas.');

import * as ort from 'onnxruntime-web/wasm';
import { createBackdrop } from './composition';
import { findAlphaBounds, scaleBox, type Box } from './geometry';
import { canvasToBlob, decodeImage, ImageProcessingError, validateDimensions } from './imageProcessing';

const MODEL_SIZE = 320;
const MAX_SOURCE_PIXELS = 24_000_000;
const MAX_OUTPUT_PIXELS = 16_000_000;
const MAX_OUTPUT_SIDE = 4096;
const MODEL_URL = `${import.meta.env.BASE_URL}models/u2netp.onnx`;

export interface BackgroundProgress {
  message: string;
  percent: number;
}

export interface BackgroundRemovalOutput {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  resized: boolean;
  /** Zona ocupada por el sujeto en el resultado, útil para recortar. */
  subject: Box | null;
  /** Miniatura del original para el fondo desenfocado (unos pocos KB). */
  backdrop: Blob;
}

interface BackgroundOptions {
  signal?: AbortSignal;
  onProgress?: (progress: BackgroundProgress) => void;
}

let cachedSession: ort.InferenceSession | null = null;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Operación cancelada', 'AbortError');
}

function report(options: BackgroundOptions, message: string, percent: number) {
  options.onProgress?.({ message, percent });
}

async function fetchModel(options: BackgroundOptions): Promise<ArrayBuffer> {
  report(options, 'Descargando el modelo privado…', 4);
  const response = await fetch(MODEL_URL, { signal: options.signal, cache: 'force-cache' });
  if (!response.ok) {
    throw new ImageProcessingError('No se pudo cargar el modelo de eliminación. Comprueba tu conexión e inténtalo de nuevo.');
  }

  const total = Number(response.headers.get('content-length')) || 4_574_861;
  if (!response.body) return response.arrayBuffer();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.byteLength;
      report(options, 'Descargando el modelo privado…', 4 + Math.min(26, (received / total) * 26));
    }
  }

  const combined = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined.buffer;
}

async function getSession(options: BackgroundOptions): Promise<ort.InferenceSession> {
  if (cachedSession) {
    report(options, 'Modelo listo en este dispositivo', 30);
    return cachedSession;
  }
  if (!sessionPromise) {
    sessionPromise = (async () => {
      ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}ort/`;
      ort.env.wasm.numThreads = globalThis.crossOriginIsolated
        ? Math.min(2, Math.max(1, navigator.hardwareConcurrency || 1))
        : 1;
      const model = await fetchModel(options);
      throwIfAborted(options.signal);
      report(options, 'Iniciando el motor de IA…', 32);
      const created = await ort.InferenceSession.create(model, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
      });
      cachedSession = created;
      return created;
    })().catch((error) => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
}

function calculateOutputSize(width: number, height: number) {
  const scale = Math.min(
    1,
    MAX_OUTPUT_SIDE / Math.max(width, height),
    Math.sqrt(MAX_OUTPUT_PIXELS / (width * height)),
  );
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    resized: scale < 0.9999,
  };
}

function imageToTensor(source: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = MODEL_SIZE;
  canvas.height = MODEL_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new ImageProcessingError('Canvas no está disponible para preparar el modelo.');
  context.drawImage(source, 0, 0, MODEL_SIZE, MODEL_SIZE);
  const pixels = context.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE).data;
  const plane = MODEL_SIZE * MODEL_SIZE;
  const data = new Float32Array(plane * 3);
  const mean = [0.485, 0.456, 0.406];
  const deviation = [0.229, 0.224, 0.225];

  for (let pixel = 0; pixel < plane; pixel += 1) {
    const sourceOffset = pixel * 4;
    data[pixel] = (pixels[sourceOffset] / 255 - mean[0]) / deviation[0];
    data[plane + pixel] = (pixels[sourceOffset + 1] / 255 - mean[1]) / deviation[1];
    data[plane * 2 + pixel] = (pixels[sourceOffset + 2] / 255 - mean[2]) / deviation[2];
  }
  canvas.width = 0;
  canvas.height = 0;
  return new ort.Tensor('float32', data, [1, 3, MODEL_SIZE, MODEL_SIZE]);
}

function outputToMask(output: ort.Tensor): { canvas: HTMLCanvasElement; bounds: Box | null } {
  const dimensions = output.dims;
  const width = Number(dimensions.at(-1)) || MODEL_SIZE;
  const height = Number(dimensions.at(-2)) || MODEL_SIZE;
  const values = output.data;
  const length = width * height;
  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < length; index += 1) {
    const value = Number(values[index]);
    if (value < minimum) minimum = value;
    if (value > maximum) maximum = value;
  }

  const range = maximum - minimum;
  if (!Number.isFinite(range) || range <= 0) {
    throw new ImageProcessingError('El modelo no pudo identificar un sujeto en esta imagen.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new ImageProcessingError('No se pudo generar la máscara de transparencia.');
  const mask = context.createImageData(width, height);

  for (let index = 0; index < length; index += 1) {
    const normalized = Math.max(0, Math.min(1, (Number(values[index]) - minimum) / range));
    const offset = index * 4;
    mask.data[offset] = 255;
    mask.data[offset + 1] = 255;
    mask.data[offset + 2] = 255;
    mask.data[offset + 3] = Math.round(Math.pow(normalized, 0.9) * 255);
  }
  context.putImageData(mask, 0, 0);
  return { canvas, bounds: findAlphaBounds(mask.data, width, height) };
}

export async function removeImageBackground(
  file: File,
  options: BackgroundOptions = {},
): Promise<BackgroundRemovalOutput> {
  if (typeof WebAssembly === 'undefined') {
    throw new ImageProcessingError('Este navegador no admite WebAssembly, necesario para la eliminación de fondos.');
  }

  const session = await getSession(options);
  throwIfAborted(options.signal);
  report(options, 'Preparando la fotografía…', 42);
  const decoded = await decodeImage(file, options.signal);
  const resultCanvas = document.createElement('canvas');
  let maskCanvas: HTMLCanvasElement | null = null;
  let maskBounds: Box | null = null;

  try {
    validateDimensions(decoded.width, decoded.height, MAX_SOURCE_PIXELS);
    const outputSize = calculateOutputSize(decoded.width, decoded.height);
    const input = imageToTensor(decoded.source);
    throwIfAborted(options.signal);
    report(options, 'Detectando el sujeto…', 56);

    const inputName = session.inputNames[0];
    const results = await session.run({ [inputName]: input });
    throwIfAborted(options.signal);
    report(options, 'Creando la transparencia…', 84);

    const output = results[session.outputNames[0]];
    if (!output) throw new ImageProcessingError('El modelo devolvió un resultado inesperado.');
    ({ canvas: maskCanvas, bounds: maskBounds } = outputToMask(output));

    resultCanvas.width = outputSize.width;
    resultCanvas.height = outputSize.height;
    const context = resultCanvas.getContext('2d', { alpha: true });
    if (!context) throw new ImageProcessingError('No se pudo crear la imagen transparente.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(decoded.source, 0, 0, outputSize.width, outputSize.height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(maskCanvas, 0, 0, outputSize.width, outputSize.height);
    context.globalCompositeOperation = 'source-over';
    const backdrop = await createBackdrop(decoded.source, decoded.width, decoded.height);
    // A partir de aquí el original decodificado no hace falta; liberarlo antes
    // de codificar el PNG reduce el pico de memoria en teléfonos.
    decoded.release();

    throwIfAborted(options.signal);
    report(options, 'Generando el PNG…', 94);
    const blob = await canvasToBlob(resultCanvas, 'image/png', undefined, options.signal);
    report(options, 'Resultado listo', 100);
    return {
      blob,
      width: outputSize.width,
      height: outputSize.height,
      originalWidth: decoded.width,
      originalHeight: decoded.height,
      resized: outputSize.resized,
      subject: maskBounds
        ? scaleBox(maskBounds, maskCanvas.width, maskCanvas.height, outputSize.width, outputSize.height)
        : null,
      backdrop,
    };
  } catch (error) {
    if (error instanceof RangeError || (error instanceof Error && /memory|allocation/i.test(error.message))) {
      throw new ImageProcessingError('El dispositivo no tiene memoria suficiente para esta imagen. Prueba con una fotografía más pequeña.');
    }
    throw error;
  } finally {
    decoded.release();
    resultCanvas.width = 0;
    resultCanvas.height = 0;
    if (maskCanvas) {
      maskCanvas.width = 0;
      maskCanvas.height = 0;
    }
  }
}

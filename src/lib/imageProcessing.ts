import type { SupportedImageType } from './files';

const MAX_PIXELS = 32_000_000;
const MAX_DIMENSION = 12_000;

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Operación cancelada', 'AbortError');
}

export async function decodeImage(file: Blob, signal?: AbortSignal): Promise<DecodedImage> {
  throwIfAborted(signal);

  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      throwIfAborted(signal);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      // Safari can reject createImageBitmap for a valid image. The img fallback is intentional.
    }
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = 'async';

  try {
    await new Promise<void>((resolve, reject) => {
      const abort = () => reject(new DOMException('Operación cancelada', 'AbortError'));
      signal?.addEventListener('abort', abort, { once: true });
      image.onload = () => {
        signal?.removeEventListener('abort', abort);
        resolve();
      };
      image.onerror = () => {
        signal?.removeEventListener('abort', abort);
        reject(new ImageProcessingError('No se pudo leer la imagen. Puede estar dañada o usar una codificación no compatible.'));
      };
      image.src = url;
    });
    throwIfAborted(signal);
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export function validateDimensions(width: number, height: number, maxPixels = MAX_PIXELS) {
  if (width <= 0 || height <= 0) {
    throw new ImageProcessingError('La imagen no contiene dimensiones válidas.');
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > maxPixels) {
    throw new ImageProcessingError(
      `La imagen es demasiado grande para procesarla con seguridad (${width} × ${height} px).`,
    );
  }
}

/** Escala proporcionalmente para que ningún lado supere `maxSide`. Nunca amplía. */
export function fitWithin(width: number, height: number, maxSide?: number) {
  if (!maxSide || maxSide <= 0 || Math.max(width, height) <= maxSide) {
    return { width, height, resized: false };
  }
  const scale = maxSide / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    resized: true,
  };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: SupportedImageType,
  quality?: number,
  signal?: AbortSignal,
): Promise<Blob> {
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (signal?.aborted) {
          reject(new DOMException('Operación cancelada', 'AbortError'));
          return;
        }
        if (!blob) {
          reject(new ImageProcessingError('El navegador no pudo generar la imagen. Prueba con otro formato.'));
          return;
        }
        if (blob.type && blob.type !== mimeType) {
          reject(new ImageProcessingError(`Este navegador no puede exportar imágenes en ${mimeType}.`));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export interface CompressOptions {
  mimeType: SupportedImageType;
  quality: number;
  /** Lado máximo en píxeles; si se omite se conservan las dimensiones originales. */
  maxDimension?: number;
  signal?: AbortSignal;
  onProgress?: (message: string) => void;
}

export interface CompressionOutput {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  resized: boolean;
}

export async function compressImage(file: File, options: CompressOptions): Promise<CompressionOutput> {
  options.onProgress?.('Leyendo la imagen…');
  const decoded = await decodeImage(file, options.signal);
  const canvas = document.createElement('canvas');

  try {
    validateDimensions(decoded.width, decoded.height);
    throwIfAborted(options.signal);
    const target = fitWithin(decoded.width, decoded.height, options.maxDimension);
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext('2d', { alpha: options.mimeType !== 'image/jpeg' });
    if (!context) throw new ImageProcessingError('Canvas no está disponible en este navegador.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    options.onProgress?.('Preparando los píxeles…');
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    throwIfAborted(options.signal);

    if (options.mimeType === 'image/jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

    options.onProgress?.('Optimizando el archivo…');
    const quality = options.mimeType === 'image/png' ? undefined : options.quality;
    const blob = await canvasToBlob(canvas, options.mimeType, quality, options.signal);
    return {
      blob,
      width: target.width,
      height: target.height,
      originalWidth: decoded.width,
      originalHeight: decoded.height,
      resized: target.resized,
    };
  } finally {
    decoded.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}

export function supportsCanvasFormat(mimeType: SupportedImageType): boolean {
  if (mimeType === 'image/png' || mimeType === 'image/jpeg') return true;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL(mimeType).startsWith(`data:${mimeType}`);
}

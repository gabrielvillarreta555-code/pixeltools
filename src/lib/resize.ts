import type { SupportedImageType } from './files';
import { canvasToBlob, decodeImage, ImageProcessingError, validateDimensions } from './imageProcessing';

export type FitMode = 'cover' | 'contain' | 'stretch';

export interface SizePreset {
  id: string;
  label: string;
  group: string;
  width: number;
  height: number;
}

export const SOCIAL_PRESETS: SizePreset[] = [
  { id: 'ig-cuadrado', group: 'Instagram', label: 'Publicación cuadrada', width: 1080, height: 1080 },
  { id: 'ig-vertical', group: 'Instagram', label: 'Publicación vertical', width: 1080, height: 1350 },
  { id: 'ig-historia', group: 'Instagram', label: 'Historia o Reel', width: 1080, height: 1920 },
  { id: 'wa-perfil', group: 'WhatsApp', label: 'Foto de perfil', width: 640, height: 640 },
  { id: 'wa-estado', group: 'WhatsApp', label: 'Estado', width: 1080, height: 1920 },
  { id: 'fb-portada', group: 'Facebook', label: 'Portada', width: 1640, height: 624 },
  { id: 'fb-publicacion', group: 'Facebook', label: 'Publicación', width: 1200, height: 630 },
  { id: 'yt-miniatura', group: 'YouTube', label: 'Miniatura', width: 1280, height: 720 },
  { id: 'x-publicacion', group: 'X (Twitter)', label: 'Publicación', width: 1600, height: 900 },
  { id: 'li-portada', group: 'LinkedIn', label: 'Portada de perfil', width: 1584, height: 396 },
];

/** Límite de salida: también protege a los navegadores móviles (Safari limita el lienzo a ~16,7 MP). */
export const MAX_OUTPUT_SIDE = 8000;
export const MAX_OUTPUT_PIXELS = 16_000_000;

export interface DrawPlan {
  /** Rectángulo de la imagen original que se dibuja. */
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  /** Rectángulo de destino en el lienzo final. */
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * Calcula cómo encajar una imagen de `srcW × srcH` en un lienzo de `dstW × dstH`.
 * - cover: rellena todo el lienzo recortando lo que sobra, centrado.
 * - contain: muestra la imagen entera, centrada, dejando bordes.
 * - stretch: deforma la imagen para ocupar exactamente el lienzo.
 */
export function planFit(srcW: number, srcH: number, dstW: number, dstH: number, fit: FitMode): DrawPlan {
  if (fit === 'stretch') return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
  if (fit === 'contain') {
    const scale = Math.min(dstW / srcW, dstH / srcH);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);
    return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: Math.round((dstW - dw) / 2), dy: Math.round((dstH - dh) / 2), dw, dh };
  }
  const scale = Math.max(dstW / srcW, dstH / srcH);
  const sw = dstW / scale;
  const sh = dstH / scale;
  return { sx: (srcW - sw) / 2, sy: (srcH - sh) / 2, sw, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
}

/** Calcula el alto (o el ancho) que conserva la proporción original. */
export function keepAspect(srcW: number, srcH: number, side: 'width' | 'height', value: number) {
  if (side === 'width') return { width: value, height: Math.max(1, Math.round((value * srcH) / srcW)) };
  return { width: Math.max(1, Math.round((value * srcW) / srcH)), height: value };
}

/** Devuelve un mensaje si las dimensiones pedidas no son válidas; null si se pueden usar. */
export function validateTargetSize(width: number, height: number): string | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    return 'Introduce un ancho y un alto enteros mayores que cero.';
  }
  if (width > MAX_OUTPUT_SIDE || height > MAX_OUTPUT_SIDE) {
    return `Cada lado puede medir como máximo ${MAX_OUTPUT_SIDE.toLocaleString('es')} px.`;
  }
  if (width * height > MAX_OUTPUT_PIXELS) {
    return 'La imagen resultante superaría los 16 megapíxeles. Elige unas medidas menores.';
  }
  return null;
}

export interface ResizeOptions {
  width: number;
  height: number;
  fit: FitMode;
  mimeType: SupportedImageType;
  /** Color de los bordes en modo «contain». Sin color, quedan transparentes (o blancos en JPG). */
  background?: string;
  signal?: AbortSignal;
}

export interface ResizeOutput {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export async function resizeImage(file: Blob, options: ResizeOptions): Promise<ResizeOutput> {
  const sizeError = validateTargetSize(options.width, options.height);
  if (sizeError) throw new ImageProcessingError(sizeError);
  const decoded = await decodeImage(file, options.signal);
  const canvas = document.createElement('canvas');
  try {
    validateDimensions(decoded.width, decoded.height);
    canvas.width = options.width;
    canvas.height = options.height;
    const context = canvas.getContext('2d', { alpha: options.mimeType !== 'image/jpeg' });
    if (!context) {
      throw new ImageProcessingError(`Este navegador no tiene memoria suficiente para un lienzo de ${options.width} × ${options.height} px.`);
    }
    const background = options.background ?? (options.mimeType === 'image/jpeg' ? '#ffffff' : undefined);
    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    const plan = planFit(decoded.width, decoded.height, options.width, options.height, options.fit);
    context.drawImage(decoded.source, plan.sx, plan.sy, plan.sw, plan.sh, plan.dx, plan.dy, plan.dw, plan.dh);
    decoded.release();
    const quality = options.mimeType === 'image/png' ? undefined : 0.92;
    const blob = await canvasToBlob(canvas, options.mimeType, quality, options.signal);
    return { blob, width: canvas.width, height: canvas.height, originalWidth: decoded.width, originalHeight: decoded.height };
  } finally {
    decoded.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}

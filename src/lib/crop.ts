import type { SupportedImageType } from './files';
import { canvasToBlob, decodeImage, ImageProcessingError, validateDimensions } from './imageProcessing';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Handle = 'nw' | 'ne' | 'sw' | 'se';

export const ASPECT_PRESETS: { id: string; label: string; ratio: number | null }[] = [
  { id: 'libre', label: 'Libre', ratio: null },
  { id: '1:1', label: '1:1', ratio: 1 },
  { id: '4:5', label: '4:5', ratio: 4 / 5 },
  { id: '3:4', label: '3:4', ratio: 3 / 4 },
  { id: '3:2', label: '3:2', ratio: 3 / 2 },
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
  { id: '9:16', label: '9:16', ratio: 9 / 16 },
];

/** Tamaño mínimo del recorte en píxeles de la imagen. */
export const MIN_CROP = 16;

/** Rectángulo más grande con la proporción dada, centrado en la imagen. */
export function centeredRect(imageWidth: number, imageHeight: number, ratio: number | null): Rect {
  if (!ratio) return { x: 0, y: 0, width: imageWidth, height: imageHeight };
  let width = imageWidth;
  let height = width / ratio;
  if (height > imageHeight) {
    height = imageHeight;
    width = height * ratio;
  }
  return { x: (imageWidth - width) / 2, y: (imageHeight - height) / 2, width, height };
}

/** Desplaza el rectángulo sin salirse de la imagen. */
export function moveRect(rect: Rect, dx: number, dy: number, imageWidth: number, imageHeight: number): Rect {
  return {
    ...rect,
    x: Math.min(Math.max(0, rect.x + dx), imageWidth - rect.width),
    y: Math.min(Math.max(0, rect.y + dy), imageHeight - rect.height),
  };
}

/**
 * Redimensiona arrastrando una esquina. La esquina opuesta queda fija, el
 * resultado no sale de la imagen, respeta el tamaño mínimo y, si hay
 * proporción, la mantiene.
 */
export function resizeRect(
  rect: Rect,
  handle: Handle,
  dx: number,
  dy: number,
  ratio: number | null,
  imageWidth: number,
  imageHeight: number,
): Rect {
  const left = handle === 'nw' || handle === 'sw';
  const top = handle === 'nw' || handle === 'ne';
  // Esquina fija (opuesta a la que se arrastra).
  const anchorX = left ? rect.x + rect.width : rect.x;
  const anchorY = top ? rect.y + rect.height : rect.y;
  // Espacio disponible desde la esquina fija hasta el borde de la imagen.
  const maxWidth = left ? anchorX : imageWidth - anchorX;
  const maxHeight = top ? anchorY : imageHeight - anchorY;

  let width = Math.min(Math.max(MIN_CROP, rect.width + (left ? -dx : dx)), maxWidth);
  let height = Math.min(Math.max(MIN_CROP, rect.height + (top ? -dy : dy)), maxHeight);

  if (ratio) {
    // Manda el eje que más ha cambiado; después se ajusta al espacio disponible.
    if (Math.abs(dx) >= Math.abs(dy)) height = width / ratio;
    else width = height * ratio;
    if (width > maxWidth) {
      width = maxWidth;
      height = width / ratio;
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }
    const minWidth = Math.max(MIN_CROP, MIN_CROP * ratio);
    if (width < minWidth) {
      width = Math.min(minWidth, maxWidth);
      height = width / ratio;
    }
  }

  return {
    x: left ? anchorX - width : anchorX,
    y: top ? anchorY - height : anchorY,
    width,
    height,
  };
}

/** Redondea a píxeles enteros dentro de la imagen para exportar. */
export function roundRect(rect: Rect, imageWidth: number, imageHeight: number): Rect {
  const x = Math.max(0, Math.round(rect.x));
  const y = Math.max(0, Math.round(rect.y));
  return {
    x,
    y,
    width: Math.max(1, Math.min(imageWidth - x, Math.round(rect.width))),
    height: Math.max(1, Math.min(imageHeight - y, Math.round(rect.height))),
  };
}

export interface Transform {
  /** Giro en cuartos de vuelta en sentido horario (0–3). */
  quarterTurns: number;
  flipHorizontal: boolean;
}

/** Dimensiones de la imagen después de girarla. */
export function rotatedSize(width: number, height: number, quarterTurns: number) {
  return quarterTurns % 2 === 0 ? { width, height } : { width: height, height: width };
}

export interface CropOutput {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Aplica giro, volteo y recorte. `rect` está expresado en coordenadas de la
 * imagen ya girada, que es la que ve la persona en pantalla.
 */
export async function cropImage(
  file: Blob,
  rect: Rect,
  transform: Transform,
  mimeType: SupportedImageType,
  signal?: AbortSignal,
): Promise<CropOutput> {
  const decoded = await decodeImage(file, signal);
  const canvas = document.createElement('canvas');
  try {
    validateDimensions(decoded.width, decoded.height);
    const turned = rotatedSize(decoded.width, decoded.height, transform.quarterTurns);
    const area = roundRect(rect, turned.width, turned.height);
    canvas.width = area.width;
    canvas.height = area.height;
    const context = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
    if (!context) {
      throw new ImageProcessingError(`Este navegador no tiene memoria suficiente para un lienzo de ${area.width} × ${area.height} px.`);
    }
    if (mimeType === 'image/jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Se lleva el recorte al origen y después se aplican giro y volteo
    // alrededor del centro de la imagen girada.
    context.translate(-area.x, -area.y);
    context.translate(turned.width / 2, turned.height / 2);
    context.rotate((transform.quarterTurns * Math.PI) / 2);
    if (transform.flipHorizontal) context.scale(transform.quarterTurns % 2 === 0 ? -1 : 1, transform.quarterTurns % 2 === 0 ? 1 : -1);
    context.drawImage(decoded.source, -decoded.width / 2, -decoded.height / 2);
    decoded.release();
    const quality = mimeType === 'image/png' ? undefined : 0.92;
    const blob = await canvasToBlob(canvas, mimeType, quality, signal);
    return { blob, width: area.width, height: area.height };
  } finally {
    decoded.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}

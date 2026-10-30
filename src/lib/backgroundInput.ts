import { readMetadata, detectFormat } from './metadata';
import { canvasToBlob, decodeImage, ImageProcessingError } from './imageProcessing';

export interface ImageSize { width: number; height: number }
export interface PreparedBackground extends ImageSize {
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  resized: boolean;
}

/** Conservador también cuando Safari no informa de la memoria disponible. */
export function backgroundSize(width: number, height: number): ImageSize {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 ||
      width > 32768 || height > 32768 || width * height > 100_000_000) {
    throw new ImageProcessingError('Dimensiones no compatibles: máximo 100 megapíxeles y 32768 px por lado.');
  }
  const scale = Math.min(1, 2048 / Math.max(width, height), Math.sqrt(4_000_000 / (width * height)));
  return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)) };
}

/** Lee dimensiones del archivo comprimido, sin reservar sus píxeles. */
export function readImageSize(bytes: Uint8Array): ImageSize {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const format = detectFormat(bytes);
  let width = 0;
  let height = 0;
  if (format === 'png' && bytes.length >= 24) {
    width = view.getUint32(16); height = view.getUint32(20);
  } else if (format === 'jpeg') {
    let offset = 2;
    while (offset + 4 <= bytes.length && bytes[offset] === 255) {
      while (bytes[offset] === 255) offset++;
      const marker = bytes[offset++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > bytes.length) break;
      const length = view.getUint16(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 8) {
        height = view.getUint16(offset + 3); width = view.getUint16(offset + 5); break;
      }
      offset += length;
    }
  } else if (format === 'webp') {
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const type = String.fromCharCode(...bytes.subarray(offset, offset + 4));
      const length = view.getUint32(offset + 4, true);
      const start = offset + 8;
      if (start + length > bytes.length) break;
      const u24 = (at: number) => bytes[at] + bytes[at + 1] * 256 + bytes[at + 2] * 65536;
      if (type === 'VP8X' && length >= 10) {
        width = u24(start + 4) + 1; height = u24(start + 7) + 1; break;
      }
      if (type === 'VP8 ' && length >= 10) {
        width = view.getUint16(start + 6, true) & 0x3fff; height = view.getUint16(start + 8, true) & 0x3fff; break;
      }
      if (type === 'VP8L' && length >= 5 && bytes[start] === 0x2f) {
        const bits = view.getUint32(start + 1, true);
        width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1; break;
      }
      offset = start + length + (length % 2);
    }
  }
  backgroundSize(width, height);
  // La decodificación aplica EXIF; las dimensiones de trabajo deben coincidir.
  if (readMetadata(bytes).orientation >= 5) return { width: height, height: width };
  return { width, height };
}

function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Operación cancelada', 'AbortError');
}

export async function prepareBackgroundImage(file: Blob, signal?: AbortSignal): Promise<PreparedBackground> {
  checkAbort(signal);
  if (file.size > 15 * 1024 * 1024) throw new ImageProcessingError('La imagen supera el límite de 15 MB.');
  const original = readImageSize(new Uint8Array(await file.arrayBuffer()));
  checkAbort(signal);
  const size = backgroundSize(original.width, original.height);
  const resized = size.width !== original.width || size.height !== original.height;
  let decoded;
  if (resized) {
    if (typeof createImageBitmap !== 'function') {
      throw new ImageProcessingError('Este navegador no permite reducir esta imagen con seguridad. Redúcela a 2048 px por lado antes de cargarla.');
    }
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image', resizeWidth: size.width, resizeHeight: size.height, resizeQuality: 'high' });
    } catch {
      checkAbort(signal);
      throw new ImageProcessingError('No se pudo reducir la imagen con seguridad. Prueba con un archivo más pequeño o un navegador actualizado.');
    }
    if (signal?.aborted || bitmap.width !== size.width || bitmap.height !== size.height) {
      bitmap.close();
      checkAbort(signal);
      throw new ImageProcessingError('El navegador no admite la reducción solicitada. Usa una imagen más pequeña.');
    }
    decoded = { source: bitmap, release: () => bitmap.close() };
  } else {
    decoded = await decodeImage(file, signal);
  }
  const canvas = document.createElement('canvas');
  try {
    checkAbort(signal);
    canvas.width = size.width; canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (!context) throw new ImageProcessingError('Memoria insuficiente para preparar la imagen.');
    context.drawImage(decoded.source, 0, 0, size.width, size.height);
    const blob = await canvasToBlob(canvas, 'image/png', undefined, signal);
    return { ...size, blob, originalWidth: original.width, originalHeight: original.height, resized };
  } finally {
    decoded.release(); canvas.width = 0; canvas.height = 0;
  }
}

import { readMetadata, detectFormat, parseTiff } from './metadata';
import { canvasToBlob, decodeImage, ImageProcessingError } from './imageProcessing';

/** Límite del archivo comprimido; se mantienen los límites de píxeles por seguridad. */
export const MAX_BACKGROUND_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_BACKGROUND_PIXELS = 120_000_000;

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
      width > 32768 || height > 32768 || width * height > MAX_BACKGROUND_PIXELS) {
    throw new ImageProcessingError('Dimensiones no compatibles: máximo 120 megapíxeles y 32768 px por lado.');
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

/**
 * Recorre únicamente los segmentos JPEG anteriores a la imagen comprimida.
 * Evita copiar decenas de MB a memoria solo para leer dimensiones y EXIF.
 */
async function readJpegSize(file: Blob, signal?: AbortSignal): Promise<ImageSize> {
  const read = async (offset: number, length: number) => {
    checkAbort(signal);
    const result = new Uint8Array(await file.slice(offset, offset + length).arrayBuffer());
    checkAbort(signal);
    return result;
  };
  const validFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2, width = 0, height = 0, orientation = 1, segments = 0;
  // Impide que archivos maliciosos fuercen un número ilimitado de lecturas.
  while (offset + 2 <= file.size && segments++ < 4096) {
    const header = await read(offset, 4);
    if (header.length < 2 || header[0] !== 0xff) throw new ImageProcessingError('No se pudo leer la cabecera JPEG.');
    const marker = header[1];
    if (marker === 0xff) { offset++; continue; }
    if (marker === 0xda || marker === 0xd9) {
      backgroundSize(width, height);
      return orientation >= 5 ? { width: height, height: width } : { width, height };
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
    if (header.length < 4) break;
    const length = (header[2] << 8) | header[3];
    const end = offset + 2 + length;
    if (length < 2 || end > file.size) break;
    if (validFrame.has(marker) && length >= 8 && width === 0) {
      const frame = await read(offset + 4, 5);
      if (frame.length < 5) break;
      height = (frame[1] << 8) | frame[2];
      width = (frame[3] << 8) | frame[4];
      backgroundSize(width, height);
    } else if (marker === 0xe1 && length >= 8) {
      const signature = await read(offset + 4, 6);
      if (signature.length === 6 && signature[0] === 69 && signature[1] === 120 && signature[2] === 105 && signature[3] === 102 && signature[4] === 0 && signature[5] === 0) {
        const tiff = await read(offset + 10, length - 8);
        const value = parseTiff(tiff).tags.get(0x0112);
        orientation = typeof value === 'number' && value >= 1 && value <= 8 ? value : 1;
      }
    }
    offset = end;
  }
  throw new ImageProcessingError('No se pudo leer la cabecera JPEG. El archivo puede estar dañado o ser demasiado complejo.');
}

/** Libera la referencia a los bytes comprimidos antes de decodificar los píxeles. */
async function readBackgroundSize(file: Blob, signal?: AbortSignal): Promise<ImageSize> {
  let bytes: Uint8Array;
  try {
    // Para JPEG no se reserva un buffer del archivo completo: el coste es el
    // de sus cabeceras y, como máximo, un segmento EXIF de 64 KiB.
    const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    checkAbort(signal);
    if (detectFormat(signature) === 'jpeg') return await readJpegSize(file, signal);
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch (error) {
    checkAbort(signal);
    if (error instanceof ImageProcessingError) throw error;
    throw new ImageProcessingError('No se pudo leer la imagen. Puede faltar memoria: cierra otras aplicaciones o comprime una copia antes de intentarlo.');
  }
  return readImageSize(bytes);
}

export async function prepareBackgroundImage(file: Blob, signal?: AbortSignal): Promise<PreparedBackground> {
  checkAbort(signal);
  if (file.size > MAX_BACKGROUND_FILE_BYTES) throw new ImageProcessingError('La imagen supera el límite de 50 MB. Comprime una copia antes de intentarlo.');
  const original = await readBackgroundSize(file, signal);
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

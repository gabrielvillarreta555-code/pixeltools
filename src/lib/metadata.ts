// Lectura y eliminación de metadatos sin recomprimir la imagen.
//
// Se trabaja directamente sobre los bytes del archivo: JPEG (segmentos APPn y
// COM), PNG (fragmentos de texto, eXIf y tIME) y WebP (fragmentos EXIF y XMP).
// Los píxeles no se tocan, así que la calidad no cambia. La orientación EXIF
// se conserva en un bloque mínimo para que las fotos no aparezcan giradas.

import { crc32 } from './zip';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface MetadataEntry {
  label: string;
  value: string;
  /** Datos que pueden identificar a una persona, un lugar o un dispositivo. */
  sensitive: boolean;
}

export interface MetadataReport {
  format: ImageFormat;
  entries: MetadataEntry[];
  gps: { latitude: number; longitude: number } | null;
  /** Orientación EXIF (1 = normal). Se conserva al limpiar. */
  orientation: number;
  /** Bytes de metadatos que se eliminarían. */
  removableBytes: number;
}

export class MetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetadataError';
  }
}

export function detectFormat(bytes: Uint8Array): ImageFormat | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png';
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
  return null;
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  let text = '';
  for (let index = offset; index < offset + length && index < bytes.length; index += 1) text += String.fromCharCode(bytes[index]);
  return text;
}

function utf8(bytes: Uint8Array) {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes).replace(/\0+$/, '').trim();
}

// ---------------------------------------------------------------- EXIF (TIFF)

interface ExifData {
  tags: Map<number, unknown>;
  exif: Map<number, unknown>;
  gps: Map<number, unknown>;
}

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

/** Interpreta un bloque TIFF (el contenido de EXIF tras «Exif\0\0»). Tolera archivos dañados. */
export function parseTiff(tiff: Uint8Array): ExifData {
  const result: ExifData = { tags: new Map(), exif: new Map(), gps: new Map() };
  if (tiff.length < 8) return result;
  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const order = ascii(tiff, 0, 2);
  if (order !== 'II' && order !== 'MM') return result;
  const little = order === 'II';
  const u16 = (offset: number) => view.getUint16(offset, little);
  const u32 = (offset: number) => view.getUint32(offset, little);

  const readValue = (type: number, count: number, offset: number): unknown => {
    const size = (TYPE_SIZE[type] ?? 1) * count;
    if (size <= 0 || offset < 0 || offset + size > tiff.length) return undefined;
    switch (type) {
      case 2:
        return utf8(tiff.subarray(offset, offset + count));
      case 3:
        return count === 1 ? u16(offset) : Array.from({ length: count }, (_, i) => u16(offset + i * 2));
      case 4:
        return count === 1 ? u32(offset) : Array.from({ length: count }, (_, i) => u32(offset + i * 4));
      case 5:
        return Array.from({ length: count }, (_, i) => {
          const denominator = u32(offset + i * 8 + 4);
          return denominator ? u32(offset + i * 8) / denominator : 0;
        });
      case 1:
      case 7:
        return tiff.subarray(offset, offset + size);
      default:
        return undefined;
    }
  };

  const readIfd = (offset: number, target: Map<number, unknown>) => {
    if (offset < 8 || offset + 2 > tiff.length) return;
    const count = u16(offset);
    for (let index = 0; index < Math.min(count, 512); index += 1) {
      const entry = offset + 2 + index * 12;
      if (entry + 12 > tiff.length) break;
      const tag = u16(entry);
      const type = u16(entry + 2);
      const valueCount = u32(entry + 4);
      const size = (TYPE_SIZE[type] ?? 0) * valueCount;
      const valueOffset = size <= 4 ? entry + 8 : u32(entry + 8);
      if (size === 0 || valueCount > 100_000) continue;
      target.set(tag, readValue(type, valueCount, valueOffset));
      if (tag === 0x8769 || tag === 0x8825) target.set(tag, u32(entry + 8));
    }
  };

  try {
    readIfd(u32(4), result.tags);
    const exifOffset = result.tags.get(0x8769);
    if (typeof exifOffset === 'number') readIfd(exifOffset, result.exif);
    const gpsOffset = result.tags.get(0x8825);
    if (typeof gpsOffset === 'number') readIfd(gpsOffset, result.gps);
  } catch {
    // Datos EXIF dañados: se devuelve lo que se haya podido leer.
  }
  return result;
}

function gpsCoordinate(value: unknown, reference: unknown, negative: string): number | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const [degrees, minutes, seconds] = value as number[];
  if (![degrees, minutes, seconds].every(Number.isFinite)) return null;
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return String(reference).toUpperCase().startsWith(negative) ? -decimal : decimal;
}

function exifEntries(data: ExifData) {
  const entries: MetadataEntry[] = [];
  const text = (value: unknown) => (typeof value === 'string' && value ? value : null);
  const latitude = gpsCoordinate(data.gps.get(2), data.gps.get(1), 'S');
  const longitude = gpsCoordinate(data.gps.get(4), data.gps.get(3), 'W');
  const gps = latitude !== null && longitude !== null && !(latitude === 0 && longitude === 0) ? { latitude, longitude } : null;
  if (gps) entries.push({ label: 'Ubicación GPS', value: `${gps.latitude.toFixed(5)}, ${gps.longitude.toFixed(5)}`, sensitive: true });
  const altitude = data.gps.get(6);
  if (gps && Array.isArray(altitude) && Number.isFinite(altitude[0])) {
    entries.push({ label: 'Altitud', value: `${Math.round(altitude[0] as number)} m`, sensitive: true });
  }
  const device = [text(data.tags.get(0x010f)), text(data.tags.get(0x0110))].filter(Boolean).join(' ');
  if (device) entries.push({ label: 'Dispositivo', value: device, sensitive: true });
  const serial = text(data.exif.get(0xa431));
  if (serial) entries.push({ label: 'Número de serie de la cámara', value: serial, sensitive: true });
  const lens = text(data.exif.get(0xa434));
  if (lens) entries.push({ label: 'Objetivo', value: lens, sensitive: false });
  const date = text(data.exif.get(0x9003)) ?? text(data.tags.get(0x0132));
  if (date) entries.push({ label: 'Fecha y hora', value: formatExifDate(date), sensitive: true });
  const artist = text(data.tags.get(0x013b));
  if (artist) entries.push({ label: 'Autor', value: artist, sensitive: true });
  const copyright = text(data.tags.get(0x8298));
  if (copyright) entries.push({ label: 'Derechos de autor', value: copyright, sensitive: false });
  const software = text(data.tags.get(0x0131));
  if (software) entries.push({ label: 'Software', value: software, sensitive: false });
  const orientationValue = data.tags.get(0x0112);
  const orientation = typeof orientationValue === 'number' && orientationValue >= 1 && orientationValue <= 8 ? orientationValue : 1;
  return { entries, gps, orientation };
}

function formatExifDate(value: string) {
  const match = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : value;
}

/** Bloque TIFF mínimo que solo contiene la orientación. */
export function orientationTiff(orientation: number): Uint8Array {
  const tiff = new Uint8Array(26);
  const view = new DataView(tiff.buffer);
  tiff.set([0x4d, 0x4d, 0x00, 0x2a], 0); // «MM», 42
  view.setUint32(4, 8);
  view.setUint16(8, 1); // una entrada
  view.setUint16(10, 0x0112);
  view.setUint16(12, 3); // SHORT
  view.setUint32(14, 1);
  view.setUint16(18, orientation);
  view.setUint32(22, 0); // sin más IFD
  return tiff;
}

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // «Exif\0\0»

function startsWith(bytes: Uint8Array, prefix: Uint8Array | string) {
  const expected = typeof prefix === 'string' ? Array.from(prefix, (c) => c.charCodeAt(0)) : prefix;
  if (bytes.length < expected.length) return false;
  for (let index = 0; index < expected.length; index += 1) if (bytes[index] !== expected[index]) return false;
  return true;
}

function concat(parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

// ---------------------------------------------------------------- JPEG

interface JpegSegment {
  marker: number;
  start: number;
  end: number;
  payload: Uint8Array;
}

/**
 * Final de la imagen principal (después del marcador EOI). En los datos
 * comprimidos, 0xFF solo va seguido de 0x00 (relleno), de RSTn o de un
 * marcador real, así que el primer FFD9 marca el final.
 */
function jpegEnd(bytes: Uint8Array, from: number) {
  for (let index = from; index + 1 < bytes.length; index += 1) {
    if (bytes[index] === 0xff && bytes[index + 1] === 0xd9) return index + 2;
  }
  return bytes.length;
}

function jpegSegments(bytes: Uint8Array): { segments: JpegSegment[]; scanStart: number } {
  const segments: JpegSegment[] = [];
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) throw new MetadataError('El archivo JPEG está dañado.');
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset += 1; // relleno
      continue;
    }
    if (marker === 0xda || marker === 0xd9) return { segments, scanStart: offset };
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const end = offset + 2 + length;
    if (length < 2 || end > bytes.length) throw new MetadataError('El archivo JPEG está dañado.');
    segments.push({ marker, start: offset, end, payload: bytes.subarray(offset + 4, end) });
    offset = end;
  }
  throw new MetadataError('El archivo JPEG está incompleto.');
}

const ICC_HEADER = 'ICC_PROFILE\0';

/** Segmentos que se conservan: JFIF (APP0), perfil de color ICC (APP2), Adobe (APP14) y los de imagen. */
function keepJpegSegment(segment: JpegSegment) {
  const { marker, payload } = segment;
  if (marker === 0xfe) return false; // comentario
  if (marker >= 0xe0 && marker <= 0xef) {
    if (marker === 0xe0 || marker === 0xee) return true;
    if (marker === 0xe2 && startsWith(payload, ICC_HEADER)) return true;
    return false;
  }
  return true;
}

function readJpeg(bytes: Uint8Array) {
  const { segments, scanStart } = jpegSegments(bytes);
  const entries: MetadataEntry[] = [];
  let gps: MetadataReport['gps'] = null;
  let orientation = 1;
  let removableBytes = 0;
  const trailing = bytes.length - jpegEnd(bytes, scanStart);
  if (trailing > 0) {
    removableBytes += trailing;
    entries.push({ label: 'Imagen adicional incrustada', value: 'Vista previa o mapa HDR añadidos por la cámara', sensitive: false });
  }
  for (const segment of segments) {
    if (keepJpegSegment(segment)) continue;
    removableBytes += segment.end - segment.start;
    if (segment.marker === 0xe1 && startsWith(segment.payload, EXIF_HEADER)) {
      const parsed = exifEntries(parseTiff(segment.payload.subarray(6)));
      entries.push(...parsed.entries);
      gps = parsed.gps;
      orientation = parsed.orientation;
    } else if (segment.marker === 0xe1 && startsWith(segment.payload, 'http://ns.adobe.com/xap/1.0/')) {
      entries.push({ label: 'Datos XMP', value: 'Historial de edición y datos descriptivos', sensitive: false });
    } else if (segment.marker === 0xed) {
      entries.push({ label: 'Datos IPTC', value: 'Autor, título o palabras clave', sensitive: true });
    } else if (segment.marker === 0xfe) {
      const comment = utf8(segment.payload);
      if (comment) entries.push({ label: 'Comentario', value: comment.slice(0, 120), sensitive: false });
    }
  }
  return { entries, gps, orientation, removableBytes };
}

function stripJpeg(bytes: Uint8Array, orientation: number) {
  const { segments, scanStart } = jpegSegments(bytes);
  const parts: Uint8Array[] = [bytes.subarray(0, 2)];
  let inserted = orientation === 1;
  for (const segment of segments) {
    if (!keepJpegSegment(segment)) continue;
    parts.push(bytes.subarray(segment.start, segment.end));
    if (!inserted && segment.marker === 0xe0) {
      parts.push(jpegExifSegment(orientation));
      inserted = true;
    }
  }
  if (!inserted) parts.splice(1, 0, jpegExifSegment(orientation));
  // Se descarta lo que haya tras la imagen principal (vistas previas, mapas HDR…).
  parts.push(bytes.subarray(scanStart, jpegEnd(bytes, scanStart)));
  return concat(parts);
}

function jpegExifSegment(orientation: number) {
  const tiff = orientationTiff(orientation);
  const length = 2 + EXIF_HEADER.length + tiff.length;
  return concat([new Uint8Array([0xff, 0xe1, length >> 8, length & 0xff]), EXIF_HEADER, tiff]);
}

// ---------------------------------------------------------------- PNG

interface PngChunk {
  type: string;
  start: number;
  end: number;
  data: Uint8Array;
}

function pngChunks(bytes: Uint8Array): PngChunk[] {
  const chunks: PngChunk[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new MetadataError('El archivo PNG está dañado.');
    const type = ascii(bytes, offset + 4, 4);
    chunks.push({ type, start: offset, end, data: bytes.subarray(offset + 8, offset + 8 + length) });
    offset = end;
    if (type === 'IEND') break;
  }
  return chunks;
}

const PNG_METADATA = new Set(['tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME']);

const PNG_LABELS: Record<string, string> = {
  Author: 'Autor',
  Title: 'Título',
  Description: 'Descripción',
  Copyright: 'Derechos de autor',
  Software: 'Software',
  'Creation Time': 'Fecha de creación',
  Comment: 'Comentario',
  Source: 'Dispositivo',
};

function readPng(bytes: Uint8Array) {
  const entries: MetadataEntry[] = [];
  let gps: MetadataReport['gps'] = null;
  let orientation = 1;
  let removableBytes = 0;
  for (const chunk of pngChunks(bytes)) {
    if (!PNG_METADATA.has(chunk.type)) continue;
    removableBytes += chunk.end - chunk.start;
    if (chunk.type === 'eXIf') {
      const parsed = exifEntries(parseTiff(chunk.data));
      entries.push(...parsed.entries);
      gps = parsed.gps;
      orientation = parsed.orientation;
    } else if (chunk.type === 'tEXt' || chunk.type === 'iTXt') {
      const separator = chunk.data.indexOf(0);
      if (separator <= 0) continue;
      const keyword = ascii(chunk.data, 0, separator);
      let value = chunk.data.subarray(separator + 1);
      if (chunk.type === 'iTXt') {
        if (value[0] === 1) {
          entries.push({ label: PNG_LABELS[keyword] ?? keyword, value: 'Texto comprimido', sensitive: false });
          continue;
        }
        // compresión (2 bytes), idioma\0, palabra clave traducida\0, texto
        let cursor = 2;
        for (let zeros = 0; zeros < 2 && cursor < value.length; cursor += 1) if (value[cursor] === 0) zeros += 1;
        value = value.subarray(cursor);
      }
      const text = utf8(value);
      if (keyword === 'XML:com.adobe.xmp') {
        entries.push({ label: 'Datos XMP', value: 'Historial de edición y datos descriptivos', sensitive: false });
      } else if (text) {
        entries.push({ label: PNG_LABELS[keyword] ?? keyword, value: text.slice(0, 120), sensitive: keyword === 'Author' || keyword === 'Source' });
      }
    } else if (chunk.type === 'zTXt') {
      const separator = chunk.data.indexOf(0);
      entries.push({ label: separator > 0 ? ascii(chunk.data, 0, separator) : 'Texto', value: 'Texto comprimido', sensitive: false });
    } else if (chunk.type === 'tIME') {
      entries.push({ label: 'Fecha de modificación', value: 'Incluida en el archivo', sensitive: false });
    }
  }
  return { entries, gps, orientation, removableBytes };
}

function pngChunk(type: string, data: Uint8Array) {
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length);
  for (let index = 0; index < 4; index += 1) chunk[4 + index] = type.charCodeAt(index);
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
  return chunk;
}

function stripPng(bytes: Uint8Array, orientation: number) {
  const parts: Uint8Array[] = [bytes.subarray(0, 8)];
  for (const chunk of pngChunks(bytes)) {
    if (PNG_METADATA.has(chunk.type)) continue;
    // eXIf debe ir antes de los datos de imagen.
    if (chunk.type === 'IDAT' && orientation !== 1 && !parts.some((part) => ascii(part, 4, 4) === 'eXIf')) {
      parts.push(pngChunk('eXIf', orientationTiff(orientation)));
    }
    parts.push(bytes.subarray(chunk.start, chunk.end));
  }
  return concat(parts);
}

// ---------------------------------------------------------------- WebP

interface RiffChunk {
  type: string;
  start: number;
  end: number;
  data: Uint8Array;
}

function webpChunks(bytes: Uint8Array): RiffChunk[] {
  const chunks: RiffChunk[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const size = view.getUint32(offset + 4, true);
    const dataEnd = offset + 8 + size;
    if (dataEnd > bytes.length) throw new MetadataError('El archivo WebP está dañado.');
    chunks.push({ type: ascii(bytes, offset, 4), start: offset, end: dataEnd + (size % 2), data: bytes.subarray(offset + 8, dataEnd) });
    offset = dataEnd + (size % 2);
  }
  return chunks;
}

function webpExif(data: Uint8Array) {
  return startsWith(data, EXIF_HEADER) ? data.subarray(6) : data;
}

function readWebp(bytes: Uint8Array) {
  const entries: MetadataEntry[] = [];
  let gps: MetadataReport['gps'] = null;
  let orientation = 1;
  let removableBytes = 0;
  for (const chunk of webpChunks(bytes)) {
    if (chunk.type === 'EXIF') {
      removableBytes += chunk.end - chunk.start;
      const parsed = exifEntries(parseTiff(webpExif(chunk.data)));
      entries.push(...parsed.entries);
      gps = parsed.gps;
      orientation = parsed.orientation;
    } else if (chunk.type === 'XMP ') {
      removableBytes += chunk.end - chunk.start;
      entries.push({ label: 'Datos XMP', value: 'Historial de edición y datos descriptivos', sensitive: false });
    }
  }
  return { entries, gps, orientation, removableBytes };
}

function riffChunk(type: string, data: Uint8Array) {
  const padded = data.length % 2;
  const chunk = new Uint8Array(8 + data.length + padded);
  for (let index = 0; index < 4; index += 1) chunk[index] = type.charCodeAt(index);
  new DataView(chunk.buffer).setUint32(4, data.length, true);
  chunk.set(data, 8);
  return chunk;
}

function stripWebp(bytes: Uint8Array, orientation: number) {
  const parts: Uint8Array[] = [];
  const keepOrientation = orientation !== 1;
  for (const chunk of webpChunks(bytes)) {
    if (chunk.type === 'EXIF' || chunk.type === 'XMP ') continue;
    if (chunk.type === 'VP8X') {
      const copy = bytes.slice(chunk.start, chunk.end);
      // Bits de la cabecera VP8X: EXIF (0x08) y XMP (0x04).
      copy[8] = (copy[8] & ~0x0c) | (keepOrientation ? 0x08 : 0);
      parts.push(copy);
      continue;
    }
    parts.push(bytes.subarray(chunk.start, chunk.end));
  }
  // El fragmento EXIF solo es válido con cabecera VP8X; va al final del archivo.
  if (keepOrientation && parts.some((part) => ascii(part, 0, 4) === 'VP8X')) {
    parts.push(riffChunk('EXIF', orientationTiff(orientation)));
  }
  const body = concat(parts);
  const header = new Uint8Array(12);
  header.set(bytes.subarray(0, 12));
  new DataView(header.buffer).setUint32(4, body.length + 4, true);
  return concat([header, body]);
}

// ---------------------------------------------------------------- API

export function readMetadata(bytes: Uint8Array): MetadataReport {
  const format = detectFormat(bytes);
  if (!format) throw new MetadataError('Formato no compatible. Usa una imagen JPG, PNG o WebP.');
  const result = format === 'jpeg' ? readJpeg(bytes) : format === 'png' ? readPng(bytes) : readWebp(bytes);
  return { format, ...result };
}

/** Devuelve una copia del archivo sin metadatos. Los píxeles no cambian. */
export function stripMetadata(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const report = readMetadata(bytes);
  if (report.format === 'jpeg') return stripJpeg(bytes, report.orientation);
  if (report.format === 'png') return stripPng(bytes, report.orientation);
  return stripWebp(bytes, report.orientation);
}

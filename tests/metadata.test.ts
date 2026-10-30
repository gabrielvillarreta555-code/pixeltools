import { describe, expect, it } from 'vitest';
import { detectFormat, orientationTiff, parseTiff, readMetadata, stripMetadata } from '../src/lib/metadata';
import { crc32 } from '../src/lib/zip';

// ---- Constructores de archivos de prueba ----

type Entry = [tag: number, type: number, value: number | string | number[]];

/** TIFF little-endian con IFD0, IFD EXIF y IFD GPS. Las cadenas y racionales van en una zona de datos. */
function buildTiff(ifd0: Entry[], gps: Entry[] = [], exif: Entry[] = []): Uint8Array {
  const buffer = new Uint8Array(4096);
  const view = new DataView(buffer.buffer);
  buffer.set([0x49, 0x49, 0x2a, 0x00]);
  view.setUint32(4, 8, true);
  let dataOffset = 1024;

  const writeIfd = (offset: number, entries: Entry[]) => {
    view.setUint16(offset, entries.length, true);
    entries.forEach(([tag, type, value], index) => {
      const entry = offset + 2 + index * 12;
      view.setUint16(entry, tag, true);
      view.setUint16(entry + 2, type, true);
      if (type === 2) {
        const bytes = new TextEncoder().encode(`${value}\0`);
        view.setUint32(entry + 4, bytes.length, true);
        if (bytes.length <= 4) buffer.set(bytes, entry + 8);
        else {
          buffer.set(bytes, dataOffset);
          view.setUint32(entry + 8, dataOffset, true);
          dataOffset += bytes.length + (bytes.length % 2);
        }
      } else if (type === 5) {
        const values = value as number[];
        view.setUint32(entry + 4, values.length, true);
        view.setUint32(entry + 8, dataOffset, true);
        values.forEach((number, i) => {
          view.setUint32(dataOffset + i * 8, Math.round(number * 1000), true);
          view.setUint32(dataOffset + i * 8 + 4, 1000, true);
        });
        dataOffset += values.length * 8;
      } else if (type === 3) {
        view.setUint32(entry + 4, 1, true);
        view.setUint16(entry + 8, value as number, true);
      } else {
        view.setUint32(entry + 4, 1, true);
        view.setUint32(entry + 8, value as number, true);
      }
    });
    view.setUint32(offset + 2 + entries.length * 12, 0, true);
  };

  const ifd0Entries = [...ifd0];
  if (exif.length) ifd0Entries.push([0x8769, 4, 300]);
  if (gps.length) ifd0Entries.push([0x8825, 4, 600]);
  writeIfd(8, ifd0Entries);
  if (exif.length) writeIfd(300, exif);
  if (gps.length) writeIfd(600, gps);
  return buffer.subarray(0, dataOffset);
}

const SAMPLE_TIFF = () =>
  buildTiff(
    [
      [0x010f, 2, 'Apple'],
      [0x0110, 2, 'iPhone 13'],
      [0x0112, 3, 6],
      [0x013b, 2, 'Ana Pérez'],
      [0x0131, 2, 'Editor 1.0'],
    ],
    [
      [1, 2, 'N'],
      [2, 5, [8, 58, 59.52]],
      [3, 2, 'W'],
      [4, 5, [79, 31, 9.84]],
    ],
    [[0x9003, 2, '2026:10:29 14:30:05']],
  );

function segment(marker: number, payload: Uint8Array) {
  const length = payload.length + 2;
  return new Uint8Array([0xff, marker, length >> 8, length & 0xff, ...payload]);
}

const text = (value: string) => new TextEncoder().encode(value);
const join = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
};

const SCAN = new Uint8Array([0xff, 0xda, 0x00, 0x08, 1, 1, 0, 0, 0x3f, 0, 0x12, 0x34, 0xff, 0x00, 0x56, 0xff, 0xd9]);

function sampleJpeg({ trailing = false } = {}) {
  return join(
    new Uint8Array([0xff, 0xd8]),
    segment(0xe0, text('JFIF\0\x01\x01\0\0\x01\0\x01\0\0')),
    segment(0xe1, join(text('Exif\0\0'), SAMPLE_TIFF())),
    segment(0xe1, text('http://ns.adobe.com/xap/1.0/\0<x:xmpmeta/>')),
    segment(0xe2, text('ICC_PROFILE\0\x01\x01perfil')),
    segment(0xed, text('Photoshop 3.0\0iptc')),
    segment(0xfe, text('Tomada en mi casa')),
    segment(0xdb, new Uint8Array(65)),
    SCAN,
    trailing ? text('MPF vista previa con mas datos') : new Uint8Array(),
  );
}

function pngChunk(type: string, data: Uint8Array) {
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length);
  chunk.set(text(type), 4);
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
  return chunk;
}

function samplePng() {
  return join(
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', new Uint8Array(13)),
    pngChunk('tEXt', text('Author\0Ana Pérez')),
    pngChunk('eXIf', SAMPLE_TIFF()),
    pngChunk('iCCP', text('perfil\0\0datos')),
    pngChunk('IDAT', new Uint8Array([1, 2, 3])),
    pngChunk('tIME', new Uint8Array(7)),
    pngChunk('IEND', new Uint8Array()),
  );
}

function riff(type: string, data: Uint8Array) {
  const chunk = new Uint8Array(8 + data.length + (data.length % 2));
  chunk.set(text(type));
  new DataView(chunk.buffer).setUint32(4, data.length, true);
  chunk.set(data, 8);
  return chunk;
}

function sampleWebp() {
  const vp8x = new Uint8Array(10);
  vp8x[0] = 0x0c | 0x10; // EXIF + XMP + alfa
  const body = join(text('WEBP'), riff('VP8X', vp8x), riff('VP8L', new Uint8Array([1, 2, 3, 4, 5])), riff('EXIF', SAMPLE_TIFF()), riff('XMP ', text('<x/>')));
  const header = join(text('RIFF'), new Uint8Array(4));
  new DataView(header.buffer).setUint32(4, body.length, true);
  return join(header, body);
}

const labels = (bytes: Uint8Array) => readMetadata(bytes).entries.map((entry) => entry.label);

// ---- Pruebas ----

describe('parseTiff', () => {
  it('lee etiquetas de IFD0, EXIF y GPS', () => {
    const data = parseTiff(SAMPLE_TIFF());
    expect(data.tags.get(0x010f)).toBe('Apple');
    expect(data.tags.get(0x0112)).toBe(6);
    expect(data.exif.get(0x9003)).toBe('2026:10:29 14:30:05');
    expect(data.gps.get(1)).toBe('N');
  });

  it('tolera datos dañados sin lanzar errores', () => {
    expect(() => parseTiff(new Uint8Array([0x49, 0x49, 0x2a, 0, 0xff, 0xff, 0xff, 0x7f]))).not.toThrow();
    expect(parseTiff(new Uint8Array(3)).tags.size).toBe(0);
  });
});

describe('detectFormat', () => {
  it('reconoce el formato por su contenido', () => {
    expect(detectFormat(sampleJpeg())).toBe('jpeg');
    expect(detectFormat(samplePng())).toBe('png');
    expect(detectFormat(sampleWebp())).toBe('webp');
    expect(detectFormat(text('<svg/>'))).toBeNull();
  });
});

describe('JPEG', () => {
  it('detecta ubicación, dispositivo, fecha, autor y otros datos', () => {
    const report = readMetadata(sampleJpeg());
    expect(report.gps?.latitude).toBeCloseTo(8.9832, 3);
    expect(report.gps?.longitude).toBeCloseTo(-79.5194, 3);
    expect(report.orientation).toBe(6);
    const values = Object.fromEntries(report.entries.map((entry) => [entry.label, entry.value]));
    expect(values['Dispositivo']).toBe('Apple iPhone 13');
    expect(values['Fecha y hora']).toBe('29/10/2026 14:30');
    expect(values['Autor']).toBe('Ana Pérez');
    expect(Object.keys(values)).toEqual(expect.arrayContaining(['Ubicación GPS', 'Datos XMP', 'Datos IPTC', 'Comentario', 'Software']));
    expect(report.entries.find((entry) => entry.label === 'Ubicación GPS')?.sensitive).toBe(true);
  });

  it('elimina los metadatos, conserva perfil de color, orientación e imagen', () => {
    const original = sampleJpeg();
    const clean = stripMetadata(original);
    const report = readMetadata(clean);
    expect(report.gps).toBeNull();
    expect(report.entries).toEqual([]);
    expect(report.orientation).toBe(6);
    const decoded = new TextDecoder('latin1').decode(clean);
    expect(decoded).toContain('ICC_PROFILE');
    expect(decoded).toContain('JFIF');
    expect(decoded).not.toContain('Apple');
    expect(decoded).not.toContain('Tomada en mi casa');
    expect(Array.from(clean.subarray(-SCAN.length))).toEqual(Array.from(SCAN));
    expect(clean.length).toBeLessThan(original.length);
  });

  it('descarta las imágenes incrustadas tras el final de la imagen principal', () => {
    const original = sampleJpeg({ trailing: true });
    expect(labels(original)).toContain('Imagen adicional incrustada');
    const clean = stripMetadata(original);
    expect(Array.from(clean.subarray(-2))).toEqual([0xff, 0xd9]);
    expect(new TextDecoder('latin1').decode(clean)).not.toContain('MPF');
  });

  it('no añade EXIF si la orientación es la normal', () => {
    const tiff = buildTiff([[0x010f, 2, 'Canon']]);
    const jpeg = join(new Uint8Array([0xff, 0xd8]), segment(0xe1, join(text('Exif\0\0'), tiff)), SCAN);
    const clean = stripMetadata(jpeg);
    expect(Array.from(clean)).toEqual([0xff, 0xd8, ...SCAN]);
  });

  it('rechaza archivos dañados con un mensaje claro', () => {
    expect(() => readMetadata(new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff]))).toThrow(/dañado|incompleto/);
  });
});

describe('PNG', () => {
  it('detecta y elimina texto, EXIF y fecha manteniendo ICC y la orientación', () => {
    const original = samplePng();
    expect(labels(original)).toEqual(expect.arrayContaining(['Autor', 'Ubicación GPS', 'Fecha de modificación']));
    const clean = stripMetadata(original);
    const report = readMetadata(clean);
    expect(report.entries).toEqual([]);
    expect(report.orientation).toBe(6);
    const decoded = new TextDecoder('latin1').decode(clean);
    expect(decoded).toContain('iCCP');
    expect(decoded).not.toContain('Ana');
    expect(decoded.indexOf('eXIf')).toBeLessThan(decoded.indexOf('IDAT'));
  });
});

describe('WebP', () => {
  it('elimina EXIF y XMP, ajusta la cabecera y conserva la orientación', () => {
    const original = sampleWebp();
    expect(labels(original)).toEqual(expect.arrayContaining(['Ubicación GPS', 'Datos XMP']));
    const clean = stripMetadata(original);
    const view = new DataView(clean.buffer, clean.byteOffset, clean.byteLength);
    expect(view.getUint32(4, true)).toBe(clean.length - 8);
    expect(clean[20] & 0x04).toBe(0); // sin XMP
    expect(clean[20] & 0x10).toBe(0x10); // el alfa se conserva
    const report = readMetadata(clean);
    expect(report.gps).toBeNull();
    expect(report.orientation).toBe(6);
  });
});

describe('orientationTiff', () => {
  it('genera un TIFF mínimo legible', () => {
    expect(parseTiff(orientationTiff(8)).tags.get(0x0112)).toBe(8);
  });
});

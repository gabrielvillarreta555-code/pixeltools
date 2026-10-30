import { afterEach, describe, expect, it, vi } from 'vitest';
import { backgroundSize, prepareBackgroundImage, readImageSize } from '../src/lib/backgroundInput';
import { orientationTiff } from '../src/lib/metadata';

function png(width: number, height: number) {
  const bytes = new Uint8Array(33);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
  const view = new DataView(bytes.buffer);
  view.setUint32(8, 13);
  bytes.set([73, 72, 68, 82], 12);
  view.setUint32(16, width); view.setUint32(20, height);
  return bytes;
}

afterEach(() => vi.unstubAllGlobals());

describe('tamaño seguro para el eliminador', () => {
  it('reduce 6750 × 9000 manteniendo 3:4', () => {
    expect(backgroundSize(6750, 9000)).toEqual({ width: 1536, height: 2048 });
  });
  it.each([[9000, 6750], [4000, 4000], [32768, 1], [1, 32768], [1920, 1080]])('acota %i × %i sin ampliar', (width, height) => {
    const result = backgroundSize(width, height);
    expect(result.width * result.height).toBeLessThanOrEqual(4_000_000);
    expect(Math.max(result.width, result.height)).toBeLessThanOrEqual(2048);
    expect(result.width).toBeLessThanOrEqual(width);
    expect(result.height).toBeLessThanOrEqual(height);
    const scale = Math.min(1, 2048 / Math.max(width, height), Math.sqrt(4_000_000 / (width * height)));
    expect(Math.abs(result.width - width * scale)).toBeLessThan(1);
    expect(Math.abs(result.height - height * scale)).toBeLessThan(1);
  });
  it('conserva imágenes pequeñas', () => expect(backgroundSize(800, 600)).toEqual({ width: 800, height: 600 }));
  it.each([[0, 100], [NaN, 100], [Infinity, 1], [1.5, 100], [11000, 10000], [32769, 1]])('rechaza dimensiones inseguras %i × %i', (w, h) => {
    expect(() => backgroundSize(w, h)).toThrow();
  });
});

describe('preparación previa a la IA', () => {
  it('aplica la orientación EXIF a las dimensiones JPEG', () => {
    const exif = [69, 120, 105, 102, 0, 0, ...orientationTiff(6)];
    const bytes = new Uint8Array([
      255, 216, 255, 225, 0, exif.length + 2, ...exif,
      255, 192, 0, 8, 8, 9000 >> 8, 9000 & 255, 6750 >> 8, 6750 & 255, 1,
      255, 218, 0, 2, 255, 217,
    ]);
    expect(readImageSize(bytes)).toEqual({ width: 9000, height: 6750 });
  });
  it.each(['VP8X', 'VP8 ', 'VP8L'])('lee dimensiones WebP %s', (kind) => {
    const bytes = new Uint8Array(30);
    const view = new DataView(bytes.buffer);
    bytes.set(new TextEncoder().encode('RIFF'), 0);
    view.setUint32(4, 22, true);
    bytes.set(new TextEncoder().encode('WEBP' + kind), 8);
    view.setUint32(16, 10, true);
    if (kind === 'VP8X') {
      bytes[24] = 799 & 255; bytes[25] = 799 >> 8;
      bytes[27] = 599 & 255; bytes[28] = 599 >> 8;
    } else if (kind === 'VP8 ') {
      view.setUint16(26, 800, true); view.setUint16(28, 600, true);
    } else {
      bytes[20] = 0x2f; view.setUint32(21, 799 | (599 << 14), true);
    }
    expect(readImageSize(bytes)).toEqual({ width: 800, height: 600 });
  });
  it('lee dimensiones PNG sin decodificar píxeles', () => {
    expect(readImageSize(png(6750, 9000))).toEqual({ width: 6750, height: 9000 });
  });
  it('rechaza archivos truncados o falsificados', () => {
    for (const bytes of [new Uint8Array(), png(6750, 9000).slice(0, 20), png(0, 20)]) {
      expect(() => readImageSize(bytes)).toThrow();
    }
  });
  it('no usa un fallback de tamaño completo si no hay decodificación reducida', async () => {
    vi.stubGlobal('createImageBitmap', undefined);
    await expect(prepareBackgroundImage(new Blob([png(6750, 9000)]))).rejects.toThrow('seguridad');
  });
  it('cierra el bitmap si se cancela durante la decodificación', async () => {
    const controller = new AbortController();
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn(async (_file, options) => {
      expect(options.resizeWidth).toBe(1536);
      expect(options.resizeHeight).toBe(2048);
      controller.abort();
      return { width: 1536, height: 2048, close };
    }));
    await expect(prepareBackgroundImage(new Blob([png(6750, 9000)]), controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(close).toHaveBeenCalledOnce();
  });
  it('rechaza un navegador que ignore las opciones de tamaño', async () => {
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 6750, height: 9000, close })));
    await expect(prepareBackgroundImage(new Blob([png(6750, 9000)]))).rejects.toThrow('reducción solicitada');
    expect(close).toHaveBeenCalledOnce();
  });
  it('no inicia decodificación tras cancelar', async () => {
    const decode = vi.fn();
    vi.stubGlobal('createImageBitmap', decode);
    const controller = new AbortController(); controller.abort();
    await expect(prepareBackgroundImage(new Blob([png(100, 100)]), controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(decode).not.toHaveBeenCalled();
  });
});

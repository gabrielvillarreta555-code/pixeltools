import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAX_BACKGROUND_FILE_BYTES, backgroundSize, prepareBackgroundImage, readImageSize } from '../src/lib/backgroundInput';
import { validateImageFile } from '../src/lib/files';
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
  it('admite 108 megapíxeles y los reduce proporcionalmente', () => {
    expect(backgroundSize(9000, 12000)).toEqual({ width: 1536, height: 2048 });
    expect(readImageSize(png(9000, 12000))).toEqual({ width: 9000, height: 12000 });
    expect(() => backgroundSize(10000, 12000)).not.toThrow();
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
  it.each([[0, 100], [NaN, 100], [Infinity, 1], [1.5, 100], [11000, 11000], [32769, 1]])('rechaza dimensiones inseguras %i × %i', (w, h) => {
    expect(() => backgroundSize(w, h)).toThrow();
  });
});

describe('preparación previa a la IA', () => {
  it('lee solo cabeceras de un JPEG de 108 MP sin copiar sus 30 MB, respetando EXIF', async () => {
    const exif = [69, 120, 105, 102, 0, 0, ...orientationTiff(6)];
    const bytes = new Uint8Array([
      255, 216, 255, 225, 0, exif.length + 2, ...exif,
      255, 192, 0, 8, 8, 12000 >> 8, 12000 & 255, 9000 >> 8, 9000 & 255, 1,
      255, 218, 0, 2, 255, 217,
    ]);
    const file = new Blob([bytes, new Uint8Array(30 * 1024 * 1024)]);
    const fullRead = vi.spyOn(file, 'arrayBuffer');
    const slices = vi.spyOn(file, 'slice');
    const controller = new AbortController(), close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn(async (_file, options) => {
      expect(options.resizeWidth).toBe(2048);
      expect(options.resizeHeight).toBe(1536);
      controller.abort();
      return { width: 2048, height: 1536, close };
    }));
    await expect(prepareBackgroundImage(file, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(fullRead).not.toHaveBeenCalled();
    expect(slices).toHaveBeenCalled();
    expect(slices.mock.calls.every(([start, end]) => typeof start === 'number' && typeof end === 'number' && end - start <= 65_536)).toBe(true);
    expect(close).toHaveBeenCalledOnce();
  });
  it('rechaza JPEG truncado sin pedir al navegador que lo decodifique', async () => {
    const decode = vi.fn(); vi.stubGlobal('createImageBitmap', decode);
    const file = new Blob([new Uint8Array([255, 216, 255, 225, 0, 12, 69])]);
    await expect(prepareBackgroundImage(file)).rejects.toThrow('JPEG');
    expect(decode).not.toHaveBeenCalled();
  });
  it('detiene la lectura si hay demasiados segmentos JPEG', async () => {
    const markers = new Uint8Array(4096 * 2);
    for (let index = 0; index < markers.length; index += 2) { markers[index] = 255; markers[index + 1] = 1; }
    const file = new Blob([new Uint8Array([255, 216]), markers, new Uint8Array([255, 217])]);
    await expect(prepareBackgroundImage(file)).rejects.toThrow('demasiado complejo');
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('preserva la orientación EXIF %i al preparar un JPEG grande', async orientation => {
    const exif = [69, 120, 105, 102, 0, 0, ...orientationTiff(orientation)];
    const bytes = new Uint8Array([
      255, 216,
      255, 226, 0, 5, 1, 2, 3,
      255, 192, 0, 8, 8, 12000 >> 8, 12000 & 255, 9000 >> 8, 9000 & 255, 1,
      255, 225, 0, exif.length + 2, ...exif,
      255, 218, 0, 2, 255, 217,
    ]);
    const controller = new AbortController();
    const close = vi.fn();
    const expected = orientation >= 5 ? { width: 2048, height: 1536 } : { width: 1536, height: 2048 };
    vi.stubGlobal('createImageBitmap', vi.fn(async (_file, options) => {
      expect(options.resizeWidth).toBe(expected.width);
      expect(options.resizeHeight).toBe(expected.height);
      controller.abort();
      return { ...expected, close };
    }));
    await expect(prepareBackgroundImage(new Blob([bytes]), controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(close).toHaveBeenCalledOnce();
  });
  it('admite archivos de más de 15 MB hasta 50 MB, pero mantiene el límite', async () => {
    expect(validateImageFile({ name: 'grande.jpg', type: 'image/jpeg', size: 20 * 1024 * 1024 }, { maxBytes: MAX_BACKGROUND_FILE_BYTES })).toBeNull();
    expect(validateImageFile({ name: 'grande.jpg', type: 'image/jpeg', size: MAX_BACKGROUND_FILE_BYTES + 1 }, { maxBytes: MAX_BACKGROUND_FILE_BYTES })).toContain('50');
    const tooLarge = { size: MAX_BACKGROUND_FILE_BYTES + 1, arrayBuffer: vi.fn() } as unknown as Blob;
    await expect(prepareBackgroundImage(tooLarge)).rejects.toThrow('50 MB');
    expect(tooLarge.arrayBuffer).not.toHaveBeenCalled();
  });
  it('ofrece una indicación útil si el navegador no puede leer el archivo pesado', async () => {
    const file = { size: 20 * 1024 * 1024, arrayBuffer: vi.fn().mockRejectedValue(new RangeError('allocation')) } as unknown as Blob;
    await expect(prepareBackgroundImage(file)).rejects.toThrow('memoria');
  });
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

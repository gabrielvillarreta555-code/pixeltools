import { describe, expect, it } from 'vitest';
import { findTargetEncoding } from '../src/lib/targetCompression';

const blob = (size: number) => new Blob([new Uint8Array(size)]);

describe('compresión por tamaño objetivo', () => {
  it('elige la mayor calidad probada que cumple el objetivo', async () => {
    const seen: number[] = [];
    const result = await findTargetEncoding(async (q) => {
      seen.push(q);
      return blob(Math.round(q * 1000));
    }, 700);
    expect(result.met).toBe(true);
    expect(result.blob.size).toBeLessThanOrEqual(700);
    expect(result.quality).toBe(70);
    expect(seen.length).toBeLessThanOrEqual(9);
  });

  it('informa cuando no se alcanza el objetivo y entrega el menor resultado probado', async () => {
    const result = await findTargetEncoding(async (q) => blob(Math.round(q * 1000)), 100);
    expect(result.met).toBe(false);
    expect(result.quality).toBe(30);
    expect(result.blob.size).toBe(300);
  });

  it('retiene el resultado válido de mayor calidad incluso con tamaños no monótonos', async () => {
    const result = await findTargetEncoding(async (q) => blob(q === 0.95 ? 150 : q === 0.3 ? 50 : 200), 100);
    expect(result.met).toBe(true);
    expect(result.blob.size).toBeLessThanOrEqual(100);
  });

  it('interrumpe la búsqueda al cancelar', async () => {
    const controller = new AbortController();
    let calls = 0;
    await expect(findTargetEncoding(async () => { calls++; controller.abort(); return blob(100); }, 50, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
    expect(calls).toBe(1);
  });

  it.each([0, -1, NaN, 1.5])('rechaza el objetivo inválido %s', async (target) => {
    await expect(findTargetEncoding(async () => blob(1), target)).rejects.toThrow();
  });
});

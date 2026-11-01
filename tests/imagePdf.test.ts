import { describe, expect, it, vi } from 'vitest';
import { imagesToPdf, pageLayout, PDF_MAX_FILES, PDF_MAX_TOTAL_BYTES, validatePdfImages } from '../src/lib/imagePdf';

const valid = { name: 'foto.jpg', type: 'image/jpeg', size: 1024 };

describe('Imágenes a PDF', () => {
  it('valida formatos, cantidad y peso sin leer las imágenes', () => {
    expect(validatePdfImages([valid])).toBeNull();
    expect(validatePdfImages([])).toContain('al menos');
    expect(validatePdfImages(Array(PDF_MAX_FILES + 1).fill(valid))).toContain('10');
    expect(validatePdfImages([{ ...valid, type: 'image/svg+xml' }])).toContain('Formato');
    expect(validatePdfImages([{ ...valid, size: 51 * 1024 * 1024 }])).toContain('50');
    expect(validatePdfImages([{ ...valid, size: 45 * 1024 * 1024 }, { ...valid, size: PDF_MAX_TOTAL_BYTES }])).toContain('80');
  });
  it('conserva proporción, márgenes y orientación para A4 y carta', () => {
    const portrait = pageLayout(900, 1200, 'a4');
    expect(portrait.pageWidth).toBeLessThan(portrait.pageHeight);
    expect(portrait.imageWidth / portrait.imageHeight).toBeCloseTo(900 / 1200);
    expect(portrait.x).toBeGreaterThanOrEqual(18); expect(portrait.y).toBeGreaterThanOrEqual(18);
    const landscape = pageLayout(1600, 800, 'carta');
    expect(landscape.pageWidth).toBeGreaterThan(landscape.pageHeight);
    expect(landscape.imageWidth / landscape.imageHeight).toBeCloseTo(2);
    expect(() => pageLayout(0, 1, 'a4')).toThrow();
  });
  it('respeta cancelación antes de cargar dependencias o abrir archivos', async () => {
    const abort = new AbortController(); abort.abort(); const progress = vi.fn();
    await expect(imagesToPdf([new File(['x'], 'x.jpg', { type: 'image/jpeg' })], 'a4', abort.signal, progress)).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress).not.toHaveBeenCalled();
  });
});

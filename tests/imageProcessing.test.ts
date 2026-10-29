import { describe, expect, it } from 'vitest';
import { fitWithin, ImageProcessingError, validateDimensions } from '../src/lib/imageProcessing';

describe('validateDimensions', () => {
  it('acepta una imagen dentro del límite', () => {
    expect(() => validateDimensions(6000, 4000)).not.toThrow();
  });

  it('rechaza imágenes con demasiados píxeles', () => {
    expect(() => validateDimensions(8000, 5000)).toThrow(ImageProcessingError);
  });

  it('rechaza dimensiones inválidas o lados desproporcionados', () => {
    expect(() => validateDimensions(0, 100)).toThrow(/dimensiones válidas/);
    expect(() => validateDimensions(13000, 10)).toThrow(/demasiado grande/);
  });
});

describe('fitWithin', () => {
  it('reduce proporcionalmente al lado mayor', () => {
    expect(fitWithin(4000, 3000, 1920)).toEqual({ width: 1920, height: 1440, resized: true });
    expect(fitWithin(1000, 4000, 800)).toEqual({ width: 200, height: 800, resized: true });
  });

  it('no amplía ni modifica sin límite', () => {
    expect(fitWithin(800, 600, 1920)).toEqual({ width: 800, height: 600, resized: false });
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600, resized: false });
  });

  it('nunca devuelve dimensiones nulas', () => {
    expect(fitWithin(10000, 1, 100)).toEqual({ width: 100, height: 1, resized: true });
  });
});

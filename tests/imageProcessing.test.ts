import { describe, expect, it } from 'vitest';
import { ImageProcessingError, validateDimensions } from '../src/lib/imageProcessing';

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

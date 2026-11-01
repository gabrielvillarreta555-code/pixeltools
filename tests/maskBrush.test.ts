import { describe, expect, it } from 'vitest';
import { maskPoint } from '../src/lib/maskBrush';

describe('coordenadas del pincel', () => {
  const rect = { left: 20, top: 30, width: 300, height: 400 };
  it('convierte coordenadas táctiles de pantalla a píxeles de la imagen', () => {
    expect(maskPoint(170, 230, rect, 1500, 2000)).toEqual({ x: 750, y: 1000 });
  });
  it('mantiene puntos fuera de los bordes dentro del lienzo', () => {
    expect(maskPoint(-10, 1000, rect, 1500, 2000)).toEqual({ x: 0, y: 1999 });
  });
  it('evita divisiones inválidas cuando el área aún no tiene tamaño', () => {
    expect(maskPoint(1, 1, { ...rect, width: 0 }, 100, 100)).toEqual({ x: 0, y: 0 });
  });
});

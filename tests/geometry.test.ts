import { describe, expect, it } from 'vitest';
import { findAlphaBounds, padBox, scaleBox } from '../src/lib/geometry';

function alphaMap(width: number, height: number, opaque: Array<[number, number]>) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (const [x, y] of opaque) data[(y * width + x) * 4 + 3] = 255;
  return data;
}

describe('findAlphaBounds', () => {
  it('encuentra el rectángulo de los píxeles visibles', () => {
    const data = alphaMap(10, 8, [[2, 3], [6, 5], [4, 1]]);
    expect(findAlphaBounds(data, 10, 8)).toEqual({ x: 2, y: 1, width: 5, height: 5 });
  });

  it('ignora el alfa por debajo del umbral y devuelve null si no hay sujeto', () => {
    const data = alphaMap(4, 4, []);
    data[3] = 10;
    expect(findAlphaBounds(data, 4, 4)).toBeNull();
  });
});

describe('scaleBox', () => {
  it('escala redondeando hacia fuera y sin salir del lienzo', () => {
    expect(scaleBox({ x: 1, y: 1, width: 2, height: 2 }, 4, 4, 10, 10)).toEqual({ x: 2, y: 2, width: 6, height: 6 });
    expect(scaleBox({ x: 0, y: 0, width: 4, height: 4 }, 4, 4, 9, 7)).toEqual({ x: 0, y: 0, width: 9, height: 7 });
  });
});

describe('padBox', () => {
  it('añade margen y lo limita a los bordes', () => {
    expect(padBox({ x: 10, y: 10, width: 100, height: 50 }, 200, 200, 0.1)).toEqual({ x: 0, y: 0, width: 120, height: 70 });
    expect(padBox({ x: 50, y: 50, width: 100, height: 100 }, 400, 400, 0.1)).toEqual({ x: 40, y: 40, width: 120, height: 120 });
  });
});

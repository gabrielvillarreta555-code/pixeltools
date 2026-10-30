import { describe, expect, it } from 'vitest';
import { centeredRect, MIN_CROP, moveRect, resizeRect, rotatedSize, roundRect } from '../src/lib/crop';
import { keepAspect, planFit, validateTargetSize } from '../src/lib/resize';
import { filterTools, TOOLS } from '../src/lib/tools';

describe('planFit', () => {
  it('cover rellena el lienzo recortando lo que sobra, centrado', () => {
    expect(planFit(4000, 3000, 1080, 1080, 'cover')).toEqual({ sx: 500, sy: 0, sw: 3000, sh: 3000, dx: 0, dy: 0, dw: 1080, dh: 1080 });
  });

  it('contain muestra la imagen entera centrada con bordes', () => {
    expect(planFit(4000, 2000, 1000, 1000, 'contain')).toEqual({ sx: 0, sy: 0, sw: 4000, sh: 2000, dx: 0, dy: 250, dw: 1000, dh: 500 });
  });

  it('stretch ocupa todo el lienzo sin conservar la proporción', () => {
    expect(planFit(100, 50, 30, 90, 'stretch')).toMatchObject({ dw: 30, dh: 90, sw: 100, sh: 50 });
  });
});

describe('keepAspect y validateTargetSize', () => {
  it('calcula el otro lado conservando la proporción', () => {
    expect(keepAspect(4000, 3000, 'width', 1200)).toEqual({ width: 1200, height: 900 });
    expect(keepAspect(4000, 3000, 'height', 600)).toEqual({ width: 800, height: 600 });
  });

  it('valida medidas enteras dentro de los límites', () => {
    expect(validateTargetSize(1080, 1080)).toBeNull();
    expect(validateTargetSize(0, 100)).toMatch(/mayores que cero/);
    expect(validateTargetSize(10.5, 100)).toMatch(/enteros/);
    expect(validateTargetSize(9000, 100)).toMatch(/como máximo/);
    expect(validateTargetSize(5000, 5000)).toMatch(/16 megapíxeles/);
  });
});

describe('recorte', () => {
  it('centra el rectángulo más grande con la proporción pedida', () => {
    expect(centeredRect(4000, 3000, 1)).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
    expect(centeredRect(1000, 2000, 16 / 9)).toEqual({ x: 0, y: 718.75, width: 1000, height: 562.5 });
    expect(centeredRect(800, 600, null)).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('mueve sin salirse de la imagen', () => {
    const rect = { x: 100, y: 100, width: 200, height: 200 };
    expect(moveRect(rect, 5000, -5000, 1000, 800)).toEqual({ x: 800, y: 0, width: 200, height: 200 });
  });

  it('redimensiona desde una esquina dejando fija la opuesta', () => {
    const rect = { x: 100, y: 100, width: 200, height: 200 };
    expect(resizeRect(rect, 'se', 50, 30, null, 1000, 1000)).toEqual({ x: 100, y: 100, width: 250, height: 230 });
    expect(resizeRect(rect, 'nw', -50, -20, null, 1000, 1000)).toEqual({ x: 50, y: 80, width: 250, height: 220 });
  });

  it('mantiene la proporción y el límite de la imagen', () => {
    const rect = { x: 100, y: 100, width: 200, height: 200 };
    const square = resizeRect(rect, 'se', 2000, 10, 1, 1000, 600);
    expect(square.width).toBeCloseTo(square.height);
    expect(square.x + square.width).toBeLessThanOrEqual(1000);
    expect(square.y + square.height).toBeLessThanOrEqual(600);
    expect(square).toMatchObject({ x: 100, y: 100, width: 500, height: 500 });
  });

  it('respeta el tamaño mínimo', () => {
    const rect = { x: 100, y: 100, width: 200, height: 200 };
    const tiny = resizeRect(rect, 'se', -1000, -1000, null, 1000, 1000);
    expect(tiny.width).toBe(MIN_CROP);
    expect(tiny.height).toBe(MIN_CROP);
  });

  it('redondea a píxeles enteros dentro de la imagen y calcula el giro', () => {
    expect(roundRect({ x: 10.4, y: -2, width: 999.9, height: 50.5 }, 1000, 100)).toEqual({ x: 10, y: 0, width: 990, height: 51 });
    expect(rotatedSize(4000, 3000, 1)).toEqual({ width: 3000, height: 4000 });
    expect(rotatedSize(4000, 3000, 2)).toEqual({ width: 4000, height: 3000 });
  });
});

describe('filterTools', () => {
  it('busca sin distinguir tildes ni mayúsculas', () => {
    expect(filterTools(TOOLS, 'UBICACION').map((tool) => tool.name)).toContain('Quitar metadatos');
    expect(filterTools(TOOLS, 'instagram').map((tool) => tool.name)).toEqual(['Redimensionar']);
    expect(filterTools(TOOLS, '')).toHaveLength(TOOLS.length);
    expect(filterTools(TOOLS, 'xyz123')).toEqual([]);
  });
});

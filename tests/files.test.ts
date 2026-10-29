import { describe, expect, it } from 'vitest';
import { formatBytes, makeOutputName, reductionPercent, validateImageFile } from '../src/lib/files';

describe('formatBytes', () => {
  it('formatea bytes y megabytes de forma legible', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1,00 KB');
    expect(formatBytes(1024 * 1024)).toBe('1,00 MB');
  });
});

describe('reductionPercent', () => {
  it('calcula reducciones y aumentos', () => {
    expect(reductionPercent(1000, 250)).toBe(75);
    expect(reductionPercent(1000, 1250)).toBe(-25);
  });
});

describe('validateImageFile', () => {
  const options = { maxBytes: 1000 };

  it('acepta un tipo permitido dentro del límite', () => {
    expect(validateImageFile({ size: 800, type: 'image/png', name: 'foto.png' }, options)).toBeNull();
  });

  it('rechaza tipos incompatibles y archivos grandes', () => {
    expect(validateImageFile({ size: 200, type: 'image/svg+xml', name: 'vector.svg' }, options)).toContain('Formato');
    expect(validateImageFile({ size: 1001, type: 'image/jpeg', name: 'foto.jpg' }, options)).toContain('límite');
  });

  it('rechaza archivos vacíos', () => {
    expect(validateImageFile({ size: 0, type: 'image/png', name: 'vacio.png' }, options)).toContain('vacío');
  });
});

describe('makeOutputName', () => {
  it('sustituye la extensión y limpia el nombre', () => {
    expect(makeOutputName('mi foto.final.PNG', 'image/webp')).toBe('mi-foto-final-optimizada.webp');
  });
});

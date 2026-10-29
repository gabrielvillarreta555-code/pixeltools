import { describe, expect, it } from 'vitest';
import { crc32, createZip, uniqueNames } from '../src/lib/zip';

describe('crc32', () => {
  it('coincide con el valor de referencia', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });
});

describe('uniqueNames', () => {
  it('numera los nombres repetidos sin distinguir mayúsculas', () => {
    expect(uniqueNames(['a.jpg', 'A.jpg', 'a.jpg', 'b'])).toEqual(['a.jpg', 'A (2).jpg', 'a (3).jpg', 'b']);
  });
});

describe('createZip', () => {
  it('genera un ZIP con cabeceras, directorio central y datos intactos', async () => {
    const zip = await createZip([
      { name: 'foto-ñ.jpg', data: new Blob([new Uint8Array([1, 2, 3])]), modified: new Date(2026, 9, 29, 12, 30, 10) },
      { name: 'foto-ñ.jpg', data: new Blob(['hola']) },
    ]);
    const bytes = new Uint8Array(await zip.arrayBuffer());
    const view = new DataView(bytes.buffer);
    expect(zip.type).toBe('application/zip');
    expect(view.getUint32(0, true)).toBe(0x04034b50);

    const end = bytes.length - 22;
    expect(view.getUint32(end, true)).toBe(0x06054b50);
    expect(view.getUint16(end + 10, true)).toBe(2);
    const centralOffset = view.getUint32(end + 16, true);
    expect(view.getUint32(centralOffset, true)).toBe(0x02014b50);

    const nameLength = view.getUint16(26, true);
    const name = new TextDecoder().decode(bytes.subarray(30, 30 + nameLength));
    expect(name).toBe('foto-ñ.jpg');
    expect(Array.from(bytes.subarray(30 + nameLength, 33 + nameLength))).toEqual([1, 2, 3]);
    expect(new TextDecoder().decode(bytes)).toContain('foto-ñ (2).jpg');
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('comunicación de privacidad', () => {
  it('no afirma ausencia general de rastreo y explica los recursos sin conexión', () => {
    const home = readFileSync('src/pages/HomePage.tsx', 'utf8');
    const contact = readFileSync('src/pages/ContactPage.tsx', 'utf8');
    expect(home).not.toContain('Sin anuncios ni rastreo');
    expect(home).toContain('Sin conexión tras descargar recursos');
    expect(contact).not.toContain('Canal sin seguimiento');
  });
  it('documenta la medición observada y que requiere revisión', () => {
    const privacy = readFileSync('src/pages/PrivacyPage.tsx', 'utf8');
    expect(privacy).toContain('Cloudflare Web Analytics');
    expect(privacy).toContain('deben verificarse con Cloudflare');
    expect(privacy).toContain('requiere revisión jurídica');
  });
});

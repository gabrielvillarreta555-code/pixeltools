import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { onRequest } from '../functions/_middleware';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

function build(env: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'velix-seo-')); roots.push(root);
  mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'dist'));
  copyFileSync(resolve('scripts/generate-static-pages.mjs'), join(root, 'scripts/generate-static-pages.mjs'));
  copyFileSync(resolve('index.html'), join(root, 'dist/index.html'));
  copyFileSync(resolve('public/_headers'), join(root, 'dist/_headers'));
  const cleanEnv = { ...process.env, SITE_URL: '', VITE_SITE_URL: '', CF_PAGES: '', CF_PAGES_BRANCH: '', CF_PAGES_URL: '', ...env };
  execFileSync(process.execPath, [join(root, 'scripts/generate-static-pages.mjs')], { env: cleanEnv });
  return (file: string) => readFileSync(join(root, 'dist', file), 'utf8');
}

describe('SEO estático', () => {
  it('genera las diez rutas indexables para la rama de producción de Cloudflare', () => {
    const read = build({ CF_PAGES: '1', CF_PAGES_BRANCH: 'main', CF_PAGES_URL: 'https://build.pixeltools.pages.dev' });
    expect(read('robots.txt')).toBe('User-agent: *\nAllow: /\nSitemap: https://velixblue.com/sitemap.xml\n');
    expect(read('_headers')).not.toMatch(/X-Robots-Tag/i);
    const paths = ['', 'eliminar-fondo', 'comprimir-imagen', 'redimensionar-imagen', 'convertir-imagen', 'recortar-imagen', 'quitar-metadatos', 'privacidad', 'terminos', 'contacto'];
    const sitemap = read('sitemap.xml');
    expect(sitemap.match(/<loc>/g)).toHaveLength(paths.length);
    for (const path of paths) {
      const url = `https://velixblue.com/${path}`;
      const html = read(path ? `${path}.html` : 'index.html');
      expect(sitemap).toContain(`<loc>${url}</loc>`);
      expect(html).toContain(`rel="canonical" href="${url}"`);
      expect(html).toContain('name="robots" content="index,follow,max-image-preview:large"');
    }
    expect(read('404.html')).toContain('name="robots" content="noindex,follow"');
  });

  it.each<Record<string, string>>([
    { CF_PAGES: '1', CF_PAGES_BRANCH: 'feature', SITE_URL: 'https://velixblue.com', CF_PAGES_URL: 'https://feature.pixeltools.pages.dev' },
    { CF_PAGES: '1', CF_PAGES_BRANCH: '', SITE_URL: 'https://velixblue.com', CF_PAGES_URL: 'https://preview.pixeltools.pages.dev' },
    { SITE_URL: 'https://example.com' },
    {},
  ])('mantiene bloqueado el build de prueba %#', (env) => {
    const read = build(env);
    expect(read('robots.txt')).toContain('Disallow: /');
    expect(read('_headers')).toContain('X-Robots-Tag: noindex, nofollow');
    expect(read('index.html')).toContain('name="robots" content="noindex,nofollow"');
    expect(() => read('sitemap.xml')).toThrow();
  });
  it('permite verificar el build de producción local explícitamente', () => {
    const read = build({ SITE_URL: 'https://velixblue.com/' });
    expect(read('robots.txt')).toContain('Allow: /');
  });
});

describe('protección por dominio en Cloudflare Pages', () => {
  const next = async () => new Response('contenido', { status: 200, headers: { 'Cross-Origin-Opener-Policy': 'same-origin' } });
  it('conserva las cabeceras y el indexado en el dominio oficial', async () => {
    const result = await onRequest({ request: new Request('https://velixblue.com/'), next });
    expect(result.headers.get('X-Robots-Tag')).toBeNull();
    expect(result.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
  });
  it('bloquea robots y añade noindex en el alias pages.dev de un build de producción', async () => {
    const result = await onRequest({ request: new Request('https://build.pixeltools.pages.dev/robots.txt'), next });
    expect(await result.text()).toContain('Disallow: /');
    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    const page = await onRequest({ request: new Request('https://build.pixeltools.pages.dev/comprimir-imagen'), next });
    expect(page.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(page.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
  });
});

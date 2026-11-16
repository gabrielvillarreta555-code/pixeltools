import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error Node-only build module has no declaration file
import { parseArticle, loadArticles, markdown } from '../scripts/editorial/content.mjs';
// @ts-expect-error Browser module is also pure-testable without DOM
import { searchItems } from '../public/editorial/search.js';
// @ts-expect-error Node-only template
import { jsonLd } from '../scripts/editorial/template.mjs';
const sample = readFileSync('content/juegos/01-roblox-280.md', 'utf8');
describe('contenido editorial', () => {
  it('publica diez consultas verificadas con rutas y relacionados únicos', async () => {
    const articles = await loadArticles();
    expect(articles).toHaveLength(10);
    expect(new Set(articles.map((a: { path: string }) => a.path)).size).toBe(10);
    expect(articles.every((a: { html: string }) => a.html.includes('<h2>'))).toBe(true);
  });
  it.each([
    ['"roblox"', '"../secrets"'],
    ['"published"', '"scheduled"'],
    ['"2026-11-16"', '"9999-11-16"'],
    ['"2026-11-16"', '"2026-02-30"'],
    ['https://en.help.roblox.com', 'javascript:alert(1)//'],
  ])('rechaza metadatos peligrosos o inválidos %s', (from, to) => {
    expect(() => parseArticle(sample.replace(from, to))).toThrow();
  });
  it('rechaza H1 del cuerpo y JSON inválido', () => {
    expect(() => parseArticle(sample.replace('## Primero', '# Primero'))).toThrow();
    expect(() => parseArticle(sample.replace('"id":', 'id:'))).toThrow();
  });
  it('escapa HTML y bloquea enlaces ejecutables y recursos remotos', () => {
    const html = markdown.render('<script>alert(1)</script>\n[x](javascript:alert(1))\n![x](https://evil.example/image.png)');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('<img');
  });
  it('el JSON-LD no permite cerrar script', () => {
    expect(jsonLd({ headline: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
  it('filtra sin tildes y conserva keywords anteriores de herramientas', () => {
    const items = [{ title: 'Redimensionar', description: 'Medidas', category: 'Herramienta', keywords: 'instagram' }, { title: 'Cómo activar coordenadas', description: 'Minecraft', category: 'Juego' }];
    expect(searchItems(items, 'COMO coordenadas')).toEqual([items[1]]);
    expect(searchItems(items, 'instagram')).toEqual([items[0]]);
    expect(searchItems(items, '  ')).toEqual([]);
    expect(searchItems(items, 'no existe')).toEqual([]);
  });
});

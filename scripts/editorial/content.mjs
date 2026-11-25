import { readdir, readFile } from 'node:fs/promises';
import MarkdownIt from 'markdown-it';

import { themes } from './themes.mjs';
export const games = Object.fromEntries(Object.entries(themes).map(([id, theme]) => [id, theme.name]));
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });
// Editorial images require an explicit licensing/optimization pipeline. No remote embeds in MVP.
markdown.disable('image');
const originalValidateLink = markdown.validateLink;
markdown.validateLink = url => originalValidateLink(url) && (/^https:\/\//i.test(url) || /^\/(?!\/)/.test(url) || /^#[\w-]+$/.test(url));

const renderFence = markdown.renderer.rules.fence;
markdown.renderer.rules.fence = (tokens, index, options, env, renderer) => {
  const token = tokens[index];
  if (token.info.trim() !== 'elixir-costes') return renderFence(tokens, index, options, env, renderer);

  const rows = token.content.trim().split('\n').map(line => {
    const match = /^([^|]+)\|\s*([1-9])$/.exec(line.trim());
    if (!match || !match[1].trim()) throw new Error('Gráfico de elixir: se esperaba una carta y su coste base');
    return { name: match[1].trim(), total: 2 * Number(match[2]) + 1 };
  });
  const scale = Math.max(...rows.map(row => row.total));
  return `<figure class="elixir-chart">
    <figcaption>Coste total de jugar la carta y copiarla</figcaption>
    <ul>${rows.map(({ name, total }) => `<li>
      <span>${escapeHtml(name)}</span>
      <meter min="0" max="${scale}" value="${total}" aria-hidden="true"></meter>
      <strong>${total} de elixir</strong>
    </li>`).join('')}</ul>
  </figure>`;
};

export function parseArticle(source, name = 'article') {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) throw new Error(`${name}: requiere frontmatter JSON y Markdown`);
  const data = JSON.parse(match[1]);
  const required = ['id', 'slug', 'game', 'title', 'description', 'answer', 'reviewedAt', 'status', 'scope', 'kind', 'publishedAt', 'cover', 'coverAlt'];
  for (const key of required) if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${name}: ${key} inválido`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || !/^[a-z0-9-]+$/.test(data.id) || !Object.hasOwn(games, data.game)) throw new Error(`${name}: ruta inválida`);
  if (!['published', 'draft'].includes(data.status)) throw new Error(`${name}: estado inválido`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedAt) || new Date(data.reviewedAt).toISOString().slice(0, 10) !== data.reviewedAt || data.reviewedAt > new Date().toISOString().slice(0, 10)) throw new Error(`${name}: fecha inválida`);
  if (!Array.isArray(data.sources) || !data.sources.length || data.sources.some(s => typeof s.label !== 'string' || !s.label.trim() || typeof s.supports !== 'string' || !s.supports.trim() || !/^https:\/\//.test(s.url) || new URL(s.url).username || new URL(s.url).password)) throw new Error(`${name}: fuentes inválidas`);
  if (!Array.isArray(data.related) || data.related.length < 1 || data.related.some(id => typeof id !== 'string' || id === data.id)) throw new Error(`${name}: relacionados inválidos`);
  if (!['noticia','actualizacion','estrategia','guia','analisis'].includes(data.kind)) throw new Error(`${name}: tipo inválido`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt) || new Date(data.publishedAt).toISOString().slice(0,10) !== data.publishedAt || data.publishedAt > data.reviewedAt) throw new Error(`${name}: publicación inválida`);
  if (!/^[a-z0-9-]+$/.test(data.cover)) throw new Error(`${name}: portada inválida`);
  const body = match[2].trim();
  const tokens = markdown.parse(body, {});
  if (tokens.some(t => t.type === 'heading_open' && t.tag === 'h1') || !tokens.some(t => t.type === 'heading_open' && t.tag === 'h2')) throw new Error(`${name}: usar secciones H2, no H1`);
  return { ...data, body, html: markdown.render(body), path: `/juegos/${data.game}/${data.slug}` };
}

export async function loadArticles(directory = new URL('../../content/juegos/', import.meta.url)) {
  const names = (await readdir(directory)).filter(n => n.endsWith('.md')).sort();
  const all = await Promise.all(names.map(async name => parseArticle(await readFile(new URL(name, directory), 'utf8'), name)));
  for (const key of ['id', 'path', 'title', 'description']) if (new Set(all.map(a => a[key])).size !== all.length) throw new Error(`Contenido duplicado: ${key}`);
  const articles = all.filter(a => a.status === 'published').sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
  for (const a of articles) for (const id of a.related) if (!articles.some(other => other.id === id)) throw new Error(`${a.id}: relacionado no publicado ${id}`);
  return articles;
}

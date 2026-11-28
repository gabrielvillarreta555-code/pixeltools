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
  if (token.info.trim() === 'flujo') return renderFlow(token.content);
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

// Secciones transversales (VX-STR-001). Un artículo puede pertenecer a un juego
// (/juegos/{juego}/{slug}) o, si no tiene juego propio, vivir en /{sección}/{slug}.
export const hubs = { rendimiento: 'Rendimiento', tecnologia: 'Tecnología' };
// Tipos que hablan de dispositivos: exigen declarar si hubo prueba propia.
export const deviceKinds = ['comparativa', 'compra'];
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value;
const text = value => typeof value === 'string' && value.trim().length > 0;
const httpsUrl = value => typeof value === 'string' && /^https:\/\//.test(value) && !new URL(value).username && !new URL(value).password;
export const PRICE_MAX_AGE_DAYS = 90;

// Diagrama de pasos accesible y sin JavaScript: primera línea «# Título», después «Paso | explicación».
const renderFlow = content => {
  const [head, ...lines] = content.trim().split('\n');
  const caption = /^#\s+(.+)$/.exec(head.trim());
  if (!caption || lines.length < 2) throw new Error('Diagrama: se esperaba «# Título» y al menos dos pasos');
  const steps = lines.map(line => {
    const match = /^([^|]+)\|\s*(.+)$/.exec(line.trim());
    if (!match) throw new Error('Diagrama: cada paso usa «Paso | explicación»');
    return { step: match[1].trim(), detail: match[2].trim() };
  });
  return `<figure class="flow-chart"><figcaption>${escapeHtml(caption[1])}</figcaption><ol>${steps.map(({ step, detail }) => `<li><strong>${escapeHtml(step)}</strong><span>${escapeHtml(detail)}</span></li>`).join('')}</ol></figure>`;
};

// En móvil las tablas se muestran como fichas: cada celda lleva la etiqueta de su columna.
export const labelTables = html => html.replace(/<table>([\s\S]*?)<\/table>/g, (table, inner) => {
  const heads = [...(inner.match(/<thead>[\s\S]*?<\/thead>/)?.[0] ?? '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  if (!heads.length) return table;
  const body = inner.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells) => { let i = 0; return `<tr>${cells.replace(/<td([^>]*)>/g, (m, attrs) => `<td${attrs} data-label="${heads[i++] ?? ''}">`)}</tr>`; });
  return `<table class="stack">${body}</table>`;
});

export function parseArticle(source, name = 'article', { today = new Date().toISOString().slice(0, 10) } = {}) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) throw new Error(`${name}: requiere frontmatter JSON y Markdown`);
  const data = JSON.parse(match[1]);
  const required = ['id', 'slug', 'title', 'description', 'answer', 'reviewedAt', 'status', 'scope', 'kind', 'publishedAt', 'cover', 'coverAlt'];
  for (const key of required) if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${name}: ${key} inválido`);
  if (data.section !== undefined && !Object.hasOwn(hubs, data.section)) throw new Error(`${name}: sección inválida`);
  if (data.game === undefined) {
    // Sin juego propio solo se admite en una sección transversal, y la pieza
    // debe nombrar los videojuegos con los que se relaciona (no tecnología generalista).
    if (!data.section) throw new Error(`${name}: requiere game o section`);
    if (!Array.isArray(data.games) || !data.games.length || data.games.some(g => !text(g))) throw new Error(`${name}: games debe nombrar al menos un videojuego`);
  } else if (typeof data.game !== 'string' || !Object.hasOwn(games, data.game)) throw new Error(`${name}: ruta inválida`);
  if (data.section === 'tecnologia' && (!Array.isArray(data.games) || !data.games.length || data.games.some(g => !text(g)))) throw new Error(`${name}: games debe nombrar al menos un videojuego`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || !/^[a-z0-9-]+$/.test(data.id)) throw new Error(`${name}: ruta inválida`);
  if (!['published', 'draft'].includes(data.status)) throw new Error(`${name}: estado inválido`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedAt) || new Date(data.reviewedAt).toISOString().slice(0, 10) !== data.reviewedAt || data.reviewedAt > new Date().toISOString().slice(0, 10)) throw new Error(`${name}: fecha inválida`);
  if (!Array.isArray(data.sources) || !data.sources.length || data.sources.some(s => typeof s.label !== 'string' || !s.label.trim() || typeof s.supports !== 'string' || !s.supports.trim() || !/^https:\/\//.test(s.url) || new URL(s.url).username || new URL(s.url).password)) throw new Error(`${name}: fuentes inválidas`);
  if (!Array.isArray(data.related) || data.related.length < 1 || data.related.some(id => typeof id !== 'string' || id === data.id)) throw new Error(`${name}: relacionados inválidos`);
  if (!['noticia','actualizacion','estrategia','guia','analisis',...deviceKinds].includes(data.kind)) throw new Error(`${name}: tipo inválido`);
  if (deviceKinds.includes(data.kind) && !data.section) throw new Error(`${name}: ${data.kind} requiere una sección transversal`);
  if (deviceKinds.includes(data.kind) || data.section === 'tecnologia') {
    // No afirmar pruebas que no se han hecho: la declaración es obligatoria y visible.
    if (typeof data.handsOn !== 'boolean') throw new Error(`${name}: handsOn debe declarar si hubo prueba propia`);
    if (data.handsOn && !text(data.methodology)) throw new Error(`${name}: una prueba propia requiere methodology`);
  }
  if (data.kind === 'compra' && (!Array.isArray(data.prices) || !data.prices.length)) throw new Error(`${name}: una guía de compra requiere precios observados`);
  if (data.prices !== undefined) {
    if (!Array.isArray(data.prices)) throw new Error(`${name}: precios inválidos`);
    for (const p of data.prices) {
      // Cada precio identifica producto, mercado (ISO 3166-1), moneda (ISO 4217), tienda, enlace y fecha.
      if (!text(p.item) || typeof p.amount !== 'number' || !(p.amount > 0) || !/^[A-Z]{3}$/.test(p.currency ?? '') || !/^[A-Z]{2}$/.test(p.market ?? '') || !text(p.retailer) || !httpsUrl(p.url) || !isoDate(p.observedAt)) throw new Error(`${name}: precio inválido`);
      if (p.observedAt > data.reviewedAt) throw new Error(`${name}: precio observado después de la revisión`);
      if ((Date.parse(today) - Date.parse(p.observedAt)) / 86400000 > PRICE_MAX_AGE_DAYS) throw new Error(`${name}: precio de ${p.observedAt} con más de ${PRICE_MAX_AGE_DAYS} días; volver a comprobarlo`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt) || new Date(data.publishedAt).toISOString().slice(0,10) !== data.publishedAt || data.publishedAt > data.reviewedAt) throw new Error(`${name}: publicación inválida`);
  if (!/^[a-z0-9-]+$/.test(data.cover)) throw new Error(`${name}: portada inválida`);
  const body = match[2].trim();
  const tokens = markdown.parse(body, {});
  if (tokens.some(t => t.type === 'heading_open' && t.tag === 'h1') || !tokens.some(t => t.type === 'heading_open' && t.tag === 'h2')) throw new Error(`${name}: usar secciones H2, no H1`);
  return { ...data, body, html: labelTables(markdown.render(body)), path: data.game ? `/juegos/${data.game}/${data.slug}` : `/${data.section}/${data.slug}` };
}

// Un artículo con fuentes de consulta asistida (p. ej., mediante ChatGPT) necesita revisión humana
// antes de llegar a producción. Se marca como revisado con "humanReview": "done".
export const ASSISTED = /Consulta asistida/i;
export const needsHumanReview = a => a.humanReview !== 'done' && a.sources.some(s => ASSISTED.test(s.supports));
const stripLinks = (html, paths) => html.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, (link, href, text) => paths.has(href) ? text : link);

// includeDrafts solo se usa en vistas previas no indexables para revisar borradores.
// production excluye los artículos pendientes de revisión humana y retira los enlaces hacia ellos.
export async function loadArticles(directory = new URL('../../content/juegos/', import.meta.url), { includeDrafts = false, production = false } = {}) {
  const names = (await readdir(directory)).filter(n => n.endsWith('.md')).sort();
  const all = await Promise.all(names.map(async name => parseArticle(await readFile(new URL(name, directory), 'utf8'), name)));
  for (const key of ['id', 'path', 'title', 'description']) if (new Set(all.map(a => a[key])).size !== all.length) throw new Error(`Contenido duplicado: ${key}`);
  for (const a of all) if (a.humanReview !== undefined && !['done', 'pending'].includes(a.humanReview)) throw new Error(`${a.id}: humanReview inválido`);
  if (production && includeDrafts) throw new Error('Los borradores no pueden entrar en un build de producción');
  let articles = all.filter(a => a.status === 'published' || (includeDrafts && a.status === 'draft')).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
  for (const a of articles) for (const id of a.related) if (!articles.some(other => other.id === id)) throw new Error(`${a.id}: relacionado no publicado ${id}`);
  if (production) {
    const held = new Set(articles.filter(needsHumanReview).map(a => a.path));
    const heldIds = new Set(articles.filter(needsHumanReview).map(a => a.id));
    articles = articles.filter(a => !held.has(a.path)).map(a => ({ ...a, related: a.related.filter(id => !heldIds.has(id)), html: stripLinks(a.html, held) }));
  }
  return articles;
}

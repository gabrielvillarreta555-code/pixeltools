import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

// Solo un dominio configurado permite indexar. Sin él (despliegue de prueba en
// *.pages.dev o build local) se usa la URL que Cloudflare Pages da al despliegue
// y todo el sitio se marca noindex: robots.txt, meta robots y X-Robots-Tag.
const configuredUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '');
const indexable = Boolean(configuredUrl);
const siteUrl = configuredUrl || (process.env.CF_PAGES_URL || 'http://localhost:4173').replace(/\/$/, '');
const robotsMeta = indexable ? 'index,follow,max-image-preview:large' : 'noindex,nofollow';
const dist = new URL('../dist/', import.meta.url);
// index.html usa https://pixeltools.pages.dev como marcador en desarrollo.
const template = (await readFile(new URL('index.html', dist), 'utf8'))
  .replaceAll('https://pixeltools.pages.dev', siteUrl)
  .replace('content="index,follow,max-image-preview:large"', `content="${robotsMeta}"`);

const pages = [
  {
    path: '/',
    title: 'PixelTools — Herramientas de imagen privadas y gratuitas',
    description: 'Comprime imágenes y elimina fondos directamente en tu navegador. Gratis, rápido y privado.',
  },
  {
    path: '/comprimir-imagen',
    title: 'Comprimir imágenes online gratis y en privado | PixelTools',
    description: 'Reduce el peso de imágenes JPG, PNG y WebP en tu navegador, sin subir tus fotografías a un servidor.',
  },
  {
    path: '/eliminar-fondo',
    title: 'Eliminar el fondo de una imagen en privado | PixelTools',
    description: 'Quita fondos con inteligencia artificial directamente en tu navegador y descarga un PNG transparente.',
  },
  {
    path: '/privacidad',
    title: 'Política de privacidad | PixelTools',
    description: 'Consulta cómo PixelTools procesa imágenes localmente y protege la privacidad de sus visitantes.',
  },
  {
    path: '/terminos',
    title: 'Condiciones de uso | PixelTools',
    description: 'Condiciones iniciales de uso de las herramientas gratuitas de PixelTools.',
  },
  {
    path: '/contacto',
    title: 'Contacto | PixelTools',
    description: 'Ponte en contacto con el equipo de PixelTools y Blue Lab Studios.',
  },
];

function setMeta(html, page) {
  const canonical = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${page.title}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/s, `<meta name="description" content="${page.description}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/s, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/s, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/s, `<meta property="og:url" content="${canonical}" />`);
}

for (const page of pages) {
  const html = setMeta(template, page);
  if (page.path === '/') {
    await writeFile(new URL('index.html', dist), html);
    continue;
  }
  const directory = new URL(`.${page.path}/`, dist);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}

const notFound = template
  .replace(/<title>.*?<\/title>/s, '<title>Página no encontrada | PixelTools</title>')
  .replace(`<meta name="robots" content="${robotsMeta}" />`, `<meta name="robots" content="noindex,${indexable ? 'follow' : 'nofollow'}" />`);
await writeFile(new URL('404.html', dist), notFound);

if (indexable) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(new URL('sitemap.xml', dist), sitemap);
  await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`SEO estático generado para ${pages.length} rutas (${siteUrl}).`);
} else {
  await rm(new URL('sitemap.xml', dist), { force: true });
  await writeFile(new URL('robots.txt', dist), 'User-agent: *\nDisallow: /\n');
  // Se añade dentro de la regla /* existente: Cloudflare Pages no combina dos
  // reglas /* y la segunda anularía COOP/COEP y el resto de cabeceras.
  const headersUrl = new URL('_headers', dist);
  const headers = await readFile(headersUrl, 'utf8');
  if (!/^\/\*\r?\n/m.test(headers)) throw new Error('public/_headers debe empezar con una regla /*.');
  await writeFile(headersUrl, headers.replace(/^\/\*\r?\n/m, '/*\n  X-Robots-Tag: noindex, nofollow\n'));
  console.log(`SEO estático generado para ${pages.length} rutas en modo prueba, sin indexar (${siteUrl}).`);
}

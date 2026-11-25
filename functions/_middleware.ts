const retired = new Set(['/herramientas','/comprimir-imagen','/eliminar-fondo','/convertir-imagen','/redimensionar-imagen','/recortar-imagen','/quitar-metadatos','/extraer-texto','/imagenes-a-pdf']);
export async function onRequest(context: { request: Request; next: () => Promise<Response>; env: { ASSETS: { fetch: (request: Request) => Promise<Response> } } }): Promise<Response> {
 const url = new URL(context.request.url);
 const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '');
 const production = url.hostname === 'velixblue.com';
 if (retired.has(path) || /^\/(models|ort|ocr)(\/|$)/.test(path)) {
  const page = new URL('/410.html', url);
  const upstream = await context.env.ASSETS.fetch(new Request(page, { method: 'GET' }));
  const headers = new Headers(upstream.headers); headers.set('X-Robots-Tag','noindex, follow'); headers.set('Cache-Control','no-store');
  return new Response(context.request.method === 'HEAD' ? null : upstream.body, { status: 410, headers });
 }
 if (!production && url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store' } });
 const upstream = await context.next();
 if (production) return upstream;
 const response = new Response(upstream.body, upstream); response.headers.set('X-Robots-Tag','noindex, nofollow'); return response;
}

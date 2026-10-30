// El mismo build de producción también está disponible en *.pages.dev. Esta
// protección por host impide indexar esos alias sin bloquear velixblue.com.
export async function onRequest(context: { request: Request; next: () => Promise<Response> }): Promise<Response> {
  const url = new URL(context.request.url);
  if (url.hostname === 'velixblue.com') return context.next();
  if (url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
    });
  }
  const upstream = await context.next();
  const response = new Response(upstream.body, upstream);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

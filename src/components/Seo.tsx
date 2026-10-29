import { useEffect } from 'react';

// Vacío mientras no haya dominio definitivo: entonces se usa la dirección actual
// (por ejemplo, un despliegue de prueba en *.pages.dev) y no se permite indexar.
const CONFIGURED_SITE_URL = import.meta.env.VITE_SITE_URL;

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function Seo({ title, description, path, noIndex = false }: SeoProps) {
  useEffect(() => {
    const siteUrl = CONFIGURED_SITE_URL || window.location.origin;
    const url = `${siteUrl}${path === '/' ? '/' : path}`;
    const robots = !CONFIGURED_SITE_URL ? 'noindex,nofollow' : noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large';
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[name="robots"]', { name: 'robots', content: robots });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
  }, [description, noIndex, path, title]);

  return null;
}

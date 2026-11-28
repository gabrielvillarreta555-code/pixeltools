# Vélix Gaming & Tecnología

Plataforma independiente de videojuegos y tecnología de Blue Lab Studios: noticias, actualizaciones, estrategias y guías de seis universos, y secciones transversales de **Rendimiento** y **Tecnología** para jugar mejor y decidir qué comprar (dirección VX-STR-001; ver `docs/vx-str-001/`). **Las ramas de trabajo son propuestas para revisión: integrar o desplegar requiere aprobación del CEO.**

## Arquitectura

Vite + TypeScript compilan el pequeño módulo de mejora progresiva y los estilos. Markdown con frontmatter JSON se transforma en HTML completo durante build. No se ha migrado a Astro, no hay CMS, base de datos, cuentas ni servicios de pago. Tras retirar las aplicaciones de imágenes ya no hay componentes React en uso; React, Router, Tailwind, ONNX, Tesseract y PDF-lib se retiran junto a sus consumidores.

- `content/juegos/`: 51 artículos (30 originales, 20 de Tecnología y Rendimiento publicables y 1 borrador); todas las rutas publicadas se conservan (las pruebas lo comprueban contra `fa39de5` y `3aee488`).
- `scripts/editorial/themes.mjs`: seis temas, paletas, arte, tipografías, tarjetas, fondos y política de entornos.
- `scripts/editorial/content.mjs`: validación de contenido, secciones transversales, precios y declaración de pruebas, y Markdown seguro.
- `scripts/editorial/template.mjs`: layout editorial, tarjetas, universos y artículo.
- `scripts/generate-editorial.mjs`: rutas HTML (68 en vista previa, 60 en producción con los artículos retenidos excluidos), sitemap, robots, índice y páginas retiradas. Las secciones `/rendimiento/` y `/tecnologia/` solo se generan si tienen artículos.
- `src/`: estilos y actualización del antiguo service worker.
- `public/media/`: dos obras oficiales de Clash Royale (Supercell Fan Kit), en WebP de 480/960/1600 px.
- `public/editorial/search.js`: búsqueda local; no registra ni transmite consultas.
- `functions/_middleware.ts`: respuestas HTTP 410 y protección de alias/previews.
- `tests/`, `e2e/`: contenido, seguridad, SEO, red, navegadores y capturas.
- `docs/vx-003/`: fuentes, atribuciones, permisos, inventario y capturas de VX-003.
- `docs/vx-str-001/`: informe estratégico, resolución, plan de entregas y capturas.
- `docs/vx-ed-004/`, `docs/vx-ed-005/`: investigación, verificación de fuentes, informe consolidado y capturas.

## Ejecutar y probar

Node 20.19+ (validado con Node 24). `npm ci` instala las versiones fijadas.

```bash
npm ci
npm test
npm run build
npm run test:seo
npm run preview
```

`npm run dev` genera la editorial y arranca su preview; recompilar después de editar Markdown o estilos. Sin SITE_URL el resultado es una vista previa no indexable.

Para validar respuestas **410 reales**, se necesita Pages Functions, no solo `vite preview`:

```bash
npx wrangler@4.156.0 pages dev dist --port 4333
# En otra terminal:
npx playwright install --with-deps chromium firefox
npm run test:e2e
E2E_BROWSER=firefox npm run test:e2e
```

Las pruebas de navegador usan `http://localhost:4333` por defecto; `E2E_BASE_URL` permite comprobar un preview. Guardan las capturas de Chromium en `docs/vx-003/` salvo que `E2E_CAPTURE_DIR` indique otra carpeta (por ejemplo `E2E_CAPTURE_DIR=docs/vx-str-001`), para no sobrescribir la evidencia de entregas anteriores. Los 410 de un hosting que ignore Functions no están garantizados: no aprobar un despliegue limitado a copiar archivos estáticos.

```bash
# Matriz de SEO; no publica nada:
CF_PAGES=1 CF_PAGES_BRANCH=main npm run build
npm run test:seo
CF_PAGES=1 CF_PAGES_BRANCH=review SITE_URL=https://velixblue.com CF_PAGES_URL=https://review.pages.dev npm run build
npm run test:seo
# Diagnóstico independiente del alojamiento público existente:
npm run test:analytics
```

`test:analytics` devuelve código 1 cuando observa tráfico adicional. El fallo pendiente de Cloudflare Web Analytics **no está corregido** por VX-003 y no se convierte en una excepción permitida para obtener verde.

## Añadir y actualizar contenido

Copiar un Markdown existente. Campos: `id`, `game`, `slug`, `title`, `description`, `answer`, `kind`, `publishedAt`, `reviewedAt`, `status`, `scope`, `cover`, `coverAlt`, `sources`, `related`. Noticias nuevas incluyen `eventDate` para separar anuncio y revisión. `featured` selecciona las piezas de actualidad.

Campos de VX-STR-001:

- `section`: `rendimiento` o `tecnologia`. Añade la pieza a esa sección sin cambiar su URL. Sin `game`, la pieza vive en `/{sección}/{slug}`.
- `games`: videojuegos relacionados. Obligatorio sin `game` y en toda pieza de `tecnologia`.
- `kind`: además de los anteriores, `comparativa` y `compra` (requieren `section`).
- `handsOn`: obligatorio en `comparativa`, `compra` y `tecnologia`. `false` muestra «No hemos probado estos dispositivos»; `true` exige `methodology`. Nunca declarar pruebas no realizadas.
- `humanReview`: `pending` o `done`. Un artículo con alguna fuente cuya descripción contenga «Consulta asistida» se excluye del build indexable (y se retiran los enlaces hacia él) hasta que tenga `"humanReview": "done"`. Las fuentes de los artículos nuevos declaran «Leído directamente el …» o «Consulta asistida …».
- `prices`: obligatorio en `compra`. Cada entrada declara `item`, `amount`, `currency` (ISO 4217), `market` (ISO 3166-1 alfa-2), `retailer`, `url` y `observedAt`. El build rechaza precios posteriores a `reviewedAt` o con más de 90 días.

`status: published` significa incluido en el build de la rama; **no implica publicación en producción**. `draft` queda fuera del sitio, índice y sitemap. La aprobación del CEO debe preceder a cualquier merge/despliegue. No actualizar fechas de revisión sin volver a contrastar fuentes. En particular, revisar las noticias de noviembre antes de una publicación posterior.

Para revisar borradores en una vista previa: `INCLUDE_DRAFTS=1 npm run build` (y `INCLUDE_DRAFTS=1 npm run test:seo`). Muestran un aviso de borrador; el build falla si se combina con un sitio indexable.

Diagramas de pasos sin imágenes ni JavaScript: un bloque de código con la etiqueta `flujo`, la primera línea `# Título` y después una línea `Paso | explicación` por paso (mínimo dos).

El cuerpo usa H2, no H1. No acepta HTML arbitrario ni imágenes externas incrustadas. Las fuentes son HTTPS. Los relacionados deben existir. Conservar slugs publicados o planificar redirecciones. Para añadir un juego, definir su tema, arte propio/licenciado y contenido real; no publicar categorías vacías.

## Retirada, recuperación y despliegue

Las ocho herramientas y `/herramientas` devuelven 410 + noindex; no aparecen en navegación ni sitemap. Los modelos y runtimes retirados también devuelven 410. `public/sw.js` reemplaza al worker anterior, limpia únicamente cachés `velix-*`/`pixeltools-*`, toma control y se desregistra. No se cachean noticias ni se borran datos de otros productos.

Recuperación: etiqueta Git `vx-003-before-gaming`, commit `fa39de52395eea82adf9c8b98999123ef9d4714c`. Usar `git worktree add ../velix-anterior vx-003-before-gaming` para recuperar íntegramente la versión previa, sin modificar esta rama. No reescribir main.

Cloudflare Pages conserva build `npm run build`, salida `dist`, rama productiva main y Functions. Solo velixblue.com es indexable. No fusionar #17 ni esta propuesta sin aprobación del CEO. El push de la rama puede activar el preview automático existente; no cambia producción.

## Límites

Safari y teléfonos físicos no validados. No se ha auditado jurídicamente el portal. Correo de contacto: configurar `VITE_CONTACT_EMAIL` real; sin él la página informa que el canal no está habilitado. No se simula envío. Web Analytics pendiente en el alojamiento. No hay acceso a Search Console ni garantía de indexación. Política de imágenes: únicamente fotografías reales, recursos oficiales o materiales con derechos de uso documentados; **no se usan imágenes generadas por IA** (las portadas IA de VX-003 están retiradas). Las piezas sin imagen autorizada usan portada de texto. Registro en `scripts/editorial/official-media.mjs`, `docs/vx-003/PERMISOS_IMAGENES.md` y `THIRD_PARTY_NOTICES.md`.

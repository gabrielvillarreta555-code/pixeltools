# Vélix 2.0 — entrega y validación

Fecha: 2026-11-16. Base: `c390bd55d090a715f50abeed8cfb4883edf67326`.
El PR documental #15 se revisó (solo dos documentos, sin conflictos, Cloudflare aprobado) y se fusionó antes del desarrollo.

## Alcance y arquitectura

React/Vite y los motores de las ocho herramientas se conservan. Markdown en `content/juegos/`, con frontmatter JSON validado, se convierte en HTML durante `npm run build`. `scripts/editorial/` contiene parser y plantillas; `scripts/generate-editorial.mjs` escribe portada, `/juegos/`, `/herramientas`, diez consultas y 404. Las herramientas conservan sus páginas y ejecución React. La navegación entre ambos usa enlaces de documento.

El buscador descarga un índice pequeño del mismo origen: no transmite consultas ni crea páginas indexables por búsqueda. No hay CMS, base de datos, nuevos servicios, publicidad ni cambios en privacidad. Las páginas editoriales no cargan React, OCR ni ONNX. El SW no precarga artículos ni índice; una guía sin red tiene una respuesta explícita 503, no una portada falsa. El catálogo compartido conserva las ocho herramientas disponibles y las dos propuestas anteriores sin ruta.

## Selección editorial

Se implementaron las prioridades 08, 14, 07, 04, 05, 13, 12, 06 y 17 de la investigación. La prioridad 20 (Brawl Stars) se sustituyó por la consulta 03 (región de Free Fire): no se pudo leer/verificar suficientemente la documentación oficial de Brawl Stars para respaldar una guía. No se inventó un procedimiento. La consulta de coordenadas se precisa como «sin activar trucos»; no promete restaurar logros ya deshabilitados.

Cada artículo contiene respuesta directa, alcance, revisión documental del 16/11/2026, referencias oficiales con la afirmación que respaldan y relacionados. Son comprobaciones documentales, no pruebas dentro de los videojuegos. No se republican capturas, logos ni imágenes de terceros. No se prometen recompensas, reparación universal ni volúmenes de búsqueda.

## Evidencia ejecutada

- Baseline anterior: 105 pruebas unitarias, build y batería completa E2E aprobados.
- Implementación: 115 pruebas unitarias en 14 archivos aprobadas; TypeScript y build de producción aprobados.
- `npm run test:seo`: 24 rutas, títulos/descripciones únicos, canonical, respuesta en HTML inicial, un H1 editorial, enlaces internos, cuerpos no duplicados, JSON-LD Article/BreadcrumbList, sitemap y exclusiones de SW.
- Matriz Cloudflare: rama de prueba heredando SITE_URL de producción conserva noindex, headers bloqueantes y sin sitemap; main genera dominio correcto y rastreo abierto.
- Chrome/Chromium y Firefox: artículos sin JavaScript, búsqueda local, navegación, doce rutas previas, cuatro anchos (320/390/768/1440), sin errores críticos de consola. Capturas en `docs/capturas/`.
- `npm run test:e2e`: ocho herramientas, descargas reales, lotes/ZIP, transparencia, validaciones, cancelación, PWA, OCR spa/eng, PDF y objetivo 200 KB aprobados. Fondos de 6750×9000 y 108 MP producen 1536×2048, sin envío de fotografías.
- `npm run test:e2e:ocr-crop` y `node e2e/mask-brush.mjs`: giro, recorte, controles táctiles/teclado, deshacer, alfa y descarga aprobados.
- `npm audit --audit-level=moderate`: cero vulnerabilidades reportadas.
- Presupuesto editorial gzip medido: portada 3231 B, CSS 2730 B, buscador JS 1115 B, índice 1714 B; fuente local adicional ~27 KB. No son métricas de campo ni puntuaciones Lighthouse.

## Límites y reversión

No se probaron teléfonos físicos ni Safari de macOS/iOS. WebKit Linux, si se ejecuta, no equivale a Safari real. Las herramientas tienen sus límites anteriores de memoria, formato y calidad de IA; no se alteraron sus motores. Los textos legales continúan pendientes de revisión profesional. No hay acceso confirmado a Search Console ni datos de indexación.

Reversión: revertir el commit de integración del PR de implementación mediante PR y dejar que Cloudflare reconstruya main. No hay migraciones de datos. La base anterior es el SHA indicado al comienzo. Las URLs de herramientas permanecen iguales; retirar las nuevas páginas tras publicación implica pérdida de sus URLs y requiere seguimiento en Search Console. No borrar contenido ni reescribir historial como mecanismo de reversión.

## Comprobación posterior al despliegue

1. Esperar el check Cloudflare Pages y verificar el SHA desplegado.
2. Solicitar por HTTP las 24 URLs: 200, canonical definitivo, ausencia de noindex y contenido editorial visible en la respuesta.
3. Solicitar `/robots.txt` y `/sitemap.xml`, comprobar diez consultas y dominio correcto. Comprobar 404 real para una URL inexistente y protección de alias pages.dev.
4. Ejecutar `E2E_BASE_URL=https://velixblue.com E2E_BROWSER=chromium npm run test:e2e:editorial` y batería de herramientas contra producción.
5. Registrar PR, SHA y fecha reales en `docs/VELIX_ESTADO.md`. Un build local no acredita publicación.

## Seguimiento SEO

En la propiedad autorizada de Search Console, enviar `https://velixblue.com/sitemap.xml`. Inspeccionar cada URL listada en VELIX_ESTADO, usar «Probar URL publicada» y revisar rastreo/HTML/canonical. Solicitar indexación si procede, sin garantizar aceptación. Registrar esta publicación como línea base; a 30/45/60 días revisar cobertura, motivos de exclusión, consultas, impresiones, clics y CTR. No cambiar URLs o crear duplicados para perseguir indexación. Revisar fuentes antes de cambiar fechas de revisión; una recompilación no es revisión editorial.

WebKit Linux: intento de ejecución no completado por bibliotecas nativas ausentes en el entorno, incluso tras intentar dependencias locales. No se declara aprobado. Chrome y Firefox sí se ejecutaron; Safari/macOS/iOS queda como limitación de cobertura, no como fallo funcional observado.


## Publicación verificada

- PR de implementación: https://github.com/gabrielvillarreta555-code/pixeltools/pull/16.
- Commit de integración: `fa39de52395eea82adf9c8b98999123ef9d4714c`.
- Cloudflare Pages: SUCCESS; despliegue `7d7fad62-7223-445b-afd3-ace879f842ed`, completado 2026-11-16 21:27:01 UTC.
- URL pública: https://velixblue.com/. Sitemap: https://velixblue.com/sitemap.xml.
- Preview de PR aprobado por HTTP y Chromium: https://58409a5b.pixeltools-ebd.pages.dev (24 rutas, noindex, sin sitemap, 404).
- Producción: `npm run test:deployment` comprueba por HTTP las 24 rutas, HTML editorial completo, metadatos, canonical, robots, sitemap y 404: aprobado. El alias pages.dev de producción conserva noindex y robots bloqueante; el dominio público no.
- En este entorno se usó `NODE_USE_ENV_PROXY=1` para que Node 24 respete el proxy de red ya configurado. No se modificó el sitio ni se omitieron verificaciones.


## Bloqueo detectado después del despliegue (16/11/2026)

La batería completa contra https://velixblue.com terminó con **cuatro comprobaciones fallidas**. Fallan las aserciones de ausencia total de peticiones externas/POST en `largeBackground`, `heavyBackground`, `ocr` e `imagePdf`; las comprobaciones de procesamiento, dimensiones, transparencia, texto, PDF, descargas y navegación pasaron. La batería local sí pasó completa. La editorial Chromium y la auditoría HTTP de producción pasaron.

Diagnóstico de red: script GET desde `https://static.cloudflareinsights.com/beacon.min.js/...` y POST del mismo origen a `/cdn-cgi/rum?`. Se inspeccionó un envío de ~826 bytes de Web Analytics con tiempos, URL de página, versión del navegador y memoria; no se observó una imagen en ese envío. Esta analítica ya figura en PrivacyPage y README de la base anterior (observación 1/11/2026); Vélix 2.0 no la añadió. No se concluye una auditoría exhaustiva de todos los datos tratados por Cloudflare.

No se relajaron las aserciones ni se ocultaron solicitudes para aprobar las pruebas. No se cambió el sistema de privacidad ni se desactivó analítica sin acceso al panel. Se detienen nuevas integraciones funcionales. El despliegue de Vélix 2.0 está online, pero no se declara aprobado el cierre completo de producción.

Acción pendiente: revisar la configuración existente de Cloudflare Web Analytics con acceso al panel y decidir si se desactiva o si se mantiene con una verificación de red específica que pruebe explícitamente ausencia de archivos/texto de usuario en las métricas. Reejecutar las cuatro pruebas y registrar su resultado antes de cerrar la aceptación. No revertir motores de imágenes para solucionar una configuración de alojamiento preexistente. Si Dirección decide revertir Vélix 2.0, usar el procedimiento documentado; revertir la aplicación no garantiza retirar Web Analytics.


Reproducción dirigida de los cuatro escenarios fallidos (sin cambiar sus aserciones): todos registraron únicamente las dos solicitudes adicionales anteriores. Los POST eventType=1 fueron de 829, 828, 822 y 828 bytes respectivamente; claves: startTime, pageloadId, eventType, nt, location, versions, bi, memory, firstPaint, firstContentfulPaint, timingsV2, siteToken y st. Se registraron solo método, URL, tamaño y nombres de campos; no fotos, texto OCR ni identificadores de visita. La instrumentación temporal se retiró. Los cuatro checks continúan fallando, tal como deben con su criterio actual. No se presenta la batería de producción como aprobada.

Chrome/Chromium contra producción sí aprobó la batería editorial: diez artículos sin JS, navegación, doce rutas anteriores, búsqueda y 320/390/768/1440, sin errores críticos de consola. Las pruebas locales completas aprobadas y estos resultados públicos diferentes deben permanecer separados.

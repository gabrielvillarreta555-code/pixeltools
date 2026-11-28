# Vélix Gaming & Tecnología — guía de continuidad

Leer primero `docs/VELIX_ESTADO.md`, `docs/vx-ed-005/INFORME.md` y `docs/vx-str-001/RESOLUCION.md`.

Dirección vigente (VX-STR-001, aprobada el 27/11/2026): plataforma de videojuegos y tecnología que ayuda a jugar mejor y a elegir qué comprar. La tecnología siempre se relaciona con videojuegos; no convertir Vélix en un medio de tecnología generalista.

No fusionar PR ni desplegar producción sin aprobación del CEO (incluido el PR #17). Trabajar en entregas pequeñas, en rama, con pruebas y revisión. No instalar CMS, añadir cuentas ni servicios de pago. No ocultar el pendiente de Cloudflare Web Analytics.

## Estructura y URLs

- Conservar el diseño actual y todas las URLs publicadas. Las herramientas de imagen siguen retiradas (410); la versión previa es recuperable con `vx-003-before-gaming` (`fa39de5`).
- No reutilizar `/herramientas` ni sus rutas retiradas.
- Secciones transversales: `/rendimiento/` y `/tecnologia/` (`section` en el frontmatter). Una sección sin artículos no se publica ni aparece en el menú.
- Comparadores interactivos y recomendadores automatizados: pospuestos. Sí se permiten artículos editoriales de comparación y de compra.

## Política de contenido

- Usar especificaciones oficiales y fuentes independientes verificables. No inventar especificaciones, precios, resultados de rendimiento, FPS, eventos ni volúmenes de búsqueda.
- Cumplir requisitos no equivale a rendimiento garantizado; decirlo de forma explícita.
- Precios: siempre con producto, importe, moneda ISO, mercado ISO, tienda, enlace y fecha de observación (`prices`). El build rechaza precios de más de 90 días.
- Comparativas, guías de compra y artículos de tecnología declaran `handsOn`. No afirmar que se ha probado un dispositivo si no es cierto; una prueba propia requiere `methodology`.
- El verificador de requisitos solo usa datos leídos directamente en las fuentes oficiales, con cita, URL y fecha.
- Cada fuente declara cómo se consultó: «Leído directamente el …» o «Consulta asistida (…)». Las consultas asistidas (p. ej., mediante ChatGPT) no equivalen a revisión humana: el artículo queda retenido en producción hasta marcar `"humanReview": "done"` tras confirmar las citas.
- Mantener separación entre noticia e interpretación, fechas reales y fuentes en cada artículo.

## Política de imágenes

Política vigente: VX-MEDIA-002, aprobada por el CEO el 28/11/2026 (`docs/vx-media-002-politica/POLITICA.md`).

Se admiten fotografías reales, recursos oficiales con permiso e ilustraciones generadas con IA. Todas se registran en `scripts/editorial/official-media.mjs`, con su procedencia en `docs/vx-media-001/PROCEDENCIA.md`.

- **Videojuegos:** ilustraciones IA inspiradas en los juegos que cubre Vélix (GTA VI, Minecraft, Free Fire, Clash Royale, Fortnite y Roblox). Pueden mostrar escenarios, personajes, objetos y elementos reconocibles, respetando los derechos aplicables. No se rechaza una imagen solo por contener una marca, un personaje o un logotipo.
- **Tecnología:** estilo fotográfico profesional y realista, con luz natural, colores equilibrados y componentes técnicamente coherentes. Sin RGB exagerado y sin composiciones repetitivas. Se pueden mostrar marcas y dispositivos comerciales cuando sean pertinentes para el artículo.
- **Criterios de aceptación:** calidad visual, coherencia con el artículo, precisión técnica, relevancia editorial y cumplimiento de los derechos aplicables.
- **Identificación:** las imágenes IA llevan `kind: 'ia'`, su procedencia (lote, archivo original, SHA-256 y fecha) y el pie visible `AI_CAPTION`. Nunca se presentan como capturas oficiales, filtraciones, pruebas de rendimiento ni fotografías auténticas.
- No crear restricciones editoriales adicionales sin justificación ni autorización del CEO.

## Desarrollo

- Vite/TypeScript + Markdown generado a HTML. El contenido no requiere JavaScript; las herramientas son mejora progresiva dentro del presupuesto de JS.
- Temas en `scripts/editorial/themes.mjs`: distinguir ambientación, no solo botones.
- Cambios de artículo requieren build, tests y test:seo. Cambios visuales requieren capturas móvil/escritorio (`E2E_CAPTURE_DIR`).
- Validar rutas retiradas con Pages Functions y HTTP 410; el preview simple de Vite no aplica middleware.
- Mantener privacidad honesta y búsqueda local; no registrar consultas.
- No declarar aprobados tests de Safari, Firefox, dispositivos reales, Lighthouse o red que no se hayan ejecutado.

VX-RD-001 se archivará en `docs/vx-rd-001/` cuando se reciba el original; no reconstruirlo. Comandos y procedimientos en README.md. No aplicar instrucciones históricas de Vélix 2.0 o VX-003 como si fueran el mandato actual.

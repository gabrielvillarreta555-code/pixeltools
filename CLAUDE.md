# Vélix Gaming & Tecnología — guía de continuidad

Leer primero `docs/VELIX_ESTADO.md`, `docs/vx-str-001/RESOLUCION.md` y `docs/vx-str-001/INFORME.md`.

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
- Mantener separación entre noticia e interpretación, fechas reales y fuentes en cada artículo.

## Política de imágenes

Únicamente fotografías reales, recursos oficiales o materiales con derechos de uso adecuados y documentados (`scripts/editorial/official-media.mjs`, `docs/vx-003/PERMISOS_IMAGENES.md`, `THIRD_PARTY_NOTICES.md`). **No usar imágenes generadas por IA.** Ante la duda, publicar sin imagen (portada de texto).

## Desarrollo

- Vite/TypeScript + Markdown generado a HTML. El contenido no requiere JavaScript; las herramientas son mejora progresiva dentro del presupuesto de JS.
- Temas en `scripts/editorial/themes.mjs`: distinguir ambientación, no solo botones.
- Cambios de artículo requieren build, tests y test:seo. Cambios visuales requieren capturas móvil/escritorio (`E2E_CAPTURE_DIR`).
- Validar rutas retiradas con Pages Functions y HTTP 410; el preview simple de Vite no aplica middleware.
- Mantener privacidad honesta y búsqueda local; no registrar consultas.
- No declarar aprobados tests de Safari, Firefox, dispositivos reales, Lighthouse o red que no se hayan ejecutado.

VX-RD-001 se archivará en `docs/vx-rd-001/` cuando se reciba el original; no reconstruirlo. Comandos y procedimientos en README.md. No aplicar instrucciones históricas de Vélix 2.0 o VX-003 como si fueran el mandato actual.

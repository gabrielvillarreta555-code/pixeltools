# Vélix Gaming — guía de continuidad VX-003

Leer primero `docs/VELIX_ESTADO.md` y `docs/vx-003/INFORME.md`.

La orden VX-003 reemplaza la obligación anterior de conservar herramientas: se retiran las ocho aplicaciones, dependencias y referencias públicas. La versión previa es recuperable con `vx-003-before-gaming` (`fa39de5`). Los diez artículos de juegos sí conservan URL.

No fusionar PR #17 ni desplegar producción sin aprobación del CEO. Trabajar en rama y entregar PR. No instalar CMS, añadir cuentas ni servicios de pago. No ocultar el pendiente de Cloudflare Web Analytics.

## Desarrollo

- Vite/TypeScript + Markdown generado a HTML. El contenido no requiere JavaScript.
- Temas en scripts/editorial/themes.mjs: distinguir ambientación, no solo botones.
- Arte propio conceptual con IA; nunca presentarlo como screenshot oficial. Conservar créditos y hashes.
- Mantener fuentes, fechas reales y separación entre noticia e interpretación. No inventar eventos, precios ni estadísticas.
- Cambios de artículo requieren build, tests y test:seo. Cambios visuales requieren capturas móvil/escritorio.
- Validar rutas retiradas con Pages Functions y HTTP 410; el preview simple de Vite no aplica middleware.
- Mantener privacidad honesta y búsqueda local; no registrar consultas.
- No declarar aprobados tests de Safari, dispositivos reales, Lighthouse o red que no se hayan ejecutado.

Comandos y procedimientos completos en README.md. No aplicar instrucciones históricas de Vélix 2.0 como si fueran el mandato actual.

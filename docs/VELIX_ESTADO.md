# Vélix — estado permanente

Actualizado: 2026-11-27. Dirección vigente: **VX-STR-001 · Gaming & Tecnología** (aprobada con modificaciones por el CEO el 27/11/2026).

## Dirección y autorización

- Vélix evoluciona hacia una plataforma de videojuegos y tecnología que ayuda a jugar mejor y a elegir qué comprar. La tecnología siempre se relaciona con videojuegos.
- Documentos rectores: `docs/vx-str-001/RESOLUCION.md` (decisiones, reglas y plan de entregas) y `docs/vx-str-001/INFORME.md` (auditoría, arquitectura, fuentes y costes).
- Autorizado: preparar entregas pequeñas en ramas independientes, con pruebas y revisión. **No autorizado:** fusionar ni desplegar sin aprobación del CEO (incluido el PR #17), instalar CMS, añadir cuentas ni contratar servicios de pago.
- **VX-RD-001:** no se ha recibido; no está en el repositorio. Se archivará sin cambios en `docs/vx-rd-001/` cuando se proporcione el original.

## Sitio en `main` (último merge verificado: `3aee488`, PR #20)

- 30 artículos sobre 6 juegos (GTA VI, Free Fire, Clash Royale, Minecraft, Fortnite, Roblox); secciones Noticias, Videojuegos, Actualizaciones, Estrategias y Guías.
- Las ocho herramientas de imagen y `/herramientas` están retiradas con HTTP 410 (VX-003). Recuperación: etiqueta `vx-003-before-gaming` (`fa39de5`). No se reutiliza `/herramientas`.
- Imágenes: solo dos obras oficiales de Clash Royale (Supercell Fan Kit). Las portadas IA de VX-003 están retiradas.
- Infraestructura: Cloudflare Pages (build `npm run build`, salida `dist`, Pages Functions). Solo velixblue.com es indexable.

## Entrega en curso

**E1 · rama `vx-str-001-entrega-1`** (sin fusionar):

- `/rendimiento/` agrupa los artículos 04, 05 y 07 sin cambiar sus URLs.
- `/tecnologia/` tiene estructura y reglas, pero no se publica hasta tener su primer artículo verificado.
- Validador nuevo: comparativas, guías de compra, precios con mercado y fecha, y declaración de pruebas.
- Menú, documentación y política de imágenes actualizados.

Validación de E1 ejecutada en este entorno: `npm test` (37), build y `test:seo` en preview y en la matriz de producción, y e2e en Chromium con Wrangler Pages (47 rutas, 410/404, 30 capturas en `docs/vx-str-001/capturas`). **No ejecutado:** Firefox (no instalado en el entorno), Safari, dispositivos reales, Lighthouse.

Siguiente entrega, E2: fichas de requisitos y verificador. Bloqueada hasta que se puedan leer en directo las fuentes oficiales (epicgames.com, roblox.com, garena.com, minecraft.net, supercell.com). La red del entorno actual no alcanza esos dominios.

**VX-ED-003 (Tecnología) · rama `vx-ed-003-tecnologia`** (sobre E1, sin fusionar):

- 10 artículos en **borrador** (31–40) para `/rendimiento/` y `/tecnologia/`.
- Banco de 150 preguntas, registro de fuentes, 20 prioridades, 7 metodologías de experimento y un informe de diferenciación y limitaciones en `docs/vx-ed-003-tecnologia/`.
- Vista previa de borradores (`INCLUDE_DRAFTS=1`) y diagramas `flujo`.
- Los borradores no se pueden publicar hasta leer directamente 32 fuentes conocidas solo por extractos de buscador. La red del entorno no alcanza esos dominios y el servicio rechazó la propuesta de un entorno con acceso.
- Sin guías por presupuesto hasta tener precios observados.
- El código «VX-ED-003» coincide con el del PR #20; está pendiente de confirmar.

## Políticas vigentes

- Imágenes: únicamente fotografías reales, recursos oficiales o materiales con derechos de uso adecuados y documentados. Sin imágenes generadas por IA.
- Datos: especificaciones oficiales y fuentes independientes verificables. Sin especificaciones, precios, FPS, rendimiento ni volúmenes de búsqueda inventados. Cumplir requisitos ≠ rendimiento garantizado.
- Precios: siempre con mercado y fecha. No afirmar pruebas de dispositivos no realizadas.
- Comparadores interactivos y recomendadores automatizados: pospuestos. Los artículos de comparación y compra sí están permitidos.

## Pendientes conocidos

- Cloudflare Web Analytics observado en producción y sin resolver (`npm run test:analytics`). No ocultarlo.
- Sin acceso a Search Console; no hay mediciones de demanda ni garantía de indexación.
- Mercado de referencia de precios por decidir (bloquea las guías de compra).
- Textos legales pendientes de revisión jurídica y de los datos del responsable; correo de contacto sin configurar.
- PR #17 (documentación de Vélix 2.0) abierto y sin fusionar.

## Historial

- **Vélix 2.0** (16/11/2026, PR #15/#16): consultas de juegos en HTML estático junto a las herramientas de imagen. Su investigación sigue en `VELIX_2_0_INVESTIGACION.md` y su validación en `VELIX_2_0_VALIDACION.md`, como referencia histórica.
- **VX-003** (25/11/2026, PR #18): Vélix Gaming y retirada de las herramientas. Documentación en `docs/vx-003/`.
- **VX-ED-002/003** (25/11/2026, PR #19/#20): ampliación a 30 artículos (`docs/VX-ED-003.md`).
- **VX-STR-001** (27/11/2026): informe y resolución de la línea Gaming & Tecnología.

El detalle anterior de este archivo puede consultarse en Git (`git show 3aee488:docs/VELIX_ESTADO.md`).

# VÉLIX — Estado permanente

Actualizado: 16 de noviembre de 2026.

## Autorización vigente

- Dirección autorizó **Fase 0: auditoría e investigación de Vélix 2.0**.
- Se permite entregar dos informes en rama/PR exclusivamente documental.
- **Desarrollo, artículos, cambios funcionales, merge y despliegue NO autorizados.**
- Aprobar/leer este informe no autoriza automáticamente implementación ni publicación.
- No eliminar herramientas, cambiar privacidad, comprar servicios ni mover URLs.

## Fuente de verdad y base auditada

- Repositorio: https://github.com/gabrielvillarreta555-code/pixeltools
- Dominio confirmado por Dirección y código: https://velixblue.com/
- Rama principal: main.
- SHA auditado: dd79661f817f24074ae6f7854f5ee5f81fc8dedb.
- Último commit observado: merge PR #14, «Integrar pincel, OCR, PDF, rendimiento y privacidad» (1/11/2026).
- Rama documental de esta fase: docs/velix-2-investigacion.
- Informe detallado: [VELIX_2_0_INVESTIGACION.md](./VELIX_2_0_INVESTIGACION.md).
- Antes de continuar: leer este archivo, el informe, CLAUDE.md y cualquier AGENTS.md que exista entonces; volver a comprobar main y cambios concurrentes. No usar el resumen de sesiones antiguas como estado actual.

## Estado verificado por lectura de GitHub

React 19.2, TypeScript 5.9, Vite 7.3, Tailwind 4.1 y React Router 7.18.
Cloudflare Pages, salida dist y Pages Functions con middleware por host.
ONNX/U²-Net, Tesseract spa/eng, pdf-lib y Canvas; archivos procesados localmente.
PWA con Cache Storage de aplicación; fuentes locales.
No CMS/base de datos requerida para el MVP.

Ocho herramientas con ruta:
1. /comprimir-imagen — calidad, objetivo KB, límites, lote/ZIP.
2. /eliminar-fondo — IA local, resize previo, comparador, fondos, pincel/deshacer.
3. /convertir-imagen — JPG/PNG/WebP y lote.
4. /redimensionar-imagen — medidas/porcentaje/presets, ajuste y recorte.
5. /recortar-imagen — proporciones, giro, volteo, teclado/táctil.
6. /quitar-metadatos — limpieza binaria y reanálisis.
7. /extraer-texto — OCR spa/eng, giro/recorte, TXT.
8. /imagenes-a-pdf — lote limitado, reordenación, A4/carta.

Conservar además /, /privacidad, /terminos y /contacto: doce URLs actuales.
HEIC y marca de agua siguen «Próximamente», sin ruta.
Blue YA existe en public/blue-vivo.svg, BlueHint y portada/estilos. No introducirlo como novedad ni retirarlo sin decisión.

## Hallazgos que condicionan Vélix 2.0

- Generador actual crea metadata/canonical/sitemap por ruta, pero index.html tiene root vacío: no genera contenido principal SSR.
- Recomendación **propuesta, no aprobada**: React/Vite existente + Markdown editorial estático en build; no migración completa a Astro. Astro editorial es alternativa tras prueba acotada si simplifica.
- Cada ruta debe tener un único generador dueño; enlaces editorial ↔ SPA necesitan navegación correcta y 404 real.
- SW precarga aplicación completa salvo exclusiones: no ampliar indiscriminadamente al catálogo editorial; vigilar fallback offline a portada.
- Configuración SEO de producción/preview está incorporada en main. Solo velixblue.com indexable; middleware bloquea hosts alternativos.
- Robots Disallow + noindex no garantiza retirar un preview ya indexado: Google debe poder leer noindex, o proteger acceso; evaluar sin desproteger pruebas.
- Política/README registran observación previa de Cloudflare Web Analytics el 1/11. No afirmar que no existe analítica. No se comprobó nuevamente.
- Headers de aislamiento protegen runtime; no retirarlos para widgets.
- main reporta protected:false; no workflows en árbol y Actions devolvió cero runs. Proponer protección/CI, sin cambios ahora.
- Posible bitmap sin cerrar si cancelación llega tras createImageBitmap: hallazgo de lectura a reproducir, no corregido.
- Términos/privacidad pendientes de revisión jurídica y datos del responsable.

## Investigación editorial entregada

20 formulaciones editoriales basadas en preguntas/problemas documentados, con fuentes, competidores, dificultad cualitativa, aporte, frecuencia y riesgos.
No son exportaciones de queries ni cifras de volumen. Hay señales regionales de FF/Minecraft/Roblox; demanda panameña exacta sin cuantificar. Fortnite/Brawl Stars son exploratorios.
Prioridades, en orden: IDs 08, 14, 07, 04, 05, 13, 12, 06, 17, 20 del informe.
Diez es tope inicial, no obligación de publicar contenido sin verificar.
Viral/Memes quedan fuera de MVP y no deben generar páginas vacías.
Derechos: no asumir que licencias de fan content permiten uso comercial corporativo; Epic diferencia vídeos de webs, Garena sin licencia general verificada. Assets originales/licenciados con registro.

## Validación de esta fase y límites

- Auditados archivos y árbol mediante conector GitHub; búsquedas y aperturas web documentadas.
- Shell no disponible: «No usable execution environment is available», pese a estado running reportado por proveedor.
- NO ejecutados npm test, build, Playwright, Lighthouse, npm audit ni móviles reales.
- NO verificadas respuestas HTTP actuales de producción: herramienta web no pudo abrir /, /robots.txt y /sitemap.xml. Esto no demuestra caída del sitio.
- NO acceso a Search Console, panel Cloudflare, cifras de búsqueda ni métricas.
- Resultados de sesiones/README anteriores NO son resultados actuales.
- Entrega prevista: únicamente los dos Markdown; verificar compare/diff y lectura remota tras guardar.
- No merge, no cambios de configuración, no despliegue manual. La automatización existente de terceros podría generar preview al recibir una rama.

## Próximos pasos, en orden

1. Dirección revisa informe y PR documental; puede aprobar investigación sin autorizar desarrollo.
2. Recuperar entorno ejecutable; verificar SHA actual, estado público y acceso de propietario a Search Console/Cloudflare.
3. Solicitar/recibir orden explícita de implementación que fije responsable editorial, alcance y presupuesto.
4. Solo entonces: baseline y prototipo de HTML editorial, decidir generación vs Astro, PRs pequeños con pruebas y reversión.
5. Publicar únicamente tras autorización separada y pruebas de herramientas/SEO/privacidad/derechos.

## Handoff y mantenimiento

Actualizar fecha, SHA inspeccionado, decisiones aprobadas (separadas de propuestas), pruebas realmente ejecutadas con evidencia, PRs y pendientes en cada fase.
No registrar secretos, tokens, fotos, consultas libres de usuarios ni datos personales.
Plan de 30 días, costos ilustrativos, criterios de aceptación y métricas a 30/45/60 días están en el informe; no equivalen a contratación ni promesa de tráfico.

# Vélix — estado permanente

Actualizado: 2026-11-16. Versión: MVP Vélix 2.0 implementado; cierre de publicación en curso.

## Autorización y repositorio

Dirección aprobó investigación e implementación y autorizó integración/despliegue si las pruebas y comprobaciones del repositorio pasan, no hay regresiones ni bloqueos de seguridad y se verifica producción. No pedir de nuevo esa autorización. No desarrollar Viral, Memes, CMS ni nuevas herramientas.

- Repositorio: https://github.com/gabrielvillarreta555-code/pixeltools
- Principal: `main`. Dominio: https://velixblue.com/
- PR documental #15 fusionado tras comprobar contenido exclusivamente documental y Cloudflare aprobado. SHA: `c390bd55d090a715f50abeed8cfb4883edf67326`.
- Implementación: rama `feat/velix-2-juegos`. PR y SHA de integración pendientes de registrar al cerrar publicación.
- Despliegue existente: integración Git de Cloudflare Pages, proyecto pixeltools, build `npm run build`, salida dist y Pages Functions. No hay despliegue manual ni nuevos servicios.

## Arquitectura implementada

React/TypeScript/Vite/Tailwind se conservan. Markdown con frontmatter JSON en `content/juegos/` genera HTML editorial inicial en build; parser y plantillas en `scripts/editorial/`, generación en `scripts/generate-editorial.mjs`, CSS/búsqueda en `public/editorial/`. Portada, `/juegos/`, `/herramientas` y diez consultas tienen contenido completo sin JavaScript. La búsqueda necesita JS, descarga índice local y no envía consultas. Las herramientas usan React con navegación de documento hacia editorial. Catálogo compartido `src/lib/toolCatalog.json`.

Solo velixblue.com indexable; preview noindex + robots bloqueante y sin sitemap. Middleware protege también los alias pages.dev de producción. Se conservan aislamiento y privacidad. Sitemap automático de 24 rutas; Article y BreadcrumbList en consultas, sin FAQPage/HowTo. HTML arbitrario e imágenes Markdown deshabilitados. El SW no precarga artículos ni índice; guía offline responde 503 explicativo.

## Herramientas preservadas y URLs anteriores

1. /comprimir-imagen — calidad, objetivo KB, límites, lote/ZIP.
2. /eliminar-fondo — IA local, resize previo, comparador, fondos, pincel/deshacer.
3. /convertir-imagen — JPG/PNG/WebP y lote.
4. /redimensionar-imagen — medidas/porcentaje/presets, ajuste y recorte.
5. /recortar-imagen — proporciones, giro, volteo, teclado/táctil.
6. /quitar-metadatos — limpieza binaria y reanálisis.
7. /extraer-texto — OCR spa/eng, giro/recorte, TXT.
8. /imagenes-a-pdf — lote limitado, reordenación, A4/carta.

Se conservan /, /privacidad, /terminos y /contacto (doce URLs anteriores). HEIC y marca de agua no tienen ruta y siguen pendientes. Blue sigue limitado al acceso a herramientas; no es una mascota nueva editorial. No se modificaron motores de procesamiento.

## Diez consultas implementadas (publicación por confirmar)

- [¿Qué hago si Roblox sigue mostrando el error 280 después de actualizar?](https://velixblue.com/juegos/roblox/error-280-despues-de-actualizar)
- [¿Cómo activo las coordenadas en Minecraft Bedrock sin activar trucos?](https://velixblue.com/juegos/minecraft/activar-coordenadas-bedrock)
- [¿Cómo soluciono el error 279 de Roblox en Android?](https://velixblue.com/juegos/roblox/error-279-android)
- [¿Mi celular puede ejecutar Free Fire o Free Fire MAX?](https://velixblue.com/juegos/free-fire/requisitos-celular-free-fire-max)
- [¿Por qué Free Fire se cierra solo o muestra pantalla negra en Android?](https://velixblue.com/juegos/free-fire/se-cierra-pantalla-negra)
- [¿Puedo jugar Minecraft desde Android con un amigo que usa Java en PC?](https://velixblue.com/juegos/minecraft/android-con-java-pc)
- [¿Cómo reduzco el lag de Roblox en un celular sin instalar otras apps?](https://velixblue.com/juegos/roblox/reducir-lag-celular)
- [¿Por qué mi código de Free Fire aparece inválido o no se puede canjear?](https://velixblue.com/juegos/free-fire/codigo-invalido-canje)
- [¿Cómo activo la A2F de Epic Games para enviar regalos en Fortnite?](https://velixblue.com/juegos/fortnite/activar-a2f-regalos)
- [¿Cómo veo mi región de Free Fire y puedo cambiarla?](https://velixblue.com/juegos/free-fire/ver-region-cuenta)

Revisión documental: 16/11/2026, fuentes oficiales en cada artículo. Prioridad investigada 20 (Brawl Stars) reemplazada por 03 (región de Free Fire): documentación de Brawl Stars no verificable suficientemente. Coordenadas se explica sin activar trucos; no garantiza restaurar logros. No se han probado los pasos dentro de videojuegos ni cuantificado demanda panameña.

## Validación ejecutada

115 pruebas/14 archivos aprobados, build TypeScript/Vite aprobado, SEO de 24 rutas y diez HTML completos aprobado. Matriz de producción/main y preview heredando SITE_URL aprobada. Chrome y Firefox: sin JS, búsqueda, navegación, 320/390/768/1440 y sin errores críticos de consola. Batería completa de ocho herramientas, OCR recorte y pincel aprobada, incluidas imágenes 6750×9000 y 108 MP, PDF, descargas, transparencia, offline y procesamiento sin subir archivos. npm audit: cero vulnerabilidades reportadas. Detalle/comandos/límites en `docs/VELIX_2_0_VALIDACION.md`; capturas en docs/capturas.

## Publicación y próximos pasos

Pendiente verificar PR/check Cloudflare, fusionar si está aprobado y confirmar HTTP y navegadores contra producción. No declarar publicado basándose en dist. Registrar aquí PR, commit de integración, fecha real de despliegue y comprobaciones públicas.

Después de publicar: seguimiento SEO en Search Console (sin acceso confirmado). Enviar https://velixblue.com/sitemap.xml, inspeccionar URLs y HTML publicado, registrar línea base y revisar a 30/45/60 días. No prometer indexación. La revisión documental de artículos debe actualizarse solo tras verificar fuentes.

## Límites conocidos y reversión

No se probaron teléfonos físicos ni Safari real; no se midieron Core Web Vitals de campo. La IA y OCR mantienen límites de dispositivo y precisión. Textos legales pendientes de revisión jurídica y datos del responsable. No se añadió analítica; puede persistir configuración Cloudflare previa, no afirmar ausencia universal. Sin CMS, pagos, contenidos Viral/Memes ni imágenes de videojuegos republicadas.

Reversión mediante PR que revierta el commit de integración; Cloudflare reconstruye main. Base conocida anterior: c390bd55d090a715f50abeed8cfb4883edf67326. No hay migraciones de datos. Conservar herramientas y URLs. La investigación original continúa en VELIX_2_0_INVESTIGACION.md como referencia histórica, no como descripción de implementación pendiente.

WebKit Linux: intento de ejecución no completado por bibliotecas nativas ausentes en el entorno, incluso tras intentar dependencias locales. No se declara aprobado. Chrome y Firefox sí se ejecutaron; Safari/macOS/iOS queda como limitación de cobertura, no como fallo funcional observado.

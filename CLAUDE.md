# Vélix Blue — guía para continuar el proyecto

Vélix Blue (antes PixelTools; el repositorio conserva ese nombre) es una
aplicación React/TypeScript estática de Blue Lab Studios. Sus herramientas
procesan imágenes reales en el navegador: eliminación de fondos con ONNX Runtime
Web y `u2netp.onnx`; compresión, conversión, redimensión y recorte con Canvas; y
eliminación de metadatos trabajando directamente sobre los bytes del archivo.

## Antes de modificar código

```bash
npm install
npm test
npm run build
```

Node.js 20.19 o posterior. El build debe seguir siendo una salida estática en
`dist/`, compatible con Cloudflare Pages.

## Restricciones que no deben romperse

- Las fotografías se procesan localmente. No añadir subidas a servidores sin que
  la interfaz, la política de privacidad y la documentación lo indiquen.
- No almacenar fotografías ni añadir analítica, cookies o publicidad invasiva.
- Mantener validación de MIME, tamaño y dimensiones.
- Revocar Object URL y liberar canvas/bitmaps cuando dejen de usarse.
- JPEG no conserva transparencia: mantener el fondo blanco y el aviso al usuario.
- No llamar «comprimido» a un resultado cuyo tamaño sea mayor o igual al original.
- Mantener cancelación, reinicio y mensajes de error accesibles.
- No sustituir `u2netp.onnx` sin verificar licencia, procedencia, tamaño y
  rendimiento móvil. Conserva las atribuciones de `THIRD_PARTY_NOTICES.md`.
- No publicar anuncios reales todavía. Los espacios actuales son deliberados.
- Solo las herramientas con ruta en `src/lib/tools.ts` son reales; las demás se
  muestran como «Próximamente». No presentar como disponible algo que no existe.
- No añadir «Precios», «Iniciar sesión» ni cuentas sin actualizar la política de
  privacidad: hoy la promesa es «sin cuentas, sin subir fotos».
- La paleta es azul (tokens en `src/index.css`); los estilos propios van en
  `@layer components` para que las utilidades de Tailwind puedan sobrescribirlos.
- Privacidad y términos son borradores pendientes de revisión jurídica.

## Arquitectura relevante

- `src/pages/CompressorPage.tsx`: lote, ajustes (formato, calidad, tamaño máximo) y descargas.
- `src/lib/imageProcessing.ts`: decodificación, límites, Canvas y codificación.
- `src/pages/BackgroundRemoverPage.tsx`: experiencia y estados del eliminador.
- `src/lib/backgroundRemoval.ts`: carga del modelo, inferencia, máscara alfa y caja del sujeto.
- `src/lib/composition.ts`: fondo transparente/color/degradado/imagen/desenfocado y recorte al sujeto.
- `src/lib/geometry.ts`, `src/lib/zip.ts`: cálculos puros del recorte y ZIP sin dependencias.
- `src/lib/serviceWorker.ts`, `src/components/AppStatus.tsx`: registro PWA y avisos.
- `src/lib/tools.ts`: catálogo de herramientas (portada, menú y pie).
- `src/lib/resize.ts`, `src/lib/crop.ts`: cálculos y procesamiento de redimensión y recorte.
- `src/lib/metadata.ts`: lectura y limpieza de EXIF/XMP/IPTC sin recomprimir;
  conserva perfil de color y orientación. Debe seguir comprobando la copia limpia.
- `src/pages/ResizePage.tsx`, `CropPage.tsx`, `MetadataPage.tsx`: herramientas
  nuevas (carga diferida). El convertidor es `CompressorPage` con `mode="convert"`.
- `src/components/`: navegación, SEO en cliente y componentes reutilizables.
- `scripts/generate-static-pages.mjs`: HTML y metadatos estáticos por ruta.
- `scripts/copy-runtime-assets.mjs`: prepara WASM desde `onnxruntime-web`.
- `scripts/generate-service-worker.mjs`: genera `dist/sw.js`. Nunca debe cachear
  fotografías del usuario; solo archivos de la aplicación.
- `tests/`: validación de archivos, cálculos y límites de dimensiones.
- `e2e/smoke.mjs`: prueba de humo en Chromium sobre `dist/` (lotes, fondos, PWA, 390 px).

`dist/` y `public/ort/` son generados y no se versionan. El modelo
`public/models/u2netp.onnx` sí se versiona; su checksum y procedencia están en
`THIRD_PARTY_NOTICES.md`.

## Validación mínima para cada cambio

1. Ejecutar `npm test`.
2. Ejecutar `npm run build`.
3. Para cambios de procesamiento, comprobar en navegador una compresión real,
   un lote con ZIP, descarga, transparencia PNG, archivo incompatible y
   cancelación/reinicio.
4. Ejecutar `npm run test:e2e` tras el build (Chromium). Para comprobar
   estabilidad, `E2E_REPEAT=5 npm run test:e2e`. Cubre también el service
   worker sin conexión; no sustituye las pruebas en Firefox, Safari ni móviles reales.
5. Para cambios visuales, comprobar 390 px y escritorio, navegación por teclado,
   foco visible y ausencia de desbordamiento horizontal.
6. No declarar Firefox o Safari como probados si no se ejecutaron realmente.

## Configuración y publicación

Variables documentadas en `.env.example`:

- `SITE_URL` (o `VITE_SITE_URL`): solo `https://velixblue.com` habilita un
  build de producción local. En Cloudflare Pages la rama `main` usa ese dominio
  automáticamente; las demás ramas siguen bloqueadas aunque hereden variables.
- `functions/_middleware.ts` protege por host los alias `*.pages.dev` incluso
  cuando sirven el build de producción: robots bloqueante y `X-Robots-Tag`.
  El despliegue debe incluir Pages Functions; servir únicamente `dist/` en otro
  proveedor no aplica esa protección a alias del build de producción.
- `VITE_CONTACT_EMAIL`: activa el contacto por `mailto:`.
- `public/_headers` debe tener una sola regla `/*`; Cloudflare Pages no combina
  reglas `/*` repetidas y el modo prueba añade `X-Robots-Tag` dentro de ella.

En Cloudflare Pages: comando `npm run build`, salida `dist`. Antes de publicar,
configurar el dominio/correo reales y revisar los textos legales.

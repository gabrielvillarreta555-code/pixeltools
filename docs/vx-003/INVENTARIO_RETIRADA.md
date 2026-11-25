# VX-003 — inventario de retirada y recuperación

Base recuperable: `fa39de52395eea82adf9c8b98999123ef9d4714c`. Etiqueta: `vx-003-before-gaming`.

## Rutas retiradas

/herramientas, /comprimir-imagen, /eliminar-fondo, /convertir-imagen, /redimensionar-imagen, /recortar-imagen, /quitar-metadatos, /extraer-texto, /imagenes-a-pdf.

Responden 410 + noindex mediante Pages Functions, incluidas variantes con barra final y .html. Se retiran del sitemap y enlaces públicos. Los prefijos /models, /ort y /ocr también responden 410. No se redirigen a contenido sin relación.

## Elementos retirados

- Ocho interfaces y motores: Canvas/transformaciones, fondo ONNX/U²-Net, OCR/Tesseract, PDF, lotes/ZIP, edición de máscara y composición.
- Componentes React/Router de la aplicación, catálogo de herramientas, mascota Blue, iconos y manifest PWA anteriores.
- Dependencias ONNX Runtime Web, Tesseract y modelos spa/eng, pdf-lib, React/React DOM/Router, Tailwind y plugins/tipos que quedan sin consumidores.
- Tests específicos de funciones eliminadas. Su retirada no se presenta como pruebas aprobadas; siguen disponibles con el código original en Git. Se añaden pruebas para retirada HTTP, conservación editorial y nuevo diseño.
- Generadores y copia de runtimes antiguos. El SW anterior se sustituye por un worker de retiro sin caché de contenido.

## Archivos eliminados en el diff

- `LICENSES/Apache-2.0.txt`
- `LICENSES/pdf-lib-MIT.txt`
- `e2e/editorial.mjs`
- `e2e/mask-brush.mjs`
- `e2e/ocr-crop.mjs`
- `e2e/smoke.mjs`
- `public/blue-referencia.jpg`
- `public/blue-vivo.svg`
- `public/editorial/style.css`
- `public/icons/apple-touch-icon.png`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/icon-maskable-512.png`
- `public/models/README.md`
- `public/models/u2netp.onnx`
- `public/og-image.png`
- `public/og-image.svg`
- `public/site.webmanifest`
- `scripts/check-deployment.mjs`
- `scripts/check-editorial.mjs`
- `scripts/copy-runtime-assets.mjs`
- `scripts/generate-service-worker.mjs`
- `scripts/generate-static-pages.mjs`
- `src/App.tsx`
- `src/components/AdPlaceholder.tsx`
- `src/components/AppStatus.tsx`
- `src/components/BlueHint.tsx`
- `src/components/Icon.tsx`
- `src/components/Layout.tsx`
- `src/components/Logo.tsx`
- `src/components/MaskEditor.tsx`
- `src/components/Notice.tsx`
- `src/components/OcrCropEditor.tsx`
- `src/components/PageLoader.tsx`
- `src/components/Seo.tsx`
- `src/components/ToolIntro.tsx`
- `src/components/UploadZone.tsx`
- `src/index.css`
- `src/lib/backgroundInput.ts`
- `src/lib/backgroundRemoval.ts`
- `src/lib/composition.ts`
- `src/lib/crop.ts`
- `src/lib/files.ts`
- `src/lib/geometry.ts`
- `src/lib/imagePdf.ts`
- `src/lib/imageProcessing.ts`
- `src/lib/maskBrush.ts`
- `src/lib/metadata.ts`
- `src/lib/ocr.ts`
- `src/lib/resize.ts`
- `src/lib/serviceWorker.ts`
- `src/lib/targetCompression.ts`
- `src/lib/toolCatalog.json`
- `src/lib/tools.ts`
- `src/lib/useObjectUrl.ts`
- `src/lib/zip.ts`
- `src/main.tsx`
- `src/pages/BackgroundRemoverPage.tsx`
- `src/pages/CompressorPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/CropPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/ImagePdfPage.tsx`
- `src/pages/MetadataPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/OcrPage.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/ResizePage.tsx`
- `src/pages/TermsPage.tsx`
- `tests/backgroundInput.test.ts`
- `tests/editorial.test.ts`
- `tests/files.test.ts`
- `tests/geometry.test.ts`
- `tests/imagePdf.test.ts`
- `tests/imageProcessing.test.ts`
- `tests/maskBrush.test.ts`
- `tests/metadata.test.ts`
- `tests/ocr.test.ts`
- `tests/privacy-claims.test.ts`
- `tests/seo-build.test.ts`
- `tests/targetCompression.test.ts`
- `tests/transform.test.ts`
- `tests/zip.test.ts`

## Elementos conservados

Las diez URLs de consultas previas, sus fuentes y contenido principal; se eliminan únicamente dos enlaces a utilidades retiradas y se adaptan metadatos/portadas. /juegos/ conserva su URL y los anclajes de los cuatro juegos anteriores. Privacidad, términos y contacto conservan URL y se adaptan al servicio editorial, sin ocultar la analítica pendiente. Los informes históricos de docs son documentación de ingeniería, no páginas del sitio.

## Recuperación sin modificar producción

```bash
git fetch origin --tags
git worktree add ../velix-anterior vx-003-before-gaming
```

Tras una eventual integración aprobada, una reversión deberá hacerse mediante otro PR; no usar force-push sobre main. La actualización del SW elimina cachés antiguas de Vélix: recuperar una versión anterior requiere conexión para volver a cargar sus recursos. Un cliente totalmente offline que no haya recibido la actualización puede conservar la versión vieja hasta reconectarse; no se promete borrado remoto de archivos del usuario.

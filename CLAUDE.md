# PixelTools — guía para continuar el proyecto

PixelTools es una aplicación React/TypeScript estática de Blue Lab Studios. Sus
dos herramientas procesan imágenes reales en el navegador: compresión mediante
Canvas y eliminación de fondos mediante ONNX Runtime Web y `u2netp.onnx`.

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
- Privacidad y términos son borradores pendientes de revisión jurídica.

## Arquitectura relevante

- `src/pages/CompressorPage.tsx`: estado y experiencia del compresor.
- `src/lib/imageProcessing.ts`: decodificación, límites, Canvas y codificación.
- `src/pages/BackgroundRemoverPage.tsx`: experiencia y estados del eliminador.
- `src/lib/backgroundRemoval.ts`: carga del modelo, inferencia y máscara alfa.
- `src/components/`: navegación, SEO en cliente y componentes reutilizables.
- `scripts/generate-static-pages.mjs`: HTML y metadatos estáticos por ruta.
- `scripts/copy-runtime-assets.mjs`: prepara WASM desde `onnxruntime-web`.
- `tests/`: validación de archivos, cálculos y límites de dimensiones.

`dist/` y `public/ort/` son generados y no se versionan. El modelo
`public/models/u2netp.onnx` sí se versiona; su checksum y procedencia están en
`THIRD_PARTY_NOTICES.md`.

## Validación mínima para cada cambio

1. Ejecutar `npm test`.
2. Ejecutar `npm run build`.
3. Para cambios de procesamiento, comprobar en navegador una compresión real,
   descarga, transparencia PNG, archivo incompatible y cancelación/reinicio.
4. Para cambios visuales, comprobar 390 px y escritorio, navegación por teclado,
   foco visible y ausencia de desbordamiento horizontal.
5. No declarar Firefox o Safari como probados si no se ejecutaron realmente.

## Configuración y publicación

Variables documentadas en `.env.example`:

- `VITE_SITE_URL`: dominio público usado por el SEO en cliente.
- `VITE_CONTACT_EMAIL`: activa el contacto por `mailto:`.
- `SITE_URL`: dominio usado por el generador SEO durante el build.

En Cloudflare Pages: comando `npm run build`, salida `dist`. Antes de publicar,
configurar el dominio/correo reales y revisar los textos legales.

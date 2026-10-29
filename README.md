# PixelTools

Primera versión funcional de una plataforma pública de herramientas para
imágenes, desarrollada para Blue Lab Studios. Comprime y redimensiona JPG, PNG y
WebP (también por lotes, con descarga en ZIP) y elimina fondos con un modelo ONNX
ligero, con fondo transparente, de color o desenfocado y recorte automático al
sujeto. Las operaciones se realizan localmente en el navegador y la web se puede
instalar como aplicación (PWA) que funciona sin conexión.

## Funciones

- **Compresor:** hasta 30 imágenes por lote; formato original, JPG, PNG o WebP;
  calidad ajustable; tamaño máximo por lado (preajustes o personalizado, nunca
  amplía); resumen de peso total; descarga individual o en un ZIP generado en el
  navegador (`src/lib/zip.ts`, sin dependencias).
- **Eliminador de fondos:** U²-Net pequeño; fondo transparente, de color o
  desenfocado a partir del original; recorte al sujeto con margen; descarga en
  PNG o, con fondo opaco, JPG.
- **PWA:** manifest con iconos PNG y *maskable*, service worker generado en el
  build y avisos de «sin conexión» y «versión nueva disponible».

## Tecnologías

- React 19, TypeScript y Vite 7.
- Tailwind CSS 4.
- Canvas API, Blob, Object URL y `createImageBitmap` con alternativa para Safari.
- ONNX Runtime Web (WASM) y U²-Net pequeño para segmentación.
- React Router para navegación.
- Vitest para pruebas unitarias.
- Salida estática compatible con Cloudflare Pages.

No hay API, base de datos, almacenamiento de fotografías, analítica ni anuncios
en esta versión.

## Estructura

```text
pixeltools/
├── public/                 # Iconos, cabeceras Cloudflare, modelo ONNX y runtime
├── scripts/                # Copia de WASM y generación SEO de rutas estáticas
├── src/
│   ├── components/         # Layout, carga, SEO y controles reutilizables
│   ├── lib/                # Validación y procesamiento de imágenes
│   └── pages/              # Portada, herramientas y páginas informativas
├── tests/                  # Pruebas unitarias críticas
├── THIRD_PARTY_NOTICES.md  # Licencias, procedencia y checksum del modelo
└── vite.config.ts
```

## Requisitos

- Node.js 20.19+ o 22.12+ (Node 24 también es compatible).
- npm 10+.
- Un navegador moderno con Canvas y WebAssembly para el eliminador de fondos.

## Instalación y ejecución local

```bash
npm install
npm run dev
```

Vite mostrará la dirección local. Los archivos WASM se copian automáticamente
desde `onnxruntime-web` antes de iniciar el servidor.

Variables opcionales (consulta `.env.example`):

```bash
VITE_SITE_URL=https://dominio-final.example
VITE_CONTACT_EMAIL=contacto@dominio-final.example
```

El contacto queda claramente desactivado si no se configura una dirección.

## Compilación

```bash
SITE_URL=https://dominio-final.example npm run build
```

El resultado se escribe en `dist/`. Después de Vite, el script SEO crea HTML
estático con título, descripción, canonical y Open Graph para cada ruta. También
genera `sitemap.xml`, `robots.txt` y `404.html`. `SITE_URL` debe coincidir con el
dominio público; si se omite se usa provisionalmente
`https://pixeltools.pages.dev`.

## Pruebas

```bash
npm test
```

Las pruebas automatizadas cubren validación de tipos y tamaños, cálculo de
reducción, formato de bytes, nombres de descarga, redimensión proporcional,
cálculo del recorte al sujeto y el generador ZIP (CRC-32, cabeceras y nombres
duplicados). La compilación TypeScript y el build de producción son
comprobaciones adicionales.

### Prueba E2E en Chromium

```bash
npm run build
npm run test:e2e                # una ronda
E2E_REPEAT=5 npm run test:e2e   # varias rondas para detectar inestabilidad
E2E_ONLY=compressorCancel,mobile npm run test:e2e
```

`e2e/smoke.mjs` arranca `vite preview` sobre `dist/`, genera las imágenes de
prueba con Canvas y recorre lote con ZIP, rechazo de archivos, redimensión,
cancelación y reinicio, aviso JPG, transparencia PNG (alfa 0–255), recorte, fondo
de color y desenfocado, navegación por teclado, service worker y modo sin
conexión, y un perfil móvil de 390 px con la CPU ralentizada ×4. Usa el paquete
`playwright` (versión fijada); si tu equipo no tiene Chromium para esa versión,
ejecuta `npx playwright install chromium`.

La prueba E2E solo cubre Chromium. Firefox, Safari y los dispositivos reales
siguen necesitando la lista manual.

Lista manual recomendada antes de un lanzamiento:

1. Comprimir un JPG fotográfico a JPG y WebP y confirmar una reducción real.
2. Convertir un PNG transparente a PNG y comprobar el canal alfa.
3. Convertir ese PNG a JPG y comprobar el fondo blanco y el aviso visible.
4. Probar archivos corruptos, SVG renombrado, más de 25 MB y más de 32 MP.
5. Cancelar y reiniciar durante ambas operaciones.
6. Ejecutar eliminación de fondo con persona, producto, cabello y fondo similar.
7. Probar Chrome, Firefox y Safari actuales, incluidos teléfonos.
8. Verificar navegación directa a cada URL y la página 404.
9. Navegar con teclado y lector de pantalla básico.

## Cloudflare Pages

1. Sube el repositorio a tu proveedor Git autorizado.
2. Crea un proyecto de Pages conectado al repositorio.
3. Usa `npm run build` como comando de compilación.
4. Usa `dist` como directorio de salida.
5. Configura `SITE_URL`, `VITE_SITE_URL` y `VITE_CONTACT_EMAIL` en las variables
   de producción.
6. Mantén Node 20.19 o posterior (`NODE_VERSION=20.19.0`, por ejemplo).
7. Revisa la política de privacidad, los términos y el correo antes de desplegar.

Los archivos `_headers`, las rutas prerenderizadas y `404.html` ya se copian a
la salida. No se requiere un Worker ni funciones de servidor.

## Modo sin conexión (PWA)

`scripts/generate-service-worker.mjs` se ejecuta al final de `npm run build` y
escribe `dist/sw.js`:

- Precarga el HTML de cada ruta, JS, CSS, iconos y manifest, así que el
  compresor funciona sin conexión desde la primera visita.
- El modelo ONNX y el runtime WASM (~16 MB) se guardan solo la primera vez que se
  usa el eliminador, para no imponer esa descarga a quien no lo necesita.
- Navegación con red primero y caché como respaldo; los nombres de caché llevan
  un hash del contenido y las versiones antiguas se borran al activar.
- Cuando hay una versión nueva instalada, la interfaz ofrece «Actualizar ahora».
- Solo se registra en producción (`import.meta.env.PROD`). Para probarlo en
  local: `npm run build && npm run preview`.
- El service worker nunca guarda fotografías: solo archivos de la aplicación.

`_headers` sirve `sw.js` y el manifest con `Cache-Control: no-cache` para que las
actualizaciones se detecten.

## Privacidad y seguridad

- Los bytes de la fotografía no se envían a una API.
- El navegador descarga el JavaScript, ONNX Runtime y el modelo de 4,57 MB desde
  el sitio; después la inferencia es local.
- Los Object URL temporales se revocan y los canvas liberan sus buffers.
- Se comprueban MIME, peso y dimensiones.
- La salida JPEG se compone sobre blanco porque JPEG no admite transparencia.
- Se aplican cabeceras de aislamiento y seguridad adecuadas para un sitio estático.

## Límites conocidos

- Safari en iOS limita cada lienzo a unos 16,7 MP. Una imagen mayor sin «Tamaño
  máximo» puede fallar allí; la interfaz lo explica y sugiere reducirla. No se ha
  probado en un iPhone real.
- Compresor: 25 MB, 32 megapíxeles y 12.000 px por lado por imagen; 30 imágenes
  por lote, procesadas una tras otra. Los resultados del lote se mantienen en
  memoria hasta reiniciar.
- El ZIP usa el método STORE (sin compresión adicional, las imágenes ya están
  comprimidas) y no admite más de 4 GB.
- El fondo desenfocado se obtiene reduciendo y ampliando el original (compatible
  con Safari, donde `CanvasRenderingContext2D.filter` no está disponible).
- Eliminador: 15 MB y 24 megapíxeles de entrada; la salida se limita a 16 MP y
  4.096 px por lado para controlar memoria.
- Canvas vuelve a codificar la imagen y elimina metadatos EXIF. La orientación se
  intenta aplicar durante la decodificación, pero debe comprobarse en Safari.
- PNG no ofrece un control de calidad con pérdida mediante Canvas.
- La cancelación no puede interrumpir una llamada ONNX ya iniciada; descarta el
  resultado al finalizar.
- U²-Net pequeño prioriza tamaño y compatibilidad. Puede producir bordes
  imperfectos en pelo, cristal, sombras, objetos finos o escenas sin contraste.
- Equipos con poca memoria o sin WebAssembly pueden no ejecutar la segmentación.
- El correo, dominio, datos legales y jurisdicción son provisionales y deben
  configurarse/revisarse antes de publicar.

## Próximas mejoras

- Pruebas E2E automatizadas en navegadores y dispositivos reales.
- Procesamiento en Web Worker/OffscreenCanvas donde mejore compatibilidad.
- Refinado manual de máscara y comparación con deslizador.
- Recorte manual y eliminación de fondos por lotes.
- Analítica respetuosa con la privacidad y anuncios solo tras implementar el
  consentimiento legal necesario.
- Sustituir o complementar U²-Net pequeño si aparece un modelo de mejor calidad,
  licencia clara y tamaño razonable para móviles.

## Memoria en teléfonos

Medido en Chromium de escritorio (RSS total del navegador, una medición por caso)
con una fotografía de 24 MP:

| Operación | Pico adicional |
| --- | --- |
| Compresor 24 MP → WebP, sin redimensionar | ~200 MB |
| Eliminar el fondo | ~180 MB |
| Cambiar a fondo desenfocado | ~75 MB |
| Arrastrar el selector de color | ~125 MB |

Medidas aplicadas: el original decodificado se libera antes de codificar; el
fondo desenfocado sale de una miniatura creada una sola vez; las composiciones se
agrupan con una espera de 120 ms; el ZIP reutiliza los `Blob` sin copiarlos; los
lotes se procesan de uno en uno. En teléfonos con 3–4 GB de RAM conviene usar
«Tamaño máximo» con fotografías de más de 12 MP. Estas cifras no sustituyen una
prueba en dispositivos reales.

## Licencias

Consulta [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). El modelo U²-Net,
su conversión y las dependencias conservan sus propias licencias. Blue Lab
Studios debe decidir la licencia del código específico de PixelTools antes de
distribuirlo como proyecto reutilizable.

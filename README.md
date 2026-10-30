# Vélix Blue

Herramientas de imagen privadas, un producto de Blue Lab Studios (antes
«PixelTools»; el repositorio conserva ese nombre). Elimina fondos con IA,
comprime, convierte, redimensiona y recorta imágenes, y quita sus metadatos.
Todo se procesa localmente en el navegador y la web se puede instalar como
aplicación (PWA) que funciona sin conexión.

> Antes de registrar dominio o marca, comprueba que «Vélix Blue» esté libre
> (DIGERPI en Panamá, EUIPO, USPTO). El nombre se cambia fácilmente en el código.

## Funciones

- **Compresor:** hasta 30 imágenes por lote; formato original, JPG, PNG o WebP;
  calidad ajustable; tamaño máximo por lado (preajustes o personalizado, nunca
  amplía); resumen de peso total; descarga individual o en un ZIP generado en el
  navegador (`src/lib/zip.ts`, sin dependencias).
- **Eliminador de fondos:** U²-Net pequeño; comparador antes/después con
  deslizador; fondo transparente, de color, degradado, imagen propia o
  desenfocado a partir del original; recorte al sujeto con margen; descarga en
  PNG o, con fondo opaco, JPG.
- **Convertir formato:** el motor del compresor con textos propios; JPG, PNG o
  WebP, por lotes y con ZIP. Los archivos se llaman siempre «-convertida».
- **Redimensionar:** medidas de redes sociales (`SOCIAL_PRESETS`), medidas
  exactas con proporción bloqueable o porcentaje; si la proporción cambia,
  rellenar recortando o ajustar con bordes de color o transparentes.
- **Recortar:** proporciones libres o 1:1, 4:5, 3:4, 3:2, 16:9 y 9:16; giro y
  volteo; arrastre con dedo o ratón y control con teclado. La vista previa usa
  una copia de 1.400 px; el recorte se aplica a la resolución original.
- **Quitar metadatos:** lee y elimina EXIF (GPS, dispositivo, fecha, autor,
  número de serie), XMP, IPTC, comentarios, fragmentos de texto PNG y las
  imágenes incrustadas tras el final del JPEG, sin recomprimir. Conserva el
  perfil de color y la orientación. Analiza de nuevo la copia antes de ofrecerla.
- **Portada:** catálogo de herramientas con buscador (`src/lib/tools.ts`). Las
  herramientas sin ruta se muestran como «Próximamente».
- **PWA:** manifest con iconos PNG y *maskable*, service worker generado en el
  build y avisos de «sin conexión» y «versión nueva disponible».

## Tecnologías

- React 19, TypeScript y Vite 7.
- Tailwind CSS 4 con un tema oscuro propio (tokens en `src/index.css`).
- Tipografía Plus Jakarta Sans (OFL) empaquetada con la app, sin servicios externos.
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
SITE_URL=https://velixblue.com
VITE_CONTACT_EMAIL=contacto@dominio-final.example
```

El contacto queda claramente desactivado si no se configura una dirección.

## Compilación

```bash
SITE_URL=https://velixblue.com npm run build
```

El resultado se escribe en `dist/`. Después de Vite, el script SEO crea HTML
estático con título, descripción, canonical y Open Graph para cada ruta, además
de `robots.txt` y `404.html`.

**Indexación:** en Cloudflare Pages, la rama `main` genera las páginas indexables
con canonical y sitemap de `https://velixblue.com`. Las demás ramas generan
`noindex,nofollow`, `X-Robots-Tag`, un `robots.txt` bloqueante y ningún sitemap,
incluso si heredan la variable de producción. Fuera de Cloudflare, solo
`SITE_URL=https://velixblue.com` (o `VITE_SITE_URL`) habilita el build de
producción. La función `functions/_middleware.ts` bloquea los alias de prueba
por host, incluidos los `*.pages.dev` que sirven el mismo build de producción.

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

Configuración del proyecto:

- Comando de compilación: `npm run build`. Directorio de salida: `dist`.
- Node: `.node-version` fija la versión usada en local (22.22.0).
- Rama de producción: `main`. Confirma que `velixblue.com` esté asociado al
  despliegue de producción de este proyecto, no a un despliegue de prueba.
- Variables: `SITE_URL=https://velixblue.com` es opcional en producción;
  configura `VITE_CONTACT_EMAIL` y revisa privacidad y términos. Las ramas de
  prueba permanecen en modo `noindex` incluso si heredan `SITE_URL`.
- Pages debe desplegar el directorio `functions/` junto con `dist/`. Un despliegue
  puramente estático que copie solo `dist/` no protege los alias de producción.

Después del despliegue, verifica con `curl -i https://velixblue.com/robots.txt`
que aparezca `Allow: /` y el sitemap correcto, y con
`curl -I https://velixblue.com/` que no haya `X-Robots-Tag: noindex`.
Comprueba `https://velixblue.com/sitemap.xml` y los canonical en el HTML de cada
ruta. En la URL de prueba `*.pages.dev`, comprueba `Disallow: /` y el encabezado
`X-Robots-Tag: noindex, nofollow`. Si persiste contenido antiguo, revisa la
asociación del dominio y la caché de Cloudflare antes de solicitar en Search
Console la validación y el rastreo; la indexación no es inmediata ni automática.

Atención: al pulsar **Save and Deploy**, Cloudflare despliega en el acto la rama
de producción elegida en `<proyecto>.pages.dev`. Elige como producción la rama
que de verdad quieras mostrar en esa dirección.

Comportamiento comprobado con `wrangler pages dev` (emulador de Pages):
`/ruta` redirige con 308 a `/ruta/`, las rutas inexistentes devuelven `404.html`
con estado 404, `_headers` aplica COOP/COEP y caché inmutable a `/assets`,
`/models` y `/ort`, y el service worker funciona con esas redirecciones.

Prueba E2E contra un despliegue real o contra el emulador:

```bash
E2E_BASE_URL=https://<despliegue>.pages.dev npm run test:e2e
```

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
- Eliminador: 15 MB, 100 megapíxeles y 32.768 px por lado de entrada. Antes de
  mostrar la vista previa y cargar ONNX, lee las dimensiones y orientación del
  archivo comprimido y prepara una copia proporcional de hasta 2048 px por lado
  y 4 MP. Por ejemplo, 6750 × 9000 pasa a 1536 × 2048. La interfaz avisa del
  cambio; el original permanece intacto. El redondeo puede variar menos de un
  píxel respecto de la proporción matemática.
- Para originales grandes se necesita `createImageBitmap` con reducción. Si no
  existe, falla o ignora el tamaño solicitado, no se intenta una decodificación
  completa como alternativa: se solicita una imagen menor. Los buffers de la
  aplicación están limitados, pero el pico interno del decodificador depende del
  navegador; no se garantiza ejecución en todos los móviles. Safari, Firefox y
  teléfonos físicos requieren validación adicional.
- Canvas vuelve a codificar la imagen y elimina metadatos EXIF. La orientación se
  intenta aplicar durante la decodificación, pero debe comprobarse en Safari.
- PNG no ofrece un control de calidad con pérdida mediante Canvas.
- El compresor permite un objetivo de 1 a 25.600 KB por imagen, también en lotes.
  Para JPG/WebP prueba hasta nueve calidades entre 30% y 95% y conserva la mayor
  calidad probada que cumple el límite; no cambia las dimensiones salvo que el
  usuario lo seleccione. Si no lo alcanza, informa y entrega el menor archivo
  probado. Para PNG se codifica sin pérdida y se comprueba el tamaño real.
  La búsqueda es acotada y no garantiza la mejor calidad posible: los
  codificadores de los navegadores pueden no producir tamaños monótonos.
- La cancelación no puede interrumpir una llamada ONNX ya iniciada; descarta el
  resultado al finalizar.
- U²-Net pequeño prioriza tamaño y compatibilidad. Puede producir bordes
  imperfectos en pelo, cristal, sombras, objetos finos o escenas sin contraste.
- Equipos con poca memoria o sin WebAssembly pueden no ejecutar la segmentación.
- Redimensionar: hasta 8.000 px por lado y 16 MP de salida. Recortar: 25 MB y
  32 MP de entrada. Quitar metadatos: 50 MB; HEIC no es compatible.
- Las herramientas nuevas trabajan con una imagen cada vez (el compresor y el
  convertidor admiten lotes).
- El correo, dominio, datos legales y jurisdicción son provisionales y deben
  configurarse/revisarse antes de publicar.

## Próximas mejoras

- Pruebas E2E automatizadas en navegadores y dispositivos reales.
- Procesamiento en Web Worker/OffscreenCanvas donde mejore compatibilidad.
- Refinado manual de máscara y eliminación de fondos por lotes.
- Lotes en redimensionar, recortar y quitar metadatos.
- Herramientas marcadas «Próximamente»: imágenes a PDF, HEIC a JPG (revisar la
  licencia del decodificador), marca de agua y OCR.
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
Studios debe decidir la licencia del código específico de Vélix Blue antes de
distribuirlo como proyecto reutilizable.

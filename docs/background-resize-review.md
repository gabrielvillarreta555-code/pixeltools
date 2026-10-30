# Reducción segura antes de eliminar fondos

## Base revisada

El cambio parte de `4213341` en `claude/pixeltools-v1-complete-o3jybt`.
En la inspección inicial, `main` estaba en `ec4172f`: tenía lotes, ZIP, fondos y
PWA, pero aún no el rediseño Vélix Blue. La rama de Claude sí incorpora ese
rediseño y las herramientas de conversión, redimensión, recorte y metadatos.
El PR apunta a esa rama, sin fusionar ni desplegar en producción.

La arquitectura sigue siendo React/TypeScript/Vite con rutas diferidas, Canvas,
ONNX Runtime WASM, modelo local U²-Net y un service worker que guarda recursos
de la aplicación. La preparación nueva está aislada en `backgroundInput.ts`.

## Causa y corrección

El eliminador decodificaba el original y rechazaba sus dimensiones por encima
de 24 MP antes de llegar al cálculo de reducción. Una imagen 6750 × 9000 tiene
60,75 MP: un buffer RGBA completo representa aproximadamente 243 MB.

Ahora se leen cabeceras JPG/PNG/WebP y orientación EXIF antes de decodificar.
Se solicita una copia reducida con `createImageBitmap` y se comprueba el tamaño
devuelto. La misma copia sirve para vista previa, inferencia, máscara, comparación
y composición, y la interfaz muestra las medidas originales y nuevas. Para
6750 × 9000, la copia es de 1536 × 2048 (3:4), unos 12,6 MB por buffer RGBA.
Esto no es una medición de memoria total: ONNX y el navegador consumen más.

## Validación ejecutada

- 65 pruebas unitarias: las 42 existentes y 23 nuevas sobre reducción, límites,
  cabeceras, EXIF, cancelación, liberación del bitmap y compatibilidad.
- Build de producción y comprobación TypeScript.
- Suite E2E Chromium: lotes, ZIP, cancelación, comparador, fondos, PWA sin
  conexión, herramientas nuevas y pantalla de 390 px con CPU ralentizada ×4.
- Caso real generado de 6750 × 9000: aviso previo, vista previa reducida,
  inferencia ONNX, descarga PNG 1536 × 2048, alfa transparente/opaco,
  ausencia de desbordamiento y ausencia de subidas o servicios externos.
- La primera ejecución marcó erróneamente las URL locales `blob:` como tráfico
  externo; se corrigió esa aserción y se repitió con éxito el escenario afectado.

## Límites

Entrada: 15 MB, 100 MP y 32768 px por lado. Trabajo y salida: máximo 2048 px por
lado y 4 MP; nunca se amplía. El redondeo es inferior a un píxel respecto a la
proporción ideal. La reducción sacrifica resolución de salida para limitar los
buffers en móviles. El archivo original se conserva en el dispositivo.

El decodificador del navegador aún puede reservar memoria interna del original;
no se promete un máximo de RAM total. No hay fallback de decodificación completa
para originales grandes cuando la reducción no funciona. Se informa al usuario
de que debe usar un archivo menor o un navegador actualizado.

Las pruebas usan Chromium en Linux y un viewport móvil, no teléfonos físicos.
Firefox, Safari y dispositivos de gama media reales siguen pendientes. La
cancelación descarta la preparación/inferencia cuando vuelve el control de las
API nativas; no interrumpe una operación nativa en curso.

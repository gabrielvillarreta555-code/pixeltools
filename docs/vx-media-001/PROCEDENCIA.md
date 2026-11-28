# VX-MEDIA-001 · Procedencia de las imágenes recibidas

Lote 1, recibido el 28/11/2026 en la conversación de trabajo y aportado por dirección. Son **imágenes generadas con IA**; no se indicó la herramienta. Su uso como ilustración está autorizado por el CEO (VX-MEDIA-001).

**Reglas de uso:**
- Cada imagen publicada lleva el pie «Imagen ilustrativa generada con IA para Vélix. No muestra un producto, una prueba ni una captura reales.».
- No se presentan como fotografías de pruebas, capturas auténticas ni material oficial.
- El registro técnico está en `scripts/editorial/official-media.mjs` (`kind: 'ia'`, con lote, archivo original, SHA-256 completo y tamaño).

**Originales:** 10 PNG de unos 1.672 × 941 px. Para publicar se recortan a 16:9 exacto y se convierten a WebP (calidad 82) en 480, 960 y 1.600 px. Pesos resultantes: entre 17 y 171 KB por archivo.

| Recibida | Archivo original | SHA-256 | Contenido | Decisión | Observaciones |
|---|---|---|---|---|---|
| R01 | `104791dd-image.png` | `d33b306f7bc4c5f3…` | PC gaming con monitor, torre «GeForce RTX», teclado y altavoces con RGB | No asignada | Iluminación RGB intensa (contraria a la estética pedida), logotipos de LG, NVIDIA y Logitech visibles y una foto con personas generadas. Podría servir para el 46 (juegos de Android en PC) en una versión con luz natural y sin marcas |
| R02 | `8e3cafbe-image.png` | `df25037afc0e01d5…` | PS5 con DualSense y menú de PlayStation | No asignada | Recrea portadas y personajes de God of War, Fortnite, The Last of Us, Horizon y Spider-Man (propiedad de terceros), con texto deformado. Ningún artículo trata la PS5 |
| R03 | `dfbdda70-image.png` | `d81652b2a33708ad…` | Tarjeta gráfica de tres ventiladores | No asignada | Es una GPU de sobremesa y el artículo 42 trata la GPU de un teléfono. Reservada para un futuro artículo sobre PC |
| R04 | `9cf65242-image.png` | `39a7f0d7164824c4…` | Router wifi con cuatro antenas | **Integrada**: portada del 28 (IMG-35) | Logotipo de TP-Link visible: se identifica como ilustración generada con IA. Recomendable sustituirla más adelante por una versión sin marca |
| R05 | `12eecd8f-image.png` | `996292aa1816ea93…` | Teléfono en una base de carga (67 %) | **Integrada**: portada del 36 (IMG-43) | Encaja en parte: el inventario pedía jugar mientras carga y la imagen no muestra un juego. Artículo retenido para producción |
| R06 | `2438b622-image.png` | `294b50afb87c1e25…` | Portátil con Windows 11 y SSD externo | No asignada | Ningún artículo trata el almacenamiento del PC; logotipos de Intel y Microsoft visibles |
| R07 | `cc41ef8a-image.png` | `5eaf735ebc4848a8…` | Teléfono con la pantalla de almacenamiento (114/128 GB) | **Integrada**: portada del 44 (IMG-48) | Encaje exacto con el inventario |
| R08 | `90b65083-image.png` | `fc584f974f6dcbd7…` | Módulos de RAM de PC y placa base | No asignada | Los artículos 35 y 48 tratan la memoria del teléfono, soldada en la placa: la imagen sería técnicamente engañosa |
| R09 | `157235b2-image.png` | `d05a0f9e6915cc43…` | Tarjeta gráfica de dos ventiladores | No asignada | Mismo motivo que R03 |
| R10 | `506430fb-image.png` | `62a1b8fe0cb6e621…` | Teléfono en horizontal con un juego de carreras y un mando de Xbox | **Integrada**: portada del 47 (IMG-51) | El mando está junto al teléfono, no acoplado. Encaje bueno |

**Resumen:** 10 recibidas, 4 integradas y 6 no asignadas. Las no asignadas no se han copiado al proyecto; sus originales siguen disponibles en la conversación.

## Lote 2 · VX-MEDIA-002 (28/11/2026)

Cinco imágenes generadas con IA, recibidas e integradas por decisión expresa del CEO («úsalas»). Huellas SHA-256 completas en `scripts/editorial/official-media.mjs`.

| Archivo | Destino | Observación registrada antes de integrar |
|---|---|---|
| `fb16d5da-image.png` | 42 · GPU (IMG-18) | Muestra el logotipo de MediaTek y texto ilegible en la batería |
| `e32ca09b-image.png` | 41 · 120 Hz y 30 FPS (IMG-17) | Enfrenta «30 FPS» y «120 Hz» como alternativas, cuando el artículo explica que son medidas distintas |
| `5ce23939-image.png` | 01 · Error 280 (IMG-16) | Muestra una actualización del sistema; el artículo trata la actualización de la app |
| `6e7b62e0-image.png` | 27 · Copia de un mundo de Minecraft (IMG-15) | Recrea un Creeper y el bloque de hierba de Mojang; muestra una copia en la nube desde el teléfono, no en un PC con Java |
| `df95b403-image.png` | 43 · Vulkan y OpenGL ES (IMG-19) | Puede sugerir que Vulkan «se ve mejor»; encajaría también en el 51 (escalado) |

## Lote 3 · VX-MEDIA-003 (28/11/2026)

Sustituciones aportadas por dirección para cuatro imágenes del lote 2. Huellas SHA-256 en `scripts/editorial/official-media.mjs`.

| Archivo | Sustituye en | Contenido |
|---|---|---|
| `6b4a08ae-image.png` | 01 · Error 280 | Aviso «Actualización de la app necesaria» de Roblox |
| `81ca38f3-image.png` | 41 · 120 Hz y 30 FPS | Ajuste de frecuencia de pantalla (120, 90 y 60 Hz) |
| `f41c5061-image.png` | 42 · GPU | Placa de un teléfono con el procesador sin marca |
| `fd2b75ac-image.png` | 27 · Copia de un mundo | Carpeta de copias de Minecraft en el explorador de Windows, con disco externo |

Las imágenes del lote 2 para estos artículos quedan sustituidas; sus observaciones dejan de aplicarse.

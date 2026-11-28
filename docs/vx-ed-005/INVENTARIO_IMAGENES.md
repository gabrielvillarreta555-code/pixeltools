# Inventario de imágenes · Vélix Gaming & Tecnología

28/11/2026 · Rama `vx-ed-004` (PR #21). Revisados los 51 artículos, la portada, `/juegos/`, los 6 universos, las 4 secciones editoriales y Rendimiento y Tecnología. Hoja de seguimiento: [inventario-imagenes.csv](inventario-imagenes.csv). **No se ha incorporado ninguna imagen.**

## Situación actual

- Solo hay **2 imágenes publicadas**, ambas de Clash Royale (Supercell Fan Kit): `clash-royale` y `clash-tactics`.
- `clash-royale` se usa a la vez como cabecera del universo Clash Royale y como portada del artículo 15. Esa repetición se resuelve con IMG-09.
- El resto del sitio usa portadas de texto.

## Especificación técnica

| Tipo | Original | Publicado | Ubicación y registro |
|---|---|---|---|
| Portadas y cabeceras | ≥ 2.400 × 1.350 px, 16:9, JPEG o PNG sin compresión, sRGB, sin texto incrustado, motivo centrado | WebP 480 × 270, 960 × 540 y 1.600 × 900; cada archivo ≤ 400 KB (límite que comprueba el build) | `public/media/` + registro en `scripts/editorial/official-media.mjs` (texto alternativo, pie, autor, licencia y aviso) + `docs/vx-003/PERMISOS_IMAGENES.md` + `THIRD_PARTY_NOTICES.md` |
| Figuras dentro del artículo | PNG o SVG de la fuente | WebP de 1.200 px de ancho, ≤ 400 KB | `public/media/fig-*`. Requiere activar imágenes en Markdown |
| Imagen social por defecto | PNG 1.200 × 630 | JPEG 1.200 × 630, ≤ 300 KB | `public/media/`. Requiere cambio de plantilla |

Cada imagen nueva requiere además cambiar `cover` en el frontmatter (o `hero` en `themes.mjs`) por su nombre de archivo, y conservar el original, su URL, la licencia y la fecha de obtención.

## Imprescindibles (19)

Las 5 cabeceras de universo que faltan, más las portadas de los artículos que aparecen en la portada de producción.

| ID | Artículo o página | Imagen y temática | Fuente | Permiso | Archivo en `public/media/` |
|---|---|---|---|---|---|
| IMG-01 | Universo GTA VI | GTA VI: Leonida y Vice City — Arte clave oficial del juego | Rockstar Games | ❌ Requiere autorización escrita | `universo-gta-vi-{480,960,1600}.webp` |
| IMG-02 | Universo Free Fire | Free Fire: la isla de batalla — Arte clave oficial del juego | Garena | ❌ Requiere autorización escrita | `universo-free-fire-{480,960,1600}.webp` |
| IMG-03 | Universo Minecraft | Minecraft: un paisaje de bloques — Captura panorámica propia de un mundo de Minecraft | Mojang: captura propia del juego bajo las Minecraft Usage Guidelines | ⚠️ Verificar | `universo-minecraft-{480,960,1600}.webp` |
| IMG-04 | Universo Fortnite | Fortnite: la isla de la temporada — Arte clave oficial de la temporada vigente | Epic Games | ❌ Requiere autorización escrita | `universo-fortnite-{480,960,1600}.webp` |
| IMG-05 | Universo Roblox | Roblox: plataforma y comunidad — Imagen corporativa del kit de prensa | Roblox: kit de prensa o captura propia | ⚠️ Verificar | `universo-roblox-{480,960,1600}.webp` |
| IMG-06 | 11 · GTA VI ya está aquí | Lanzamiento de GTA VI en PS5 y Xbox Series — Arte o imagen oficial de lanzamiento | Rockstar Games | ❌ Requiere autorización escrita | `art-11-gta-vi-lanzamiento-{480,960,1600}.webp` |
| IMG-07 | 13 · FFWS 2026 en Bangkok | Finales de la FFWS 2026 — Fotografía oficial del evento en Bangkok | Garena | ❌ Requiere autorización escrita | `art-13-ffws-bangkok-{480,960,1600}.webp` |
| IMG-08 | 14 · Storm Arena | Storm Arena en Free Fire — Imagen oficial del modo Storm Arena | Garena | ❌ Requiere autorización escrita | `art-14-storm-arena-{480,960,1600}.webp` |
| IMG-09 | 15 · Crown Series cambia la preparación | Crown Series: competición en Clash Royale — Arte del Fan Kit relacionado con el modo competitivo, distinto de la cabecera del universo (hoy se repite) | Supercell Fan Kit (fankit.supercell.com) bajo Fan Content Policy, con aviso obligatorio | ✅ Oficial con permiso | `art-15-crown-series-{480,960,1600}.webp` |
| IMG-10 | 18 · Espejo evolucionado | La carta Espejo evolucionada — Arte de carta o evolución del Fan Kit | Supercell Fan Kit (fankit.supercell.com) bajo Fan Content Policy, con aviso obligatorio | ✅ Oficial con permiso | `art-18-espejo-evolucionado-{480,960,1600}.webp` |
| IMG-11 | 19 · RoyaleAPI y variantes de mazos | Construcción de mazos en Clash Royale — Arte de cartas del Fan Kit (no captura de RoyaleAPI, que pertenece a un tercero) | Supercell Fan Kit (fankit.supercell.com) bajo Fan Content Policy, con aviso obligatorio | ✅ Oficial con permiso | `art-19-mazos-royaleapi-{480,960,1600}.webp` |
| IMG-12 | 21 · Minecraft 26.4 Deep Freeze | Novedades de Deep Freeze — Captura propia de la pre-release | Mojang: captura propia del juego bajo las Minecraft Usage Guidelines | ⚠️ Verificar | `art-21-minecraft-deep-freeze-{480,960,1600}.webp` |
| IMG-13 | 22 · Fortnite Golden Week | Cofres dorados de Golden Week — Imagen oficial del evento | Epic Games | ❌ Requiere autorización escrita | `art-22-fortnite-golden-week-{480,960,1600}.webp` |
| IMG-14 | 23 · Roblox Studio y simulación acústica | Audio espacial en Roblox Studio — Captura propia de Roblox Studio con el panel de sonido | Roblox: kit de prensa o captura propia | ⚠️ Verificar | `art-23-roblox-studio-audio-{480,960,1600}.webp` |
| IMG-15 | 27 · Copia de un mundo de Minecraft Java | Copia de seguridad de un mundo — Captura propia del lanzador y de la carpeta de mundos | Mojang: captura propia del juego bajo las Minecraft Usage Guidelines | ⚠️ Verificar | `art-27-minecraft-copia-mundo-{480,960,1600}.webp` |
| IMG-16 | 01 · Error 280 de Roblox | Aviso de versión en Roblox — Fotografía propia de un teléfono con el aviso en pantalla | Roblox: kit de prensa o captura propia | ⚠️ Verificar | `art-01-roblox-error-280-{480,960,1600}.webp` |
| IMG-17 | 41 · 120 Hz y 30 FPS | Frecuencia de pantalla y FPS — Fotografía propia de un teléfono con el ajuste de frecuencia de pantalla | Fotografía o captura propia de Vélix | ✅ Propia | `art-41-120hz-30fps-{480,960,1600}.webp` |
| IMG-18 | 42 · Cómo funciona la GPU | El chip gráfico de un teléfono — Fotografía propia de la placa de un teléfono abierto (unidad propia o de reparación) | Fotografía o captura propia de Vélix | ✅ Propia | `art-42-gpu-telefono-{480,960,1600}.webp` |
| IMG-19 | 43 · Vulkan y OpenGL ES | Dos generaciones de gráficos en Android — Fotografía propia de dos teléfonos Android de distinta generación | Fotografía o captura propia de Vélix | ✅ Propia | `art-43-vulkan-opengl-{480,960,1600}.webp` |

## Complementarias (43)

El resto de portadas de artículo (incluidos los 8 retenidos y el borrador 38), las cabeceras de sección, la imagen social y las figuras interiores.

| ID | Artículo o página | Imagen y temática | Fuente | Permiso | Archivo en `public/media/` |
|---|---|---|---|---|---|
| IMG-20 | 02 · Coordenadas en Minecraft Bedrock | Coordenadas en Minecraft Bedrock — Captura propia con las coordenadas visibles | Mojang: captura propia del juego bajo las Minecraft Usage Guidelines | ⚠️ Verificar | `art-02-minecraft-coordenadas-{480,960,1600}.webp` |
| IMG-21 | 03 · Error 279 de Roblox en Android | Error 279 de Roblox en Android — Fotografía propia de un Android con aviso de conexión | Roblox: kit de prensa o captura propia | ⚠️ Verificar | `art-03-roblox-error-279-{480,960,1600}.webp` |
| IMG-22 | 04 · Requisitos de Free Fire en el celular | Requisitos de Free Fire en el celular — Fotografía propia de un teléfono de gama de entrada (sin arte de Garena) | Fotografía o captura propia de Vélix | ✅ Propia | `art-04-ff-requisitos-{480,960,1600}.webp` |
| IMG-23 | 05 · Cierres y pantalla negra | Cierres y pantalla negra — Fotografía propia de un teléfono con la pantalla en negro | Fotografía o captura propia de Vélix | ✅ Propia | `art-05-ff-cierres-{480,960,1600}.webp` |
| IMG-24 | 06 · Minecraft entre Android y PC | Minecraft entre Android y PC — Fotografía propia de un teléfono y un PC con Minecraft | Mojang: captura propia del juego bajo las Minecraft Usage Guidelines | ⚠️ Verificar | `art-06-minecraft-android-pc-{480,960,1600}.webp` |
| IMG-25 | 07 · Lag de Roblox en el celular | Lag de Roblox en el celular — Fotografía propia de un teléfono con la cobertura y el Wi-Fi visibles | Fotografía o captura propia de Vélix | ✅ Propia | `art-07-roblox-lag-{480,960,1600}.webp` |
| IMG-26 | 08 · Códigos de Free Fire | Códigos de Free Fire — Imagen oficial de canje | Garena | ❌ Requiere autorización escrita | `art-08-ff-codigos-{480,960,1600}.webp` |
| IMG-27 | 09 · A2F de Epic Games | A2F de Epic Games — Fotografía propia de un teléfono con una app de autenticación genérica | Fotografía o captura propia de Vélix | ✅ Propia | `art-09-fortnite-a2f-{480,960,1600}.webp` |
| IMG-28 | 10 · Región de la cuenta de Free Fire | Región de la cuenta de Free Fire — Fotografía propia de un teléfono sobre un mapa | Fotografía o captura propia de Vélix | ✅ Propia | `art-10-ff-region-{480,960,1600}.webp` |
| IMG-29 | 12 · Álbum ampliado de GTA VI | Álbum ampliado de GTA VI — Portada oficial del álbum o arte musical | Rockstar Games | ❌ Requiere autorización escrita | `art-12-gta-vi-album-{480,960,1600}.webp` |
| IMG-30 | 17 · Cambios de balance en diciembre | Cambios de balance en diciembre — Arte de cartas del Fan Kit, distinto de IMG-09 a IMG-11 | Supercell Fan Kit (fankit.supercell.com) bajo Fan Content Policy, con aviso obligatorio | ✅ Oficial con permiso | `art-17-clash-balance-{480,960,1600}.webp` |
| IMG-31 | 20 · Ventas de GTA VI según Take-Two | Ventas de GTA VI según Take-Two — Imagen corporativa de Take-Two | Take-Two Interactive (prensa) | ❌ Requiere autorización escrita | `art-20-gta-vi-ventas-{480,960,1600}.webp` |
| IMG-32 | 24 · Champion Rush en FFWS 2026 | Champion Rush en FFWS 2026 — Fotografía oficial de la competición | Garena | ❌ Requiere autorización escrita | `art-24-ff-champion-rush-{480,960,1600}.webp` |
| IMG-33 | 25 · Copa Scott Pilgrim de Fortnite | Copa Scott Pilgrim de Fortnite — Arte oficial del torneo | Epic Games | ❌ Requiere autorización escrita | `art-25-fortnite-copa-{480,960,1600}.webp` |
| IMG-34 | 26 · Orden de mazos en Crown Series | Orden de mazos en Crown Series — Arte del Fan Kit, distinto de IMG-09 | Supercell Fan Kit (fankit.supercell.com) bajo Fan Content Policy, con aviso obligatorio | ✅ Oficial con permiso | `art-26-clash-orden-duelo-{480,960,1600}.webp` |
| IMG-35 | 28 · Fortnite no encuentra partida | Fortnite no encuentra partida — Fotografía propia de un router y un teléfono | Fotografía o captura propia de Vélix | ✅ Propia | `art-28-fortnite-emparejamiento-{480,960,1600}.webp` |
| IMG-36 | 29 · Jason y Lucia en Vice City | Jason y Lucia en Vice City — Arte oficial de los protagonistas | Rockstar Games | ❌ Requiere autorización escrita | `art-29-gta-vi-jason-lucia-{480,960,1600}.webp` |
| IMG-37 | 30 · Apelaciones en Roblox | Apelaciones en Roblox — Imagen corporativa del kit de prensa | Roblox: kit de prensa o captura propia | ⚠️ Verificar | `art-30-roblox-apelaciones-{480,960,1600}.webp` |
| IMG-38 | 31 · AnTuTu y los juegos | AnTuTu y los juegos — Fotografía propia de un teléfono ejecutando un benchmark (sin logotipos en primer plano) | Fotografía o captura propia de Vélix | ✅ Propia | `art-31-antutu-{480,960,1600}.webp` |
| IMG-39 | 32 · GTA San Andreas en Google Play | GTA San Andreas en Google Play — Arte oficial del juego | Rockstar Games | ❌ Requiere autorización escrita | `art-32-gta-san-andreas-{480,960,1600}.webp` |
| IMG-40 | 33 · Qué hace el modo juego | Qué hace el modo juego — Fotografía propia de un teléfono Android con la herramienta de juego de su fabricante abierta | Fotografía o captura propia de Vélix | ✅ Propia | `art-33-modo-juego-{480,960,1600}.webp` |
| IMG-41 | 34 · Redmi sin Game Turbo | Redmi sin Game Turbo — Fotografía propia de un Redmi con la app Seguridad abierta | Fotografía o captura propia de Vélix | ✅ Propia | `art-34-redmi-game-turbo-{480,960,1600}.webp` |
| IMG-42 | 35 · RAM virtual | RAM virtual — Fotografía propia del ajuste de RAM ampliada en un Samsung o Xiaomi | Fotografía o captura propia de Vélix | ✅ Propia | `art-35-ram-virtual-{480,960,1600}.webp` |
| IMG-43 | 36 · Pérdida de FPS por calor | Pérdida de FPS por calor — Fotografía propia de un teléfono en horizontal durante una partida larga, conectado al cargador | Fotografía o captura propia de Vélix | ✅ Propia | `art-36-perdida-fps-{480,960,1600}.webp` |
| IMG-44 | 37 · Mismo procesador, distinto rendimiento | Mismo procesador, distinto rendimiento — Fotografía propia de dos teléfonos con el mismo chip | Fotografía o captura propia de Vélix | ✅ Propia | `art-37-mismo-procesador-{480,960,1600}.webp` |
| IMG-45 | 38 · Cámara de vapor (borrador) | Cámara de vapor (borrador) — Fotografía propia de una cámara de vapor en un desmontaje | Fotografía o captura propia de Vélix | ✅ Propia | `art-38-camara-vapor-{480,960,1600}.webp` |
| IMG-46 | 39 · Juegos en iPhone y Android | Juegos en iPhone y Android — Fotografía propia de un iPhone y un Android juntos | Fotografía o captura propia de Vélix | ✅ Propia | `art-39-iphone-android-{480,960,1600}.webp` |
| IMG-47 | 40 · Elegir un teléfono para jugar | Elegir un teléfono para jugar — Fotografía propia de varios teléfonos sobre una mesa | Fotografía o captura propia de Vélix | ✅ Propia | `art-40-elegir-telefono-{480,960,1600}.webp` |
| IMG-48 | 44 · Por qué los juegos ocupan tantos GB | Por qué los juegos ocupan tantos GB — Fotografía propia de la pantalla de almacenamiento de un teléfono | Fotografía o captura propia de Vélix | ✅ Propia | `art-44-tamano-juegos-{480,960,1600}.webp` |
| IMG-49 | 45 · Google Play «no compatible» | Google Play «no compatible» — Captura propia de una ficha de Google Play con el aviso | Captura propia de Google Play (directrices de marca de Google) | ⚠️ Verificar | `art-45-google-play-compatible-{480,960,1600}.webp` |
| IMG-50 | 46 · Juegos de Android en PC | Juegos de Android en PC — Fotografía propia de un PC con Google Play Games abierto | Fotografía propia (interfaz de Google) | ⚠️ Verificar | `art-46-android-en-pc-{480,960,1600}.webp` |
| IMG-51 | 47 · Mando en el teléfono | Mando en el teléfono — Fotografía propia de un mando de consola con un teléfono acoplado | Fotografía o captura propia de Vélix | ✅ Propia | `art-47-mando-telefono-{480,960,1600}.webp` |
| IMG-52 | 48 · Mucha RAM y aun así lento | Mucha RAM y aun así lento — Fotografía propia de la pantalla de memoria en los ajustes | Fotografía o captura propia de Vélix | ✅ Propia | `art-48-ram-lento-{480,960,1600}.webp` |
| IMG-53 | 49 · iPhone caliente al jugar | iPhone caliente al jugar — Fotografía propia de un iPhone sujeto en horizontal durante una partida | Fotografía o captura propia de Vélix | ✅ Propia | `art-49-iphone-calor-{480,960,1600}.webp` |
| IMG-54 | 50 · Ver los FPS de un juego | Ver los FPS de un juego — Captura propia del contador de FPS de Game Dashboard en un Pixel | Captura propia (interfaz de Android) | ⚠️ Verificar | `art-50-ver-fps-{480,960,1600}.webp` |
| IMG-55 | 51 · Escalado de resolución | Escalado de resolución — Comparación propia de una escena a dos resoluciones (con un juego cuyas capturas estén permitidas) | Fotografía o captura propia de Vélix | ✅ Propia | `art-51-escalado-{480,960,1600}.webp` |
| IMG-56 | Sección Rendimiento | Rendimiento: jugar con estabilidad — Fotografía propia de un teléfono en uso durante una partida (sin interfaz de juego reconocible) | Fotografía o captura propia de Vélix | ✅ Propia | `seccion-rendimiento-{480,960,1600}.webp` |
| IMG-57 | Sección Tecnología | Tecnología para jugar — Fotografía propia de teléfonos, mando y accesorios sobre una mesa | Fotografía o captura propia de Vélix | ✅ Propia | `seccion-tecnologia-{480,960,1600}.webp` |
| IMG-58 | Todo el sitio | Vélix Gaming & Tecnología — Composición tipográfica propia con el logotipo (sin fotografía) | Diseño propio de Vélix | ✅ Propia | `velix-social-1200x630.jpg` |
| IMG-59 | 33 · Modo juego | Game Dashboard sobre un juego — Figura oficial «Game Dashboard shown overlaying the running game» | Figura de developer.android.com (CC BY 2.5, con atribución) | ✅ CC BY 2.5 | `fig-33-game-dashboard-1200.webp` |
| IMG-60 | 36 · Pérdida de FPS | Margen térmico con y sin control — Figuras oficiales 1 y 2 de la Thermal API | Figura de developer.android.com (CC BY 2.5, con atribución) | ✅ CC BY 2.5 | `fig-36-thermal-headroom-1200.webp` |
| IMG-61 | 48 · Mucha RAM y lento | Prioridad del low-memory killer — Figura oficial de categorías del LMK (memory management) | Figura de developer.android.com (CC BY 2.5, con atribución) | ✅ CC BY 2.5 | `fig-48-lmk-1200.webp` |
| IMG-62 | 35 · RAM virtual | Tres tipos de memoria en Android — Figura oficial «Types of memory» (RAM, zRAM, almacenamiento) | Figura de developer.android.com (CC BY 2.5, con atribución) | ✅ CC BY 2.5 | `fig-35-tipos-memoria-1200.webp` |

---

## Estado tras VX-MEDIA-001 (28/11/2026)

El CEO autorizó en VX-MEDIA-001 las **ilustraciones generadas con IA**. Muchas imágenes marcadas «Propia» o «Requiere autorización» pueden resolverse ahora con una ilustración IA, siempre que no recree personajes, logotipos ni portadas de terceros y se identifique en su pie. Registro del lote: `docs/vx-media-001/PROCEDENCIA.md`.

| Estado | Imágenes |
|---|---|
| **Recibidas** | 10 (lote VX-MEDIA-001) |
| **Integradas** | 4: IMG-35 (art. 28), IMG-43 (art. 36, retenido), IMG-48 (art. 44) e IMG-51 (art. 47) |
| **Recibidas sin asignar** | 6: dos GPU de sobremesa, módulos de RAM de PC, portátil con SSD, PC con RGB intenso y PS5 con portadas de juegos de terceros. Ver motivos en la procedencia |
| **A reemplazar** | IMG-09 (art. 15, repite la cabecera de Clash Royale); IMG-35 (logotipo de TP-Link visible, sustituir por una versión sin marca); IMG-43 (añadir un juego en pantalla) |
| **Pendientes** | 56 de las 62 del inventario, más la sustitución de IMG-09 |

## Siguiente lote: 10 imágenes por prioridad

Prioridad: primero las que aparecen en la portada de producción y después las que completan las secciones Rendimiento y Tecnología, donde hoy conviven tarjetas con imagen y sin ella.

| Orden | Código | Artículo | Título exacto de la imagen | Qué debe mostrar |
|---|---|---|---|---|
| 1 | IMG-17 | 41 · 120 Hz y 30 FPS | Frecuencia de pantalla y FPS | Teléfono con el ajuste de frecuencia de pantalla (60/90/120 Hz) abierto |
| 2 | IMG-18 | 42 · GPU del teléfono | El chip gráfico de un teléfono | Placa de un teléfono abierto, con el procesador visible y sin marcas legibles |
| 3 | IMG-19 | 43 · Vulkan y OpenGL ES | Dos generaciones de gráficos en Android | Dos teléfonos Android de distinta generación, lado a lado, con las pantallas encendidas |
| 4 | IMG-16 | 01 · Error 280 de Roblox | Aviso de versión en el teléfono | Teléfono con un aviso genérico de «actualización necesaria», sin logotipo ni interfaz de Roblox |
| 5 | IMG-15 | 27 · Copia de un mundo de Minecraft | Copia de seguridad de un mundo | Portátil con una carpeta de copia de seguridad y un disco externo, sin arte de Minecraft |
| 6 | IMG-14 | 23 · Roblox Studio y audio | Audio espacial en un editor 3D | Portátil con un editor 3D genérico y ondas de audio, sin logotipos |
| 7 | IMG-49 | 45 · Google Play «no compatible» | Juego no compatible con el dispositivo | Teléfono con una tienda de aplicaciones genérica mostrando un aviso de incompatibilidad, sin logotipos de Google |
| 8 | IMG-52 | 48 · Mucha RAM y lento | La memoria del teléfono en ajustes | Teléfono con una pantalla de memoria o RAM, con composición distinta de IMG-48 |
| 9 | IMG-53 | 49 · iPhone caliente al jugar | Partida larga en un teléfono | Smartphone en horizontal sostenido durante una partida, luz cálida natural, sin logotipo de Apple |
| 10 | IMG-54 | 50 · Ver los FPS | Contador de FPS en pantalla | Teléfono con un contador de FPS superpuesto en la esquina de un juego genérico |

Lotes siguientes: IMG-55 (51), IMG-46 (39), IMG-50 (46, con luz natural en lugar de RGB), IMG-38 (31), IMG-40 a IMG-44 (33–37) y las cabeceras de universo (IMG-01 a IMG-05) como ambientaciones sin personajes ni logotipos.

**Especificación del lote:**
- Formato 16:9, al menos 1.672 × 941 px (idealmente 2.400 × 1.350), en PNG.
- Luz natural, sin RGB exagerado ni efectos.
- Sin logotipos, marcas legibles, personajes, portadas ni interfaces reconocibles de terceros, y sin personas identificables.
- Continuidad de estilo con el lote 1 (escritorio de madera, planta, tonos cálidos), variando el encuadre para que ninguna imagen repita la composición de otra.

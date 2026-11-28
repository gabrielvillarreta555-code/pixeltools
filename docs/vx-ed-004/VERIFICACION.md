# VX-ED-004 · Fuentes pendientes de verificación

27 de noviembre de 2026 (actualizado el 28/11/2026 con la ronda 1, §6, el estado de publicación, §7, y la ronda 2, §8). Listado para verificar las fuentes de los diez borradores (31–40) en colaboración con el equipo. Versión para hoja de cálculo: [verificacion.csv](verificacion.csv).

## 0. Cómo registrar una verificación

Un resumen de ChatGPT (o de cualquier otro asistente) es, igual que un extracto de buscador, una lectura indirecta. Para que una fuente cuente como **verificada**, el registro debe incluir:

1. **Cita literal** copiada de la página que respalde la afirmación (o la contradiga).
2. **Fecha visible** de publicación o actualización de la página, si existe.
3. **Fecha de consulta** y **quién** abrió la página.
4. **Resultado:** `Confirma` · `Confirma parcialmente` (indicar qué no) · `Contradice` (indicar qué dice) · `No disponible` (error, retirada o muro de pago).

ChatGPT puede ayudar a localizar la página, traducirla o encontrar el párrafo. La cita debe copiarla una persona desde la página abierta. Si una URL ya no existe, se usa la fuente alternativa y se anota.

Plantilla de petición, sin datos personales:

> Abre esta URL: [URL]. Busca el párrafo que confirme o contradiga esta afirmación: «[afirmación]». Devuélveme la cita literal en el idioma original, la fecha de publicación o actualización visible y si la página confirma, confirma parcialmente o contradice la afirmación. Si no puedes abrir la página, dilo y no la resumas desde memoria.

## 1. Fuentes ya verificadas (no requieren acción)

Leídas directamente desde este entorno el 27/11/2026:

| Fuente | Actualización visible | Artículos |
|---|---|---|
| [Android: Game Mode API](https://developer.android.com/games/gamemode/gamemode-api) | 08/10/2026 | 33 |
| [Android: Game Dashboard](https://developer.android.com/games/gamedashboard/aboutdashboard) | 26/02/2026 | 33, 34 |
| [Android: Thermal API](https://developer.android.com/games/optimize/adpf/thermal) | 26/02/2026 | 36, 37, 38, 40 |
| [Android: ADPF](https://developer.android.com/games/optimize/adpf) | 26/02/2026 | 36, 37 |
| [Android: modo de rendimiento fijo](https://developer.android.com/games/optimize/adpf/fixed-performance-mode) | 27/05/2026 | 31 |
| [Android: gestión de memoria](https://developer.android.com/topic/performance/memory-management) | 21/09/2026 | 35, 40 |
| [Android: paneles de distribución](https://developer.android.com/about/dashboards) | 06/10/2026 | 39, 40 |
| [Android: Vulkan para juegos](https://developer.android.com/games/develop/vulkan/overview) | 08/10/2026 | 39, 40 |
| **Nueva:** [Android: formatos de compresión de texturas](https://developer.android.com/guide/playcore/asset-delivery/texture-compression) | 13/11/2026 | Alternativa a F28 (39) |
| **Nueva:** [Apple Developer: Metal](https://developer.apple.com/metal/) | Sin fecha visible | Respaldo de la mención a Metal (39) |

Las dos últimas se encontraron al buscar alternativas y todavía no están citadas en los artículos.

## 2. Las 32 fuentes pendientes

Las afirmaciones resumen el texto del borrador. Si la fuente no lo confirma literalmente, el texto del artículo debe corregirse, no la fuente forzarse.

| ID | Art. | URL exacta | Afirmación que hay que verificar | Fuente alternativa |
|---|---|---|---|---|
| F01 | 31 | https://www.antutu.com/en/doc/129591.htm | La V10 de AnTuTu (nota de mayo de 2023) cambió la prueba de CPU y, en general, un dispositivo puntúa más en V10 que en V9. | Versión china de la misma nota en antutu.com |
| F02 | 31 | https://notebookcheck.net/AnTuTu-V12-public-beta-arrives-with-major-changes-to-how-phones-are-benchmarked.1389282.0.html | La V12 cambia las pruebas de CPU, GPU, memoria y UX, y sus resultados no son comparables con versiones anteriores. | Nota oficial de la V12 en antutu.com |
| F03 | 31 | https://gigazine.net/gsc_news/en/20251109-antutu-benchmark-for-android | La puntuación total de AnTuTu es la suma de CPU, GPU, MEM y UX; MEM mide latencia de RAM y velocidad del almacenamiento. | Descripción de pruebas en antutu.com o en la ficha de la app: https://apps.apple.com/app/id803837129 |
| F04 | 31, 36 | https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen | 3DMark calcula la estabilidad como (FPS medio del peor ciclo / FPS medio del mejor ciclo) × 100; aprueba con ≥ 97 % y todos los ciclos completados. | https://benchmarks.ul.com/news/using-3dmark-to-measure-sustained-performance |
| F05 | 31 | https://www.tomsguide.com/news/oneplus-9-just-got-delisted-from-geekbench-and-oneplus-responds | En 2021 Geekbench retiró el OnePlus 9 y el 9 Pro de su tabla porque el sistema limitaba apps populares pero no las apps de benchmark. | https://www.notebookcheck.net/OnePlus-caught-throttling-performance-of-apps-like-Chrome-Twitter-WhatsApp-Snapchat-on-the-OnePlus-9-Pro-Geekbench-delists-the-OnePlus-9-series-for-benchmark-manipulation.549373.0.html · comunicado de Primate Labs (Geekbench) |
| F06 | 31, 37 | https://www.androidauthority.com/geekbench-delists-samsung-flagships-3129230/ | En 2022 Geekbench retiró los Galaxy S10, S20, S21 y S22 porque el Game Optimizing Service limitaba apps y juegos (unas 10 000 apps según informes) pero exceptuaba los benchmarks. El artículo 37 dice «miles de apps, incluidos juegos». | https://www.phonearena.com/news/geekbench-removes-galaxy-s-flagships-because-of-gos-throttling_id138848 |
| F07 | 32 | https://apptopia.com/google-play/app/com.rockstargames.gtasa/about | La ficha de Rockstar Games en Google Play es un juego de pago y sin anuncios. (Las compras integradas tienen datos contradictorios: no se afirman.) | Ficha oficial: https://play.google.com/store/apps/details?id=com.rockstargames.gtasa (revisar en más de un país) |
| F08 | 32 | https://www.androidauthority.com/grand-theft-auto-san-andreas-android-review-326766/ | La adaptación móvil de Rockstar se lanzó en Android a finales de 2013. | Anuncio en Rockstar Newswire (diciembre de 2013) |
| F09 | 32 | https://gamespot.com/articles/gta-3-vice-city-and-san-andreas-now-available-free-through-netflix/1100-6519956/ | En diciembre de 2023 GTA III, Vice City y San Andreas – Definitive Edition llegaron sin coste adicional a los suscriptores de Netflix en iOS y Android. | Anuncio de Netflix (about.netflix.com) o de Rockstar Newswire |
| F10 | 32 | https://gameranx.com/updates/id/558698/article/grand-theft-auto-san-andreas-set-to-leave-netflix-on-mobile/ | San Andreas iba a salir del catálogo de Netflix el 12 de diciembre de 2025. | https://respawn.outlookindia.com/gaming/gaming-news/gta-san-andreas-leaves-netflix-as-red-dead-redemption-arrives · comprobar en la app de Netflix |
| F11 | 32 | https://apps.apple.com/us/app/id6450280702 | La edición distribuida por Netflix tiene una ficha propia y su desarrollador es Netflix, Inc. (el artículo usa ese nombre para identificarla). | Ficha equivalente en Google Play |
| F12 | 32 | https://propakistani.pk/2026/09/11/someone-just-put-2-gta-games-on-play-store-for-free/ | En septiembre de 2026 apareció en Play Store un juego gratuito con anuncios, de otro desarrollador, que imitaba el estilo de GTA. | Ficha de Google Play del juego citado, si sigue publicada |
| F13 | 33 | https://www.samsung.com/au/support/apps-services/use-game-booster/ | Game Booster equilibra batería, rendimiento y temperatura según los hábitos de juego y bloquea distracciones. | https://www.samsung.com/hk_en/support/apps-services/know-more-about-the-game-booster-app/ |
| F14 | 33, 34 | https://www.mi.com/global/support/article/KA-03436/ | Game Turbo es la función de juegos de Xiaomi y se accede a ella desde la app Seguridad. | Misma página en https://www.mi.com/uk/support/article/KA-03436/ |
| F15 | 34 | https://www.mi.com/global/support/faq/details/KA-515623/ | Ruta oficial: Seguridad → Game Turbo → icono de ajustes. | https://www.mi.com/global/support/faq/details/KA-515627/ (Xiaomi 14T) |
| F16 | 34 | https://www.mi.com/global/support/faq/details/KA-492711/ | Xiaomi documenta Game Turbo también en dispositivos REDMI (REDMI Pad SE 8.7). | Otra FAQ de mi.com para un teléfono REDMI |
| F17 | 34 | https://ximitime.com/hyperos-2-game-turbo-april-update-is-out-40197/ | En HyperOS, Game Turbo forma parte de la app Seguridad y se actualiza con ella. (Medio no oficial.) | Notas oficiales de actualización de Xiaomi o anuncio en Xiaomi Community |
| F18 | 35 | https://www.samsung.com/ca/support/mobile-devices/use-ram-plus-on-your-samsung-galaxy/ | Samsung indica que RAM Plus no añade RAM física, que la memoria virtual es más lenta que la física y que reserva almacenamiento. **Es la base del análisis del artículo 35.** | Otras páginas regionales de soporte de Samsung con el mismo título |
| F19 | 35 | https://www.mi.com/global/support/faq/details/KA-541717/ | Xiaomi describe la extensión de memoria como RAM adicional creada con almacenamiento para manejar más tareas «sin ralentizarse». **Es la base del análisis del artículo 35.** | https://www.mi.com/uk/support/faq/details/KA-541723/ (Xiaomi 15 Ultra) |
| F20 | 35 | https://sammobile.com/news/one-ui-4-1-choose-how-much-virtual-ram-you-want | One UI 4.1 permitió elegir el tamaño de RAM Plus. **No se usa en el cuerpo del artículo:** puede eliminarse de las fuentes. | — |
| F21 | 36 (y 40) | https://ffsupport.garena.com/hc/en-us/articles/4412913797146-How-to-Avoid-Device-Overheating | Garena recomienda bajar los gráficos (con gráficos bajos se juega más tiempo sin calentamiento), no jugar mientras se carga, evitar la luz solar directa y no sobrecargar el dispositivo. **El artículo 40 cita «Garena recomienda evitarlo» sin incluir esta fuente.** | https://ffsupportna.garena.com/hc/en-us/articles/4413057858074-How-to-Avoid-Device-Overheating · https://ffsupportbd.garena.com/hc/en-us/articles/4413057724314-How-to-Avoid-Device-Overheating |
| F22 | 36, 37 | https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html | En la prueba de estrés, el OnePlus 10 Pro (Snapdragon 8 Gen 1) perdió cerca del 37 % de su rendimiento. | Reseña completa del OnePlus 10 Pro en Notebookcheck |
| F23 | 37 | https://www.androidauthority.com/samsung-galaxy-s26-ultra-benchmarks-3652232/ | Tres modelos con Snapdragon 8 Elite Gen 5 se estabilizan en un nivel parecido tras unos cuatro minutos de carga gráfica intensa, aunque se calientan a ritmos distintos. | https://www.phonearena.com/news/the-snapdragon-8-elite-gen-5-is-fast-but-not-all-phones-can-handle-the-heat_id175544 |
| F24 | 37 | https://androidauthority.com/snapdragon-vs-exynos-vs-apple-sustained-performance-3422830 | Conclusión del medio: la refrigeración influye mucho en el rendimiento del procesador. **Solo aparece en la lista de fuentes:** puede eliminarse si no se verifica. | — |
| F25 | 38 | https://www.apple.com/ca/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/ | El iPhone 17 Pro sella agua desionizada en una cámara de vapor soldada por láser al chasis de aluminio; Apple afirma hasta un 40 % más de rendimiento sostenido que la generación anterior. | Otras ediciones regionales del mismo comunicado en apple.com/newsroom |
| F26 | 38 | https://spectrum.ieee.org/iphone-17-pro-vapor-chamber | El agua se evapora junto a la fuente de calor y se condensa al cederlo al aluminio; al reducir el grosor, la ventaja frente al cobre sólido disminuye; Samsung y Google ya usaban cámaras de vapor en algunos modelos. | Desmontaje de iFixit del iPhone 17 Pro |
| F27 | 38 | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9310139 | La patente describe la cámara de vapor como un sistema pasivo y cerrado de dos fases que usa el calor latente de vaporización. | https://patents.google.com/patent/US9310139 |
| F28 | 39 | https://android-developers.googleblog.com/2015/01/efficient-game-textures-with-hardware.html | La diversidad de GPU obligaba a distribuir varios formatos de textura (ETC2, ASTC) según el dispositivo. | **Ya verificada:** https://developer.android.com/guide/playcore/asset-delivery/texture-compression (cada GPU admite un conjunto de formatos; ASTC en más del 80 % y ETC2 en más del 95 % de los dispositivos de Google Play) |
| F29 | 39 | https://gamesbeat.com/ios-game-developers-tell-why-they-favor-iphone-exclusives-over-fragmented-android | Desarrolladores describen el soporte de muchos dispositivos Android como mucho más complejo que en iOS. Testimonio antiguo. | https://www.pocketgamer.com/features/pocket-gamer-investigates-why-does-android-play-second-fiddle-to-ios/ (también antiguo). Preferible una fuente reciente o eliminar |
| F30 | 39 | https://community.arm.com/arm-community-blogs/b/architectures-and-processors-blog/posts/what-s-holding-back-android-gaming-performance | Elegir formatos de textura antiguos por compatibilidad perjudica el rendimiento en hardware nuevo. | La página verificada de Android lista ETC1 y PVRTC como formatos antiguos no recomendados y describe ASTC como el formato que los sustituye. **No afirma un perjuicio de rendimiento:** si se usa, reformular |
| F31 | 40 | https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX | Garena publica requisitos separados para Free Fire y Free Fire MAX, con mínimos y recomendados. La misma fuente figura en el artículo publicado 04 (revisión documental del 16/11/2026). | — |
| F32 | 40 | https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/ | Supercell retiró el soporte de Clash Royale para versiones antiguas de iOS y Android (iOS 12 y 13, Android 5 y 6). | Requisitos actuales en https://support.clashroyale.com/hc/en-us/articles/49484889019291-My-Game-Crashes |

## 3. Afirmaciones sin fuente asignada

Revisando los borradores aparecen frases que no están respaldadas por ninguna fuente de su lista. Hay que **añadir fuente o retirarlas o suavizarlas** antes de publicar.

| ID | Art. | Frase del borrador | Propuesta |
|---|---|---|---|
| S01 | 32 | «La tienda solo te deja comprarlo si tu dispositivo es compatible.» | **Resuelto 28/11:** reformulado como consejo de revisar la ficha |
| S02 | 34 | «En algunas versiones también hay acceso desde Ajustes → Funciones especiales.» Procede de una guía de terceros no citada | **Resuelto 28/11:** eliminado |
| S03 | 34 | «Si el juego no aparece en la lista, añádelo con el botón para agregar apps.» | **Resuelto 28/11:** sustituido por la ruta confirmada en F15 |
| S04 | 36 | «Revisa el brillo. La pantalla también consume energía y genera calor.» | Buscar fuente (p. ej., documentación de Android sobre consumo de pantalla) o eliminar |
| S05 | 37 | «Hay variantes con nombres casi iguales y potencias diferentes.» | Sustituir por un ejemplo concreto con fichas oficiales o eliminar |
| S06 | 38 | «Una estructura porosa devuelve el líquido hacia el chip.» | Confirmar en F26, F27 o en el desmontaje de iFixit |
| S07 | 39 | «…una sola API gráfica, Metal.» | Reformular con la página verificada de Apple: Metal da acceso a las GPU diseñadas por Apple en iPhone, iPad y Mac. «Una sola» no está respaldado |
| S08 | 39 | Lista de marcas de GPU en Android (Adreno, Mali, Immortalis, Xclipse, PowerVR) | Citar páginas de producto de cada fabricante o reducir a «varios fabricantes de GPU» |
| S09 | 40 | «Una pantalla de 120 Hz solo aporta si el juego ofrece más de 60 FPS y el teléfono puede mantenerlos.» | La documentación verificada de Game Mode menciona la tasa de refresco y el ritmo de fotogramas; reformular apoyándose en ella o suavizar |

## 4. Qué artículos pueden completarse solo con fuentes ya verificadas

Criterio: el artículo conserva su tesis, sus datos principales y su utilidad práctica usando solo las fuentes del apartado 1. Retirar el material no verificado no debe dejar un texto genérico.

| Art. | ¿Se puede completar? | Qué se conserva | Qué habría que retirar o cambiar | Pérdida de calidad |
|---|---|---|---|---|
| **33** Modo juego | **Sí · actualizado 28/11** con F13 y F14 (consulta asistida). Listo para revisión editorial | Todo el mecanismo de Game Mode, la tabla de estados, el diagrama, las intervenciones de fabricantes, el ejemplo del 25 % y Game Dashboard | La descripción concreta de Game Booster y Game Turbo (F13, F14): decir «cada fabricante ofrece su propia herramienta», como indica la documentación de Game Dashboard. Quitar el enlace al 34 si no se publica | Baja |
| **39** iPhone y Android | **Sí, reescribiendo una sección** | Tabla oficial de Vulkan, papel de Vulkan, Unity y Unreal; diversidad de formatos de textura con datos de Android (ASTC > 80 %, ETC2 > 95 %); Metal según Apple | Testimonios de desarrolladores (F29), afirmación de Arm (F30), «perfiles gráficos conservadores», «una sola API» (S07) y lista de marcas (S08) | Media: pierde la voz de los desarrolladores, pero gana una fuente oficial reciente |
| **36** Pérdida de FPS | **Sí, con recorte** | Explicación térmica oficial, diagrama y recomendaciones respaldadas por la Thermal API (reducir FPS o calidad para volver a un nivel sostenible) | Recomendaciones de Garena (F21), el 37 % (F22), la estabilidad de 3DMark (F04) y el brillo (S04) | Media: pierde la recomendación de un desarrollador de juegos y el orden de magnitud |
| **40** Elegir teléfono | **Condicional** | Comprobaciones 2, 3, 4, 6 y 8 con fuentes de Android | Enlaces a borradores no publicados (31, 35, 37); ejemplo de Supercell (F32); la recomendación de Garena sobre la carga (F21); requisitos de Garena (F31) solo si se acepta la revisión del 16/11 del artículo 04 | Media-alta: pierde la conexión con el resto del paquete, que es parte de su valor |
| 35 RAM virtual | **No** | La parte de Android | Su tesis es la contradicción con Samsung y Xiaomi (F18, F19). Sin ellas queda una explicación de zRAM | Alta |
| 31 AnTuTu | **No** | Solo el modo de rendimiento fijo | Versiones de AnTuTu, casos de Geekbench y estabilidad de 3DMark | Alta |
| 32 GTA San Andreas | **No** | Nada | Todas sus fuentes están pendientes | Total |
| **34** Redmi sin Game Turbo | **Sí · reescrito 28/11** con F14–F17 y las páginas N01–N03 (consulta asistida). Listo para revisión editorial | Compatibilidad oficial (REDMI 12 y 12C no compatibles), ruta y funciones de Game Turbo | Eliminadas S02 y S03 | — |
| 37 Mismo procesador | **No** | La tabla de factores con la Thermal API | Todas las mediciones independientes, que son su evidencia | Alta |
| 38 Cámara de vapor | **No** | La relación con la Thermal API | Apple, IEEE Spectrum y la patente | Alta |

**Resumen (28/11):** 33 y 34 están listos para revisión editorial, con las fuentes de Samsung y Xiaomi pendientes de revisión humana. 39 puede cerrarse reescribiendo una sección; 36 y 40, con recortes. 31 y 32 avanzaron en la ronda 1, pero siguen dependiendo de fuentes pendientes.

**Requisito técnico al publicar por partes:** el validador exige que los artículos relacionados (`related`) estén publicados, y `test:seo` rechaza enlaces internos a páginas inexistentes. Al publicar solo una parte, hay que ajustar `related` y los enlaces del cuerpo.

## 5. Prioridad de verificación

Orden propuesto, por número de afirmaciones desbloqueadas y artículos afectados:

1. **F18, F19** → desbloquean el 35.
2. **F21, F22, F04** → completan el 36 y aportan al 31, 37 y 40.
3. **F06, F05, F01, F02, F03** → desbloquean el 31 y parte del 37.
4. **F14, F15, F16** → desbloquean el 34 y completan el 33.
5. **F25, F26, F27** → desbloquean el 38.
6. **F23** → completa el 37.
7. **F07–F12** → desbloquean el 32. Atención: F10 y F11 dependen del país y de la fecha.
8. **F31, F32** → completan el 40.
9. **F20, F24, F29, F30** → baja prioridad: pueden eliminarse sin dañar los artículos.

## 6. Ronda 1 · consulta asistida mediante ChatGPT (27/11/2026)

Resultados aportados por dirección e incorporados el 28/11/2026. **Método: consulta asistida mediante ChatGPT, sin revisión humana de las páginas.** Solo los casos del REDMI 12 y 12C traen cita literal. El resto cuenta como lectura asistida hasta que una persona confirme cada pasaje con el protocolo del apartado 0.

| ID | Resultado | Detalle recibido | Cambio aplicado |
|---|---|---|---|
| F01 | Confirmado | La V10 evalúa CPU, GPU, MEM y UX; escenas con Unreal Engine y Vulkan; la latencia de memoria puede afectar a la fluidez; V9 y V10 no son directamente comparables | 31: tabla de bloques según AnTuTu y advertencia de comparabilidad atribuida al desarrollador |
| F02 | Pendiente | Página inaccesible | — |
| F03 | Parcial | Desglose exacto sin revisar | 31: el desglose se apoya ahora en F01 |
| F04 | **Parcial con corrección** | Fórmula confirmada; el umbral del 97 % corresponde a la prueba de estrés de **PC** | 31 y 36: eliminado el 97 % como referencia para teléfonos |
| F05 | Pendiente | Página accesible; pasaje sin revisar | — |
| F06 | Pendiente | Página inaccesible | — |
| F07 | **Sustituida** | La ficha oficial de Google Play (N05) confirma juego de pago de Rockstar Games y **compras dentro de la aplicación**; la ausencia de anuncios no se confirma | 32: eliminado «sin anuncios»; añadidas las compras integradas; N05 como fuente principal en lugar de Apptopia |
| F08 | Confirmado | Publicación del 21/12/2013 con precio de lanzamiento de 6,99 USD | 32: fecha y precio de lanzamiento atribuidos a Android Authority |
| F09 | Pendiente | Página inaccesible | — |
| F10 | Parcial | El medio informa de la salida prevista de Netflix el 12/12/2025 | Sin cambios: el artículo ya lo atribuye al medio |
| F11 | Pendiente | Sin consultar | — |
| F12 | Pendiente | Sin consultar | — |
| F13 | Confirmado | Game Booster busca equilibrar rendimiento, temperatura y batería según los patrones de juego; página actualizada el 20/10/2026 | 33: nueva tabla «Qué añaden Samsung y Xiaomi» |
| F14 | Confirmado | Game Turbo: WLAN, respuesta táctil, sonido, gestión de recursos y configuración térmica | 33 y 34 |
| F15 | Confirmado | Ruta de activación documentada | 34 |
| F16 | Confirmado | Compatibilidad documentada (REDMI Pad SE 8.7) | 34 |
| F17 | Confirmado (medio no oficial) | Publicación del 22/04/2025 | 34: atribuido como medio no oficial |
| F18–F32 | Pendientes | No incluidas en esta ronda | — |

### Fuentes nuevas aportadas

| ID | Fuente | Afirmación | Uso |
|---|---|---|---|
| N01 | https://www.mi.com/global/support/article/KA-710923/ | «The REDMI 12 doesn't support Game Turbo.» | 34 |
| N02 | https://www.mi.com/global/support/article/KA-710924/ | «The REDMI 12C doesn't support Game Turbo.» | 34 |
| N03 | https://www.mi.com/global/support/faq/details/KA-529999/ | El Redmi Note 14 es compatible con Game Turbo | 34 |
| N04 | https://www.mi.com/es/support/faq/details/KA-1143796/ | Funciones de la barra lateral de Game Turbo | No usada: no se aportó el contenido concreto |
| N05 | https://play.google.com/store/apps/details?id=com.rockstargames.gtasa | Ficha oficial de San Andreas (sustituye a F07) | 32 |

Los enlaces se registran sin el parámetro `utm_source` que añade ChatGPT.

### Datos recibidos que no se incorporan

| Dato | Motivo |
|---|---|
| Precio actual de 6,99 USD en Google Play | La consulta no identifica el país de la tienda. La política exige mercado y fecha. Para usarlo, hay que repetir la consulta indicando el país |
| Redmi 15 y Redmi Note 14 Pro «compatibles» | Llegaron sin URL de la página oficial |
| «El Redmi Note 14 no admite el modo de alta frecuencia de fotogramas» | Sin cita ni URL que indique de qué página procede. Pendiente de confirmar en N03 |
| Imágenes de Game Turbo, Game Booster y una cuenta de X | Sin derechos de uso documentados. La política de imágenes las excluye |
| Diagrama conceptual del modo gamer | El artículo 33 ya tiene un diagrama basado en la documentación de Android |

### Estado de los artículos tras la ronda 1

| Art. | Estado | Lo que falta para la revisión editorial |
|---|---|---|
| 33 | **Listo para revisión editorial** | Revisión humana de F13 y F14. Para publicarlo solo, quitar o publicar a la vez sus enlaces a 34 y 36 |
| 34 | **Listo para revisión editorial** | Revisión humana de N01–N03 y F14–F16 (citas literales de N03, F14, F15 y F16). Enlaza a 33 y 36 |
| 31 | Avanza | F02, F05 y F06 (versiones posteriores y casos de Geekbench) |
| 32 | Avanza | F09, F11, F12; confirmar F10; repetir la consulta del precio con el país si se quiere citar |
| 36 | Corregido (97 %) | F21 y F22 |

Los cuatro siguen con `status: draft`: no se ha publicado nada.

## 7. Estado de publicación y ronda 2 (28/11/2026)

### Cambios de esta entrega

- **33, 34 y 39 pasan a `status: published` en la rama.** Esto los incluye en el build de la rama; **no los publica en producción**. Fusionar la rama equivale a publicarlos.
- **39 reescrito solo con fuentes leídas directamente** (Google: Vulkan, distribución y compresión de texturas; Apple: Metal). Se retiraron F28, F29 y F30 y se resolvieron S07 y S08.
- **33 y 34 ya no enlazan al 36** mientras siga en borrador: el dato se cita directamente de la Thermal API (verificada).
- **Correcciones:**
  - 31: retirada la mención a la V12, y con ella F02 y F03.
  - 35: retirada F20.
  - 36: retirado el consejo del brillo (S04).
  - 37: retirada F24 y reformulado S05.
  - 40: S09 apoyado en Game Mode (verificada) y añadida F21 a sus fuentes.
  - 32: precio observado de 6,99 USD indicado sin país de la tienda, como pidió dirección.
- **Títulos y descripciones SEO** acortados en 32, 34, 37, 39 y 40.
- **Portada:** nuevo bloque «Rendimiento y tecnología» que solo aparece si esas secciones tienen artículos publicados.

### Antes de fusionar (requisito para 33 y 34)

Los artículos 33 y 34 se apoyan en consultas asistidas. Antes de autorizar la fusión, una persona debe confirmar con cita literal:

| ID | URL | Afirmación | Artículo |
|---|---|---|---|
| F13 | https://www.samsung.com/au/support/apps-services/use-game-booster/ | Game Booster equilibra rendimiento, temperatura y batería según los patrones de juego (actualizada el 20/10/2026) | 33 |
| F14 | https://www.mi.com/global/support/article/KA-03436/ | Game Turbo: WLAN, respuesta táctil, sonido, gestión de recursos, configuración térmica | 33, 34 |
| F15 | https://www.mi.com/global/support/faq/details/KA-515623/ | Ruta Seguridad → Game Turbo → icono de ajustes | 34 |
| F16 | https://www.mi.com/global/support/faq/details/KA-492711/ | Game Turbo documentado en la REDMI Pad SE 8.7 | 34 |
| N01 | https://www.mi.com/global/support/article/KA-710923/ | «The REDMI 12 doesn't support Game Turbo.» (comprobar que la cita es exacta) | 34 |
| N02 | https://www.mi.com/global/support/article/KA-710924/ | «The REDMI 12C doesn't support Game Turbo.» (comprobar que la cita es exacta) | 34 |
| N03 | https://www.mi.com/global/support/faq/details/KA-529999/ | El Redmi Note 14 es compatible con Game Turbo | 34 |
| — | https://www.mi.com/global/support/faq/details/KA-515623/ | El Xiaomi 14T Pro es compatible (se deduce de la propia FAQ de activación) | 34 |

### Ronda 2: fuentes que investigar desde ChatGPT

Por orden de impacto. Usar el protocolo del apartado 0: cita literal, fecha visible y resultado.

| Prioridad | Artículo que desbloquea | ID | URL | Afirmación |
|---|---|---|---|---|
| 1 | **35** RAM virtual | F18 | https://www.samsung.com/ca/support/mobile-devices/use-ram-plus-on-your-samsung-galaxy/ | RAM Plus no añade RAM física, la memoria virtual es más lenta y reserva almacenamiento |
| 1 | **35** | F19 | https://www.mi.com/global/support/faq/details/KA-541717/ | Xiaomi describe la extensión de memoria como RAM adicional creada con almacenamiento, «sin ralentizarse» |
| 2 | **36** Pérdida de FPS | F21 | https://ffsupport.garena.com/hc/en-us/articles/4412913797146-How-to-Avoid-Device-Overheating | Bajar gráficos, no jugar cargando, evitar el sol directo, no sobrecargar el dispositivo (también en 40) |
| 2 | **36**, 37 | F22 | https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html | El OnePlus 10 Pro pierde cerca del 37 % en la prueba de estrés |
| 3 | **31** AnTuTu | F05 | https://www.tomsguide.com/news/oneplus-9-just-got-delisted-from-geekbench-and-oneplus-responds | Geekbench retiró los OnePlus 9 en 2021 (limitación de apps, no de benchmarks) |
| 3 | **31**, 37 | F06 | https://www.androidauthority.com/geekbench-delists-samsung-flagships-3129230/ | Geekbench retiró Galaxy S10–S22 en 2022 por GOS; unas 10 000 apps, incluidos juegos |
| 4 | **37** Mismo procesador | F23 | https://www.androidauthority.com/samsung-galaxy-s26-ultra-benchmarks-3652232/ | Tres modelos con el Snapdragon 8 Elite Gen 5 se igualan tras unos 4 minutos; calentamiento distinto |
| 5 | **38** Cámara de vapor | F25 | https://www.apple.com/ca/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/ | Agua desionizada, soldadura láser al chasis; «hasta un 40 %» más de rendimiento sostenido |
| 5 | **38** | F26 | https://spectrum.ieee.org/iphone-17-pro-vapor-chamber | Evaporación y condensación; el grosor limita la ventaja; Samsung y Google ya usaban cámaras de vapor. Confirmar también la estructura porosa (S06) |
| 5 | **38** | F27 | https://patents.google.com/patent/US9310139 | Sistema pasivo cerrado de dos fases con calor latente (alternativa a la URL de USPTO) |
| 6 | **32** GTA San Andreas | F09 | https://gamespot.com/articles/gta-3-vice-city-and-san-andreas-now-available-free-through-netflix/1100-6519956/ | La trilogía Definitive llegó a Netflix en diciembre de 2023 sin coste adicional |
| 6 | **32** | F11 | https://apps.apple.com/us/app/id6450280702 | Ficha propia de la edición de Netflix; desarrollador Netflix, Inc. |
| 6 | **32** | F12 | https://propakistani.pk/2026/09/11/someone-just-put-2-gta-games-on-play-store-for-free/ | Copia gratuita con anuncios en Play Store (septiembre de 2026) |
| 6 | **32** | F10 | https://gameranx.com/updates/id/558698/article/grand-theft-auto-san-andreas-set-to-leave-netflix-on-mobile/ | Cita literal de la salida prevista el 12/12/2025 |
| 6 | **32** (opcional) | N05 | https://play.google.com/store/apps/details?id=com.rockstargames.gtasa | Repetir la consulta indicando el país de la tienda, para registrar el precio con mercado |
| 7 | **40** Elegir teléfono | F31 | https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX | Requisitos separados para Free Fire y MAX, con mínimos y recomendados |
| 7 | **40** | F32 | https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/ | Retirada del soporte para iOS 12 y 13 y Android 5 y 6 |

El artículo 40 enlaza además a 31, 35 y 37: solo puede publicarse cuando estos lo estén, o retirando esos enlaces.

### Resumen por artículo

| Art. | Estado en la rama | Qué falta |
|---|---|---|
| 33 Modo juego | **Publicado en la rama** | Revisión humana de F13 y F14 antes de fusionar |
| 34 Redmi y Game Turbo | **Publicado en la rama** | Revisión humana de F14–F16 y N01–N03 antes de fusionar |
| 39 iPhone y Android | **Publicado en la rama** | Nada: todas sus fuentes se leyeron directamente |
| 35 RAM virtual | Borrador | F18, F19 |
| 36 Pérdida de FPS | Borrador | F21, F22 |
| 31 AnTuTu | Borrador | F05, F06 |
| 37 Mismo procesador | Borrador | F06, F22, F23 |
| 38 Cámara de vapor | Borrador | F25, F26, F27 (y S06) |
| 32 GTA San Andreas | Borrador | F09, F10, F11, F12 (y país del precio, opcional) |
| 40 Elegir teléfono | Borrador | F21, F31, F32, y la publicación de 31, 35 y 37 |

## 8. Ronda 2 · consulta asistida mediante ChatGPT (27/11/2026), incorporada el 28/11/2026

**Método:** consulta asistida mediante ChatGPT, sin revisión humana de las páginas. No se aportaron citas literales.

| ID | Resultado | Detalle recibido | Cambio aplicado |
|---|---|---|---|
| F18 | Confirmado | Página actualizada el 03/11/2026: la memoria virtual usa almacenamiento interno, es más lenta que la RAM física y no garantiza mayor rendimiento | 35: lista de fabricantes y nueva tabla «8 GB + 8 GB no son 16 GB» |
| F19 | **Parcial** | Xiaomi describe la extensión de memoria mediante el almacenamiento disponible. **No se confirma la cita «sin ralentizarse»** | 35: retirada la cita y la comparación «Samsung más prudente que Xiaomi», que dependía de ella |
| F21 | **Sustituida por F21b** | https://ffsupportsg.garena.com/hc/en-us/articles/4411731947674-How-to-Avoid-Device-Overheating (23/11/2021): reducir gráficos, no jugar mientras se carga, evitar el sol directo. **«No sobrecargar el dispositivo» no se confirma** | 36: retirada esa recomendación; F21b en 36 y 40 |
| F22 | Confirmado | Publicación del 02/02/2022 con pruebas de TechTablets: Xiaomi 12 Pro, cierre de la prueba hacia los 17 minutos; OnePlus 10 Pro, reducción de cerca del 37 %. Ambos con Snapdragon 8 Gen 1 | 36: atribución a TechTablets vía Notebookcheck y aviso de que no son FPS de juegos. 37: tabla con ambos teléfonos |

**Otros cambios de esta entrega:**
- **35, 36 y 37** pasan a `status: published` en la rama.
- **37:** se completó con F22 y con la documentación verificada de Game Mode (los fabricantes pueden aplicar intervenciones sin consultar al estudio). Se retiraron de él los ejemplos de F06 (GOS de Samsung) y F23 (Snapdragon 8 Elite Gen 5), que siguen sin verificar. Pueden volver como ampliación si se verifican.
- **32:** retirado el precio actual de 6,99 USD hasta identificar el mercado. Se mantiene el precio de lanzamiento de 2013, atribuido y fechado.
- **33 y 34** vuelven a enlazar al 36, que ya está preparado.
- **Tablas de los artículos:** antes no tenían estilo y la del 37 desbordaba a 390 px. Ahora tienen estilo y en móvil se muestran como fichas con la etiqueta de cada columna.
- **`/creditos`** desbordaba a 320 px por una URL sin cortes; el problema era anterior a esta entrega y está corregido.

### Estado de los diez artículos (28/11/2026)

| Art. | Estado en la rama | Pendiente antes de fusionar | Pendiente para completarlo |
|---|---|---|---|
| 33 Modo juego | **Preparado** | Revisión humana de F13 y F14 | — |
| 34 Redmi y Game Turbo | **Preparado** | Revisión humana de F14–F16 y N01–N03 | — |
| 35 RAM virtual | **Preparado** | Revisión humana de F18 y F19 | — |
| 36 Pérdida de FPS | **Preparado** | Revisión humana de F21b y F22 | — |
| 37 Mismo procesador | **Preparado** | Revisión humana de F22 | Opcional: F06 y F23 para recuperar los ejemplos retirados |
| 39 iPhone y Android | **Preparado** | — (solo fuentes leídas directamente) | — |
| 31 AnTuTu | Borrador | — | **F05, F06** |
| 38 Cámara de vapor | Borrador | — | **F25, F26, F27** |
| 32 GTA San Andreas | Borrador | — | **F09, F11, F12**, cita literal de F10 |
| 40 Elegir teléfono | Borrador | — | **F31, F32** y la publicación del 31 |

### Fuentes estrictamente necesarias para terminar los cuatro restantes

| Artículo | ID | URL | Qué confirmar |
|---|---|---|---|
| 31 | F05 | https://www.tomsguide.com/news/oneplus-9-just-got-delisted-from-geekbench-and-oneplus-responds | En 2021 Geekbench retiró el OnePlus 9 y el 9 Pro porque el sistema limitaba apps populares pero no los benchmarks |
| 31 | F06 | https://www.androidauthority.com/geekbench-delists-samsung-flagships-3129230/ | En 2022 Geekbench retiró los Galaxy S10, S20, S21 y S22 porque GOS limitaba apps y juegos pero no los benchmarks |
| 38 | F25 | https://www.apple.com/ca/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/ | Agua desionizada sellada en una cámara de vapor soldada por láser al chasis; «hasta un 40 %» más de rendimiento sostenido |
| 38 | F26 | https://spectrum.ieee.org/iphone-17-pro-vapor-chamber | Evaporación y condensación; el grosor reduce la ventaja frente al cobre; Samsung y Google ya usaban cámaras de vapor; estructura que devuelve el líquido (S06) |
| 38 | F27 | https://patents.google.com/patent/US9310139 | Cámara de vapor como sistema pasivo cerrado de dos fases que usa el calor latente |
| 32 | F09 | https://gamespot.com/articles/gta-3-vice-city-and-san-andreas-now-available-free-through-netflix/1100-6519956/ | La trilogía Definitive llegó a Netflix en diciembre de 2023 sin coste adicional, en iOS y Android |
| 32 | F10 | https://gameranx.com/updates/id/558698/article/grand-theft-auto-san-andreas-set-to-leave-netflix-on-mobile/ | Cita literal de la salida prevista el 12/12/2025 |
| 32 | F11 | https://apps.apple.com/us/app/id6450280702 | Ficha propia de la edición de Netflix; desarrollador Netflix, Inc. |
| 32 | F12 | https://propakistani.pk/2026/09/11/someone-just-put-2-gta-games-on-play-store-for-free/ | Copia gratuita con anuncios, de otro desarrollador, en Play Store (septiembre de 2026) |
| 40 | F31 | https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX | Requisitos separados para Free Fire y MAX, con mínimos y recomendados |
| 40 | F32 | https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/ | Retirada del soporte para iOS 12 y 13 y Android 5 y 6 |

Opcional para el 32: repetir la consulta de la ficha de Google Play indicando el país de la tienda, si se quiere citar el precio actual.

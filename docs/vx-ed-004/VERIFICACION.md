# VX-ED-004 · Fuentes pendientes de verificación

27 de noviembre de 2026. Listado para verificar las fuentes de los diez borradores (31–40) en colaboración con el equipo. Versión para hoja de cálculo: [verificacion.csv](verificacion.csv).

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
| S01 | 32 | «La tienda solo te deja comprarlo si tu dispositivo es compatible.» | Buscar la ayuda de Google Play sobre compatibilidad o eliminar |
| S02 | 34 | «En algunas versiones también hay acceso desde Ajustes → Funciones especiales.» Procede de una guía de terceros no citada | Citar una FAQ de mi.com que lo indique o eliminar |
| S03 | 34 | «Si el juego no aparece en la lista, añádelo con el botón para agregar apps.» | Confirmar en F15 o en una FAQ de mi.com |
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
| **33** Modo juego | **Sí** | Todo el mecanismo de Game Mode, la tabla de estados, el diagrama, las intervenciones de fabricantes, el ejemplo del 25 % y Game Dashboard | La descripción concreta de Game Booster y Game Turbo (F13, F14): decir «cada fabricante ofrece su propia herramienta», como indica la documentación de Game Dashboard. Quitar el enlace al 34 si no se publica | Baja |
| **39** iPhone y Android | **Sí, reescribiendo una sección** | Tabla oficial de Vulkan, papel de Vulkan, Unity y Unreal; diversidad de formatos de textura con datos de Android (ASTC > 80 %, ETC2 > 95 %); Metal según Apple | Testimonios de desarrolladores (F29), afirmación de Arm (F30), «perfiles gráficos conservadores», «una sola API» (S07) y lista de marcas (S08) | Media: pierde la voz de los desarrolladores, pero gana una fuente oficial reciente |
| **36** Pérdida de FPS | **Sí, con recorte** | Explicación térmica oficial, diagrama y recomendaciones respaldadas por la Thermal API (reducir FPS o calidad para volver a un nivel sostenible) | Recomendaciones de Garena (F21), el 37 % (F22), la estabilidad de 3DMark (F04) y el brillo (S04) | Media: pierde la recomendación de un desarrollador de juegos y el orden de magnitud |
| **40** Elegir teléfono | **Condicional** | Comprobaciones 2, 3, 4, 6 y 8 con fuentes de Android | Enlaces a borradores no publicados (31, 35, 37); ejemplo de Supercell (F32); la recomendación de Garena sobre la carga (F21); requisitos de Garena (F31) solo si se acepta la revisión del 16/11 del artículo 04 | Media-alta: pierde la conexión con el resto del paquete, que es parte de su valor |
| 35 RAM virtual | **No** | La parte de Android | Su tesis es la contradicción con Samsung y Xiaomi (F18, F19). Sin ellas queda una explicación de zRAM | Alta |
| 31 AnTuTu | **No** | Solo el modo de rendimiento fijo | Versiones de AnTuTu, casos de Geekbench y estabilidad de 3DMark | Alta |
| 32 GTA San Andreas | **No** | Nada | Todas sus fuentes están pendientes | Total |
| 34 Redmi sin Game Turbo | **No** | Solo la referencia a Game Dashboard | Todas las rutas de Xiaomi | Total |
| 37 Mismo procesador | **No** | La tabla de factores con la Thermal API | Todas las mediciones independientes, que son su evidencia | Alta |
| 38 Cámara de vapor | **No** | La relación con la Thermal API | Apple, IEEE Spectrum y la patente | Alta |

**Resumen:** 33 y 39 pueden cerrarse ya con fuentes verificadas; 36 y 40, con recortes que reducen su valor. Los otros seis dependen de la verificación del apartado 2.

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

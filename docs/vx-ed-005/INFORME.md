# VX-ED-005 · Informe consolidado

Blue Lab Studios · 28 de noviembre de 2026 · Rama `vx-ed-004` (desde `9cddf2b`). **No fusionado ni desplegado.**

## 1. Resumen

| Indicador | Resultado |
|---|---|
| Artículos en la rama | **51**: los 30 originales y 21 de Tecnología y Rendimiento (31–51). 50 publicables y 1 borrador |
| Publicables en vista previa | 50 (30 originales + 20 de Tecnología y Rendimiento) · 68 rutas |
| **Listos para producción** | **42** (30 originales + 12 nuevos con fuentes leídas directamente) · 60 rutas |
| Retenidos hasta revisión humana | 8 (31–37 y 40), protegidos automáticamente en el build de producción |
| Borradores | 1 (38, cámara de vapor) |
| Artículos nuevos de VX-ED-005 | 11 (41–51) |
| Fuentes de los artículos 31–51 | 51: 30 de lectura directa, 19 de consulta asistida y 2 de extracto de buscador (todas del borrador 38) |

La cifra de 60 artículos que permitía el encargo no se alcanzó: se priorizó la calidad, como pedía el propio encargo. Los motivos están en el apartado 4.

## 2. Artículos

| Art. | Título | URL | Sección | Estado |
|---|---|---|---|---|
| 31 | ¿Los puntos de AnTuTu dicen cómo irá un juego en tu teléfono? | `/tecnologia/antutu-sirve-para-videojuegos` | Tecnología | Retenido: revisión humana pendiente |
| 32 | ¿Por qué GTA San Andreas cuesta dinero en Google Play? | `/tecnologia/gta-san-andreas-precio-google-play` | Tecnología | Retenido: revisión humana pendiente |
| 33 | ¿Qué hace realmente el modo juego de un teléfono Android? | `/rendimiento/modo-juego-android-como-funciona` | Rendimiento | Retenido: revisión humana pendiente |
| 34 | ¿Por qué mi Redmi no tiene Game Turbo (modo juego)? | `/rendimiento/redmi-sin-modo-juego-game-turbo` | Rendimiento | Retenido: revisión humana pendiente |
| 35 | ¿La RAM virtual mejora el rendimiento en los juegos? | `/rendimiento/ram-virtual-mejora-juegos` | Rendimiento | Retenido: revisión humana pendiente |
| 36 | ¿Por qué un juego pierde FPS después de varios minutos? | `/rendimiento/juego-pierde-fps-despues-de-minutos` | Rendimiento | Retenido: revisión humana pendiente |
| 37 | ¿Por qué el mismo procesador rinde distinto en cada teléfono? | `/tecnologia/mismo-procesador-distinto-rendimiento` | Tecnología | Retenido: revisión humana pendiente |
| 38 | ¿Cómo funciona la «refrigeración líquida» de un teléfono? | `/tecnologia/refrigeracion-liquida-camara-de-vapor-telefono` | Tecnología | **Borrador** |
| 39 | ¿Por qué algunos juegos van mejor en iPhone que en Android? | `/tecnologia/por-que-juegos-funcionan-mejor-iphone` | Tecnología | **Listo para producción** |
| 40 | Cómo elegir un teléfono para jugar antes de comprarlo | `/tecnologia/como-elegir-telefono-para-jugar` | Tecnología | Retenido: revisión humana pendiente |
| 41 | ¿Por qué un teléfono de 120 Hz puede ejecutar un juego a 30 FPS? | `/rendimiento/120-hz-juego-30-fps` | Rendimiento | **Listo para producción** |
| 42 | ¿Cómo funciona la GPU de un teléfono? | `/tecnologia/como-funciona-gpu-telefono` | Tecnología | **Listo para producción** |
| 43 | Vulkan y OpenGL ES: qué cambia para tus juegos | `/tecnologia/vulkan-opengl-es-diferencias` | Tecnología | **Listo para producción** |
| 44 | ¿Por qué los juegos móviles ocupan tantos GB y descargan más al abrirlos? | `/rendimiento/juegos-ocupan-tantos-gb-descargas-adicionales` | Rendimiento | **Listo para producción** |
| 45 | ¿Por qué Google Play dice que mi dispositivo no es compatible con un juego? | `/rendimiento/google-play-dispositivo-no-compatible` | Rendimiento | **Listo para producción** |
| 46 | ¿Puedo jugar juegos de Android en el PC de forma oficial? | `/tecnologia/juegos-android-en-pc-google-play-games` | Tecnología | **Listo para producción** |
| 47 | ¿Puedo usar un mando de PlayStation o Xbox para jugar en el teléfono? | `/tecnologia/mando-playstation-xbox-telefono` | Tecnología | **Listo para producción** |
| 48 | ¿Por qué un teléfono con mucha RAM puede ir lento en los juegos? | `/rendimiento/mucha-ram-telefono-lento` | Rendimiento | **Listo para producción** |
| 49 | ¿Qué hace un iPhone cuando se calienta jugando? | `/rendimiento/iphone-se-calienta-jugando` | Rendimiento | **Listo para producción** |
| 50 | ¿Cómo ver los FPS de un juego en el teléfono? | `/rendimiento/ver-fps-juego-telefono` | Rendimiento | **Listo para producción** |
| 51 | ¿Qué es el escalado de resolución en los juegos móviles? | `/tecnologia/escalado-resolucion-juegos-moviles` | Tecnología | **Listo para producción** |

**«Listo para producción»** significa que todas sus fuentes se leyeron directamente y que el build de producción lo incluye. **«Retenido»** significa que aparece en las vistas previas, pero el build de producción lo excluye automáticamente, junto con los enlaces que apuntan a él, hasta que se marque `"humanReview": "done"`.

## 3. Cambios editoriales de esta entrega

**Para cerrar VX-ED-004:**

- **31 (AnTuTu):** se retiraron los casos de Geekbench (F05 y F06), que no estaban verificados. Su papel lo cumple ahora un dato verificado de Android: los fabricantes pueden aplicar ajustes por juego. Se añadió un diagrama.
- **32 (GTA San Andreas):**
  - Se retiraron la fecha de llegada a Netflix (F09), el desarrollador de la edición de Netflix (F11) y la copia de 2026 (F12).
  - La tesis (juego de pago desde 2013, con compras dentro de la aplicación) se mantiene.
  - El precio actual no se cita porque no se conoce el país de la consulta.
- **38 (cámara de vapor):** queda en **borrador**. Se incorporó F25 con la atribución correcta: Apple atribuye el 40 % al conjunto del A19 Pro y la cámara de vapor, no solo a la refrigeración. Pero el mecanismo físico, que es su tesis, depende de F26 y F27, aún sin verificar.
- **40 (elegir teléfono):**
  - F32 se limita a lo confirmado (Android 5 y 6, octubre de 2024), sin requisitos de iOS por la inconsistencia del comunicado.
  - Los requisitos de Free Fire remiten al artículo 04.
  - La recomendación de Garena se cita sin añadidos.

**Nuevos (41–51):** todos se basan solo en documentación oficial de Android y Apple leída directamente desde este entorno. Cada uno separa lo que dice la fuente de la interpretación de Vélix, que va marcada como tal en los diagramas orientativos.

**Temas sustituidos frente a la lista orientativa del encargo:**

| Tema propuesto | Decisión | Motivo |
|---|---|---|
| 120 Hz y 30 FPS · GPU · Vulkan y OpenGL · tamaño de los juegos · mucha RAM y lento | **Escritos** (41, 42, 43, 44, 48) | Documentación oficial accesible |
| Snapdragon frente a MediaTek · procesadores | No escrito | Las páginas de Qualcomm y MediaTek están bloqueadas; sin ellas sería una comparación genérica |
| UFS y videojuegos | No escrito | Sin fuente técnica accesible |
| Cómo genera Minecraft sus mundos | No escrito | minecraft.net y la documentación de Mojang están bloqueadas |
| Servidores, lag con internet rápido, DNS y ping, juego en la nube | No escritos | La documentación de Google Cloud redirige a un dominio bloqueado y no hay otra fuente técnica accesible |
| Retraso de audífonos Bluetooth | No escrito | La documentación de latencia de audio de Android no trata Bluetooth |
| Carga bypass · brillo de pantalla al jugar · ventiladores externos | No escritos | Sin fuentes oficiales accesibles |
| Juegos de PC en el teléfono | Sustituido por **juegos de Android en el PC** (46) | Google documenta su plataforma oficial con requisitos verificables |
| — | Añadidos: **Google Play «no compatible» y 64 bits** (45), **mandos** (47), **calor en iPhone** (49), **cómo ver FPS** (50) y **escalado de resolución** (51) | Preguntas del banco con fuentes oficiales sólidas |

## 4. Recomendaciones de compra (100, 150, 200, 300 y 500 USD)

**Siguen pendientes.** No se ha podido observar ningún precio con país, comercio, moneda y fecha: las tiendas y las páginas de los fabricantes están bloqueadas desde este entorno. No se crearon como borradores porque el validador exige precios observados en cualquier guía de compra, y una guía sin precios ni modelos verificados no aportaría nada. Sus posiciones en la entrega se cubrieron con los artículos 41–51.

Para desbloquearlas hacen falta, por presupuesto y mercado (por ejemplo, PA, MX, ES y US): de tres a cinco modelos candidatos, su ficha oficial, una prueba independiente con método publicado y precios observados con tienda y fecha. El validador ya rechaza precios de más de 90 días.

## 5. Revisiones humanas necesarias antes de fusionar

Los artículos retenidos no llegarán a producción aunque se fusione la rama. Para liberarlos, una persona debe confirmar con cita literal cada fuente de consulta asistida y añadir `"humanReview": "done"` en el frontmatter del artículo.

| Art. | Fuente de consulta asistida (ChatGPT, 27/11/2026) | Qué sostiene |
|---|---|---|
| 31 | https://www.antutu.com/en/doc/129591.htm | La V10 evalúa CPU, GPU, MEM y UX; usa escenas creadas con Unreal Engine y la API Vulkan; reconoce que la latencia de memoria puede afectar a la fluidez de los juegos; las puntuaciones de V9 y V10 no son directamente comparables y la V10 suele dar más puntos al mismo teléfono. |
| 31 | https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen | Define la estabilidad como el FPS medio del peor ciclo dividido entre el del mejor, multiplicado por 100. El umbral de aprobado del 97 % que publica corresponde a la prueba de estrés de PC descrita en esa página. |
| 32 | https://play.google.com/store/apps/details?id=com.rockstargames.gtasa | Ficha oficial: desarrollador Rockstar Games, juego de pago, compras dentro de la aplicación, gráficos adaptados a móviles, controles táctiles personalizables e historia de más de 70 horas. |
| 32 | https://www.androidauthority.com/grand-theft-auto-san-andreas-android-review-326766/ | Publicación del 21/12/2013 sobre la llegada a Android, con un precio de lanzamiento de 6,99 USD. |
| 32 | https://gameranx.com/updates/id/558698/article/grand-theft-auto-san-andreas-set-to-leave-netflix-on-mobile/ | El medio informa de que la salida de San Andreas del catálogo de Netflix estaba prevista para el 12/12/2025. |
| 33 | https://www.samsung.com/au/support/apps-services/use-game-booster/ | Game Booster busca equilibrar rendimiento, temperatura y consumo de batería según los patrones de juego del usuario. Página actualizada el 20/10/2026. |
| 33 | https://www.mi.com/global/support/article/KA-03436/ | Game Turbo incluye optimizaciones de conectividad WLAN, respuesta táctil, sonido, gestión de recursos y configuración térmica. |
| 34 | https://www.mi.com/global/support/article/KA-710923/ | «The REDMI 12 doesn't support Game Turbo.» |
| 34 | https://www.mi.com/global/support/article/KA-710924/ | «The REDMI 12C doesn't support Game Turbo.» |
| 34 | https://www.mi.com/global/support/faq/details/KA-529999/ | El Redmi Note 14 figura como compatible con Game Turbo. |
| 34 | https://www.mi.com/global/support/faq/details/KA-492711/ | Xiaomi documenta Game Turbo en la REDMI Pad SE 8.7. |
| 34 | https://www.mi.com/global/support/faq/details/KA-515623/ | Ruta oficial: app Seguridad → Game Turbo → icono de ajustes. |
| 34 | https://www.mi.com/global/support/article/KA-03436/ | Game Turbo incluye optimizaciones de conectividad WLAN, respuesta táctil, sonido, gestión de recursos y configuración térmica. |
| 34 | https://ximitime.com/hyperos-2-game-turbo-april-update-is-out-40197/ | Medio no oficial, 22/04/2025: en HyperOS, Game Turbo se actualiza junto con la app Seguridad. |
| 35 | https://www.samsung.com/ca/support/mobile-devices/use-ram-plus-on-your-samsung-galaxy/ | Página actualizada el 03/11/2026: la memoria virtual usa almacenamiento interno, es más lenta que la RAM física y no garantiza mayor rendimiento. |
| 35 | https://www.mi.com/global/support/faq/details/KA-541717/ | Xiaomi describe la extensión de memoria como memoria adicional creada con el almacenamiento disponible. |
| 36 | https://ffsupportsg.garena.com/hc/en-us/articles/4411731947674-How-to-Avoid-Device-Overheating | Artículo del 23/11/2021: reducir los gráficos, evitar jugar mientras se carga y evitar la luz solar directa. |
| 36 | https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen | La estabilidad es el FPS medio del peor ciclo dividido entre el del mejor, multiplicado por 100. El umbral del 97 % corresponde a la prueba de estrés de PC y no se usa aquí. |
| 36 | https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html | Publicado el 02/02/2022 con pruebas de TechTablets: el OnePlus 10 Pro (Snapdragon 8 Gen 1) redujo su rendimiento alrededor de un 37 % en la prueba de estrés. Resultado de benchmark, no FPS de un juego. |
| 37 | https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html | Publicado el 02/02/2022 con pruebas de TechTablets: con el mismo Snapdragon 8 Gen 1, el Xiaomi 12 Pro cerró la prueba de estrés hacia los 17 minutos y el OnePlus 10 Pro redujo su rendimiento alrededor de un 37 %. |
| 40 | https://ffsupportsg.garena.com/hc/en-us/articles/4411731947674-How-to-Avoid-Device-Overheating | Artículo del 23/11/2021: evitar jugar mientras el dispositivo se carga. |
| 40 | https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/ | Publicado el 01/10/2024: confirma la retirada del soporte para Android 5 y 6. El comunicado es inconsistente respecto a iOS 13, por lo que no se usa para requisitos de iOS. |

Para pasar el **38** a publicable hacen falta además F26 (IEEE Spectrum) y F27 (patente; alternativa: https://patents.google.com/patent/US9310139).

## 6. Fuentes consultadas (artículos 31–51)

| Fuente | Tipo | Acceso | Artículos |
|---|---|---|---|
| https://developer.android.com/about/dashboards | Android Developers (oficial) | Lectura directa | 39, 40, 43, 45 |
| https://developer.android.com/develop/ui/views/touch-and-input/game-controllers | Android Developers (oficial) | Lectura directa | 47 |
| https://developer.android.com/games/develop/vulkan/overview | Android Developers (oficial) | Lectura directa | 39, 40, 42, 43 |
| https://developer.android.com/games/gamedashboard/aboutdashboard | Android Developers (oficial) | Lectura directa | 33, 34, 50 |
| https://developer.android.com/games/gamemode/gamemode-api | Android Developers (oficial) | Lectura directa | 31, 33, 37, 40, 41 |
| https://developer.android.com/games/optimize/adpf | Android Developers (oficial) | Lectura directa | 36, 37, 48 |
| https://developer.android.com/games/optimize/adpf/fixed-performance-mode | Android Developers (oficial) | Lectura directa | 31 |
| https://developer.android.com/games/optimize/adpf/gamemode/gamemode-interventions | Android Developers (oficial) | Lectura directa | 43, 51 |
| https://developer.android.com/games/optimize/adpf/thermal | Android Developers (oficial) | Lectura directa | 33, 34, 36, 37, 38, 40, 41, 42, 48, 51 |
| https://developer.android.com/games/playgames/overview | Android Developers (oficial) | Lectura directa | 46 |
| https://developer.android.com/games/playgames/pc-compatibility | Android Developers (oficial) | Lectura directa | 46 |
| https://developer.android.com/games/playgames/start | Android Developers (oficial) | Lectura directa | 46 |
| https://developer.android.com/games/sdk/frame-pacing | Android Developers (oficial) | Lectura directa | 41, 50 |
| https://developer.android.com/google/play/filters | Android Developers (oficial) | Lectura directa | 45 |
| https://developer.android.com/google/play/requirements/64-bit | Android Developers (oficial) | Lectura directa | 45 |
| https://developer.android.com/guide/playcore/asset-delivery | Android Developers (oficial) | Lectura directa | 44 |
| https://developer.android.com/guide/playcore/asset-delivery/texture-compression | Android Developers (oficial) | Lectura directa | 39, 44 |
| https://developer.android.com/media/optimize/performance/frame-rate | Android Developers (oficial) | Lectura directa | 41 |
| https://developer.android.com/topic/performance/memory-management | Android Developers (oficial) | Lectura directa | 35, 40, 42, 44, 48 |
| https://developer.android.com/topic/performance/memory-overview | Android Developers (oficial) | Lectura directa | 48 |
| https://developer.android.com/topic/performance/vitals/render | Android Developers (oficial) | Lectura directa | 50 |
| https://www.apple.com/ca/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/ | Apple (oficial) | Consulta asistida | 38 |
| https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum | Apple Developer (oficial) | Lectura directa | 49 |
| https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/critical | Apple Developer (oficial) | Lectura directa | 49 |
| https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/fair | Apple Developer (oficial) | Lectura directa | 49 |
| https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/serious | Apple Developer (oficial) | Lectura directa | 49 |
| https://developer.apple.com/documentation/gamecontroller | Apple Developer (oficial) | Lectura directa | 47 |
| https://developer.apple.com/documentation/metal/tailor-your-apps-for-apple-gpus-and-tile-based-deferred-rendering | Apple Developer (oficial) | Lectura directa | 42 |
| https://developer.apple.com/documentation/metalfx | Apple Developer (oficial) | Lectura directa | 51 |
| https://developer.apple.com/documentation/xcode/monitoring-your-metal-apps-graphics-performance | Apple Developer (oficial) | Lectura directa | 50 |
| https://developer.apple.com/metal/ | Apple Developer (oficial) | Lectura directa | 39 |
| https://ffsupportsg.garena.com/hc/en-us/articles/4411731947674-How-to-Avoid-Device-Overheating | Desarrollador o tienda (oficial) | Consulta asistida | 36, 40 |
| https://play.google.com/store/apps/details?id=com.rockstargames.gtasa | Desarrollador o tienda (oficial) | Consulta asistida | 32 |
| https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/ | Desarrollador o tienda (oficial) | Consulta asistida | 40 |
| https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen | Editor del benchmark (oficial) | Consulta asistida | 31, 36 |
| https://www.antutu.com/en/doc/129591.htm | Editor del benchmark (oficial) | Consulta asistida | 31 |
| https://gameranx.com/updates/id/558698/article/grand-theft-auto-san-andreas-set-to-leave-netflix-on-mobile/ | Prensa o medio especializado | Consulta asistida | 32 |
| https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9310139 | Prensa o medio especializado | Extracto de buscador | 38 |
| https://spectrum.ieee.org/iphone-17-pro-vapor-chamber | Prensa o medio especializado | Extracto de buscador | 38 |
| https://www.androidauthority.com/grand-theft-auto-san-andreas-android-review-326766/ | Prensa o medio especializado | Consulta asistida | 32 |
| https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html | Prensa o medio especializado | Consulta asistida | 36, 37 |
| https://ximitime.com/hyperos-2-game-turbo-april-update-is-out-40197/ | Prensa o medio especializado | Consulta asistida | 34 |
| https://www.samsung.com/au/support/apps-services/use-game-booster/ | Samsung (oficial) | Consulta asistida | 33 |
| https://www.samsung.com/ca/support/mobile-devices/use-ram-plus-on-your-samsung-galaxy/ | Samsung (oficial) | Consulta asistida | 35 |
| https://www.mi.com/global/support/article/KA-03436/ | Xiaomi (oficial) | Consulta asistida | 33, 34 |
| https://www.mi.com/global/support/article/KA-710923/ | Xiaomi (oficial) | Consulta asistida | 34 |
| https://www.mi.com/global/support/article/KA-710924/ | Xiaomi (oficial) | Consulta asistida | 34 |
| https://www.mi.com/global/support/faq/details/KA-492711/ | Xiaomi (oficial) | Consulta asistida | 34 |
| https://www.mi.com/global/support/faq/details/KA-515623/ | Xiaomi (oficial) | Consulta asistida | 34 |
| https://www.mi.com/global/support/faq/details/KA-529999/ | Xiaomi (oficial) | Consulta asistida | 34 |
| https://www.mi.com/global/support/faq/details/KA-541717/ | Xiaomi (oficial) | Consulta asistida | 35 |

Registro detallado por fuente y afirmación: `docs/vx-ed-004/FUENTES.md`, `docs/vx-ed-004/VERIFICACION.md` y `docs/vx-ed-004/verificacion.csv`.

## 7. Cambios técnicos

- **Protección contra publicación accidental:**
  - Un artículo con alguna fuente de «consulta asistida» se retiene en los builds indexables hasta tener `"humanReview": "done"`.
  - Se retiran también los relacionados y los enlaces del cuerpo que apuntan a él.
  - `test:seo` falla en producción si un artículo retenido, o un enlace hacia él, llega al sitio.
  - Los borradores no pueden entrar en un build de producción.
- **Declaración de acceso por fuente:** una prueba unitaria exige que cada fuente de los artículos nuevos publicados indique si se leyó directamente o por consulta asistida.
- **Tablas en móvil:** cada fila se muestra como ficha, con la etiqueta encima del valor. Así se corrige el desorden que causaban las celdas con texto en negrita o cursiva, detectado en las capturas de esta entrega.
- **Comprobaciones de conteo:** las cifras fijas de artículos se sustituyeron por una comprobación de que los 30 artículos originales siguen presentes en cualquier modo de build.
- **Sin cambios de diseño** ni dependencias nuevas. El JavaScript sigue en 1.624 B gzip.

## 8. Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `npm test` (Vitest) | 45/45 |
| `npm run build` + `test:seo`, vista previa | 50 artículos, 68 rutas: OK |
| Matriz de producción (`CF_PAGES_BRANCH=main`) + `test:seo` | 42 artículos, 60 rutas, 8 retenidos: OK |
| Vista previa con borradores (`INCLUDE_DRAFTS=1`) + `test:seo` | 51 artículos, 69 rutas: OK |
| e2e Chromium con Wrangler Pages Functions | 68 rutas sin JS, búsqueda, teclado, cuatro anchos, 410 y 404: OK |
| Todas las rutas a 320, 390, 768 y 1440 px | Vista previa (68), con borradores (69) y producción (60): sin desbordamientos, sin errores de JavaScript |
| Capturas 390/1440 | `docs/vx-ed-005/capturas/` |
| **No ejecutado** | Firefox (no instalado en el entorno), Safari, dispositivos reales, Lighthouse |

## 9. Nuevas URLs

Todas las rutas de la tabla del apartado 2, más las secciones `/rendimiento/` y `/tecnologia/`. En producción solo aparecen las marcadas «Listo para producción». Las 30 URLs originales no cambian.

## 10. Estado para producción

- **Fusionar la rama hoy publicaría** los 30 artículos originales y los 12 nuevos con fuentes leídas directamente (39 y 41–51), además de las secciones Rendimiento y Tecnología y el bloque de portada.
- Los 8 retenidos **no se publicarían** hasta su revisión humana, y el 38 seguiría en borrador.
- Siguen pendientes, sin cambios en esta entrega: Cloudflare Web Analytics, la revisión jurídica de los textos legales, el correo de contacto y el acceso a Search Console.

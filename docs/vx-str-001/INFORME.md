# VX-STR-001 · Vélix Gaming & Tecnología — Informe de la primera fase

Blue Lab Studios · Revisión del 27 de noviembre de 2026 · Rama `ccr-5f89ba93-g9yb0j`.

**Estado: propuesta para revisión.** Este informe no cambia el sitio, artículos, URLs, la producción ni la configuración de Cloudflare. Todo lo que propone requiere aprobación del CEO antes de implementarse.

---

## 0. Resumen ejecutivo

1. **VX-RD-001 no está disponible.** No aparece en el repositorio (ninguna de las 19 ramas), ni en los PR, ni en los issues, ni en el encargo. No se puede guardar ni contrastar un documento que no tenemos. Las conclusiones de este informe parten de la auditoría y de las fuentes consultadas hoy, no de VX-RD-001. Ver §1.
2. **Recomendación central:** la tecnología debe entrar en Vélix a través del **rendimiento de los seis juegos que ya cubrimos**, no como una sección de hardware aparte. La primera pieza debe ser una página de requisitos por juego dentro de cada universo (`/juegos/{juego}/requisitos-...`). La primera herramienta debería ser un **verificador de requisitos para móvil** que funcione con datos oficiales fechados y entrada manual.
3. **Planteo reparos a cuatro de las cinco herramientas propuestas.** Con las restricciones actuales (sin cuentas, sin servicios de pago, sin inventar rendimiento), los comparadores de teléfonos y procesadores y el recomendador por presupuesto no son viables con calidad ni competitivos. La calculadora de almacenamiento no justifica una herramienta propia: es un campo del verificador. Ver §5.
4. **Coste monetario de la fase 1: cero** con la infraestructura existente. El coste real es de tiempo editorial: unos 15–20 días-persona de implantación y unas 4–8 h/mes de mantenimiento de los datos (estimación propia, no medida). Ver §8.
5. **No hay datos de volumen de búsqueda.** No tenemos acceso a Search Console ni a herramientas de palabras clave, y no se han inventado cifras. La priorización usa señales cualitativas verificables y recomienda medir antes de ampliar. Ver §4.

---

## 1. VX-RD-001: estado y lo que se necesita

| Comprobación | Resultado |
|---|---|
| Archivos de `main` y de las 19 ramas remotas buscados por `informe`, `rd-001`, `investig`, `research` | Solo existe `docs/VELIX_2_0_INVESTIGACION.md`, la investigación de Vélix 2.0, que es anterior y es otro documento |
| Historial completo de commits (`git log --all`) | Ninguna mención a VX-RD-001 |
| PR #13–#20 e issues del repositorio | Ninguna mención; no hay issues |
| `docs/vx-003/INFORME.md`, citado por `CLAUDE.md` | **No existe** en ninguna rama |

**Para cerrar este punto:** enviar VX-RD-001 (texto o archivo). Se guardará sin cambios en `docs/vx-rd-001/` con su fecha y origen. Después se contrastará con este informe y se anotarán los puntos donde ambos discrepen. Hasta entonces, la instrucción de «no asumir que todas las recomendaciones de VX-RD-001 son correctas» se cumple por defecto: no se ha asumido ninguna.

---

## 2. Auditoría del repositorio

### 2.1 Estado verificado hoy

| Elemento | Estado verificado |
|---|---|
| Rama principal | `main` en `3aee488` (merge de PR #20, VX-ED-003) |
| Contenido | 30 artículos publicados en `content/juegos/`: 13 guías, 8 noticias, 5 estrategias, 3 actualizaciones, 2 análisis. Hay 6 juegos: GTA VI, Free Fire, Clash Royale, Minecraft, Fortnite y Roblox |
| Build | `npm test` 24/24 aprobado; `npm run build` aprobado (46 rutas, preview protegido); `npm run test:seo` aprobado. JS total: 1.624 B gzip, con un límite de 10.000 B |
| Imágenes | Solo 2 obras oficiales de Supercell (Fan Kit) × 3 tamaños. Las 7 portadas IA anteriores están retiradas; los demás juegos usan portadas de texto |
| Stack | Vite 7 + TypeScript + markdown-it; HTML estático; Pages Functions (`_middleware.ts`) para los 410 y la protección de previews. Sin React, sin Tailwind, sin CMS |
| PR abiertos | #17 (documentación de Vélix 2.0; no fusionar sin aprobación del CEO) |
| Pendiente conocido | Cloudflare Web Analytics (`npm run test:analytics`), **sin resolver** |

No se ejecutaron en esta revisión las pruebas e2e con Wrangler, Safari, dispositivos reales ni Lighthouse.

### 2.2 Inconsistencias documentales encontradas

Deberían corregirse antes de la implementación para que las próximas sesiones no trabajen con instrucciones obsoletas:

1. **`CLAUDE.md` contradice VX-STR-001.** Dice «Arte propio conceptual con IA», y VX-STR-001 prohíbe las imágenes generadas por IA. Propuesta: sustituir esa línea por «Solo recursos oficiales o con licencia verificada; sin imágenes generadas por IA». **No lo he cambiado**: es una instrucción de gobierno del proyecto y conviene que la apruebe el CEO.
2. `CLAUDE.md` remite a `docs/vx-003/INFORME.md`, que no existe.
3. `README.md` está desactualizado: dice 16 artículos, 32 rutas y «nueve ilustraciones originales» con portadas IA. Hoy son 30 artículos, 46 rutas y 2 imágenes oficiales.
4. `docs/VELIX_ESTADO.md` describe Vélix 2.0 (16/11) e incluye las herramientas como «preservadas», aunque VX-003 las retiró. Este informe añade una nota al principio de ese archivo, sin reescribir el histórico.

### 2.3 Componentes reutilizables

| Componente | Reutilización para VX-STR-001 |
|---|---|
| `scripts/editorial/content.mjs`: validación estricta de frontmatter, fuentes HTTPS con `supports` y fechas reales | **Base del modelo de datos.** Ya obliga a declarar qué afirma cada fuente. Se amplía a fichas de requisitos (§3.3) |
| Bloques Markdown con datos (`elixir-costes` → `<meter>`, sin JS) | Patrón ya probado para renderizar **tablas de requisitos estáticas** desde datos, legibles sin JavaScript |
| `themes.mjs`: un universo visual por juego | Las páginas de requisitos viven dentro del tema de su juego: **se conserva el diseño** sin crear estética nueva |
| `public/editorial/search.js` + índice JSON local | Mismo patrón (JSON estático + JS mínimo, sin enviar datos) para el verificador. El índice puede incorporar las fichas |
| `check-site.mjs`: SEO, enlaces, retiro y límite de 10 KB de JS | El verificador debe caber en ese límite. Un formulario vanilla de 4–6 KB es realista; no hace falta un framework |
| `_middleware.ts` + lista `retired` | Se mantiene. **`/herramientas` devuelve 410** (§3.2) |
| Datos estructurados `Article`/`NewsArticle` y sitemap automático | Las páginas nuevas los heredan sin trabajo adicional |
| Etiqueta `vx-003-before-gaming` (8 herramientas de imagen) | **No es reutilizable**: eran herramientas de procesamiento de imágenes sin relación con el gaming, y usaban React, que ya se retiró |

---

## 3. Arquitectura editorial propuesta

### 3.1 Principio

La tecnología entra en Vélix como **respuesta a una pregunta de juego**: «¿mi teléfono puede con Fortnite?», no «análisis del teléfono X». Cada pieza tecnológica debe nombrar al menos un juego y una fuente oficial del desarrollador o del fabricante. Esta regla aplica directamente la restricción de no convertir Vélix en un medio de tecnología generalista, y además es una ventaja competitiva: en el hardware generalista no podemos competir (§5).

### 3.2 Mapa de URLs

Todas las URLs actuales se mantienen. Solo se añaden rutas nuevas:

```
/                                     (sin cambios)
/juegos/{juego}/                      (sin cambios; nuevo bloque «Rendimiento» si hay contenido)
/juegos/{juego}/{slug}                (sin cambios)
/juegos/{juego}/requisitos-...        NUEVO · ficha canónica de requisitos por juego (artículo)
/rendimiento/                         NUEVO · portada transversal: requisitos, compatibilidad,
                                      almacenamiento y fin de soporte de los seis juegos
/rendimiento/verificador              NUEVO · herramienta (§6). Con tablas legibles sin JS
/rendimiento/{slug}                   NUEVO · explicadores multijuego (GPU, RAM, fin de soporte)
/noticias/ /actualizaciones/ /estrategias/ /guias/   (sin cambios)
```

Decisiones y motivos:

- **No reutilizar `/herramientas`.** Desde VX-003 devuelve 410 a buscadores y usuarios. Volver a darle contenido mezclaría la señal de retirada con la nueva línea y contradice una decisión aprobada. Si el CEO prefiere esa ruta, hay que decidirlo explícitamente y cambiar el middleware y las pruebas.
- **No crear todavía `/tecnologia/` ni `/dispositivos/`.** El README ya prohíbe publicar categorías vacías. Una sección de dispositivos sin datos propios competiría en desventaja. Se reconsidera al cumplir el criterio de la §9.
- **`/rendimiento/` es la única sección nueva.** Agrupa en un solo lugar las líneas «Tecnología» y «Rendimiento» del encargo, manteniendo la relación con los juegos.
- **La primera ficha ya existe.** `/juegos/free-fire/requisitos-celular-free-fire-max` (artículo 04, Garena, actualización del 6/03/2025) se amplía en su misma URL y no se duplica.

### 3.3 Cambios en el modelo de contenido

| Cambio | Detalle |
|---|---|
| Campo `section` opcional (`rendimiento`) | Hace que el artículo aparezca en `/rendimiento/`. Sin él, todo funciona como hoy |
| `games: []` para los explicadores multijuego | Hoy `game` es obligatorio y elige el tema. Los multijuego usan un tema neutro con los tokens actuales, sin estética nueva |
| Nuevo tipo de datos `data/requisitos/{juego}.json` | Una ficha por plataforma y edición: SO mínimo, RAM, almacenamiento, GPU/API gráfica, **cita literal**, URL oficial, fecha visible de la página y fecha de verificación. Si falta la cita o la URL, el build falla |
| Antigüedad de los datos | El build **avisa** cuando una ficha lleva más de 60 días sin verificarse y **falla** a los 120. No se cambia `reviewedAt` sin volver a consultar la fuente (regla vigente) |
| Campo `unknown` explícito | Si el desarrollador no publica un dato (por ejemplo, Roblox no publica RAM mínima en móvil), la ficha dice «no publicado» y no se rellena con datos de terceros |

---

## 4. Diez contenidos prioritarios

### 4.1 Criterios y limitaciones

**No se han medido volúmenes de búsqueda.** No tenemos acceso a Search Console ni a planificadores de palabras clave, y usarlos exigiría crear cuentas o contratar servicios. Cada candidato se ha puntuado de forma cualitativa y verificable:

- **Demanda (señal):** el desarrollador mantiene una página de ayuda sobre la pregunta (indica que se repite en soporte), y el tema aparece en guías de terceros.
- **Competencia:** qué publican hoy los resultados visibles. En los requisitos móviles, los resultados de terceros consultados hoy repiten datos de 2021–2022 o se contradicen: es la oportunidad.
- **Utilidad:** si la respuesta sigue siendo útil meses después.
- **Verificabilidad:** si existe una fuente oficial. Sin ella, la pieza no se publica.

### 4.2 Lista priorizada

| # | Contenido propuesto | Fuente oficial detectada | Por qué ahora | Reparo / riesgo |
|---|---|---|---|---|
| 1 | **Requisitos de Fortnite en Android**: qué pide Epic y por qué tu teléfono aparece como incompatible | [Epic: requisitos en Android](https://www.epicgames.com/help/c-202300000001636/c-202300000001719/what-are-the-system-requirements-for-fortnite-on-android-a202300000013266) | Las versiones indexadas de la página de Epic **se contradicen** (lista de GPU Adreno 530/Mali-G71 frente a «Exynos 2400/Dimensity 9200 o posterior»). Una ficha fechada con cita literal tiene un valor claro | Hay que leer la página en directo antes de publicar; hoy la red de este entorno no la alcanza |
| 2 | **Teléfonos Android que juegan Fortnite a 60 FPS según Epic** | [Epic: lista de dispositivos a 60 FPS](https://www.epicgames.com/help/fortnite-battle-royale-c-202300000001636/technical-support-c-202300000001719/60fortnite-a202300000072631) | Es el único dato de FPS **publicado por un desarrollador** que hemos encontrado. Cumple la regla de no inventar FPS | Solo reproduce y fecha la lista oficial; sin mediciones propias |
| 3 | Ampliación del **artículo 04: Free Fire y Free Fire MAX** (misma URL) | [Garena: requerimientos técnicos](https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX) | Ya está publicado y su fuente oficial ya está citada. Los artículos de terceros encontrados citan cifras de 2021 (2 GB, Android 4.4) | Añadir la tabla de datos sin cambiar el slug |
| 4 | **Requisitos de Roblox en Android, iPhone y PC** | [Roblox: requisitos móviles](https://en.help.roblox.com/hc/en-us/articles/203625474-Roblox-Mobile-System-Requirements) (Android 8.0+, OpenGL ES 3.0, según el extracto indexado) | Complementa las guías 01, 03 y 07, que tratan errores y lag | Roblox no publica RAM mínima en móvil: se dirá así, sin usar los 512 MB que citan terceros |
| 5 | **Requisitos de Minecraft Bedrock en móvil** y qué significa «dejar de recibir actualizaciones» | Ayuda oficial de Minecraft (Android 9, >1 GB RAM, OpenGL ES 3.1, según el extracto indexado de marzo de 2025) | Las guías de terceros dan Android 8 o 5; la cifra oficial es otra | Localizar la URL canónica en help.minecraft.net (la búsqueda devolvió un mirror de Zendesk) |
| 6 | **Requisitos de Clash Royale** y fin de soporte de versiones antiguas | [Supercell: requisitos (artículo «My Game Crashes»)](https://support.clashroyale.com/hc/en-us/articles/49484889019291-My-Game-Crashes) y [App Store](https://apps.apple.com/us/app/clash-royale/id1053012308) | Es el universo con mejor relación de derechos (Fan Kit). Android 7.0 e iOS 14 según las fuentes oficiales | El almacenamiento solo aparece en terceros: «no publicado» |
| 7 | **¿Qué procesador y GPU tiene mi celular?** Cómo averiguarlo para comprobar requisitos | Documentación de Android/fabricantes + páginas oficiales de SoC ([Qualcomm](https://www.qualcomm.com/products/mobile/snapdragon/smartphones/snapdragon-8-series-mobile-platforms/snapdragon-8-elite-gen-5)) | Paso previo a 1–6 y al verificador. Contenido perenne | Verificar los menús en dispositivos reales antes de afirmar rutas de menú |
| 8 | **Adreno, Mali, Immortalis, Xclipse y Apple GPU: cómo leer los requisitos gráficos de un juego** | Páginas de producto de Qualcomm, Arm, Samsung, MediaTek y Apple | Los requisitos de Fortnite usan esos nombres; los usuarios no saben si su GPU es «superior» | **No hay un orden oficial entre familias.** No se puede afirmar «Mali-G68 ≥ Adreno 530». El texto explicará esa limitación |
| 9 | **Mi teléfono ya no recibe actualizaciones de [juego]**: qué es el fin de soporte y qué opciones hay | Avisos oficiales de fin de soporte de [Supercell](https://supercell.com/en/games/clashroyale/blog/news/end-of-support-ios-12-ios-13-android-5-and-android-6/) y Mojang | Pregunta transversal que se repite con cada subida de mínimos | Sin recomendar APK ni versiones antiguas no oficiales |
| 10 | **Espacio que necesita GTA VI en PS5 y Xbox Series** (condicional) | Fichas de PlayStation Store / Microsoft Store o Rockstar | Juego en lanzamiento con mucha cobertura en Vélix. Las cifras publicadas hoy (210–212 GB) **no están confirmadas** por una fuente oficial | **Solo se publica si la ficha de tienda oficial muestra el tamaño.** Si no, se sustituye por la guía de RAM y almacenamiento para actualizar juegos móviles |

Los contenidos 1 y 3–6 son, además, **los datos que alimentan el verificador**. El trabajo editorial y el de la herramienta se hacen una sola vez.

---

## 5. Evaluación de las cinco herramientas propuestas

| Herramienta | Viabilidad con las restricciones actuales | Competencia | Veredicto |
|---|---|---|---|
| **Verificador de requisitos** | **Alta** si se limita a los 6 juegos y usa datos oficiales con entrada manual | PC: dominado por herramientas veteranas. Móvil en español: artículos estáticos, a menudo desactualizados | **Primera herramienta** (§6) |
| Calculadora de almacenamiento | Alta técnicamente, pero los tamaños varían por dispositivo y versión, y pocos desarrolladores los publican | Las tiendas ya muestran el tamaño | **No como herramienta aparte.** Es un campo del verificador, cuando haya dato oficial |
| Comparador de teléfonos | **Baja.** Exige una base de miles de modelos con datos actualizados. Las bases conocidas restringen la reutilización (ej. [DeviceSpecifications prohíbe el scraping](https://www.devicespecifications.com/it/terms-of-use)). Las imágenes de fabricantes tienen términos restrictivos ([Samsung Mobile Press](https://samsungmobilepress.com/terms)). Sin benchmarks propios solo compararía fichas | Muy alta: GSMArena, Kimovil, Nanoreview, Versus… con años de ventaja | **Descartar en fase 1.** Alternativa: comparar solo modelos de listas oficiales de desarrolladores (ej. la lista de 60 FPS de Epic) |
| Comparador de procesadores | **Baja.** Las páginas oficiales dan núcleos, frecuencias y mejoras relativas del propio fabricante («+23 % GPU»), que no se pueden comparar entre marcas. Comparar rendimiento exigiría medir o licenciar benchmarks | Alta (NotebookCheck, Nanoreview) | **Descartar.** Su lugar lo ocupa el explicador del contenido 8 |
| Recomendador por presupuesto | **Muy baja.** Necesita precios regionales actualizados (sin fuente gratuita fiable y sin cuentas de afiliados) y datos de rendimiento que no tenemos. El riesgo de recomendar a partir de datos inventados es alto | Alta, con monetización por afiliación | **Descartar** hasta tener datos propios y una política de afiliación aprobada |

**Mi conclusión:** el diferencial de Vélix no es tener más datos que los grandes comparadores, sino **datos oficiales, fechados, en español, sobre los juegos que el lector ya juega, sin rastreo**. Las herramientas que no pueden cumplir esa promesa deben esperar.

---

## 6. Primera herramienta: verificador de requisitos para móvil

### 6.1 Alcance de la versión 1

- **Juegos y ediciones:** Free Fire, Free Fire MAX, Roblox, Minecraft Bedrock, Fortnite (Android) y Clash Royale. GTA VI queda fuera porque solo sale en consolas; su página de requisitos será informativa.
- **Plataformas:** Android e iOS/iPadOS.
- **Entrada:** el usuario indica la versión del sistema, la RAM, el espacio libre y, opcionalmente, la GPU. Cada campo enlaza al contenido 7 («cómo saberlo»).
- **Salida por juego:**
  - **Cumple el mínimo publicado:** SO, RAM y espacio son comparaciones numéricas deterministas.
  - **No cumple:** se indica qué dato falla.
  - **No se puede determinar:** cuando el requisito es una lista de GPU o el desarrollador no publica el dato.

  Cada resultado incluye la cita oficial, el enlace y la fecha de verificación, y recuerda que cumplir el mínimo no garantiza fluidez (como ya hace el artículo 04).
- **Sin JavaScript:** la página muestra las mismas tablas de requisitos en HTML estático. La herramienta es una mejora progresiva.

### 6.2 Por qué no se autodetecta el dispositivo (reparo técnico)

Autodetectar parece más cómodo, pero hoy no es fiable y choca con la política de privacidad:

- Chrome reduce el *user-agent* en Android (versión de Android y modelo congelados), así que el UA no sirve para leer la versión real.
- `navigator.deviceMemory` solo existe en navegadores Chromium y devuelve valores redondeados con tope bajo. No mide la RAM real.
- `navigator.userAgentData.getHighEntropyValues()` puede dar el modelo y la versión en Chromium, pero no en Safari ni Firefox. Además son datos de alta entropía que exigirían revisar el texto de privacidad.

Estas limitaciones se basan en el comportamiento documentado de los navegadores y **hay que confirmarlas en dispositivos reales durante la implementación**. Hasta entonces no se declaran probadas. Propuesta: v1 manual; un botón opcional «rellenar con datos de este navegador» se evaluaría en v2, procesando todo en local y tras revisar la privacidad.

### 6.3 Requisitos técnicos

| Área | Requisito |
|---|---|
| Código | TypeScript vanilla compilado por Vite. Sin React ni dependencias nuevas. Objetivo: **≤ 6 KB gzip**, para que el total siga por debajo del límite actual de 10 KB |
| Datos | `data/requisitos/*.json` validados en build (§3.3), exportados a `dist/editorial/requisitos.json` y renderizados también como tablas HTML |
| Privacidad | Nada sale del navegador; sin `localStorage` por defecto; sin analítica nueva. Encaja con COEP/COOP actuales porque los datos son locales |
| Accesibilidad | Formulario con `label`, resultados en región `aria-live`, estados con texto (no solo color), teclado |
| Pruebas | Vitest para la lógica de comparación y la validación de datos (incluida la antigüedad); `test:seo` para rutas y JSON-LD; e2e en Chromium y Firefox con y sin JS; capturas a 390 y 1440 px (regla de `CLAUDE.md`) |
| Mantenimiento | Revisión mensual de las 6–8 fichas oficiales, más revisiones puntuales tras cada anuncio de fin de soporte. El build impide publicar datos caducados |
| Datos estructurados | `WebApplication` solo si las directrices de Google lo justifican; si no, `Article` en la página de la herramienta. Sin FAQPage/HowTo (política vigente) |

---

## 7. Fuentes de información y su licencia

| Fuente | Qué aporta | Acceso | Licencia / condición | Uso propuesto |
|---|---|---|---|---|
| Páginas de ayuda de Epic, Garena, Roblox, Mojang y Supercell | Requisitos oficiales, listas de dispositivos, fin de soporte | Lectura manual | Citamos hechos con enlace y fecha; no copiamos páginas completas | **Fuente primaria** del verificador |
| App Store / Google Play (fichas de cada juego) | Versión mínima de iOS y compatibilidad | Lectura manual | Igual que la fila anterior | Contraste de SO mínimo |
| [Google Play: lista de dispositivos compatibles](https://support.google.com/googleplay/answer/1727131) (`storage.googleapis.com/play_public/supported_devices.csv`, **comprobado hoy: HTTP 200**) | Marca, nombre comercial, código de dispositivo y modelo | CSV público, UTF-16 | Términos de Google; verificar antes de redistribuir | Posible autocompletado de modelos en v2. **No incluye RAM, SoC ni GPU** |
| Play Console Device Catalog | RAM, SoC, GPU, versiones de Android por modelo | Requiere cuenta de desarrollador con tarifa de registro | — | **Bloqueado** por la restricción de no crear cuentas ni pagar servicios |
| Qualcomm, MediaTek, Samsung Exynos, Arm, Apple (páginas de producto) | Nombre de GPU, APIs (Vulkan/OpenGL ES), arquitectura | Lectura manual | Afirmaciones del fabricante: citarlas como tales, nunca como mediciones | Contenidos 7 y 8 |
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Licensing) | Datos estructurados de dispositivos y SoC | SPARQL/API | **CC0** (datos) | Candidata para v2. **Cobertura no verificada**: la red de este entorno no alcanza wikidata.org |
| [Steam Hardware Survey](https://store.steampowered.com/hwsurvey) | Distribución de GPU/RAM en PC | Público | Opt-in; Valve no publica tamaño ni método de la muestra | Solo con esa advertencia; poco relevante para la v1 (móvil) |
| PCGamingWiki | Requisitos y ajustes de PC | Público | **CC BY-NC-SA 3.0** según fuentes secundarias: la cláusula no comercial impide reutilizar en un sitio con monetización | Solo como pista para encontrar la fuente oficial |
| IGDB (Twitch) | Metadatos de juegos | API con cuenta de Twitch | Términos contradictorios sobre uso comercial; requiere cuenta | **No usar** en esta fase |
| GSMArena, DeviceSpecifications, Kimovil | Fichas de teléfonos | Web | Términos restrictivos o no verificados; prohíben scraping (DeviceSpecifications, verificado) | **No usar** como fuente de datos |

**Imágenes:** la fase 1 **no necesita imágenes nuevas**. Las fichas, el verificador y los explicadores usan las portadas de texto actuales; Clash Royale conserva su arte del Fan Kit. Las imágenes de teléfonos tienen condiciones restrictivas ([Samsung Mobile Press](https://samsungmobilepress.com/terms); el [Semiconductor Newsroom](https://news.samsungsemiconductor.com/global/terms-of-use) solo permite uso no comercial). Cualquier imagen de hardware debe pasar antes por el registro de `docs/vx-003/PERMISOS_IMAGENES.md`.

**Limitación de esta revisión:** este entorno solo permitió leer en directo el CSV de Google Play. Las páginas de Epic, Roblox, Garena, Minecraft, Supercell, Steam y Wikidata se conocen por extractos de buscador y **deben leerse en directo antes de publicar cualquier cifra**. Las cifras citadas en este informe son indicativas y no deben copiarse a un artículo sin esa lectura.

---

## 8. Costes estimados

Son estimaciones de esfuerzo; no hay mediciones previas de productividad del equipo.

| Partida | Coste monetario | Esfuerzo estimado |
|---|---|---|
| Hosting (Cloudflare Pages existente, mismo build y Functions) | 0 adicional | — |
| Modelo de datos, validación, antigüedad y pruebas (§3.3) | 0 | 1,5–2 días |
| 6 fichas de requisitos verificadas (contenidos 1, 3–6 + GTA VI informativa) | 0 | 3 días |
| `/rendimiento/` y bloques en los universos (con el diseño actual) | 0 | 1 día |
| Verificador v1 + e2e + capturas | 0 | 3–4 días |
| Contenidos 2, 7, 8, 9, 10 | 0 | 4–6 días |
| Revisión editorial y de fuentes | 0 | 2–3 días |
| **Total fase 1** | **0** | **≈ 15–20 días-persona** |
| Mantenimiento de datos | 0 | 4–8 h/mes |

Opciones con coste, **no recomendadas ahora** y que requerirían autorización expresa: cuenta de Play Console (tarifa de registro; da RAM/SoC por modelo); herramientas SEO de pago para estimar volúmenes; cuentas de afiliación para precios. Medición sin coste: el acceso a Search Console sigue pendiente y es la forma correcta de validar la demanda.

---

## 9. Plan, medición y criterios de decisión

1. **Bloqueos antes de implementar:** recibir VX-RD-001; aprobar la corrección de `CLAUDE.md` (§2.2); aprobar la arquitectura de la §3; conceder acceso a Search Console; permitir en el entorno de trabajo la lectura de los dominios oficiales (epicgames.com, roblox.com, garena.com, minecraft.net, supercell.com).
2. **Implementación (PR en rama, sin merge sin aprobación):** primero los datos y las fichas, después `/rendimiento/` y por último el verificador.
3. **Medición tras la publicación** (cuando se autorice): línea base y revisión a 30/45/60 días en Search Console de impresiones y clics de las fichas, frente a los artículos de noticias. Con el pendiente de Web Analytics **sin resolver**, no se promete medición de uso de la herramienta.
4. **Criterio para ampliar** a comparativas de dispositivos o a `/dispositivos/`: que las fichas de requisitos generen consultas de modelos concretos en Search Console y exista una fuente de datos con licencia compatible. Si no se cumple, se mantiene el foco en rendimiento por juego.

---

## 10. Decisiones solicitadas al CEO

1. Enviar VX-RD-001 para archivarlo y contrastarlo.
2. Aprobar o rechazar la sección `/rendimiento/` y las fichas `/juegos/{juego}/requisitos-...`.
3. Confirmar que **no** se reutiliza `/herramientas` (410).
4. Aprobar el verificador de requisitos para móvil, con entrada manual, como primera herramienta.
5. Aprobar el descarte de los comparadores y del recomendador en la fase 1.
6. Aprobar la nueva línea de `CLAUDE.md` sobre imágenes.

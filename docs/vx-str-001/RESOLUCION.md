# VX-STR-001 · Resolución estratégica y plan de entregas

Resolución del CEO recibida el 27 de noviembre de 2026. Aprueba el [informe](INFORME.md) con modificaciones. Este documento registra lo decidido y cómo se implementa. **No autoriza fusionar ni desplegar.**

## 1. Decisiones

| # | Decisión | Estado en el repositorio |
|---|---|---|
| 1 | Crear `/rendimiento/` conservando diseño y URLs | **Entrega 1**: sección publicada en la rama con 3 artículos existentes |
| 2 | Incorporar `/tecnologia/` (teléfonos gaming, procesadores, hardware, consolas, accesorios) | **Entrega 1**: estructura y reglas listas; la sección aparece al publicar su primer artículo verificado |
| 3 | Verificador de requisitos como primera herramienta, condicionado a verificar directamente las fuentes oficiales; no confundir requisitos con rendimiento | Entrega 2 |
| 4 | No reutilizar `/herramientas/` | Sigue en 410; `test:seo` falla si aparece una ruta `/herramientas*` |
| 5 | Posponer comparadores interactivos y recomendadores automatizados; permitir artículos de comparación y de compra | Tipos `comparativa` y `compra` añadidos al modelo |
| 6 | Ampliar la propuesta editorial (10 temas de compra y hardware) | §3 de este documento |
| 7 | Actualizar `CLAUDE.md`, README y `VELIX_ESTADO.md`; política de imágenes | **Entrega 1** |
| 8 | Archivar VX-RD-001 cuando se proporcione | Pendiente de recibir el original |
| 9 | Entregas pequeñas, con pruebas y revisión | §4 |

## 2. Reglas incorporadas al validador (`scripts/editorial/content.mjs`)

- `section` (`rendimiento` | `tecnologia`) es opcional. Un artículo **sin** `game` solo se admite con `section` y vive en `/{sección}/{slug}`. Los artículos con `game` conservan `/juegos/{juego}/{slug}`.
- Las piezas sin juego propio y todas las de `tecnologia` deben listar en `games` al menos un videojuego relacionado. Así se aplica la regla de no ser un medio de tecnología generalista.
- Los tipos `comparativa` y `compra`, y toda pieza de `tecnologia`, exigen `handsOn` (booleano). Con `false` la página muestra: «No hemos probado estos dispositivos». Con `true` exige `methodology`.
- `compra` exige `prices`. Cada precio declara producto, importe > 0, moneda ISO 4217, mercado ISO 3166-1 alfa-2, tienda, URL HTTPS y `observedAt`. Esa fecha no puede ser posterior a `reviewedAt` ni tener más de 90 días en el momento del build.
- La página muestra los precios en la tabla «Precios observados», con mercado y fecha, y advierte que no son una oferta vigente.

## 3. Plan editorial ampliado

Ningún tema se publica sin que sus datos se lean directamente en las fuentes (oficiales e independientes) y sin precios con mercado y fecha cuando los cite. Las cifras del informe anterior siguen siendo indicativas hasta esa lectura.

### Rendimiento (base del verificador)

| Tema | Ruta prevista | Fuente principal |
|---|---|---|
| Requisitos de Fortnite en Android | `/juegos/fortnite/requisitos-android` | Ayuda de Epic Games |
| Android que juegan Fortnite a 60 FPS según Epic | `/juegos/fortnite/android-60-fps-lista-oficial` | Lista oficial de Epic |
| Ampliación de requisitos de Free Fire / MAX | URL actual del artículo 04 | Soporte de Garena |
| Requisitos de Roblox | `/juegos/roblox/requisitos-celular-pc` | Ayuda de Roblox |
| Requisitos de Minecraft Bedrock en móvil | `/juegos/minecraft/requisitos-bedrock-movil` | Ayuda de Minecraft |
| Requisitos de Clash Royale y fin de soporte | `/juegos/clash-royale/requisitos-fin-de-soporte` | Soporte de Supercell, App Store |

### Tecnología (artículos editoriales de comparación y compra)

| # | Tema | Tipo | Juegos relacionados | Datos que exige | Reparo |
|---|---|---|---|---|---|
| 1 | Cómo elegir un teléfono gaming antes de comprarlo | guía | Free Fire, Fortnite, Roblox, Minecraft | Requisitos oficiales; especificaciones de fabricantes | **Publicar primero**: es la base de las guías de compra y no depende de precios |
| 2 | Diferencias entre procesadores de gama media y alta para jugar | comparativa | Fortnite, Free Fire | Fichas oficiales de Qualcomm/MediaTek/Samsung/Apple; pruebas independientes citadas | Las mejoras porcentuales de cada fabricante no son comparables entre marcas |
| 3 | Snapdragon vs. MediaTek para videojuegos | comparativa | Fortnite, Free Fire, Roblox | Igual que el 2, con modelos concretos y fecha | No declarar un «ganador» general; comparar modelos concretos con fuentes independientes |
| 4 | Batería, refrigeración y rendimiento sostenido | guía | Fortnite, Free Fire | Pruebas independientes con metodología publicada | Sin pruebas propias; citar la metodología ajena |
| 5 | Teléfonos compatibles con los juegos oficiales de GTA | guía | GTA (ediciones móviles oficiales) | Fichas de tienda y requisitos del editor | Verificar qué ediciones móviles oficiales existen hoy y en qué tiendas |
| 6 | Mejores teléfonos para Fortnite Mobile | compra | Fortnite | Lista oficial de Epic de 60 FPS + precios por mercado | La disponibilidad de Fortnite en Android/iOS varía según región y tienda: comprobar antes de recomendar |
| 7 | Mejores celulares económicos para Free Fire | compra | Free Fire, Free Fire MAX | Requisitos de Garena + precios por mercado | Definir el tramo «económico» con importe, moneda y mercado |
| 8 | Mejores teléfonos de gama media para jugar | compra | Varios | Especificaciones oficiales + pruebas independientes + precios | Criterio de selección explícito y publicado |
| 9 | Teléfonos gaming por presupuesto | compra | Varios | Precios por mercado y fecha; mismo criterio que el 8 | **Mantenimiento alto**: los precios caducan a los 90 días por regla de build |
| 10 | Accesorios y mandos para gaming móvil | compra | Fortnite, Minecraft, Roblox (u otros con soporte de mando confirmado) | Compatibilidad de mando publicada por cada juego; fichas de fabricantes | Solo recomendar mandos para juegos cuyo soporte oficial esté documentado |

**Mercado de referencia:** pendiente de decisión. Para comparar precios hay que elegir uno o varios mercados (por ejemplo, PA, MX, ES o US). Mientras no se elija, las guías de compra 6–9 no pueden redactarse con precios.

**Enlaces de afiliados:** no se usan. Si se aprobaran, requerirían declaración visible y revisión de la política de privacidad.

## 4. Entregas

| Entrega | Contenido | Bloqueos |
|---|---|---|
| **E1 (esta rama: `vx-str-001-entrega-1`)** | `/rendimiento/`, estructura de `/tecnologia/`, validador de comparativas/compra/precios, menú, documentación, pruebas y capturas | Ninguno |
| E2 | Fichas de requisitos verificadas (datos JSON + artículos) y verificador manual para móvil (TS vanilla, ≤ 6 KB gzip) | Acceso de red a epicgames.com, roblox.com, garena.com, minecraft.net y supercell.com para leer las fuentes en directo |
| E3 | Tecnología: temas 1 y 2 (sin precios) → apertura de `/tecnologia/` | Lectura de fuentes oficiales e independientes |
| E4 | Temas 3–5 y 10 | Igual que E3 |
| E5 | Guías de compra 6–9 | Mercado de referencia decidido; precios observados y fechados |

Cada entrega: build, `npm test`, `test:seo` (matriz producción/preview), e2e con Pages Functions y capturas a 390/1440 px. Fusión y despliegue solo con aprobación del CEO.

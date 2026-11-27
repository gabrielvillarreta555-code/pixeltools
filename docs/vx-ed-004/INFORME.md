# VX-ED-004 · Informe de la primera entrega editorial de tecnología

Blue Lab Studios · 27 de noviembre de 2026 · Rama `vx-ed-004` (antes `vx-ed-003-tecnologia`), basada en `vx-str-001-entrega-1`. **No fusionado ni publicado.**

> **Código:** dirección aprobó el 27/11/2026 renumerar esta entrega como **VX-ED-004** (el código VX-ED-003 corresponde a la ampliación a 30 artículos, PR #20). Esa misma resolución pide conservar los diez borradores, no crear artículos nuevos, mantener pendientes las guías de compra y los experimentos, y preparar el [listado de fuentes pendientes](VERIFICACION.md).

## 1. Entregables

| Entregable | Dónde | Estado |
|---|---|---|
| Banco de 150 preguntas nuevas (más las 10 del encargo) | [PREGUNTAS.md](PREGUNTAS.md) | 50 observadas con enlace, 3 de dirección, 97 hipótesis por validar |
| Registro de fuentes verificables | [FUENTES.md](FUENTES.md) | 40 fuentes únicas; 8 leídas directamente, 32 por extracto de buscador |
| Selección de 20 prioridades | [PRIORIDADES.md](PRIORIDADES.md) | Puntuadas con cinco criterios |
| 10 artículos completos | `content/juegos/31-*.md` a `40-*.md` | **Borradores** (`status: draft`), fuera del sitio y del sitemap |
| Propuestas de experimentos | [EXPERIMENTOS.md](EXPERIMENTOS.md) | 7 metodologías; ninguna ejecutada |
| Evaluación de diferenciación | §3 de este informe | — |
| Informe de limitaciones | §4 de este informe | — |
| Capturas de los borradores en vista previa | `capturas/` | 390 y 1440 px |

### Los diez artículos

| # | Título | Ruta prevista | Tipo |
|---|---|---|---|
| 31 | ¿Los puntos de AnTuTu dicen cómo irá un juego en tu teléfono? | `/tecnologia/antutu-sirve-para-videojuegos` | Análisis |
| 32 | ¿Por qué GTA San Andreas cuesta dinero en Google Play? | `/tecnologia/gta-san-andreas-precio-google-play` | Análisis |
| 33 | ¿Qué hace realmente el modo juego de un teléfono Android? | `/rendimiento/modo-juego-android-como-funciona` | Guía |
| 34 | ¿Por qué mi Redmi no tiene modo juego? Dónde buscar Game Turbo | `/rendimiento/redmi-sin-modo-juego-game-turbo` | Guía |
| 35 | ¿La RAM virtual mejora el rendimiento en los juegos? | `/rendimiento/ram-virtual-mejora-juegos` | Análisis |
| 36 | ¿Por qué un juego pierde FPS después de varios minutos? | `/rendimiento/juego-pierde-fps-despues-de-minutos` | Guía |
| 37 | ¿Por qué dos teléfonos con el mismo procesador rinden distinto en juegos? | `/tecnologia/mismo-procesador-distinto-rendimiento` | Comparativa |
| 38 | ¿Cómo funciona la «refrigeración líquida» de un teléfono? | `/tecnologia/refrigeracion-liquida-camara-de-vapor-telefono` | Análisis |
| 39 | ¿Por qué algunos juegos funcionan mejor en iPhone que en Android? | `/tecnologia/por-que-juegos-funcionan-mejor-iphone` | Comparativa |
| 40 | Cómo elegir un teléfono para jugar antes de comprarlo | `/tecnologia/como-elegir-telefono-para-jugar` | Guía |

Todos declaran `handsOn: false` o no tratan dispositivos concretos, nombran los videojuegos relacionados, distinguen fuentes oficiales, prensa independiente e interpretación propia, e indican en `scope` qué fuentes faltan por leer directamente. Cuatro incluyen un diagrama de pasos y seis incluyen tablas.

### Cambios técnicos (sin herramientas nuevas)

- **Vista previa de borradores:** `INCLUDE_DRAFTS=1 npm run build` genera los borradores con un aviso visible. El build **falla** si se intenta en un sitio indexable, y `test:seo` falla si hay borradores en producción.
- **Diagramas de pasos:** bloque Markdown `flujo` que genera una figura accesible (`<figure>` con lista ordenada), sin JavaScript ni imágenes.
- **Menú móvil:** con Rendimiento y Tecnología, filas de 3, 2 y 2 en lugar de dejar una entrada sola.
- **Pruebas:** 40 unitarias (antes 37). `test:seo` pasa con y sin borradores y en la matriz de producción. El e2e en Chromium con Pages Functions pasa sobre el build publicable (47 rutas).

## 2. Por qué estos diez y no exactamente las diez puntuaciones más altas

Las diez preguntas de ejemplo de dirección se aceptaron como punto de partida y se contrastaron con la puntuación. Dos temas con más puntos (Fortnite en Android, 14; requisitos de Roblox, Minecraft y Clash Royale, 12) quedaron fuera porque **dependen de leer directamente centros de ayuda que este entorno no alcanza**. Publicar cifras de requisitos a partir de extractos de buscador contradice la condición de la resolución VX-STR-001. La pregunta E6 («teléfono para jugar con 200 dólares») se transformó en una guía de criterios (40), porque no hay precios observados.

## 3. Diferenciación frente a buscadores e IA generativa

### Prueba aplicada a cada artículo

Antes de escribir, cada tema pasó tres preguntas:

1. ¿Una respuesta genérica de un asistente de IA daría lo mismo en un párrafo? Si sí, el tema baja de prioridad.
2. ¿Hay al menos una fuente primaria (documentación oficial, fabricante, patente, medición publicada) que aporte datos que no estén en el conocimiento común?
3. ¿Podemos añadir algo que una IA no hace por defecto: fechar los datos, señalar contradicciones, decir qué no se sabe o proponer cómo medirlo?

### Qué aporta Vélix que una respuesta genérica no

| Recurso | Ejemplo en este paquete |
|---|---|
| **Fechas y versiones** | Datos de Vulkan de Google con su periodo (hasta el 24/11/2025); fechas de actualización visibles en la documentación de Android; versiones V10 y V12 de AnTuTu |
| **Contradicciones documentadas** | Android afirma no usar almacenamiento como swap; Samsung y Xiaomi lo ofrecen (35). Las cifras de precio de San Andreas se contradicen y no se publican (32) |
| **Casos verificables** | Geekbench retiró modelos de OnePlus y Samsung (31, 37) |
| **Límites explícitos** | «Lo que todavía no sabemos» y «Lo que no podemos afirmar» en varios artículos |
| **Procedimientos concretos** | Ruta de Game Turbo, tabla de causas (34); lista de comprobación térmica (36); diez comprobaciones de compra (40) |
| **Diagramas propios** | Ciclo térmico, ciclo de la cámara de vapor, flujo de memoria, flujo de Game Mode |
| **Camino a datos propios** | Cada artículo enlaza con un experimento propuesto; ninguno presenta resultados inexistentes |

### Dónde Vélix **no** se diferencia todavía

- **Sin datos propios.** Hasta ejecutar los experimentos, el contenido es investigación documental de buena calidad, pero cualquier medio con el mismo método podría replicarlo.
- **Sin recomendaciones de compra con modelos.** Es la categoría con más intención comercial y donde los competidores tienen ventaja (bases de datos, afiliación, pruebas propias).
- **Las preguntas «H» no tienen demanda demostrada.** Escribirlas sin validar puede producir artículos útiles que nadie busca.
- **Los asistentes de IA y los resúmenes de buscador** responden bien a preguntas conceptuales cortas («qué es zRAM»). Nuestra ventaja aparece cuando la respuesta exige datos fechados, cruce de fuentes o procedimiento. Los temas que no cumplan eso deben descartarse aunque tengan demanda.

## 4. Limitaciones

| Limitación | Efecto | Qué haría falta |
|---|---|---|
| **Red del entorno:** solo se pudo leer directamente `developer.android.com`. El proxy devolvió 403 para Roblox, Epic, Garena, Minecraft, Supercell, Samsung, Xiaomi, Qualcomm, Reddit y Google Play. La propuesta de un entorno con esos hosts fue rechazada por el servicio | 32 de 40 fuentes se conocen solo por extractos de buscador. Los artículos quedan como **borradores** | Un entorno con acceso a esos dominios, o la verificación manual de cada fuente por una persona del equipo |
| **Sin precios observados** | No hay guías por presupuesto | Un procedimiento de observación de precios (mercados, tiendas, frecuencia) aprobado por dirección |
| **Sin demanda medida** | La prioridad es cualitativa | Acceso a Search Console. Cualquier herramienta de palabras clave de pago requiere autorización |
| **Comunidades no consultadas directamente** | Reddit y la mayoría de los foros solo se vieron mediante buscador | Acceso de red o revisión manual |
| **Sin pruebas propias** | Ninguna cifra de rendimiento es de Vélix | Aprobación, equipos y tiempo (EXPERIMENTOS.md) |
| **Navegadores** | Ejecutado: Chromium con Wrangler Pages. **No ejecutado:** Firefox (no instalado), Safari, dispositivos reales, Lighthouse | Entorno con esos navegadores o dispositivos |
| **Fuentes antiguas** | Los testimonios de desarrolladores sobre iOS y Android son de 2014–2016; el artículo 39 lo advierte | Buscar estudios recientes con método publicado |
| **Imágenes** | Ningún artículo nuevo tiene imagen | Recursos oficiales con permisos documentados, según la política vigente |
| **Cloudflare Web Analytics** | Sigue pendiente en producción (sin cambios en esta entrega) | Decisión de configuración del alojamiento |

## 5. Para publicar estos borradores

Para cada artículo:

1. Abrir cada fuente marcada «Extracto de buscador» en FUENTES.md y confirmar cada afirmación. Corregir o eliminar lo que no coincida.
2. Actualizar `reviewedAt` solo después de esa lectura, y retirar del `scope` la frase sobre extractos pendientes.
3. Cambiar `status` a `published`, ejecutar `npm test`, `npm run build`, `npm run test:seo` y el e2e, y capturar 390/1440 px.
4. Aprobación del CEO antes de fusionar.

## 6. Decisiones solicitadas

1. Verificación de las 32 fuentes pendientes y de las 9 afirmaciones sin fuente: ver [VERIFICACION.md](VERIFICACION.md).
2. Mercados de referencia y procedimiento para observar precios (necesario para las guías de 100, 150, 200 y 300 USD).
3. Aprobación, por separado, de un piloto de herramientas de medición y de los experimentos X2 y X1.
4. Acceso a Search Console para validar el banco de preguntas.

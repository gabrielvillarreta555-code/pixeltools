---
{
  "id": "31-antutu-videojuegos",
  "section": "tecnologia",
  "games": ["Fortnite", "Free Fire", "Roblox", "Minecraft"],
  "slug": "antutu-sirve-para-videojuegos",
  "title": "¿Los puntos de AnTuTu dicen cómo irá un juego en tu teléfono?",
  "description": "Qué mide AnTuTu, por qué una cifra alta no garantiza partidas estables y qué datos mirar si te interesa jugar durante más de unos minutos.",
  "answer": "Solo en parte. AnTuTu suma pruebas cortas de CPU, GPU, memoria y experiencia de uso; sirve para ordenar teléfonos por potencia máxima, no para predecir los FPS de un juego concreto. Los juegos se ejecutan durante mucho más tiempo, dependen del calor acumulado, del controlador gráfico y de cómo cada estudio adapta su juego. Las versiones del test tampoco son comparables entre sí.",
  "reviewedAt": "2026-11-27",
  "publishedAt": "2026-11-27",
  "status": "draft",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Análisis documental. No hemos ejecutado AnTuTu ni juegos en teléfonos para este artículo. Las fuentes de terceros se leyeron mediante extractos de buscador; requieren lectura directa antes de publicar.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "AnTuTu: nota de la versión V10 (25/05/2023)",
      "url": "https://www.antutu.com/en/doc/129591.htm",
      "supports": "La V10 cambió la prueba de CPU y, en general, un mismo dispositivo puntúa más que en la V9."
    },
    {
      "label": "Notebookcheck: beta pública de AnTuTu V12",
      "url": "https://notebookcheck.net/AnTuTu-V12-public-beta-arrives-with-major-changes-to-how-phones-are-benchmarked.1389282.0.html",
      "supports": "La V12 cambia CPU, GPU, memoria y UX, y sus resultados no se comparan directamente con versiones anteriores."
    },
    {
      "label": "Gigazine: AnTuTu y sus cuatro bloques",
      "url": "https://gigazine.net/gsc_news/en/20251109-antutu-benchmark-for-android",
      "supports": "La puntuación total es la suma de CPU, GPU, MEM y UX; MEM mide latencia de RAM y velocidad de almacenamiento."
    },
    {
      "label": "Android Developers: modo de rendimiento fijo",
      "url": "https://developer.android.com/games/optimize/adpf/fixed-performance-mode",
      "supports": "Android cambia las frecuencias de CPU y GPU según la carga; sin frecuencias fijas las mediciones no son fiables. Leído directamente el 27/11/2026."
    },
    {
      "label": "UL Benchmarks: pantalla de resultados de las pruebas de estrés",
      "url": "https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen",
      "supports": "Define la estabilidad como el promedio del peor ciclo dividido por el del mejor, y fija el aprobado en el 97 %."
    },
    {
      "label": "Tom's Guide: Geekbench retira al OnePlus 9 de su tabla",
      "url": "https://www.tomsguide.com/news/oneplus-9-just-got-delisted-from-geekbench-and-oneplus-responds",
      "supports": "Caso de 2021: el sistema limitaba apps populares pero no las de benchmark."
    },
    {
      "label": "Android Authority: Geekbench retira modelos Galaxy por GOS",
      "url": "https://www.androidauthority.com/geekbench-delists-samsung-flagships-3129230/",
      "supports": "Caso de 2022: el Game Optimizing Service de Samsung exceptuaba las apps de benchmark de su limitación."
    }
  ],
  "related": ["36-juego-pierde-fps", "37-mismo-procesador", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## Qué mide realmente AnTuTu

AnTuTu ejecuta varias pruebas y suma cuatro bloques: **CPU**, **GPU**, **MEM** (memoria y almacenamiento) y **UX** (fluidez de la interfaz). El resultado es una sola cifra que resume potencia en tareas muy distintas. Para un juego, el bloque que más se parece a su carga es el gráfico, pero queda mezclado con la velocidad del almacenamiento o de la interfaz.

Por eso dos teléfonos con la misma puntuación total pueden tener reparto distinto: uno más fuerte en GPU y otro en almacenamiento. Para jugar, mira el desglose y no solo el total.

## Tres razones por las que la cifra no se traduce en FPS

**1. Es una medición corta.** Una pasada de benchmark dura poco. Una partida de Fortnite o Free Fire dura muchos minutos y el teléfono se calienta. La documentación de Android explica que las frecuencias de CPU y GPU cambian según la carga y la temperatura; por eso Google recomienda fijarlas para medir con fiabilidad. Un pico de potencia no informa de cuánto se mantiene.

**2. Cada versión es una escala distinta.** AnTuTu reconoció que la V10 da más puntos que la V9 al mismo dispositivo, y la V12 cambió las cuatro áreas de prueba. Comparar un «1,5 millones» de una versión con un «1,2 millones» de otra no tiene sentido.

**3. Los fabricantes saben cuándo se mide.** En 2021 y 2022 Geekbench retiró de su tabla modelos de OnePlus y de Samsung porque el sistema limitaba aplicaciones comunes, incluidos juegos en el caso de Samsung, pero dejaba las apps de benchmark a máxima potencia. Una puntuación de laboratorio puede no reflejar lo que recibe tu juego.

## Qué mirar si lo que quieres es jugar

- **Estabilidad, no solo pico.** Las pruebas de estrés repiten el mismo escenario muchas veces. UL (3DMark) calcula la estabilidad dividiendo el peor ciclo entre el mejor; por debajo del 97 % considera que el rendimiento cae durante la prueba.
- **Misma versión del test.** Si comparas puntuaciones, que sean de la misma versión y, si es posible, del mismo medio.
- **Mediciones del juego que te interesa,** con método publicado: duración de la sesión, ajustes gráficos, temperatura ambiente.
- **Requisitos oficiales del juego.** Cumplirlos indica que el juego puede ejecutarse; no garantiza una cifra de FPS.

## Lo que todavía no sabemos

No hay una fórmula pública que convierta puntos de AnTuTu en FPS de un juego, y no la inventaremos. Una línea de trabajo futura de Vélix es comparar benchmarks sintéticos con sesiones reales de juego en los mismos dispositivos, con un método reproducible. Mientras no lo hagamos, ninguna tabla de este sitio presentará esa relación como medida.

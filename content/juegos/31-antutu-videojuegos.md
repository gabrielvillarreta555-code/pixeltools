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
  "status": "published",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Análisis documental. No hemos ejecutado AnTuTu ni juegos en teléfonos para este artículo. La documentación de Android se leyó directamente el 27/11/2026; la nota oficial de AnTuTu y la página de UL se revisaron mediante consulta asistida (ChatGPT), pendiente de revisión humana.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "AnTuTu: nota de la versión V10 (25/05/2023)",
      "url": "https://www.antutu.com/en/doc/129591.htm",
      "supports": "La V10 evalúa CPU, GPU, MEM y UX; usa escenas creadas con Unreal Engine y la API Vulkan; reconoce que la latencia de memoria puede afectar a la fluidez de los juegos; las puntuaciones de V9 y V10 no son directamente comparables y la V10 suele dar más puntos al mismo teléfono. Consulta asistida (ChatGPT) del 27/11/2026, pendiente de revisión humana."
    },
    {
      "label": "Android Developers: Game Mode API",
      "url": "https://developer.android.com/games/gamemode/gamemode-api",
      "supports": "El usuario puede elegir un modo por juego y el fabricante puede aplicar intervenciones sin consultar al estudio. Leído directamente el 27/11/2026."
    },
    {
      "label": "Android Developers: modo de rendimiento fijo",
      "url": "https://developer.android.com/games/optimize/adpf/fixed-performance-mode",
      "supports": "Android cambia las frecuencias de CPU y GPU según la carga; sin frecuencias fijas las mediciones no son fiables. Leído directamente el 27/11/2026."
    },
    {
      "label": "UL Benchmarks: pantalla de resultados de las pruebas de estrés",
      "url": "https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen",
      "supports": "Define la estabilidad como el FPS medio del peor ciclo dividido entre el del mejor, multiplicado por 100. El umbral de aprobado del 97 % que publica corresponde a la prueba de estrés de PC descrita en esa página. Consulta asistida (ChatGPT) del 27/11/2026."
    }
  ],
  "related": ["36-juego-pierde-fps", "37-mismo-procesador", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## Qué mide realmente AnTuTu

Según su documentación oficial de la versión 10, AnTuTu evalúa cuatro áreas:

| Bloque | Qué evalúa |
|---|---|
| **CPU** | Procesamiento y ejecución de algoritmos |
| **GPU** | Rendimiento gráfico con escenas 3D creadas con Unreal Engine sobre la API Vulkan |
| **MEM** | Memoria y almacenamiento: ancho de banda y latencia |
| **UX** | Experiencia de uso y procesamiento multimedia |

El resultado se presenta como una sola cifra que resume tareas muy distintas. Para un juego, el bloque que más se parece a su carga es el gráfico, aunque AnTuTu también reconoce que la latencia de la memoria puede afectar a la fluidez de los juegos.

Por eso dos teléfonos con la misma puntuación total pueden tener reparto distinto: uno más fuerte en GPU y otro en almacenamiento. Para jugar, mira el desglose y no solo el total.

## Tres razones por las que la cifra no se traduce en FPS

**1. Es una medición corta.** Una pasada de benchmark dura poco. Una partida de Fortnite o Free Fire dura muchos minutos y el teléfono se calienta. La documentación de Android explica que las frecuencias de CPU y GPU cambian según la carga y la temperatura; por eso Google recomienda fijarlas para medir con fiabilidad. Un pico de potencia no informa de cuánto se mantiene.

**2. Cada versión es una escala distinta.** El propio desarrollador advierte que las puntuaciones de la V9 y la V10 no son directamente comparables: la V10 suele dar más puntos al mismo teléfono por los cambios en sus pruebas. Comparar un «1,5 millones» de una versión con un «1,2 millones» de otra no tiene sentido.

**3. El sistema no trata igual a todas las apps.** La documentación de Android permite que el fabricante aplique ajustes propios a cada juego (las «intervenciones» de Game Mode) sin consultar al estudio, y que el usuario elija un modo de rendimiento o de batería por juego. Un benchmark y un juego pueden ejecutarse, en el mismo teléfono, con perfiles distintos. Una puntuación de laboratorio no garantiza lo que recibe tu juego.

```flujo
# De la puntuación a la partida: lo que cambia por el camino
Benchmark | Pruebas de duración limitada de CPU, GPU, memoria e interfaz.
Versión | La escala cambia entre versiones: V9 y V10 no se comparan.
Perfil del sistema | El fabricante y el modo de juego pueden ajustar cada app.
Calor | En sesiones largas, el teléfono reduce la potencia para protegerse.
Juego | Sus ajustes gráficos y su API gráfica también cuentan.
```

## Qué mirar si lo que quieres es jugar

- **Estabilidad, no solo pico.** Las pruebas de estrés repiten el mismo escenario muchas veces. UL (3DMark) calcula la estabilidad dividiendo los FPS del peor ciclo entre los del mejor. Cuanto más cerca del 100 %, menos cae el rendimiento durante la prueba. UL publica un umbral de aprobado para su prueba de PC; no lo aplicamos a teléfonos.
- **Misma versión del test.** Si comparas puntuaciones, que sean de la misma versión y, si es posible, del mismo medio.
- **Mediciones del juego que te interesa,** con método publicado: duración de la sesión, ajustes gráficos, temperatura ambiente.
- **Requisitos oficiales del juego.** Cumplirlos indica que el juego puede ejecutarse; no garantiza una cifra de FPS.

## Lo que todavía no sabemos

No hay una fórmula pública que convierta puntos de AnTuTu en FPS de un juego, y no la inventaremos. Una línea de trabajo futura de Vélix es comparar benchmarks sintéticos con sesiones reales de juego en los mismos dispositivos, con un método reproducible. Mientras no lo hagamos, ninguna tabla de este sitio presentará esa relación como medida.

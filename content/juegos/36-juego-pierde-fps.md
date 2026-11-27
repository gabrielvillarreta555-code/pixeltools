---
{
  "id": "36-juego-pierde-fps",
  "section": "rendimiento",
  "games": ["Free Fire", "Fortnite", "Roblox", "Minecraft"],
  "slug": "juego-pierde-fps-despues-de-minutos",
  "title": "¿Por qué un juego pierde FPS después de varios minutos?",
  "description": "El límite térmico explica por qué una partida empieza fluida y se vuelve lenta. Qué dice Android, qué recomienda Garena y qué puedes cambiar hoy.",
  "answer": "Casi siempre por calor. El teléfono solo puede mantener su máxima potencia durante un tiempo; cuando se acerca a su límite de temperatura, baja las frecuencias del procesador y de la gráfica para protegerse, y el juego pierde FPS. Bajar gráficos o el límite de FPS, no jugar mientras carga y evitar fuentes de calor suele dar una partida más estable.",
  "reviewedAt": "2026-11-27",
  "publishedAt": "2026-11-27",
  "status": "draft",
  "kind": "guia",
  "scope": "La documentación de Android se leyó directamente el 27/11/2026. La página de Garena y las mediciones de prensa se consultaron mediante extractos de buscador y requieren lectura directa antes de publicar. No hemos medido temperaturas ni FPS para este artículo.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: Thermal API (ADPF)",
      "url": "https://developer.android.com/games/optimize/adpf/thermal",
      "supports": "Los dispositivos solo mantienen el máximo rendimiento durante un tiempo limitado antes del límite térmico; el resultado depende del clima, el uso reciente y el diseño térmico. Actualizada el 26/02/2026."
    },
    {
      "label": "Android Developers: ADPF",
      "url": "https://developer.android.com/games/optimize/adpf",
      "supports": "Los SoC móviles tienen comportamiento más dinámico que consolas y PC: estado térmico, frecuencias variables y distintos tipos de núcleo."
    },
    {
      "label": "Garena Free Fire: cómo evitar el sobrecalentamiento",
      "url": "https://ffsupport.garena.com/hc/en-us/articles/4412913797146-How-to-Avoid-Device-Overheating",
      "supports": "Recomendaciones oficiales: bajar gráficos, no jugar mientras se carga, evitar el sol directo y no sobrecargar el dispositivo."
    },
    {
      "label": "UL Benchmarks: resultados de las pruebas de estrés",
      "url": "https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen",
      "supports": "La estabilidad compara el peor ciclo con el mejor; el umbral de aprobado es 97 %."
    },
    {
      "label": "Notebookcheck: Snapdragon 8 Gen 1 en Xiaomi 12 Pro y OnePlus 10 Pro",
      "url": "https://www.notebookcheck.net/Xiaomi-12-Pro-OnePlus-10-Pro-and-their-Snapdragon-8-Gen-1-SoCs-fail-to-impress-in-performance-tests.596914.0.html",
      "supports": "Medición independiente: el OnePlus 10 Pro perdió cerca del 37 % de rendimiento a lo largo de la prueba."
    }
  ],
  "related": ["37-mismo-procesador", "38-camara-de-vapor", "05-free-fire-fallos"],
  "featured": false
}
---

## Lo que pasa dentro del teléfono

La documentación de Android para desarrolladores lo explica sin rodeos: los dispositivos **solo pueden mantener un nivel alto de rendimiento durante un tiempo limitado** antes de que el sistema reduzca la potencia por temperatura (*thermal throttling*). Cuánto dura ese tiempo depende del clima, del uso reciente y del diseño térmico de cada modelo.

```flujo
# Por qué la partida empieza bien y termina lenta
Inicio de la partida | El procesador y la gráfica trabajan a frecuencias altas: los FPS son altos.
El calor se acumula | El chip produce calor más rápido de lo que el teléfono lo disipa.
Límite térmico | El sistema reduce las frecuencias para proteger el chip y la batería.
Menos FPS | El juego recibe menos potencia; aparecen caídas y tirones.
Equilibrio | El teléfono se estabiliza en un nivel sostenible, más bajo que el inicial.
```

No es un defecto en sí mismo: es una protección. Lo que cambia de un modelo a otro es **cuánto cae** y **cuándo**.

## ¿Cuánto puede caer?

Las pruebas de estrés de prensa repiten la misma carga gráfica muchas veces para verlo. Notebookcheck midió que un OnePlus 10 Pro perdió alrededor del 37 % de su rendimiento a lo largo de la prueba. Es una prueba sintética, no un juego concreto, pero muestra el orden de magnitud posible. UL, creadora de 3DMark, considera estable un resultado cuando el peor ciclo conserva al menos el 97 % del mejor.

## Qué recomienda un desarrollador de juegos

Garena publica en su centro de ayuda de Free Fire una guía para evitar el sobrecalentamiento. Entre sus recomendaciones:

- **Bajar los gráficos**: con gráficos bajos se puede jugar más tiempo sin calentamiento.
- **No jugar mientras el teléfono se carga.**
- **Evitar la luz solar directa.**
- **No sobrecargar el dispositivo** con otras tareas.

## Lista de comprobación

1. **Limita los FPS** dentro del juego a una cifra que tu teléfono mantenga. Una tasa estable se siente mejor que picos altos con caídas.
2. **Baja la calidad gráfica** un nivel antes que la resolución, si el juego lo permite.
3. **No cargues** mientras juegas. La carga también genera calor.
4. **Quita la funda** en sesiones largas si notas que el teléfono se calienta. Es una recomendación de sentido común, no de Garena.
5. **Haz pausas.** Si el teléfono está caliente al tacto, el sistema ya está limitando la potencia.
6. **Revisa el brillo.** La pantalla también consume energía y genera calor.

## Cuándo no es el calor

Si los FPS caen desde el primer minuto, o el juego se congela y luego vuelve, la causa puede ser otra: falta de memoria, una descarga en segundo plano o la conexión. Para cierres y pantallas negras, revisa [las comprobaciones para fallos de Free Fire](/juegos/free-fire/se-cierra-pantalla-negra).

Vélix ha propuesto medir la relación entre temperatura y FPS con un método reproducible. No publicaremos cifras propias hasta realizar esa prueba.

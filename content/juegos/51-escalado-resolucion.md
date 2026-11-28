---
{
  "id": "51-escalado-resolucion",
  "section": "tecnologia",
  "games": ["Fortnite", "Roblox", "Minecraft", "Free Fire"],
  "slug": "escalado-resolucion-juegos-moviles",
  "title": "¿Qué es el escalado de resolución en los juegos móviles?",
  "description": "Por qué un juego puede dibujar menos píxeles de los que tiene tu pantalla y luego ampliarlos. MetalFX de Apple, las intervenciones de Android y qué ganas y pierdes.",
  "answer": "Es dibujar la imagen a una resolución menor que la de la pantalla y ampliarla después. Así la GPU trabaja menos, lo que puede dar más FPS, menos calor o más batería, a cambio de algo de nitidez. Apple ofrece a los juegos MetalFX, que amplía la imagen en menos tiempo del que costaría dibujarla a resolución completa. En Android, el fabricante puede aplicar a juegos que no se actualizan una reducción de resolución en los modos de rendimiento o batería.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Basado en documentación oficial de Apple y Android leída directamente el 28/11/2026. No hemos medido la diferencia de calidad ni de FPS en juegos concretos.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Apple Developer: MetalFX",
      "url": "https://developer.apple.com/documentation/metalfx",
      "supports": "MetalFX amplía una imagen de baja resolución a una resolución mayor en menos tiempo del que se tardaría en renderizar directamente a la resolución final; ofrece escalado espacial (solo color) y temporal con antialiasing (color, profundidad y movimiento). Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: intervenciones de Game Mode",
      "url": "https://developer.android.com/games/optimize/adpf/gamemode/gamemode-interventions",
      "supports": "Intervenciones definidas por los fabricantes para juegos que ya no se actualizan, como la reducción de resolución por modo (ejemplo: 0,9 en rendimiento y 0,5 en ahorro de batería); requiere reiniciar el juego; puede reducir el consumo si el juego mantiene un ritmo fijo y dar más FPS a un juego limitado por la GPU; el juego puede excluirse. Actualizada el 26/02/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: Thermal API",
      "url": "https://developer.android.com/games/optimize/adpf/thermal",
      "supports": "La resolución del framebuffer es uno de los parámetros que un motor puede reducir para no sobrecalentar el teléfono. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["42-como-funciona-gpu-telefono", "33-modo-juego-android", "41-120-hz-30-fps"],
  "featured": false
}
---

## Menos píxeles para la GPU

Cada fotograma de un juego exige a la GPU calcular el color de cada píxel. Si el juego dibuja la escena a una resolución menor que la de la pantalla y luego la amplía, la GPU tiene menos trabajo. La documentación de Android cita la **resolución del framebuffer** entre los parámetros que un motor de juego puede bajar cuando el teléfono se acerca a su límite térmico.

```flujo
# Escalado de resolución, paso a paso
Renderizar más pequeño | El juego dibuja la escena con menos píxeles que la pantalla.
Ampliar | Un algoritmo lleva la imagen a la resolución de la pantalla.
Mostrar | Ves la imagen a pantalla completa, con algo menos de detalle.
Usar el margen | La GPU ahorrada puede dar más FPS, menos calor o más batería.
```

## Dos formas de ampliar según Apple

Apple ofrece a los juegos **MetalFX**, que amplía la imagen **en menos tiempo del que costaría dibujarla directamente a la resolución final**. Tiene dos modos:

| Modo | Qué necesita el juego | Idea |
|---|---|---|
| **Espacial** | Solo el color de los píxeles | Amplía la imagen a partir de su color |
| **Temporal con antialiasing** | Color, profundidad y movimiento de cada píxel | Usa también la profundidad y el movimiento, y suaviza los bordes |

Apple sugiere usar el tiempo de GPU ahorrado para mejorar el juego, por ejemplo añadiendo efectos o detalle.

## Lo que puede hacer Android sin que el juego lo pida

En Android, los fabricantes pueden aplicar **intervenciones** a juegos que ya no reciben actualizaciones. Una de ellas es reducir la resolución según el modo de juego que elijas. La documentación de Google pone como ejemplo:

| Modo de juego | Factor de resolución del ejemplo | Equivale a |
|---|---|---|
| Rendimiento | 0,9 | 90 % de la resolución |
| Ahorro de batería | 0,5 | 50 % de la resolución |

Google añade dos matices: el cambio **requiere reiniciar el juego**, y su efecto depende de cómo funcione el juego. Si mantiene un ritmo de fotogramas fijo, el ahorro se nota sobre todo en la batería; si estaba limitado por la GPU, puede subir de FPS. Los estudios pueden excluir sus juegos de estas intervenciones. Lo explicamos en [qué hace realmente el modo juego de Android](/rendimiento/modo-juego-android-como-funciona).

## ¿Merece la pena?

- **Si tu juego tiene una opción de resolución o de escala,** bajarla un paso es una prueba razonable para ganar estabilidad antes de quitar todos los efectos.
- **Si la imagen se ve borrosa** tras activar el modo de ahorro de batería, puede ser una reducción de resolución aplicada por el sistema.
- **La nitidez tiene un coste.** Más píxeles significan más trabajo para la GPU, como explicamos en [cómo funciona la GPU de un teléfono](/tecnologia/como-funciona-gpu-telefono).

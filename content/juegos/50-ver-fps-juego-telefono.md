---
{
  "id": "50-ver-fps-juego-telefono",
  "section": "rendimiento",
  "games": ["Fortnite", "Free Fire", "Roblox", "Minecraft"],
  "slug": "ver-fps-juego-telefono",
  "title": "¿Cómo ver los FPS de un juego en el teléfono?",
  "description": "El contador de Game Dashboard en los Pixel, las herramientas de los fabricantes y por qué en iPhone el monitor de Apple es solo para desarrolladores. Y qué mirar además de la cifra.",
  "answer": "En los Google Pixel con Android 12 o superior, Game Dashboard incluye un contador de FPS en tiempo real. En otros Android depende de la herramienta de juego de cada fabricante, si la incluye. En iPhone, el monitor de rendimiento de Apple (Metal Performance HUD) solo aparece en apps que el propio desarrollador compila e instala, no en juegos descargados de la App Store. Algunos juegos muestran sus propios FPS en sus ajustes.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "guia",
  "scope": "Basado en documentación oficial de Android y Apple leída directamente el 28/11/2026. No documentamos aplicaciones de terceros para medir FPS.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: Game Dashboard",
      "url": "https://developer.android.com/games/gamedashboard/aboutdashboard",
      "supports": "Superposición con contador de FPS en tiempo real, capturas, grabación, No molestar y Game Mode; disponible en todos los Pixel con Android 12 o superior; otros fabricantes pueden quitarlo o sustituirlo por aplicaciones similares. Actualizada el 26/02/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Apple Developer: supervisar el rendimiento gráfico con Metal Performance HUD",
      "url": "https://developer.apple.com/documentation/xcode/monitoring-your-metal-apps-graphics-performance",
      "supports": "El HUD muestra FPS medios, tiempo de GPU e intervalo entre fotogramas de los últimos 120 fotogramas; en iOS se activa en los ajustes de Desarrollador y aparece en las apps que el usuario compila e instala en sus dispositivos de desarrollo, que necesitan un perfil de aprovisionamiento de desarrollo. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: biblioteca Frame Pacing",
      "url": "https://developer.android.com/games/sdk/frame-pacing",
      "supports": "Un juego a 30 FPS sin sincronizar puede mostrar fotogramas de 49, 16 y 33 ms; los tiempos irregulares empeoran la experiencia. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: renderizado lento",
      "url": "https://developer.android.com/topic/performance/vitals/render",
      "supports": "Para alcanzar 60 FPS, cada fotograma debe generarse en menos de 16 ms; los fotogramas que tardan más producen tirones (jank). Leído directamente el 28/11/2026."
    }
  ],
  "related": ["41-120-hz-30-fps", "33-modo-juego-android", "36-juego-pierde-fps"],
  "featured": false
}
---

## Según tu teléfono

| Teléfono | Herramienta oficial | Disponible para jugadores |
|---|---|---|
| **Google Pixel** con Android 12 o superior | **Game Dashboard**, con contador de FPS en tiempo real | **Sí** |
| **Otros Android** | Herramienta de juego del fabricante, si existe | Depende de la marca: Google indica que otros fabricantes pueden quitar Game Dashboard o sustituirlo por aplicaciones similares |
| **iPhone y iPad** | **Metal Performance HUD** de Apple | **No para juegos de la App Store**: solo aparece en apps que el desarrollador compila e instala en un dispositivo de desarrollo |

En cualquier teléfono, revisa también los **ajustes del propio juego**: si el estudio incluye un contador de FPS o un medidor de rendimiento, es la forma más directa de verlo.

## Qué mirar además de la cifra

Un número de FPS es una media. Lo que notas al jugar es **cuánto tarda cada fotograma**:

| FPS objetivo | Tiempo máximo por fotograma |
|---|---|
| 30 FPS | 33,3 ms |
| 60 FPS | 16,7 ms |
| 90 FPS | 11,1 ms |
| 120 FPS | 8,3 ms |

Android lo explica con un ejemplo: un juego a 30 FPS mal sincronizado con la pantalla puede mostrar fotogramas de **49, 16 y 33 ms** seguidos. La media parece correcta, pero se perciben tirones. Por eso el monitor de Apple, pensado para desarrolladores, no solo enseña los FPS medios: también dibuja un gráfico con el intervalo entre los últimos 120 fotogramas.

```flujo
# Cómo interpretar lo que ves (guía orientativa de Vélix)
FPS estables y altos | El teléfono va sobrado con esos ajustes.
FPS estables pero bajos | La potencia limita: baja la calidad gráfica.
FPS que caen con el tiempo | Probablemente calor: revisa la temperatura.
FPS altos con tirones | El problema es el ritmo: prueba un límite de FPS más bajo.
```

Para cada caso tienes una explicación más detallada en [por qué un teléfono de 120 Hz puede ejecutar un juego a 30 FPS](/rendimiento/120-hz-juego-30-fps) y [por qué un juego pierde FPS después de varios minutos](/rendimiento/juego-pierde-fps-despues-de-minutos).

## Precaución con las apps de terceros

Hay aplicaciones que prometen mostrar FPS en cualquier juego. No las documentamos en este artículo: no hemos verificado cómo miden ni qué permisos piden. Si usas una, revisa los permisos que solicita antes de instalarla.

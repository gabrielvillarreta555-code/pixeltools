---
{
  "id": "49-iphone-se-calienta-jugando",
  "section": "rendimiento",
  "games": ["Fortnite", "Roblox", "Minecraft", "Free Fire"],
  "slug": "iphone-se-calienta-jugando",
  "title": "¿Qué hace un iPhone cuando se calienta jugando?",
  "description": "Los cuatro estados térmicos de iOS explicados con la documentación de Apple: cuándo baja el rendimiento, qué pide Apple a los juegos y qué puedes hacer tú.",
  "answer": "iOS clasifica la temperatura en cuatro estados: normal, ligeramente elevada, alta y crítica. A partir del estado alto, Apple indica que el sistema toma medidas que reducen el rendimiento, y pide a los juegos que bajen su carga, por ejemplo pasando de 60 a 30 FPS o usando texturas de menor resolución. Por eso un juego puede verse peor o ir más lento tras un rato de partida.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "guia",
  "scope": "Basado en la documentación oficial de Apple para desarrolladores, leída directamente el 28/11/2026. Apple no publica a qué temperatura exacta cambia cada estado; no hemos medido temperaturas.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Apple Developer: ProcessInfo.ThermalState",
      "url": "https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum",
      "supports": "Estados térmicos del sistema: nominal, fair, serious y critical. Leído directamente el 28/11/2026."
    },
    {
      "label": "Apple Developer: estado térmico «serious»",
      "url": "https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/serious",
      "supports": "El estado térmico es alto y el sistema toma medidas moderadas que reducen el rendimiento; Apple recomienda reducir el uso de CPU y GPU, bajar la tasa de fotogramas de 60 a 30 FPS y usar menos partículas o texturas de menor resolución. Leído directamente el 28/11/2026."
    },
    {
      "label": "Apple Developer: estado térmico «critical»",
      "url": "https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/critical",
      "supports": "El estado térmico afecta significativamente al rendimiento y el dispositivo necesita enfriarse; Apple recomienda reducir CPU, GPU y E/S al mínimo necesario. Leído directamente el 28/11/2026."
    },
    {
      "label": "Apple Developer: estado térmico «fair»",
      "url": "https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum/fair",
      "supports": "El estado térmico está ligeramente elevado y el sistema detiene servicios en segundo plano que no son inmediatamente necesarios. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["36-juego-pierde-fps", "39-juegos-mejor-iphone", "41-120-hz-30-fps"],
  "featured": false
}
---

## Los cuatro estados térmicos de iOS

Apple define cuatro estados térmicos que el sistema comunica a las apps. Su documentación es compartida entre iPhone, iPad y Mac; algunas frases, como las referidas a ventiladores, solo se aplican a equipos que los tienen.

| Estado (nombre técnico) | Qué significa según Apple | Qué hace el sistema | Qué pide Apple a las apps |
|---|---|---|---|
| **Normal** (*nominal*) | Dentro de los límites normales | — | — |
| **Ligeramente elevado** (*fair*) | Temperatura algo alta | Detiene servicios en segundo plano que no son inmediatamente necesarios | Aplazar trabajo en segundo plano |
| **Alto** (*serious*) | Temperatura alta | Toma medidas moderadas que **reducen el rendimiento** | Reducir CPU y GPU, bajar de **60 a 30 FPS**, usar menos partículas o texturas de menor resolución |
| **Crítico** (*critical*) | Afecta significativamente al rendimiento; el dispositivo necesita enfriarse | Toma medidas significativas | Reducir CPU, GPU y comunicaciones al mínimo necesario |

```flujo
# Una partida larga en un iPhone
Normal | El juego funciona con su calidad y FPS habituales.
Ligeramente elevado | iOS frena tareas en segundo plano.
Alto | El sistema reduce el rendimiento; el juego puede bajar FPS o calidad.
Crítico | El rendimiento cae mucho hasta que el iPhone se enfría.
```

## Por qué el juego se ve peor tras un rato

Apple recomienda a los juegos que, en el estado alto, **reduzcan su tasa de fotogramas de 60 a 30 FPS** o usen **texturas de menor resolución**. Si notas que la imagen se vuelve menos nítida o el juego va a 30 FPS después de varios minutos, puede ser el propio juego aplicando esa recomendación para no empeorar la temperatura.

Es el mismo principio que explicamos para Android en [por qué un juego pierde FPS después de varios minutos](/rendimiento/juego-pierde-fps-despues-de-minutos): el teléfono solo mantiene su máximo rendimiento durante un tiempo limitado.

## Lo que Apple no publica

Apple no indica a qué temperatura exacta se pasa de un estado a otro ni cuánto baja el rendimiento en cada uno. No vamos a inventar esas cifras.

## Qué puedes hacer

- **Baja la calidad gráfica o el límite de FPS** en sesiones largas: reduces calor desde el principio.
- **Haz pausas** si el iPhone está caliente al tacto.
- **Aplaza las descargas grandes** y otras tareas pesadas mientras juegas: Apple pide a las apps reducir el trabajo en segundo plano cuando sube la temperatura.

Si quieres entender por qué algunos juegos van mejor en iPhone que en Android, lo analizamos en [este artículo](/tecnologia/por-que-juegos-funcionan-mejor-iphone).

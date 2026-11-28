---
{
  "id": "46-juegos-android-en-pc",
  "section": "tecnologia",
  "games": ["Juegos de Google Play"],
  "slug": "juegos-android-en-pc-google-play-games",
  "title": "¿Puedo jugar juegos de Android en el PC de forma oficial?",
  "description": "Google Play Games on PC lleva una selección de juegos de Android a Windows. Qué exige Google a esos juegos, qué rendimiento promete y qué no sabemos de los requisitos del PC.",
  "answer": "Sí, con Google Play Games on PC, pero solo con los juegos que cada estudio adapta y publica para esa plataforma, no con cualquier app de Android. Google exige a esos juegos un mínimo de 30 FPS estables en un PC de gama baja de referencia y 60 FPS en uno de gama alta, y sin cierres en más de 20 minutos de partida. La disponibilidad depende del país, del equipo y de la cuenta.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Basado en la documentación oficial de Google para desarrolladores, leída directamente el 28/11/2026. Los requisitos mínimos del PC para jugadores están en el Centro de ayuda de Google, que no hemos podido consultar desde nuestro entorno. No hemos probado la plataforma.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: Google Play Games on PC",
      "url": "https://developer.android.com/games/playgames/overview",
      "supports": "Disponible en más de 120 países desde el 13/07/2023, sujeto a la elegibilidad del dispositivo y la cuenta; resolución de hasta 4K; experiencia limitada en PC que no cumplen los requisitos mínimos; reasignación de teclado; selección de juegos móviles. Actualizada el 13/10/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: primeros pasos con Google Play Games on PC",
      "url": "https://developer.android.com/games/playgames/start",
      "supports": "Requisitos de jugabilidad: 30 FPS estables en un PC de gama baja (CPU de cuatro núcleos con 8 hilos, GPU integrada como Intel Iris Xe) y 60 FPS en uno de gama alta (8 núcleos con 16 hilos, GPU dedicada como GeForce RTX 3060); sin cierres en más de 20 minutos; juegos ARM o x86-64, con x86-64 recomendado. Actualizada el 28/11/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: compatibilidad y optimización para PC",
      "url": "https://developer.android.com/games/playgames/pc-compatibility",
      "supports": "Los juegos deben adaptar su interfaz, desactivar funciones y permisos de Android no compatibles y tienen requisitos de gráficos, controles y juego entre dispositivos. Actualizada el 18/11/2026. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["47-mando-telefono", "43-vulkan-opengl-es", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## No es un emulador para cualquier app

Google Play Games on PC es la plataforma oficial de Google para jugar en Windows a **una selección de juegos móviles**. No instala cualquier app de Android: cada estudio adapta su juego y lo envía a Google, que comprueba que cumple una serie de requisitos antes de publicarlo.

Según la documentación de Google, entre esas adaptaciones están ajustar la interfaz a pantallas grandes, quitar funciones y permisos de Android que el PC no tiene, y dar soporte a teclado y ratón. La plataforma permite además reasignar teclas y elegir resoluciones de hasta 4K en los juegos compatibles.

## Qué rendimiento exige Google a los juegos

Para aprobar un juego, Google lo prueba en dos tipos de PC de referencia:

| | PC de gama baja de referencia | PC de gama alta de referencia |
|---|---|---|
| Procesador | Cuatro núcleos con *hyperthreading* (8 hilos) | Ocho núcleos con *hyperthreading* (16 hilos) |
| Gráfica | Integrada, por ejemplo Intel Iris Xe | Dedicada, por ejemplo GeForce RTX 3060 |
| FPS exigidos al juego | **30 FPS estables** | **60 FPS estables** |
| Estabilidad | Sin cierres en más de 20 minutos seguidos | Igual |

Estos equipos sirven para **certificar juegos**, no son los requisitos mínimos para jugar. Google remite los requisitos mínimos del PC a su Centro de ayuda, que no hemos podido consultar. Si tu PC no los cumple, la documentación indica que la experiencia será limitada.

## ARM y x86: por qué importa

Un juego de Android puede estar compilado para procesadores ARM o x86-64. Google admite juegos de cualquiera de las dos arquitecturas en la plataforma, pero recomienda a los estudios incluir una versión x86-64 siempre que puedan. Los juegos solo ARM también se certifican si cumplen los requisitos de rendimiento y estabilidad.

```flujo
# Cómo llega un juego de Android al PC
El estudio adapta el juego | Interfaz, teclado y ratón, funciones no compatibles.
Google lo certifica | 30 FPS en gama baja, 60 en gama alta, sin cierres en 20 minutos.
Se publica en la plataforma | Solo en los países disponibles.
Tú lo instalas | Si tu equipo y tu cuenta son elegibles.
```

## Lo que conviene saber antes de instalar

- **Disponibilidad:** Google indicaba más de 120 países el 13 de julio de 2023, siempre sujeto a la elegibilidad del equipo y de la cuenta. Comprueba la situación de tu país en la página oficial de la plataforma.
- **Catálogo:** solo están los juegos que sus estudios han publicado allí. Que un juego exista en Android no significa que esté en PC.
- **Mandos:** si prefieres jugar con mando en el propio teléfono, lo explicamos en [cómo usar un mando de PlayStation o Xbox en el teléfono](/tecnologia/mando-playstation-xbox-telefono).

---
{
  "id": "47-mando-telefono",
  "section": "tecnologia",
  "games": ["Juegos de Android e iOS con soporte para mando"],
  "slug": "mando-playstation-xbox-telefono",
  "title": "¿Puedo usar un mando de PlayStation o Xbox para jugar en el teléfono?",
  "description": "Android y iOS admiten mandos populares, pero cada juego decide si los usa. Qué documentan Google y Apple, qué funciones avanzadas existen y cómo saber si tu juego es compatible.",
  "answer": "Sí, si el juego lo admite. Android reconoce mandos desde hace años con una asignación estándar de botones, y Apple documenta compatibilidad con DualShock 4, DualSense y mandos de Xbox. Pero que el teléfono reconozca el mando no basta: el juego tiene que estar programado para usarlo. En Google Play, los juegos que lo admiten pueden aparecer señalados en su ficha.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "guia",
  "handsOn": false,
  "scope": "Basado en documentación oficial de Android y Apple para desarrolladores, leída directamente el 28/11/2026. No hemos probado mandos concretos con juegos concretos; la compatibilidad de cada juego la decide su estudio.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: compatibilidad con mandos de juego",
      "url": "https://developer.android.com/develop/ui/views/touch-and-input/game-controllers",
      "supports": "Android admite una gran variedad de mandos desde el nivel de API 9 (Android 2.3); asignación estándar de botones; varios mandos para multijugador local; panel táctil, vibración, barra de luz y acelerómetro; la ficha de Google Play puede indicar que un juego admite mando. Actualizada el 23/11/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Apple Developer: framework Game Controller",
      "url": "https://developer.apple.com/documentation/gamecontroller",
      "supports": "Los juegos pueden admitir mandos físicos o virtuales, incluidos DualShock 4, DualSense y mandos de Xbox, además de ratón, teclado, Siri Remote y volantes; el juego declara qué tipos admite; el usuario puede reasignar botones en Ajustes; vibración en mandos compatibles. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["46-juegos-android-en-pc", "33-modo-juego-android", "09-fortnite-a2f"],
  "featured": false
}
---

## Dos condiciones, no una

Para jugar con mando en el teléfono se tienen que cumplir dos cosas:

1. **Que el sistema reconozca el mando.** Android y iOS lo hacen con los mandos más populares.
2. **Que el juego esté programado para usarlo.** Es una decisión del estudio. Si el juego solo admite controles táctiles, el mando conectado no hará nada en la partida.

```flujo
# De conectar el mando a jugar con él
Conectas el mando | El sistema lo reconoce como mando de juego.
El juego lo detecta | Solo si el estudio ha programado soporte para mandos.
Asignación de botones | Android usa una asignación estándar; Apple ofrece un perfil por tipo de mando.
Funciones extra | Vibración, panel táctil o sensores, si el juego y el mando los admiten.
```

## Qué documenta cada sistema

| | Android | iPhone y iPad |
|---|---|---|
| Mandos citados en la documentación oficial | Una «gran variedad» de mandos populares, desde Android 2.3 | DualShock 4, DualSense y mandos de Xbox, además de teclado, ratón y volantes |
| Asignación de botones | Asignación estándar para simplificar la compatibilidad entre mandos | Perfiles que describen los botones de cada mando |
| Funciones avanzadas | Vibración, panel táctil, barra de luz, acelerómetro, varios mandos a la vez | Vibración en mandos compatibles |
| Reasignar botones | Depende del juego | El usuario puede reasignar botones en Ajustes, y el juego debe mostrar los botones correctos |

## Cómo saber si tu juego admite mando

- **En Google Play:** Google explica a los estudios cómo señalar en la ficha que su juego admite mando. Revisa la ficha del juego.
- **En el propio juego:** busca en sus ajustes una sección de mando o controles.
- **En el centro de ayuda del estudio:** suele ser la respuesta más fiable para un juego concreto.

## Consejos prácticos

- **Actualiza el sistema y el juego** antes de culpar al mando: la compatibilidad depende de ambos.
- **Si los botones no coinciden** con lo que muestra el juego, revisa si has reasignado botones en los ajustes del sistema (en iPhone y iPad es posible hacerlo).
- **Con varios mandos,** Android admite multijugador local, pero solo si el juego lo ofrece.
- **Si quieres jugar en una pantalla grande,** algunos juegos de Android están disponibles en PC de forma oficial. Lo explicamos en [¿Puedo jugar juegos de Android en el PC?](/tecnologia/juegos-android-en-pc-google-play-games).

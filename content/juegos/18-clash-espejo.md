---
{
  "id": "18-clash-espejo",
  "slug": "espejo-evolucionado-coste-elixir",
  "game": "clash-royale",
  "title": "El espejo evolucionado de Clash Royale: cómo aprovecharlo sin desperdiciar elixir",
  "description": "Calcula cuánto elixir cuesta jugar una carta y copiarla con el Espejo evolucionado. Cuatro ejemplos y consejos para atacar y defender en Clash Royale.",
  "answer": "Cuando está cargado, el Espejo puede copiar la última carta jugada en su forma evolucionada si existe, aunque esa carta no ocupe una ranura de evolución. La copia cuesta un elixir más que la carta original.",
  "kind": "estrategia",
  "cover": "sin-portada",
  "coverAlt": "Sin portada",
  "publishedAt": "2026-11-25",
  "reviewedAt": "2026-11-25",
  "byline": "Redacción Vélix",
  "status": "published",
  "scope": "Las combinaciones son hipótesis tácticas. No se han validado mediante partidas controladas ni estadísticas competitivas.",
  "featured": true,
  "sources": [
    {
      "label": "Supercell · New Season: King vs. King!",
      "url": "https://supercell.com/en/games/clashroyale/blog/release-notes/new-season-king-vs-king/",
      "supports": "Anuncio oficial y funcionamiento de la evolución del Espejo."
    },
    {
      "label": "RoyaleAPI · Mirror Evolution, noviembre de 2026",
      "url": "https://royaleapi.com/blog/mirror-evolution-november-2026",
      "supports": "Comportamiento del Espejo y ciclos de activación de su evolución."
    }
  ],
  "related": [
    "17-clash-balance",
    "19-clash-royaleapi",
    "15-clash-crown"
  ]
}
---

El Espejo evolucionado permite usar evoluciones de cartas que no ocupan una ranura de evolución en tu mazo. RoyaleAPI documenta que el Espejo necesita dos ciclos para cargar la evolución. Cuando está cargada, se activa al copiar una carta que tenga forma evolucionada.

## El problema matemático del Espejo

Cada copia cuesta un elixir más que la carta original. Si juegas una carta de coste **C** y después la copias, el gasto total es **2C + 1**.

```elixir-costes
Esqueletos | 1
Caballero | 3
Bombardero | 2
Gigante | 5
```

Copiar tropas económicas te deja más elixir para defender. En el caso del Gigante, el coste acumulado es de 11, por lo que tendrás que recuperar elixir entre ambas jugadas.

## Tres combinaciones que merece la pena probar

### Bombardero

Una opción económica para reforzar ataques terrestres. Su limitación principal continúa siendo la incapacidad de atacar unidades aéreas.

### Caballero

Puede utilizarse para fortalecer una defensa y transformar las tropas supervivientes en un contraataque.

### Barril de duendes

Permite plantear una segunda amenaza cuando el adversario acaba de gastar su hechizo defensivo.

El momento del ataque es más importante que copiar automáticamente la primera carta disponible.

## Cómo defenderse del Espejo evolucionado

Cuando el adversario utiliza el Espejo repetidamente, conviene identificar qué cartas está intentando duplicar. Guarda una respuesta defensiva para la segunda amenaza. Presionar el carril contrario también puede obligarlo a abandonar una combinación demasiado costosa.

## ¿Vale la pena desbloquearlo?

Puede resultar interesante para jugadores que disfrutan de mazos flexibles, económicos y difíciles de anticipar. Ocupa un espacio del mazo y exige administrar cuidadosamente el elixir, así que conviene valorar qué carta desplazaría y cómo cambiaría la defensa.

Para explorar alternativas, consulta [cómo comparar variantes de un mazo en RoyaleAPI](/juegos/clash-royale/royaleapi-variantes-mazos-clash-royale).

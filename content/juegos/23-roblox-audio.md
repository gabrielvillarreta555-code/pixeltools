---
{
  "id": "23-roblox-audio",
  "game": "roblox",
  "slug": "roblox-studio-simulacion-acustica-sounds",
  "kind": "noticia",
  "title": "Roblox Studio lleva la simulación acústica a Sound con una beta",
  "description": "Roblox Studio prueba Sounds Use Wiring para añadir oclusión, difracción y reflejos acústicos. Cómo activar la beta y detectar sonidos que se apagan de más.",
  "answer": "Roblox anunció el 24 de noviembre Sounds Use Wiring, una beta de Studio que permite aplicar simulación acústica a instancias Sound existentes.",
  "scope": "El anuncio corresponde a una beta de Studio. Su disponibilidad y sus efectos dependen de la configuración de cada proyecto.",
  "related": [
    "07-roblox-lag",
    "30-roblox-apelaciones"
  ],
  "status": "published",
  "publishedAt": "2026-11-25",
  "reviewedAt": "2026-11-25",
  "byline": "Redacción Vélix",
  "cover": "sin-portada",
  "coverAlt": "Sin portada",
  "featured": true,
  "sources": [
    {
      "label": "Roblox DevForum · Sounds Support Acoustic Simulation",
      "url": "https://devforum.roblox.com/t/studio-beta-sounds-support-acoustic-simulation-for-more-immersive-audio/5003368",
      "supports": "Anuncio, configuración, limitaciones y comentarios de creadores."
    },
    {
      "label": "Roblox Creator Hub · Referencia de SoundService",
      "url": "https://create.roblox.com/docs/reference/engine/classes/SoundService",
      "supports": "Propiedades del servicio de sonido y referencia para configurar el proyecto."
    }
  ],
  "eventDate": "2026-11-24"
}
---

Sounds Use Wiring acerca a los proyectos que usan instancias Sound efectos como la atenuación tras obstáculos y los reflejos en superficies. Roblox explica que la nueva arquitectura conecta esos sonidos con componentes de su API de audio sin exigir que cada creador rehaga el cableado a mano.

## Cómo activar y comparar la beta

En Roblox Studio, abre **File → Beta Features**, activa **Sounds Use Wiring** y habilita **AcousticSimulationEnabled** en **SoundService**. Prueba un sonido 3D que ya conozcas. Escúchalo de frente, detrás de una pared y al girar por una esquina. Mantén la misma posición y el mismo volumen inicial al repetir la prueba con la simulación desactivada.

## Qué revisar si un diálogo se oye demasiado bajo

Una pieza invisible puede bloquear audio por defecto. Revisa **AudioCanCollide** en las piezas situadas entre la fuente y el oyente antes de subir el volumen de todo el proyecto. Roblox también señala que el material físico puede diferir del acabado visual. Una revisión útil empieza por un recorrido pequeño y por voces o señales que el jugador necesita oír para actuar.

---
{
  "id": "27-minecraft-copia",
  "game": "minecraft",
  "slug": "copia-seguridad-mundo-java-snapshot",
  "kind": "guia",
  "title": "Cómo hacer una copia de tu mundo de Minecraft Java antes de una snapshot",
  "description": "Crea una copia de seguridad de Minecraft Java, localiza el ZIP y usa una instalación separada para probar una snapshot sin tocar tu partida principal.",
  "answer": "Crea la copia desde Un jugador → Editar → Hacer copia de seguridad, localiza el ZIP y conserva otra copia fuera de la carpeta del juego. Prueba la snapshot en una instalación separada.",
  "scope": "Guía para mundos locales de Minecraft Java Edition. Los nombres de los menús pueden variar con el idioma.",
  "related": [
    "21-minecraft-deep-freeze",
    "06-minecraft-ediciones"
  ],
  "status": "published",
  "publishedAt": "2026-11-25",
  "reviewedAt": "2026-11-25",
  "byline": "Redacción Vélix",
  "cover": "art-27-minecraft-copia-mundo",
  "coverAlt": "Teléfono con una copia de seguridad de un mundo en curso junto a un portátil con un paisaje de bloques",
  "featured": false,
  "sources": [
    {
      "label": "Minecraft Help · Save a Backup of Your Minecraft: Java Edition World",
      "url": "https://help.minecraft.net/hc/en-us/articles/40340122067085",
      "supports": "Procedimiento de copia desde el menú de edición del mundo."
    },
    {
      "label": "Minecraft Help · Change Game Versions",
      "url": "https://help.minecraft.net/hc/en-us/articles/360034754852-Changing-game-versions-",
      "supports": "Instalaciones por versión y riesgo de abrir un mundo con una versión anterior."
    },
    {
      "label": "Mojang · Notas de Deep Freeze",
      "url": "https://www.minecraft.net/en-us/article/minecraft-26-4-pre-release-1",
      "supports": "Instrucciones para habilitar snapshots y recomendación de separar los mundos de prueba."
    }
  ]
}
---

## Guarda el mundo antes de cambiar de versión

En tu instalación habitual de Java, sal del mundo y vuelve al menú de **Un jugador**. Selecciona el mundo, pulsa **Editar** y elige **Hacer copia de seguridad**. Desde la misma pantalla, abre la carpeta de copias y verifica la fecha del ZIP recién creado. Guarda otra copia en una ubicación distinta e identifica en el nombre la versión con la que jugabas.

## Crea una instalación para la prueba

En el Launcher, abre **Instalaciones**, activa **Snapshots** y crea una instalación con la versión de prueba que quieras usar. En **Directorio del juego**, señala una carpeta aparte. Arranca esa instalación y crea un mundo nuevo para comprobar que se guarda en la carpeta de prueba. Si necesitas ensayar con tu partida antigua, cierra el juego, extrae un duplicado del ZIP y coloca la carpeta que contiene **level.dat** en **saves** de la instalación de prueba.

## Cómo volver a la versión estable

Cierra la instalación de pruebas y vuelve a abrir la que usabas antes. Tu mundo principal debe continuar en su carpeta habitual. Si necesitas recuperar la copia, hazlo como mundo separado en la versión con la que se creó y conserva el original hasta comprobar que aparecen el inventario y el lugar en que guardaste. Abrir con una versión anterior un mundo ya guardado en una snapshot puede dañarlo.

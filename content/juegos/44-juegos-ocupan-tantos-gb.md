---
{
  "id": "44-juegos-ocupan-tantos-gb",
  "section": "rendimiento",
  "games": ["Free Fire", "Fortnite", "Roblox", "Minecraft", "Clash Royale"],
  "slug": "juegos-ocupan-tantos-gb-descargas-adicionales",
  "title": "¿Por qué los juegos móviles ocupan tantos GB y descargan más al abrirlos?",
  "description": "Texturas, sonidos y paquetes de recursos: cómo reparte Google Play las descargas de un juego, por qué el tamaño de la ficha no es el total y cuánto espacio reservar.",
  "answer": "Porque, además del código, incluyen muchos recursos: texturas, sonidos y otros archivos. Google Play permite a los estudios dividirlos en paquetes que se descargan al instalar, justo después o mientras juegas. Solo los primeros cuentan en el tamaño que muestra la ficha de la tienda; los demás llegan después y también ocupan espacio. Por eso un juego puede pedir más descarga al abrirlo por primera vez.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "guia",
  "scope": "Basado en documentación oficial de Google Play para desarrolladores, leída directamente el 28/11/2026. Cada juego decide cómo reparte sus descargas; no citamos tamaños de juegos concretos.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: Play Asset Delivery",
      "url": "https://developer.android.com/guide/playcore/asset-delivery",
      "supports": "Para juegos de más de 200 MB; paquetes de recursos con texturas, shaders y sonidos, sin código; modos install-time (cuenta en el tamaño de la ficha y el usuario no puede borrarlo), fast-follow (se descarga automáticamente tras instalar, sin abrir la app, y no cuenta en el tamaño de la ficha) y on-demand (mientras se usa la app); los dos últimos se descomprimen en el almacenamiento interno; actualizaciones con parches delta. Actualizada el 06/10/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: formatos de compresión de texturas",
      "url": "https://developer.android.com/guide/playcore/asset-delivery/texture-compression",
      "supports": "Las texturas comprimidas ocupan menos memoria y se cargan más rápido; cada GPU admite formatos distintos (ASTC en más del 80 % y ETC2 en más del 95 % de los dispositivos de Google Play) y Play puede entregar el formato adecuado a cada dispositivo. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: gestión de memoria",
      "url": "https://developer.android.com/topic/performance/memory-management",
      "supports": "RAM y almacenamiento son memorias distintas; el almacenamiento guarda los datos persistentes de las apps. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["45-google-play-no-compatible", "35-ram-virtual-juegos", "04-free-fire-requisitos"],
  "featured": false
}
---

## Lo que ocupa espacio: los recursos

La documentación de Google Play describe los **paquetes de recursos** de un juego como archivos de texturas, *shaders* (pequeños programas para la GPU) y sonidos, **sin código ejecutable**, y presenta este sistema como la forma de distribuir juegos de **más de 200 MB**.

Además, cada GPU entiende sus propios formatos de textura comprimida. Google calcula que el formato ASTC lo admiten más del 80 % de los dispositivos de Google Play y ETC2, más del 95 %. Play puede enviar a cada teléfono solo el formato que su GPU entiende, en lugar de todos.

## Tres momentos de descarga

Google Play ofrece a los estudios tres formas de entregar esos paquetes:

| Modo | Cuándo se descarga | ¿Cuenta en el tamaño de la ficha? |
|---|---|---|
| **Al instalar** (*install-time*) | Junto con la app | **Sí**. No puedes borrar estos paquetes |
| **Justo después** (*fast-follow*) | Automáticamente tras instalar, aunque no abras el juego | **No** |
| **Bajo demanda** (*on-demand*) | Mientras juegas, cuando el juego lo pide | **No** |

```flujo
# Qué pasa desde que pulsas «Instalar»
Instalación | Se descarga la app con sus paquetes «al instalar»: es el tamaño de la ficha.
Descarga posterior | Los paquetes «justo después» empiezan solos, aunque no abras el juego.
Primera partida | El juego puede pedir paquetes «bajo demanda»: mapas, modos o idiomas.
Actualizaciones | Play aplica parches que descargan solo las diferencias.
```

Por eso **el tamaño que ves en la ficha puede ser mucho menor que lo que acaba ocupando el juego**, y por eso algunos juegos muestran una pantalla de descarga al abrirlos por primera vez.

## Cuánto espacio reservar

1. **Mira el espacio que te pide el propio juego** en su primera pantalla de descarga, no solo el de la ficha.
2. **Deja margen para las actualizaciones.** Los parches descargan diferencias, pero el juego necesita espacio libre para aplicarlas.
3. **Revisa las opciones de descarga del juego.** Si ofrece paquetes opcionales (texturas en alta resolución, idiomas, modos), descarga solo los que uses.
4. **No confundas almacenamiento con RAM.** Liberar almacenamiento te deja instalar y actualizar; no hace que el juego vaya más rápido. Lo explicamos en [¿La RAM virtual mejora el rendimiento?](/rendimiento/ram-virtual-mejora-juegos).

Si la tienda ni siquiera te deja instalar el juego, el problema no es el espacio: consulta [por qué Google Play dice que tu dispositivo no es compatible](/rendimiento/google-play-dispositivo-no-compatible).

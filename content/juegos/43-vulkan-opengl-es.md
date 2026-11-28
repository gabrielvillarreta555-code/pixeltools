---
{
  "id": "43-vulkan-opengl-es",
  "section": "tecnologia",
  "games": ["Fortnite", "Roblox", "Minecraft", "Free Fire"],
  "slug": "vulkan-opengl-es-diferencias",
  "title": "Vulkan y OpenGL ES: qué cambia para tus juegos",
  "description": "Vulkan es la API gráfica principal de Android y OpenGL ES ya no recibe funciones nuevas. Diferencias, cuántos teléfonos admiten cada una y qué es ANGLE.",
  "answer": "Son dos formas de que un juego dé órdenes a la GPU. OpenGL ES es la veterana: casi todos los teléfonos Android la admiten, pero Google ya no le añade funciones. Vulkan es la API principal de Android: exige más trabajo al estudio, pero reduce el trabajo de la CPU y permite funciones nuevas. Unity y Unreal la usan por defecto donde está disponible. Que tu teléfono admita Vulkan no garantiza más FPS: depende de cómo lo use cada juego.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "comparativa",
  "handsOn": false,
  "scope": "Comparativa basada en documentación oficial de Android leída directamente el 28/11/2026. No hemos medido el rendimiento de juegos con cada API.",
  "cover": "art-43-vulkan-opengl",
  "coverAlt": "Dos teléfonos en horizontal con la misma escena de juego: a la izquierda se ve borrosa y a la derecha nítida",
  "sources": [
    {
      "label": "Android Developers: Vulkan para juegos",
      "url": "https://developer.android.com/games/develop/vulkan/overview",
      "supports": "Vulkan está diseñada para minimizar la abstracción entre el hardware gráfico y el juego; es la API gráfica principal de Android y sustituye a OpenGL ES, que sigue admitida sin desarrollo activo de funciones; menor carga de CPU en el controlador; funciones nuevas como APIs sin vinculación (bindless) y trazado de rayos; disponible desde Android 7; los dispositivos de 64 bits con Android 10 o superior admiten Vulkan 1.1; el 85 % de los dispositivos Android activos admite Vulkan; Unity y Unreal lo usan por defecto; Android 15 incluye ANGLE como capa opcional. Actualizada el 08/10/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: paneles de distribución",
      "url": "https://developer.android.com/about/dashboards",
      "supports": "Dispositivos de mano activos, 28 días hasta el 24/11/2025: sin Vulkan 7,37 %, Vulkan 1.1 62,09 %, 1.3 26,01 %; OpenGL ES 3.2 en el 98,24 %. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: intervenciones de Game Mode",
      "url": "https://developer.android.com/games/optimize/adpf/gamemode/gamemode-interventions",
      "supports": "Entre las intervenciones que un fabricante puede aplicar a un juego figura usar ANGLE en lugar de los controladores GLES nativos. Actualizada el 26/02/2026. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["42-como-funciona-gpu-telefono", "39-juegos-mejor-iphone", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## Dos idiomas para hablar con la GPU

Un juego no controla la GPU directamente: le envía órdenes a través de una **API gráfica**. En Android conviven dos:

| | OpenGL ES | Vulkan |
|---|---|---|
| Situación según Google | Sigue admitida, pero **ya no recibe funciones nuevas** | **API gráfica principal** de Android |
| Trabajo de la CPU | Mayor carga en el controlador gráfico | Menor carga de CPU en el controlador |
| Funciones nuevas | Congeladas | Por ejemplo, APIs sin vinculación (*bindless*) y trazado de rayos |
| Abstracción | El controlador gestiona más trabajo por su cuenta | Diseñada, según Google, para minimizar la abstracción entre el hardware gráfico y el juego |
| Motores | Opción heredada | Unity y Unreal la usan por defecto en dispositivos compatibles |

Dicho de forma sencilla: con Vulkan el juego organiza más trabajo por su cuenta y el controlador hace menos. Por eso Google destaca la menor carga de CPU.

## ¿Cuántos teléfonos admiten cada una?

Según el panel de Google (dispositivos de mano activos, 28 días hasta el 24 de noviembre de 2025):

| API | Dispositivos compatibles |
|---|---|
| OpenGL ES 3.2 | 98,24 % |
| Vulkan (cualquier versión) | 92,63 % |
| Vulkan 1.3 o superior | 26,68 % |

El porcentaje de Vulkan lo calculamos restando el 7,37 % de dispositivos sin Vulkan. La página general de Vulkan de Google da otra cifra redondeada, el 85 % de los dispositivos activos, sin indicar el mismo periodo ni el mismo grupo de dispositivos. Por eso conviene leer ambas como órdenes de magnitud.

Google también indica que **todos los dispositivos de 64 bits con Android 10 o superior admiten Vulkan 1.1**.

## ¿Y ANGLE?

ANGLE es una capa que traduce OpenGL ES a Vulkan. Android 15 la incluye como capa opcional, y la documentación de Game Mode cita «usar ANGLE en lugar de los controladores GLES nativos» entre los ajustes que un fabricante puede aplicar a un juego. Así, un juego antiguo escrito para OpenGL ES puede acabar ejecutándose sobre Vulkan sin que el estudio lo actualice.

## Lo que significa para ti

- **Vulkan no es un botón de «más FPS».** Que tu teléfono lo admita solo importa si el juego lo usa, y bien.
- **Si un juego te deja elegir** entre Vulkan y OpenGL en sus ajustes y una opción da problemas (cierres, fallos gráficos), probar la otra es una comprobación razonable.
- **Al comprar,** que el teléfono admita Vulkan, y en qué versión, es una garantía de futuro: Google la considera la API principal. Lo incluimos en [cómo elegir un teléfono para jugar](/tecnologia/como-elegir-telefono-para-jugar).

---
{
  "id": "45-google-play-no-compatible",
  "section": "rendimiento",
  "games": ["Fortnite", "Free Fire", "Roblox", "Minecraft", "Clash Royale"],
  "slug": "google-play-dispositivo-no-compatible",
  "title": "¿Por qué Google Play dice que mi dispositivo no es compatible con un juego?",
  "description": "Los filtros de Google Play explicados: versión de Android, arquitectura de 32 o 64 bits, OpenGL ES, sensores y país. Cómo saber cuál te afecta y por qué no conviene forzarlo.",
  "answer": "Porque Google Play filtra los juegos según lo que declara cada estudio: versión mínima de Android, funciones del dispositivo (sensores, versión de OpenGL ES), arquitectura del procesador y país. Si tu teléfono no cumple alguna condición, la tienda no te deja instalarlo. Un ejemplo es la arquitectura: un juego que solo incluye código de 64 bits no aparece como compatible en dispositivos que no la admiten.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "guia",
  "scope": "Basado en la documentación oficial de Google Play para desarrolladores, leída directamente el 28/11/2026. Google Play no muestra al usuario qué filtro concreto le afecta; las comprobaciones de este artículo son orientativas.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Android Developers: filtros de Google Play",
      "url": "https://developer.android.com/google/play/filters",
      "supports": "Google Play filtra los resultados según la compatibilidad con el dispositivo: funciones requeridas (uses-feature), versión de OpenGL ES, versión mínima de Android, tamaños de pantalla y arquitectura (las apps con bibliotecas nativas para una arquitectura solo se ven en dispositivos que la admiten); las apps de pago requieren un país donde estén disponibles, y sin SIM se usa la IP para determinarlo; el desarrollador puede elegir países. Actualizada el 21/07/2025. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: compatibilidad con arquitecturas de 64 bits",
      "url": "https://developer.android.com/google/play/requirements/64-bit",
      "supports": "Bibliotecas de 32 bits (armeabi-v7a, x86) y de 64 bits (arm64-v8a, x86_64); por cada arquitectura nativa de 32 bits que una app incluya debe incluir la de 64 bits; existen dispositivos solo de 64 bits; las imágenes del emulador son solo de 64 bits desde Android 12. Actualizada el 28/10/2026. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: paneles de distribución",
      "url": "https://developer.android.com/about/dashboards",
      "supports": "El 98,24 % de los dispositivos de mano activos admite OpenGL ES 3.2 (28 días hasta el 24/11/2025). Leído directamente el 28/11/2026."
    }
  ],
  "related": ["44-juegos-ocupan-tantos-gb", "04-free-fire-requisitos", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## La tienda filtra antes de que lo intentes

Google Play no muestra todos los juegos a todos los teléfonos. Según su documentación, **filtra los resultados según la compatibilidad de cada dispositivo**, a partir de lo que el estudio declara al publicar el juego. Los filtros más relevantes para juegos son estos:

| Filtro | Qué declara el juego | Ejemplo de por qué te afecta |
|---|---|---|
| **Versión de Android** | Una versión mínima | Tu teléfono tiene una versión anterior |
| **Funciones del dispositivo** | Hardware que necesita (por ejemplo, un sensor) | Tu modelo no lo tiene |
| **Versión de OpenGL ES** | La versión gráfica mínima | Tu GPU admite una versión anterior. Hoy el 98,24 % de los dispositivos activos admite OpenGL ES 3.2 |
| **Arquitectura del procesador** | Para qué arquitecturas incluye código nativo | El juego solo trae código de 64 bits y tu dispositivo no lo ejecuta |
| **Pantalla** | Tamaños de pantalla que admite | Poco habitual en teléfonos recientes |
| **País** | Dónde se distribuye y, si es de pago, dónde se vende | Tu país no está incluido; sin SIM, Google Play usa tu IP para saber dónde estás |

## El caso de los 64 bits

Los procesadores y sistemas Android pueden ejecutar código de **32 bits** (en ARM, `armeabi-v7a`) o de **64 bits** (`arm64-v8a`). Google Play exige que, por cada arquitectura de 32 bits que incluya una app, incluya también la de 64 bits.

La documentación de filtros explica la consecuencia: una app con bibliotecas nativas para una arquitectura concreta **solo es visible en dispositivos que admiten esa arquitectura**. Si tu teléfono solo ejecuta código de 32 bits, un juego que solo incluye código de 64 bits no aparece como compatible.

Google también recuerda que ya existen dispositivos **solo de 64 bits**, y que sus emuladores de Android son solo de 64 bits desde Android 12.

```flujo
# Cómo decide Google Play si puedes instalar un juego
El estudio declara | Versión mínima de Android, funciones, OpenGL ES, arquitecturas y países.
Tu teléfono informa | Su versión de Android, su hardware y su arquitectura.
Google Play compara | Si falta cualquier condición, el juego no aparece como compatible.
Resultado | No puedes instalarlo desde la tienda en ese dispositivo.
```

## Qué puedes comprobar

1. **Versión de Android:** en los ajustes del teléfono. Compárala con los requisitos oficiales del juego.
2. **Requisitos oficiales del juego:** algunos estudios publican la versión mínima de Android y otros requisitos. Por ejemplo, Garena publica requisitos para Free Fire; lo explicamos en [¿Mi celular puede ejecutar Free Fire o Free Fire MAX?](/juegos/free-fire/requisitos-celular-free-fire-max).
3. **País:** si el juego está disponible en otros países y no en el tuyo, el filtro puede ser geográfico.

Google Play no muestra qué filtro concreto te afecta, así que estas comprobaciones orientan, pero no siempre dan una respuesta segura.

## Lo que no conviene hacer

- **No instales el juego desde un APK externo** para saltarte el filtro. Si el filtro es la arquitectura o la versión gráfica, lo más probable es que el juego no funcione igualmente; si es otro, te expones a archivos modificados y no recibirás actualizaciones de la tienda.
- **No confundas incompatibilidad con falta de espacio.** Si lo que te falta es almacenamiento, revisa cuánto ocupa realmente el juego. Lo explicamos en [por qué los juegos ocupan tantos GB](/rendimiento/juegos-ocupan-tantos-gb-descargas-adicionales).

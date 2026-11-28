---
{
  "id": "42-como-funciona-gpu-telefono",
  "section": "tecnologia",
  "games": ["Fortnite", "Free Fire", "Roblox", "Minecraft"],
  "slug": "como-funciona-gpu-telefono",
  "title": "¿Cómo funciona la GPU de un teléfono?",
  "description": "Por qué la gráfica de un móvil dibuja por mosaicos, qué ventaja tiene su memoria interna y por qué comparte la RAM con el procesador. Con datos de Apple y Android.",
  "answer": "La GPU de un teléfono divide la imagen en pequeños mosaicos y dibuja cada uno usando una memoria rápida que está dentro de la propia GPU, en lugar de leer y escribir continuamente en la RAM. Apple llama a esta técnica renderizado diferido por mosaicos (TBDR) y explica que ahorra tiempo, energía y ancho de banda frente a las GPU tradicionales. Además, en Android la CPU y la GPU comparten la misma RAM, por lo que la memoria disponible afecta a ambas.",
  "reviewedAt": "2026-11-28",
  "publishedAt": "2026-11-28",
  "status": "published",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Explicación técnica basada en documentación oficial de Apple y Android leída directamente el 28/11/2026. Apple describe sus propias GPU; no extrapolamos sus cifras a otros fabricantes.",
  "cover": "art-42-gpu-telefono",
  "coverAlt": "Teléfono abierto sobre una mesa con la placa, el procesador, la cámara y la batería a la vista",
  "sources": [
    {
      "label": "Apple Developer: GPU de Apple y renderizado diferido por mosaicos",
      "url": "https://developer.apple.com/documentation/metal/tailor-your-apps-for-apple-gpus-and-tile-based-deferred-rendering",
      "supports": "Las GPU de Apple dividen la imagen en mosaicos, procesan toda la geometría antes de sombrear, descartan lo oculto y escriben en memoria de mosaico dentro de la GPU, con mucho más ancho de banda, mucha menos latencia y menos energía que la memoria del dispositivo; las GPU tradicionales de modo inmediato procesan las primitivas aunque no se vean. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: gestión de memoria",
      "url": "https://developer.android.com/topic/performance/memory-management",
      "supports": "En Android, la CPU y la GPU acceden a la misma RAM. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: Vulkan para juegos",
      "url": "https://developer.android.com/games/develop/vulkan/overview",
      "supports": "Vulkan reduce el trabajo de la CPU en el controlador gráfico y es la API gráfica principal de Android. Leído directamente el 28/11/2026."
    },
    {
      "label": "Android Developers: Thermal API",
      "url": "https://developer.android.com/games/optimize/adpf/thermal",
      "supports": "Los motores de juego pueden ajustar la calidad gráfica y la resolución del framebuffer para no superar el límite térmico. Leído directamente el 28/11/2026."
    }
  ],
  "related": ["43-vulkan-opengl-es", "37-mismo-procesador", "39-juegos-mejor-iphone"],
  "featured": false
}
---

## La CPU decide, la GPU dibuja

En un juego, el procesador (CPU) calcula la lógica: dónde está cada personaje, qué ha pasado en la partida. La GPU convierte esa escena en millones de píxeles, decenas de veces por segundo. Para hacerlo, el juego le envía instrucciones a través de una **API gráfica**, como Vulkan en Android o Metal en Apple.

## Dibujar por mosaicos

Las GPU de los ordenadores tradicionales trabajan en **modo inmediato**: procesan cada triángulo de la escena según llega, aunque luego quede tapado por otro. Apple explica que sus GPU usan otra técnica, el **renderizado diferido por mosaicos** (*tile-based deferred rendering*, TBDR):

```flujo
# Cómo dibuja una GPU por mosaicos (según Apple)
Dividir la imagen | La pantalla se reparte en una cuadrícula de mosaicos pequeños.
Ver toda la geometría primero | Para cada mosaico, la GPU reúne los triángulos que lo tocan.
Descartar lo oculto | Lo que queda tapado no se colorea.
Colorear en memoria interna | Los píxeles visibles se calculan en una memoria rápida dentro de la GPU.
Escribir el resultado | Al terminar el mosaico, el resultado final pasa a la RAM.
```

Muchos núcleos de la GPU trabajan en mosaicos distintos al mismo tiempo.

## Por qué la memoria interna importa tanto

Según Apple, acceder a la memoria del mosaico, dentro de la propia GPU, tiene tres ventajas frente a acceder a la memoria del dispositivo:

| | Memoria del mosaico (dentro de la GPU) | Memoria del dispositivo (RAM) |
|---|---|---|
| Ancho de banda | Muchas veces mayor | Menor |
| Latencia | Muchas veces menor | Mayor |
| Energía por acceso | Significativamente menor | Mayor |

En un teléfono, la energía es también calor. Cada lectura o escritura en RAM que la GPU se ahorra es batería y temperatura que no se gastan.

## La RAM se comparte

La documentación de Android indica que **la CPU y la GPU acceden a la misma RAM**. Las texturas del juego y los datos del procesador compiten por la misma memoria. Por eso un juego con texturas de alta calidad necesita más RAM aunque no use más procesador, y por eso cerrar apps en segundo plano puede ayudar en teléfonos justos de memoria. Lo explicamos en [por qué un teléfono con mucha RAM puede ir lento](/rendimiento/mucha-ram-telefono-lento).

## Qué tiene que ver con tus partidas

- **La resolución pesa.** Más píxeles significa más mosaicos que colorear. Android cita la resolución del framebuffer entre los parámetros que un motor puede bajar para no sobrecalentar el teléfono. Lo explicamos en [qué es el escalado de resolución](/tecnologia/escalado-resolucion-juegos-moviles).
- **La API también cuenta.** Vulkan reduce el trabajo que la CPU dedica a preparar las órdenes para la GPU. Lo comparamos en [Vulkan y OpenGL ES](/tecnologia/vulkan-opengl-es-diferencias).
- **Mismo nombre de GPU no significa mismo resultado.** Cómo se refrigera el teléfono decide cuánto tiempo puede trabajar la GPU a máxima frecuencia. Lo explicamos en [por qué el mismo procesador rinde distinto en cada teléfono](/tecnologia/mismo-procesador-distinto-rendimiento).

Las cifras de este artículo describen las GPU de Apple. Otros fabricantes de GPU para móviles no aparecen en las fuentes que hemos podido consultar, así que no les atribuimos el mismo diseño ni las mismas ventajas.

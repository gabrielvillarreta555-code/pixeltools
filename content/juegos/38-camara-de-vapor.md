---
{
  "id": "38-camara-de-vapor",
  "section": "tecnologia",
  "games": ["Fortnite", "Free Fire", "Roblox"],
  "slug": "refrigeracion-liquida-camara-de-vapor-telefono",
  "title": "¿Cómo funciona la «refrigeración líquida» de un teléfono?",
  "description": "La física de la cámara de vapor: cómo una gota de agua sellada mueve el calor del chip, qué promete Apple con el iPhone 17 Pro y cuáles son sus límites.",
  "answer": "No hay una bomba ni líquido circulando como en un PC. La mayoría de los teléfonos usan una cámara de vapor: una cavidad plana y sellada con un poco de líquido que se evapora junto al chip, viaja hacia zonas más frías y se condensa, repartiendo el calor por el cuerpo del teléfono. Ayuda a mantener el rendimiento más tiempo, pero el calor acaba saliendo por la carcasa.",
  "reviewedAt": "2026-11-27",
  "publishedAt": "2026-11-27",
  "status": "draft",
  "kind": "analisis",
  "handsOn": false,
  "scope": "Explicación técnica basada en documentación del fabricante, prensa especializada y patentes. Las cifras de rendimiento son afirmaciones de Apple, no mediciones nuestras. Fuentes consultadas mediante extractos de buscador; requieren lectura directa antes de publicar.",
  "cover": "sin-portada",
  "coverAlt": "Sin imagen: portada de texto",
  "sources": [
    {
      "label": "Apple Newsroom: presentación del iPhone 17 Pro y 17 Pro Max",
      "url": "https://www.apple.com/ca/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/",
      "supports": "Agua desionizada sellada en una cámara de vapor soldada por láser al chasis de aluminio; Apple afirma hasta un 40 % más de rendimiento sostenido que la generación anterior."
    },
    {
      "label": "IEEE Spectrum: la cámara de vapor del iPhone 17 Pro",
      "url": "https://spectrum.ieee.org/iphone-17-pro-vapor-chamber",
      "supports": "El agua se evapora junto a la fuente de calor y se condensa al ceder el calor al aluminio; al reducir el grosor, el rendimiento frente al cobre sólido disminuye; otros fabricantes como Samsung y Google ya la usaban."
    },
    {
      "label": "Patente US 9310139: cámaras de vapor en la carcasa de dispositivos móviles",
      "url": "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9310139",
      "supports": "Describe la cámara de vapor como un sistema pasivo y cerrado de dos fases que aprovecha el calor latente de vaporización."
    },
    {
      "label": "Android Developers: Thermal API",
      "url": "https://developer.android.com/games/optimize/adpf/thermal",
      "supports": "El rendimiento sostenible depende del diseño térmico del dispositivo. Leído directamente el 27/11/2026."
    }
  ],
  "related": ["36-juego-pierde-fps", "37-mismo-procesador", "40-elegir-telefono-jugar"],
  "featured": false
}
---

## El problema: un chip pequeño que produce mucho calor

Mientras juegas, el procesador y la gráfica concentran el calor en pocos milímetros cuadrados. Un teléfono no tiene ventilador ni rejillas: ese calor solo puede salir por la carcasa. Si se queda junto al chip, el sistema reduce la potencia para protegerlo, como explicamos en [por qué un juego pierde FPS después de varios minutos](/rendimiento/juego-pierde-fps-despues-de-minutos).

La solución es **repartir el calor** por la mayor superficie posible y hacerlo rápido.

## Cómo funciona una cámara de vapor

```flujo
# Ciclo de una cámara de vapor
Evaporación | Junto al chip, el líquido sellado absorbe calor y se convierte en vapor.
Transporte | El vapor se desplaza hacia las zonas más frías de la cámara.
Condensación | Al ceder su calor al chasis, el vapor vuelve a ser líquido.
Retorno | Una estructura porosa devuelve el líquido hacia el chip, y el ciclo se repite.
```

La clave física es el **calor latente**: cambiar de líquido a vapor absorbe mucha energía sin subir la temperatura del líquido. Por eso una pequeña cantidad de agua mueve más calor que una placa metálica del mismo grosor, al menos cuando la cámara tiene espacio suficiente.

Es un sistema **pasivo**: no consume batería ni tiene piezas móviles. Por eso «refrigeración líquida» es una expresión de marketing que se presta a confusión.

## Qué dice Apple del iPhone 17 Pro

Apple anunció que el iPhone 17 Pro sella agua desionizada en una cámara de vapor soldada por láser al chasis de aluminio, y afirma hasta un **40 % más de rendimiento sostenido** que la generación anterior. Es una cifra del fabricante. No la hemos verificado y no describe un juego concreto.

Samsung, Google y otros fabricantes ya usaban cámaras de vapor en algunos modelos de gama alta, según IEEE Spectrum.

## Límites que conviene conocer

- **El grosor importa.** IEEE Spectrum explica que, al hacer la cámara más fina, su ventaja frente al cobre sólido se reduce. En teléfonos muy delgados la mejora puede ser modesta.
- **No elimina el calor, lo reparte.** El teléfono se calentará de forma más uniforme: lo notarás en la mano.
- **El tamaño de la cámara no se suele publicar con detalle.** Una ficha que dice «cámara de vapor» no indica cuánto rinde. Para saberlo hacen falta pruebas de rendimiento sostenido.

## Qué mirar al comprar

Que un teléfono tenga cámara de vapor es buena señal, pero no una garantía. Busca pruebas independientes de **estabilidad**: cuánto rendimiento conserva tras muchos minutos de carga. Lo explicamos en [por qué dos teléfonos con el mismo procesador rinden distinto](/tecnologia/mismo-procesador-distinto-rendimiento).

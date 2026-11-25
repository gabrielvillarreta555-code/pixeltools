# VX-003 — estado de permisos de imágenes

Revisión: 25 de noviembre de 2026. Investigación preliminar; no se han incorporado imágenes nuevas ni se ha verificado una licencia individual para las imágenes actuales. Las portadas generadas con IA permanecen en la rama pendiente de sustitución; no presentar esta versión como lista para publicar.

| Juego | Fuente primaria | Estado para Vélix |
|---|---|---|
| GTA VI | [Rockstar: uso de contenido protegido](https://support.rockstargames.com/articles/7bNaeoMFTV0iUDGhStTXvz/policy-on-posting-copyrighted-rockstar-games-material) | Su política para aficionados indica que no cubre publicaciones digitales. Buscar autorización editorial aplicable a las imágenes específicas. |
| Free Fire | [Términos de Garena](https://content.garena.com/legal/tos/tos_en.html) | No se ha identificado autorización específica para republicar imágenes en esta revista. Solicitar condiciones o licencia. |
| Clash Royale | [Política de contenido de fans de Supercell](https://supercell.com/en/fan-content-policy/) | **VX-003-R2 (25/11/2026, aprobado por el CEO):** la cabecera y las dos portadas usan arte oficial del [Supercell Fan Kit](https://fankit.supercell.com/clashroyale), recurso que la propia política cubre, solo reescalado y con el aviso obligatorio. Detalle en `IMAGENES_Y_FUENTES.md` y `official-sources.json`. Riesgo residual: la política no nombra expresamente a los medios de noticias; el uso se ampara en «mostrar, identificar y comentar» sus juegos (páginas de fans y guías). Confirmar por escrito con Supercell antes de monetizar. |
| Minecraft | [Directrices de uso](https://www.minecraft.net/en-us/usage-guidelines) | Admite sitios informativos y capturas bajo condiciones. Identificar capturas concretas y autorización de su autor, además de verificar su uso en el contexto editorial. |
| Fortnite | [Política de Epic](https://legal.epicgames.com/epicgames/fan-art-policy) | Se limita a contenido personal sin objetivo comercial; la excepción citada de publicidad corresponde a vídeos web de fans individuales. Confirmar autorización aplicable a la revista. |
| Roblox | [Normas de nombre y logotipo](https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Guidelines) | Restringe contenido comercial con ciertas marcas y avatares sin licencia; no se ha verificado permiso de imágenes concretas ni derechos de creadores de experiencias. |

Una imagen visible en una web oficial, una licencia concedida a otra publicación o la atribución por sí solas no demuestran permiso para reutilizarla. Obtener permisos escritos o licencias específicas que cubran republicación, adaptación y el modelo de Vélix; registrar autor, URL original, licencia, condiciones y fecha. Ninguna consulta de esta nota constituye asesoramiento jurídico. No se ha contactado a terceros.

El diagnóstico conocido de solicitudes de Cloudflare Web Analytics en producción continúa pendiente de resolución. No se han ejecutado nuevas pruebas ni se ha desplegado.

## Verificación VX-003-R3 (25/11/2026)

Objetivo: sustituir las 7 ilustraciones de IA restantes (`gta-vi`, `gta-album`, `free-fire`, `free-fire-finals`, `minecraft`, `fortnite`, `roblox`). **No se sustituyó ninguna**, porque no se pudo confirmar permiso para ninguna imagen oficial:

| Juego | Resultado de la consulta |
|---|---|
| Free Fire | Términos de Garena leídos: licencia solo «for personal use only» (3.1); prohíben copiar, republicar o mostrar públicamente su contenido (3.3) y el uso comercial (4.2.h). Sin política de fans ni kit de prensa. **No permitido** sin autorización escrita. |
| GTA VI | Política de Rockstar: HTTP 503 en tres intentos. Sin verificar. |
| Minecraft | Directrices de uso de Mojang: HTTP 503 en tres intentos. Sin verificar. |
| Fortnite | Política de Epic: redirige a inicio de sesión. Sin verificar. |
| Roblox | Directrices de nombre y logotipo: HTTP 403. Sin verificar. |

No se usaron bancos de imágenes ni copias de terceros: una imagen visible en otra web no prueba permiso. Las portadas IA siguen en la rama y **la web no cumple todavía «cero imágenes de IA»**.

Siguiente paso: que una persona revise en un navegador las cuatro políticas sin verificar y, para Garena, pida autorización escrita. Alternativa sin permisos: sustituir esas portadas por diseños tipográficos sin imagen, lo que requiere un cambio de plantilla que debe aprobar el CEO.


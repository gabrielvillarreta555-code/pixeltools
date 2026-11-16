# VÉLIX 2.0 — Fase 0: investigación y preparación del MVP

**Blue Lab Studios · 16 de noviembre de 2026**

**Estado: investigación autorizada; desarrollo, fusión y despliegue pendientes de autorización de Dirección.** Este informe propone trabajo futuro: no incorpora artículos ni cambia la aplicación.

## 1. Dictamen ejecutivo y límites de la auditoría

Recomiendo **reutilizar React/Vite y los motores de las ocho herramientas**, añadiendo generación estática de contenido editorial en Markdown durante el build. No encuentro evidencia que justifique reescribir las herramientas ni migrar todo a Astro + MDX para un MVP de diez consultas. Astro es una alternativa válida si la prueba técnica de generación editorial revela más complejidad que beneficio; decidir con una comparación medida, no por preferencia de framework.

La carencia demostrada es el HTML principal: el generador actual modifica el head, pero parte de un `<div id="root"></div>` vacío. Tener canonical y title estáticos no equivale a entregar el artículo en HTML. La ampliación deberá producir cuerpo, enlaces y fuentes completos sin JavaScript, y mantener el comportamiento interactivo de las herramientas.

### Evidencia y alcance

- Repositorio público: [gabrielvillarreta555-code/pixeltools](https://github.com/gabrielvillarreta555-code/pixeltools).
- Base auditada: [main, dd79661f817f24074ae6f7854f5ee5f81fc8dedb](https://github.com/gabrielvillarreta555-code/pixeltools/tree/dd79661f817f24074ae6f7854f5ee5f81fc8dedb), merge del PR #14 «Integrar pincel, OCR, PDF, rendimiento y privacidad», fechado 1 de noviembre de 2026.
- Leídos árbol completo, package, App, catálogo, generadores, configuración, estilos, layout, módulos críticos, pruebas, README, CLAUDE y avisos de terceros. No hay AGENTS.md en el árbol consultado.
- Se diferencia **verificado en código**, **documentado por el repositorio**, **observado en fuentes públicas** y **pendiente de ejecución**. No se atribuye autoría individual del rediseño sin revisar cada commit.
- La shell devolvió «No usable execution environment is available». Aunque el proveedor reportó estado running, no hubo shell utilizable. No se ejecutaron build, Vitest, Playwright, Lighthouse, npm audit ni mediciones móviles en esta fase.
- La API de Actions devolvió cero ejecuciones. El árbol no contiene workflows de GitHub Actions. No equivale a ausencia de builds externos de Cloudflare.
- Los intentos de abrir portada, robots y sitemap de producción con la herramienta web fallaron. **No confirma caída ni bloqueo de producción**; tampoco permite afirmar que el incidente SEO siga abierto o esté resuelto. Se confirma el dominio en configuración y por Dirección, no el estado HTTP actual.
- No se tuvo acceso a Search Console, configuración Cloudflare, métricas de tráfico ni datos de volumen de búsqueda. Las cifras históricas del README no son mediciones nuevas.

## 2. Diagnóstico técnico

### Stack, estructura y despliegue

| Área | Evidencia actual |
| --- | --- |
| UI | React/React DOM 19.2.0, React Router 7.18.5, TypeScript 5.9.3 |
| Build y estilos | Vite 7.3.7, Tailwind 4.1.16, Plus Jakarta Sans 5.3.0 local |
| Procesamiento | Canvas, Blob, Object URL, createImageBitmap con fallback; ONNX Runtime Web 1.23.2; Tesseract.js 7.0.0 y datos spa/eng 1.0.0; pdf-lib 1.17.1 |
| Pruebas | Vitest 4.1.12 y Playwright 1.63.0; versiones fijadas y package-lock |
| Estructura | src/pages, src/components, src/lib; public; scripts; functions; tests; e2e; docs |
| Salida | npm run build: TypeScript → Vite → HTML/metadatos → service worker; dist ignorado en Git |
| Cloudflare | Pages, comando npm run build, salida dist; functions/_middleware.ts requiere Pages Functions junto a estáticos |
| Persistencia | Sin base de datos ni backend de fotografías; PWA Cache Storage para archivos de aplicación |
| Contacto | Mailto configurable mediante VITE_CONTACT_EMAIL; no equivale a un sistema de soporte con tickets |

**URLs a conservar en https://velixblue.com:** `/`, `/comprimir-imagen`, `/eliminar-fondo`, `/convertir-imagen`, `/redimensionar-imagen`, `/recortar-imagen`, `/quitar-metadatos`, `/extraer-texto`, `/imagenes-a-pdf`, `/privacidad`, `/terminos`, `/contacto`. Son doce rutas declaradas en App y generador. Comprobar su respuesta pública antes de implementar; no trasladarlas bajo /herramientas.

### Inventario funcional

Funciones confirmadas por catálogo, componentes/módulos y documentación; no se volvieron a ejecutar en esta sesión.

| Herramienta / URL | Funciones incorporadas | Límites relevantes |
| --- | --- | --- |
| Comprimir /comprimir-imagen | JPG/PNG/WebP; calidad, lado máximo, objetivo en KB, lote de hasta 30, pesos/reducción, descarga individual y ZIP, cancelar/reiniciar | Motor general limita 32 MP y 12000 px por lado; objetivo no siempre alcanzable; JPEG opaco |
| Eliminar fondo /eliminar-fondo | U²-Net pequeño local, comparador, transparencia/color/degradado/imagen/desenfoque; recorte al sujeto; pincel borrar/restaurar y deshacer; PNG/JPG según fondo | Preparación hasta 50 MiB y 120 MP; salida de trabajo hasta 2048 px y 4 MP; límites no garantizan memoria suficiente en todo móvil |
| Convertir /convertir-imagen | Reutiliza CompressorPage en modo convert; JPG/PNG/WebP, lote y ZIP | HEIC no disponible; transparencia incompatible con JPEG |
| Redimensionar /redimensionar-imagen | Presets sociales, porcentaje o dimensiones, bloqueo de proporción; rellenar/cortar o ajustar con bordes | README: salida hasta 8000 px por lado y 16 MP |
| Recortar /recortar-imagen | Proporciones y libre, rotación y volteo; interacción táctil/ratón/teclado | Preview reducida a 1400 px; salida desde original; README: 25 MB/32 MP |
| Quitar metadatos /quitar-metadatos | EXIF/GPS/XMP/IPTC, comentarios, texto PNG y contenido extra JPEG; limpieza binaria sin recomprimir, reanálisis | Conserva orientación y perfil de color; README: 50 MB, sin HEIC; no prometer eliminación de toda información imaginable |
| OCR /extraer-texto | Español o inglés, giro/selección del área, resultado editable/copiar/TXT; progreso/cancelación; assets locales | Una imagen, 2048 px/4 MP de trabajo; no exactitud garantizada ni OCR universal de manuscritos |
| Imágenes a PDF /imagenes-a-pdf | Reordenar, A4/carta, orientación automática, generación y descarga local | 10 fotos, 50 MB por foto/80 MB total según UI; 2048 px/4 MP; JPEG blanco, sin texto seleccionable |

**No operativas:** HEIC a JPG y marca de agua aparecen sin ruta como «Próximamente». Unir/dividir PDF, vídeo, audio y las áreas Juegos/Viral/Memes no están implementadas. No confundir imágenes a PDF con edición de documentos PDF existentes.

### SEO, rendimiento, accesibilidad y seguridad

| Área | Hallazgo | Consecuencia / acción propuesta |
| --- | --- | --- |
| SEO | Generador produce doce titles/descriptions/canonicals y sitemap; body vacío en plantilla | Conservar configuración y generar contenido editorial completo; prueba con JS desactivado |
| Producción/pruebas | main en CF_PAGES=1 habilita velixblue.com; otras ramas bloqueadas incluso heredando SITE_URL. Middleware bloquea otros hosts | Preservar matriz de ambientes y verificar headers reales; no reabrir previews accidentalmente |
| Móvil | Carga diferida para seis páginas; motores pesados bajo demanda, procesamiento secuencial en lotes | Favorable, pero no hay nueva medición CWV ni móvil real |
| PWA | Precarga todos los archivos salvo exclusiones; navegación con red y fallback a raíz offline | No precargar todo el futuro catálogo editorial; evitar mostrar portada/herramienta como si fuera un artículo offline |
| Coste inicial | CompressorPage se importa sin lazy; CSS con blur, sombras y fondo fijo | Medir impacto antes de tocarlo. Las guías deben poder evitar React/Canvas/IA |
| Accesibilidad | Skip link, aria-label en navegación, menú con aria-expanded, foco visible, botones con altura mínima de 44 px; soporte teclado documentado | Auditar contraste, zoom 200 %, lectores de pantalla, foco tras navegación y editores; no declarar WCAG conforme por lectura de código |
| Movimiento | Mascota respeta prefers-reduced-motion para respiración; hay scroll suave y otras transiciones | Revisión completa de movimiento pendiente |
| Archivos | Validación MIME/tamaño, dimensiones, liberación de recursos; prelectura de dimensiones en backgroundInput | No es una auditoría de seguridad exhaustiva; validar firmas y archivos corruptos en cada flujo |
| Recursos | Posible fuga de ImageBitmap si llega abort después de crearlo y antes del return en decodeImage | Hallazgo estático a reproducir, no vulnerabilidad confirmada; no corregido en fase documental |
| Headers | nosniff, Referrer/Permissions Policy y COOP/COEP/CORP en public/_headers; no CSP declarada allí | Evaluar CSP en report-only antes de imponerla: workers/WASM/blob e imágenes la necesitan; no retirar aislamiento para embeds |
| Privacidad | OCR/modelo/idiomas del mismo origen; política y README informan observación de Cloudflare Web Analytics del 1/11 | No afirmar ausencia absoluta de analítica. Verificar dashboard y tratamiento; conservar procesamiento local |
| Legal | Política/términos siguen siendo borradores; datos del responsable pendientes | Revisión previa a nuevo lanzamiento y publicidad |
| Repositorio | .gitignore excluye dependencias, dist, env, llaves y configuración privada; main reporta protected:false | Proponer checks y protección de main con aprobación; no modificar configuración ahora |
| Pruebas | 13 archivos unitarios; smoke Chromium, OCR-crop y mask-brush | Sin ejecución reciente verificable aquí; Firefox/WebKit y dispositivos físicos pendientes |

### Reutilización frente a Astro + MDX

| Opción | Beneficios | Coste/riesgo | Dictamen |
| --- | --- | --- | --- |
| React/Vite + generador Markdown estático editorial | Preserva build, motores y rutas; reutiliza tokens; artículos sin JS de app | Hay que construir esquema, plantilla, validación y dueño único de rutas | **Recomendada para diez consultas**, sujeta a prototipo autorizado |
| Astro editorial junto al build React | Colecciones/esquemas y HTML estático; React integrable [T1][T2] | Dos salidas a combinar, CSS/404/SW y assets pueden colisionar | Alternativa si generador propio se vuelve complejo; primero prueba acotada |
| Migración total a Astro + MDX | Unifica routing editorial y posibles islas | Cambia montaje de Router, hooks de navegador, PWA, WASM, pruebas y rutas; MDX ejecuta código | No justificada por esta auditoría |

Markdown común basta para respuestas, tablas y pasos. MDX no es necesario en MVP: aumenta superficie de ejecución y acoplamiento del editor al código. Propuesta: Markdown con frontmatter validado (biblioteca mantenida, licencia revisada, lockfile), HTML crudo desactivado, plantillas con escape y protocolos de enlace permitidos. No escribir parser propio de Markdown. Elegir versiones durante el desarrollo autorizado y verificar compatibilidad; no se han añadido dependencias.

**Puerta de decisión:** probar en rama de desarrollo futura una página editorial ficticia no publicable y una navegación a cada herramienta. Si en dos días no se logra HTML completo, assets separados, sin colisiones y pruebas de rutas verdes, documentar comparación con Astro editorial. No usar la carencia de SSR de la SPA como argumento para reescribir procesamiento local.

## 3. Investigación de veinte consultas

### Método y alcance geográfico

Búsquedas web en español con variantes de error/plataforma, contrastadas con soporte de Garena, Roblox, Minecraft/Microsoft, Epic y Supercell. Se consultaron también páginas competidoras y conversaciones públicas. Las preguntas de la tabla son **formulaciones editoriales exactas propuestas a partir de problemas reales documentados**; no son una exportación de consultas de Search Console ni una afirmación de que esa cadena tenga cierto volumen.

Evidencia regional: evento Bobicraft/Minecraft en Panamá [P1], cobertura panameña de Roblox [P2], torneos regionales Free Fire [P3] y registro de participantes panameños en Free Fire [P4]. Indican relevancia cultural/competitiva, **no tamaño de mercado ni volumen de estas preguntas**. Fortnite y Brawl Stars se incluyen como exploración en español; su demanda específica panameña no quedó demostrada y debe validarse tras publicar. No se extrapolan compras, moneda, servidores ni disponibilidad de otros países a Panamá.

Dificultad cualitativa: autoridad de quienes responden, amplitud del tema, cantidad/tipo de respuestas observadas y coste de aportar una mejora. No es keyword difficulty de una herramienta ni posición medida en Google Panamá. Un FAQ oficial prueba que existe el problema, no cuántos lo buscan. Las fuentes de competidores sirven para competencia; las instrucciones técnicas futuras se basarán en fuentes primarias y pruebas propias.

| ID | Pregunta exacta propuesta | Intención | Competidores que responden | Evidencia de interés / problema | Dificultad y motivo | Aporte original posible | Actualización / desinformación |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | ¿Cómo recupero mi cuenta de invitado de Free Fire? | Recuperación | Garena [F1], TyC [C1] | Soporte específico y guía de recuperación; señal cualitativa, sin volumen. | Alta: soporte oficial y medio establecido. | Árbol según vínculo y región; distinguir casos recuperables, sin promesas. | Mensual y cambios de soporte; alto riesgo de phishing y falsa recuperación. |
| 02 | ¿Qué hago si perdí el Facebook vinculado a Free Fire? | Recuperación | Garena [F2], TyC [C1] (cobertura general) | Garena separa acceso social y correo de recuperación. | Alta: fuente oficial resuelve el caso. | Explicar qué gestiona cada proveedor y qué datos nunca compartir. | Mensual; no pedir contraseñas, códigos ni documentación en Vélix. |
| 03 | ¿Cómo veo mi región de Free Fire y puedo cambiarla? | Compatibilidad regional | Garena [F3] | FAQ explícita de región; no prueba demanda panameña. | Media-alta: respuesta breve oficial. | Identificación visual del servidor; no inferir región por país ni recomendar VPN. | Mensual; políticas regionales y cuentas nuevas. |
| 04 | ¿Mi celular puede ejecutar Free Fire o Free Fire MAX? | Compatibilidad | Garena [F4] | Tabla oficial de mínimos/recomendados: necesidad documentada. | Alta: documentación oficial; oportunidad en explicación móvil. | Checklist para consultar RAM/SO; distinguir requisito de rendimiento probado. | Cada versión y mensual; no garantizar FPS ni repetir mínimos antiguos sin contrastar tienda. |
| 05 | ¿Por qué Free Fire se cierra solo o muestra pantalla negra en Android? | Solución de fallos | Garena [F5] | Artículo específico de cierres, gráficos y recursos. | Media-alta: soporte sólido, diagnóstico por síntoma mejorable. | Pruebas reversibles ordenadas; proteger cuenta invitada antes de borrar datos. | Mensual y tras parches; pérdida de acceso si se recomienda reinstalar indiscriminadamente. |
| 06 | ¿Por qué mi código de Free Fire aparece inválido o no se puede canjear? | Canje / diagnóstico | Garena [F6], FFVIP [C2] | Restricciones oficiales y artículo dedicado al error. | Alta: abundan sitios de códigos; evitar competir por códigos diarios. | Distinguir caducidad, región, uso previo y cuenta vinculada; solo canje oficial. | Mensual; sin inventar códigos válidos ni recompensas. |
| 07 | ¿Cómo soluciono el error 279 de Roblox en Android? | Conexión | Roblox [R1], ExitLag [C3] | Error con soporte propio y guía comercial competidora. | Media-alta: oficial y proveedor comercial. | Separar fallo global, experiencia y Wi-Fi/datos; sin instalar optimizadores. | Mensual; no prometer solución universal ni desactivar seguridad permanentemente. |
| 08 | ¿Qué hago si Roblox sigue mostrando el error 280 después de actualizar? | Actualización | Roblox [R2], Jugador [C4] | Soporte más caso público en DevForum [U3]. | Media: caso más acotado que actualizar Roblox. | Checklist de tienda, versión y proceso abierto con resultado esperado por paso. | Mensual; sin APK no oficial ni confundir 280 con baneo. |
| 09 | ¿Cómo recupero Roblox si olvidé la contraseña y no vinculé correo? | Recuperación | Roblox [R3] | FAQ sobre correo/teléfono y recuperación; no volumen medido. | Alta: soporte es autoridad y única vía de validación. | Explicar vías legítimas y límites; guía de prevención posterior. | Mensual; estafas de recuperación, nunca garantizar acceso. |
| 10 | ¿Cómo configuro el control parental y el chat de Roblox para mi hijo? | Seguridad familiar | Roblox [R4] y página oficial de controles | FAQ y cambios oficiales de cuentas por edad en 2026. | Alta: requisitos variables y fuente oficial dominante. | Checklist para tutor, por edad y plataforma, probado con cuentas de prueba permitidas. | Quincenal; menores, verificaciones sensibles y reglas por país. |
| 11 | ¿Cómo canjeo una tarjeta de Roblox desde Panamá y qué pasa con la moneda? | Canje / compra | Roblox [R5], Genghis [C5] | Canje oficial y guías; las condiciones regionales encontradas difieren. | Alta: intención comercial y soporte; evidencia local insuficiente. | Distinguir crédito de Robux y país de la cuenta; confirmar condiciones Panamá antes de publicar. | Mensual y antes de recomendar compra; divisas, reembolsos y vendedores. No extrapolar términos de Perú/Colombia. |
| 12 | ¿Cómo reduzco el lag de Roblox en un celular sin instalar otras apps? | Rendimiento | Roblox [R6] | Soporte distingue red, gráficos y sistema. | Alta: tema amplio; acotarlo a diagnóstico móvil. | Tabla síntoma → prueba → resultado; registrar dispositivo y condiciones. | Mensual; no garantizar FPS ni confundir ping y lentitud gráfica. |
| 13 | ¿Puedo jugar Minecraft desde Android con un amigo que usa Java en PC? | Juego cruzado | Minecraft [M1], Minecraftbedrock.io [C6] | Comparación oficial y FAQ; necesidad de elegir edición. | Alta: oficial y múltiples guías. | Matriz teléfono/PC/consola; separar compatibilidad nativa de puentes de terceros. | Trimestral y cambios de edición; evitar vender Java como compatible nativo con Bedrock. |
| 14 | ¿Cómo activo las coordenadas en Minecraft Bedrock sin perder los logros? | Configuración | Minecraft [M2], Trucoman [C7] | Guía oficial de coordenadas y competidor que trata logros. | Media: intención precisa comprobable en juego. | Demostrar interruptor en mundo de prueba y comprobar logros; sin comandos innecesarios. | Trimestral y cambios de interfaz; validar efecto sobre logros antes de afirmar. |
| 15 | ¿Cómo hago una copia de mi mundo de Minecraft en Android antes de cambiar de teléfono? | Respaldo | Minecraft [M3], Juansekill [C8] | Soporte más petición pública de usuarios [U2]. | Media-alta: solución depende de almacenamiento y Android. | Árbol External/Application y prueba de restauración en copia; preservar original. | Mensual; riesgo alto de perder mundos. No recomendar borrar app ni mover archivos originales. |
| 16 | ¿Cómo soluciono «Multijugador desactivado» en Minecraft con una cuenta Microsoft? | Permisos / conexión | Minecraft [M4], Minecraft.How [C9] | Soporte y pregunta pública en Microsoft Q&A [U1]. | Alta: oficial y guías establecidas. | Separar edición, cuenta infantil, permisos y red; intervención del tutor legítimo. | Mensual; no enseñar a falsear edad ni eludir controles. |
| 17 | ¿Cómo activo la A2F de Epic Games para enviar regalos en Fortnite? | Seguridad / regalos | Epic [E1], Authenticator [C10] | Epic confirma requisito de A2F; guías competidoras. | Alta: fuente oficial y guías; valor en evitar cuenta equivocada. | Checklist cuenta vinculada → segundo factor → demás requisitos de regalo. | Mensual; no pedir códigos ni prometer que A2F resuelve todas las restricciones. |
| 18 | ¿Cómo configuro el PIN y los controles parentales de Fortnite? | Seguridad familiar | Epic [E2] | Procedimiento oficial dedicado; demanda cuantitativa no verificada. | Alta: control directo en Epic y requisitos cambiantes. | Mapa de controles de Epic frente a consola y gastos, para tutor. | Mensual; recuperar PIN solo vía oficial, sin bypass. |
| 19 | ¿Cómo recupero mi cuenta de Brawl Stars con Supercell ID? | Recuperación | Supercell [B1] | Centro de soporte mantiene un flujo de cuenta perdida. | Alta: solo proveedor valida titularidad. | Checklist antes de contactar, límites según protección activada. | Mensual; phishing, no recolectar datos de recuperación. |
| 20 | ¿Por qué no llega el código de verificación de Supercell ID en Brawl Stars? | Acceso / correo | Supercell [B2] | FAQ específica y versión oficial Zendesk de códigos de confirmación. | Media-alta: oficial sólido; diagnóstico compacto útil. | Separar correo incorrecto, spam y último código; advertir de bloqueo de intentos según regla vigente. | Mensual; no inventar tiempo de espera ni solicitar códigos. |

**Fuentes consultadas el 16/11/2026.** [F4–F6], [R1–R2], [R6], [M1–M2], [E1] se abrieron directamente además de buscarse. Otras evidencias se obtuvieron de resultados indexados; no confundir extractos con validación de todo el procedimiento. [B2] devolvió contenido no legible al abrir; se contrastó con la [versión oficial de confirmación](https://sc-brawlstars.zendesk.com/hc/es/articles/56123803838619-Ayuda-con-los-c%C3%B3digos-de-confirmaci%C3%B3n). Antes de redactar, abrir fuente completa, verificar región/fecha y probar pasos. Ninguna guía se considera ya validada en el juego.

### Diez prioridades y orden sugerido

| Orden | ID | Motivo de inclusión | Verificación propia antes de publicar |
| --- | --- | --- | --- |
| 1 | 08 | Error concreto, caso público, diagnóstico acotado | Actualización oficial Android/PC; registrar versión y límites |
| 2 | 14 | Configuración reproducible, duradera, respuesta breve | Mundo de prueba Bedrock; interruptor y estado de logros |
| 3 | 07 | Problema móvil identificable, oportunidad de evitar software innecesario | Diferenciar experiencia/red y fallo global; no forzar errores en terceros |
| 4 | 04 | Ayuda a decidir entre FF/MAX y enlaza al diagnóstico | Contrastar tabla oficial con tienda y dispositivo; sin benchmark inventado |
| 5 | 05 | Continúa el recorrido de compatibilidad con acciones reversibles | Prueba segura en cuenta de prueba; ninguna eliminación de datos sin advertencia |
| 6 | 13 | Duda entre teléfono y PC con valor claro | Matriz de ediciones y sesión de prueba; separar puentes externos |
| 7 | 12 | Complementa error 279 con diferencia entre lag de red y gráfico | Prueba en móvil, condiciones y resultados explícitos |
| 8 | 06 | Guía estable más útil que listas diarias de códigos | Flujo oficial y restricciones; no afirmar que un código funciona sin canjearlo |
| 9 | 17 | Seguridad de cuenta y caso concreto de regalos | Cuenta de prueba propia, vínculo correcto; jamás publicar secretos |
| 10 | 20 | Problema estrecho de acceso, fácil de explicar sin recoger datos | Correo de prueba y fuente vigente; no provocar bloqueos deliberados |

Selección editorial provisional: prioriza verificabilidad, utilidad y mantenimiento sobre supuestas visitas. Son 3 Free Fire, 3 Roblox, 2 Minecraft, 1 Fortnite y 1 Brawl Stars. Publicar solo lo que pase revisión; diez es un tope inicial, no una cuota que justifique relleno. Las otras diez se posponen por mayor sensibilidad de recuperación/menores, incertidumbre regional o riesgo de pérdida de datos. La cuenta invitada y las copias de mundos merecen revisión especializada antes de dar pasos irreversibles.

## 4. Arquitectura conceptual del MVP

### Navegación y propiedad de rutas

```text
/                                      Portada Vélix: búsqueda, juegos, herramientas
/juegos                                Índice editorial
/juegos/free-fire                       Categoría con consultas publicadas
/juegos/roblox
/juegos/minecraft
/juegos/fortnite
/juegos/brawl-stars
/juegos/{juego}/{slug}                  Respuesta/guía completa en HTML
/herramientas                          Catálogo; enlaza a URLs antiguas intactas
/comprimir-imagen ... /imagenes-a-pdf   Ocho herramientas actuales
/buscar                                Búsqueda local; noindex,follow
/privacidad /terminos /contacto         Mantener
/viral /memes                          Reservadas conceptualmente; NO generar en MVP
```

No crear páginas vacías, etiquetas, filtros indexables ni duplicados por país. Categoría de un solo artículo solo si tiene resumen editorial útil; de lo contrario agrupar en /juegos y posponer la landing independiente. Navegación visible: Inicio, Juegos, Herramientas; Viral y Memes se incorporarán cuando haya autorización y contenido, sin enlaces rotos «próximamente».

Dueños propuestos: generador editorial controla portada, /juegos, /herramientas y /buscar; generador existente conserva herramientas e informativas; manifiesto compartido detecta colisiones y genera sitemap único. Enlaces entre documentos editoriales y SPA con `<a href>` y navegación completa; no dejar que React Router capture una URL editorial y muestre NotFound. Preservar `/#herramientas` en nueva portada para enlaces existentes. Definir una única política de slash sin cambiar las rutas actuales; verificar respuesta y canonical de cada URL final en Pages.

### Modelo de contenido propuesto

```yaml
id: roblox-error-280
slug: error-280-despues-de-actualizar
game: roblox
type: question
title: "¿Qué hago si Roblox sigue mostrando el error 280 después de actualizar?"
description: "<resumen único y comprobable>"
status: draft
locale: es-419
audience: general
platforms: [android, windows]
answer: "<respuesta directa, revisada por una persona>"
author: "<responsable real>"
reviewer: "<revisor real>"
publishedAt: null
reviewedAt: null
reviewDueAt: null
testedVersions: []
sources: []
related: []
image: null
```

Un esquema validará tipos, slugs únicos, juego permitido, fuentes HTTPS, fechas coherentes, autor/revisor, contenido mínimo útil y relaciones existentes. Draft no genera HTML, sitemap ni índice de búsqueda; no basta ocultarlo con CSS. Frontmatter no admite JavaScript. La revisión no se actualiza automáticamente con cada build. Registrar versión/plataforma y método de prueba o indicar claramente «no probado en este dispositivo». No inventar autores ni sellos de verificación.

### Plantilla y búsqueda

Plantilla: breadcrumbs → H1 → respuesta directa de 2–4 frases → alcance/versión y revisión → pasos y resultados esperados → qué hacer si no funciona → fuentes primarias → relacionados y herramienta pertinente. Tabla de contenido solo si ayuda; evitar texto de relleno y anuncios entre pregunta/respuesta.

Búsqueda local determinista sobre JSON generado (título, pregunta, resumen, juego, URL y palabras clave). Normalizar tildes/mayúsculas; ranking por título y coincidencias, estados vacío/sin resultados, navegación por teclado, anuncio accesible de cantidad y botón limpiar. No usar un LLM ni servicios externos. Descargar índice al interactuar; objetivo inicial <= 50 KB comprimidos. No guardar consultas ni archivos. No enviar query a analítica; preferir estado local o fragmento para no poner términos en logs del servidor. Sin JS ofrecer índices de juegos y herramientas como alternativa. No indexar resultados arbitrarios.

### Imágenes, enlaces y edición

- MVP puede funcionar con diagramas originales y tipografía, sin hero de franquicias.
- Imágenes editoriales en assets con registro de autor, origen, licencia/permiso, atribución, fecha y uso permitido. No usar fotografías aportadas a herramientas.
- Generar variantes WebP/AVIF con fallback, srcset/sizes, width/height; lazy excepto imagen LCP; alt contextual, alt vacío decorativo. No rasterizar texto principal.
- Presupuesto propuesto: cada ilustración <= 150 KB cuando sea viable, sin sacrificar legibilidad de capturas. Medir descarga inicial, no solo tamaño individual.
- Enlaces rastreables categoría ↔ consulta; 2–4 relacionados por intención cuando existan. Evitar enlaces artificiales a todas las páginas.
- Ejemplo útil: guía para compartir capturas → quitar metadatos, recortar o comprimir; no insertar herramientas irrelevantes en todas las respuestas.
- Flujo Git: borrador Markdown → fuente primaria + prueba registrada → revisión editorial/técnica/derechos → CI → revisión visual en preview protegido → PR → aprobación de publicación. Después: revisión periódica, corrección con historial y dateModified solo si cambia el contenido. No programar publicación sin aprobación.

## 5. Propuesta SEO

1. Titles y descripciones únicos, derivados de contenido validado; H1 fiel a la pregunta, sin años añadidos automáticamente.
2. Canonical absoluto autocontenido en velixblue.com, estable y sin parámetros; Open Graph coherente. No canonizar todas las guías a /juegos.
3. Un sitemap de URLs publicadas, indexables y con estado 200. Excluir búsqueda, drafts, 404, previews y páginas vacías. lastmod solo con modificación editorial real.
4. HTML inicial incluye respuesta, pasos, fuentes y enlaces; tests con JS desactivado. No basta cambiar meta tags de una SPA.
5. Conservar separación producción/pruebas. Advertencia técnica: robots Disallow impide rastreo, y Google no puede leer noindex si no rastrea [T3]. La combinación actual reduce exposición pero **no garantiza desindexar un preview ya conocido**. Evaluar protección de acceso en previews y noindex para URLs rastreables; no cambiar política sin autorización ni abrir previews por accidente. Robots no es control de acceso.
6. JSON-LD Article/TechArticle cuando describa realmente una guía, BreadcrumbList en rutas jerárquicas y Organization con datos reales. No usar QAPage para una guía editorial sin respuestas de usuarios. No aplicar FAQPage/HowTo por tener preguntas/pasos ni prometer rich results [T4].
7. 404 real en servidor y noindex; evitar fallback 200 de SPA para slugs inexistentes. Si se retira un artículo: 301 solo a reemplazo equivalente; si no hay reemplazo, 404/410, no redirigir todo a portada.
8. Search Console: acceso por propietario, verificar dominio por DNS si falta, sitemap de producción, inspección de muestra y reporte de páginas. Comparar canonical declarado/elegido, exclusiones y rastreo. Solicitar indexación solo de URLs listas; Google decide qué rastrea/indexa. No exigir 100 %.
9. Medición separada de consultas de marca/no marca, páginas y países (Panamá y otros LATAM); no usar ranking global supuesto. Si hay pocas impresiones, declarar muestra insuficiente.

## 6. Diseño conceptual, sin implementar interfaz

Identidad observada: **tema oscuro azul**, no el fondo claro de la idea inicial. Conservar night #070b1d, panel #0c1330, electric #2f7bff, mist #a9b3d6, Plus Jakarta Sans y lenguaje de tarjetas. Validar contraste de cada combinación; un token de marca no garantiza accesibilidad.

### Portada (wireframe de contenido)

```text
[Vélix Blue]                  [Juegos] [Herramientas] [Menú]
Resuelve tu próxima duda.
[ Buscar una pregunta o herramienta…                 🔎 ]
[ Free Fire ] [ Roblox ] [ Minecraft ] [ Más juegos ]
Preguntas para empezar
  [Pregunta concreta] [Juego · Plataforma · Revisada…]
  [Pregunta concreta] [Respuesta breve y enlace]
Herramientas privadas
  [Comprimir] [Eliminar fondo] [OCR] [Ver las 8]
Cómo revisamos las respuestas · Contacto · Privacidad
```

No rotular «populares» hasta disponer de evidencia de uso; inicialmente «Preguntas para empezar» o «Selección editorial». En móvil una columna, buscador visible, categorías que se ajustan sin scroll horizontal obligatorio; escritorio máximo 1200 px. Sin carrusel, autoplay ni mascota tapando controles. Respetar ancla #herramientas.

### Consulta

```text
Inicio > Juegos > Roblox
¿Qué hago si Roblox sigue mostrando el error 280…?
[ Respuesta directa y alcance: texto por verificar antes de publicar ]
Revisado: fecha real · Plataforma · Autor/revisor
En esta guía: diagnóstico / pasos / cuándo acudir a soporte
1. Comprobación segura → resultado esperado
2. Siguiente paso según el resultado
[Captura propia autorizada o diagrama original, si aporta]
Fuentes y qué respalda cada una
Preguntas relacionadas                    Herramienta útil (si procede)
```

Lectura de 60–75 caracteres por línea en escritorio, 16–18 px como punto de partida, interlineado 1.5–1.7, objetivos táctiles >= 44 px como meta de diseño, zoom sin pérdida de contenido. Orden DOM igual al visual, foco visible, búsqueda con etiqueta, sin información transmitida solo por color.

**Blue ya existe:** public/blue-vivo.svg, BlueHint y estilos blue-welcome están en main. Conservar su presencia actual; no asumir que se debe introducir o eliminar. Antes de extenderlo al editorial: revisar titularidad del asset, tono (ayudante frente a falsa autoridad), comprensión con adultos/menores y coste visual. Propuesta MVP: no añadir Blue en nuevas guías hasta que Dirección apruebe esa compatibilidad; no debe afirmar haber revisado contenido ni analizar imágenes del usuario.

## 7. Seguridad, derechos y política editorial

| Titular / material | Evidencia | Decisión conservadora propuesta |
| --- | --- | --- |
| Minecraft | Usage Guidelines [L1] permite usos condicionados y distingue marcas, webs, capturas y promociones | Mantener Vélix como marca principal; no extrapolar permisos de vídeos a todo uso comercial. Revisar cada captura/uso y aviso; dominio neutral no contiene marca ajena |
| Roblox | Guía de nombre/logo [L2] regula usos específicos y badge de creadores | Nombrar el juego descriptivamente no autoriza reutilizar logo/arte ni contenido de creadores; preferir diagramas propios |
| Garena | Términos [L3], derechos reservados y reglas de UGC | No se verificó una licencia general para un portal comercial; no asumir que la disponibilidad de un asset permite republicarlo |
| Epic | Fan Content Policy [L4] limita a contenido personal no comercial; excepción de monetización de vídeos de fans individuales | No tratar esa excepción como autorización de anuncios en web corporativa con arte Fortnite; texto original y enlaces, assets solo con base confirmada |
| Supercell | Fan Content Policy [L5] admite ciertos anuncios/donaciones/coaching bajo condiciones | Conservar avisos exigidos, no aparentar respaldo y verificar restricciones de modificación de assets |
| Memes/vídeos/imágenes de terceros | La viralidad no es licencia | No descargar/republicar en MVP; consentimiento/licencia trazable, sin asumir fair use panameño a partir de normas de otro país |

La investigación de políticas **no es una autorización jurídica particular**. Para cada archivo, conservar evidencia del permiso exacto y alcance comercial/territorial. CC BY exige atribución; NC no sirve para publicidad sin otro permiso; ND restringe derivados; SA puede exigir compartir adaptaciones bajo iguales condiciones. Verificar licencia en la página original, no en el buscador. Captura propia no elimina los derechos del juego, música, marcas o usuarios visibles. Anonimizar chats, nombres e IDs; no crear capturas falsas como prueba.

No publicar hacks, APK modificadas, generadores de monedas, suplantaciones de soporte ni promesas de recuperación. Las instrucciones de cuentas deben remitir a canales oficiales y no solicitar contraseñas, códigos, documentos, datos de menores ni pagos. No comentarios/UGC en MVP: evita moderación y almacenamiento sin necesidad demostrada.

Markdown solo de colaboradores autorizados, sin imports/JS/HTML crudo. Enlaces con protocolos permitidos, escape en HTML/XML/JSON-LD; tests contra script, javascript:, ruptura de atributo y </script>. Nunca ejecutar código del frontmatter. Auditar dependencias con lockfile y licencias antes de incorporar parser/optimizador.

Mantener límites de imágenes, cancelación, URLs temporales y procesamiento local. Sin herramientas de tracking nuevas ni publicidad real. Auditar primero analítica del proveedor y textos legales actuales; las búsquedas del portal también pueden contener información personal. No rebajar COOP/COEP para insertar vídeos o widgets de terceros.

## 8. Plan de implementación de 30 días (solo tras autorización)

Estimación para una persona técnica con revisión editorial disponible. El plazo empieza con la aprobación, no con este informe; si las pruebas o derechos no están listos, reducir alcance.

| Días | Entregable futuro / archivos | Criterio de salida |
| --- | --- | --- |
| 1–3 | Baseline: docs de URLs/headers/build, inventario, medición móvil; propuesta de .github/workflows/ci.yml | Ejecutar suite actual, registrar fallos previos, producción y preview; decidir generador vs Astro con evidencia |
| 4–7 | content/juegos/*.md (borradores); scripts/lib/content-schema.mjs, scripts/generate-content.mjs, editorial/templates/QuestionPage.*; integrar package.json | Una fixture de prueba genera HTML completo, escapado, sin indexar drafts; ninguna ruta antigua cambia |
| 8–11 | editorial/templates/Home.*, Category.*, Tools.*, Search.*; editorial/search.ts; tokens compartidos mínimos; ajustar Layout/App solo para enlaces editoriales | Navegación cruzada y buscador teclado, sin cargar motor IA en guías; sin páginas vacías |
| 12–17 | Hasta cinco consultas prioritarias, registro de fuentes/pruebas y assets/licencias | Revisión humana, aporte propio y fuentes vigentes; pendientes se quedan draft |
| 18–22 | Hasta cinco consultas restantes; scripts de sitemap/manifiesto; ajustes generate-static-pages y generate-service-worker | Diez como máximo; sitemap único, SW sin precarga masiva, privacidad intacta |
| 23–26 | tests/content.test.*, tests/seo-build.test.ts, e2e/editorial.mjs; regresión smoke/OCR/pincel | JS desactivado, XSS/links/drafts, herramientas y descargas; Chrome/Firefox/WebKit y móvil real |
| 27–29 | Auditoría derechos, accesibilidad, presupuesto, previews y rollback; docs/publicacion-editorial.md y docs/VELIX_ESTADO.md | Evidencia por criterio, incidencias abiertas y plan de reversión ensayado |
| 30 | PR final y demostración a Dirección | **Aprobación separada antes de fusionar/desplegar**; fecha no obliga a lanzar |

Nombres de archivos nuevos son propuestas, no existentes. No cambiar src/lib/imageProcessing, backgroundRemoval, metadata, ocr ni imagePdf por la transformación editorial. Si un fallo previo exige corregirlos, aislarlo en PR independiente con alcance aprobado.

### Matriz de pruebas y aceptación

- **Contenido:** esquema, slugs colisionantes, fechas/referencias, drafts excluidos, relacionados válidos, búsqueda con tildes y cero resultados, enlaces peligrosos escapados.
- **SEO:** doce URLs anteriores preservadas; nuevas publicadas 200, inexistentes 404; titles/descriptions/canonical únicos; HTML con respuesta completa sin JS; sitemap XML parseable y sin previews/drafts; JSON-LD coherente.
- **Ambientes:** build local sin SITE_URL noindex; producción explícita o main Cloudflare indexable; preview incluso con variables heredadas bloqueado; host pages.dev protegido; revisar headers reales, no solo unit test.
- **Regresión herramientas:** ejecutar npm test, npm run build, npm run test:e2e, npm run test:e2e:ocr-crop y node e2e/mask-brush.mjs; probar lotes/ZIP, target KB, transparencia, 6750×9000 y 108 MP, cancelación, OCR real y fallo de motor, PDF, metadatos y offline.
- **Navegador:** Chromium, Firefox y WebKit automatizados más Safari iPhone y Chrome Android reales cuando estén disponibles. Emulación no equivale a dispositivo físico; registrar lo no ejecutado.
- **Privacidad:** monitorizar red durante carga/procesamiento; ninguna foto, texto OCR, contraseña ni consulta de búsqueda sale por implementación propia. Distinguir descargas de assets de subidas de datos. Verificar integración de analítica externa en producción.
- **Accesibilidad:** teclado y lector de pantalla en flujos críticos; sin hallazgos graves/críticos automatizados, contraste medido, 320/390/768/1440 px, zoom 200 %, reduced-motion; automatización no certifica conformidad completa.
- **Rendimiento propuesto:** editorial inicial <= 250 KB comprimidos excluyendo contenido multimedia solicitado después, JS editorial <= 50 KB, cero ONNX/OCR/PDF descargados al leer una guía. Medir con caché fría y un perfil móvil documentado, mediana de tres corridas. Investigar regresiones >10 % contra baseline de herramientas, no comparaciones entre máquinas.
- **CWV:** objetivos de campo p75 LCP <=2.5 s, INP <=200 ms, CLS <=0.1 donde exista muestra suficiente. Laboratorio sirve para detectar problemas, no prueba cumplimiento real; no hay mediciones actuales en este informe.
- **Editorial/derechos:** cada artículo tiene respuesta útil, autor/revisor real, alcance, fuente primaria, fecha verdadera y aporte comprobado; cada asset tiene base de uso. No exigir volumen mínimo de palabras ni indexación del 100 %.
- **Release:** revisión por Dirección, build reproducible, URL/headers comprobados, rollback preparado. Ningún error crítico nuevo abierto.

### Costos estimados, sin compras

Supuestos propios de planificación, no cotización: 60–90 horas de desarrollo/QA y 25–40 de investigación/redacción/revisión de diez guías; total 85–130 h. A una tarifa **ilustrativa** de USD 20–35/h, presupuesto laboral USD 1700–4550; reemplazar por tarifa real de Blue Lab. Reservar margen dentro del calendario y recortar cantidad de artículos si falta capacidad.

Infraestructura incremental puede ser USD 0/mes manteniéndose en plan gratuito y cuotas: estáticos, repositorio y búsqueda local; no CMS, base de datos ni API pagada. Cloudflare Pages documenta límites, incluidos archivos y builds [T5]; Pages Functions tiene cuotas propias que deben verificarse en la cuenta antes de asegurar costo cero. Dominio ya existente, renovación y correo según factura del propietario; no inventar precio. Licencias/asesoría legal y acceso a dispositivos/cuentas de prueba son costos por confirmar, no asumidos gratuitos. No hay previsión de visitas, publicidad ni ingresos.

### Reversión

Guardar SHA y deployment ID de producción antes del lanzamiento autorizado, configuración de build y manifiesto de URLs; excluir secretos del informe. Un PR por etapa, sin mover rutas ni migrar datos. Ante regresión de herramientas o SEO: revertir commit editorial y desplegar artefacto previo mediante operación autorizada; revisar robots, headers, canonicals y descarga real.

El service worker exige atención especial: volver a desplegar HTML viejo no elimina automáticamente caches/control de un SW nuevo. Ensayar actualización de versión, limpieza solo de caches de aplicación de Vélix y aviso de recarga sin perder archivos en uso. Nunca limpiar indiscriminadamente almacenamiento del usuario. No cambiar política pública de URLs después de indexar sin revisar redirecciones; no automatizar revert/despliegue en esta fase.

### Métricas de 30, 45 y 60 días desde un lanzamiento autorizado

| Momento | Qué observar | Decisión |
| --- | --- | --- |
| Día 30 | Cobertura técnica, URLs descubiertas/rastreadas, impresiones/clics por consulta/país/página, errores herramientas, cumplimiento de revisiones | Resolver bloqueos y contenido confuso; si no hay muestra, documentar insuficiencia en lugar de atribuir fracaso SEO |
| Día 45 | Comparación por cohortes de igual antigüedad; CTR condicionado por posición, consultas no cubiertas, rendimiento móvil y contactos útiles | Actualizar prioridades con datos; no multiplicar artículos a ciegas |
| Día 60 | Evolución de impresiones/clics, calidad de respuestas, costo de mantenimiento y regresiones; nuevos datos de campo si existen | Mantener/ajustar Juegos; Viral/Memes requieren nueva decisión, no expansión automática |

Search Console como primera fuente, sin nueva analítica invasiva. Métricas de búsqueda interna o completado de herramientas requieren instrumentación futura aprobada y revisión de privacidad; hoy no se declaran disponibles. No guardar consultas libres ni fotografías para «medir éxito». No fijar metas inventadas de tráfico/ingresos ni confundir impresiones con utilidad.

## 9. Riesgos y decisiones pendientes de Dirección

1. Autorizar MVP editorial incremental con máximo diez consultas y conservar todas las URLs.
2. Confirmar responsable editorial y revisión en juegos/dispositivos reales.
3. Confirmar estado actual de producción, Search Console, Cloudflare Functions, main y preview protection.
4. Aprobar política de assets, textos de no afiliación y revisión jurídica; no usar arte de franquicias por defecto.
5. Resolver si Blue aparece en contenido editorial tras evaluar marca y derechos; no ampliar ahora.
6. Autorizar implementación y presupuesto en una orden nueva. Aprobar este informe o el PR documental **no autoriza despliegue**.

Riesgos principales: regresión SPA/PWA, vacíos HTML, autoindexación de previews, información desactualizada de cuentas/menores, pérdida de mundos si se dan pasos inseguros, derechos de imágenes y sobreestimación de demanda regional. Mitigaciones y aceptación constan arriba; los pendientes no se presentan como pruebas superadas.

## 10. Registro de fuentes

Enlaces consultados mediante búsqueda web y, donde se indicó, apertura directa el 16/11/2026. Fuentes oficiales respaldan reglas/procedimientos; competidores y comunidad respaldan existencia de contenido/preguntas, no garantizan exactitud. La lista no implica aval de sus servicios. El informe no reproduce sus artículos.

- **F1** — [Garena: recuperar cuenta invitada](https://ffsoporte.garena.com/hc/es-419/articles/11511268620953--C%C3%B3mo-recupero-mi-cuenta-de-invitado)
- **F2** — [Garena: pérdida de acceso a red social](https://ffsoporte.garena.com/hc/es-419/articles/47385907830681--Perdiste-acceso-a-la-red-social-con-la-que-juegas-Free-Fire-Facebook-Gmail-Twitter-o-Apple-ID)
- **F3** — [Garena: región de la cuenta](https://ffsoporte.garena.com/hc/es-419/articles/6104465634713--C%C3%B3mo-puedo-ver-la-regi%C3%B3n-a-la-que-pertenece-mi-cuenta)
- **F4** — [Garena: requisitos FF y MAX](https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX)
- **F5** — [Garena: pantalla negra y cierres](https://ffsoporte.garena.com/hc/es-419/articles/360031213792-Mi-juego-est%C3%A1-fallando-Pantalla-negra-cierra-solo-no-carga)
- **F6** — [Garena: códigos promocionales](https://ffsoporte.garena.com/hc/es-419/articles/360039499772--Como-puedo-redimir-un-c%C3%B3digo-promocional)
- **R1** — [Roblox: error 279](https://en.help.roblox.com/hc/es/articles/36794291921684-C%C3%B3digo-de-error-279-ID-17-Error-al-conectarse-al-juego)
- **R2** — [Roblox: error 280](https://en.help.roblox.com/hc/en-us/articles/36792120219284-Error-Code-280-Your-version-of-Roblox-may-be-out-of-date-Please-update-Roblox-and-try-again)
- **R3** — [Roblox: contraseña olvidada](https://en.help.roblox.com/hc/es/articles/203313070-Olvid%C3%A9-mi-contrase%C3%B1a)
- **R4** — [Roblox: controles parentales](https://en.help.roblox.com/hc/es/articles/30428248050068-Preguntas-frecuentes-de-los-controles-parentales)
- **R5** — [Roblox: canje](https://www.roblox.com/es/redeem)
- **R6** — [Roblox: reducir lag](https://en.help.roblox.com/hc/en-us/articles/203314150-How-to-Reduce-Lag-and-Speed-Up-Play)
- **M1** — [Minecraft: Java o Bedrock](https://www.minecraft.net/es-mx/article/java-or-bedrock-edition)
- **M2** — [Minecraft: coordenadas](https://www.minecraft.net/es-mx/article/exploring-minecraft)
- **M3** — [Minecraft: backup Android](https://help.minecraft.net/hc/en-us/articles/26883028637965-Save-a-Backup-of-Minecraft-Bedrock-Edition-Worlds-on-Android)
- **M4** — [Minecraft: multijugador](https://help.minecraft.net/hc/es-es/articles/4409236107789-Minecraft-Multiplayer-Connectivity-Issues)
- **E1** — [Epic: A2F](https://www.epicgames.com/help/c-32735058/c-37477814/a10075388?lang=en-US)
- **E2** — [Epic: configurar control parental](https://www.epicgames.com/help/c-45487929/c-43755296/a18778792?lang=en-US)
- **B1** — [Supercell: cuenta perdida](https://support.supercell.com/brawl-stars/es_latam/articles/ive-lost-access-to-my-account-2.html)
- **B2** — [Supercell: códigos de verificación](https://support.supercell.com/brawl-stars/es_latam/articles/supercell-id-help-with-verification-codes.html)
- **C1** — [TyC Sports: recuperar Free Fire](https://www.tycsports.com/gaming/free-fire-garena-recuperar-cuenta-id-id344151.html)
- **C2** — [FFVIP: código inválido](https://ffvip.com.br/codigo-invalido-free-fire/)
- **C3** — [ExitLag: error 279](https://www.exitlag.com/blog/es/error-279-roblox/)
- **C4** — [Jugador: actualizar Roblox](https://jugador.app/pc/actualizar-roblox-pc-y-celular/)
- **C5** — [Genghis: tarjetas Roblox](https://help.genghis.pro/hc/es/articles/30587380887324--C%C3%B3mo-canjeo-una-tarjeta-regalo-Roblox)
- **C6** — [Minecraftbedrock.io: juego cruzado](https://minecraftbedrock.io/sp/faq.html)
- **C7** — [Trucoman: coordenadas](https://trucoman.com/minecraft-como-activar-coordenadas/)
- **C8** — [Juansekill: mundos y copias](https://juansekill.com/es/donde-se-guardan-mundos-minecraft-bedrock)
- **C9** — [Minecraft.How: multijugador desactivado](https://minecraft.how/es/blog/articulo/minecraft-multiplayer-disabled-microsoft-settings)
- **C10** — [Authenticator: A2F Fortnite](https://www.authenticator.sh/es/2fa/fortnite)
- **U1** — [Microsoft Q&A: multijugador desactivado](https://learn.microsoft.com/es-es/answers/questions/3963785/modo-multijugador-est-desactivado-por-favor-compru)
- **U2** — [Minecraft Feedback: copia y exportación en celular](https://feedback.minecraft.net/hc/en-us/community/posts/44789191130509-Copia-y-exportaci%C3%B3n-de-mundos-en-celular?sort_by=created_at)
- **U3** — [Roblox DevForum: error 280](https://devforum.roblox.com/t/error-code-280-cant-access-games-with-my-profile-on-any-device/2947706)
- **P1** — [Panatickets: Bobicraft en Panamá](https://panatickets.boletosenlinea.events/eventperformances.asp?evt=2229)
- **P2** — [Panamá América: Roblox y cumbia panameña](https://www.panamaamerica.com.pa/variedades/samy-y-sandra-sandoval-llegan-roblox-como-sera-el-baile-virtual-1265978)
- **P3** — [OLA GG: torneos Free Fire](https://olagg.io/es/torneos)
- **P4** — [Esports Earnings: jugadores panameños de Free Fire](https://www.esportsearnings.com/games/598-free-fire/countries/pa)
- **L1** — [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines)
- **L2** — [Roblox Name and Logo Guidelines](https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Guidelines)
- **L3** — [Garena Terms](https://content.garena.com/legal/tos/tos_en.html)
- **L4** — [Epic Fan Content Policy](https://legal.epicgames.com/epicgames/fan-art-policy)
- **L5** — [Supercell Fan Content Policy](https://supercell.com/en/fan-content-policy/)
- **T1** — [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- **T2** — [Astro React](https://docs.astro.build/en/guides/integrations-guide/react/)
- **T3** — [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- **T4** — [Google: cambios FAQ y HowTo](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- **T5** — [Cloudflare Pages: límites](https://developers.cloudflare.com/pages/platform/limits/)

[F1]: https://ffsoporte.garena.com/hc/es-419/articles/11511268620953--C%C3%B3mo-recupero-mi-cuenta-de-invitado
[F2]: https://ffsoporte.garena.com/hc/es-419/articles/47385907830681--Perdiste-acceso-a-la-red-social-con-la-que-juegas-Free-Fire-Facebook-Gmail-Twitter-o-Apple-ID
[F3]: https://ffsoporte.garena.com/hc/es-419/articles/6104465634713--C%C3%B3mo-puedo-ver-la-regi%C3%B3n-a-la-que-pertenece-mi-cuenta
[F4]: https://ffsoporte.garena.com/hc/es-419/articles/360035195832-Requerimientos-t%C3%A9cnicos-Free-Fire-Free-Fire-MAX
[F5]: https://ffsoporte.garena.com/hc/es-419/articles/360031213792-Mi-juego-est%C3%A1-fallando-Pantalla-negra-cierra-solo-no-carga
[F6]: https://ffsoporte.garena.com/hc/es-419/articles/360039499772--Como-puedo-redimir-un-c%C3%B3digo-promocional
[R1]: https://en.help.roblox.com/hc/es/articles/36794291921684-C%C3%B3digo-de-error-279-ID-17-Error-al-conectarse-al-juego
[R2]: https://en.help.roblox.com/hc/en-us/articles/36792120219284-Error-Code-280-Your-version-of-Roblox-may-be-out-of-date-Please-update-Roblox-and-try-again
[R3]: https://en.help.roblox.com/hc/es/articles/203313070-Olvid%C3%A9-mi-contrase%C3%B1a
[R4]: https://en.help.roblox.com/hc/es/articles/30428248050068-Preguntas-frecuentes-de-los-controles-parentales
[R5]: https://www.roblox.com/es/redeem
[R6]: https://en.help.roblox.com/hc/en-us/articles/203314150-How-to-Reduce-Lag-and-Speed-Up-Play
[M1]: https://www.minecraft.net/es-mx/article/java-or-bedrock-edition
[M2]: https://www.minecraft.net/es-mx/article/exploring-minecraft
[M3]: https://help.minecraft.net/hc/en-us/articles/26883028637965-Save-a-Backup-of-Minecraft-Bedrock-Edition-Worlds-on-Android
[M4]: https://help.minecraft.net/hc/es-es/articles/4409236107789-Minecraft-Multiplayer-Connectivity-Issues
[E1]: https://www.epicgames.com/help/c-32735058/c-37477814/a10075388?lang=en-US
[E2]: https://www.epicgames.com/help/c-45487929/c-43755296/a18778792?lang=en-US
[B1]: https://support.supercell.com/brawl-stars/es_latam/articles/ive-lost-access-to-my-account-2.html
[B2]: https://support.supercell.com/brawl-stars/es_latam/articles/supercell-id-help-with-verification-codes.html
[C1]: https://www.tycsports.com/gaming/free-fire-garena-recuperar-cuenta-id-id344151.html
[C2]: https://ffvip.com.br/codigo-invalido-free-fire/
[C3]: https://www.exitlag.com/blog/es/error-279-roblox/
[C4]: https://jugador.app/pc/actualizar-roblox-pc-y-celular/
[C5]: https://help.genghis.pro/hc/es/articles/30587380887324--C%C3%B3mo-canjeo-una-tarjeta-regalo-Roblox
[C6]: https://minecraftbedrock.io/sp/faq.html
[C7]: https://trucoman.com/minecraft-como-activar-coordenadas/
[C8]: https://juansekill.com/es/donde-se-guardan-mundos-minecraft-bedrock
[C9]: https://minecraft.how/es/blog/articulo/minecraft-multiplayer-disabled-microsoft-settings
[C10]: https://www.authenticator.sh/es/2fa/fortnite
[U1]: https://learn.microsoft.com/es-es/answers/questions/3963785/modo-multijugador-est-desactivado-por-favor-compru
[U2]: https://feedback.minecraft.net/hc/en-us/community/posts/44789191130509-Copia-y-exportaci%C3%B3n-de-mundos-en-celular?sort_by=created_at
[U3]: https://devforum.roblox.com/t/error-code-280-cant-access-games-with-my-profile-on-any-device/2947706
[P1]: https://panatickets.boletosenlinea.events/eventperformances.asp?evt=2229
[P2]: https://www.panamaamerica.com.pa/variedades/samy-y-sandra-sandoval-llegan-roblox-como-sera-el-baile-virtual-1265978
[P3]: https://olagg.io/es/torneos
[P4]: https://www.esportsearnings.com/games/598-free-fire/countries/pa
[L1]: https://www.minecraft.net/en-us/usage-guidelines
[L2]: https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Guidelines
[L3]: https://content.garena.com/legal/tos/tos_en.html
[L4]: https://legal.epicgames.com/epicgames/fan-art-policy
[L5]: https://supercell.com/en/fan-content-policy/
[T1]: https://docs.astro.build/en/guides/content-collections/
[T2]: https://docs.astro.build/en/guides/integrations-guide/react/
[T3]: https://developers.google.com/search/docs/crawling-indexing/block-indexing
[T4]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
[T5]: https://developers.cloudflare.com/pages/platform/limits/

### Evidencia del repositorio (base fija)

- [package.json](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/package.json)
- [App y rutas](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/src/App.tsx)
- [Catálogo](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/src/lib/tools.ts)
- [Generación SEO](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/scripts/generate-static-pages.mjs)
- [Service worker](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/scripts/generate-service-worker.mjs)
- [Middleware](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/functions/_middleware.ts)
- [README](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/README.md)
- [Licencias](https://github.com/gabrielvillarreta555-code/pixeltools/blob/dd79661f817f24074ae6f7854f5ee5f81fc8dedb/THIRD_PARTY_NOTICES.md)

## 11. Entrega y continuidad

Este cambio debe contener exclusivamente docs/VELIX_2_0_INVESTIGACION.md y docs/VELIX_ESTADO.md en rama documental. No cambiar lockfile, web, scripts, headers ni configuración. Verificar diff y leer ambos archivos después de guardarlos. No fusionar ni ejecutar despliegues.

El entorno impidió ejecutar suites, y el acceso web no permitió confirmar producción: estas limitaciones permanecen abiertas. El PR documental puede activar checks o previews automáticos ya configurados por el proveedor; no se solicita ni ejecuta un despliegue manual. La fase de desarrollo permanece pendiente de autorización.

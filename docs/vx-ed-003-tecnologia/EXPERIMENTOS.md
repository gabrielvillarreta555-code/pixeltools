# Propuestas de experimentos · VX-ED-003 (Tecnología)

27 de noviembre de 2026. **Ninguno de estos experimentos se ha realizado.** Son metodologías propuestas; su ejecución requiere aprobación independiente, equipos y tiempo. Ningún artículo de Vélix puede citar resultados de estas pruebas hasta que se hayan realizado y documentado.

## Principios comunes

1. **Protocolo publicado antes de medir.** Se fija el método, las variables y el criterio de análisis antes de ver los datos, y se publica junto a los resultados.
2. **Repeticiones.** Mínimo tres repeticiones por condición; publicar la dispersión, no solo la media.
3. **Estado térmico inicial controlado.** Android recomienda esperar a que el dispositivo vuelva a un estado térmico sostenible antes de cada prueba y vigilar el estado térmico durante la medición ([modo de rendimiento fijo](https://developer.android.com/games/optimize/adpf/fixed-performance-mode)).
4. **Entorno documentado.** Temperatura ambiente, versión del sistema, versión del juego, batería inicial, brillo, conectividad y apps instaladas.
5. **Sin conflicto de interés.** Declarar quién aporta cada equipo (compra propia, préstamo del fabricante) y que el fabricante no revisa los resultados.
6. **Datos abiertos.** Publicar los datos en bruto (CSV) y los scripts.
7. **Límites explícitos.** Un modelo y una unidad no representan a todas las unidades de ese modelo.

## Herramientas candidatas

Hay que validarlas en un piloto antes del primer experimento.

| Necesidad | Opción | Coste | Reserva |
|---|---|---|---|
| FPS y tiempos de fotograma | Contador de FPS de Game Dashboard (Pixel); `adb shell dumpsys SurfaceFlinger` con métricas de latencia | Gratuito | Game Dashboard solo existe en Pixel. Hay que comprobar en el piloto qué método captura bien los juegos que usan Vulkan |
| Estado térmico del sistema | `adb shell dumpsys thermalservice`; Thermal API con `getThermalHeadroom` en una app de prueba propia | Gratuito | Los sensores y su exposición varían por fabricante |
| Temperatura superficial | Termómetro infrarrojo o termopar con registrador | Compra de equipo (requiere aprobación) | Emisividad de la superficie; medir siempre el mismo punto |
| Consumo energético | `adb shell dumpsys batterystats`; caída del porcentaje de batería en un intervalo fijo | Gratuito | Resolución baja; un medidor USB externo no mide bien mientras el teléfono usa la batería |
| Benchmarks sintéticos | AnTuTu, 3DMark (Wild Life Extreme y su prueba de estrés), Geekbench | Versiones gratuitas; algunas funciones de pago | Anotar la versión exacta de cada benchmark |
| Ambiente | Termohigrómetro; sala sin luz solar directa | Bajo | Climatización estable durante toda la sesión |

No se usarán herramientas que exijan crear cuentas ni servicios de pago sin aprobación previa (restricción vigente).

---

## X1. ¿El modo juego mejora el rendimiento?

- **Pregunta:** ¿Cambian los FPS, la estabilidad y la temperatura al activar el modo rendimiento o batería frente al estándar?
- **Hipótesis:** el modo rendimiento eleva los FPS iniciales y acelera el calentamiento; el modo batería reduce FPS y consumo. El efecto depende de si el juego implementa Game Mode.
- **Equipos:** 3 teléfonos de marcas distintas con herramienta de modo juego (Samsung, Xiaomi y Pixel), uno por gama si es posible.
- **Juegos:** uno que declare compatibilidad con Game Mode y uno que no. Hay que confirmarlo antes, en la información de la app o con el estudio.
- **Variable independiente:** modo (estándar, rendimiento, batería).
- **Variables dependientes:** FPS medio, percentil 1 % bajo, estabilidad (peor minuto / mejor minuto), temperatura superficial cada minuto, batería consumida.
- **Controles:** mismo escenario reproducible (modo práctica o repetición), 20 minutos, brillo fijo, modo avión con Wi-Fi si el juego lo permite, misma temperatura inicial.
- **Limitación:** sin escenario reproducible en el juego, la variabilidad de la partida puede ser mayor que el efecto medido.

## X2. Relación entre temperatura y FPS

- **Pregunta:** ¿En qué momento y a qué temperatura empieza a caer el rendimiento en cada modelo?
- **Equipos:** 3–5 modelos, incluidos dos con el mismo procesador (permite contrastar el artículo 37).
- **Procedimiento:** sesión de 30 minutos con el mismo juego y ajustes; registro por segundo de FPS y por minuto de temperatura superficial y estado térmico del sistema.
- **Variables:** temperatura ambiente en dos niveles (p. ej. 22 °C y 30 °C, si se puede controlar), con funda y sin funda.
- **Salida:** curvas de FPS y temperatura en el tiempo; tiempo hasta la primera caída sostenida.
- **Limitación:** la temperatura superficial no es la del chip; se publica como tal.

## X3. Consumo según la configuración gráfica

- **Pregunta:** ¿Cuánta batería ahorra bajar la calidad gráfica o el límite de FPS en una sesión de juego?
- **Equipos:** 2–3 modelos con batería en buen estado (anotar la salud de la batería si el sistema la muestra).
- **Variables:** calidad (baja, media, alta) × límite de FPS (30, 60, máximo disponible).
- **Procedimiento:** carga al 100 %, reposo 10 minutos, sesión de 30 minutos, registro del porcentaje inicial y final y de `batterystats`.
- **Limitación:** el porcentaje de batería tiene poca resolución; repetir y publicar los rangos.

## X4. Influencia de la RAM virtual

- **Pregunta:** ¿Activar o desactivar RAM Plus o la extensión de memoria cambia los FPS, los tiempos de carga o cuántas veces se recarga el juego al cambiar de app?
- **Equipos:** un Samsung con RAM Plus y un Xiaomi con extensión de memoria; idealmente, variantes con poca RAM física (4–6 GB).
- **Variables:** RAM virtual desactivada / tamaño por defecto / tamaño máximo, reiniciando el teléfono entre condiciones (lo exigen ambos fabricantes).
- **Medidas:** FPS en sesión de 15 minutos; tiempo de carga de la partida; prueba de cambio de app (abrir cinco apps fijas y volver al juego, ¿se recarga?).
- **Limitación:** los resultados dependen de las apps instaladas; usar un conjunto fijo y documentado.

## X5. Benchmarks sintéticos frente a rendimiento real

- **Pregunta:** ¿Ordenan AnTuTu, Geekbench y 3DMark los teléfonos igual que los FPS sostenidos en juegos reales?
- **Equipos:** 5–8 modelos de distintas gamas.
- **Procedimiento:** ejecutar cada benchmark tres veces desde el mismo estado térmico; medir dos juegos en sesiones de 20 minutos.
- **Análisis:** correlación de rangos (Spearman) entre cada benchmark y los FPS sostenidos. Publicar los casos donde el orden no coincide.
- **Limitación:** con pocos modelos la correlación es frágil; se presenta como exploratoria.

## X6. Límite de FPS y estabilidad (propuesta adicional)

- **Pregunta:** ¿Limitar los FPS produce partidas más estables en sesiones largas que dejar el máximo?
- **Variables:** límite de FPS (máximo disponible frente a un valor inferior), 30 minutos.
- **Medidas:** FPS medio, 1 % bajo, estabilidad, temperatura final.
- **Motivo:** sostiene o corrige la recomendación práctica del artículo 36.

## X7. ¿Funcionan las apps de «game booster» y limpiadores? (propuesta adicional)

- **Pregunta:** ¿Mejoran el FPS o los tiempos de carga respecto a no usarlas?
- **Procedimiento:** misma sesión con y sin la app; revisar también qué permisos solicita cada app.
- **Reserva ética:** no recomendar ni enlazar apps que pidan permisos excesivos; la revisión de permisos se publica aunque no haya diferencia de rendimiento.

## Recursos estimados

| Recurso | Estimación | Comentario |
|---|---|---|
| Teléfonos | 3–8 según el experimento | Compra o préstamo; declarar la procedencia. **Coste no estimado**: requiere precios observados por mercado |
| Termómetro IR o termopar con registrador | 1 | Compra pequeña, requiere aprobación |
| Termohigrómetro | 1 | Compra pequeña, requiere aprobación |
| Tiempo | 2–4 días-persona por experimento, más el piloto | Incluye preparación, repeticiones, análisis y redacción |

Orden propuesto: un piloto de herramientas, después X2 (base de los demás) y X1, y luego X5.

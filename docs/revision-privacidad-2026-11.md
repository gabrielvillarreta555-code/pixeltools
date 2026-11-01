# Revisión técnica de privacidad — 1 de noviembre de 2026

## Observación

En tres visitas de prueba sin imágenes de usuario a `velixblue.com`, `/eliminar-fondo` y `/extraer-texto`, la respuesta final cargó un script desde `static.cloudflareinsights.com` y el navegador envió una petición POST a `/cdn-cgi/rum` en el mismo dominio. Las claves observadas corresponden a tiempos de carga, URL de página, versiones y datos técnicos. No se almacenaron identificadores, el cuerpo completo de los mensajes, direcciones IP ni datos financieros o fotografías.

Esta prueba demuestra actividad de medición en esas visitas; no demuestra todos los campos, retención, cookies, destinatarios, comportamiento de todos los navegadores ni cumplimiento legal. No es una auditoría de Cloudflare. No se modificó la configuración de la cuenta, se borraron datos ni se desactivaron servicios.

## Acciones pendientes del propietario

1. Revisar en Cloudflare la configuración real de Web Analytics/inyección automática, ámbitos, datos, finalidad, conservación y opciones de desactivación. El repositorio por sí solo no prueba esa configuración y esta revisión no tuvo acceso al panel.
2. Con asesoría jurídica, completar responsable, contacto, derechos, tecnologías, proveedores y cualquier requisito de información o consentimiento. El sitio está publicado; no presentar el documento actual como política jurídica definitiva.
3. Repetir la revisión de red después de cambios en el proveedor; no inferir que los resultados locales sin el script inyectado representan producción.

La aplicación realiza el procesamiento de las imágenes y OCR en el navegador. Esto es independiente de la medición técnica observada al cargar el sitio.

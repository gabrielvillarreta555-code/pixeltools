import { Seo } from '../components/Seo';

export function PrivacyPage() {
  return (
    <>
      <Seo title="Política de privacidad | Vélix Blue" description="Consulta cómo Vélix Blue procesa imágenes localmente y protege la privacidad de sus visitantes." path="/privacidad" />
      <article className="prose-page page-container max-w-3xl py-16 sm:py-20">
        <span className="eyebrow">Documento inicial</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">Política de privacidad</h1>
        <div className="mt-6 rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-100">
          Este sitio está publicado; esta política es un borrador y requiere revisión jurídica y verificación de la configuración del proveedor.
        </div>
        <p>Última actualización técnica: 1 de noviembre de 2026.</p>

        <h2>1. Responsable</h2>
        <p>Vélix Blue es un producto de Blue Lab Studios. Los datos fiscales, dirección de contacto definitiva y jurisdicción siguen pendientes en este borrador.</p>

        <h2>2. Procesamiento de imágenes</h2>
        <p>Las herramientas de imagen y de reconocimiento de texto procesan las imágenes en el navegador. Vélix Blue no necesita enviar la fotografía a un servidor para realizar estas operaciones.</p>
        <p>En el primer uso del eliminador, el navegador descarga desde el propio sitio un modelo ONNX y los archivos de ONNX Runtime Web. Esa descarga no contiene la fotografía seleccionada.</p>
        <p>En el primer uso del OCR, el navegador descarga el motor y los datos del idioma seleccionado desde este sitio. La fotografía y el texto reconocido no se envían para el reconocimiento.</p>

        <h2>3. Imágenes y resultados</h2>
        <p>La aplicación no crea cuentas ni guarda las imágenes en el servidor ni en el almacenamiento del dispositivo. Las imágenes elegidas y sus resultados solo existen en la memoria de la pestaña hasta que reinicias la herramienta, reemplazas el archivo o cierras la página. Las vistas previas usan direcciones temporales del navegador que se revocan en esos mismos casos. Los archivos que descargas se guardan donde tú decidas.</p>

        <h2>4. Funcionamiento sin conexión y almacenamiento local</h2>
        <p>Para ofrecer funcionamiento sin conexión, cuando el navegador lo permite se registra un <em>service worker</em> que guarda archivos de la aplicación en caché (Cache Storage):</p>
        <ul>
          <li>Las páginas, el código, los estilos y los iconos al instalarse la caché de la aplicación.</li>
          <li>El modelo del eliminador de fondos y ONNX Runtime Web, unos 16 MB, solo cuando usas el eliminador por primera vez.</li>
          <li>El motor y el idioma elegidos para OCR, solo cuando utilizas esa herramienta.</li>
        </ul>
        <p>La caché de la aplicación está diseñada para guardar sus archivos técnicos, no tus fotografías ni el texto reconocido.</p>
        <p>Mientras hay conexión, el navegador consulta periódicamente el sitio para comprobar si existe una versión nueva de la aplicación; esas consultas son peticiones técnicas como las del apartado 6 y no incluyen imágenes. Las versiones antiguas se eliminan automáticamente al actualizar.</p>
        <p>Puedes borrar estos archivos en cualquier momento desde la configuración del navegador (datos o almacenamiento del sitio) o desinstalando la aplicación si la instalaste. Instalarla no concede permisos adicionales sobre tu dispositivo.</p>

        <h2>5. Analítica, cookies y publicidad</h2>
        <p>En una comprobación de la web publicada el 1 de noviembre de 2026 se observó la carga de un script de Cloudflare Web Analytics y el envío de métricas técnicas de visita y rendimiento, incluida información de la página. La configuración, la conservación de datos, las cookies y las opciones disponibles deben verificarse con Cloudflare y revisarse jurídicamente; esta observación no confirma todos los datos tratados. La herramienta OCR realiza el reconocimiento en tu dispositivo y no utiliza ese servicio para reconocer imágenes.</p>

        <h2>6. Registros técnicos del alojamiento</h2>
        <p>El proveedor de alojamiento puede tratar datos técnicos habituales —como dirección IP, fecha, ruta solicitada o agente de usuario— para seguridad y entrega del sitio. Esta sección deberá adaptarse al proveedor y contrato definitivos.</p>

        <h2>7. Derechos y contacto</h2>
        <p>La dirección jurídica y el canal para ejercer derechos siguen pendientes. Consulta la página de contacto para la configuración provisional.</p>

        <h2>8. Cambios</h2>
        <p>Esta política podrá cambiar cuando se incorporen funciones, métricas, anuncios o nuevos proveedores. La fecha de actualización se mostrará en esta página.</p>
      </article>
    </>
  );
}

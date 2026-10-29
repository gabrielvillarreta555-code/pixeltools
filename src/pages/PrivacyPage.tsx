import { Seo } from '../components/Seo';

export function PrivacyPage() {
  return (
    <>
      <Seo title="Política de privacidad | PixelTools" description="Consulta cómo PixelTools procesa imágenes localmente y protege la privacidad de sus visitantes." path="/privacidad" />
      <article className="prose-page page-container max-w-3xl py-16 sm:py-20">
        <span className="eyebrow">Documento inicial</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-5xl">Política de privacidad</h1>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
          Borrador pendiente de revisión jurídica antes de publicar el servicio en producción.
        </div>
        <p>Última actualización técnica: 29 de octubre de 2026.</p>

        <h2>1. Responsable</h2>
        <p>PixelTools es un producto de Blue Lab Studios. Los datos fiscales, dirección de contacto definitiva y jurisdicción deberán completarse antes de su publicación.</p>

        <h2>2. Procesamiento de imágenes</h2>
        <p>El compresor y el eliminador de fondos procesan las imágenes en el navegador del visitante, también cuando se usan sin conexión. PixelTools no necesita enviar la fotografía a un servidor para realizar estas operaciones.</p>
        <p>En el primer uso del eliminador, el navegador descarga desde el propio sitio un modelo ONNX y los archivos de ONNX Runtime Web. Esa descarga no contiene la fotografía seleccionada.</p>

        <h2>3. Imágenes y resultados</h2>
        <p>La aplicación no crea cuentas ni guarda las imágenes en el servidor ni en el almacenamiento del dispositivo. Las imágenes elegidas y sus resultados solo existen en la memoria de la pestaña hasta que reinicias la herramienta, reemplazas el archivo o cierras la página. Las vistas previas usan direcciones temporales del navegador que se revocan en esos mismos casos. Los archivos que descargas se guardan donde tú decidas.</p>

        <h2>4. Funcionamiento sin conexión y almacenamiento local</h2>
        <p>Para que PixelTools funcione sin conexión, en la primera visita el navegador registra un <em>service worker</em> y guarda en su almacenamiento de caché (Cache Storage) los archivos de la propia aplicación:</p>
        <ul>
          <li>Las páginas, el código, los estilos y los iconos, menos de 1 MB, en cuanto visitas el sitio.</li>
          <li>El modelo del eliminador de fondos y ONNX Runtime Web, unos 16 MB, solo cuando usas el eliminador por primera vez.</li>
        </ul>
        <p>Esta caché nunca contiene tus fotografías, sus resultados ni datos personales. No se usan cookies, <code>localStorage</code>, IndexedDB ni identificadores para reconocer al visitante.</p>
        <p>Mientras hay conexión, el navegador consulta periódicamente el sitio para comprobar si existe una versión nueva de la aplicación; esas consultas son peticiones técnicas como las del apartado 6 y no incluyen imágenes. Las versiones antiguas se eliminan automáticamente al actualizar.</p>
        <p>Puedes borrar estos archivos en cualquier momento desde la configuración del navegador (datos o almacenamiento del sitio) o desinstalando la aplicación si la instalaste. Instalarla no concede permisos adicionales sobre tu dispositivo.</p>

        <h2>5. Analítica, cookies y publicidad</h2>
        <p>Esta versión no incorpora analítica, cookies, publicidad ni seguimiento de terceros. Antes de añadirlos deberán evaluarse las bases legales, el consentimiento y la configuración de privacidad aplicables.</p>

        <h2>6. Registros técnicos del alojamiento</h2>
        <p>El proveedor de alojamiento puede tratar datos técnicos habituales —como dirección IP, fecha, ruta solicitada o agente de usuario— para seguridad y entrega del sitio. Esta sección deberá adaptarse al proveedor y contrato definitivos.</p>

        <h2>7. Derechos y contacto</h2>
        <p>La dirección jurídica y el canal para ejercer derechos se incorporarán antes del lanzamiento. Consulta la página de contacto para la configuración provisional.</p>

        <h2>8. Cambios</h2>
        <p>Esta política podrá cambiar cuando se incorporen funciones, métricas, anuncios o nuevos proveedores. La fecha de actualización se mostrará en esta página.</p>
      </article>
    </>
  );
}

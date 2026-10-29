import { Seo } from '../components/Seo';

export function TermsPage() {
  return (
    <>
      <Seo title="Condiciones de uso | Vélix Blue" description="Condiciones iniciales de uso de las herramientas gratuitas de Vélix Blue." path="/terminos" />
      <article className="prose-page page-container max-w-3xl py-16 sm:py-20">
        <span className="eyebrow">Condiciones iniciales</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">Condiciones de uso</h1>
        <div className="mt-6 rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-100">
          Borrador pendiente de completar y revisar jurídicamente antes de publicar.
        </div>

        <h2>1. Objeto</h2>
        <p>Vélix Blue ofrece herramientas gratuitas de procesamiento de imágenes en el navegador. El servicio incluye eliminación automática de fondos, compresión, conversión de formato, redimensión, recorte y eliminación de metadatos. La eliminación de metadatos solo actúa sobre los datos que la herramienta reconoce; revisa el resultado antes de compartir información sensible.</p>

        <h2>2. Uso permitido</h2>
        <p>Solo debes procesar archivos que tengas derecho a usar. No utilices el sitio para infringir derechos, vulnerar la ley, intentar comprometer el servicio o distribuir contenido dañino.</p>

        <h2>3. Resultados automatizados</h2>
        <p>La compresión puede alterar la calidad visual. La eliminación de fondos es automática y puede equivocarse en cabello, transparencias, sombras, objetos finos o escenas con poco contraste. Revisa siempre el archivo resultante.</p>

        <h2>4. Disponibilidad y límites</h2>
        <p>El rendimiento depende del navegador, memoria y dispositivo. Vélix Blue puede aplicar límites de tamaño y resolución para evitar bloqueos. No se garantiza disponibilidad ininterrumpida ni compatibilidad con todo formato o equipo.</p>

        <h2>5. Propiedad intelectual</h2>
        <p>Las imágenes siguen perteneciendo a sus titulares. Vélix Blue, su interfaz y su código están sujetos a los derechos y licencias que Blue Lab Studios defina. Las dependencias y modelos conservan sus licencias indicadas en la documentación técnica.</p>

        <h2>6. Responsabilidad</h2>
        <p>La herramienta se proporciona tal cual. Antes de usarla en un flujo crítico, conserva el original y comprueba el resultado. Esta cláusula deberá adaptarse a la normativa aplicable.</p>

        <h2>7. Contacto y legislación</h2>
        <p>Los datos del titular, jurisdicción, ley aplicable y canal formal de contacto deben completarse antes del lanzamiento público.</p>
      </article>
    </>
  );
}

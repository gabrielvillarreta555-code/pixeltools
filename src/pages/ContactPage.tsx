import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';

const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

export function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!configuredEmail) return;
    const subject = encodeURIComponent(`Consulta de Vélix Blue${name ? ` — ${name}` : ''}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${configuredEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Seo title="Contacto | Vélix Blue" description="Ponte en contacto con el equipo de Vélix Blue y Blue Lab Studios." path="/contacto" />
      <section className="page-container grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="eyebrow">Hablemos</span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">¿Podemos ayudarte?</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-mist">Comparte una incidencia, sugerencia o consulta sobre Vélix Blue. El formulario abre tu aplicación de correo y no almacena el mensaje.</p>
          <div className="mt-8 rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <Icon className="size-5 text-electric-light" name="shield" />
            <p className="mt-3 text-sm font-bold text-white">Canal sin seguimiento</p>
            <p className="mt-2 text-sm leading-6 text-mist">No hay un formulario externo ni un proveedor que recopile los campos en esta versión.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-8">
          {!configuredEmail && (
            <div className="mb-6"><Notice tone="warning">El canal está pendiente de configurar. Define <code className="rounded bg-white/10 px-1">VITE_CONTACT_EMAIL</code> durante la compilación para activar el envío por correo.</Notice></div>
          )}
          <form onSubmit={submit}>
            <div>
              <label className="field-label" htmlFor="contact-name">Nombre (opcional)</label>
              <input id="contact-name" className="text-field" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="mt-5">
              <label className="field-label" htmlFor="contact-message">Mensaje</label>
              <textarea id="contact-message" className="textarea-field" required minLength={10} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Cuéntanos en qué podemos ayudarte…" />
            </div>
            <button className="btn btn-primary mt-6 w-full" type="submit" disabled={!configuredEmail || message.trim().length < 10}>
              Preparar correo <Icon className="size-4" name="arrow-right" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

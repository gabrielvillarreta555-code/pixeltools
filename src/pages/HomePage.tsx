import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon, type IconName } from '../components/Icon';
import { Seo } from '../components/Seo';
import { filterTools, TOOLS } from '../lib/tools';

const BACKGROUND_OPTIONS = ['Transparente', 'Color', 'Degradado', 'Imagen', 'Desenfoque'];

const HIGHLIGHTS: [IconName, string, string][] = [
  ['bolt', 'Rápido', 'Resultados en segundos'],
  ['lock', 'Privado', 'Todo en tu dispositivo'],
  ['gift', 'Gratis', 'Sin instalaciones'],
];

const STRIP: [IconName, string, string][] = [
  ['shield', '100 % privado', 'En tu navegador'],
  ['bolt', 'Resultados rápidos', 'Sin esperas ni colas'],
  ['gift', 'Gratis', 'Sin cuentas ni registro'],
  ['devices', 'En cualquier dispositivo', 'Móvil, tablet y PC'],
];

/** Ilustración del eliminador: la mitad derecha muestra el fondo ya eliminado. */
function RemovalIllustration() {
  return (
    <svg className="block h-full w-full" viewBox="0 0 400 260" role="img" aria-label="Ilustración: a la izquierda la imagen original y a la derecha el mismo sujeto sin fondo">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#071235" />
          <stop offset=".65" stopColor="#173a93" />
          <stop offset="1" stopColor="#2f7bff" />
        </linearGradient>
        <linearGradient id="gema" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#bcd3ff" />
          <stop offset=".5" stopColor="#4f9bff" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <pattern id="tablero" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#e8edf7" />
          <rect width="10" height="10" fill="#cfd8ea" />
          <rect x="10" y="10" width="10" height="10" fill="#cfd8ea" />
        </pattern>
        <clipPath id="mitad-izquierda"><rect width="200" height="260" /></clipPath>
        <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <rect width="400" height="260" fill="url(#tablero)" />
      <g clipPath="url(#mitad-izquierda)">
        <rect width="400" height="260" fill="url(#cielo)" />
        <circle cx="70" cy="58" r="22" fill="#dbe7ff" opacity=".85" />
        <path d="M0 200 70 120l45 50 50-80 70 110H0Z" fill="#0d2463" />
        <path d="M0 260v-40l60-35 50 25 60-45 70 95Z" fill="#081a4d" />
        {[...Array(18)].map((_, index) => (
          <circle key={index} cx={(index * 53) % 200} cy={(index * 37) % 110} r={index % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity=".7" />
        ))}
      </g>
      <g transform="translate(200 132)">
        <polygon points="0,-78 52,-26 30,62 -30,62 -52,-26" fill="#2f7bff" opacity=".55" filter="url(#brillo)" />
        <polygon points="0,-78 52,-26 30,62 -30,62 -52,-26" fill="url(#gema)" />
        <polygon points="0,-78 52,-26 0,-8" fill="#fff" opacity=".35" />
        <polygon points="0,-8 30,62 -30,62" fill="#0b1430" opacity=".25" />
        <polygon points="-52,-26 0,-8 -30,62" fill="#fff" opacity=".12" />
      </g>
      <line x1="200" y1="0" x2="200" y2="260" stroke="#fff" strokeWidth="2" />
      <circle cx="200" cy="200" r="15" fill="#fff" />
      <path d="m195 194-6 6 6 6M205 194l6 6-6 6" stroke="#0b1430" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomePage() {
  const [query, setQuery] = useState('');
  const results = filterTools(TOOLS, query);

  return (
    <>
      <Seo
        title="Vélix Blue — Herramientas de imagen privadas y gratuitas"
        description="Elimina fondos, comprime, redimensiona, convierte, recorta y limpia los metadatos de tus imágenes directamente en tu navegador. Gratis y privado."
        path="/"
      />

      <section className="page-container grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <span className="eyebrow">Un producto de Blue Lab Studios</span>
          <h1 className="mt-6 text-[clamp(3.2rem,9vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] text-white">
            Vélix{' '}
            <span className="bg-linear-to-b from-[#7db4ff] to-electric bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(47,123,255,0.35)]">Blue</span>
          </h1>
          <p className="mt-5 text-balance text-2xl font-bold leading-tight tracking-[-0.02em] text-[#bcd3ff] sm:text-3xl">
            Herramientas digitales.<br />Más posibilidades.
          </p>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-mist sm:text-lg">
            Edita, convierte, comprime y transforma tus imágenes directamente en tu navegador. Rápido, privado y sin cuentas.
          </p>
          <div className="blue-welcome">
            <span
              className="blue-welcome-avatar"
              role="img"
              aria-label="Blue, la mascota luminosa de Blue Lab Studios"
              style={{ backgroundImage: `url(${import.meta.env.BASE_URL}blue-referencia.jpg)` }}
            />
            <div><strong>Hola, soy Blue 💙</strong><p>Te acompaño mientras exploras las herramientas.</p></div>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
            {HIGHLIGHTS.map(([icon, title, text]) => (
              <li key={title} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-line bg-white/5 text-electric-light"><Icon className="size-5" name={icon} /></span>
                <span><strong className="block text-sm text-white">{title}</strong><span className="text-xs text-mist">{text}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-primary min-h-13 px-7" href="#herramientas">
              Explorar herramientas <Icon className="size-4" name="arrow-right" />
            </a>
            <Link className="btn btn-secondary min-h-13 px-7" to="/eliminar-fondo">
              <Icon className="size-4" name="scissors" /> Eliminar un fondo
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="absolute inset-6 -z-10 rounded-[2.5rem] bg-electric/30 blur-3xl" />
          <div className="tool-shell p-4 sm:p-5">
            <div className="flex items-center gap-3 px-1 pb-4">
              <span className="tool-tile size-11"><Icon className="size-5" name="scissors" /></span>
              <div>
                <p className="font-bold text-white">Eliminar fondo</p>
                <p className="text-xs text-mist">Quita el fondo con IA, sin subir tu foto.</p>
              </div>
            </div>
            <div className="relative aspect-[400/260] overflow-hidden rounded-2xl border border-line">
              <RemovalIllustration />
              <span className="absolute left-3 top-3 rounded-full bg-night/75 px-2.5 py-1 text-[0.68rem] font-bold text-white">Original</span>
              <span className="absolute right-3 top-3 rounded-full bg-night/75 px-2.5 py-1 text-[0.68rem] font-bold text-white">Resultado</span>
            </div>
            <ul className="mt-4 grid grid-cols-5 gap-2 text-center text-[0.68rem] font-semibold text-mist" aria-label="Fondos disponibles">
              {BACKGROUND_OPTIONS.map((option, index) => (
                <li key={option}>
                  <span
                    className={`mx-auto mb-1.5 block aspect-square w-full max-w-14 rounded-xl border ${index === 0 ? 'checkerboard border-electric ring-2 ring-electric/60' : 'border-line'}`}
                    style={[
                      undefined,
                      { background: '#2f7bff' },
                      { background: 'linear-gradient(135deg,#1d4ed8,#7db4ff)' },
                      { background: 'linear-gradient(180deg,#0d2463,#2f7bff 70%,#bcd3ff)' },
                      { background: 'radial-gradient(circle at 30% 30%,#7db4ff,#173a93 70%)', filter: 'blur(0.5px)' },
                    ][index]}
                  />
                  {option}
                </li>
              ))}
            </ul>
            <Link className="btn btn-primary mt-4 w-full" to="/eliminar-fondo">
              Probar el eliminador <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section id="herramientas" className="page-container scroll-mt-24 pb-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Herramientas</h2>
            <p className="mt-2 text-mist">Todo lo que necesitas para tus imágenes, en un solo lugar.</p>
          </div>
          <label className="relative block w-full md:max-w-sm">
            <span className="sr-only">Buscar herramienta</span>
            <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-mist" name="search" />
            <input
              className="text-field rounded-2xl py-3 pl-12"
              type="search"
              placeholder="Buscar herramienta…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <p className="sr-only" role="status">{query ? `${results.length} herramientas encontradas` : ''}</p>
        {results.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line p-6 text-center text-mist">No hay ninguna herramienta con «{query}». Prueba con otra palabra.</p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((tool) => {
              const content = (
                <>
                  <span className={`tool-tile size-12 shrink-0 ${tool.path ? '' : 'opacity-50 grayscale'}`}><Icon className="size-6" name={tool.icon} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-bold text-white">
                      {tool.name}
                      {!tool.path && <span className="rounded-full border border-dashed border-line-strong px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[#bcd3ff]">Próximamente</span>}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-mist">{tool.description}</span>
                  </span>
                  {tool.path && <Icon className="mt-1 size-4 shrink-0 text-electric-light transition-transform group-hover:translate-x-1" name="arrow-right" />}
                </>
              );
              return (
                <li key={tool.name}>
                  {tool.path ? (
                    <Link className="glass group flex h-full items-start gap-4 rounded-2xl p-4 transition-[transform,border-color] hover:-translate-y-1 hover:border-line-strong" to={tool.path}>
                      {content}
                    </Link>
                  ) : (
                    <div className="flex h-full items-start gap-4 rounded-2xl border border-dashed border-line p-4 opacity-80">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="page-container pb-16">
        <div className="glass grid gap-8 overflow-hidden rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="flex items-center gap-4">
              <span className="tool-tile size-12"><Icon className="size-6" name="shield" /></span>
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">Procesamiento local</h2>
            </div>
            <p className="mt-4 max-w-xl leading-7 text-mist">
              Tus archivos no se envían a ningún servidor: Canvas y WebAssembly hacen todo el trabajo en tu propio dispositivo.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Sin cuentas', 'Sin subir tus fotos', 'Funciona sin conexión', 'Sin anuncios ni rastreo'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-200">
                  <span className="grid size-6 place-items-center rounded-full bg-electric text-white"><Icon className="size-3.5" name="check" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-electric-light" to="/privacidad">
              Cómo protegemos tu privacidad <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>
          <div className="relative mx-auto grid h-56 w-full max-w-xs place-items-center" aria-hidden="true">
            {[0, 1, 2].map((layer) => (
              <span
                key={layer}
                className="absolute h-28 w-40 rounded-3xl border border-electric-light/50 bg-electric/10 shadow-[0_0_30px_rgba(47,123,255,0.25)]"
                style={{ transform: `translateY(${(layer - 1) * 34}px) rotateX(60deg) rotateZ(-45deg)` }}
              />
            ))}
            <span className="tool-tile relative size-16 rounded-2xl"><Icon className="size-8" name="lock" /></span>
          </div>
        </div>
      </section>

      <section className="page-container pb-16">
        <ul className="glass grid gap-6 rounded-3xl p-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {STRIP.map(([icon, title, text]) => (
            <li key={title} className="flex items-center gap-4 lg:justify-center lg:px-4">
              <Icon className="size-8 shrink-0 text-electric-light" name={icon} />
              <span><strong className="block text-white">{title}</strong><span className="text-sm text-mist">{text}</span></span>
            </li>
          ))}
        </ul>
      </section>
      <AdPlaceholder />
    </>
  );
}

import { Link } from 'react-router-dom';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';

export function HomePage() {
  return (
    <>
      <Seo
        title="PixelTools — Herramientas de imagen privadas y gratuitas"
        description="Comprime imágenes y elimina fondos directamente en tu navegador. Gratis, rápido y privado."
        path="/"
      />

      <section className="page-container grid items-center gap-12 pb-20 pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:pb-28 lg:pt-24">
        <div>
          <span className="eyebrow"><Icon className="size-4" name="shield" /> Privacidad por diseño</span>
          <h1 className="mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
            Tus imágenes, <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">más ligeras.</span>
          </h1>
          <p className="mt-3 text-balance text-4xl font-extrabold tracking-[-0.05em] text-slate-400 sm:text-5xl">Tu privacidad, intacta.</p>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-slate-600">
            Herramientas gratuitas que trabajan dentro de tu navegador. Sin cuentas, sin esperas y sin entregar tus fotos a un servidor.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn btn-primary min-h-13 px-6" to="/comprimir-imagen">
              Comprimir una imagen <Icon className="size-4" name="arrow-right" />
            </Link>
            <Link className="btn btn-secondary min-h-13 px-6" to="/eliminar-fondo">
              <Icon className="size-4" name="scissors" /> Eliminar un fondo
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            {['Procesamiento local', 'Sin registro', 'Descarga inmediata'].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5"><Icon className="size-3.5 text-emerald-600" name="check" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-linear-to-br from-blue-200/50 to-violet-200/50 blur-2xl" />
          <div className="overflow-hidden rounded-[1.6rem] border border-white/90 bg-white shadow-[0_28px_80px_rgba(30,64,175,0.16)]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <span className="size-2.5 rounded-full bg-red-300" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-300" />
              <span className="ml-2 text-[0.67rem] font-semibold text-slate-400">pixeltools · compresor</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="overflow-hidden rounded-2xl bg-linear-to-br from-sky-100 via-indigo-100 to-violet-100 p-5">
                <div className="relative h-52 overflow-hidden rounded-xl bg-[#dbeafe]">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[#93c5fd] [clip-path:polygon(0_60%,25%_20%,47%_70%,68%_5%,100%_55%,100%_100%,0_100%)]" />
                  <div className="absolute left-[16%] top-[18%] size-11 rounded-full bg-amber-200 shadow-sm" />
                  <div className="absolute right-[14%] top-[12%] rounded-full bg-white/80 px-3 py-1.5 text-[0.65rem] font-bold text-blue-700 shadow-sm">Vista previa</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['Original', '4,8 MB'], ['Resultado', '816 KB'], ['Ahorro', '83%']].map(([label, value], index) => (
                  <div key={label} className={`rounded-xl p-3 ${index === 2 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className={`mt-1 text-sm font-extrabold ${index === 2 ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-11 rounded-xl bg-linear-to-r from-blue-600 to-violet-600" />
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border border-white bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-lg sm:-left-8">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Icon className="size-4" name="shield" /></span>
            La foto no sale de aquí
          </div>
        </div>
      </section>

      <section className="page-container pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">Dos tareas, cero complicaciones</p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">Una herramienta clara para cada trabajo</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Sin menús interminables. Elige qué necesitas y conserva el control del resultado.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-white to-blue-50 p-7 shadow-sm transition-transform hover:-translate-y-1 sm:p-9">
            <div className="grid size-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"><Icon className="size-6" name="compress" /></div>
            <h3 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-950">Compresor de imágenes</h3>
            <p className="mt-3 max-w-md leading-7 text-slate-600">Reduce el peso de JPG, PNG y WebP con una calidad elegida por ti. Compara los bytes reales antes de descargar.</p>
            <Link className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700" to="/comprimir-imagen">Abrir compresor <Icon className="size-4 transition-transform group-hover:translate-x-1" name="arrow-right" /></Link>
          </article>
          <article className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-linear-to-br from-white to-violet-50 p-7 shadow-sm transition-transform hover:-translate-y-1 sm:p-9">
            <div className="grid size-12 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200"><Icon className="size-6" name="scissors" /></div>
            <h3 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-950">Eliminador de fondos</h3>
            <p className="mt-3 max-w-md leading-7 text-slate-600">Una IA ligera separa el sujeto y crea un PNG transparente. El modelo corre localmente con WebAssembly.</p>
            <Link className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-violet-700" to="/eliminar-fondo">Quitar un fondo <Icon className="size-4 transition-transform group-hover:translate-x-1" name="arrow-right" /></Link>
          </article>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/80 py-20">
        <div className="page-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="eyebrow"><Icon className="size-4" name="shield" /> Lo que pasa en tu navegador</span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">Tus fotografías no son nuestro negocio.</h2>
            <p className="mt-5 leading-7 text-slate-600">PixelTools usa Canvas y WebAssembly para hacer el trabajo en tu dispositivo. El servidor entrega la aplicación y el modelo; no recibe tu imagen para procesarla.</p>
            <Link className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700" to="/privacidad">Ver cómo protegemos tus datos <Icon className="size-4" name="arrow-right" /></Link>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'Elige', 'Selecciona una imagen compatible desde tu dispositivo.'],
              ['02', 'Procesa', 'Tu navegador comprime o ejecuta el modelo local.'],
              ['03', 'Descarga', 'Guarda el resultado y los recursos temporales se liberan.'],
            ].map(([number, title, text]) => (
              <li key={number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-xs font-black tracking-widest text-blue-500">{number}</span>
                <h3 className="mt-4 font-extrabold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-container py-20">
        <div className="overflow-hidden rounded-3xl bg-[#10182f] px-7 py-12 text-center text-white shadow-xl sm:px-12 sm:py-14">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-blue-200"><Icon className="size-6" name="sparkles" /></span>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Empieza con una imagen. Sin registro.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">El compresor está listo al instante. Tú decides la calidad y solo descargas cuando el resultado merece la pena.</p>
          <Link className="btn mt-7 min-h-12 bg-white px-6 text-slate-950 hover:shadow-lg" to="/comprimir-imagen">Comprimir gratis <Icon className="size-4" name="arrow-right" /></Link>
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <section className="page-container grid min-h-[65vh] place-items-center py-16 text-center">
      <Seo title="Página no encontrada | Vélix Blue" description="La página solicitada no existe." path={window.location.pathname} noIndex />
      <div>
        <p className="text-sm font-black tracking-[0.2em] text-electric-light">ERROR 404</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">Aquí no hay ningún píxel.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-mist">La dirección puede haber cambiado o no existir. Vuelve al inicio para elegir una herramienta.</p>
        <Link className="btn btn-primary mt-7" to="/">Volver al inicio <Icon className="size-4" name="arrow-right" /></Link>
      </div>
    </section>
  );
}

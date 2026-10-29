import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';

const links = [
  { to: '/comprimir-imagen', label: 'Comprimir' },
  { to: '/eliminar-fondo', label: 'Eliminar fondo' },
];

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#fbfcff]/90 backdrop-blur-xl">
        <div className="page-container flex h-18 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <Link className="nav-link" to="/privacidad">Privacidad</Link>
          </nav>
          <Link className="btn btn-primary hidden sm:inline-flex" to="/comprimir-imagen">
            Probar gratis
          </Link>
          <button
            className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-700 sm:ml-2 md:hidden"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon className="size-5" name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" className="border-t border-slate-200 bg-white p-4 md:hidden" aria-label="Navegación móvil">
            <div className="page-container flex flex-col gap-1 px-0">
              {links.map((link) => (
                <NavLink key={link.to} className="mobile-nav-link" to={link.to}>{link.label}</NavLink>
              ))}
              <NavLink className="mobile-nav-link" to="/privacidad">Privacidad</NavLink>
              <Link className="btn btn-primary mt-2" to="/comprimir-imagen">Probar gratis</Link>
            </div>
          </nav>
        )}
      </header>

      <main id="contenido" className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="page-container py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                Herramientas de imagen rápidas y privadas, creadas por Blue Lab Studios.
              </p>
            </div>
            <div>
              <p className="footer-title">Herramientas</p>
              <Link className="footer-link" to="/comprimir-imagen">Comprimir imagen</Link>
              <Link className="footer-link" to="/eliminar-fondo">Eliminar fondo</Link>
            </div>
            <div>
              <p className="footer-title">Información</p>
              <Link className="footer-link" to="/privacidad">Privacidad</Link>
              <Link className="footer-link" to="/terminos">Términos</Link>
              <Link className="footer-link" to="/contacto">Contacto</Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Blue Lab Studios.</p>
            <p>Procesamiento local · Sin cuentas · Sin seguimiento</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

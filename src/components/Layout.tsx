import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AVAILABLE_TOOLS } from '../lib/tools';
import { AppStatus } from './AppStatus';
import { Icon } from './Icon';
import { Logo, LogoMark } from './Logo';

const STUDIO_URL = 'https://gabrielvillarreta555-code.github.io/';

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/#herramientas', label: 'Herramientas', end: false },
  { to: '/privacidad', label: 'Privacidad', end: false },
  { to: '/contacto', label: 'Contacto', end: false },
];

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <AppStatus />
      <header className="sticky top-0 z-50 border-b border-line bg-night/80 backdrop-blur-xl">
        <div className="page-container flex h-18 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
            {links.map((link) =>
              link.to.includes('#') ? (
                <Link key={link.to} className="nav-link" to={link.to}>{link.label}</Link>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link className="btn btn-primary hidden sm:inline-flex" to="/#herramientas">
              Comenzar ahora <Icon className="size-4" name="arrow-right" />
            </Link>
            <button
              className="grid size-11 place-items-center rounded-xl border border-line text-slate-200 md:hidden"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon className="size-5" name={menuOpen ? 'x' : 'menu'} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" className="border-t border-line bg-panel p-4 md:hidden" aria-label="Navegación móvil">
            <div className="page-container flex flex-col gap-1 px-0">
              {AVAILABLE_TOOLS.map((tool) => (
                <NavLink key={tool.path} className="mobile-nav-link flex items-center gap-3" to={tool.path}>
                  <Icon className="size-4 text-electric-light" name={tool.icon} />{tool.name}
                </NavLink>
              ))}
              <div className="my-2 border-t border-line" />
              <NavLink className="mobile-nav-link" to="/privacidad">Privacidad</NavLink>
              <NavLink className="mobile-nav-link" to="/contacto">Contacto</NavLink>
            </div>
          </nav>
        )}
      </header>

      <main id="contenido" className="flex-1">{children}</main>

      <footer className="mt-10 border-t border-line bg-night/70">
        <div className="page-container py-12">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-6 text-mist">
                Herramientas de imagen rápidas y privadas. Todo se procesa en tu dispositivo.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-mist transition-colors hover:border-line-strong hover:text-white"
                href={STUDIO_URL}
                rel="noopener"
              >
                <LogoMark className="size-5" />
                Un producto de <strong className="text-white">Blue Lab Studios</strong>
              </a>
            </div>
            <div>
              <p className="footer-title">Herramientas</p>
              {AVAILABLE_TOOLS.map((tool) => (
                <Link key={tool.path} className="footer-link" to={tool.path}>{tool.name}</Link>
              ))}
            </div>
            <div>
              <p className="footer-title">Información</p>
              <Link className="footer-link" to="/privacidad">Privacidad</Link>
              <Link className="footer-link" to="/terminos">Términos</Link>
              <Link className="footer-link" to="/contacto">Contacto</Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Blue Lab Studios. Vélix Blue es un producto de Blue Lab Studios.</p>
            <p>Procesamiento local · Sin cuentas · Sin seguimiento</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useId } from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ className = 'size-9' }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4f9bff" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      {/* «V» prismática: dos caras con distinta luz */}
      <path d="M9.5 11h7.2L20 22.4 23.3 11h7.2L22.6 30h-5.2z" fill="#fff" opacity=".95" />
      <path d="M20 22.4 23.3 11h7.2L22.6 30z" fill="#bcd3ff" opacity=".85" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link className="group flex items-center gap-2.5" to="/" aria-label="Vélix Blue, inicio">
      <LogoMark className="size-9 drop-shadow-[0_6px_16px_rgba(47,123,255,0.45)] transition-transform group-hover:-rotate-3" />
      <span className="whitespace-nowrap text-[1.15rem] font-extrabold uppercase tracking-[-0.01em] text-white">
        Vélix <span className="text-electric-light">Blue</span>
      </span>
    </Link>
  );
}

import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link className="group flex items-center gap-2.5" to="/" aria-label="PixelTools, inicio">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-violet-600 shadow-[0_8px_20px_rgba(79,70,229,0.22)] transition-transform group-hover:-rotate-3">
        <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
          <span className="size-1.5 rounded-[2px] bg-white" />
          <span className="size-1.5 rounded-[2px] bg-white/50" />
          <span className="size-1.5 rounded-[2px] bg-white/50" />
          <span className="size-1.5 rounded-[2px] bg-white" />
        </span>
      </span>
      <span className="text-[1.08rem] font-extrabold tracking-[-0.035em] text-slate-950">
        Pixel<span className="text-blue-600">Tools</span>
      </span>
    </Link>
  );
}

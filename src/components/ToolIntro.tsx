import type { IconName } from './Icon';
import { Icon } from './Icon';

interface ToolIntroProps {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
}

export function ToolIntro({ icon, eyebrow, title, description }: ToolIntroProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="eyebrow"><Icon className="size-4" name={icon} />{eyebrow}</span>
      <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <Icon className="size-4" name="shield" />
        Tus imágenes se procesan en este dispositivo
      </div>
    </div>
  );
}

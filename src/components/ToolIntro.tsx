import type { IconName } from './Icon';
import { Icon } from './Icon';
import { BlueHint } from './BlueHint';

interface ToolIntroProps {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  blueTip: string;
}

export function ToolIntro({ icon, eyebrow, title, description, blueTip }: ToolIntroProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="eyebrow"><Icon className="size-4" name={icon} />{eyebrow}</span>
      <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-mist sm:text-lg">
        {description}
      </p>
      <BlueHint message={blueTip} />
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#bcd3ff]">
        <Icon className="size-4" name="shield" />
        Tus imágenes se procesan en este dispositivo
      </div>
    </div>
  );
}

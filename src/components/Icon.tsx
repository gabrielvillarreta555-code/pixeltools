import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-right'
  | 'check'
  | 'chevron-down'
  | 'compress'
  | 'download'
  | 'image'
  | 'menu'
  | 'reset'
  | 'scissors'
  | 'shield'
  | 'sparkles'
  | 'upload'
  | 'x';

const paths: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  compress: <path d="M8 3v3a2 2 0 0 1-2 2H3m13-5v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3m13 5v-3a2 2 0 0 1 2-2h3" />,
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m3 16 5-5 4 4 2-2 7 7" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  reset: <path d="M20 7v5h-5M4 17v-5h5m9.5-4A7 7 0 0 0 6.1 6L4 12m16 0-2.1 6a7 7 0 0 1-12.4-2" />,
  scissors: <><circle cx="6" cy="7" r="3" /><circle cx="6" cy="17" r="3" /><path d="m8.6 8.5 11.4 7M8.6 15.5 20 8" /></>,
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.9 7.5-9.5V6L12 3Zm-3 9 2 2 4-4" />,
  sparkles: <path d="m12 3 1.1 3.4L16.5 7.5l-3.4 1.1L12 12l-1.1-3.4-3.4-1.1 3.4-1.1L12 3ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8L6 14Zm11-1 .7 2.3L20 16l-2.3.7L17 19l-.7-2.3L14 16l2.3-.7L17 13Z" />,
  upload: <path d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

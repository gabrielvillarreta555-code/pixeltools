import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-right'
  | 'bolt'
  | 'check'
  | 'chevron-down'
  | 'compress'
  | 'convert'
  | 'crop'
  | 'devices'
  | 'download'
  | 'droplet'
  | 'file-pdf'
  | 'flip'
  | 'gift'
  | 'image'
  | 'location'
  | 'lock'
  | 'menu'
  | 'plus'
  | 'reset'
  | 'resize'
  | 'rotate-left'
  | 'rotate-right'
  | 'scissors'
  | 'search'
  | 'shield'
  | 'sparkles'
  | 'text'
  | 'upload'
  | 'x';

const paths: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  convert: <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />,
  crop: <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" />,
  devices: <><rect x="2" y="4" width="14" height="11" rx="1.5" /><path d="M6 19h6M9 15v4" /><rect x="17" y="8" width="5" height="11" rx="1.2" /></>,
  droplet: <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />,
  'file-pdf': <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 15h1.5a1.5 1.5 0 0 0 0-3H9v5" /></>,
  flip: <path d="M12 3v18M8 7 3 17h5V7Zm8 0 5 10h-5V7Z" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9M12 8C10 4 6.5 4.5 7.5 7c.5 1 2.5 1 4.5 1Zm0 0c2-4 5.5-3.5 4.5-1-.5 1-2.5 1-4.5 1Z" /></>,
  location: <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10.5" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  resize: <path d="M4 9V4h5M20 15v5h-5M4 4l6.5 6.5M20 20l-6.5-6.5M15 4h5v5M9 20H4v-5" />,
  'rotate-left': <path d="M4 4v5h5M4.6 13a7.5 7.5 0 1 0 1.9-7.3L4 9" />,
  'rotate-right': <path d="M20 4v5h-5M19.4 13a7.5 7.5 0 1 1-1.9-7.3L20 9" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.4-4.4" /></>,
  text: <path d="M4 7V5h16v2M12 5v14M9 19h6M4 15v4h4M20 15v4h-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  compress: <path d="M8 3v3a2 2 0 0 1-2 2H3m13-5v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3m13 5v-3a2 2 0 0 1 2-2h3" />,
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m3 16 5-5 4 4 2-2 7 7" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
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

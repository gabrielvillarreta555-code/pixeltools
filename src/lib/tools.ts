import type { IconName } from '../components/Icon';

export interface ToolInfo {
  name: string;
  description: string;
  icon: IconName;
  /** Ruta de la herramienta. Sin ruta, la herramienta aún no existe y se muestra como «Próximamente». */
  path?: string;
  keywords: string;
}

// Solo las herramientas con `path` funcionan hoy. Las demás se muestran como
// hoja de ruta, nunca como si ya estuvieran disponibles.
export const TOOLS: ToolInfo[] = [
  {
    name: 'Eliminar fondo',
    description: 'IA en tu dispositivo: transparente, color, degradado, imagen o desenfoque.',
    icon: 'scissors',
    path: '/eliminar-fondo',
    keywords: 'quitar fondo recortar persona png transparente ia',
  },
  {
    name: 'Comprimir imagen',
    description: 'Reduce el peso de JPG, PNG y WebP, también por lotes.',
    icon: 'compress',
    path: '/comprimir-imagen',
    keywords: 'reducir peso tamaño optimizar lote zip',
  },
  {
    name: 'Redimensionar',
    description: 'Medidas exactas o tamaños listos para redes sociales.',
    icon: 'resize',
    path: '/redimensionar-imagen',
    keywords: 'cambiar tamaño medidas instagram historia youtube whatsapp',
  },
  {
    name: 'Convertir formato',
    description: 'JPG, PNG y WebP, de una en una o por lotes.',
    icon: 'convert',
    path: '/convertir-imagen',
    keywords: 'jpg png webp cambiar formato',
  },
  {
    name: 'Recortar imagen',
    description: 'Proporciones 1:1, 4:5, 16:9… y giro en un toque.',
    icon: 'crop',
    path: '/recortar-imagen',
    keywords: 'cortar proporción cuadrado girar rotar voltear',
  },
  {
    name: 'Quitar metadatos',
    description: 'Descubre y borra la ubicación GPS y otros datos ocultos.',
    icon: 'location',
    path: '/quitar-metadatos',
    keywords: 'exif gps ubicación privacidad datos ocultos',
  },
  {
    name: 'Imágenes a PDF',
    description: 'Une varias imágenes en un solo PDF.',
    icon: 'file-pdf',
    keywords: 'pdf unir documento',
  },
  {
    name: 'HEIC a JPG',
    description: 'Convierte las fotos del iPhone a un formato universal.',
    icon: 'image',
    keywords: 'heic iphone apple jpg',
  },
  {
    name: 'Marca de agua',
    description: 'Protege tus fotos con tu texto o logotipo.',
    icon: 'droplet',
    keywords: 'logo firma proteger',
  },
  {
    name: 'Extraer texto (OCR)',
    description: 'Convierte el texto de una imagen en texto editable.',
    icon: 'text',
    keywords: 'ocr leer copiar texto',
  },
];

export const AVAILABLE_TOOLS = TOOLS.filter((tool): tool is ToolInfo & { path: string } => Boolean(tool.path));

/** Filtro sin distinguir mayúsculas ni tildes. */
export function filterTools(tools: ToolInfo[], query: string): ToolInfo[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return tools;
  return tools.filter((tool) => {
    const haystack = normalize(`${tool.name} ${tool.description} ${tool.keywords}`);
    return terms.every((term) => haystack.includes(term));
  });
}

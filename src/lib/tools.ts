import catalog from './toolCatalog.json';
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
export const TOOLS: ToolInfo[] = catalog as ToolInfo[];

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

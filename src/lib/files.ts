export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export interface FileValidationOptions {
  maxBytes: number;
  acceptedTypes?: readonly string[];
}

export function validateImageFile(
  file: Pick<File, 'size' | 'type' | 'name'>,
  { maxBytes, acceptedTypes = SUPPORTED_IMAGE_TYPES }: FileValidationOptions,
): string | null {
  if (file.size <= 0) return 'El archivo está vacío.';
  if (!acceptedTypes.includes(file.type)) {
    return 'Formato no compatible. Usa una imagen JPG, PNG o WebP.';
  }
  if (file.size > maxBytes) {
    return `La imagen supera el límite de ${formatBytes(maxBytes)}.`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits).replace('.', ',')} ${units[unit]}`;
}

export function reductionPercent(originalBytes: number, outputBytes: number): number {
  if (originalBytes <= 0) return 0;
  return ((originalBytes - outputBytes) / originalBytes) * 100;
}

const extensions: Record<SupportedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function makeOutputName(
  originalName: string,
  mimeType: SupportedImageType,
  suffix = 'optimizada',
): string {
  const base = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ_-]+/g, '-');
  return `${base || 'imagen'}-${suffix}.${extensions[mimeType]}`;
}

export function isSupportedImageType(value: string): value is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(value as SupportedImageType);
}

/** Descarga un Blob sin mantener Object URL vivos más de lo necesario. */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

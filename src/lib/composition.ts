import { padBox, type Box } from './geometry';
import { canvasToBlob, decodeImage, ImageProcessingError, type DecodedImage } from './imageProcessing';

const BACKDROP_SIDE = 48;

export type BackgroundFill =
  | { kind: 'transparent' }
  | { kind: 'color'; color: string }
  | { kind: 'gradient'; from: string; to: string }
  | { kind: 'image'; image: Blob }
  | { kind: 'blur' };

export interface ComposeOptions {
  background: BackgroundFill;
  crop: boolean;
  mimeType: 'image/png' | 'image/jpeg';
  signal?: AbortSignal;
}

export interface ComposeOutput {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Miniatura del original usada como fondo desenfocado. Se genera una sola vez
 * mientras el original ya está decodificado, para no tener que volver a
 * decodificar la fotografía completa cada vez que cambia una opción.
 *
 * Reducir y después ampliar con interpolación produce un difuminado suave y
 * funciona también en Safari, donde `context.filter` no está disponible.
 */
export async function createBackdrop(source: CanvasImageSource, width: number, height: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const factor = Math.max(width, height) / BACKDROP_SIDE;
  canvas.width = Math.max(4, Math.round(width / factor));
  canvas.height = Math.max(4, Math.round(height / factor));
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new ImageProcessingError('No se pudo preparar el fondo desenfocado.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    return await canvasToBlob(canvas, 'image/png');
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Coloca el recorte transparente sobre el fondo elegido y, si se pide, recorta
 * alrededor del sujeto. Todo ocurre en Canvas dentro del navegador.
 */
export async function composeCutout(
  cutout: Blob,
  backdrop: Blob,
  subject: Box | null,
  options: ComposeOptions,
): Promise<ComposeOutput> {
  const { background, crop, mimeType, signal } = options;
  const decoded = await decodeImage(cutout, signal);
  const fullWidth = decoded.width;
  const fullHeight = decoded.height;
  const region = crop && subject ? padBox(subject, fullWidth, fullHeight) : { x: 0, y: 0, width: fullWidth, height: fullHeight };

  if (background.kind === 'transparent' && mimeType === 'image/png' && region.width === fullWidth && region.height === fullHeight) {
    decoded.release();
    return { blob: cutout, width: fullWidth, height: fullHeight };
  }

  const canvas = document.createElement('canvas');
  let backdropImage: DecodedImage | null = null;
  let customImage: DecodedImage | null = null;
  try {
    canvas.width = region.width;
    canvas.height = region.height;
    const context = canvas.getContext('2d', { alpha: mimeType === 'image/png' });
    if (!context) {
      throw new ImageProcessingError(
        `Este navegador no tiene memoria suficiente para un lienzo de ${region.width} × ${region.height} px.`,
      );
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    if (background.kind === 'color' || (background.kind === 'transparent' && mimeType === 'image/jpeg')) {
      context.fillStyle = background.kind === 'color' ? background.color : '#ffffff';
      context.fillRect(0, 0, region.width, region.height);
    } else if (background.kind === 'gradient') {
      // Degradado diagonal suave de arriba a la izquierda hacia abajo a la derecha.
      const gradient = context.createLinearGradient(0, 0, region.width * 0.35, region.height);
      gradient.addColorStop(0, background.from);
      gradient.addColorStop(1, background.to);
      context.fillStyle = gradient;
      context.fillRect(0, 0, region.width, region.height);
    } else if (background.kind === 'image') {
      customImage = await decodeImage(background.image, signal);
      // Cubre todo el lienzo recortando lo que sobra, centrado.
      const scale = Math.max(region.width / customImage.width, region.height / customImage.height);
      const width = customImage.width * scale;
      const height = customImage.height * scale;
      context.drawImage(customImage.source, (region.width - width) / 2, (region.height - height) / 2, width, height);
      customImage.release();
    } else if (background.kind === 'blur') {
      backdropImage = await decodeImage(backdrop, signal);
      context.drawImage(backdropImage.source, -region.x, -region.y, fullWidth, fullHeight);
    }

    context.drawImage(decoded.source, -region.x, -region.y, fullWidth, fullHeight);
    decoded.release();
    backdropImage?.release();
    const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;
    const blob = await canvasToBlob(canvas, mimeType, quality, signal);
    return { blob, width: region.width, height: region.height };
  } finally {
    decoded.release();
    backdropImage?.release();
    customImage?.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}

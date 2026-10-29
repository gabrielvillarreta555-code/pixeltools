import { padBox, type Box } from './geometry';
import { canvasToBlob, decodeImage, ImageProcessingError, type DecodedImage } from './imageProcessing';

export type BackgroundFill =
  | { kind: 'transparent' }
  | { kind: 'color'; color: string }
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
 * Coloca el recorte transparente sobre el fondo elegido y, si se pide, recorta
 * alrededor del sujeto. Todo ocurre en Canvas dentro del navegador.
 */
export async function composeCutout(
  cutout: Blob,
  original: Blob,
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
  let originalImage: DecodedImage | null = null;
  try {
    canvas.width = region.width;
    canvas.height = region.height;
    const context = canvas.getContext('2d', { alpha: mimeType === 'image/png' });
    if (!context) throw new ImageProcessingError('Canvas no está disponible en este navegador.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    if (background.kind === 'color' || (background.kind === 'transparent' && mimeType === 'image/jpeg')) {
      context.fillStyle = background.kind === 'color' ? background.color : '#ffffff';
      context.fillRect(0, 0, region.width, region.height);
    } else if (background.kind === 'blur') {
      originalImage = await decodeImage(original, signal);
      drawBlurred(context, originalImage.source, fullWidth, fullHeight, region);
    }

    context.drawImage(decoded.source, -region.x, -region.y, fullWidth, fullHeight);
    const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;
    const blob = await canvasToBlob(canvas, mimeType, quality, signal);
    return { blob, width: region.width, height: region.height };
  } finally {
    decoded.release();
    originalImage?.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Desenfoque compatible con Safari: `context.filter` no está disponible en todos
 * los navegadores, así que se reduce la imagen a una miniatura y se vuelve a
 * ampliar con interpolación, lo que produce un difuminado suave.
 */
function drawBlurred(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  fullWidth: number,
  fullHeight: number,
  region: Box,
) {
  const small = document.createElement('canvas');
  const factor = Math.max(fullWidth, fullHeight) / 48;
  small.width = Math.max(4, Math.round(fullWidth / factor));
  small.height = Math.max(4, Math.round(fullHeight / factor));
  try {
    const smallContext = small.getContext('2d');
    if (!smallContext) throw new ImageProcessingError('No se pudo preparar el fondo desenfocado.');
    smallContext.imageSmoothingEnabled = true;
    smallContext.imageSmoothingQuality = 'high';
    smallContext.drawImage(source, 0, 0, small.width, small.height);
    context.drawImage(small, -region.x, -region.y, fullWidth, fullHeight);
  } finally {
    small.width = 0;
    small.height = 0;
  }
}

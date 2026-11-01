import { prepareBackgroundImage } from './backgroundInput';
import { canvasToBlob, decodeImage } from './imageProcessing';
import { validateImageFile } from './files';

export const PDF_MAX_FILES = 10;
export const PDF_MAX_FILE_BYTES = 50 * 1024 * 1024;
export const PDF_MAX_TOTAL_BYTES = 80 * 1024 * 1024;
export type PaperSize = 'a4' | 'carta';

/** Valida el conjunto antes de leer sus bytes o reservar lienzos. */
export function validatePdfImages(files: Pick<File, 'size' | 'type' | 'name'>[]): string | null {
  if (files.length === 0) return 'Selecciona al menos una imagen.';
  if (files.length > PDF_MAX_FILES) return `Puedes usar hasta ${PDF_MAX_FILES} imágenes por PDF.`;
  if (files.reduce((sum, file) => sum + file.size, 0) > PDF_MAX_TOTAL_BYTES) return 'Las imágenes juntas no pueden superar 80 MB.';
  for (const file of files) {
    const error = validateImageFile(file, { maxBytes: PDF_MAX_FILE_BYTES });
    if (error) return `${file.name}: ${error}`;
  }
  return null;
}

export function pageLayout(width: number, height: number, paper: PaperSize) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new Error('La imagen no tiene dimensiones válidas.');
  if (paper !== 'a4' && paper !== 'carta') throw new Error('Selecciona un tamaño de página válido.');
  const [short, long] = paper === 'a4' ? [595.28, 841.89] : [612, 792];
  const [pageWidth, pageHeight] = width > height ? [long, short] : [short, long];
  const margin = 18;
  const scale = Math.min((pageWidth - margin * 2) / width, (pageHeight - margin * 2) / height);
  const imageWidth = width * scale, imageHeight = height * scale;
  return { pageWidth, pageHeight, imageWidth, imageHeight, x: (pageWidth - imageWidth) / 2, y: (pageHeight - imageHeight) / 2 };
}

function checkAbort(signal: AbortSignal) { if (signal.aborted) throw new DOMException('Operación cancelada', 'AbortError'); }

/** Convierte localmente, una imagen a la vez. La transparencia se compone sobre blanco. */
export async function imagesToPdf(files: File[], paper: PaperSize, signal: AbortSignal, onProgress: (done: number, total: number) => void): Promise<Blob> {
  const error = validatePdfImages(files); if (error) throw new Error(error);
  checkAbort(signal);
  const { PDFDocument } = await import('pdf-lib');
  checkAbort(signal);
  const pdf = await PDFDocument.create();
  pdf.setCreator('Vélix Blue');
  for (let i = 0; i < files.length; i++) {
    checkAbort(signal);
    const file = files[i]!;
    const prepared = await prepareBackgroundImage(file, signal);
    checkAbort(signal);
    const decoded = await decodeImage(prepared.blob, signal);
    const canvas = document.createElement('canvas');
    try {
      canvas.width = prepared.width; canvas.height = prepared.height;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('No hay memoria suficiente para preparar la imagen.');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(decoded.source, 0, 0);
      const jpeg = await canvasToBlob(canvas, 'image/jpeg', 0.86, signal);
      checkAbort(signal);
      const embedded = await pdf.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
      checkAbort(signal);
      const rect = pageLayout(prepared.width, prepared.height, paper);
      const page = pdf.addPage([rect.pageWidth, rect.pageHeight]);
      page.drawImage(embedded, { x: rect.x, y: rect.y, width: rect.imageWidth, height: rect.imageHeight });
    } finally { decoded.release(); canvas.width = 0; canvas.height = 0; }
    onProgress(i + 1, files.length);
  }
  checkAbort(signal);
  const bytes = await pdf.save();
  checkAbort(signal);
  return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
}

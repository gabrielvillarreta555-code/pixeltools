import type { Worker as OcrWorker } from 'tesseract.js';

export type OcrLanguage = 'spa' | 'eng';
export type OcrProgress = { status: string; progress: number };

export function progressLabel(status: string): string {
  if (status === 'recognizing text') return 'Leyendo el texto…';
  if (status === 'loading language traineddata') return 'Preparando el idioma…';
  if (status === 'initializing tesseract') return 'Preparando el reconocimiento…';
  return 'Cargando el motor local…';
}

function abortError() { return new DOMException('Operación cancelada', 'AbortError'); }

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(abortError());
  return new Promise((resolve, reject) => {
    const cancel = () => reject(abortError());
    signal.addEventListener('abort', cancel, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
  });
}

/** El worker, motor y datos de idioma se sirven desde el mismo origen; la imagen nunca es una URL remota. */
export async function recognizeText(image: Blob, language: OcrLanguage, signal: AbortSignal, onProgress: (value: OcrProgress) => void): Promise<string> {
  if (signal.aborted) throw abortError();
  const { createWorker } = await import('tesseract.js');
  if (signal.aborted) throw abortError();
  const base = new URL(import.meta.env.BASE_URL, location.origin);
  const path = (part: string) => new URL(`ocr/${part}`, base).href;
  let worker: OcrWorker | undefined;
  let failEngine: (error: Error) => void = () => {};
  const failure = new Promise<never>((_, reject) => { failEngine = reject; });
  const creation = createWorker(language, 1, {
    workerPath: path('worker.min.js'), corePath: path('core'), langPath: path('lang'),
    workerBlobURL: false, cacheMethod: 'none', gzip: true,
    logger: ({ status, progress }) => { if (!signal.aborted) onProgress({ status: progressLabel(status), progress: Number.isFinite(progress) ? Math.max(0, Math.min(progress, 1)) : 0 }); },
    errorHandler: () => failEngine(new Error('No se pudo iniciar o ejecutar el motor de reconocimiento.')),
  });
  // Si se cancela durante la descarga, se libera el worker cuando termine de iniciarse.
  void creation.then(w => { if (signal.aborted) void w.terminate(); }, () => {});
  try {
    worker = await abortable(Promise.race([creation, failure]), signal);
    const result = await abortable(Promise.race([worker.recognize(image), failure]), signal);
    return result.data.text.trim();
  } finally {
    if (worker) await worker.terminate();
  }
}

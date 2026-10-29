import { useEffect, useRef, useState } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { formatBytes, makeOutputName, validateImageFile } from '../lib/files';
import type { BackgroundProgress, BackgroundRemovalOutput } from '../lib/backgroundRemoval';

const MAX_FILE_BYTES = 15 * 1024 * 1024;

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!blob) {
      setUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);
  return url;
}

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BackgroundRemovalOutput | null>(null);
  const [progress, setProgress] = useState<BackgroundProgress>({ message: '', percent: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(result?.blob ?? null);
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof memory === 'number' && memory < 4;
  const wasmAvailable = typeof WebAssembly !== 'undefined';

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleFile = (nextFile: File) => {
    abortRef.current?.abort();
    const validationError = validateImageFile(nextFile, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(nextFile);
    setResult(null);
    setError('');
    setProgress({ message: '', percent: 0 });
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setResult(null);
    setError('');
    setProgress({ message: '', percent: 0 });
    setProcessing(false);
  };

  const removeBackground = async () => {
    if (!file || !wasmAvailable) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setProcessing(true);
    setResult(null);
    setError('');

    try {
      const module = await import('../lib/backgroundRemoval');
      const output = await module.removeImageBackground(file, {
        signal: controller.signal,
        onProgress: setProgress,
      });
      if (!controller.signal.aborted) setResult(output);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') {
        setProgress({ message: 'Operación cancelada', percent: 0 });
      } else {
        setError(caught instanceof Error ? caught.message : 'No se pudo eliminar el fondo.');
        setProgress({ message: '', percent: 0 });
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <Seo
        title="Eliminar el fondo de una imagen en privado | PixelTools"
        description="Quita fondos con inteligencia artificial directamente en tu navegador y descarga un PNG transparente."
        path="/eliminar-fondo"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="scissors"
          eyebrow="Eliminador de fondos"
          title="Tu sujeto, sin distracciones."
          description="La inteligencia artificial separa el elemento principal del fondo en tu propio dispositivo. El primer uso descarga un modelo ligero de 4,6 MB."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {!wasmAvailable && <div className="mb-4"><Notice tone="error">Tu navegador no admite WebAssembly. Esta herramienta no puede funcionar en este dispositivo.</Notice></div>}
              {lowMemory && <div className="mb-4"><Notice tone="warning">Este dispositivo informa de poca memoria. Usa una fotografía pequeña y cierra otras pestañas antes de procesarla.</Notice></div>}
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone
                description="JPG, PNG o WebP · Máximo 15 MB · Hasta 24 megapíxeles"
                disabled={!wasmAvailable}
                onFile={handleFile}
              />
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatBytes(file.size)} · procesamiento local</p>
                </div>
                <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                  <Icon className="size-4" name="reset" /> Otra imagen
                </button>
              </div>

              <div className={`mt-6 grid gap-4 ${result ? 'md:grid-cols-2' : ''}`}>
                <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <div className="grid min-h-80 place-items-center p-3">
                    <img className="max-h-[30rem] rounded-lg object-contain" src={inputUrl} alt="Imagen original antes de eliminar el fondo" />
                  </div>
                  <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600">Antes</figcaption>
                </figure>
                {result && outputUrl && (
                  <figure className="checkerboard overflow-hidden rounded-2xl border border-slate-200">
                    <div className="grid min-h-80 place-items-center p-3">
                      <img className="max-h-[30rem] rounded-lg object-contain" src={outputUrl} alt="Resultado con el fondo transparente" />
                    </div>
                    <figcaption className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600">
                      <span>Después · PNG transparente</span><span>{result.width} × {result.height} px</span>
                    </figcaption>
                  </figure>
                )}
              </div>

              {processing && (
                <div className="mx-auto mt-7 max-w-xl" role="status" aria-live="polite">
                  <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-slate-600">
                    <span>{progress.message}</span><span>{Math.round(progress.percent)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-linear-to-r from-blue-500 to-violet-500 transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
                  </div>
                  <p className="mt-3 text-center text-xs text-slate-500">Durante la inferencia la cancelación puede tardar unos segundos.</p>
                </div>
              )}

              {error && <div className="mx-auto mt-6 max-w-xl"><Notice tone="error">{error}</Notice></div>}
              {result?.resized && (
                <div className="mx-auto mt-6 max-w-xl"><Notice tone="info">Para evitar errores de memoria, el resultado se redujo desde {result.originalWidth} × {result.originalHeight} px.</Notice></div>
              )}

              <div className="mx-auto mt-7 flex max-w-xl flex-col gap-2 sm:flex-row">
                {result && outputUrl ? (
                  <a className="btn btn-primary flex-1" href={outputUrl} download={makeOutputName(file.name, 'image/png', 'sin-fondo')}>
                    <Icon className="size-5" name="download" /> Descargar PNG
                  </a>
                ) : (
                  <button className="btn btn-primary flex-1" type="button" disabled={processing} onClick={removeBackground}>
                    <Icon className="size-5" name="sparkles" /> Eliminar fondo
                  </button>
                )}
                {processing && (
                  <button className="btn btn-secondary" type="button" onClick={() => abortRef.current?.abort()}>Cancelar</button>
                )}
                {result && (
                  <button className="btn btn-secondary" type="button" onClick={removeBackground}>Procesar de nuevo</button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="size-5 text-blue-600" name="shield" />
            <h2 className="mt-4 font-extrabold text-slate-900">Sin subir la fotografía</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Se descarga el modelo de IA; tu imagen no se envía al servidor durante el procesamiento.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="size-5 text-blue-600" name="sparkles" />
            <h2 className="mt-4 font-extrabold text-slate-900">Modelo ligero</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">U²-Net pequeño está optimizado para navegadores. El primer uso puede tardar más por la descarga.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="size-5 text-blue-600" name="image" />
            <h2 className="mt-4 font-extrabold text-slate-900">Límites transparentes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Cabello, cristal, sombras o fondos muy similares al sujeto pueden necesitar una herramienta profesional.</p>
          </article>
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

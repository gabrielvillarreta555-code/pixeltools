import { useEffect, useRef, useState } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { downloadBlob, formatBytes, makeOutputName, validateImageFile } from '../lib/files';
import type { BackgroundProgress, BackgroundRemovalOutput } from '../lib/backgroundRemoval';
import { composeCutout, type BackgroundFill, type ComposeOutput } from '../lib/composition';
import { useObjectUrl } from '../lib/useObjectUrl';

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const SWATCHES = ['#ffffff', '#0f172a', '#e2e8f0', '#2563eb', '#f97316', '#fde68a'];

type BackgroundChoice = 'transparent' | 'color' | 'blur';
type ExportType = 'image/png' | 'image/jpeg';

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BackgroundRemovalOutput | null>(null);
  const [progress, setProgress] = useState<BackgroundProgress>({ message: '', percent: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [backgroundChoice, setBackgroundChoice] = useState<BackgroundChoice>('transparent');
  const [color, setColor] = useState('#ffffff');
  const [crop, setCrop] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('image/png');
  const [composed, setComposed] = useState<ComposeOutput | null>(null);
  const [composing, setComposing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(composed?.blob);
  const effectiveType: ExportType = backgroundChoice === 'transparent' ? 'image/png' : exportType;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof memory === 'number' && memory < 4;
  const wasmAvailable = typeof WebAssembly !== 'undefined';

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!result || !file) {
      setComposed(null);
      setComposing(false);
      return;
    }
    const controller = new AbortController();
    const background: BackgroundFill =
      backgroundChoice === 'color' ? { kind: 'color', color } : { kind: backgroundChoice };
    setComposing(true);
    composeCutout(result.blob, file, result.subject, {
      background,
      crop,
      mimeType: effectiveType,
      signal: controller.signal,
    })
      .then((output) => {
        if (!controller.signal.aborted) setComposed(output);
      })
      .catch((caught) => {
        if (controller.signal.aborted) return;
        setError(caught instanceof Error ? caught.message : 'No se pudo aplicar el fondo.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setComposing(false);
      });
    return () => controller.abort();
  }, [result, file, backgroundChoice, color, crop, effectiveType]);

  const handleFiles = ([nextFile]: File[]) => {
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
    setBackgroundChoice('transparent');
    setCrop(false);
    setExportType('image/png');
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
          description="La inteligencia artificial separa el elemento principal del fondo en tu propio dispositivo. Déjalo transparente, ponle un color o desenfoca el original. El primer uso descarga un modelo ligero de 4,6 MB."
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
                onFiles={handleFiles}
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
                {result && outputUrl && composed && (
                  <figure className={`overflow-hidden rounded-2xl border border-slate-200 ${effectiveType === 'image/png' && backgroundChoice === 'transparent' ? 'checkerboard' : 'bg-slate-100'}`}>
                    <div className="grid min-h-80 place-items-center p-3">
                      <img
                        className={`max-h-[30rem] rounded-lg object-contain transition-opacity ${composing ? 'opacity-60' : ''}`}
                        src={outputUrl}
                        alt={backgroundChoice === 'transparent' ? 'Resultado con el fondo transparente' : 'Resultado con el fondo sustituido'}
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600">
                      <span>Después · {backgroundChoice === 'transparent' ? 'PNG transparente' : `${effectiveType === 'image/png' ? 'PNG' : 'JPG'} con fondo`}</span>
                      <span>{composed.width} × {composed.height} px · {formatBytes(composed.blob.size)}</span>
                    </figcaption>
                  </figure>
                )}
              </div>

              {result && (
                <fieldset className="mx-auto mt-7 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" disabled={processing}>
                  <legend className="px-1 text-sm font-extrabold text-slate-900">Personalizar el resultado</legend>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Fondo">
                    {([
                      ['transparent', 'Transparente'],
                      ['color', 'Color'],
                      ['blur', 'Desenfocado'],
                    ] as const).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-center text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 ${backgroundChoice === value ? 'border-blue-500 bg-white text-blue-700 shadow-sm' : 'border-slate-200 bg-white/60 text-slate-600'}`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="background"
                          value={value}
                          checked={backgroundChoice === value}
                          onChange={() => setBackgroundChoice(value)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  {backgroundChoice === 'color' && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {SWATCHES.map((swatch) => (
                        <button
                          key={swatch}
                          className={`size-8 rounded-full border shadow-sm ${color === swatch ? 'ring-2 ring-blue-600 ring-offset-2' : 'border-slate-300'}`}
                          style={{ backgroundColor: swatch }}
                          type="button"
                          aria-label={`Fondo ${swatch}`}
                          aria-pressed={color === swatch}
                          onClick={() => setColor(swatch)}
                        />
                      ))}
                      <label className="ml-1 flex items-center gap-2 text-xs font-bold text-slate-600">
                        <input
                          className="size-8 cursor-pointer rounded-full border border-slate-300 bg-white p-0.5"
                          type="color"
                          value={color}
                          onChange={(event) => setColor(event.target.value)}
                        />
                        Otro color
                      </label>
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-start gap-2.5 text-sm text-slate-700">
                      <input
                        className="mt-1 size-4 accent-blue-600"
                        type="checkbox"
                        checked={crop}
                        disabled={!result.subject}
                        onChange={(event) => setCrop(event.target.checked)}
                      />
                      <span>
                        <span className="font-bold">Recortar al sujeto</span>
                        <span className="block text-xs text-slate-500">Elimina el espacio vacío alrededor.</span>
                      </span>
                    </label>
                    <div>
                      <label className="field-label" htmlFor="export-type">Formato de descarga</label>
                      <select
                        id="export-type"
                        className="select-field"
                        value={effectiveType}
                        disabled={backgroundChoice === 'transparent'}
                        aria-describedby="export-help"
                        onChange={(event) => setExportType(event.target.value as ExportType)}
                      >
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPG — más ligero</option>
                      </select>
                      <p id="export-help" className="mt-2 text-xs leading-5 text-slate-500">
                        {backgroundChoice === 'transparent' ? 'La transparencia solo se conserva en PNG.' : 'Con fondo opaco puedes elegir JPG.'}
                      </p>
                    </div>
                  </div>
                </fieldset>
              )}

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
                {result && composed ? (
                  <button
                    className="btn btn-primary flex-1"
                    type="button"
                    disabled={composing}
                    onClick={() => downloadBlob(composed.blob, makeOutputName(file.name, effectiveType, 'sin-fondo'))}
                  >
                    <Icon className="size-5" name="download" /> Descargar {effectiveType === 'image/png' ? 'PNG' : 'JPG'}
                  </button>
                ) : (
                  <button className="btn btn-primary flex-1" type="button" disabled={processing || Boolean(result)} onClick={removeBackground}>
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

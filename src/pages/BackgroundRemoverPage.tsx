import { BlueHint } from '../components/BlueHint';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
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
import { prepareBackgroundImage, type PreparedBackground } from '../lib/backgroundInput';

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const SWATCHES = [
  ['#ffffff', 'Blanco'],
  ['#0f172a', 'Negro'],
  ['#e2e8f0', 'Gris claro'],
  ['#2563eb', 'Azul'],
  ['#f97316', 'Naranja'],
  ['#fde68a', 'Amarillo'],
] as const;
const GRADIENTS = [
  ['noche', 'Noche', '#0b1430', '#2f7bff'],
  ['cielo', 'Cielo', '#60a5fa', '#e0f2fe'],
  ['atardecer', 'Atardecer', '#f97316', '#db2777'],
  ['menta', 'Menta', '#0d9488', '#a7f3d0'],
  ['lavanda', 'Lavanda', '#7c3aed', '#f0abfc'],
  ['grafito', 'Grafito', '#111827', '#6b7280'],
] as const;
const BACKGROUND_OPTIONS = [
  ['transparent', 'Transparente'],
  ['color', 'Color'],
  ['gradient', 'Degradado'],
  ['image', 'Imagen'],
  ['blur', 'Desenfoque'],
] as const;
// Espera breve antes de recomponer: el selector de color emite muchos cambios
// seguidos y cada composición reserva un lienzo del tamaño del resultado.
const COMPOSE_DELAY_MS = 120;

type BackgroundChoice = (typeof BACKGROUND_OPTIONS)[number][0];
type ExportType = 'image/png' | 'image/jpeg';
type ComposedResult = ComposeOutput & { transparent: boolean; mimeType: ExportType; cropped: boolean; fillKey: string };

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prepared, setPrepared] = useState<PreparedBackground | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [result, setResult] = useState<BackgroundRemovalOutput | null>(null);
  const [progress, setProgress] = useState<BackgroundProgress>({ message: '', percent: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [backgroundChoice, setBackgroundChoice] = useState<BackgroundChoice>('transparent');
  const [color, setColor] = useState('#ffffff');
  const [crop, setCrop] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('image/png');
  const [composed, setComposed] = useState<ComposedResult | null>(null);
  const [composing, setComposing] = useState(false);
  const [gradientId, setGradientId] = useState<string>(GRADIENTS[0][0]);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const abortRef = useRef<AbortController | null>(null);
  const inputUrl = useObjectUrl(prepared?.blob);
  const outputUrl = useObjectUrl(composed?.blob);
  // Con «Imagen» pero sin imagen elegida todavía, el fondo sigue transparente.
  const fill: BackgroundFill = useMemo(() => {
    if (backgroundChoice === 'color') return { kind: 'color', color };
    if (backgroundChoice === 'gradient') {
      const [, , from, to] = GRADIENTS.find(([id]) => id === gradientId) ?? GRADIENTS[0];
      return { kind: 'gradient', from, to };
    }
    if (backgroundChoice === 'image') return backgroundImage ? { kind: 'image', image: backgroundImage } : { kind: 'transparent' };
    if (backgroundChoice === 'blur') return { kind: 'blur' };
    return { kind: 'transparent' };
  }, [backgroundChoice, color, gradientId, backgroundImage]);
  const transparent = fill.kind === 'transparent';
  // Identifica el fondo aplicado (útil para pruebas y lectores de estado).
  const fillKey =
    fill.kind === 'color' ? `color:${fill.color}` : fill.kind === 'gradient' ? `gradient:${gradientId}` : fill.kind === 'image' ? `image:${backgroundImage?.name}` : fill.kind;
  const effectiveType: ExportType = transparent ? 'image/png' : exportType;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof memory === 'number' && memory < 4;
  const wasmAvailable = typeof WebAssembly !== 'undefined';

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!result) {
      setComposed(null);
      setComposing(false);
      return;
    }
    const controller = new AbortController();
    // Se marca de inmediato para que no se pueda descargar el resultado anterior
    // con el nombre o formato de los ajustes nuevos.
    setComposing(true);
    setError('');
    const timer = setTimeout(() => {
      composeCutout(result.blob, result.backdrop, result.subject, {
        background: fill,
        crop,
        mimeType: effectiveType,
        signal: controller.signal,
      })
        .then((output) => {
          if (!controller.signal.aborted) setComposed({ ...output, transparent, mimeType: effectiveType, cropped: crop, fillKey });
        })
        .catch((caught) => {
          if (controller.signal.aborted) return;
          setComposed(null);
          setError(caught instanceof Error ? caught.message : 'No se pudo aplicar el fondo.');
        })
        .finally(() => {
          if (!controller.signal.aborted) setComposing(false);
        });
    }, COMPOSE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [result, fill, fillKey, transparent, crop, effectiveType]);

  const handleFiles = async ([nextFile]: File[]) => {
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
    setPrepared(null);
    setPreparing(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const image = await prepareBackgroundImage(nextFile, controller.signal);
      if (!controller.signal.aborted) setPrepared(image);
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : 'No se pudo preparar la imagen.');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setPreparing(false);
      }
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setPrepared(null);
    setPreparing(false);
    setResult(null);
    setError('');
    setProgress({ message: '', percent: 0 });
    setProcessing(false);
    setBackgroundChoice('transparent');
    setBackgroundImage(null);
    setCrop(false);
    setExportType('image/png');
  };

  const chooseBackgroundImage = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    event.target.value = '';
    if (!next) return;
    const validationError = validateImageFile(next, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(`Imagen de fondo: ${validationError}`);
      return;
    }
    setBackgroundImage(next);
    setBackgroundChoice('image');
  };

  const removeBackground = async () => {
    if (!file || !prepared || !wasmAvailable) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setProcessing(true);
    setResult(null);
    setError('');

    try {
      const module = await import('../lib/backgroundRemoval');
      const output = await module.removeImageBackground(file, {
        preparedImage: prepared,
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
        title="Eliminar el fondo de una imagen en privado | Vélix Blue"
        description="Quita fondos con inteligencia artificial en tu navegador y cámbialos por transparencia, un color, un degradado, una imagen o un desenfoque."
        path="/eliminar-fondo"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="scissors"
          eyebrow="Eliminador de fondos"
          blueTip="Elige una imagen y después podrás revisar el recorte y probar distintos fondos."
          title="Tu sujeto, sin distracciones."
          description="La inteligencia artificial separa el elemento principal del fondo en tu propio dispositivo. Déjalo transparente o ponle un color, un degradado, tu propia imagen o un desenfoque. El primer uso descarga un modelo ligero de 4,6 MB."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {!wasmAvailable && <div className="mb-4"><Notice tone="error">Tu navegador no admite WebAssembly. Esta herramienta no puede funcionar en este dispositivo.</Notice></div>}
              {lowMemory && <div className="mb-4"><Notice tone="warning">Este dispositivo informa de poca memoria. Usa una fotografía pequeña y cierra otras pestañas antes de procesarla.</Notice></div>}
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone
                description="JPG, PNG o WebP · Máximo 15 MB · Hasta 100 megapíxeles · Reducción automática a 2048 px / 4 MP"
                disabled={!wasmAvailable}
                onFiles={handleFiles}
              />
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{file.name}</p>
                  <p className="mt-1 text-xs text-mist">{formatBytes(file.size)} · procesamiento local</p>
                </div>
                <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                  <Icon className="size-4" name="reset" /> Otra imagen
                </button>
              </div>

              {result && outputUrl && composed && !composed.cropped ? (
                <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-white/[0.03]" aria-busy={composing} data-fondo={composed.fillKey}>
                  <div className="grid place-items-center p-3">
                    <div
                      className="compare w-full"
                      style={{ aspectRatio: `${composed.width} / ${composed.height}`, maxWidth: `calc(30rem * ${composed.width / composed.height})` }}
                    >
                      <div className={`absolute inset-0 rounded-lg ${composed.transparent ? 'checkerboard' : ''}`} />
                      <img
                        className="absolute inset-0 size-full rounded-lg object-contain"
                        src={inputUrl}
                        alt="Imagen original"
                        style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
                      />
                      <img
                        className={`absolute inset-0 size-full rounded-lg object-contain transition-opacity ${composing ? 'opacity-60' : ''}`}
                        src={outputUrl}
                        alt={composed.transparent ? 'Resultado con el fondo transparente' : 'Resultado con el fondo sustituido'}
                        style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-night/75 px-2.5 py-1 text-[0.68rem] font-bold text-white">Original</span>
                      <span className="absolute right-2 top-2 rounded-full bg-night/75 px-2.5 py-1 text-[0.68rem] font-bold text-white">Resultado</span>
                      <input
                        className="compare-range"
                        type="range"
                        min={0}
                        max={100}
                        value={comparePosition}
                        aria-label="Comparar original y resultado"
                        aria-valuetext={`${comparePosition}% del original visible`}
                        onChange={(event) => setComparePosition(Number(event.target.value))}
                      />
                      <span className="compare-handle" style={{ left: `${comparePosition}%` }} aria-hidden="true" />
                    </div>
                  </div>
                  <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-panel px-4 py-3 text-xs font-bold text-mist">
                    <span>Desliza para comparar · {composed.transparent ? 'PNG transparente' : `${composed.mimeType === 'image/png' ? 'PNG' : 'JPG'} con fondo`}</span>
                    <span>{composed.width} × {composed.height} px · {formatBytes(composed.blob.size)}</span>
                  </figcaption>
                </figure>
              ) : (
                <div className={`mt-6 grid gap-4 ${result ? 'md:grid-cols-2' : ''}`}>
                  <figure className="overflow-hidden rounded-2xl border border-line bg-white/5">
                    <div className="grid min-h-80 place-items-center p-3">
                      <img className="max-h-[30rem] rounded-lg object-contain" src={inputUrl} alt="Imagen original antes de eliminar el fondo" />
                    </div>
                    <figcaption className="border-t border-line bg-panel px-4 py-3 text-xs font-bold text-mist">Antes</figcaption>
                  </figure>
                  {result && outputUrl && composed && (
                    <figure className={`overflow-hidden rounded-2xl border border-line ${composed.transparent ? 'checkerboard' : 'bg-white/5'}`} aria-busy={composing} data-fondo={composed.fillKey}>
                      <div className="grid min-h-80 place-items-center p-3">
                        <img
                          className={`h-auto max-h-[30rem] w-auto rounded-lg object-contain transition-opacity ${composing ? 'opacity-60' : ''}`}
                          src={outputUrl}
                          width={composed.width}
                          height={composed.height}
                          alt={composed.transparent ? 'Resultado recortado con el fondo transparente' : 'Resultado recortado con el fondo sustituido'}
                        />
                      </div>
                      <figcaption className="flex items-center justify-between gap-3 border-t border-line bg-panel px-4 py-3 text-xs font-bold text-mist">
                        <span>Después · recortado al sujeto</span>
                        <span>{composed.width} × {composed.height} px · {formatBytes(composed.blob.size)}</span>
                      </figcaption>
                    </figure>
                  )}
                </div>
              )}

              {result && (
                <fieldset className="mx-auto mt-7 max-w-xl rounded-2xl border border-line bg-panel-2 p-4 sm:p-5" disabled={processing}>
                  <legend className="px-1 text-sm font-extrabold text-white">Personalizar el resultado</legend>
                  <div className="mx-auto grid max-w-sm grid-cols-3 gap-x-3 gap-y-4 sm:max-w-none sm:grid-cols-5 sm:gap-2" role="radiogroup" aria-label="Fondo">
                    {BACKGROUND_OPTIONS.map(([value, label]) => (
                      <label
                        key={value}
                        className="group cursor-pointer text-center text-[0.7rem] font-semibold text-mist has-[:focus-visible]:[&>span]:outline-2 has-[:focus-visible]:[&>span]:outline-offset-2 has-[:focus-visible]:[&>span]:outline-electric-light sm:text-xs"
                      >
                        <input className="sr-only" type="radio" name="background" value={value} checked={backgroundChoice === value} onChange={() => setBackgroundChoice(value)} />
                        <span
                          className={`relative mb-1.5 grid aspect-square w-full place-items-center overflow-hidden rounded-xl border-2 ${backgroundChoice === value ? 'border-electric-light shadow-[0_0_16px_rgba(47,123,255,0.45)]' : 'border-line group-hover:border-line-strong'} ${value === 'transparent' ? 'checkerboard' : ''}`}
                          style={{
                            color: { background: color },
                            gradient: { background: `linear-gradient(160deg, ${GRADIENTS[0][2]}, ${GRADIENTS[0][3]})` },
                            image: { background: 'linear-gradient(180deg,#0d2463,#2f7bff 70%,#bcd3ff)' },
                            blur: { background: 'radial-gradient(circle at 30% 30%,#7db4ff,#173a93 70%)' },
                            transparent: undefined,
                          }[value]}
                        >
                          {backgroundChoice === value && <Icon className="size-5 rounded-full bg-electric p-0.5 text-white" name="check" />}
                        </span>
                        <span className={backgroundChoice === value ? 'font-bold text-white' : ''}>{label}</span>
                      </label>
                    ))}
                  </div>

                  {backgroundChoice === 'gradient' && (
                    <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Degradado">
                      {GRADIENTS.map(([id, name, from, to]) => (
                        <label key={id} className="cursor-pointer has-[:focus-visible]:[&>span]:outline-2 has-[:focus-visible]:[&>span]:outline-offset-2 has-[:focus-visible]:[&>span]:outline-electric-light">
                          <input className="sr-only" type="radio" name="gradient" value={id} checked={gradientId === id} onChange={() => setGradientId(id)} aria-label={`Degradado ${name.toLowerCase()}`} />
                          <span
                            className={`block size-9 rounded-full border-2 ${gradientId === id ? 'border-white' : 'border-transparent'}`}
                            style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
                            title={name}
                          />
                        </label>
                      ))}
                    </div>
                  )}

                  {backgroundChoice === 'image' && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="btn btn-secondary cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light">
                        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseBackgroundImage} />
                        <Icon className="size-4" name="upload" /> {backgroundImage ? 'Cambiar imagen' : 'Elegir imagen de fondo'}
                      </label>
                      <span className="min-w-0 truncate text-xs text-mist">{backgroundImage ? backgroundImage.name : 'También se procesa solo en tu dispositivo.'}</span>
                    </div>
                  )}

                  {backgroundChoice === 'color' && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {SWATCHES.map(([swatch, name]) => (
                        <button
                          key={swatch}
                          className={`size-8 rounded-full border shadow-sm ${color === swatch ? 'ring-2 ring-electric-light ring-offset-2 ring-offset-panel' : 'border-line-strong'}`}
                          style={{ backgroundColor: swatch }}
                          type="button"
                          aria-label={`Fondo ${name.toLowerCase()}`}
                          aria-pressed={color === swatch}
                          onClick={() => setColor(swatch)}
                        />
                      ))}
                      <label className="ml-1 flex items-center gap-2 text-xs font-bold text-mist">
                        <input
                          className="size-8 cursor-pointer rounded-full border border-line-strong bg-panel p-0.5"
                          type="color"
                          value={color}
                          onChange={(event) => setColor(event.target.value)}
                        />
                        Otro color
                      </label>
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-start gap-2.5 text-sm text-slate-200">
                      <input
                        className="mt-1 size-4 accent-electric"
                        type="checkbox"
                        checked={crop}
                        disabled={!result.subject}
                        onChange={(event) => setCrop(event.target.checked)}
                      />
                      <span>
                        <span className="font-bold">Recortar al sujeto</span>
                        <span className="block text-xs text-mist">Elimina el espacio vacío alrededor.</span>
                      </span>
                    </label>
                    <div>
                      <label className="field-label" htmlFor="export-type">Formato de descarga</label>
                      <select
                        id="export-type"
                        className="select-field"
                        value={effectiveType}
                        disabled={transparent}
                        aria-describedby="export-help"
                        onChange={(event) => setExportType(event.target.value as ExportType)}
                      >
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPG — más ligero</option>
                      </select>
                      <p id="export-help" className="mt-2 text-xs leading-5 text-mist">
                        {transparent ? 'La transparencia solo se conserva en PNG.' : 'Con fondo opaco puedes elegir JPG.'}
                      </p>
                    </div>
                  </div>
                </fieldset>
              )}

              {processing && (
                <div className="mx-auto mt-7 max-w-xl" role="status" aria-live="polite">
                  <BlueHint message="La herramienta está preparando el resultado en este dispositivo." />
                  <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-mist">
                    <span>{progress.message}</span><span>{Math.round(progress.percent)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-linear-to-r from-blue-600 to-electric-light transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
                  </div>
                  <p className="mt-3 text-center text-xs text-mist">Durante la inferencia la cancelación puede tardar unos segundos.</p>
                </div>
              )}

              {error && <div className="mx-auto mt-6 max-w-xl"><Notice tone="error">{error}</Notice></div>}
              {preparing && <div className="mx-auto mt-6 max-w-xl"><Notice>Preparando una vista previa de tamaño seguro…</Notice></div>}
              {prepared?.resized && (
                <div className="mx-auto mt-6 max-w-xl"><Notice tone="info">Imagen redimensionada automáticamente de {prepared.originalWidth} × {prepared.originalHeight} a {prepared.width} × {prepared.height} px para reducir el uso de memoria. Se conservan las proporciones; el original no se modifica.</Notice></div>
              )}
              {result && composed && !composing && <BlueHint status message="¡Tu resultado está listo! Puedes revisar el fondo y descargarlo." />}
              {result?.resized && !prepared?.resized && (
                <div className="mx-auto mt-6 max-w-xl"><Notice tone="info">Para evitar errores de memoria, el resultado se redujo desde {result.originalWidth} × {result.originalHeight} px.</Notice></div>
              )}

              <div className="mx-auto mt-7 flex max-w-xl flex-col gap-2 sm:flex-row">
                {result ? (
                  <button
                    className="btn btn-primary flex-1"
                    type="button"
                    disabled={composing || !composed}
                    onClick={() => composed && downloadBlob(composed.blob, makeOutputName(file.name, composed.mimeType, 'sin-fondo'))}
                  >
                    <Icon className="size-5" name="download" /> Descargar {effectiveType === 'image/png' ? 'PNG' : 'JPG'}
                  </button>
                ) : (
                  <button className="btn btn-primary flex-1" type="button" disabled={processing || preparing || !prepared} onClick={removeBackground}>
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
          <article className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <Icon className="size-5 text-electric-light" name="shield" />
            <h2 className="mt-4 font-extrabold text-white">Sin subir la fotografía</h2>
            <p className="mt-2 text-sm leading-6 text-mist">Se descarga el modelo de IA; tu imagen no se envía al servidor durante el procesamiento.</p>
          </article>
          <article className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <Icon className="size-5 text-electric-light" name="sparkles" />
            <h2 className="mt-4 font-extrabold text-white">Modelo ligero</h2>
            <p className="mt-2 text-sm leading-6 text-mist">U²-Net pequeño está optimizado para navegadores. El primer uso puede tardar más por la descarga.</p>
          </article>
          <article className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <Icon className="size-5 text-electric-light" name="image" />
            <h2 className="mt-4 font-extrabold text-white">Límites transparentes</h2>
            <p className="mt-2 text-sm leading-6 text-mist">Cabello, cristal, sombras o fondos muy similares al sujeto pueden necesitar una herramienta profesional.</p>
          </article>
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

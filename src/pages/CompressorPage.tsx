import { BlueHint } from '../components/BlueHint';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import {
  downloadBlob,
  formatBytes,
  isSupportedImageType,
  makeOutputName,
  reductionPercent,
  type SupportedImageType,
  validateImageFile,
} from '../lib/files';
import { compressImage, supportsCanvasFormat, type CompressionOutput } from '../lib/imageProcessing';
import { useObjectUrl } from '../lib/useObjectUrl';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 30;
const RESIZE_PRESETS = [3840, 2560, 1920, 1280, 1024, 800];
const FORMAT_LABELS: Record<SupportedImageType, string> = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP' };

type OutputChoice = SupportedImageType | 'keep';
type ItemStatus = 'pending' | 'processing' | 'done' | 'error';

interface BatchItem {
  id: number;
  file: File;
  status: ItemStatus;
  result?: CompressionOutput & { mimeType: SupportedImageType };
  error?: string;
}

let nextItemId = 1;

type Mode = 'compress' | 'convert';

// El compresor y el convertidor comparten motor (lotes, cancelación, ZIP);
// solo cambian los textos y el formato de salida por defecto.
const MODES = {
  compress: {
    seo: {
      title: 'Comprimir imágenes online gratis y en privado | Vélix Blue',
      description: 'Reduce el peso de imágenes JPG, PNG y WebP en tu navegador, sin subir tus fotografías a un servidor.',
      path: '/comprimir-imagen',
    },
    icon: 'compress' as const,
    eyebrow: 'Compresor de imágenes',
    title: 'Menos peso. La calidad que tú eliges.',
    description: 'Optimiza y redimensiona JPG, PNG y WebP, de una en una o por lotes, sin subir archivos a ningún servidor. Compara el resultado y descarga al instante.',
    verb: 'Comprimir',
    defaultOutput: 'keep' as OutputChoice,
  },
  convert: {
    seo: {
      title: 'Convertir imágenes a JPG, PNG o WebP gratis | Vélix Blue',
      description: 'Convierte imágenes entre JPG, PNG y WebP en tu navegador, también por lotes, sin subirlas a un servidor.',
      path: '/convertir-imagen',
    },
    icon: 'convert' as const,
    eyebrow: 'Convertidor de formato',
    title: 'Cambia el formato en un instante.',
    description: 'Convierte JPG, PNG y WebP, de una en una o por lotes, sin subir tus archivos. Ajusta la calidad y descárgalas juntas en un ZIP.',
    verb: 'Convertir',
    defaultOutput: 'image/jpeg' as OutputChoice,
  },
};

function isRealReduction(item: BatchItem) {
  return Boolean(item.result && item.result.blob.size < item.file.size);
}

/** En el convertidor siempre «convertida»; en el compresor, «comprimida» solo si pesa menos. */
function outputName(item: BatchItem, mode: 'compress' | 'convert' = 'compress') {
  if (!item.result) return item.file.name;
  const suffix = mode === 'compress' && isRealReduction(item) ? 'comprimida' : 'convertida';
  return makeOutputName(item.file.name, item.result.mimeType, suffix);
}

function formatPercent(value: number) {
  return `${Math.abs(value).toFixed(1).replace('.', ',')}%`;
}

export function CompressorPage({ mode = 'compress' }: { mode?: Mode }) {
  const config = MODES[mode];
  const [items, setItems] = useState<BatchItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quality, setQuality] = useState(80);
  const [useTarget, setUseTarget] = useState(false);
  const [targetKb, setTargetKb] = useState(200);
  const [outputChoice, setOutputChoice] = useState<OutputChoice>(config.defaultOutput);
  const [resizeChoice, setResizeChoice] = useState<string>('0');
  const [customSide, setCustomSide] = useState(1600);
  const [rejected, setRejected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [zipping, setZipping] = useState(false);
  const [webpSupported, setWebpSupported] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const inputUrl = useObjectUrl(selected?.file);
  const outputUrl = useObjectUrl(selected?.result?.blob);

  useEffect(() => {
    setWebpSupported(supportsCanvasFormat('image/webp'));
    return () => abortRef.current?.abort();
  }, []);

  const maxDimension = resizeChoice === 'custom' ? customSide : Number(resizeChoice);
  const customInvalid = resizeChoice === 'custom' && (!Number.isInteger(customSide) || customSide < 16 || customSide > 12_000);
  const targetInvalid = useTarget && (!Number.isInteger(targetKb) || targetKb < 1 || targetKb > 25600);

  const targetType = (file: File): SupportedImageType => {
    if (outputChoice !== 'keep') return outputChoice;
    if (isSupportedImageType(file.type) && (file.type !== 'image/webp' || webpSupported)) return file.type;
    return 'image/jpeg';
  };

  const targets = items.map((item) => targetType(item.file));
  const allPng = targets.length > 0 && targets.every((type) => type === 'image/png');
  const jpegLosesAlpha = items.some((item, index) => targets[index] === 'image/jpeg' && item.file.type !== 'image/jpeg');

  const done = items.filter((item) => item.result);
  const pending = items.filter((item) => item.status !== 'done');
  const totalOriginal = done.reduce((sum, item) => sum + item.file.size, 0);
  const totalOutput = done.reduce((sum, item) => sum + (item.result?.blob.size ?? 0), 0);
  const totals = { original: totalOriginal, output: totalOutput, reduction: reductionPercent(totalOriginal, totalOutput) };

  const clearResults = () => {
    setItems((current) => current.map(({ id, file }) => ({ id, file, status: 'pending' })));
    setProgress('');
  };

  const addFiles = (files: File[]) => {
    const accepted: BatchItem[] = [];
    const problems: string[] = [];
    const room = MAX_FILES - items.length;
    for (const file of files) {
      const validationError = validateImageFile(file, { maxBytes: MAX_FILE_BYTES });
      if (validationError) problems.push(`${file.name}: ${validationError}`);
      else if (accepted.length >= room) problems.push(`${file.name}: se admite un máximo de ${MAX_FILES} imágenes por lote.`);
      else accepted.push({ id: nextItemId++, file, status: 'pending' });
    }
    setRejected(problems);
    setError('');
    if (accepted.length === 0) return;
    setItems((current) => [...current, ...accepted]);
    if (!selected) setSelectedId(accepted[0].id);
  };

  const handleAddInput = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const removeItem = (id: number) => {
    if (processing) return;
    setItems((current) => current.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setItems([]);
    setSelectedId(null);
    setRejected([]);
    setError('');
    setProgress('');
    setProcessing(false);
    setQuality(80);
    setUseTarget(false);
    setTargetKb(200);
    setOutputChoice(config.defaultOutput);
    setResizeChoice('0');
  };

  const processAll = async () => {
    if (items.length === 0 || customInvalid || targetInvalid) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setProcessing(true);
    setError('');
    const queue = items.filter((item) => item.status !== 'done');

    try {
      for (const [index, item] of queue.entries()) {
        if (controller.signal.aborted) break;
        const mimeType = targetType(item.file);
        const prefix = queue.length > 1 ? `Imagen ${index + 1} de ${queue.length} · ` : '';
        setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'processing', error: undefined } : entry)));
        try {
          const output = await compressImage(item.file, {
            mimeType,
            quality: quality / 100,
            targetBytes: mode === 'compress' && useTarget ? targetKb * 1024 : undefined,
            maxDimension: maxDimension || undefined,
            signal: controller.signal,
            onProgress: (message) => setProgress(prefix + message),
          });
          if (controller.signal.aborted) break;
          setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'done', result: { ...output, mimeType } } : entry)));
        } catch (caught) {
          if (caught instanceof DOMException && caught.name === 'AbortError') break;
          const message = caught instanceof Error ? caught.message : 'No se pudo procesar la imagen.';
          setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'error', error: message } : entry)));
        }
      }
      if (controller.signal.aborted) {
        setItems((current) => current.map((entry) => (entry.status === 'processing' ? { ...entry, status: 'pending' } : entry)));
        setProgress('Operación cancelada');
      } else {
        setProgress(queue.length > 1 ? 'Lote terminado' : 'Imagen lista');
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setProcessing(false);
      }
    }
  };

  const downloadAll = async () => {
    if (done.length === 1) {
      downloadBlob(done[0].result!.blob, outputName(done[0], mode));
      return;
    }
    setZipping(true);
    setError('');
    try {
      const { createZip } = await import('../lib/zip');
      const zip = await createZip(done.map((item) => ({ name: outputName(item, mode), data: item.result!.blob })));
      downloadBlob(zip, 'velix-blue-imagenes.zip');
    } catch (caught) {
      setError(caught instanceof Error ? `No se pudo crear el ZIP: ${caught.message}` : 'No se pudo crear el ZIP.');
    } finally {
      setZipping(false);
    }
  };

  const changeSetting = (apply: () => void) => {
    apply();
    clearResults();
  };

  const selectedResult = selected?.result;

  return (
    <>
      <Seo {...config.seo} />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon={config.icon}
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
          blueTip={mode === 'compress' ? 'Elige tus imágenes y ajusta el tamaño o la calidad antes de comprimir.' : 'Elige tus imágenes y el formato al que quieres convertirlas.'}
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {items.length === 0 ? (
            <div className="p-4 sm:p-7">
              {rejected.length > 0 && <div className="mb-4"><RejectedNotice files={rejected} /></div>}
              <UploadZone
                description={`JPG, PNG o WebP · Hasta ${MAX_FILES} imágenes · Máximo 25 MB y 32 megapíxeles cada una`}
                multiple
                onFiles={addFiles}
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="min-w-0 border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {items.length === 1 ? items[0].file.name : `${items.length} imágenes en el lote`}
                    </p>
                    <p className="mt-1 text-xs text-mist">
                      Original · {formatBytes(items.reduce((sum, item) => sum + item.file.size, 0))}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <input
                      ref={addInputRef}
                      className="sr-only"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      tabIndex={-1}
                      aria-hidden="true"
                      onChange={handleAddInput}
                    />
                    <button
                      className="btn btn-ghost"
                      type="button"
                      disabled={processing || items.length >= MAX_FILES}
                      onClick={() => addInputRef.current?.click()}
                    >
                      <Icon className="size-4" name="plus" /> Añadir
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={reset}>
                      <Icon className="size-4" name="reset" /> Empezar de nuevo
                    </button>
                  </div>
                </div>

                {rejected.length > 0 && <div className="mt-4"><RejectedNotice files={rejected} /></div>}

                {selected && (
                  <>
                    <div className="mt-5 grid min-h-80 place-items-center overflow-hidden rounded-2xl border border-line bg-panel-2 p-3">
                      <img
                        className="h-auto max-h-[30rem] w-auto max-w-full rounded-lg object-contain"
                        src={outputUrl || inputUrl}
                        width={outputUrl ? selectedResult?.width : undefined}
                        height={outputUrl ? selectedResult?.height : undefined}
                        alt={outputUrl ? `Vista previa optimizada de ${selected.file.name}` : `Vista previa original de ${selected.file.name}`}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-mist">
                      <span className="min-w-0 truncate">
                        {outputUrl ? 'Resultado' : 'Original'}{items.length > 1 ? ` · ${selected.file.name}` : ''}
                      </span>
                      {selectedResult && (
                        <span>
                          {selectedResult.resized
                            ? `${selectedResult.originalWidth} × ${selectedResult.originalHeight} → ${selectedResult.width} × ${selectedResult.height} px`
                            : `${selectedResult.width} × ${selectedResult.height} px`}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {items.length > 1 && (
                  <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line" aria-label="Imágenes del lote">
                    {items.map((item) => (
                      <BatchRow
                        mode={mode}
                        key={item.id}
                        item={item}
                        selected={item.id === selected?.id}
                        disabled={processing}
                        onSelect={() => setSelectedId(item.id)}
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col p-5 sm:p-7">
                <h2 className="text-lg font-extrabold tracking-tight text-white">Ajustes de salida</h2>

                <div className="mt-6">
                  <label className="field-label" htmlFor="output-format">Formato</label>
                  <select
                    id="output-format"
                    className="select-field"
                    value={outputChoice}
                    disabled={processing}
                    onChange={(event) => changeSetting(() => setOutputChoice(event.target.value as OutputChoice))}
                  >
                    {mode === 'compress' && <option value="keep">Mantener el formato original</option>}
                    <option value="image/jpeg">JPG — menor tamaño para fotografías</option>
                    <option value="image/png">PNG — transparencia y gráficos</option>
                    {webpSupported && <option value="image/webp">WebP — gran compresión</option>}
                  </select>
                </div>

                <div className="mt-6">
                  {mode === 'compress' && (
                    <div className="mb-6 rounded-xl border border-line bg-panel-2 p-4">
                      <label className="flex items-center gap-3 text-sm font-bold text-white">
                        <input type="checkbox" className="size-4 accent-blue-600" checked={useTarget} disabled={processing} onChange={(event) => changeSetting(() => setUseTarget(event.target.checked))} />
                        Comprimir a un tamaño objetivo
                      </label>
                      {useTarget && (
                        <div className="mt-4">
                          <label className="field-label" htmlFor="target-kb">Máximo por imagen (KB)</label>
                          <input id="target-kb" className="text-field" type="number" min="1" max="25600" step="1" inputMode="numeric" value={Number.isFinite(targetKb) ? targetKb : ''} disabled={processing} aria-invalid={targetInvalid} aria-describedby="target-help" onChange={(event) => changeSetting(() => setTargetKb(event.target.valueAsNumber))} />
                          <p id="target-help" className="mt-2 text-xs leading-5 text-mist">Entre 1 y 25.600 KB por imagen. JPG y WebP buscan una calidad entre 30% y 95%; PNG no admite ese ajuste. No se cambian las dimensiones salvo que lo elijas abajo.</p>
                          {targetInvalid && <p className="mt-2 text-xs text-red-300" role="alert">Introduce un número entero entre 1 y 25.600 KB.</p>}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="field-label mb-0" htmlFor="quality">Calidad</label>
                    <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">
                      {allPng ? 'Sin ajuste' : useTarget && mode === 'compress' ? 'Automática' : `${quality}%`}
                    </span>
                  </div>
                  <input
                    id="quality"
                    className="range-field disabled:opacity-35"
                    type="range"
                    min="30"
                    max="95"
                    step="1"
                    value={quality}
                    disabled={processing || allPng || (useTarget && mode === 'compress')}
                    aria-describedby="quality-help"
                    onChange={(event) => changeSetting(() => setQuality(Number(event.target.value)))}
                  />
                  <div className="mt-2 flex justify-between text-[0.68rem] font-semibold text-mist">
                    <span>Menor peso</span><span>Mayor detalle</span>
                  </div>
                  <p id="quality-help" className="mt-3 text-xs leading-5 text-mist">
                    {useTarget && mode === 'compress'
                      ? 'La calidad se ajusta automáticamente para JPG y WebP; PNG se codifica sin pérdida.'
                      : allPng
                      ? 'Canvas exporta PNG sin un control de calidad con pérdida. Reducir dimensiones sí aligera el archivo.'
                      : 'Entre 70% y 85% suele ofrecer un buen equilibrio. No se aplica a las salidas PNG.'}
                  </p>
                </div>

                <div className="mt-6">
                  <label className="field-label" htmlFor="resize">Tamaño máximo</label>
                  <select
                    id="resize"
                    className="select-field"
                    value={resizeChoice}
                    disabled={processing}
                    aria-describedby="resize-help"
                    onChange={(event) => changeSetting(() => setResizeChoice(event.target.value))}
                  >
                    <option value="0">Dimensiones originales</option>
                    {RESIZE_PRESETS.map((side) => (
                      <option key={side} value={side}>{side} px en el lado mayor</option>
                    ))}
                    <option value="custom">Personalizado…</option>
                  </select>
                  {resizeChoice === 'custom' && (
                    <div className="mt-3">
                      <label className="field-label" htmlFor="custom-side">Lado mayor en píxeles</label>
                      <input
                        id="custom-side"
                        className="text-field"
                        type="number"
                        inputMode="numeric"
                        min={16}
                        max={12000}
                        step={1}
                        value={Number.isFinite(customSide) ? customSide : ''}
                        disabled={processing}
                        aria-invalid={customInvalid}
                        onChange={(event) => changeSetting(() => setCustomSide(event.target.valueAsNumber))}
                      />
                      {customInvalid && <p className="mt-2 text-xs font-semibold text-red-300">Introduce un valor entero entre 16 y 12.000.</p>}
                    </div>
                  )}
                  <p id="resize-help" className="mt-3 text-xs leading-5 text-mist">
                    Mantiene la proporción y nunca amplía imágenes más pequeñas.
                  </p>
                </div>

                {jpegLosesAlpha && (
                  <div className="mt-5"><Notice tone="warning">JPG no admite transparencia. Las áreas transparentes se rellenarán en blanco.</Notice></div>
                )}

                {error && <div className="mt-5"><Notice tone="error">{error}</Notice></div>}
                {items.length === 1 && items[0].error && <div className="mt-5"><Notice tone="error">{items[0].error}</Notice></div>}

                {processing && (
                  <div className="mt-6" role="status" aria-live="polite">
                    <BlueHint message="La herramienta está procesando tus imágenes en este dispositivo." />
                    <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-mist">
                      <span className="min-w-0 truncate">{progress}</span><span className="shrink-0">Procesando localmente</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      {items.length > 1 ? (
                        <div
                          className="h-full rounded-full bg-linear-to-r from-blue-600 to-electric-light transition-[width] duration-300"
                          style={{ width: `${Math.max(6, (done.length / items.length) * 100)}%` }}
                        />
                      ) : (
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-blue-600 to-electric-light" />
                      )}
                    </div>
                  </div>
                )}
                {!processing && progress && <p className="sr-only" role="status">{progress}</p>}

                {/* El resumen aparece al terminar para que los controles no se desplacen durante el lote. */}
                {done.length > 0 && !processing && (
                  <div className="mt-6 rounded-2xl border border-line bg-panel-2 p-4" aria-live="polite">
                    <BlueHint status message="¡Hay resultados listos! Revisa el resumen antes de descargarlos." />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-mist">Original</p>
                        <p className="mt-1 text-lg font-extrabold text-white">{formatBytes(totals.original)}</p>
                      </div>
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-mist">Resultado</p>
                        <p className="mt-1 text-lg font-extrabold text-white">{formatBytes(totals.output)}</p>
                      </div>
                    </div>
                    <div className={`mt-4 rounded-xl px-3 py-2 text-sm font-bold ${totals.output < totals.original ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-100'}`}>
                      {totals.output < totals.original
                        ? `${formatPercent(totals.reduction)} menos peso${done.length > 1 ? ' en total' : ''}`
                        : `${formatPercent(totals.reduction)} más peso · no se considera comprimida`}
                    </div>
                    {done.length > 1 && (
                      <p className="mt-3 text-xs leading-5 text-mist">
                        {done.filter(isRealReduction).length} de {done.length} imágenes pesan menos que el original.
                      </p>
                    )}
                    {useTarget && mode === 'compress' && (
                      <p className="mt-3 text-sm leading-6 text-slate-200" role="status">
                        {done.filter((item) => item.result?.targetMet).length} de {done.length} imágenes alcanzaron el objetivo de {targetKb} KB por imagen.
                        {done.some((item) => item.result?.targetMet === false) && ' Algunas no lo alcanzaron. Prueba reducir las dimensiones o elegir JPG/WebP; puedes descargar el mejor resultado obtenido.'}
                      </p>
                    )}
                    {done.length === 1 && !isRealReduction(done[0]) && (
                      <p className="mt-3 text-xs leading-5 text-mist">Prueba una calidad menor, el formato WebP o un tamaño máximo menor. Puedes descargar esta conversión, pero no reduce el archivo.</p>
                    )}
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-2 pt-7">
                  {pending.length > 0 && (
                    <button className="btn btn-primary w-full" type="button" disabled={processing || customInvalid || targetInvalid} onClick={processAll}>
                      <Icon className="size-5" name={config.icon} />
                      {items.length === 1
                        ? `${config.verb} ahora`
                        : done.length > 0
                          ? pending.length === 1 ? 'Procesar la imagen restante' : `Procesar ${pending.length} restantes`
                          : `${config.verb} ${items.length} imágenes`}
                    </button>
                  )}
                  {done.length > 0 && !processing && (
                    <button
                      className={`btn w-full ${pending.length > 0 ? 'btn-secondary' : 'btn-primary'}`}
                      type="button"
                      disabled={zipping}
                      onClick={downloadAll}
                    >
                      <Icon className="size-5" name="download" />
                      {done.length === 1
                        ? `Descargar ${isRealReduction(done[0]) ? 'imagen comprimida' : `resultado ${FORMAT_LABELS[done[0].result!.mimeType]}`}`
                        : zipping
                          ? 'Preparando el ZIP…'
                          : `Descargar ${done.length} imágenes (ZIP)`}
                    </button>
                  )}
                  {processing && (
                    <button className="btn btn-ghost w-full" type="button" onClick={() => abortRef.current?.abort()}>
                      Cancelar operación
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['shield', 'Privado de verdad', 'Los archivos no se envían a Vélix Blue ni se almacenan en un servidor.'],
            ['sparkles', 'Resultado bajo control', 'Tú eliges formato, calidad y tamaño; mostramos el peso real antes de descargar.'],
            ['image', 'Por lotes', `Procesa hasta ${MAX_FILES} imágenes seguidas y descárgalas juntas en un ZIP.`],
          ].map(([icon, title, text]) => (
            <article key={title} className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
              <Icon className="size-5 text-electric-light" name={icon as 'shield'} />
              <h2 className="mt-4 font-extrabold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

function RejectedNotice({ files }: { files: string[] }) {
  return (
    <Notice tone="error">
      {files.length === 1 ? (
        files[0]
      ) : (
        <>
          <p className="font-bold">{files.length} archivos no se añadieron:</p>
          <ul className="mt-1 list-disc pl-5">
            {files.slice(0, 5).map((message) => <li key={message} className="break-words">{message}</li>)}
            {files.length > 5 && <li>Y {files.length - 5} más.</li>}
          </ul>
        </>
      )}
    </Notice>
  );
}

interface BatchRowProps {
  item: BatchItem;
  mode: Mode;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function BatchRow({ item, mode, selected, disabled, onSelect, onRemove }: BatchRowProps) {
  const { result } = item;
  const reduced = isRealReduction(item);
  return (
    <li className={`flex items-center gap-2 px-3 py-2.5 ${selected ? 'bg-electric/10' : 'bg-panel'}`}>
      <button
        className="min-w-0 flex-1 rounded-lg px-1 py-0.5 text-left"
        type="button"
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
      >
        <span className="block truncate text-sm font-semibold text-white">{item.file.name}</span>
        <span className="mt-0.5 block text-xs text-mist">
          {formatBytes(item.file.size)}
          {result && ` → ${formatBytes(result.blob.size)}`}
          {result?.targetMet === true && ' · objetivo alcanzado'}
          {result?.targetMet === false && ' · objetivo no alcanzado'}
          {result?.actualQuality !== undefined && ` · calidad ${result.actualQuality}%`}
          {item.status === 'processing' && ' · procesando…'}
          {item.status === 'error' && <span className="text-red-300"> · {item.error}</span>}
        </span>
      </button>
      {result && (
        <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold ${reduced ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-100'}`}>
          {reduced ? '−' : '+'}{formatPercent(reductionPercent(item.file.size, result.blob.size))}
        </span>
      )}
      {result && (
        <button
          className="btn btn-ghost size-9 min-h-0 shrink-0 p-0"
          type="button"
          aria-label={`Descargar ${outputName(item, mode)}`}
          onClick={() => downloadBlob(result.blob, outputName(item, mode))}
        >
          <Icon className="size-4" name="download" />
        </button>
      )}
      <button
        className="btn btn-ghost size-9 min-h-0 shrink-0 p-0"
        type="button"
        disabled={disabled}
        aria-label={`Quitar ${item.file.name} del lote`}
        onClick={onRemove}
      >
        <Icon className="size-4" name="x" />
      </button>
    </li>
  );
}

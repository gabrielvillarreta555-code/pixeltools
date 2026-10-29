import { useEffect, useMemo, useRef, useState } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import {
  formatBytes,
  isSupportedImageType,
  makeOutputName,
  reductionPercent,
  type SupportedImageType,
  validateImageFile,
} from '../lib/files';
import { compressImage, supportsCanvasFormat } from '../lib/imageProcessing';

const MAX_FILE_BYTES = 25 * 1024 * 1024;

interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  mimeType: SupportedImageType;
  quality: number;
}

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

export function CompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [outputType, setOutputType] = useState<SupportedImageType>('image/webp');
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [webpSupported, setWebpSupported] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(result?.blob ?? null);

  useEffect(() => {
    setWebpSupported(supportsCanvasFormat('image/webp'));
    return () => abortRef.current?.abort();
  }, []);

  const reduction = result ? reductionPercent(file?.size ?? 0, result.blob.size) : 0;
  const isRealReduction = Boolean(result && file && result.blob.size < file.size);
  const currentSettingsMatch = result?.mimeType === outputType && result?.quality === quality;

  const formatLabel = useMemo(
    () => ({ 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP' })[outputType],
    [outputType],
  );

  const clearResult = () => setResult(null);

  const handleFile = (nextFile: File) => {
    abortRef.current?.abort();
    const validationError = validateImageFile(nextFile, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setResult(null);
    setFile(nextFile);
    setQuality(80);
    if (isSupportedImageType(nextFile.type) && (nextFile.type !== 'image/webp' || webpSupported)) {
      setOutputType(nextFile.type);
    } else {
      setOutputType('image/jpeg');
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setResult(null);
    setError('');
    setProgress('');
    setProcessing(false);
    setQuality(80);
    setOutputType(webpSupported ? 'image/webp' : 'image/jpeg');
  };

  const processImage = async () => {
    if (!file) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setProcessing(true);
    setError('');
    setResult(null);

    try {
      const output = await compressImage(file, {
        mimeType: outputType,
        quality: quality / 100,
        signal: controller.signal,
        onProgress: setProgress,
      });
      if (controller.signal.aborted) return;
      setResult({ ...output, mimeType: outputType, quality });
      setProgress('Imagen lista');
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') {
        setProgress('Operación cancelada');
      } else {
        setError(caught instanceof Error ? caught.message : 'No se pudo procesar la imagen.');
        setProgress('');
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
        title="Comprimir imágenes online gratis y en privado | PixelTools"
        description="Reduce el peso de imágenes JPG, PNG y WebP en tu navegador, sin subir tus fotografías a un servidor."
        path="/comprimir-imagen"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="compress"
          eyebrow="Compresor de imágenes"
          title="Menos peso. La calidad que tú eliges."
          description="Optimiza JPG, PNG y WebP sin subir archivos a ningún servidor. Ajusta la calidad, compara el resultado y descarga al instante."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone
                description="JPG, PNG o WebP · Máximo 25 MB · Hasta 32 megapíxeles"
                onFile={handleFile}
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-slate-200 p-5 sm:p-7 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Original · {formatBytes(file.size)}</p>
                  </div>
                  <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                    <Icon className="size-4" name="reset" /> Otra imagen
                  </button>
                </div>

                <div className="mt-5 grid min-h-80 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img className="max-h-[30rem] w-auto rounded-lg object-contain" src={outputUrl || inputUrl} alt={outputUrl ? 'Vista previa optimizada' : 'Vista previa original'} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{outputUrl ? 'Vista previa del resultado' : 'Vista previa original'}</span>
                  {result && <span>{result.width} × {result.height} px</span>}
                </div>
              </div>

              <div className="flex flex-col p-5 sm:p-7">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Ajustes de salida</h2>

                <div className="mt-6">
                  <label className="field-label" htmlFor="output-format">Formato</label>
                  <select
                    id="output-format"
                    className="select-field"
                    value={outputType}
                    disabled={processing}
                    onChange={(event) => {
                      setOutputType(event.target.value as SupportedImageType);
                      clearResult();
                    }}
                  >
                    <option value="image/jpeg">JPG — menor tamaño para fotografías</option>
                    <option value="image/png">PNG — transparencia y gráficos</option>
                    {webpSupported && <option value="image/webp">WebP — gran compresión</option>}
                  </select>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="field-label mb-0" htmlFor="quality">Calidad</label>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {outputType === 'image/png' ? 'Sin ajuste' : `${quality}%`}
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
                    disabled={processing || outputType === 'image/png'}
                    aria-describedby="quality-help"
                    onChange={(event) => {
                      setQuality(Number(event.target.value));
                      clearResult();
                    }}
                  />
                  <div className="mt-2 flex justify-between text-[0.68rem] font-semibold text-slate-400">
                    <span>Menor peso</span><span>Mayor detalle</span>
                  </div>
                  <p id="quality-help" className="mt-3 text-xs leading-5 text-slate-500">
                    {outputType === 'image/png'
                      ? 'Canvas exporta PNG sin un control de calidad con pérdida.'
                      : 'Entre 70% y 85% suele ofrecer un buen equilibrio.'}
                  </p>
                </div>

                {outputType === 'image/jpeg' && (
                  <div className="mt-5"><Notice tone="warning">JPG no admite transparencia. Las áreas transparentes se rellenarán en blanco.</Notice></div>
                )}

                {error && <div className="mt-5"><Notice tone="error">{error}</Notice></div>}

                {processing && (
                  <div className="mt-6" role="status" aria-live="polite">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                      <span>{progress}</span><span>Procesando localmente</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-blue-500 to-violet-500" />
                    </div>
                  </div>
                )}

                {result && currentSettingsMatch && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Original</p>
                        <p className="mt-1 text-lg font-extrabold text-slate-900">{formatBytes(file.size)}</p>
                      </div>
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Resultado</p>
                        <p className="mt-1 text-lg font-extrabold text-slate-900">{formatBytes(result.blob.size)}</p>
                      </div>
                    </div>
                    <div className={`mt-4 rounded-xl px-3 py-2 text-sm font-bold ${isRealReduction ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                      {isRealReduction
                        ? `${reduction.toFixed(1).replace('.', ',')}% menos peso`
                        : `${Math.abs(reduction).toFixed(1).replace('.', ',')}% más peso · no se considera comprimida`}
                    </div>
                    {!isRealReduction && (
                      <p className="mt-3 text-xs leading-5 text-slate-600">Prueba una calidad menor o el formato WebP. Puedes descargar esta conversión, pero no reduce el archivo.</p>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-7">
                  {result && outputUrl && currentSettingsMatch ? (
                    <a
                      className="btn btn-primary w-full"
                      href={outputUrl}
                      download={makeOutputName(file.name, outputType, isRealReduction ? 'comprimida' : 'convertida')}
                    >
                      <Icon className="size-5" name="download" />
                      Descargar {isRealReduction ? 'imagen comprimida' : `resultado ${formatLabel}`}
                    </a>
                  ) : (
                    <button className="btn btn-primary w-full" type="button" disabled={processing} onClick={processImage}>
                      <Icon className="size-5" name="compress" />
                      Comprimir ahora
                    </button>
                  )}
                  {processing && (
                    <button className="btn btn-ghost mt-2 w-full" type="button" onClick={() => abortRef.current?.abort()}>
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
            ['shield', 'Privado de verdad', 'El archivo no se envía a PixelTools ni se almacena en un servidor.'],
            ['sparkles', 'Resultado bajo control', 'Tú eliges formato y calidad; mostramos el peso real antes de descargar.'],
            ['image', 'Compatible y práctico', 'Funciona con JPG, PNG y WebP en navegadores modernos.'],
          ].map(([icon, title, text]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="size-5 text-blue-600" name={icon as 'shield'} />
              <h2 className="mt-4 font-extrabold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

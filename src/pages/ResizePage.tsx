import { BlueHint } from '../components/BlueHint';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { downloadBlob, formatBytes, isSupportedImageType, makeOutputName, type SupportedImageType, validateImageFile } from '../lib/files';
import { supportsCanvasFormat } from '../lib/imageProcessing';
import { keepAspect, resizeImage, SOCIAL_PRESETS, validateTargetSize, type FitMode, type ResizeOutput } from '../lib/resize';
import { useObjectUrl } from '../lib/useObjectUrl';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
type SizeMode = 'social' | 'exact' | 'percent';
type FormatChoice = 'original' | SupportedImageType;

const MODE_LABELS: [SizeMode, string][] = [
  ['social', 'Redes sociales'],
  ['exact', 'Medidas exactas'],
  ['percent', 'Porcentaje'],
];

const BORDER_COLORS: [string, string][] = [
  ['#ffffff', 'Blanco'],
  ['#000000', 'Negro'],
  ['transparent', 'Transparente'],
];

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<{ width: number; height: number } | null>(null);
  const [mode, setMode] = useState<SizeMode>('social');
  const [presetId, setPresetId] = useState(SOCIAL_PRESETS[0].id);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [lockAspect, setLockAspect] = useState(true);
  const [percent, setPercent] = useState(50);
  const [fit, setFit] = useState<FitMode>('cover');
  const [border, setBorder] = useState('#ffffff');
  const [format, setFormat] = useState<FormatChoice>('original');
  const [result, setResult] = useState<ResizeOutput & { mimeType: SupportedImageType } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [webpSupported, setWebpSupported] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(result?.blob);

  useEffect(() => {
    setWebpSupported(supportsCanvasFormat('image/webp'));
    return () => abortRef.current?.abort();
  }, []);

  const target = useMemo(() => {
    if (mode === 'social') {
      const preset = SOCIAL_PRESETS.find((item) => item.id === presetId) ?? SOCIAL_PRESETS[0];
      return { width: preset.width, height: preset.height };
    }
    if (mode === 'percent' && source) {
      return {
        width: Math.max(1, Math.round((source.width * percent) / 100)),
        height: Math.max(1, Math.round((source.height * percent) / 100)),
      };
    }
    return { width, height };
  }, [mode, presetId, percent, source, width, height]);

  const sizeError = validateTargetSize(target.width, target.height);
  const sameAspect = source ? Math.abs(target.width / target.height - source.width / source.height) < 0.01 : true;
  const showFit = !sameAspect && !(mode === 'exact' && lockAspect);
  const effectiveFit: FitMode = showFit ? fit : 'stretch';
  const upscaling = source ? target.width > source.width || target.height > source.height : false;
  const mimeType: SupportedImageType =
    format !== 'original' ? format : file && isSupportedImageType(file.type) && (file.type !== 'image/webp' || webpSupported) ? file.type : 'image/jpeg';
  const transparentBorder = effectiveFit === 'contain' && border === 'transparent';

  // Cualquier cambio de ajustes invalida el resultado anterior.
  useEffect(() => setResult(null), [target.width, target.height, effectiveFit, border, mimeType]);

  const handleFiles = ([next]: File[]) => {
    abortRef.current?.abort();
    const validationError = validateImageFile(next, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setResult(null);
    setSource(null);
    setFile(next);
  };

  const reset = () => {
    abortRef.current?.abort();
    setFile(null);
    setSource(null);
    setResult(null);
    setError('');
    setProcessing(false);
  };

  const updateWidth = (value: number) => {
    setWidth(value);
    if (lockAspect && source && Number.isFinite(value) && value > 0) setHeight(keepAspect(source.width, source.height, 'width', value).height);
  };

  const updateHeight = (value: number) => {
    setHeight(value);
    if (lockAspect && source && Number.isFinite(value) && value > 0) setWidth(keepAspect(source.width, source.height, 'height', value).width);
  };

  const process = async () => {
    if (!file || sizeError) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setProcessing(true);
    setError('');
    try {
      const output = await resizeImage(file, {
        width: target.width,
        height: target.height,
        fit: effectiveFit,
        mimeType: transparentBorder && mimeType === 'image/jpeg' ? 'image/png' : mimeType,
        background: effectiveFit === 'contain' && border !== 'transparent' ? border : undefined,
        signal: controller.signal,
      });
      if (!controller.signal.aborted) setResult({ ...output, mimeType: transparentBorder && mimeType === 'image/jpeg' ? 'image/png' : mimeType });
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === 'AbortError')) {
        setError(caught instanceof Error ? caught.message : 'No se pudo redimensionar la imagen.');
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setProcessing(false);
      }
    }
  };

  const groups = [...new Set(SOCIAL_PRESETS.map((preset) => preset.group))];

  return (
    <>
      <Seo
        title="Redimensionar imágenes online gratis | Vélix Blue"
        description="Cambia el tamaño de tus imágenes a medidas exactas o para Instagram, WhatsApp, Facebook y YouTube, directamente en tu navegador."
        path="/redimensionar-imagen"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="resize"
          eyebrow="Redimensionar imagen"
          blueTip="Elige tu imagen y selecciona una medida o un tamaño para redes."
          title="La medida justa para cada sitio."
          description="Ajusta tus fotos a medidas exactas, a un porcentaje o a los tamaños de Instagram, WhatsApp, Facebook, YouTube y más."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone description="JPG, PNG o WebP · Máximo 25 MB · Hasta 32 megapíxeles" onFiles={handleFiles} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-w-0 border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{file.name}</p>
                    <p className="mt-1 text-xs text-mist">
                      {formatBytes(file.size)}{source && ` · ${source.width} × ${source.height} px`}
                    </p>
                  </div>
                  <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                    <Icon className="size-4" name="reset" /> Otra imagen
                  </button>
                </div>
                <div className={`mt-5 grid min-h-80 place-items-center overflow-hidden rounded-2xl border border-line p-3 ${result?.mimeType === 'image/png' || result?.mimeType === 'image/webp' ? 'checkerboard' : 'bg-white/[0.03]'}`}>
                  <img
                    className="h-auto max-h-[30rem] w-auto max-w-full rounded-lg object-contain"
                    src={outputUrl || inputUrl}
                    width={result?.width}
                    height={result?.height}
                    alt={outputUrl ? 'Vista previa de la imagen redimensionada' : 'Vista previa original'}
                    onLoad={(event) => {
                      if (outputUrl || source) return;
                      const size = { width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight };
                      setSource(size);
                      setWidth(size.width);
                      setHeight(size.height);
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-mist" aria-live="polite">
                  {result ? `Resultado · ${result.width} × ${result.height} px · ${formatBytes(result.blob.size)}` : 'Vista previa original'}
                </p>
              </div>

              <div className="flex flex-col gap-6 p-5 sm:p-7">
                <fieldset disabled={processing}>
                  <legend className="field-label">Cómo quieres redimensionar</legend>
                  <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-white/[0.03] p-1" role="radiogroup" aria-label="Modo">
                    {MODE_LABELS.map(([value, label]) => (
                      <label
                        key={value}
                        className={`cursor-pointer rounded-lg px-2 py-2 text-center text-xs font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light sm:text-sm ${mode === value ? 'bg-electric text-white shadow' : 'text-mist hover:text-white'}`}
                      >
                        <input className="sr-only" type="radio" name="modo" value={value} checked={mode === value} onChange={() => setMode(value)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {mode === 'social' && (
                  <fieldset disabled={processing}>
                    <legend className="field-label">Formato de destino</legend>
                    <div className="grid max-h-80 gap-3 overflow-y-auto pr-1">
                      {groups.map((group) => (
                        <div key={group}>
                          <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-mist">{group}</p>
                          <div className="grid gap-1.5 sm:grid-cols-2">
                            {SOCIAL_PRESETS.filter((preset) => preset.group === group).map((preset) => (
                              <label
                                key={preset.id}
                                className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light ${presetId === preset.id ? 'border-electric-light bg-electric/15 text-white' : 'border-line text-slate-200 hover:border-line-strong'}`}
                              >
                                <input className="sr-only" type="radio" name="preset" value={preset.id} checked={presetId === preset.id} onChange={() => setPresetId(preset.id)} />
                                <span>{preset.label}</span>
                                <span className="shrink-0 text-xs text-mist">{preset.width}×{preset.height}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                )}

                {mode === 'exact' && (
                  <fieldset disabled={processing}>
                    <legend className="field-label">Medidas en píxeles</legend>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-mist" htmlFor="ancho">Ancho</label>
                        <input id="ancho" className="text-field mt-1" type="number" inputMode="numeric" min={1} max={8000} value={Number.isFinite(width) ? width : ''} onChange={(event) => updateWidth(event.target.valueAsNumber)} />
                      </div>
                      <div>
                        <label className="text-xs text-mist" htmlFor="alto">Alto</label>
                        <input id="alto" className="text-field mt-1" type="number" inputMode="numeric" min={1} max={8000} value={Number.isFinite(height) ? height : ''} onChange={(event) => updateHeight(event.target.valueAsNumber)} />
                      </div>
                    </div>
                    <label className="mt-3 flex items-center gap-2.5 text-sm text-slate-200">
                      <input
                        className="size-4 accent-electric"
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(event) => {
                          setLockAspect(event.target.checked);
                          if (event.target.checked && source) setHeight(keepAspect(source.width, source.height, 'width', width).height);
                        }}
                      />
                      Mantener la proporción original
                    </label>
                  </fieldset>
                )}

                {mode === 'percent' && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="field-label mb-0" htmlFor="porcentaje">Escala</label>
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">{percent}%</span>
                    </div>
                    <input id="porcentaje" className="range-field" type="range" min={5} max={200} step={5} value={percent} disabled={processing} onChange={(event) => setPercent(Number(event.target.value))} />
                    <div className="mt-2 flex justify-between text-[0.68rem] font-semibold text-mist"><span>5%</span><span>100%</span><span>200%</span></div>
                  </div>
                )}

                <p className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                  Tamaño final: <strong className="text-white">{target.width} × {target.height} px</strong>
                </p>

                {showFit && (
                  <fieldset disabled={processing}>
                    <legend className="field-label">La proporción es distinta. ¿Qué hacemos?</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {([
                        ['cover', 'Rellenar', 'Recorta los bordes que sobran'],
                        ['contain', 'Ajustar', 'Imagen completa con bordes'],
                      ] as const).map(([value, label, help]) => (
                        <label key={value} className={`cursor-pointer rounded-xl border px-3 py-2.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light ${fit === value ? 'border-electric-light bg-electric/15' : 'border-line hover:border-line-strong'}`}>
                          <input className="sr-only" type="radio" name="encaje" value={value} checked={fit === value} onChange={() => setFit(value)} />
                          <span className="block text-sm font-bold text-white">{label}</span>
                          <span className="text-xs text-mist">{help}</span>
                        </label>
                      ))}
                    </div>
                    {fit === 'contain' && (
                      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Color de los bordes">
                        {BORDER_COLORS.map(([value, label]) => (
                          <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light ${border === value ? 'border-electric-light text-white' : 'border-line text-mist'}`}>
                            <input className="sr-only" type="radio" name="borde" value={value} checked={border === value} onChange={() => setBorder(value)} />
                            <span className={`size-4 rounded border border-line-strong ${value === 'transparent' ? 'checkerboard' : ''}`} style={value === 'transparent' ? undefined : { background: value }} />
                            {label}
                          </label>
                        ))}
                      </div>
                    )}
                  </fieldset>
                )}

                <div>
                  <label className="field-label" htmlFor="formato">Formato de descarga</label>
                  <select id="formato" className="select-field" value={format} disabled={processing} onChange={(event) => setFormat(event.target.value as FormatChoice)}>
                    <option value="original">El mismo que el original</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    {webpSupported && <option value="image/webp">WebP</option>}
                  </select>
                </div>

                {upscaling && !sizeError && <Notice tone="warning">El tamaño final es mayor que el original. Ampliar una imagen no añade detalle y puede verse borrosa.</Notice>}
                {transparentBorder && mimeType === 'image/jpeg' && <Notice tone="info">JPG no admite transparencia: se descargará en PNG para conservar los bordes transparentes.</Notice>}
                {mimeType === 'image/jpeg' && !transparentBorder && file.type === 'image/png' && <Notice tone="warning">JPG no admite transparencia. Las áreas transparentes se rellenarán en blanco.</Notice>}
                {sizeError && <Notice tone="error">{sizeError}</Notice>}
                {error && <Notice tone="error">{error}</Notice>}

                {result && <BlueHint status message="¡La imagen está lista! Revisa sus medidas antes de descargarla." />}
                <div className="mt-auto flex flex-col gap-2">
                  {result ? (
                    <button
                      className="btn btn-primary w-full"
                      type="button"
                      onClick={() => downloadBlob(result.blob, makeOutputName(file.name, result.mimeType, `${result.width}x${result.height}`))}
                    >
                      <Icon className="size-5" name="download" /> Descargar imagen
                    </button>
                  ) : (
                    <button className="btn btn-primary w-full" type="button" disabled={processing || Boolean(sizeError) || !source} onClick={process}>
                      <Icon className="size-5" name="resize" /> {processing ? 'Redimensionando…' : 'Redimensionar'}
                    </button>
                  )}
                  {processing && (
                    <button className="btn btn-ghost w-full" type="button" onClick={() => abortRef.current?.abort()}>Cancelar</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <AdPlaceholder />
    </>
  );
}

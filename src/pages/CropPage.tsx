import { BlueHint } from '../components/BlueHint';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import {
  ASPECT_PRESETS,
  centeredRect,
  cropImage,
  moveRect,
  resizeRect,
  rotatedSize,
  roundRect,
  type CropOutput,
  type Handle,
  type Rect,
  type Transform,
} from '../lib/crop';
import { downloadBlob, formatBytes, isSupportedImageType, makeOutputName, type SupportedImageType, validateImageFile } from '../lib/files';
import { decodeImage, supportsCanvasFormat, validateDimensions } from '../lib/imageProcessing';
import { useObjectUrl } from '../lib/useObjectUrl';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** Lado máximo de la vista previa: la edición es fluida también en móviles de gama media. */
const PREVIEW_SIDE = 1400;
const HANDLES: Handle[] = ['nw', 'ne', 'sw', 'se'];
const HANDLE_POSITION: Record<Handle, string> = {
  nw: '-left-2 -top-2 cursor-nwse-resize',
  ne: '-right-2 -top-2 cursor-nesw-resize',
  sw: '-left-2 -bottom-2 cursor-nesw-resize',
  se: '-right-2 -bottom-2 cursor-nwse-resize',
};

interface Drag {
  pointerId: number;
  handle: Handle | 'move';
  startX: number;
  startY: number;
  startRect: Rect;
  scale: number;
}

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const [transform, setTransform] = useState<Transform>({ quarterTurns: 0, flipHorizontal: false });
  const [aspectId, setAspectId] = useState('libre');
  const [rect, setRect] = useState<Rect | null>(null);
  const [result, setResult] = useState<CropOutput & { mimeType: SupportedImageType } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [webpSupported, setWebpSupported] = useState(true);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const outputUrl = useObjectUrl(result?.blob);

  const ratio = ASPECT_PRESETS.find((preset) => preset.id === aspectId)?.ratio ?? null;
  const turned = natural ? rotatedSize(natural.width, natural.height, transform.quarterTurns) : null;

  useEffect(() => {
    setWebpSupported(supportsCanvasFormat('image/webp'));
    return () => releasePreview(previewRef);
  }, []);

  // Decodifica una sola vez y guarda una copia reducida para la vista previa.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        const decoded = await decodeImage(file);
        try {
          validateDimensions(decoded.width, decoded.height);
          const scale = Math.min(1, PREVIEW_SIDE / Math.max(decoded.width, decoded.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(decoded.width * scale));
          canvas.height = Math.max(1, Math.round(decoded.height * scale));
          canvas.getContext('2d')?.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);
          if (cancelled) {
            canvas.width = 0;
            return;
          }
          releasePreview(previewRef);
          previewRef.current = canvas;
          setNatural({ width: decoded.width, height: decoded.height });
          setRect(centeredRect(decoded.width, decoded.height, null));
        } finally {
          decoded.release();
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : 'No se pudo leer la imagen.');
          setFile(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Dibuja la vista previa con el giro y el volteo actuales.
  useEffect(() => {
    const preview = previewRef.current;
    const view = viewRef.current;
    if (!preview || !view || !natural) return;
    const size = rotatedSize(preview.width, preview.height, transform.quarterTurns);
    view.width = size.width;
    view.height = size.height;
    const context = view.getContext('2d');
    if (!context) return;
    context.save();
    context.translate(size.width / 2, size.height / 2);
    context.rotate((transform.quarterTurns * Math.PI) / 2);
    if (transform.flipHorizontal) context.scale(transform.quarterTurns % 2 === 0 ? -1 : 1, transform.quarterTurns % 2 === 0 ? 1 : -1);
    context.drawImage(preview, -preview.width / 2, -preview.height / 2);
    context.restore();
  }, [natural, transform, result]);

  useEffect(() => setResult(null), [rect, transform]);

  const applyAspect = useCallback(
    (id: string, nextTransform = transform) => {
      if (!natural) return;
      const size = rotatedSize(natural.width, natural.height, nextTransform.quarterTurns);
      setAspectId(id);
      setRect(centeredRect(size.width, size.height, ASPECT_PRESETS.find((preset) => preset.id === id)?.ratio ?? null));
    },
    [natural, transform],
  );

  const changeTransform = (next: Transform) => {
    setTransform(next);
    applyAspect(aspectId, next);
  };

  const handleFiles = ([next]: File[]) => {
    const validationError = validateImageFile(next, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setResult(null);
    setNatural(null);
    setRect(null);
    setAspectId('libre');
    setTransform({ quarterTurns: 0, flipHorizontal: false });
    setFile(next);
  };

  const reset = () => {
    releasePreview(previewRef);
    setFile(null);
    setNatural(null);
    setRect(null);
    setResult(null);
    setError('');
  };

  const startDrag = (event: PointerEvent<HTMLElement>, handle: Drag['handle']) => {
    if (!rect || !turned || !viewRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startRect: rect,
      scale: turned.width / viewRef.current.getBoundingClientRect().width,
    };
  };

  const onDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !turned) return;
    const dx = (event.clientX - drag.startX) * drag.scale;
    const dy = (event.clientY - drag.startY) * drag.scale;
    setRect(
      drag.handle === 'move'
        ? moveRect(drag.startRect, dx, dy, turned.width, turned.height)
        : resizeRect(drag.startRect, drag.handle, dx, dy, ratio, turned.width, turned.height),
    );
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!rect || !turned) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = Math.max(1, Math.round(Math.max(turned.width, turned.height) * (event.altKey ? 0.002 : 0.01)));
    const [x, y] = direction;
    setRect(
      event.shiftKey
        ? resizeRect(rect, 'se', x * step, y * step, ratio, turned.width, turned.height)
        : moveRect(rect, x * step, y * step, turned.width, turned.height),
    );
  };

  const mimeType: SupportedImageType = file && isSupportedImageType(file.type) && (file.type !== 'image/webp' || webpSupported) ? file.type : 'image/jpeg';

  const process = async () => {
    if (!file || !rect) return;
    setProcessing(true);
    setError('');
    try {
      const output = await cropImage(file, rect, transform, mimeType);
      setResult({ ...output, mimeType });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo recortar la imagen.');
    } finally {
      setProcessing(false);
    }
  };

  const area = rect && turned ? roundRect(rect, turned.width, turned.height) : null;
  const percent = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <>
      <Seo
        title="Recortar imágenes online gratis | Vélix Blue"
        description="Recorta tus fotos con proporciones 1:1, 4:5, 16:9 o libres, y gíralas o voltéalas, directamente en tu navegador."
        path="/recortar-imagen"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="crop"
          eyebrow="Recortar imagen"
          blueTip="Elige una imagen y ajusta el área que quieres conservar."
          title="Encuadra justo lo que importa."
          description="Recorta con proporciones listas para redes o a mano alzada, y gira o voltea la foto en un toque. Sin perder resolución."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone description="JPG, PNG o WebP · Máximo 25 MB · Hasta 32 megapíxeles" onFiles={handleFiles} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="min-w-0 border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{file.name}</p>
                    <p className="mt-1 text-xs text-mist">{formatBytes(file.size)}{natural && ` · ${natural.width} × ${natural.height} px`}</p>
                  </div>
                  <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                    <Icon className="size-4" name="reset" /> Otra imagen
                  </button>
                </div>

                <div className="mt-5 grid min-h-80 place-items-center rounded-2xl border border-line bg-white/[0.03] p-4">
                  {result && outputUrl ? (
                    <img className="h-auto max-h-[30rem] w-auto max-w-full rounded-lg" src={outputUrl} width={result.width} height={result.height} alt="Resultado del recorte" />
                  ) : (
                    <div className="relative inline-block max-w-full touch-none select-none">
                      <canvas ref={viewRef} className="block h-auto max-h-[30rem] w-auto max-w-full rounded-md" aria-hidden="true" />
                      {rect && turned && (
                        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-md" aria-hidden="true">
                          <span
                            className="absolute shadow-[0_0_0_9999px_rgba(5,10,26,0.62)]"
                            style={{ left: percent(rect.x, turned.width), top: percent(rect.y, turned.height), width: percent(rect.width, turned.width), height: percent(rect.height, turned.height) }}
                          />
                        </span>
                      )}
                      {rect && turned && (
                        <div
                          className="absolute cursor-move border-2 border-white outline-offset-4 focus-visible:outline-3 focus-visible:outline-electric-light"
                          style={{ left: percent(rect.x, turned.width), top: percent(rect.y, turned.height), width: percent(rect.width, turned.width), height: percent(rect.height, turned.height) }}
                          role="group"
                          tabIndex={0}
                          aria-label={`Área de recorte: ${area?.width} × ${area?.height} píxeles`}
                          aria-describedby="ayuda-recorte"
                          onKeyDown={onKeyDown}
                          onPointerDown={(event) => startDrag(event, 'move')}
                          onPointerMove={onDrag}
                          onPointerUp={endDrag}
                          onPointerCancel={endDrag}
                        >
                          <span className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3" aria-hidden="true">
                            {[...Array(9)].map((_, index) => <span key={index} className="border border-white/25" />)}
                          </span>
                          {HANDLES.map((handle) => (
                            <span
                              key={handle}
                              className={`absolute size-5 rounded-full border-2 border-electric bg-white shadow ${HANDLE_POSITION[handle]}`}
                              aria-hidden="true"
                              onPointerDown={(event) => startDrag(event, handle)}
                              onPointerMove={onDrag}
                              onPointerUp={endDrag}
                              onPointerCancel={endDrag}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p id="ayuda-recorte" className="mt-3 text-xs leading-5 text-mist">
                  Arrastra el recuadro o sus esquinas. Con teclado: flechas para moverlo y Mayús + flechas para cambiar su tamaño.
                </p>
              </div>

              <div className="flex flex-col gap-6 p-5 sm:p-7">
                <fieldset disabled={processing || !natural}>
                  <legend className="field-label">Proporción</legend>
                  <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Proporción">
                    {ASPECT_PRESETS.map((preset) => (
                      <label
                        key={preset.id}
                        className={`cursor-pointer rounded-lg border px-1 py-2 text-center text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-light ${aspectId === preset.id ? 'border-electric-light bg-electric/15 text-white' : 'border-line text-mist hover:text-white'}`}
                      >
                        <input className="sr-only" type="radio" name="proporcion" value={preset.id} checked={aspectId === preset.id} onChange={() => applyAspect(preset.id)} />
                        {preset.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <p className="field-label">Girar y voltear</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="btn btn-secondary px-2" type="button" disabled={processing || !natural} onClick={() => changeTransform({ ...transform, quarterTurns: (transform.quarterTurns + 3) % 4 })}>
                      <Icon className="size-4" name="rotate-left" /><span className="sr-only sm:not-sr-only">Izquierda</span>
                    </button>
                    <button className="btn btn-secondary px-2" type="button" disabled={processing || !natural} onClick={() => changeTransform({ ...transform, quarterTurns: (transform.quarterTurns + 1) % 4 })}>
                      <Icon className="size-4" name="rotate-right" /><span className="sr-only sm:not-sr-only">Derecha</span>
                    </button>
                    <button className="btn btn-secondary px-2" type="button" aria-pressed={transform.flipHorizontal} disabled={processing || !natural} onClick={() => changeTransform({ ...transform, flipHorizontal: !transform.flipHorizontal })}>
                      <Icon className="size-4" name="flip" /><span className="sr-only sm:not-sr-only">Voltear</span>
                    </button>
                  </div>
                </div>

                {area && (
                  <p className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-slate-200" aria-live="polite">
                    Recorte: <strong className="text-white">{area.width} × {area.height} px</strong>
                    {result && <> · {formatBytes(result.blob.size)}</>}
                  </p>
                )}
                {mimeType === 'image/jpeg' && file.type === 'image/png' && <Notice tone="warning">JPG no admite transparencia. Las áreas transparentes se rellenarán en blanco.</Notice>}
                {error && <Notice tone="error">{error}</Notice>}

                {result && <BlueHint status message="¡Tu recorte está listo! Puedes descargarlo o seguir editando." />}
                <div className="mt-auto flex flex-col gap-2">
                  {result ? (
                    <>
                      <button className="btn btn-primary w-full" type="button" onClick={() => downloadBlob(result.blob, makeOutputName(file.name, result.mimeType, 'recortada'))}>
                        <Icon className="size-5" name="download" /> Descargar recorte
                      </button>
                      <button className="btn btn-secondary w-full" type="button" onClick={() => setResult(null)}>Seguir editando</button>
                    </>
                  ) : (
                    <button className="btn btn-primary w-full" type="button" disabled={processing || !rect} onClick={process}>
                      <Icon className="size-5" name="crop" /> {processing ? 'Recortando…' : 'Recortar'}
                    </button>
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

function releasePreview(ref: { current: HTMLCanvasElement | null }) {
  if (ref.current) {
    ref.current.width = 0;
    ref.current.height = 0;
    ref.current = null;
  }
}

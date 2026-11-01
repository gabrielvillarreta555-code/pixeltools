import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { centeredRect, moveRect, resizeRect, rotatedSize, roundRect, type Handle, type Rect } from '../lib/crop';
import { decodeImage } from '../lib/imageProcessing';
import { Icon } from './Icon';

interface Props {
  image: Blob;
  width: number;
  height: number;
  turns: number;
  rect: Rect;
  disabled: boolean;
  onChange: (rect: Rect, turns: number) => void;
  onError: (message: string) => void;
}
interface Drag { pointerId: number; handle: Handle | 'move'; x: number; y: number; start: Rect; scale: number }
const handles: Handle[] = ['nw', 'ne', 'sw', 'se'];
const positions: Record<Handle, string> = { nw: '-left-[22px] -top-[22px] cursor-nwse-resize', ne: '-right-[22px] -top-[22px] cursor-nesw-resize', sw: '-left-[22px] -bottom-[22px] cursor-nesw-resize', se: '-right-[22px] -bottom-[22px] cursor-nwse-resize' };

/** Recorte expresado en coordenadas de la imagen reducida y girada, como en la herramienta de recorte. */
export function OcrCropEditor({ image, width, height, turns, rect, disabled, onChange, onError }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<Drag | null>(null);
  const size = rotatedSize(width, height, turns);
  const area = roundRect(rect, size.width, size.height);
  const pct = (n: number, total: number) => `${100 * n / total}%`;

  useEffect(() => {
    let cancelled = false;
    const preview = canvasRef.current;
    void (async () => {
      try {
        const decoded = await decodeImage(image);
        try {
          if (cancelled || !canvasRef.current) return;
          const canvas = canvasRef.current;
          const turned = rotatedSize(decoded.width, decoded.height, turns);
          canvas.width = turned.width; canvas.height = turned.height;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('No se pudo mostrar la vista previa.');
          context.translate(turned.width / 2, turned.height / 2);
          context.rotate(turns * Math.PI / 2);
          context.drawImage(decoded.source, -decoded.width / 2, -decoded.height / 2);
        } finally { decoded.release(); }
      } catch (error) { if (!cancelled) onError(error instanceof Error ? error.message : 'No se pudo mostrar la imagen.'); }
    })();
    return () => { cancelled = true; if (preview) { preview.width = 0; preview.height = 0; } };
    // onError se mantiene en una ref implícita: solo debe redibujarse al cambiar imagen o giro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, turns]);

  const rotate = (delta: number) => {
    const nextTurns = (turns + delta + 4) % 4;
    const turned = rotatedSize(width, height, nextTurns);
    onChange(centeredRect(turned.width, turned.height, null), nextTurns);
  };
  const start = (event: PointerEvent<HTMLElement>, handle: Drag['handle']) => {
    if (disabled || !canvasRef.current) return;
    const displayWidth = canvasRef.current.getBoundingClientRect().width;
    if (!displayWidth) return;
    event.preventDefault(); event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, handle, x: event.clientX, y: event.clientY, start: rect, scale: size.width / displayWidth };
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const d = drag.current; if (disabled || !d || d.pointerId !== event.pointerId) return;
    const dx = (event.clientX - d.x) * d.scale, dy = (event.clientY - d.y) * d.scale;
    onChange(d.handle === 'move' ? moveRect(d.start, dx, dy, size.width, size.height) : resizeRect(d.start, d.handle, dx, dy, null, size.width, size.height), turns);
  };
  const end = (event: PointerEvent<HTMLElement>) => { if (drag.current?.pointerId === event.pointerId) drag.current = null; };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key]; if (!direction) return;
    event.preventDefault(); const step = Math.max(1, Math.round(Math.max(size.width, size.height) * (event.altKey ? 0.002 : 0.01)));
    const dx = direction[0] * step, dy = direction[1] * step;
    onChange(event.shiftKey ? resizeRect(rect, 'se', dx, dy, null, size.width, size.height) : moveRect(rect, dx, dy, size.width, size.height), turns);
  };

  return <div className="mt-5">
    <p className="field-label">Preparar imagen para leer</p>
    <div className="flex flex-wrap gap-2">
      <button className="btn btn-secondary" type="button" disabled={disabled} onClick={() => rotate(-1)}><Icon className="size-4" name="rotate-left" /> Girar izquierda</button>
      <button className="btn btn-secondary" type="button" disabled={disabled} onClick={() => rotate(1)}><Icon className="size-4" name="rotate-right" /> Girar derecha</button>
      <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => onChange(centeredRect(size.width, size.height, null), turns)}>Imagen completa</button>
    </div>
    <div className="mt-4 grid min-h-48 place-items-center rounded-2xl border border-line bg-white/[0.03] p-4">
      <div className="relative inline-block max-w-full touch-none select-none">
        <canvas ref={canvasRef} className="block h-auto max-h-96 w-auto max-w-full rounded-md" aria-label="Vista previa de la imagen seleccionada" role="img" />
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-md" aria-hidden="true"><span className="absolute shadow-[0_0_0_9999px_rgba(5,10,26,0.62)]" style={{ left: pct(rect.x, size.width), top: pct(rect.y, size.height), width: pct(rect.width, size.width), height: pct(rect.height, size.height) }} /></span>
        <div className="absolute cursor-move border-2 border-white outline-offset-4 focus-visible:outline-3 focus-visible:outline-electric-light" style={{ left: pct(rect.x, size.width), top: pct(rect.y, size.height), width: pct(rect.width, size.width), height: pct(rect.height, size.height) }} role="group" tabIndex={disabled ? -1 : 0} aria-disabled={disabled} aria-label={`Área para leer: ${area.width} × ${area.height} píxeles`} aria-describedby="ocr-crop-help" onKeyDown={key} onPointerDown={e => start(e, 'move')} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
          {handles.map(handle => <span key={handle} className={`absolute grid size-11 place-items-center ${positions[handle]}`} aria-hidden="true" onPointerDown={e => start(e, handle)} onPointerMove={move} onPointerUp={end} onPointerCancel={end}><span className="pointer-events-none size-6 rounded-full border-2 border-electric bg-white shadow" /></span>)}
        </div>
      </div>
    </div>
    <p id="ocr-crop-help" className="mt-3 text-xs leading-5 text-mist">Arrastra el recuadro o sus esquinas para elegir el texto. Con teclado usa flechas para moverlo y Mayús + flechas para cambiar su tamaño. Al girar, se selecciona de nuevo la imagen completa.</p>
    <p className="mt-2 text-xs text-mist" aria-live="polite">Área para leer: {area.width} × {area.height} px</p>
  </div>;
}

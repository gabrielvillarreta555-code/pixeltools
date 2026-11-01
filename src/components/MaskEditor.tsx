import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { findAlphaBounds, type Box } from '../lib/geometry';
import { canvasToBlob, decodeImage, type DecodedImage } from '../lib/imageProcessing';
import { maskPoint, paintMask, type BrushPoint, type MaskMode } from '../lib/maskBrush';
import { Notice } from './Notice';

interface Props { original: Blob; cutout: Blob; onSave: (blob: Blob, subject: Box | null) => void; onCancel: () => void }
export function MaskEditor({ original, cutout, onSave, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<DecodedImage | null>(null);
  const lastRef = useRef<BrushPoint | null>(null);
  // Solo una instantánea, acotada al lienzo preparado (máximo 4 MP ≈ 16 MB RGBA).
  const undoRef = useRef<ImageData | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<MaskMode>('erase');
  const [brush, setBrush] = useState(24);
  const [cursor, setCursor] = useState<BrushPoint | null>(null);
  const [message, setMessage] = useState('');
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    let source: DecodedImage | null = null;
    let target: DecodedImage | null = null;
    const start = async () => {
      try {
        source = await decodeImage(original, abort.signal); target = await decodeImage(cutout, abort.signal);
        if (abort.signal.aborted) return;
        const canvas = canvasRef.current; if (!canvas) return;
        canvas.width = target.width; canvas.height = target.height;
        const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('No hay memoria suficiente para abrir el editor.');
        ctx.drawImage(target.source, 0, 0); target.release(); target = null;
        sourceRef.current = source;
        setCursor({ x: canvas.width / 2, y: canvas.height / 2 }); setReady(true);
      } catch (caught) { if (!abort.signal.aborted) setError(caught instanceof Error ? caught.message : 'No se pudo abrir el editor.'); }
    };
    void start();
    return () => { abort.abort(); sourceRef.current = null; undoRef.current = null; source?.release(); target?.release(); const canvas = canvasRef.current; if (canvas) { canvas.width = 0; canvas.height = 0; } };
  }, [original, cutout]);

  const snapshot = () => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    undoRef.current = null; setCanUndo(false); setError('');
    try { undoRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height); setCanUndo(true); }
    catch { setError('No se pudo reservar memoria para deshacer. Puedes cancelar el editor para descartar todos los cambios.'); }
  };
  const undo = () => { const ctx = canvasRef.current?.getContext('2d'); if (!ctx || !undoRef.current) return; ctx.putImageData(undoRef.current, 0, 0); undoRef.current = null; setCanUndo(false); setMessage('Última pincelada deshecha.'); };
  const paint = (from: BrushPoint, to: BrushPoint) => {
    const canvas = canvasRef.current, source = sourceRef.current;
    if (!canvas || !source || !ready || saving) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    try { paintMask(ctx, source.source, mode, from, to, brush * canvas.width / Math.max(1, rect.width) / 2, canvas.width, canvas.height); }
    catch { setError('No se pudo aplicar el pincel. Prueba una imagen más pequeña.'); }
  };
  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget; return maskPoint(event.clientX, event.clientY, canvas.getBoundingClientRect(), canvas.width, canvas.height);
  };
  const pointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!ready || saving || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    const p = point(event); snapshot(); lastRef.current = p; setCursor(p); paint(p, p);
  };
  const pointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!lastRef.current) return;
    const p = point(event); paint(lastRef.current, p); lastRef.current = p; setCursor(p);
  };
  const pointerEnd = () => { lastRef.current = null; };
  const keyboard = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas || !cursor || !ready) return;
    const move = (event.shiftKey ? 10 : 1) * canvas.width / Math.max(1, canvas.getBoundingClientRect().width);
    const delta: Record<string, [number, number]> = { ArrowLeft: [-move, 0], ArrowRight: [move, 0], ArrowUp: [0, -move], ArrowDown: [0, move] };
    if (delta[event.key]) { event.preventDefault(); const [dx, dy] = delta[event.key]; const next = { x: Math.max(0, Math.min(canvas.width - 1, cursor.x + dx)), y: Math.max(0, Math.min(canvas.height - 1, cursor.y + dy)) }; setCursor(next); setMessage(`Cursor: ${Math.round(next.x / canvas.width * 100)} % horizontal, ${Math.round(next.y / canvas.height * 100)} % vertical.`); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); snapshot(); paint(cursor, cursor); setMessage(mode === 'erase' ? 'Zona borrada.' : 'Zona restaurada.'); }
  };
  const save = async () => {
    const canvas = canvasRef.current; if (!canvas || saving) return; setSaving(true); setError('');
    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true }); if (!ctx) throw new Error('No se pudo leer la máscara.');
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const subject = findAlphaBounds(image.data, canvas.width, canvas.height);
      const blob = await canvasToBlob(canvas, 'image/png'); onSave(blob, subject);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo guardar la corrección.'); }
    finally { setSaving(false); }
  };
  return <section className="mx-auto mt-6 max-w-xl rounded-2xl border border-line bg-panel-2 p-4 sm:p-5" aria-labelledby="mask-title">
    <h2 id="mask-title" className="text-lg font-extrabold text-white">Corregir bordes</h2>
    <p id="mask-help" className="mt-2 text-sm leading-6 text-mist">Dibuja sobre la imagen: borra restos o restaura zonas de la foto original. Con teclado, mueve el cursor con las flechas y pulsa espacio o Intro para aplicar. Mantén Mayús para avanzar más rápido.</p>
    <fieldset className="mt-4 flex flex-wrap gap-2" disabled={saving}><legend className="field-label">Acción del pincel</legend>
      <label className="btn btn-secondary"><input type="radio" name="mask-mode" checked={mode === 'erase'} onChange={() => setMode('erase')} /> Borrar</label>
      <label className="btn btn-secondary"><input type="radio" name="mask-mode" checked={mode === 'restore'} onChange={() => setMode('restore')} /> Restaurar</label>
    </fieldset>
    <label className="field-label mt-4" htmlFor="mask-size">Tamaño del pincel: {brush}</label><input id="mask-size" className="range-field" type="range" min="8" max="80" value={brush} onChange={e => setBrush(Number(e.target.value))} disabled={saving} />
    {!ready && !error && <p role="status" className="mt-3 text-sm text-mist">Preparando el pincel…</p>}
    <div className="checkerboard relative mx-auto mt-4 w-fit max-w-full overflow-hidden rounded-xl border border-line">
      <canvas ref={canvasRef} className="block h-auto max-h-[30rem] max-w-full touch-none" style={{ maxWidth: '100%' }} role="application" tabIndex={0} aria-label="Lienzo para corregir la máscara" aria-describedby="mask-help" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onKeyDown={keyboard} />
      {ready && cursor && <span className="pointer-events-none absolute rounded-full border-2 border-white shadow-[0_0_0_1px_black]" aria-hidden="true" style={{ left: `${cursor.x / (canvasRef.current?.width || 1) * 100}%`, top: `${cursor.y / (canvasRef.current?.height || 1) * 100}%`, width: brush, height: brush, transform: 'translate(-50%,-50%)' }} />}
    </div>
    {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
    {message && <p className="sr-only" role="status">{message}</p>}
    <div className="mt-4 flex flex-wrap gap-2"><button className="btn btn-secondary" type="button" disabled={!canUndo || saving} onClick={undo}>Deshacer última pincelada</button><button className="btn btn-primary flex-1" type="button" disabled={!ready || saving} onClick={save}>{saving ? 'Aplicando…' : 'Aplicar corrección'}</button><button className="btn btn-secondary" type="button" disabled={saving} onClick={onCancel}>Cancelar</button></div>
    <p className="mt-3 text-xs text-mist">Cancelar descarta los cambios hechos en este editor. La corrección se realiza solo en tu dispositivo.</p>
  </section>;
}

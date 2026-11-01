import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { downloadBlob, formatBytes } from '../lib/files';
import { imagesToPdf, validatePdfImages, type PaperSize } from '../lib/imagePdf';

type Entry = { id: string; file: File };

export default function ImagePdfPage() {
  const [items, setItems] = useState<Entry[]>([]);
  const [paper, setPaper] = useState<PaperSize>('a4');
  const [busy, setBusy] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const task = useRef<AbortController | null>(null);
  useEffect(() => () => { task.current?.abort(); task.current = null; }, []);

  const add = (files: File[]) => {
    if (busy || !files.length) return;
    const next = [...items.map(item => item.file), ...files];
    const invalid = validatePdfImages(next);
    if (invalid) { setError(invalid); setMessage('No se añadieron imágenes nuevas.'); return; }
    setError(''); setMessage(`${files.length} ${files.length === 1 ? 'imagen añadida' : 'imágenes añadidas'}.`);
    setItems([...items, ...files.map(file => ({ id: crypto.randomUUID(), file }))]);
  };
  const move = (index: number, step: number) => {
    const destination = index + step;
    if (busy || destination < 0 || destination >= items.length) return;
    const copy = [...items]; [copy[index], copy[destination]] = [copy[destination]!, copy[index]!];
    setItems(copy); setMessage(`Imagen movida a la posición ${destination + 1}.`);
  };
  const remove = (id: string) => { if (busy) return; setItems(items.filter(item => item.id !== id)); setError(''); setMessage('Imagen eliminada de la lista.'); };
  const generate = async () => {
    if (busy) return;
    const controller = new AbortController(); task.current = controller;
    setBusy(true); setCanceling(false); setError(''); setMessage(''); setProgress({ done: 0, total: items.length });
    try {
      const output = await imagesToPdf(items.map(item => item.file), paper, controller.signal, (done, total) => { if (!controller.signal.aborted) setProgress({ done, total }); });
      if (!controller.signal.aborted) { downloadBlob(output, 'velix-blue-imagenes.pdf'); setMessage('PDF listo. Si la descarga no aparece, revisa las descargas de tu navegador.'); }
    } catch (caught) {
      if (controller.signal.aborted) setMessage('Operación cancelada.');
      else setError(caught instanceof Error ? caught.message : 'No se pudo crear el PDF.');
    } finally { if (task.current === controller) { task.current = null; setBusy(false); setCanceling(false); } }
  };

  return <>
    <Seo title="Convertir imágenes a PDF gratis y en privado | Vélix Blue" description="Une fotos JPG, PNG y WebP en un solo PDF desde tu navegador, sin subirlas a un servidor." path="/imagenes-a-pdf" />
    <section className="page-container pb-12 pt-14 sm:pt-20">
      <ToolIntro icon="file-pdf" eyebrow="Imágenes a PDF" title="Tus fotos, en un solo PDF." description="Ordena tus imágenes y crea un documento directamente en tu dispositivo." blueTip="Puedes cambiar el orden antes de crear tu documento." />
      <div className="tool-shell mx-auto mt-10 max-w-4xl p-4 sm:p-7">
        {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
        {items.length === 0 ? <UploadZone description="JPG, PNG o WebP · Hasta 10 imágenes · Máximo 50 MB cada una y 80 MB en total" multiple onFiles={add} /> : <>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-white">Tus imágenes ({items.length}/10)</h2><p className="mt-1 text-sm text-mist">Una imagen por página; usa las flechas para ordenarlas.</p></div><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => input.current?.click()}>+ Añadir imágenes</button><input ref={input} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event: ChangeEvent<HTMLInputElement>) => { add(Array.from(event.target.files ?? [])); event.target.value = ''; }} /></div>
          <ol className="mt-5 space-y-3" aria-label="Orden de las páginas">{items.map((item, index) => <li key={item.id} className="rounded-2xl border border-line bg-white/[0.03] p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-all text-sm font-bold text-white">{index + 1}. {item.file.name}</p><p className="mt-1 text-xs text-mist">{formatBytes(item.file.size)}</p></div></div><div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-ghost" type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label={`Subir ${item.file.name}`}>↑ Subir</button><button className="btn btn-ghost" type="button" disabled={busy || index === items.length - 1} onClick={() => move(index, 1)} aria-label={`Bajar ${item.file.name}`}>↓ Bajar</button><button className="btn btn-ghost" type="button" disabled={busy} onClick={() => remove(item.id)} aria-label={`Eliminar ${item.file.name}`}>Eliminar</button></div></li>)}</ol>
          <div className="mt-5"><label className="field-label" htmlFor="pdf-paper">Tamaño de página</label><select id="pdf-paper" className="select-field" disabled={busy} value={paper} onChange={event => setPaper(event.target.value as PaperSize)}><option value="a4">A4</option><option value="carta">Carta</option></select><p className="mt-2 text-xs leading-5 text-mist">La página se orienta según cada imagen y conserva su proporción, con un pequeño margen.</p></div>
          <p className="mt-4 text-xs leading-5 text-mist">Para cuidar la memoria, cada imagen se reduce hasta 2048 px por lado / 4 MP y se vuelve a codificar como JPG; las zonas transparentes serán blancas. El PDF contiene imágenes, no texto seleccionable.</p>
          {busy && <div className="mt-4" role="status"><p className="text-sm text-mist">{canceling ? 'Cancelando…' : `Preparando imagen ${Math.min(progress.done + 1, progress.total)} de ${progress.total}…`}</p><progress className="mt-2 w-full" aria-label="Progreso del PDF" max={progress.total || 1} value={progress.done} /></div>}
          <div className="mt-5 flex flex-wrap gap-2"><button className="btn btn-primary flex-1" type="button" disabled={busy} onClick={generate}><Icon className="size-5" name="file-pdf" /> Crear y descargar PDF</button>{busy ? <button className="btn btn-secondary" type="button" disabled={canceling} onClick={() => { setCanceling(true); task.current?.abort(); }}>Cancelar</button> : <button className="btn btn-ghost" type="button" onClick={() => { setItems([]); setError(''); setMessage('Lista reiniciada.'); }}>Reiniciar</button>}</div>
        </>}
        {message && <p className="mt-4 text-sm text-mist" role="status">{message}</p>}
      </div>
    </section>
    <section className="page-container pb-16"><div className="mx-auto max-w-3xl rounded-2xl border border-line bg-panel p-6 text-sm leading-7 text-mist"><h2 className="text-xl font-extrabold text-white">Tus archivos se quedan contigo</h2><p className="mt-3">La conversión ocurre en el navegador; no enviamos tus imágenes para generar el documento. El PDF se guarda solo cuando eliges descargarlo. En teléfonos con poca memoria, usa menos imágenes o archivos más pequeños.</p></div></section>
  </>;
}

import { useEffect, useRef, useState } from 'react';
import { BlueHint } from '../components/BlueHint';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { MAX_BACKGROUND_FILE_BYTES, prepareBackgroundImage, type PreparedBackground } from '../lib/backgroundInput';
import { downloadBlob, formatBytes, validateImageFile } from '../lib/files';
import { recognizeText, type OcrLanguage, type OcrProgress } from '../lib/ocr';
import { useObjectUrl } from '../lib/useObjectUrl';

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prepared, setPrepared] = useState<PreparedBackground | null>(null);
  const [language, setLanguage] = useState<OcrLanguage>('spa');
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [text, setText] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<OcrProgress>({ status: '', progress: 0 });
  const controller = useRef<AbortController | null>(null);
  const imageUrl = useObjectUrl(prepared?.blob);

  useEffect(() => () => controller.current?.abort(), []);
  const reset = () => { controller.current?.abort(); controller.current = null; setFile(null); setPrepared(null); setPreparing(false); setBusy(false); setText(''); setHasResult(false); setError(''); setMessage(''); };
  const handleFiles = async ([next]: File[]) => {
    const validation = validateImageFile(next, { maxBytes: MAX_BACKGROUND_FILE_BYTES });
    if (validation) { setError(validation); return; }
    controller.current?.abort(); const task = new AbortController(); controller.current = task;
    setFile(next); setPrepared(null); setText(''); setHasResult(false); setError(''); setMessage(''); setPreparing(true);
    try { const image = await prepareBackgroundImage(next, task.signal); if (!task.signal.aborted) setPrepared(image); }
    catch (caught) { if (!task.signal.aborted) setError(caught instanceof Error ? caught.message : 'No se pudo preparar la imagen.'); }
    finally { if (controller.current === task) { controller.current = null; setPreparing(false); } }
  };
  const run = async () => {
    if (!prepared || busy) return;
    const task = new AbortController(); controller.current = task; setBusy(true); setError(''); setText(''); setHasResult(false); setMessage(''); setProgress({ status: 'Preparando…', progress: 0 });
    try { const result = await recognizeText(prepared.blob, language, task.signal, setProgress); if (!task.signal.aborted) { setText(result); setHasResult(true); } }
    catch { if (!task.signal.aborted) setError('No se pudo extraer el texto. Comprueba la conexión para la primera descarga, prueba otra imagen o cierra otras aplicaciones.'); }
    finally { if (controller.current === task) { controller.current = null; setBusy(false); } }
  };
  const cancel = () => { controller.current?.abort(); controller.current = null; setBusy(false); setMessage('Operación cancelada.'); };
  const copy = async () => { try { await navigator.clipboard.writeText(text); setMessage('Texto copiado.'); } catch { setMessage('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.'); } };

  return <>
    <Seo title="Extraer texto de imágenes gratis y en privado | Vélix Blue" description="Convierte fotos e imágenes en texto editable en español o inglés, directamente en tu navegador." path="/extraer-texto" />
    <section className="page-container pb-12 pt-14 sm:pt-20">
      <ToolIntro icon="text" eyebrow="Extraer texto · OCR" title="Tu imagen, ahora en palabras." description="Convierte texto impreso de una foto en texto editable. El reconocimiento se realiza en tu dispositivo." blueTip="Una foto nítida y bien iluminada ayuda a obtener mejores resultados." />
      <div className="tool-shell mx-auto mt-10 max-w-5xl">
        {!file ? <div className="p-4 sm:p-7">{error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}<UploadZone description="JPG, PNG o WebP · Hasta 50 MB y 120 megapíxeles · Las imágenes grandes se reducen para ahorrar memoria" onFiles={handleFiles} /></div> :
          <div className="grid lg:grid-cols-2">
            <div className="min-w-0 border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-white">{file.name}</p><p className="mt-1 text-xs text-mist">{formatBytes(file.size)} · procesamiento local</p></div><button className="btn btn-ghost" type="button" onClick={reset}><Icon className="size-4" name="reset" /> Otra imagen</button></div>
              {imageUrl && <div className="mt-5 grid min-h-48 place-items-center overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-3"><img className="h-auto max-h-96 w-auto max-w-full rounded-lg object-contain" src={imageUrl} alt="Vista previa de la imagen seleccionada" /></div>}
              {preparing && <div className="mt-4"><Notice>Preparando la imagen…</Notice></div>}
              {prepared?.resized && <div className="mt-4"><Notice tone="info">La imagen se redujo a {prepared.width} × {prepared.height} px para ahorrar memoria. El texto pequeño podría perder nitidez.</Notice></div>}
            </div>
            <div className="flex min-w-0 flex-col gap-4 p-5 sm:p-7">
              <div><label className="field-label" htmlFor="ocr-language">Idioma del texto</label><select id="ocr-language" className="select-field" value={language} disabled={busy} onChange={e => setLanguage(e.target.value as OcrLanguage)}><option value="spa">Español</option><option value="eng">Inglés</option></select></div>
              <p className="text-xs leading-5 text-mist">La primera vez se descargan el motor y el idioma desde Vélix Blue. Después del reconocimiento, revisa el texto: puede contener errores. No se envía tu imagen al motor de OCR por internet.</p>
              {error && <Notice tone="error">{error}</Notice>}
              {busy && <div role="status" aria-live="polite"><p className="text-sm text-mist">{progress.status} {Math.round(progress.progress * 100)}%</p><progress className="mt-2 w-full" max="100" value={Math.round(progress.progress * 100)} aria-label="Progreso del reconocimiento" /></div>}
              <div className="flex flex-wrap gap-2"><button className="btn btn-primary flex-1" type="button" disabled={!prepared || preparing || busy} onClick={run}><Icon className="size-5" name="text" /> Extraer texto</button>{busy && <button className="btn btn-secondary" type="button" onClick={cancel}>Cancelar</button>}</div>
              {hasResult && <div className="flex flex-col gap-3"><BlueHint status message={text ? 'Ya puedes revisar y editar el texto.' : 'No encontré texto. Prueba con una imagen más nítida.'} /><label className="field-label" htmlFor="ocr-result">Texto reconocido · editable</label><textarea id="ocr-result" className="textarea-field min-h-48 w-full resize-y" value={text} onChange={e => setText(e.target.value)} /><div className="flex flex-wrap gap-2"><button className="btn btn-secondary flex-1" type="button" disabled={!text} onClick={copy}>Copiar texto</button><button className="btn btn-secondary flex-1" type="button" disabled={!text} onClick={() => downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'texto-extraido.txt')}>Descargar TXT</button></div></div>}
              {message && <p className="text-sm text-mist" role="status">{message}</p>}
            </div>
          </div>}
      </div>
    </section>
    <section className="page-container pb-16"><div className="mx-auto max-w-3xl rounded-2xl border border-line bg-panel p-6 text-sm leading-7 text-mist"><h2 className="text-xl font-extrabold text-white">Antes de usar el resultado</h2><p className="mt-3">Funciona mejor con texto impreso, enfocado y con buen contraste. Letra manuscrita, tablas, columnas y fotos borrosas pueden dar errores. Comprueba nombres, cifras y signos antes de usar el texto.</p><p className="mt-3">La herramienta procesa una imagen a la vez. Los archivos del motor pueden guardarse en la caché del navegador para usos posteriores; las fotos y el texto no se guardan allí automáticamente.</p></div></section>
  </>;
}

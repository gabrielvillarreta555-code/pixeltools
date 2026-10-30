import { useState } from 'react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { Seo } from '../components/Seo';
import { ToolIntro } from '../components/ToolIntro';
import { UploadZone } from '../components/UploadZone';
import { downloadBlob, formatBytes, isSupportedImageType, makeOutputName, validateImageFile } from '../lib/files';
import { readMetadata, stripMetadata, type MetadataReport } from '../lib/metadata';
import { useObjectUrl } from '../lib/useObjectUrl';

const MAX_FILE_BYTES = 50 * 1024 * 1024;

interface Analysis {
  report: MetadataReport;
  clean: Blob;
  cleanReport: MetadataReport;
}

export default function MetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const previewUrl = useObjectUrl(file);

  const handleFiles = async ([next]: File[]) => {
    const validationError = validateImageFile(next, { maxBytes: MAX_FILE_BYTES });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setAnalysis(null);
    setFile(next);
    setBusy(true);
    try {
      const bytes = new Uint8Array(await next.arrayBuffer());
      const report = readMetadata(bytes);
      const cleanBytes = stripMetadata(bytes);
      // Se vuelve a analizar el resultado para confirmar que quedó limpio.
      const cleanReport = readMetadata(cleanBytes);
      const type = isSupportedImageType(next.type) ? next.type : `image/${report.format}`;
      setAnalysis({ report, clean: new Blob([cleanBytes], { type }), cleanReport });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo analizar la imagen.');
      setFile(null);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
  };

  const report = analysis?.report;
  const sensitive = report?.entries.filter((entry) => entry.sensitive) ?? [];
  const hasMetadata = Boolean(report && report.removableBytes > 0);
  const mime = file && isSupportedImageType(file.type) ? file.type : 'image/jpeg';

  return (
    <>
      <Seo
        title="Quitar metadatos y ubicación GPS de tus fotos | Vélix Blue"
        description="Descubre qué datos ocultos revela una foto (ubicación, dispositivo, fecha) y elimínalos sin perder calidad, directamente en tu navegador."
        path="/quitar-metadatos"
      />
      <section className="page-container pb-12 pt-14 sm:pt-20">
        <ToolIntro
          icon="location"
          eyebrow="Quitar metadatos"
          title="Tus fotos cuentan más de lo que crees."
          description="Muchas fotos guardan dónde se tomaron, con qué teléfono y cuándo. Descúbrelo y bórralo antes de compartirlas, sin perder calidad."
        />

        <div className="tool-shell mx-auto mt-10 max-w-5xl">
          {!file ? (
            <div className="p-4 sm:p-7">
              {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
              <UploadZone description="JPG, PNG o WebP · Máximo 50 MB · La imagen no se recomprime" onFiles={handleFiles} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="min-w-0 border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{file.name}</p>
                    <p className="mt-1 text-xs text-mist">{formatBytes(file.size)}{report && ` · ${report.format.toUpperCase()}`}</p>
                  </div>
                  <button className="btn btn-ghost shrink-0" type="button" onClick={reset}>
                    <Icon className="size-4" name="reset" /> Otra imagen
                  </button>
                </div>
                <div className="mt-5 grid min-h-64 place-items-center overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-3">
                  <img className="h-auto max-h-[26rem] w-auto max-w-full rounded-lg object-contain" src={previewUrl} alt={`Vista previa de ${file.name}`} />
                </div>
              </div>

              <div className="flex flex-col gap-5 p-5 sm:p-7" aria-live="polite">
                {busy && <p className="text-sm text-mist" role="status">Analizando la imagen…</p>}

                {report && (
                  <>
                    {report.gps ? (
                      <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4">
                        <p className="flex items-center gap-2 font-bold text-amber-100"><Icon className="size-5" name="location" /> Esta foto revela dónde se tomó</p>
                        <p className="mt-1 text-sm text-amber-100/90">
                          Coordenadas {report.gps.latitude.toFixed(5)}, {report.gps.longitude.toFixed(5)}. Cualquiera que reciba el archivo original podría ver el lugar exacto.
                        </p>
                      </div>
                    ) : hasMetadata ? (
                      <Notice tone="info">No hay ubicación GPS, pero la foto contiene otros datos ocultos.</Notice>
                    ) : (
                      <Notice tone="success">No encontramos metadatos en esta imagen. Ya está lista para compartir.</Notice>
                    )}

                    {report.entries.length > 0 && (
                      <div>
                        <h2 className="text-lg font-extrabold text-white">Datos encontrados ({report.entries.length})</h2>
                        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                          {report.entries.map((entry, index) => (
                            <li key={`${entry.label}-${index}`} className="flex items-start justify-between gap-3 px-4 py-3">
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-white">{entry.label}</span>
                                <span className="block break-words text-sm text-mist">{entry.value}</span>
                              </span>
                              {entry.sensitive && <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.68rem] font-bold text-amber-100">Personal</span>}
                            </li>
                          ))}
                        </ul>
                        {sensitive.length > 0 && <p className="mt-2 text-xs text-mist">{sensitive.length} de estos datos pueden identificarte a ti, tu ubicación o tu dispositivo.</p>}
                      </div>
                    )}

                    {analysis && hasMetadata && (
                      <div className="mt-auto rounded-2xl border border-line bg-white/[0.03] p-4">
                        {analysis.cleanReport.entries.length === 0 ? (
                          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200"><Icon className="size-4" name="check" /> Comprobado: la copia limpia no contiene estos datos.</p>
                        ) : (
                          <Notice tone="warning">No se pudieron eliminar todos los datos de este archivo.</Notice>
                        )}
                        <p className="mt-2 text-xs leading-5 text-mist">
                          Se eliminan {formatBytes(report.removableBytes)} sin recomprimir la imagen: la calidad no cambia. Se conservan el perfil de color{report.orientation !== 1 ? ' y la orientación' : ''}.
                        </p>
                        <button
                          className="btn btn-primary mt-4 w-full"
                          type="button"
                          onClick={() => downloadBlob(analysis.clean, makeOutputName(file.name, mime, 'sin-metadatos'))}
                        >
                          <Icon className="size-5" name="download" /> Descargar sin metadatos
                        </button>
                      </div>
                    )}
                  </>
                )}
                {error && <Notice tone="error">{error}</Notice>}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['location', '¿Por qué importa?', 'Una foto de tu casa puede incluir sus coordenadas exactas. Al compartir el archivo original, también compartes ese dato.'],
            ['shield', 'Sin perder calidad', 'Solo se eliminan los bloques de metadatos. Los píxeles de la imagen quedan exactamente igual.'],
            ['lock', 'Sin subir nada', 'El análisis y la limpieza ocurren en tu navegador. La foto nunca sale de tu dispositivo.'],
          ].map(([icon, title, text]) => (
            <article key={title} className="glass rounded-2xl p-5">
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

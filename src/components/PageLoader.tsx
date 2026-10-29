export function PageLoader() {
  return (
    <div className="page-container grid min-h-[55vh] place-items-center" role="status">
      <div className="text-center">
        <span className="mx-auto block size-9 animate-spin rounded-full border-3 border-line border-t-electric" />
        <p className="mt-4 text-sm font-semibold text-mist">Cargando herramienta…</p>
      </div>
    </div>
  );
}

interface BlueHintProps {
  message: string;
  status?: boolean;
}

/** Mensajes preparados para acompañar la herramienta, sin analizar las imágenes. */
export function BlueHint({ message, status = false }: BlueHintProps) {
  return (
    <div className="blue-hint" role={status ? 'status' : undefined}>
      <span className="blue-hint-avatar" aria-hidden="true" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}blue-referencia.jpg)` }} />
      <p><strong>Blue:</strong> {message}</p>
    </div>
  );
}

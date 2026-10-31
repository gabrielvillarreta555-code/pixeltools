interface BlueHintProps {
  message: string;
  status?: boolean;
}

/** Mensajes preparados para acompañar la herramienta, sin analizar las imágenes. */
export function BlueHint({ message, status = false }: BlueHintProps) {
  return (
    <div className="blue-hint" role={status ? 'status' : undefined}>
      <img className="blue-hint-avatar" src={`${import.meta.env.BASE_URL}blue-vivo.svg`} alt="" width="72" height="86" />
      <p><strong>Blue:</strong> {message}</p>
    </div>
  );
}

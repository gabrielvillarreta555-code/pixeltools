/** Coordenadas del puntero relativas al lienzo; el borde nunca queda fuera. */
export function maskPoint(clientX: number, clientY: number, rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>, width: number, height: number) {
  if (rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return { x: 0, y: 0 };
  return {
    x: Math.max(0, Math.min(width - 1, (clientX - rect.left) * width / rect.width)),
    y: Math.max(0, Math.min(height - 1, (clientY - rect.top) * height / rect.height)),
  };
}

export type MaskMode = 'erase' | 'restore';
export interface BrushPoint { x: number; y: number }

/** Aplica una sola pincelada. Restaurar recupera los píxeles del original, no del PNG ya recortado. */
export function paintMask(context: CanvasRenderingContext2D, original: CanvasImageSource, mode: MaskMode, from: BrushPoint, to: BrushPoint, radius: number, width: number, height: number) {
  context.save();
  try {
  context.lineCap = 'round'; context.lineJoin = 'round'; context.lineWidth = radius * 2;
  context.beginPath(); context.moveTo(from.x, from.y); context.lineTo(to.x, to.y);
  if (mode === 'erase') {
    context.globalCompositeOperation = 'destination-out'; context.strokeStyle = '#000'; context.stroke();
    context.beginPath(); context.arc(to.x, to.y, radius, 0, Math.PI * 2); context.fillStyle = '#000'; context.fill();
  } else {
    // Un lienzo temporal pequeño contiene el trazo; source-in aplica allí solo
    // los píxeles originales y evita copiar la fotografía completa por trazo.
    const left = Math.max(0, Math.floor(Math.min(from.x, to.x) - radius - 1));
    const top = Math.max(0, Math.floor(Math.min(from.y, to.y) - radius - 1));
    const right = Math.min(width, Math.ceil(Math.max(from.x, to.x) + radius + 1));
    const bottom = Math.min(height, Math.ceil(Math.max(from.y, to.y) + radius + 1));
    const patch = document.createElement('canvas'); patch.width = Math.max(1, right - left); patch.height = Math.max(1, bottom - top);
    try {
      const ctx = patch.getContext('2d'); if (!ctx) throw new Error('No hay memoria suficiente para aplicar el pincel.');
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = radius * 2;
      ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(from.x - left, from.y - top); ctx.lineTo(to.x - left, to.y - top); ctx.stroke();
      ctx.beginPath(); ctx.arc(to.x - left, to.y - top, radius, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-in'; ctx.drawImage(original, -left, -top, width, height);
      // Sustituye la zona, no la acumules: source-over por sí solo subiría el
      // alfa al repetir el pincel sobre originales semitransparentes.
      context.globalCompositeOperation = 'destination-out'; context.strokeStyle = '#000'; context.stroke();
      context.beginPath(); context.arc(to.x, to.y, radius, 0, Math.PI * 2); context.fillStyle = '#000'; context.fill();
      context.globalCompositeOperation = 'source-over'; context.drawImage(patch, left, top);
    } finally { patch.width = 0; patch.height = 0; }
  }
  } finally { context.restore(); }
}

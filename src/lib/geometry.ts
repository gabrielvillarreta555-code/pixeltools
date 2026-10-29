export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Rectángulo mínimo que contiene los píxeles con alfa mayor que `threshold`. */
export function findAlphaBounds(
  rgba: ArrayLike<number>,
  width: number,
  height: number,
  threshold = 24,
): Box | null {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rgba[(y * width + x) * 4 + 3] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Lleva una caja a otra resolución, redondeando hacia fuera para no recortar el sujeto. */
export function scaleBox(box: Box, fromWidth: number, fromHeight: number, toWidth: number, toHeight: number): Box {
  const sx = toWidth / fromWidth;
  const sy = toHeight / fromHeight;
  const x = Math.max(0, Math.floor(box.x * sx));
  const y = Math.max(0, Math.floor(box.y * sy));
  const right = Math.min(toWidth, Math.ceil((box.x + box.width) * sx));
  const bottom = Math.min(toHeight, Math.ceil((box.y + box.height) * sy));
  return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y) };
}

/** Añade un margen proporcional al lado mayor y limita el resultado al lienzo. */
export function padBox(box: Box, canvasWidth: number, canvasHeight: number, ratio = 0.04): Box {
  const margin = Math.round(Math.max(box.width, box.height) * ratio);
  const x = Math.max(0, box.x - margin);
  const y = Math.max(0, box.y - margin);
  const right = Math.min(canvasWidth, box.x + box.width + margin);
  const bottom = Math.min(canvasHeight, box.y + box.height + margin);
  return { x, y, width: right - x, height: bottom - y };
}

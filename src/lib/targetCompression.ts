/** Búsqueda acotada: el tamaño de Canvas no siempre es monótono en calidad. */
export async function findTargetEncoding(
  encode: (quality: number) => Promise<Blob>,
  targetBytes: number,
  signal?: AbortSignal,
): Promise<{ blob: Blob; quality: number; met: boolean }> {
  if (!Number.isSafeInteger(targetBytes) || targetBytes < 1) throw new Error('El tamaño objetivo no es válido.');
  let low = 30;
  let high = 95;
  let best: { blob: Blob; quality: number } | undefined;
  let smallest: { blob: Blob; quality: number } | undefined;
  // Incluye los extremos; después explora el intervalo con un máximo de 9 codificaciones.
  const candidates = [95, 30];
  for (let attempt = 0; attempt < 9 && (candidates.length || low <= high); attempt++) {
    if (signal?.aborted) throw new DOMException('Operación cancelada', 'AbortError');
    const quality = candidates.shift() ?? Math.floor((low + high) / 2);
    const blob = await encode(quality / 100);
    if (signal?.aborted) throw new DOMException('Operación cancelada', 'AbortError');
    if (!smallest || blob.size < smallest.blob.size) smallest = { blob, quality };
    if (blob.size <= targetBytes) {
      if (!best || quality > best.quality) best = { blob, quality };
      low = Math.max(low, quality + 1);
    } else {
      high = Math.min(high, quality - 1);
    }
  }
  const result = best ?? smallest!;
  return { ...result, met: Boolean(best) };
}

import { describe, expect, it, vi } from 'vitest';
import { progressLabel, recognizeText } from '../src/lib/ocr';

describe('OCR local', () => {
  it('traduce estados de progreso sin incorporar datos de la imagen', () => {
    expect(progressLabel('recognizing text')).toBe('Leyendo el texto…');
    expect(progressLabel('loading language traineddata')).toBe('Preparando el idioma…');
    expect(progressLabel('estado desconocido')).toBe('Cargando el motor local…');
  });
  it('respeta una cancelación previa antes de cargar el motor', async () => {
    const abort = new AbortController(); abort.abort(); const progress = vi.fn();
    await expect(recognizeText(new Blob(), 'spa', abort.signal, progress)).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress).not.toHaveBeenCalled();
  });
});

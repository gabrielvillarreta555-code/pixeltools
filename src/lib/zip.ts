// Generador ZIP mínimo (método STORE, sin compresión). Las imágenes ya están
// comprimidas, así que DEFLATE apenas ahorraría espacio y añadiría una dependencia.

export interface ZipEntry {
  name: string;
  data: Blob;
  modified?: Date;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

/** Evita nombres repetidos dentro del archivo: foto.jpg, foto (2).jpg… */
export function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name) => {
    let candidate = name;
    let counter = 2;
    while (used.has(candidate.toLowerCase())) {
      candidate = name.replace(/(\.[^.]*)?$/, (extension) => ` (${counter})${extension}`);
      counter += 1;
    }
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

export async function createZip(entries: ZipEntry[]): Promise<Blob> {
  const encoder = new TextEncoder();
  const names = uniqueNames(entries.map((entry) => entry.name));
  const parts: BlobPart[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const [index, entry] of entries.entries()) {
    const nameBytes = encoder.encode(names[index]);
    // Los bytes solo se leen para el CRC; el archivo final reutiliza el Blob
    // original en lugar de una copia, así no se duplica el lote en memoria.
    const crc = crc32(new Uint8Array(await entry.data.arrayBuffer()));
    const size = entry.data.size;
    const { time, date } = dosDateTime(entry.modified ?? new Date());
    if (offset + size > 0xfffffffe) {
      throw new RangeError('El archivo ZIP superaría 4 GB.');
    }

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // nombres en UTF-8
    local.setUint16(8, 0, true);
    local.setUint16(10, time, true);
    local.setUint16(12, date, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true);
    local.setUint32(22, size, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);
    parts.push(local.buffer, nameBytes, entry.data);

    const header = new DataView(new ArrayBuffer(46));
    header.setUint32(0, 0x02014b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, 20, true);
    header.setUint16(8, 0x0800, true);
    header.setUint16(10, 0, true);
    header.setUint16(12, time, true);
    header.setUint16(14, date, true);
    header.setUint32(16, crc, true);
    header.setUint32(20, size, true);
    header.setUint32(24, size, true);
    header.setUint16(28, nameBytes.length, true);
    header.setUint32(42, offset, true);
    const record = new Uint8Array(46 + nameBytes.length);
    record.set(new Uint8Array(header.buffer), 0);
    record.set(nameBytes, 46);
    central.push(record);

    offset += 30 + nameBytes.length + size;
  }

  const centralSize = central.reduce((total, record) => total + record.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
}

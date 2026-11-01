import { copyFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules', 'onnxruntime-web', 'dist');
const destination = join(root, 'public', 'ort');

await mkdir(destination, { recursive: true });

const entries = await readdir(source);
const runtimeFiles = [
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
].filter((name) => entries.includes(name));

if (runtimeFiles.length === 0) {
  throw new Error('No se encontraron los archivos WASM de ONNX Runtime Web.');
}

const previousFiles = await readdir(destination);
await Promise.all(
  previousFiles
    .filter((name) => !runtimeFiles.includes(name))
    .map((name) => unlink(join(destination, name))),
);

await Promise.all(
  runtimeFiles.map((name) => copyFile(join(source, name), join(destination, name))),
);

console.log(`ONNX Runtime: ${runtimeFiles.length} archivos preparados.`);

// OCR se sirve desde este sitio, sin CDN; los archivos pesados se cargan solo al usarlo.
const ocr = join(root, 'public', 'ocr');
const core = join(ocr, 'core');
const lang = join(ocr, 'lang');
await Promise.all([mkdir(core, { recursive: true }), mkdir(lang, { recursive: true })]);
await copyFile(join(root, 'node_modules', 'tesseract.js', 'dist', 'worker.min.js'), join(ocr, 'worker.min.js'));
for (const name of ['tesseract-core-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js', 'tesseract-core-relaxedsimd-lstm.wasm.js']) {
  await copyFile(join(root, 'node_modules', 'tesseract.js-core', name), join(core, name));
}
for (const code of ['spa', 'eng']) {
  await copyFile(join(root, 'node_modules', '@tesseract.js-data', code, '4.0.0_best_int', `${code}.traineddata.gz`), join(lang, `${code}.traineddata.gz`));
}
console.log('OCR: motor y modelos de español e inglés preparados.');

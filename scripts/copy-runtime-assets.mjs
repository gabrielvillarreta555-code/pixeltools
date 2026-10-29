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

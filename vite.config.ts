import { defineConfig } from 'vite';
export default defineConfig({ build: { target: 'es2022', sourcemap: false }, preview: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } } });

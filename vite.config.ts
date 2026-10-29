import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dominio público definitivo. SITE_URL y VITE_SITE_URL son equivalentes; solo
// cuando hay uno configurado se permite indexar el sitio. Sin dominio (pruebas
// en *.pages.dev o en local) todas las páginas llevan noindex.
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
  },
  resolve: {
    // ONNX Runtime has a bundle that embeds a 12 MB WASM asset. We serve the
    // same runtime from /ort instead, so the lazy JS chunk stays small.
    conditions: ['onnxruntime-web-use-extern-wasm'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

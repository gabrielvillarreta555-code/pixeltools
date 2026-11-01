# Licencias y atribuciones de terceros

Vélix Blue (antes PixelTools) no modifica las licencias de sus dependencias. El inventario completo
y las versiones exactas quedan fijados en `package-lock.json`.

## Modelo U²-Net pequeño (`public/models/u2netp.onnx`)

- Arquitectura y proyecto original: **U-2-Net: Going Deeper with Nested U-Structure
  for Salient Object Detection**, Xuebin Qin et al.
- Repositorio: <https://github.com/xuebinqin/U-2-Net>
- Licencia del proyecto original: Apache License 2.0.
- Conversión ONNX distribuida por `danielgatis/rembg`:
  <https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx>
- Licencia de `rembg`: MIT, Copyright (c) 2020 Daniel Gatis.
- Tamaño verificado: 4.574.861 bytes.
- SHA-256 verificado:
  `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`.

La licencia Apache-2.0 aplicable al proyecto original se incluye en
`LICENSES/Apache-2.0.txt`. El archivo ONNX se distribuye sin garantía. La licencia
MIT del proyecto que publica la conversión dice:

> MIT License
>
> Copyright (c) 2020 Daniel Gatis
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is furnished
> to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## ONNX Runtime Web

- Paquete: `onnxruntime-web`
- Proyecto: <https://github.com/microsoft/onnxruntime>
- Licencia: MIT, Copyright (c) Microsoft Corporation.

## OCR local

- `tesseract.js` y `tesseract.js-core` 7.0.0: Apache License 2.0;
  <https://github.com/naptha/tesseract.js> y <https://github.com/naptha/tesseract.js-core>.
- Datos de español e inglés `@tesseract.js-data/spa` y `@tesseract.js-data/eng`
  1.0.0, variantes `4.0.0_best_int`: paquetes publicados bajo MIT y modelos
  derivados de Tesseract tessdata; procedencia documentada en
  <https://github.com/naptha/tessdata> y licencia Apache 2.0 del proyecto de
  modelos <https://github.com/tesseract-ocr/tessdata_best/blob/main/LICENSE>.
- SHA-256 español: `40be52f97b5d4eb7460073dc1f94cd546b27150333c0bf854ed7e7132db6bceb`.
- SHA-256 inglés: `45b4cb346724ac1774f1c36f42f182b887bcdb28ebe63e6fff90ac41f3fcff91`.
- Se copian desde dependencias fijadas al compilar y se sirven desde el sitio.
  La licencia Apache 2.0 está en `LICENSES/Apache-2.0.txt`.

## Interfaz web

- React y React DOM: MIT, Meta Platforms, Inc. y colaboradores.
- React Router: MIT, Remix Software Inc.
- Vite: MIT, Evan You y colaboradores.
- Tailwind CSS: MIT, Tailwind Labs, Inc.
- TypeScript: Apache-2.0, Microsoft Corporation.
- Vitest: MIT, Anthony Fu y colaboradores.
- Playwright (solo pruebas): Apache-2.0, Microsoft Corporation.
- pdf-lib: MIT, Andrew Dillon; <https://github.com/Hopding/pdf-lib>. Licencia y
  aviso de copyright en `LICENSES/pdf-lib-MIT.txt`.
- Plus Jakarta Sans (`@fontsource-variable/plus-jakarta-sans`): SIL Open Font
  License 1.1, The Plus Jakarta Sans Project Authors
  (<https://github.com/tokotype/PlusJakartaSans>).

Las copias de licencia incluidas por cada paquete pueden consultarse después de
`npm install` dentro de `node_modules/<paquete>/LICENSE*`.

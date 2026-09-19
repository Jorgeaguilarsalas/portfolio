# portfolio

Portafolio de Jorge Aguilar — 343ride.de. Sitio estatico servido por Cloudflare
Workers (`worker.js` + assets del repo), con deploy automatico vía Workers
Builds en cada push a `main`.

## CV

El CV se genera desde el repo; no se exporta a mano desde LibreOffice.

- Fuente editable: `cv/index.html` (HTML + CSS, dark theme del portafolio).
- Build: `npm run cv` → renderiza con Puppeteer a `Jorge_Aguilar_CV.pdf` (A4, 2 pág).
- Publicado en https://343ride.de/Jorge_Aguilar_CV.pdf al hacer push.

```sh
npm install
npm run cv:setup   # descarga Chrome; npm >= 11 bloquea el postinstall de Puppeteer
npm run cv
```

Para cambiar el CV se edita `cv/index.html` y se corre `npm run cv`. Cada
`<div class="sheet">` es una página A4 exacta, así que el corte de página es
explícito en el HTML. `cv/`, `scripts/`, `package*.json` y `node_modules/` están
en `.assetsignore`: viven en el repo pero no se sirven como parte del sitio.

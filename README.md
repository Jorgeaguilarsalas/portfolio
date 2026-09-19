# portfolio

Portafolio de Jorge Aguilar — jorgeag.com. Sitio estatico servido por Cloudflare
Workers (`worker.js` + assets del repo), con deploy automatico vía Workers
Builds en cada push a `main`.

`jorgeag.com` es el dominio canonico. `343ride.de`, `www.*` y la URL de
`workers.dev` responden 301 al mismo path en `jorgeag.com` (ver `worker.js`).
El redirect de `343ride.de` es temporal: ese dominio se retomara como proyecto
propio. `fleet@343ride.de` sigue siendo el contacto legal de Salas UG en
Impressum y Datenschutz.

## CV

El CV se genera desde el repo; no se exporta a mano desde LibreOffice.

- Fuente editable: `cv/index.html` (HTML + CSS, dark theme del portafolio).
- Build: `npm run cv` → renderiza con Puppeteer a `Jorge_Aguilar_CV.pdf` (A4, 2 pág).
- Publicado en https://jorgeag.com/Jorge_Aguilar_CV.pdf al hacer push.

```sh
npm install
npm run cv:setup   # descarga Chrome; npm >= 11 bloquea el postinstall de Puppeteer
npm run cv
```

Para cambiar el CV se edita `cv/index.html` y se corre `npm run cv`. Cada
`<div class="sheet">` es una página A4 exacta, así que el corte de página es
explícito en el HTML. `cv/`, `scripts/`, `package*.json` y `node_modules/` están
en `.assetsignore`: viven en el repo pero no se sirven como parte del sitio.

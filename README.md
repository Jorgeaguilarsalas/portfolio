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

## Formulario de contacto

Paginas: `/contact/`, `/de/contact/`, `/es/contact/` (markup + strings por idioma).
Compartido: `contact/form.css` y `contact/form.js`. Backend: `worker-contact.js`,
montado en `POST /contact/submit` desde `worker.js`.

Deliberadamente **no** hay bindings nuevos en `wrangler.toml`: un `[[send_email]]`
con un `destination_address` sin verificar hace fallar `wrangler deploy` y eso
congelaria los deploys del sitio entero. Todo se lee de `env` a la defensiva.

Estado sin configurar: el endpoint responde `503 not_configured` y el frontend
ofrece un `mailto:` ya redactado con lo que la persona escribio, asi que no se
pierde ningun lead. Honeypot y rate limiting funcionan desde el primer dia.

### Estado: activo

1. **Turnstile** — sitio `jorgeag.com` en modo Managed. El *site key* es publico
   y vive en `data-sitekey` de las tres paginas; el *secret key* esta cargado
   como secret del Worker (`TURNSTILE_SECRET_KEY`). El Worker solo exige token
   si ese secret existe, asi que un entorno sin el sigue aceptando envios.
   El token es de un solo uso: `contact/form.js` llama a `turnstile.reset()`
   tras cada respuesta de error para que el reintento tenga uno fresco.
2. **Envio de correo** — `RESEND_API_KEY` cargado como secret. Resend es la
   unica via que permite el **auto-reply**: Cloudflare Email Workers solo
   entrega a direcciones verificadas de la cuenta, nunca a un remitente
   desconocido. Si Resend falla, el endpoint responde 502 y el frontend ofrece
   un `mailto:` ya redactado, asi que el lead no se pierde.
3. **Rate limiting entre isolates** (pendiente, opcional) — `wrangler kv
   namespace create CONTACT_KV` y agregar el binding como `CONTACT_KV`. Sin el,
   el limite de 5/hora por IP se aplica por isolate.

Variables opcionales (`[vars]` en `wrangler.toml` o dashboard):

| Variable | Default | Para que |
|---|---|---|
| `CONTACT_INBOX` | `hello@jorgeag.com` | destino del aviso |
| `CONTACT_FROM` | `contact@jorgeag.com` | remitente del aviso |
| `CONTACT_REPLY_FROM` | `hello@jorgeag.com` | remitente del auto-reply |

Los remitentes tienen que pertenecer a un dominio verificado en Resend, si no
la API responde 403 y el envio cae al `mailto:`.

Turnstile, Cloudflare Workers y Resend figuran como encargados del tratamiento
en la seccion 12 (Kontaktformular) del Datenschutz. Cambiar de proveedor obliga
a actualizar esa seccion.

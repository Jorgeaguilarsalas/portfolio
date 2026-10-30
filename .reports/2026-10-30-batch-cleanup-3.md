# Lote de limpieza #3: contraste de `/cv/` y `opacity:.55` muertos

**Fecha:** 2026-10-30
**Rama:** `main`
**Commits:** `f92a82d`, `19cf0c7` (sobre `15a872a`)
**Evidencia:** `.reports/2026-10-30-batch-cleanup-3/`

Dos arreglos independientes en dos commits. Todo está medido en Chrome
(156.0.8078.76, headless), no leído del CSS.

---

## Resumen

| # | Qué | Ficheros | Commit | Estado |
|---|---|---|---|---|
| 1 | `--muted` de `/cv/` a `#B4B4BB` + PDF regenerado | `cv/index.html`, `Jorge_Aguilar_CV.pdf` | `f92a82d` | Hecho |
| 2 | Quitar `opacity:.55` muerto de los numerales del menú | 35 HTML + `contact/form.css` | `19cf0c7` | Hecho |

Hay dos desviaciones del parte. Las dos se explican abajo:

- **El PDF no suspendía AA.** El 3.44:1 de §2.4bis es el pie del overlay móvil
  (`--muted` a opacity .72), y ese pie no se imprime. El texto gris del PDF
  estaba en 5.72:1. El cambio se aplicó igualmente y el PDF cambia de aspecto
  (§1.2).
- **La copia 36 es CSS, no HTML.** Son 35 `<style>` inline más
  `/contact/form.css`. Un grep restringido a `*.html` no puede dar cero: queda
  una coincidencia legítima en `leadership-framework` (§2.3).

---

## 1. Fix 1: `--muted` de `/cv/`

### 1.1 Cifras (medidas)

Fondo `#0B0B0D`, luminancia relativa WCAG 2.x:

| Token | opacity | Efectivo | Ratio | AA (4.5:1) | Dónde |
|---|---|---|---|---|---|
| `#8A8A8F` | 1 | `#8A8A8F` | 5.72:1 | ✓ | `.lbl` `.place` `.org` en el PDF (antes) |
| `#8A8A8F` | .72 | `#66666B` | **3.44:1** | ✗ | pie y numerales del overlay en `/cv/` (antes) |
| `#B4B4BB` | 1 | `#B4B4BB` | **9.54:1** | ✓ | `.lbl` `.place` `.org` en el PDF (después) |
| `#B4B4BB` | .72 | `#85858A` | **5.36:1** | ✓ | pie y numerales del overlay (después) |

El parte esperaba unos 6.47:1 para `#B4B4BB`. El valor medido es 9.54:1. El
`#85858A` a .72 coincide con lo que dejó previsto §2.4bis del informe del 28-10.

### 1.2 Lo que cambia y lo que no

El texto que fallaba AA (el pie y los numerales del overlay) está oculto en
impresión (`@media print{.nav,.mobile-menu,.nav-toggle{display:none!important}}`).
Así que:

- **En `/cv/` servido en local** (404 en producción): el overlay pasa de 3.44:1
  a 5.36:1. Es el arreglo de AA de verdad.
- **En el PDF:** no había fallo de AA. El cambio es de diseño: las etiquetas,
  los lugares y las empresas suben de `#8A8A8F` a `#B4B4BB`, más claros y con
  menos distancia respecto al `--body` `#E6E6E6`. La jerarquía se mantiene
  (9.54:1 frente a 15.76:1 del cuerpo) y queda igual que en el resto del
  portafolio.

Si se prefiere el PDF como estaba, revertir `f92a82d` lo deja todo como antes.
Arreglar solo el overlay pediría una opacidad propia en `/cv/`, que es justo la
deriva que se quiere evitar.

### 1.3 Regeneración del PDF

`npm run cv` falló al principio: el Chrome de Puppeteer (153.0.8010.36) no estaba
en `~/.cache/puppeteer`. En lugar de descargarlo se usó el Chrome del sistema:

```
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run cv
PDF generated: …/Jorge_Aguilar_CV.pdf (289.6 KB)
```

Comprobaciones:

```
### Texto visible en print (verify-cv-muted.js)
--muted=#B4B4BB
  rgb(180, 180, 187) .lbl   x7
  rgb(180, 180, 187) .place x11
  rgb(180, 180, 187) .org   x11

### Píxel más claro, PDF rasterizado a 1400px (verify-pdf-pixels.js)
antes   "Nexio Fleet GmbH": rgb(138,138,144)  "Berlin": rgb(138,138,144)
después "Nexio Fleet GmbH": rgb(180,180,187)  "Berlin": rgb(180,180,187)

### Páginas (/Count del árbol de páginas)
antes 2   después 2
```

Comparación visual de la página 1 antes y después: la maquetación es idéntica,
no se mueve ningún salto de línea y el gris es más legible.

---

## 2. Fix 2: `opacity:.55` muerto en los numerales

### 2.1 Qué se tocó

En la regla `.mobile-menu-links a .num{…}` se quitó solo `opacity:.55;`. El
resto de la regla queda igual, incluido el `transition: … opacity .2s ease`, que
sigue sirviendo para el hover y el estado activo que fija `/nav.css`.

- **36 ficheros, 36 líneas cambiadas** (36 inserciones y 36 borrados, una por
  fichero; la línea se reescribe sin la declaración).
- 35 HTML: 14 en EN (incluye `cv`, `impressum`, `datenschutz`, `privacy`),
  10 en DE y 11 en ES (incluye `privacidad`). Lista completa en
  `git show --stat 19cf0c7`.
- `contact/form.css`: la copia compartida por `/contact/`, `/de/contact/` y
  `/es/contact/`. Es la que hace 36 (lo dice el comentario de `/nav.css`). En
  las tres páginas `form.css` carga en la línea 26 y `/nav.css` en la 42, así
  que también estaba muerta.

Las 35 páginas cargan `/nav.css` después de su `<style>`. Para `/cv/`, que tiene
un comentario sobre `/nav.css` en la línea 50, el `<link>` real está en la 373,
detrás del `</style>` de la 371.

### 2.2 Verificación: computado antes y después, 38 páginas

Servido con `python3 -m http.server`, viewport 390×844, `getComputedStyle` de
cada `.mobile-menu-links a .num` (`verify-num-opacity.js`):

```
== DESPUÉS
0.72            -> 23 páginas (404 ×3, alcorte ×3, bliq ×3, bolt ×3, nexio ×3, wolt ×3, cv, impressum, datenschutz, privacy, privacidad)
0.72,1(active)  -> 12 páginas (/, about, work, leadership-framework × 3 idiomas)
0.72,1(active)  ->  3 páginas (contact × 3 idiomas)

== ANTES (HEAD)
idéntico, página a página
```

El `1` es el enlace de la página actual. Lo sube `/nav.css` a propósito con
especificidad (0,3,1). Ningún numeral cambia.

### 2.3 Grep posterior

```
$ grep -rnE 'opacity:\s*0?\.55' --include='*.html' --include='*.css' . | grep -v node_modules | grep -v '^./.reports'
nav.css:153:                       * Estaban en color:var(--muted) con opacity:.55. …   <- comentario histórico
contact/form.css:226:              .submit:disabled{opacity:.55;cursor:not-allowed;}   <- otra regla, viva
leadership-framework/index.html:750: border-radius:50%;background:var(--accent);opacity:.55;   <- punto de .chain li::before
```

Cero coincidencias en reglas de numerales. Las tres que quedan no tienen nada
que ver con el menú y se dejan a propósito. El criterio del parte ("cero
coincidencias en `*.html`") no puede cumplirse sin borrar el punto decorativo de
la cadena en `leadership-framework`, que es diseño vivo.

Probablemente de ahí venía el "36" del §5.1: un grep de `opacity:.55` en HTML
devuelve 36 líneas (35 numerales más ese punto). Que fueran 36 *copias* es
cierto por otro motivo (35 más `form.css`). En `edcef42` ya eran 35 HTML; no se
borró ninguna página entre medias.

---

## 3. Compromisos

- **El PDF cambia de aspecto por un motivo distinto del que daba el parte**
  (§1.2). Se hizo porque el parte pedía exactamente ese cambio de token y porque
  sí arregla un fallo de AA real en `/cv/`. Se puede revertir en un commit.
- **`/nav.css` no se tocó.** Su comentario sigue diciendo que la declaración
  "está copiada 36 veces". Sigue siendo cierto para la regla, que conserva
  tamaño, color y transición en cada copia, pero ya no para la opacidad. No se
  editó porque es el fichero canónico y el parte no lo pedía.
- **Chrome del sistema en lugar del de Puppeteer.** La versión es más nueva
  (156 frente a 153). El render sale idéntico en maquetación, pero el PDF ya no
  lo produce exactamente el binario fijado en `package-lock.json`.

## 4. Pendientes

1. `npm run cv` no funciona en esta máquina sin `npm run cv:setup`, o sin
   `PUPPETEER_EXECUTABLE_PATH`. Conviene correr `cv:setup` una vez.
2. Espejo de Motion: no aplica a ninguno de los dos fixes, tal como anticipaba el
   parte. Una salvedad: si Motion tiene su propia copia de `contact/form.css`
   con el mismo `.55`, también está muerta allí. Es cosmético y no urge.

## 5. Cómo repetir las comprobaciones

```
export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
node .reports/2026-10-30-batch-cleanup-3/verify-cv-muted.js              # desde la raíz del repo
python3 -m http.server 8765 &                                            # para el probe de numerales
git show --name-only --format= 19cf0c7 | grep '\.html$' > /tmp/pages.txt
printf 'contact/index.html\nde/contact/index.html\nes/contact/index.html\n' >> /tmp/pages.txt
node .reports/2026-10-30-batch-cleanup-3/verify-num-opacity.js /tmp/pages.txt
```

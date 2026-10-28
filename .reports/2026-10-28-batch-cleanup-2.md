# Lote de limpieza #2 — CTA secundario en 404, contraste del pie del menú, z-index del banner

**Fecha:** 2026-10-28
**Rama:** `main`
**Commits:** `fc719a7`, `adf8143`, `2806b98` (sobre `f9cff09`)
**Evidencia:** `.reports/2026-10-28-batch-cleanup-2/`

Tres arreglos independientes, tres commits. Dos tocan código y uno es solo
comentario. Todo lo que sigue está medido en Chromium contra las páginas
servidas, no leído del CSS.

---

## Resumen

| # | Qué | Ficheros | Commit | Estado |
|---|---|---|---|---|
| 1 | CTA secundario a `/about/#cv` en los tres 404 | `404.html`, `de/404.html`, `es/404.html` | `fc719a7` | Hecho |
| 2 | `.mobile-menu-foot` a AA | `nav.css` | `adf8143` | Hecho |
| 3 | Documentar el z-index del banner de consentimiento | `nav.css` | `2806b98` | Hecho (solo comentario) |

Dos cosas que se desvían del parte, las dos explicadas abajo y ninguna
silenciosa: el destino del CTA es el `/about/` **de cada idioma** (§1.2), y el
enlace nuevo llevaba una zona de toque de 19px que hubo que ampliar (§1.4).

Una incidencia **preexistente** que el Fix 2 destapa y no arregla: `/cv/` sigue
sin llegar a AA por su propio `--muted`, no por esta regla (§2.4). No se sirve
en producción.

---

## 1. Fix 1 — CTA secundario en los 404

### 1.1 Antes / después

`52de2ff` quitó el bloque de descarga del CV del cuerpo de los 404 y los dejó
con un solo CTA. Se revierte a medias: vuelve la vía de recuperación, pero como
**enlace** a la sección del CV en `/about/`, no como descarga.

**Antes** — un solo CTA:

```html
<div class="actions">
  <a href="/" class="btn btn-primary">Back to portfolio <span>&rarr;</span></a>
</div>
```

**Después** — dos:

```html
<div class="actions">
  <a href="/" class="btn btn-primary">Back to portfolio <span>&rarr;</span></a>
  <span class="hub-cta-secondary"><a href="/about/#cv">View my CV <span aria-hidden="true">&rarr;</span></a></span>
</div>
```

Etiquetas y destinos por idioma:

| Página | Etiqueta | Destino |
|---|---|---|
| `404.html` | View my CV → | `/about/#cv` |
| `de/404.html` | Zu meinem Lebenslauf → | `/de/about/#cv` |
| `es/404.html` | Ver mi CV → | `/es/about/#cv` |

### 1.2 Desviación del parte: el destino es el `/about/` de cada idioma

El parte pedía `/about/#cv` en los tres ficheros, literal. Se usa el `/about/`
**de cada idioma**. El motivo es que el CTA primario de cada 404 ya apunta a su
raíz de idioma (`/`, `/de/`, `/es/`), y el resto de la página alemana enlaza a
`/de/about/`: mandar a un visitante alemán al `/about/` inglés rompe el idioma a
mitad de la recuperación, que es justo lo que el CTA viene a arreglar. Se
entiende que `/about/#cv` en el parte era taquigrafía de "la sección del CV de
la página About", no una ruta literal para los tres.

Si la intención era de verdad el inglés en los tres, es una línea por fichero y
se revierte.

### 1.3 El patrón visual: `.hub-cta-secondary`, copiado byte a byte

Las tres reglas salen de `/about/` sin tocar un carácter:

```css
.hub-cta-secondary{font-size:14.5px;color:var(--muted);}
.hub-cta-secondary a{color:var(--muted);border-bottom:1px solid rgba(16,185,129,.3);padding-bottom:1px;transition:color .2s ease,border-color .2s ease;}
.hub-cta-secondary a:hover{color:var(--accent);border-bottom-color:var(--accent);}
```

Es texto con subrayado, **no una segunda píldora**: dos píldoras juntas compiten
y la jerarquía la tiene que marcar la forma, no el color.

`.actions` tuvo que acompañar. Era `display:flex;flex-wrap:wrap;gap:12px`, sin
`align-items`, así que el `stretch` por defecto estiraba el enlace de texto a la
altura de la píldora y lo dejaba descolgado. Pasa a `align-items:center` con el
gap `14px 22px` de `.hub-cta-row`, que es la fila de la que sale el patrón:

```css
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px}
```

Medido: los centros de los dos CTA quedan a **1.0px** en los tres idiomas a
1280px.

Contraste del enlace nuevo, por si acaso: `--muted` `#B4B4BB` sobre `--bg`
`#0B0B0D` da **9.54:1**, y en hover `--accent` `#10B981` da **7.75:1**. Los dos
muy por encima de AA.

### 1.4 Desviación: la zona de toque estaba en 19px

Esto no estaba en el parte y salió al medir. El enlace de texto renderiza a
**19px de alto**. WCAG 2.5.8 (AA) pide 24×24, y la convención de la casa —el
bloque `AREAS TACTILES` que llevan todas estas páginas— pide 44×44 y cita
iOS HIG. Un CTA de 19px al lado de una píldora de 45px no pasa ninguno de los
dos.

Se amplía con el mismo truco que el bloque ya documenta para el cursor del hero
—un pseudoelemento que extiende el área sin tocar el tamaño visible— y no con
`min-height` + `inline-flex`, que separaría el `border-bottom` de la línea base
y rompería el subrayado, que es precisamente lo que marca que esto es un enlace:

```css
.hub-cta-secondary a{position:relative;}
.hub-cta-secondary a::after{content:"";position:absolute;left:0;right:0;
  top:50%;transform:translateY(-50%);height:44px;}
```

Solo crece a lo alto: `left`/`right` a 0 lo dejan en el ancho del enlace, así que
no invade la píldora que tiene al lado —comprobado, sin solape en los tres
idiomas.

En `/about/` el mismo patrón va **dentro de una frase** ("…or _view the profile
on LinkedIn_") y no lleva esto. Ahí un bloque de 44px en mitad de un párrafo
sería peor que el problema, así que se deja. Aquí es un CTA suelto y sí le toca.

### 1.5 Verificación

`.reports/2026-10-28-batch-cleanup-2/verify-404-cta.js` y
`verify-mobile-layout.js`. Chromium, servidor local sirviendo el repo, EN/DE/ES,
1280×900 y 390×844.

**Lo crítico —que el CTA no descargue— se comprueba pulsándolo**, no leyendo el
HTML: se escucha `content-disposition: attachment` en todas las respuestas
mientras se hace click.

```
=== 404 EN / DE / ES ===
PASS  2 CTAs in main .actions
PASS  secondary href = /about/#cv  ·  /de/about/#cv  ·  /es/about/#cv
PASS  label = "View my CV" · "Zu meinem Lebenslauf" · "Ver mi CV"
PASS  secondary has NO download attribute          (critico)
PASS  no CTA in .actions downloads
PASS  no CTA points at a PDF
PASS  desktop: CTAs share a row, centers aligned (D1.0px)
PASS  navigated to /about/#cv
PASS  target #cv section exists on the about page
PASS  landed scrolled at #cv (top offset < 120px)
PASS  NO download was triggered by the click       (critico)
PASS  mobile: no horizontal overflow (390 <= 390)
PASS  secondary CTA tap area height >= 44px (44px, text box 19px)
PASS  tap area does not overlap the primary pill
```

Layout a 390px, con el banner de consentimiento ya resuelto:

| Idioma | Disposición | Caja del secundario |
|---|---|---|
| EN | misma fila | x=220 w=100 |
| DE | apilado (la etiqueta es más larga y envuelve) | x=20 w=173 |
| ES | misma fila | x=237 w=85 |

Las tres sin desbordamiento horizontal y con el CTA entero por encima del
pliegue. El `flex-wrap` hace lo que tiene que hacer en DE.

Capturas: `404-{en,de,es}-desktop.png`, `404-{en,de}-mobile.png`.

**Nota sobre las capturas de móvil:** las de primera visita salen con el banner
de consentimiento tapando el tercio inferior, y ahí el CTA secundario no se ve.
Es el banner, no el layout —es `position:fixed` al fondo y tapa contenido en
cualquier página, venía de antes y es lo mismo que describe el Fix 3. Las
capturas que se adjuntan son con la decisión de cookies ya tomada, que es como
lo ve todo el mundo menos en la primera visita.

---

## 2. Fix 2 — `.mobile-menu-foot` a WCAG AA

### 2.1 Antes / después

El pie del overlay ("Berlin · EMEA") era la última cosa del menú móvil por
debajo de 4.5:1. Misma patología que los numerales de `edcef42`, mismo
componente, y la declaración está copiada las mismas **36 veces** (35 páginas en
su `<style>` más `/contact/form.css` para las tres de contacto).

```
antes:   color:var(--muted); opacity:.6   ->  4.02:1  FAIL
despues: color:var(--muted); opacity:.72  ->  5.36:1  PASS
```

Una línea en `nav.css`, al lado de la del numeral:

```css
.mobile-menu-foot{opacity:.72;}
```

### 2.2 Las cifras

Texto de 10.5px, así que no le vale el 3:1 de texto grande: el umbral es 4.5:1.

| opacity | efectivo | sobre `#09090B` | sobre `#0B0B0D` | |
|---|---|---|---|---|
| `.6` | `#707075` | 4.04:1 FAIL | 3.99:1 FAIL | ← lo que había |
| `.65` | `#78787D` | 4.53:1 | 4.54:1 | justo, sin margen |
| **`.72`** | **`#85858A`** | **5.35:1** | **5.36:1** | ← esto |
| `.75` | `#8A8A90` | 5.72:1 | 5.73:1 | |

Dos fondos porque el overlay diverge en cuatro páginas (§6.3 del parte
anterior): 32 usan `rgba(9,9,11,.97)` sobre `--bg`, que compone a `#09090B`, y
los tres 404 más `/cv/` usan `var(--bg)` opaco, `#0B0B0D`. **Pasa AA en los
dos**, y de ahí que el valor del parte (~5.36:1) salga exacto en los 404 y
5.35:1 en el resto. La diferencia es de redondeo del compuesto, no de criterio.

`.72` y no `.65` por lo mismo que el numeral: margen si `--muted` o el fondo se
mueven. Es **el mismo valor que el numeral**, y eso es intencionado —son los dos
texto de referencia del mismo componente y al mismo tamaño; que compartan número
es lo que impide que vuelvan a derivar por separado.

### 2.3 Por qué en `nav.css` y por qué gana

Por lo mismo que el numeral: con 4.5:1 de por medio no sirve arreglar una página
de 36. La regla tiene especificidad **(0,1,0)**, igual que la declaración de cada
página, así que gana **por orden** —y eso hay que comprobarlo, no suponerlo.

Se comprobó en las 38 páginas que montan el overlay: `nav.css` es la última hoja
del `<head>` en todas, y no hay ningún `<style>` por debajo de ella. Incluidas
las tres de contacto, donde `/contact/form.css` carga en la línea 26 y `nav.css`
en la 42 —form.css pierde, que es lo que hace falta.

### 2.4 Verificación — las 38 páginas, una por una

`.reports/2026-10-28-batch-cleanup-2/verify-foot-contrast.js`. Lee `color`,
`opacity` y el fondo computados del DOM con el menú montado y compone a mano.

```
35 páginas con .mobile-menu-foot en su <style>:
  PASS  5.35:1  op=0.72  bg #09090B -> #84848A   (32 páginas)
  PASS  5.36:1  op=0.72  bg #0B0B0D -> #85858A   /404.html, /de/404.html, /es/404.html
  FAIL  3.44:1  op=0.72  bg #0B0B0D -> #66666B   /cv/

3 páginas de contacto (declaración en form.css):
  PASS  5.35:1  op=0.72  bg #09090B -> #84848A   /contact/, /de/contact/, /es/contact/
```

**37 de 38 pasan.** Los numerales siguen en `.72` —no hay regresión de `edcef42`.

### 2.4bis `/cv/` no llega, y no es por esta regla

`/cv/` aplica la regla (`op=0.72`, se ve en la medición) y aun así se queda en
**3.44:1**. El motivo es suyo: declara `--muted:#8A8A8F` en vez del `#B4B4BB` del
resto del sitio.

```
/cv/  --muted #8A8A8F @ .6   ->  #57575B  =  2.73:1   (antes)
/cv/  --muted #8A8A8F @ .72  ->  #66666B  =  3.44:1   (ahora)
```

Es decir: **venía de antes, mejora, y sigue suspendiendo.** No se toca aquí
porque el arreglo no es la opacidad sino su token de color, que es otra decisión
—y porque `/cv/` está en `.assetsignore` (línea 25) y **no se sirve en
producción**, igual que apuntaba §6.3 del parte anterior. Queda escrito como
pendiente, no como hecho.

Captura del pie ya legible: `overlay-foot-en.png`.

---

## 3. Fix 3 — El banner de consentimiento sobre el overlay (Opción A)

### 3.1 Qué pasa

Con el menú hamburguesa abierto, el banner de consentimiento (Decline / Accept)
se pinta **encima** del overlay pero queda **fuera** de la trampa de foco del
diálogo: se ve y con el teclado no se puede llegar.

No es casualidad, es la pila:

```
20           .nav          <- nav.css
60           .mobile-menu  <- en el <style> de cada pagina (36 copias)
2147483646   .cc-veil      <- consent.js:268
2147483647   .cc-banner    <- consent.js:270
```

Se ve en `overlay-consent-banner-de.png`: el banner tapando el CTA del menú.

### 3.2 Decisión: Opción A, no se toca el código

Confirmada. El razonamiento que se deja escrito en `nav.css`:

- **Es el patrón modal estándar.** Un diálogo abierto retiene el foco hasta que
  se cierra. Que un elemento ajeno quede fuera del anillo es el comportamiento
  correcto, no el bug.
- **Escape lo resuelve en una tecla**, y es la convención universal para cancelar
  un modal. Funciona —`4596243` dejó la trampa de foco con su salida por Escape.
- **Solo muerde en la primera visita**, antes de decidir sobre las cookies.
  Después el banner no existe.
- **Bajar `.cc-banner` por debajo de 60 crea una jerarquía incoherente.** Usa
  z-max a propósito para seguir visible sobre cualquier cosa que pinte una
  página; tocarlo puede esconder otros avisos que dependen de ese mismo techo.

Lo que se escribe también es **por dónde iría el arreglo de verdad si algún día
molesta**, porque es lo que se vuelve a investigar desde cero si no está
apuntado: no es el z-index, es que la trampa de foco de `/nav.js` incluya el
banner mientras exista, o que el menú no se pueda abrir con el banner en
pantalla. Ninguna de las dos entraba en este lote.

### 3.3 Dónde va el comentario

El parte decía "junto a la declaración de `.mobile-menu` z-index en `/nav.css`".
**Esa declaración no está en `nav.css`** —`nav.css` documenta explícitamente que
el menú móvil desplegable es apariencia y vive en cada página, y de hecho
`.mobile-menu{z-index:60}` está en los 36 `<style>`.

Así que el comentario va junto a `.nav{z-index:20}`, que es el único z-index que
esta hoja declara, y documenta **la pila entera** —los tres niveles, con el
fichero y la línea de cada uno. Que es donde se mira cuando algo tapa a algo, y
es la hoja que cargan todas las páginas.

### 3.4 Corrección de referencia

El parte de este lote cita §6.3 del informe del 28-10 para el banner. **Es
§5.4.** §6.3 es otra cosa: la divergencia del fondo del overlay en cuatro
páginas —la que explica el 5.35 contra 5.36 del Fix 2. Las dos acaban citadas en
este informe, así que conviene que no se confundan.

---

## 4. Patrón espejo — lo que Jorge tiene que sincronizar a mano

**Fix 2 toca `/nav.css`, que es espejo del de Motion.** No hay canary ni mirror
automático: se copia a mano byte a byte después del push, el patrón de hoy.

Lo que hay que llevar al repo de Motion:

```css
.mobile-menu-foot{opacity:.72;}
```

**Antes de copiarla, comprobar el fondo del overlay de Motion.** El 5.35/5.36:1
sale de componer `--muted` `#B4B4BB` sobre `#09090B` o `#0B0B0D`. Si Motion usa
otro `--muted` o otro fondo, el número cambia —`/cv/` es exactamente ese caso y
por eso se queda en 3.44:1 con la misma regla. El valor a verificar es `#85858A`
sobre el fondo real de su overlay.

El Fix 3 es solo comentario y **puede** llevarse si su `nav.css` tiene la misma
estructura, pero no arregla nada: es documentación. El Fix 1 es solo de este
portfolio —Motion no tiene estos 404.

Sigue abierto de antes, sin tocar en este lote:

- §6.1 del parte anterior: la IIFE del foco y `.mobile-menu-links a .num{opacity:.72}`
  siguen sin llevarse a Motion.
- `8bis.3`: `/motion/nav.css` conserva la geometría muerta del CV.

---

## 5. Pendientes que deja este lote

1. **`/cv/` sigue suspendiendo AA** en el pie del overlay (3.44:1) por su
   `--muted:#8A8A8F` propio. No se sirve en producción (`.assetsignore`). El
   arreglo es su token de color, no la opacidad. (§2.4bis)
2. **`/about/` tiene el mismo `.hub-cta-secondary` con zona de toque de 19px.**
   Ahí el enlace va dentro de una frase, así que el pseudoelemento de 44px no es
   la respuesta y se dejó. Si se quiere cerrar, hay que mirarlo como texto
   corrido, no como CTA. (§1.4)
3. **La divergencia del fondo del overlay** (§6.3 del parte anterior) sigue: 32
   páginas con `rgba(9,9,11,.97)` + blur y 4 con `var(--bg)` opaco. No afecta a
   AA en ninguna. Es deriva entre copias del mismo componente —justo lo que
   `nav.css` existe para impedir.
4. **El banner sobre el overlay** queda documentado, no arreglado, por decisión
   (Opción A). Si alguna vez molesta, el camino está escrito en `nav.css`. (§3.2)

---

## 6. Cómo repetir las comprobaciones

Los tres scripts quedan en `.reports/2026-10-28-batch-cleanup-2/`. Levantan un
servidor estático sobre el repo —hace falta, porque las rutas son absolutas
(`/nav.css`, `/about/#cv`) y con `file://` no resuelven— y usan el Puppeteer que
ya está en `node_modules`.

```bash
cd /Users/jorgeaguilar/dev/portfolio
export NODE_PATH=$PWD/node_modules   # los scripts viven fuera de node_modules

node .reports/2026-10-28-batch-cleanup-2/verify-404-cta.js
node .reports/2026-10-28-batch-cleanup-2/verify-mobile-layout.js
node .reports/2026-10-28-batch-cleanup-2/verify-foot-contrast.js $(
  grep -rl "mobile-menu-foot{" --include="*.html" . | grep -v node_modules |
  sed 's|^\./||; s|index\.html$||; s|^|/|' | sort
) /contact/ /de/contact/ /es/contact/
```

Los ratios salen de `color` y `opacity` computados del DOM con la fórmula de
luminancia relativa de WCAG, componiendo el alfa a mano, no muestreando píxeles
—igual que §6.4 del parte anterior, y con la misma salvedad: no cubre el
antialiasing real de un texto de 10.5px en mono. Si quieres el número de una
herramienta externa, el valor a verificar es **`#85858A` sobre `#0B0B0D`**
(404) o **sobre `#09090B`** (el resto).

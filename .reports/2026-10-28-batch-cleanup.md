# Lote de limpieza — foco del menú, contraste de numerales, CV fuera de los 404

**Fecha:** 2026-10-28
**Commits:** `4596243`, `edcef42`, `52de2ff`
**Alcance:** 40 ficheros (38 páginas HTML + `nav.js` + `nav.css`)
**Total:** 179 inserciones, 56 borrados

Tres arreglos independientes, un commit cada uno. Los dos primeros son de
accesibilidad y tocan el menú móvil; el tercero cierra el pendiente §8.1 del
informe de consolidación del CV.

**Lo que conviene leer antes que nada:** el parte describe la infraestructura de
este repo de una forma que no coincide con lo que hay. Nada de eso invalida los
tres arreglos —los tres bugs son reales y están medidos— pero sí cambia dónde
viven y, sobre todo, **invalida la nota del parte sobre el mirror**. Está en §1.

---

## 1. Correcciones al parte

Cuatro discrepancias entre lo que el parte supone y lo que hay en el repo. Las
tres primeras son de nomenclatura y no cambian el resultado; la cuarta sí
importa.

### 1.1 La clase no es `.mobile-menu-numeral`

El parte pide subir `.mobile-menu-numeral`. Esa clase no existe en el repo:

```
$ grep -rc "mobile-menu-numeral" --include="*.html" --include="*.css" .
(cero coincidencias)
```

Los numerales son `<span class="num">` dentro de los enlaces del menú, y la
regla es `.mobile-menu-links a .num`. El arreglo se aplicó sobre esa.

### 1.2 La lógica de la hamburguesa no está en `nav.js`

El parte dice "~15 líneas en el JS del nav (donde viva la lógica del toggle)".
`nav.js` solo trae el auto-ocultar de la barra. El abrir/cerrar del menú está
**inline en el `<script>` de cada una de las 38 páginas**, copiado idéntico 38
veces (comprobado byte a byte: las 38 traen `getElementById('menuClose')` y la
misma línea `      close.focus();`).

Eso convierte "~15 líneas" en "~15 líneas × 38" si se hace donde está. Lo que se
hizo en su lugar está en §2.3.

### 1.3 El precedente citado no existe en este repo

El parte apoya el valor `.72/.75` en el commit `fc87977`, que habría subido
`.viz-id` y `.spine`. En este repo no hay nada de eso:

| Referencia del parte | En el repo |
|---|---|
| commit `fc87977` | no existe (`git log --all` no lo encuentra) |
| `.viz-id` | cero coincidencias en HTML/CSS |
| `.spine` | cero coincidencias en HTML/CSS |

Así que los valores no se heredaron: se midieron aquí de cero (§3.2). La
coincidencia es buena señal —`.72` da 5.36:1 y el parte esperaba 5.35:1— pero el
número de este informe sale de medir, no de copiar.

### 1.4 No hay mirror ni canary en este repo — **esto sí importa**

> "Fix 1 + Fix 2 tocan el nav canónico (compartido con Motion vía mirror). Los
> cambios propagan automáticamente vía el canary de `test_nav_mirror.py`."

En este repo no hay **ningún** fichero `.py`, ni `test_nav_mirror.py`, ni
directorio `motion/`. Es lo mismo que ya constató §8bis.7 del informe del CV:
Motion es una publicación aparte, fuera de este repo.

**Consecuencia práctica: estos cambios no propagan solos.** Si el menú de Motion
tiene el mismo bug de foco y los mismos numerales a `.55`, **sigue teniéndolos**
después de estos tres commits. Hay que llevarlos a mano a su repo. Queda
anotado en §6.1.

---

## 2. Fix 1 — trampa de foco en el diálogo de la hamburguesa

**Commit `4596243`** — 39 ficheros, 152 inserciones, 38 borrados.

### 2.1 Antes

El overlay se anuncia como `role="dialog" aria-modal="true"`, pero el teclado no
cumplía ninguna de las dos promesas. Dos fallos distintos:

**(a) El foco nunca entraba.** `openMenu()` llamaba a `close.focus()` en la misma
vuelta en que añade `.open`. En ese instante el overlay sigue en
`visibility:hidden` —la transición de `.3s` no ha empezado a avanzar— así que el
navegador se come el `focus()` sin avisar.

Sonda a 0/50/350/600ms sobre `HEAD` (33bcfc6), Chrome headless 390×844,
preguntando si `#mobileMenu` contiene a `document.activeElement`:

```
### BEFORE (HEAD 33bcfc6)
/              0ms:OUT  50ms:OUT  350ms:OUT  600ms:OUT
/about/        0ms:OUT  50ms:OUT  350ms:OUT  600ms:OUT
/404.html      0ms:OUT  50ms:OUT  350ms:OUT  600ms:OUT
/de/           0ms:OUT  50ms:OUT  350ms:OUT  600ms:OUT
/es/404.html   0ms:OUT  50ms:OUT  350ms:OUT  600ms:OUT
```

Fuera del diálogo en las cuatro marcas y en las cinco páginas. El foco se queda
en la hamburguesa, detrás del overlay.

**(b) Nada retenía el Tab.** Con 12 elementos enfocables en el overlay, el tab 13
salía a la página de debajo, que está tapada y no se puede ver:

```
### BEFORE (HEAD 33bcfc6) — Tab containment
/              ring=12  ESCAPED on tab #13 -> .hero-cursor ""
/about/        ring=12  ESCAPED on tab #13 -> summary "On this page"
/404.html      ring=12  ESCAPED on tab #13 -> .btn "Back to portfolio →"
/de/           ring=12  ESCAPED on tab #13 -> .hero-cursor ""
/es/404.html   ring=12  ESCAPED on tab #13 -> .btn "Volver al portafolio →"
```

**Lo que sí funcionaba:** Escape. El handler de cada página ya hace
`closeMenu(true)`, que cierra y devuelve el foco a la hamburguesa. El punto 3 del
parte ("Escape: cerrar + devolver foco") ya estaba cumplido, así que **no se
tocó**; solo se verificó (§2.4).

### 2.2 Después

```
### AFTER
/              0ms:OUT  50ms:IN   350ms:IN   600ms:IN
/about/        0ms:OUT  50ms:IN   350ms:IN   600ms:IN
/404.html      0ms:OUT  50ms:IN   350ms:IN   600ms:IN
/de/           0ms:OUT  50ms:IN   350ms:IN   600ms:IN
/es/404.html   0ms:OUT  50ms:IN   350ms:IN   600ms:IN

### AFTER — Tab containment
/              ring=12  contained for all 24 tabs
/about/        ring=12  contained for all 24 tabs
/404.html      ring=12  contained for all 24 tabs
/de/           ring=12  contained for all 24 tabs
/es/404.html   ring=12  contained for all 24 tabs
```

El foco entra a los ~50ms, no a los ~350ms: ver §2.3.

### 2.3 Dónde vive y por qué

El arreglo está en **`/nav.js`**, que ya cargan las 38 páginas, en una IIFE nueva
independiente de la del auto-ocultar. No en las 38 copias inline.

De las páginas solo se quitó la línea muerta, con un comentario que dice dónde
mirar — un borrado idéntico por fichero:

```diff
       document.body.classList.add('menu-open');
-      close.focus();
+      // Focus enters the dialog from /nav.js, once the overlay transition ends.
```

Se quita y no se deja: no hacía nada y hacía creer que el foco estaba resuelto,
que es justo lo que impidió ver el bug hasta ahora.

**Cómo entra el foco — y el intento que falló.** La primera versión hacía lo que
pide el parte al pie de la letra: esperar a `transitionend`, con un temporizador
leído del CSS computado como respaldo. **Pasó las pruebas normales y falló con
`prefers-reduced-motion`**, que es como se descubrió:

```
### prefers-reduced-motion: reduce   (primera versión, con transitionend)
/              transition=1e-05s  focus-entered=true   PASS
/about/        transition=1e-05s  focus-entered=false  FAIL
/404.html      transition=1e-05s  focus-entered=true   PASS
/de/404.html   transition=1e-05s  focus-entered=false  FAIL
```

Con `prefers-reduced-motion` la hoja baja la transición a `.01ms`:
`transitionend` llega **antes** de que `visibility` haya resuelto, el `focus()`
se pierde exactamente igual que en el bug original, y como el handler cancelaba
su propio respaldo al primer intento, no había segunda oportunidad. Carrera pura:
fallaba en dos páginas y pasaba en otras dos, sin patrón estable.

La versión final no pide el foco una vez a ver si cuela: **reintenta fotograma a
fotograma comprobando `document.activeElement` hasta que entra de verdad**, con
el plazo tomado de la duración leída del CSS. Comprobar si el foco está donde se
pidió es la única señal que no miente, y de paso entra en el primer fotograma
posible (~50ms) en vez de al final de la animación (~350ms).

Tres detalles del diseño, comentados en el fichero:

- **Se observa la clase `.open` con `MutationObserver`**, no el click de la
  hamburguesa: el estado abierto es `.open` y así da igual quién lo haya puesto.
- **Si el foco ya está dentro, no se toca.** Puede haberlo movido quien navega
  durante la transición; devolvérselo al botón de cerrar sería peor que el bug.
- **Escape sigue en las páginas.** Duplicarlo aquí sería un segundo handler
  haciendo lo mismo.

### 2.4 Verificación

Chrome headless 390×844 (`node_modules/puppeteer`, el que ya es devDependency),
repo servido en local. Siete páginas × diez comprobaciones:

| Comprobación | Resultado |
|---|---|
| el foco entra en el diálogo, sobre `#menuClose` | 7/7 |
| Tab #1 se queda dentro | 7/7 |
| ciclo Tab completo sin fugas (2× el anillo) | 7/7 |
| el ciclo vuelve a `#menuClose` | 7/7 |
| ciclo Shift+Tab completo sin fugas | 7/7 |
| Shift+Tab desde el primero envuelve al último | 7/7 |
| Tab desde el último envuelve al primero | 7/7 |
| Escape cierra (`.open`, `aria-hidden`, `aria-expanded`, `body.menu-open`) | 7/7 |
| Escape devuelve el foco a `#navToggle` | 7/7 |
| la trampa se suelta al cerrar | 7/7 |

**71/71 en verde, 0 fallos**, en `/`, `/about/`, `/work/`, `/contact/`,
`/404.html`, `/de/` y `/es/404.html`. Repetido dos veces seguidas con el mismo
resultado, porque el bug que se encontró en §2.3 era una carrera.

Con `prefers-reduced-motion: reduce`, tres ejecuciones seguidas:

```
/              transition=1e-05s  focus-entered=true  contained=true  escape-refocus=true  PASS
/about/        transition=1e-05s  focus-entered=true  contained=true  escape-refocus=true  PASS
/404.html      transition=1e-05s  focus-entered=true  contained=true  escape-refocus=true  PASS
/de/404.html   transition=1e-05s  focus-entered=true  contained=true  escape-refocus=true  PASS
```

El anillo que recorre la trampa, para que quede escrito cuál es:

```
a:Jorge Aguilar -> #menuClose -> Home01 -> Work02 -> About03 -> Motion04
  -> Framework05 -> Contact06 -> EN -> DE -> ES -> Get in touch
```

Doce elementos. El primero es la marca de `.mobile-menu-head`, no el botón de
cerrar: el foco entra en `#menuClose`, que es el **segundo**. Por eso un
Shift+Tab desde la posición inicial es un paso atrás normal (a la marca) y no un
envoltorio — se verifica el envoltorio aparcando el foco en el primero a
propósito.

---

## 3. Fix 2 — contraste de los numerales a WCAG AA

**Commit `edcef42`** — `nav.css`, 27 inserciones, ningún borrado.

### 3.1 Antes

Los numerales (01, 02, 03…) iban en `color:var(--muted)` con `opacity:.55`.
Sobre el fondo del overlay eso deja **3.54:1**, que suspende AA de texto normal
(4.5:1). Son texto de 10px, así que no les vale el 3:1 de texto grande.

El 3.54:1 coincide exactamente con el del parte.

### 3.2 Ratios medidos

Fondo del overlay: `rgba(9,9,11,.97)` compuesto sobre `--bg #0B0B0D` = **#09090B**.
Texto: `--muted #B4B4BB`.

| opacity | color efectivo | ratio | AA (4.5:1) |
|---|---|---|---|
| **.55** | `#67676C` | **3.54:1** | ✗ — lo que había |
| .60 | `#707075` | 4.02:1 | ✗ |
| .65 | `#78787D` | 4.54:1 | ✓ justo, sin margen |
| .70 | `#818186` | 5.11:1 | ✓ |
| **.72** | `#84848A` | **5.36:1** | ✓ — **elegido** |
| .75 | `#89898F` | 5.74:1 | ✓ |
| .80 | `#929298` | 6.41:1 | ✓ |
| 1.00 | `#B4B4BB` | 9.65:1 | ✓ |

**Se eligió `.72`**, el extremo bajo del `.72/.75` del parte:

- `.65` cumple por 0.04 y cualquier retoque de `--muted` o del fondo lo tumba.
- Por encima de `.75` el numeral empieza a competir con su propia etiqueta
  (`--fg`, 18.58:1). Es una referencia, no contenido: tiene que quedar por
  debajo.

### 3.3 Antes/después por página

Medido en Chrome headless 390×844 con el menú abierto, leyendo `color` y
`opacity` computados del DOM:

| Página | antes | después |
|---|---|---|
| `/` | 3.54:1 `#67676C` | **5.36:1** `#84848A` |
| `/about/` | 3.54:1 `#67676C` | **5.36:1** `#84848A` |
| `/work/` | 3.54:1 `#67676C` | **5.36:1** `#84848A` |
| `/contact/` | 3.54:1 `#67676C` | **5.36:1** `#84848A` |
| `/404.html` | 3.54:1 `#68686D` | **5.34:1** `#85858A` |
| `/de/404.html` | 3.54:1 `#68686D` | **5.34:1** `#85858A` |
| `/es/404.html` | 3.54:1 `#68686D` | **5.34:1** `#85858A` |

Los 404 dan 5.34 y no 5.36 porque su overlay es `var(--bg)` opaco en vez del
`rgba(9,9,11,.97)` con desenfoque del resto. Esa divergencia es anterior a este
cambio y no se tocó: va a §6.3.

Los seis numerales de las tres portadas, ya en reposo:

```
  /   overlay bg #09090B
    01  Home01       op 1.00  #10B981  7.84:1  PASS   <- enlace activo
    02  Work02       op 0.72  #84848A  5.36:1  PASS
    03  About03      op 0.72  #84848A  5.36:1  PASS
    04  Motion04     op 0.72  #84848A  5.36:1  PASS
    05  Framework05  op 0.72  #84848A  5.36:1  PASS
    06  Contact06    op 0.72  #84848A  5.36:1  PASS
```

Idéntico en `/de/` y `/es/`. **El numeral del enlace activo sigue en accent a
opacity 1** (7.84:1): la jerarquía no se aplana.

### 3.4 Robustez frente al desenfoque

El overlay lleva `backdrop-filter:blur(16px)` y alpha `.97`, así que un 3% de lo
que haya detrás se cuela. En el peor caso imaginable —el overlay sobre blanco
puro— el ratio baja a **5.25:1**, que sigue pasando AA. El resultado no depende
de qué página haya debajo.

### 3.5 Dónde vive y por qué

En **`/nav.css`**, una sola línea de regla:

```css
.mobile-menu-links a .num{opacity:.72;}
```

La declaración original está copiada **36 veces** (35 páginas en su `<style>` y
`contact/form.css` para las tres de contacto) y con 4.5:1 de por medio no sirve
arreglar una. Es el mismo razonamiento que ya metió en esta hoja el reset del
subrayado (§8bis.3 del informe anterior), y está comentado como tal en el
fichero.

Dos cosas que lo hacen seguro, las dos comprobadas y no supuestas:

- **`/nav.css` es la última hoja del `<head>` en las 38 páginas.** Verificado una
  por una, incluidas las tres de contacto, donde carga después de
  `contact/form.css`. Misma especificidad (0,2,1) y declarada después: gana por
  orden.
- **Hover y enlace activo llevan (0,3,1)**, así que siguen ganando y siguen
  subiendo el numeral a `opacity:1`. Confirmado en §3.3.

**Solo se toca `opacity`.** El color se queda en `--muted`.

---

## 4. Fix 3 — fuera el CTA del CV del cuerpo de los 404

**Commit `52de2ff`** — 3 ficheros, 18 borrados, ninguna inserción.

Cierra el pendiente **§8.1** del informe de consolidación del CV, que lo dejó
explícitamente a decisión tuya ("es una línea por fichero").

### 4.1 Antes y después

| | antes | después |
|---|---|---|
| CTAs en `main .actions` | 2 | **1** |
| enlaces a `Jorge_Aguilar_CV.pdf` | 1 | **0** |
| reglas `.btn-secondary` | sí | **0** |

```
### BEFORE
/404.html     390px  CTAs=2  "Back to portfolio →" -> /     ; "Download CV ↓" -> /Jorge_Aguilar_CV.pdf
/de/404.html  390px  CTAs=2  "Zurück zum Portfolio →" -> /de/ ; "Lebenslauf ↓"  -> /Jorge_Aguilar_CV.pdf
/es/404.html  390px  CTAs=2  "Volver al portafolio →" -> /es/ ; "Currículum ↓"  -> /Jorge_Aguilar_CV.pdf

### AFTER
/404.html     390px  PASS  CTAs=1  CV-links=0  .btn-secondary=false  hscroll=false  "Back to portfolio →" -> / [btn btn-primary] 178x45
/de/404.html  390px  PASS  CTAs=1  CV-links=0  .btn-secondary=false  hscroll=false  "Zurück zum Portfolio →" -> /de/ [btn btn-primary] 208x45
/es/404.html  390px  PASS  CTAs=1  CV-links=0  .btn-secondary=false  hscroll=false  "Volver al portafolio →" -> /es/ [btn btn-primary] 195x45
```

Idéntico a 1440px. Sin scroll horizontal, el botón restante dibujado con tamaño
real, la barra intacta en los tres.

Y donde el CV sí vive sigue estando: `/about/` conserva su enlace
(`"Download CV ↓"`) y su ancla `#cv`.

### 4.2 Qué más se fue, y qué no

**Se fue con el botón** el `.btn-secondary` de cada 404 (dos reglas, 5 líneas):
era su único uso en esos ficheros. Mismo criterio que `8602a87`, que limpió los
estilos del botón del CV de `/nav.css` al quitarlo.

**No se tocó el FAB de la vCard** (`/jorge-aguilar.vcf`, inyectado por
`vcard.js`), que sigue en las tres. Apareció como falso positivo al auditar
`a[download]`: es una tarjeta de contacto, no el CV, y no entra en la decisión
"CV solo en `/about/`".

---

## 5. Compromisos

### 5.1 El valor por página se queda en `.55`, muerto

Fix 2 añade el override en `/nav.css` y **deja las 36 declaraciones originales a
`.55` donde están**. Quien abra `about/index.html` y lea `opacity:.55` leerá un
valor que ya no pinta nada.

La alternativa era un `sed` sobre los 36 sitios, que es igual de mecánico. Se
descartó porque no consolida nada: el valor seguiría viviendo en 36 sitios y la
próxima deriva volvería a romper AA en silencio. Con el override hay **un** sitio
que decide, y está comentado explicando que gana por orden. Es el mismo
compromiso que ya se aceptó para el reset del subrayado.

### 5.2 Fix 1 deja el abrir/cerrar duplicado 38 veces

Solo se movió el foco. El `openMenu`/`closeMenu`, el click en el fondo, el
Escape y el guardia de resize siguen copiados en las 38 páginas. Mover todo eso a
`/nav.js` es la consolidación completa y es claramente lo siguiente, pero es un
refactor de otro tamaño y no lo que pedía el parte.

Efecto secundario a tener presente: **el foco del menú depende ahora de que
`/nav.js` cargue**. Si falla, el menú abre y cierra igual pero el teclado se
queda fuera — que es exactamente el estado de antes, no peor.

### 5.3 El 404 se queda con un solo CTA

Quitado el CV, `main .actions` tiene un único botón. Se hizo lo que pedía el
parte ("quitar el bloque, conservar los demás CTAs") y no había más.

Si prefieres dos, lo coherente con la decisión del CV sería apuntar el hueco
secundario a `/about/#cv` en vez de al PDF: mantiene la vía de recuperación que
§8.1 no quería recortar, sin volver a poner la descarga fuera de `/about/`. **No
se hizo porque no se pidió** — es una línea por fichero.

### 5.4 La trampa deja fuera el banner de consentimiento

Con el menú abierto, el banner de consentimiento (Decline / Accept) queda fuera
del anillo y es inalcanzable con teclado — se ve en las capturas, pintado encima
del overlay. No es casualidad: `.cc-banner` va a `z-index:2147483647`
(`consent.js:270`) y el overlay a `z-index:60`, así que el banner gana siempre.

Es el comportamiento correcto de un diálogo modal, y Escape lo resuelve en una
tecla, pero conviene saberlo: **visualmente el banner está delante y con el
teclado no se puede llegar.** Solo afecta a la primera visita, antes de decidir
sobre las cookies. Si molesta, lo que hay que mirar es quién se pinta encima de
quién, no la trampa.

---

## 6. Pendientes conocidos

### 6.1 Motion no recibe nada de esto — hay que llevarlo a mano

Lo de §1.4, repetido aquí porque es lo único de este informe que deja trabajo
abierto fuera del repo. **No hay canary ni mirror**: si el menú de Motion tiene
el mismo `close.focus()` prematuro, el mismo Tab sin retener y los mismos
numerales a `.55`, los sigue teniendo. Lo que hay que llevar a su repo:

- la IIFE del foco al final de su `nav.js` (o donde cargue en todas sus páginas);
- quitar su `close.focus()` inline, si lo tiene;
- la regla `.mobile-menu-links a .num{opacity:.72;}` en su `nav.css` — **después
  de comprobar su fondo**, porque el 5.36:1 sale del `#09090B` de aquí.

Sigue abierto también `8bis.3` del informe anterior (`/motion/nav.css` conserva
la geometría muerta del CV).

### 6.2 `.mobile-menu-foot` también suspende AA

Auditando el overlay entero quedó **un** nodo de texto por debajo de 4.5:1:

```
 4.02:1  10.5px FAIL mobile-menu-foot   "Berlin · EMEA"
```

Es `--muted` a `opacity:.6` — la misma patología que los numerales, en el mismo
componente y copiada las mismas 36 veces. **No entraba en el parte y no se
tocó.** Subirla a `.72` la pondría en 5.36:1 y es una línea en `/nav.css`, igual
que la de §3.5.

Todo lo demás del overlay pasa: los numerales a 5.36:1, el selector de idioma a
9.65:1, las etiquetas a 18.58:1 y el CTA sobre accent a 7.84:1.

### 6.3 El overlay de cuatro páginas diverge del resto

De las 36 declaraciones de `.mobile-menu`, **32 usan**
`background:rgba(9,9,11,0.97)` con `backdrop-filter:blur(16px)` y **4 usan
`background:var(--bg)` opaco**, sin desenfoque:

```
404.html
de/404.html
es/404.html
cv/index.html
```

De ahí el 5.34:1 contra 5.36:1 de §3.3. Es anterior a este cambio y no afecta a
AA en ninguna de las cuatro, pero es deriva entre copias del mismo componente —
justo lo que `nav.css` existe para impedir. (`/cv/` además está en
`.assetsignore` y no se sirve en producción; ver §8.5 del informe del CV.)

### 6.4 Los números salen de Chromium headless

Los ratios de §3 se calculan sobre `color` y `opacity` computados del DOM con la
fórmula de luminancia relativa de WCAG, no muestreando píxeles de una captura.
Para texto plano sobre fondo plano es equivalente, pero no cubre el
antialiasing real: un numeral de 10px en mono pinta subpíxeles más flojos que su
color nominal. Si quieres el número de una herramienta externa, el valor a
verificar es `#84848A` sobre `#09090B`.

---

## 7. Cómo repetir las comprobaciones

Los cuatro scripts de verificación están en el scratchpad de la sesión, no en el
repo. Lo que hace falta para rehacerlos:

```bash
python3 -m http.server 8787        # desde la raíz del repo
# y, para el baseline:
git worktree add /tmp/baseline 33bcfc6
cd /tmp/baseline && python3 -m http.server 8788
```

Y con `node_modules/puppeteer` (ya es devDependency), a 390×844: abrir el menú
con `#navToggle`, y medir
`document.getElementById('mobileMenu').contains(document.activeElement)` para el
foco, o `getComputedStyle` de `.mobile-menu-links a .num` para el contraste.

---

## 8. Qué conviene mirar a mano

Todo lo anterior es Chromium headless. Lo que no cubre:

- **La trampa con un lector de pantalla real** (VoiceOver en iOS, TalkBack).
  `aria-modal="true"` ya estaba y ahora el Tab lo acompaña, pero el rotor de
  VoiceOver no navega por Tab y puede salirse del diálogo igualmente.
- **Safari iOS.** `requestAnimationFrame` durante la transición y el
  `MutationObserver` se probaron en Chromium; el teclado externo en iPad es otro
  camino.
- **Los numerales a ojo en una pantalla real**, en claro y con brillo bajo. 5.36:1
  es el número; que el numeral siga leyéndose como secundario frente a su
  etiqueta es un juicio visual.

---

## Capturas

`.reports/2026-10-28-batch-cleanup/`

| Fichero | Qué |
|---|---|
| `before-menu-numerals-390.png` / `after-…` | menú abierto a 390px; los numerales 01–06, con el 03 activo en accent |
| `before-404-en-390.png` / `after-…` | `/404.html` a 390px, de dos CTAs a uno |
| `before-404-en-1440.png` / `after-…` | lo mismo a 1440px |
| `before-404-de-390.png` / `after-…` | `/de/404.html` a 390px |
| `before-404-es-390.png` / `after-…` | `/es/404.html` a 390px |

# Portfolio P1b — audit remainder (2026-11-02)

Los tres ítems que quedaban del P1 de la auditoría del 30-10. N13
(certificados) se salta: el enlace de Drive actual cumple la función.
Cuatro commits, 20 ficheros en el portfolio y uno en Motion, +570/−222.

| # | Ítem | Commit | Repo |
|---|---|---|---|
| 1 | TL;DR al inicio de cada caso (×15) | `c6997c4` | portfolio |
| 2 | Fila de cifras en el home (N10) | `2435c42` | portfolio |
| 3 | Hover subrayado + `:focus-visible` en el nav | `1652405` | portfolio |
| 3b | Espejo de `nav.css` | `6f7401b` | operations-in-motion |

**Dos premisas del parte no coincidían con el repo** y se pusieron de vuelta
antes de tocar nada. Las dos se decidieron y quedan recogidas en su sección:
la fila de cifras (§2) y el espejo de Motion (§3).

Ninguno de los dos repos está pusheado: Jorge los sube a mano.

---

## 1. TL;DR al inicio de cada caso (N5)

Tres líneas al principio de los cinco casos, en los tres idiomas. El motivo
del ítem es la longitud: `/wolt/` mide 13k px en escritorio y 17.7k en móvil.

### Dónde va

`hero (rail) → tarjeta de cabecera → **TL;DR** → cuerpo del caso`

El parte decía "inmediatamente después del hero, antes del cuerpo". La
tarjeta de cabecera es parte del hero del caso —lleva fecha, rol, sitio, las
tres métricas y el *lede*—, así que el TL;DR va **después** de ella y
**antes** de la primera sección de contenido. Al revés habría metido un
resumen entre el titular y el rol de quien lo firma, que es justamente el
contexto que hace que el resumen se entienda.

Verificado en las 15: lo que sigue al bloque es siempre la primera sección
de cuerpo.

```
bliq           <!-- ============ 01 — THE PROBLEM ============ -->
bolt           <!-- ============ 01 — THE NUMBER ============ -->
wolt           <!-- ============ 01 — THE OFFICE AS SYSTEM ============ -->
alcorte        <!-- ============ AT A GLANCE ============ -->
nexio          <!-- ============ BLOCK 1 — PIPELINE ============ -->
de/bliq        <!-- ============ 01 ============ -->
de/bolt        <!-- ============ 01 — THE NUMBER ============ -->
de/wolt        <!-- ============ 01 ============ -->
de/alcorte     <!-- ============ AT A GLANCE ============ -->
de/nexio       <!-- ============ BLOCK 1 — PIPELINE ============ -->
es/bliq        <!-- ============ 01 ============ -->
es/bolt        <!-- ============ 01 — THE NUMBER ============ -->
es/wolt        <!-- ============ 01 ============ -->
es/alcorte     <!-- ============ AT A GLANCE ============ -->
es/nexio       <!-- ============ BLOCK 1 — PIPELINE ============ -->
```

### Decisiones de extracción del contenido

El parte pedía extraer del propio caso y no inventar ni parafrasear de fuera.
Eso obligó a cinco decisiones concretas, todas en la misma dirección: **donde
la página califica una cifra, el TL;DR la califica igual.** Un resumen que
quita el matiz que el caso pone debajo convierte una atribución honesta en
titular, y es exactamente el cruce que la auditoría dice que hace un lector
senior (§1.2).

**1. Bliq, 4,7× va como "company-level".** La sección 06 del caso lo dice dos
veces —en el `kicker` de la métrica y en el párrafo que la sigue—: *"These are
company-level results across the broader supply-development period"*, con el
EPH como una intervención dentro de esa estrategia. El TL;DR cierra con
`Driver base 4.7× over 12 months, company-level`.

**2. Bliq, las otras dos cifras sí son suyas.** `€3M ARR` y
`retención <50% → >80%` están en la lista *"What I owned"* del caso, no en la
de contribuciones. Van sin matizar. (La auditoría del 30-10 las marcaba como
no respaldadas por el caso; el P0 lo arregló y hoy están en la página.)

**3. Wolt, el resultado es el 30%, no el ~50%.** La página separa las dos:
*"The 30% procurement cost reduction is more directly attributable to the gear
redesign"*, mientras que el ~50% de demanda de soporte *"was not caused
exclusively by the service redesign"* —Wolt metió operadores de flota externos
en el mismo periodo y eso bajó el volumen de visitas por mecánica, no por
diseño—. El TL;DR lleva el 30% con sus dos ventanas de 12 meses y menciona el
~50% con su matiz, en ese orden.

**4. Alcorte y Nexio no tienen métrica cerrada, y no se les inventa una.** El
parte ya lo anticipaba ("no verified metric in the share images"). El
resultado es el estado real:

- **Alcorte** — `Phase 0 closed with the pipeline live in production
  (WhatsApp → Meta → Vercel → Claude → Supabase); Phase A1's operator toolset
  validated against real infrastructure, not mocks.` Sale de *"What shipped"*:
  fase 0 cerrada, fase A1 en curso, y las tres pruebas de validación que la
  página dice explícitamente que corren contra infraestructura real y no
  contra mocks.
- **Nexio** — `800+ drivers monitored across 8 regulated fleet operators, with
  operators reporting 60–70% less administrative time per compliance cycle.`
  Las tres cifras de su tarjeta de cabecera. El "operators report" se conserva
  porque así lo dice la página: es lo que reportan los operadores, no una
  medición propia.

**5. El reto de cada caso es la frase que el caso ya usa para abrirse**, no
una reformulación. Bliq: incentivos que compran activación y nunca permanencia.
Bolt: la activación como una sola cifra semanal sin instrumentación debajo.
Wolt: ~525 interacciones por un único canal sin categorizar, más el equipo de
un solo uso. Nexio: una prueba que no se supera no cuesta multa, cuesta la
concesión. Alcorte: el operador no abrirá nunca un panel.

### Traducciones

Formal en los dos idiomas, como el resto del sitio. La terminología se tomó de
cada página en su idioma, no se tradujo de cero: `Bindung` (no *Retention*),
`Partnerbindung`, `Beschaffungskosten`, `Fahrerbasis`, `Konzession`,
`permanencia` (no *retención*), `Gasto en compra de equipo`, `mensajeros`.

| | Etiquetas | `aria-label` de la sección |
|---|---|---|
| EN | Challenge · What I did · Result | Summary |
| DE | Herausforderung · Was ich getan habe · Ergebnis | Zusammenfassung |
| ES | Reto · Lo que hice · Resultado | Resumen |

`TL;DR` se queda sin traducir en los tres: el parte sólo da traducción de las
tres etiquetas, y la abreviatura se usa igual en los tres idiomas.

Coma decimal en DE/ES (`4,7×`) y punto en EN (`4.7×`).

### Marcado y estilo

`<dl>` con `<dt>`/`<dd>` y no párrafos: cada fila es término → descripción,
que es literalmente lo que es.

El parte describía el formato como `Challenge · <una línea>`, con punto medio.
Se implementa como **rejilla de dos columnas** y sin el separador: con la
etiqueta en línea los inicios de las tres descripciones quedan en bandera
—`Herausforderung` mide 147px de mono frente a los 59px de `Ergebnis`— y se
pierde justo lo que el bloque viene a dar, que es poder escanearlo. Alineadas
en su propia columna, las tres descripciones empiezan en el mismo sitio y el
punto medio sobra.

Estilos en **`/case-tldr.css`** (75 líneas), no en el `<style>` de cada página,
por el mismo motivo que `/case-end.css`: son 15 copias del mismo marcado y la
deriva entre copias es el bug que ya pagó el nav. El `<link>` va justo detrás
del de `case-end.css`, así que las dos hojas compartidas de los casos quedan
juntas.

Acento esmeralda en el borde izquierdo, como `.diff` del home, y por eso la
etiqueta **no** repite la barrita de `.section-label`: el acento se pondría dos
veces en 40px. Es el mismo razonamiento que ya está documentado en el `<style>`
del home para `.diff .section-label::before{display:none}`.

### Compromiso de maquetación

**Alcorte queda con dos resúmenes seguidos**: el TL;DR de 3 líneas y encima de
su propio `At a glance` (Cliente, Rol, Escala, Problema, Enfoque, Stack,
Estado). No es una regresión —el parte dice explícitamente que el TL;DR no
sustituye contenido existente— pero es el único de los cinco casos donde el
bloque cae sobre otro bloque de resumen. Si en una pasada futura hay que
quitar uno, el candidato es `At a glance`: el TL;DR da lo mismo en tres líneas
y el resto de su tabla (Stack, Repositorio) encaja mejor abajo, junto a los
problemas de ingeniería.

### Verificación

15 páginas × 2 anchos en Chrome headless:

```
1440px  2 columnas (etiqueta | texto)   EN 82px · DE 147px · ES 90px de columna
 390px  1 columna, etiqueta encima      corte en 640px
```

| Comprobación | Resultado |
|---|---|
| Páginas con el bloque | 15/15 ✅ |
| Un solo bloque por página | 15/15 ✅ |
| 3 `<dt>` + 3 `<dd>` por bloque | 15/15 ✅ |
| Ninguna descripción vacía | 15/15 ✅ |
| Etiquetas en el idioma de la página | 15/15 ✅ |
| `aria-label` traducido | 15/15 ✅ |
| Colocado antes del cuerpo | 15/15 ✅ |
| Desbordamiento horizontal | 0 en los dos anchos ✅ |
| Errores de JS | 0 ✅ |

---

## 2. Fila de cifras en el home (N10)

### La premisa del parte no coincidía con el repo

El parte pedía **añadir** una franja de 4 cifras. El home ya tenía **dos**:

```
hero → Currently → What I do differently
  → .hero-metrics     800+ · 8 · €3M · 6
  → #impact           60–70%↓ · 30%↓ · >80%↑ · 4.7×↑
  → Selected work (primera tarjeta de caso)
```

Ocho cifras antes de la primera historia, dos repetidas entre bandas y ninguna
enlazada a su caso. Y el N10 de la auditoría no pedía añadir: pedía
**fusionar** —*"Fusionar la franja del hero y 'Selected impact' en una fila de
3–4 cifras verificadas, cada una con enlace a su caso"*—, precisamente porque
*"ocho cifras antes de la primera historia […] la densidad diluye la cifra
fuerte"* (§1.1). Añadir una tercera habría dejado doce y habría empujado la
primera tarjeta de caso más abajo, que es lo que el propio parte pedía evitar.

Puesto de vuelta con las tres opciones medidas; **se eligió fusionar, eliminando
las dos bandas**, con las cuatro cifras del parte y sin Nexio en la fila.

### Después

```
hero → Currently → What I do differently
  → .impact-row   €3M ARR delivered → /bliq/
                  4.7× Driver growth → /bliq/
                  25% → 58% Activation → /bolt/
                  30% Procurement savings → /wolt/
  → Selected work
```

Nexio sale de la fila y se queda en su *case card*. Las cuatro que quedan son
las que tienen un caso detrás que las respalde, que es lo que el enlace
promete: cada cifra lleva debajo el nombre del caso al que va, en mono, para
que el enlace diga a dónde lleva antes de pulsarlo.

**Antes → después, medido** (Chrome headless, posición de `#work` en la página):

| | `#work` antes | después | cifras |
|---|---|---|---|
| `/` 1440px | 2455px | **1860px** (−595) | 8 → 4 |
| `/de/` 1440px | 2522px | **1906px** (−616) | 8 → 4 |
| `/es/` 1440px | 2543px | **1906px** (−637) | 8 → 4 |
| `/` 390px | 2547px | **1952px** (−595) | 8 → 4 |
| `/de/` 390px | 2681px | **2044px** (−637) | 8 → 4 |
| `/es/` 390px | 2663px | **1984px** (−679) | 8 → 4 |

La primera tarjeta de caso sube unos 600px en los seis casos, y la página entera
se acorta otro tanto.

### Dos cosas que se van con la fusión

- **El `h2` genérico.** `#impact` llevaba *"The measurable outcomes of my
  work."*, que la auditoría marcaba como copy genérico y como uno de los seis
  `h2` seguidos con la misma fórmula (§1.1). La fila se queda sólo con su
  `.section-label`, que es la etiqueta que ya usan `Currently` y
  `What I do differently`.
- **El punto decimal de `4.7×` en DE/ES.** Las bandas anteriores lo escribían
  con punto en los tres idiomas; ahora es coma en DE y ES.

### Estilo

Flex, como pedía el parte. Cuatro en fila a escritorio, dos por fila a partir
de 900px, apiladas por debajo de 640px. Separa el aire y no hay reglas
verticales ni puntos —el parte admitía "puntos o espaciado"— porque es lo que
ya hacía la rejilla que esto sustituye, y evita meter un glifo decorativo que
un lector de pantalla anunciaría.

**Sin `.reveal`**, a propósito y según pedía el parte: es una señal de confianza
y tiene que estar en el primer fotograma, también si el JS no carga. De paso
quita 8 elementos de los 149 que la auditoría contaba como invisibles sin JS.

Cada cifra es un enlace entero (`<a class="impact-item">`) con `aria-label`
completo —`"Driver growth 4.7× — Read the Bliq case study"`— porque el texto
visible va partido en tres `<span>` y leído suelto no dice a dónde lleva.

### Verificación

| Comprobación | Resultado |
|---|---|
| Fila presente ×3 idiomas | 3/3 ✅ |
| 4 cifras por fila | 3/3 ✅ |
| 1 fila a 1440px / 2 filas a 900px / 4 apiladas a 390px | ✅ |
| Bandas viejas eliminadas (`.hero-metrics`, `#impact`, `.metric-big`) | 0 nodos en las 3 ✅ |
| CSS muerto eliminado del `<style>` | 16 líneas × 3 ficheros ✅ |
| `#impact` referenciado desde algún sitio | 0 referencias (anclas, sitemap, JS) ✅ |
| Desbordamiento horizontal | 0 en 1440/900/390 ✅ |

**Enlaces por idioma** — el fallo que más cerca estuvo de colarse. El bloque
se generó primero con rutas de raíz, así que `/de/` y `/es/` apuntaban a
`/bliq/`, `/bolt/` y `/wolt/` en inglés. Corregido antes del commit y
verificado:

```
/      → /bliq/     /bliq/     /bolt/     /wolt/      200 200 200 200
/de/   → /de/bliq/  /de/bliq/  /de/bolt/  /de/wolt/   200 200 200 200
/es/   → /es/bliq/  /es/bliq/  /es/bolt/  /es/wolt/   200 200 200 200
```

---

## 3. Hover subrayado + `:focus-visible` en el nav (ítem 1)

Las dos reglas van en `/nav.css` y no en cada página, por el motivo de siempre:
la declaración está repetida en el `<style>` de las 38 y arreglar una deja las
otras treinta y siete como estaban.

### Lo que había

```
$ grep -rl 'class="nav-links"' --include='*.html' .        38 páginas con barra
$ grep -rl 'nav-links a:hover' --include='*.html' .         35 con hover de color
$ grep -rl 'nav[^{]*:focus-visible' --include='*.html' .     0 con foco
```

Tres páginas —`/contact/`, `/de/contact/`, `/es/contact/`— **no tenían ninguna
regla de hover en el nav**, y **ninguna de las 38 tenía regla de foco**: quien
navega con teclado dependía del contorno por defecto del navegador, que sobre
este fondo casi no se ve y cambia según el motor. Las dos cosas se arreglan de
una vez al declararlas aquí.

### Hover

Esmeralda + subrayado, con los mismos 4px de offset que ya lleva el enlace
activo: pasar el ratón por encima enseña exactamente la marca que lleva la
página en la que ya estás. Antes el hover sólo cambiaba el color, y ese cambio
era la única señal — no la ve quien no distingue ese verde del gris.

**El grosor se declara en las DOS reglas**, hover y `aria-current`, y no sólo en
hover. Si va sólo en hover, el subrayado del enlace activo (grosor por defecto
del navegador, que depende de la fuente) cambia de grosor al pasar el ratón por
encima. Mismo valor en ambas = no parpadea.

**Lo que queda fuera del subrayado, y por qué:**

- **Los chips de idioma.** El selector es `.nav-links > a`, hijo directo.
  `.lang-switch` vive *dentro* de `.nav-links`, así que un descendiente
  `.nav-links a` le habría llegado igual que le llegó a la regla de
  `aria-current` — el bug del chip EN subrayado dentro de su pastilla, que ya
  está documentado en la regla de `.lang-switch` de esa misma hoja. Aquí se
  evita por estructura, no con un `:not()`.
- **Los dos CTA** (`.nav-cta`, `.mm-cta`), excluidos a mano: son pastillas con
  relleno y borde, y un subrayado dentro de una pastilla se lee como un error.
  Su hover ya lo resuelve el fondo.
- **La marca.** Es un wordmark, no un enlace de sitio.

Medido con hover real del ratón en `/work/`:

```
target                 color             underline  offset  thickness
site link (About)      rgb(16,185,129)   underline  4px     1px   ✅
active link (Work)     rgb(16,185,129)   underline  4px     1px   ✅
lang chip DE           rgb(239,239,240)  none       auto    auto  ✅ sin subrayar
nav CTA                rgb(9,9,11)       none       auto    auto  ✅ sin subrayar
brand                  rgb(247,247,248)  none       auto    auto  ✅ sin subrayar

enlace activo SIN hover: underline off:4px th:1px     ✅ no cambia de grosor
```

### `:focus-visible`

Anillo de 2px esmeralda con 2px de separación, a **todo** lo enfocable de la
barra y del overlay: marca, enlaces de sitio, chips de idioma, CTA, hamburguesa
y botón de cerrar. Un foco que se ve en cuatro de seis paradas del tabulador es
peor que ninguno: entrena a perder el cursor justo donde no aparece.

2px de separación y no los 3px que usa el resto del sitio porque la fila es
estrecha —60px de alto, y los enlaces bajan a 16px de gap en el corte de
1000px—: con 3px los anillos de dos enlaces contiguos llegan a tocarse. Y
`outline`, no `border` ni `box-shadow`, para que nada de lo que esta hoja
protege —dónde se dibuja la barra y cuánto mide— se mueva al recibir el foco.

**Recorrido real con el tabulador** (no `.focus()` programático: en los
`<button>` Chrome no aplica `:focus-visible` sin interacción de teclado, y la
hamburguesa es un `<button>`).

```
/ @1440px                          /es/ @390px
 1. a  .skip-link   (anillo propio)  1. a  .skip-link   (anillo propio)
 2. a  .nav-brand   ✓                2. a  .nav-brand   ✓
 3. a  Home         ✓                3. button .nav-toggle ✓
 4. a  Work         ✓
 5. a  About        ✓               /es/ @390px, overlay abierto
 6. a  Motion       ✓                1-6.  Home…Contact  ✓ ✓ ✓ ✓ ✓ ✓
 7. a  Framework    ✓                7-9.  EN DE ES      ✓ ✓ ✓
 8. a  EN           ✓                 10.  .mm-cta       ✓
 9. a  DE           ✓                 11.  .nav-brand    ✓
10. a  ES           ✓                 12.  button .mobile-menu-close ✓
11. a  .nav-cta     ✓
```

12/12 paradas del overlay y 11/11 de la barra de escritorio, con el foco
atrapado dentro del overlay (la trampa del lote #1 sigue funcionando).
Comprobado también en `/de/bliq/`, `/de/wolt/` y las tres de `/contact/`.

El `.skip-link` conserva su propio anillo blanco: va sobre fondo esmeralda, y
ahí el blanco es el contraste correcto. Es deliberado, no una excepción
olvidada.

### El espejo de Motion — la otra premisa que no coincidía

El parte decía que Motion ya no tiene `/nav.css` canónico y que este cambio no
necesitaba sincronización. **Sí lo tiene.** Puesto de vuelta antes de tocar
nada, con lo que hay:

```
$ ls ~/dev/operations-in-motion/site/nav.css                    existe
$ grep -rn 'nav.css' ~/dev/operations-in-motion/site/
  templates/shell.html:18  <link rel="stylesheet" href="/motion/nav.css">
  templates/shell.html:16  "Es un espejo byte a byte de jorgeag.com/nav.css
                            y no se edita aqui; scripts/test_nav_mirror.py"
```

Hay un test, `scripts/test_nav_mirror.py`, que comprueba cuatro cosas, la
primera de ellas que `site/nav.css` sea byte a byte el `/nav.css` que sirve
jorgeag.com. **Y el espejo ya estaba desfasado antes de esta sesión**, por el
bloque `.skip-link` del commit `7ba8965` del portfolio, que nunca se espejó:

```
$ diff motion/site/nav.css portfolio/nav.css      (antes del P1b)
  44   comentario de z-index: "el unico" vs "dos (.nav y .skip-link)"
  49 + fila de .skip-link en la tabla de z-index
 199 + el bloque .skip-link entero (19 líneas)
```

**Se eligió sincronizar con commit propio en Motion.** `portfolio/nav.css`
copiado entero sobre `motion/site/nav.css`, lo que resuelve las dos deltas de
una vez —el `.skip-link` pendiente y el hover/foco de hoy—. Verificado byte a
byte:

```
$ cmp motion/site/nav.css portfolio/nav.css
✓ idénticos
```

**Pendiente, y deliberadamente fuera de alcance:** el CSS del `.skip-link`
queda **inerte** en Motion. No hay ningún elemento `.skip-link` ni
`<main id="main" tabindex="-1">` en `site/templates/`, así que las reglas no
tienen sujeto. Son inofensivas —no pintan nada sin su marcado— y se espejan
igual, porque lo que este fichero no puede tener es una copia que derive en
silencio. **Añadir el marcado del skip link a las plantillas de Motion queda
para una sesión futura** (ampliación de alcance a Motion); hasta entonces
Motion no tiene skip link funcional, igual que antes de este commit.

**Estado del test.** `python3 scripts/test_nav_mirror.py` sigue en **rojo**, y
tiene que seguirlo: compara contra el `/nav.css` **vivo** de jorgeag.com, y
ahora el espejo va por delante del despliegue. Pasa a verde cuando Jorge
pushee el portfolio y Cloudflare sirva el nav.css nuevo.

Comprobado que el sync **no introduce ningún fallo nuevo** — salida idéntica
antes y después:

```
                                              antes   después
corte de la hamburguesa (900px)               warn*   warn*     (preexistente)
fila de 44px en style.css                     pass    pass
orden del <head> (nav.css tras style.css)     pass    pass
bytes contra jorgeag.com/nav.css vivo         FAIL    FAIL      (hasta desplegar)

* "no se encuentra el corte en nav.js guardia de resize" — aviso preexistente,
  ajeno a este cambio.
```

---

## Barrido de regresión

38 páginas × 2 anchos (1440 y 390), cada una cargada en Chrome headless y
comprobada por estado, errores de JS, peticiones fallidas, desbordamiento
horizontal, imágenes rotas y restos de las bandas eliminadas.

```
1440px   38/38 limpias
 390px   37/38 limpias
```

Dos cosas filtradas, las dos preexistentes y ajenas al P1b:

- **Turnstile `110200`** en las tres `/contact/`. Sólo en localhost; ya venía
  filtrado en el parte del P1a por el mismo motivo.
- **`/cv/` desborda 404px a 390px.** Comprobado que es anterior al P1b: con el
  `nav.css` de antes del cambio desborda exactamente igual. Es el `div.sheet`,
  una hoja A4 de ancho fijo (`right=794px` sobre un viewport de 390), no algo
  que toquen estos tres ítems. Queda anotado; `/cv/` no estaba en el alcance.

`/impressum/` intacto, verificado contra el diff completo:

```
$ git diff c6997c4~1..HEAD --name-only | grep -i impressum
(sin resultados)
```

---

## Después del push

**No hace falta refrescar ninguna vista previa social.** El parte lo dejaba
condicionado a "si el TL;DR afecta a las meta descripciones". No las afecta:
las meta están escritas a mano en cada página, no se derivan del contenido, y
el diff completo del P1b no toca ni una.

```
$ git diff c6997c4~1..HEAD -- '*.html' \
    | grep -E '^[+-].*(og:description|name="description"|og:title|twitter:description|twitter:title|og:image|<title>)'
(sin salida)
```

Ni título, ni descripción, ni `og:image` cambian en ninguna de las 20 páginas
tocadas. El home tampoco, como ya anticipaba el parte.

**Lo que sí hay que hacer al desplegar:** pushear **los dos repos**. El test
del espejo de Motion queda en rojo hasta que jorgeag.com sirva el `nav.css`
nuevo, así que conviene que el portfolio vaya primero o a la vez.

| Repo | Commits a pushear |
|---|---|
| `portfolio` | `c6997c4`, `2435c42`, `1652405` |
| `operations-in-motion` | `6f7401b` |

---

## Pendientes que deja esta sesión

- **Marcado del skip link en Motion** (§3). El CSS ya está espejado e inerte;
  faltan el elemento y el `<main id="main" tabindex="-1">` en
  `site/templates/`. Es ampliación de alcance a Motion.
- **`At a glance` de Alcorte** (§1). Ahora hay dos resúmenes seguidos en esa
  página. Candidato a recorte en una pasada futura.
- **`/cv/` a 390px** desborda 404px, de antes del P1b.
- **N13, certificados en el sitio**, saltado por decisión: el enlace de Drive
  cumple la función.

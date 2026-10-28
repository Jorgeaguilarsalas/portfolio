# CV — fuera de la barra, consolidado en `/about/`

**Fecha:** 2026-10-28
**Commits:** `1e85f53`, `8c06682`, `8602a87`
**Alcance:** 40 ficheros (38 páginas HTML + `nav.css` + `contact/form.css`)
**Total:** 93 inserciones, 250 borrados

La barra canónica llevaba un botón de descarga del CV a la derecha, entre el
selector de idioma y el CTA de contacto, y el menú móvil llevaba el mismo enlace
al pie. Los dos se van. El CV se descarga desde `/about/#cv` y desde ningún otro
punto de la navegación. Era el pendiente "CV solo en /about/" del 26 oct.

Se ejecutó por dos motivos. **Uno se resuelve y el otro no**, y el segundo
resulta no ser lo que la instrucción suponía: la medición está en §6 y es el
hallazgo principal de este informe.

---

## 1. Auditoría previa — dónde estaba el botón

Enlaces al PDF dentro de regiones de navegación, antes del cambio:

| Región | Clase | Ocurrencias | Páginas |
|---|---|---|---|
| Barra | `.nav-download` | 38 | las 38 con barra |
| Menú móvil | `.mm-download` | 38 | las 38 con barra |

Las 38 son todas las páginas con barra. El único HTML del repo sin barra es
`343ride-landing.html`, que tampoco tenía el botón. **Verificado: 38 y 38, una
ocurrencia de cada clase por página, ninguna de más.**

Las etiquetas eran por idioma, con variante larga y corta en DE/ES:

| Idioma | Barra (escritorio) | Barra (≤1000px) | Menú móvil |
|---|---|---|---|
| EN | `Download CV ↓` | `CV ↓` | `Download CV ↓` |
| DE | `Lebenslauf ↓` | `CV ↓` | `Lebenslauf ↓` |
| ES | `Currículum ↓` | `CV ↓` | `Currículum ↓` |

El cambio de etiqueta larga a corta lo hacía `/nav.css` con `.nav-dl-long` /
`.nav-dl-short` en un `@media (max-width:1000px)`.

### 1.1 CSS asociado

| Fichero | Reglas |
|---|---|
| 35 páginas con `<style>` propio | `.nav-download`, `.nav-download:hover`, `.mm-download`, `.mm-download:hover` (140 bloques) |
| `contact/form.css` | las mismas 4 (las 3 páginas de contacto no las llevan inline) |
| `contact/form.css` | `.nav-brand,.nav-download{min-height:44px…}` — selector compartido |
| `/nav.css` | `.nav-dl-short{display:none}` + el swap de etiqueta en el `@media` de 1000px |
| `de/about/`, `es/about/` | copia local del swap: `@media (max-width:900px){.nav-dl-long…}` |

Las dos copias en `de/about/` y `es/about/` son exactamente el tipo de override
por página que `/nav.css` existe para evitar, y además discrepaban del corte
canónico (900px contra 1000px).

## 2. Auditoría previa — todos los enlaces al CV del portafolio

Se buscó `cv` en todo el repo (HTML, CSS, JS, XML) y se clasificó cada
ocurrencia:

| Ocurrencia | Dónde | Decisión |
|---|---|---|
| `.nav-download` → `/Jorge_Aguilar_CV.pdf` | barra, 38 páginas | **eliminado** |
| `.mm-download` → `/Jorge_Aguilar_CV.pdf` | menú móvil, 38 páginas | **eliminado** |
| `.btn.btn-secondary` → `/Jorge_Aguilar_CV.pdf` | **cuerpo** de `404.html`, `de/404.html`, `es/404.html` | **conservado** — ver §8.1 |
| `cv/index.html` | fuente del PDF | **conservada**, con su barra ya sin botón |
| `scripts/build_cv.js` | genera el PDF desde `cv/index.html` | sin tocar |
| `cv/` en `.assetsignore` | excluye `/cv/` del deploy | sin tocar |

**No existe ni un solo `href="/cv/"` en el repo.** `/cv/` nunca fue enlazada
desde ninguna página, y además está en `.assetsignore`, así que en producción
devuelve 404. No era, ni es, un destino de navegación: es la fuente del PDF que
`npm run cv` imprime. Por eso aquí no había nada que redirigir.

**Los pies de página no llevan CV.** Se revisó `<footer>` en las páginas de cada
familia: no hay ninguna referencia al PDF. La excepción de "el pie puede
quedarse" de la instrucción no aplicaba a nada.

## 3. Auditoría previa — estado de `/about/`

**No había sección de CV.** Las tres variantes (`/about/`, `/de/about/`,
`/es/about/`) tenían seis secciones: Approach, Experience, Capabilities,
Tooling, Education, Contact. Ninguna mencionaba el CV ni enlazaba al PDF. La
única vía de descarga desde esas páginas era el botón de la barra que se acaba
de quitar, así que al retirarlo el PDF se quedaba sin ninguna entrada desde el
sitio.

Lo que sí había era `.hub-cta` y sus cuatro reglas hijas (`.hub-cta-row`,
`.hub-cta-primary`, `.hub-cta-secondary`), definidas en las tres páginas,
documentadas como "CTA de cierre del hub", con su padding reducido en móvil —
**y sin un solo marcado que las usara en todo el repo.** Estilo muerto a la
espera del bloque para el que se escribió.

## 4. Ejecución

### 4.1 `1e85f53` — fuera del marcado (38 ficheros, 76 borrados)
Una línea por página en la barra y una en el menú móvil. Nada más: el resto del
componente canónico queda intacto.

`.mobile-menu-actions` es `flex-direction:column` con `gap`, así que pasar de
dos hijos a uno no cambia nada de su caja. El CTA queda como único botón a ancho
completo (captura `mobile-menu-de.png`).

### 4.2 `8c06682` — la sección en `/about/` (3 ficheros, +69 / −9)
Entre Education y Contact, con `id="cv"` y `data-sec="cv"`.

**Sin CSS nuevo.** Reusa `.hub-cta` de §3, que ya existía y no pintaba nada. El
CTA sale emerald por `.hub-cta-primary` (`rgb(16,185,129)`, medido) y el
descriptor queda en `--muted` con el subrayado emerald de `.hub-cta-secondary`.
No se introdujo el crema `--accent-secondary`: estas páginas lo declaran en
`:root` pero no lo usan en ningún sitio, y meterlo aquí habría sido un
one-off, no el sistema de la página.

El índice lateral y el `<details>` móvil ganan la entrada como **06** y Contacto
pasa a **07**, en las dos listas de cada página. El scrollspy deriva sus
objetivos de los enlaces del rail, así que no hubo lista que tocar; solo su
comentario, que contaba seis bloques.

### 4.3 `8602a87` — limpieza de estilo (37 ficheros, +24 / −165)
145 bloques de regla muertos (`.nav-download`, `.mm-download` y sus `:hover`),
las dos copias locales del swap de etiqueta, y en `/nav.css` la geometría
`.nav-dl-long` / `.nav-dl-short`.

El `@media (max-width:1000px)` **se queda**, pero solo con
`.nav-links{gap:16px;}`: ese gap no era del CV, es lo que evita que la fila se
parta entre 900 y 1000px. Los comentarios de `/nav.css` que explicaban los dos
cortes se reescribieron en vez de borrarse — ambos se midieron con el botón en
la fila, así que las medidas que citaban ya no describen lo que hay.

**Un detalle con trampa.** En `form.css` el mínimo de 44px de área táctil estaba
en un selector compartido, `.nav-brand,.nav-download{…}`. Quitar el segundo
nombre con una regex de bloque dejó a `.nav-brand` pegado a la regla siguiente y
la marca heredó los 36px del selector de idioma. Se detectó revisando el diff y
quedó como regla propia con sus 44px. Es el único punto del cambio donde el
borrado mecánico habría roto algo en silencio.

## 5. Verificación

Chromium headless (Puppeteer 25.11, el mismo que imprime el PDF) contra el repo
servido en local. No se pudo usar Chrome interactivo en esta sesión, así que
todo lo de abajo son medidas del DOM renderizado y capturas, no una inspección a
ojo; la lista de lo que conviene mirar a mano está en §9.

### 5.1 Las 38 páginas, a 1440px

| Comprobación | Resultado |
|---|---|
| Enlaces al CV en `header.nav` o `.mobile-menu` | **0 en las 38** |
| Altura de la barra | **85px en las 38**, un solo valor |
| Desbordamiento horizontal | ninguno |
| Última pieza de `.nav-links` | `.nav-cta` (35) · `.lang-switch` (3: las de contacto, que no llevan CTA) |
| Errores de consola | solo Turnstile 110200 en las 3 de contacto — esperado fuera del dominio |

### 5.2 La sección en los tres idiomas

Visitando `/about/#cv`, `/de/about/#cv` y `/es/about/#cv` a 1440px y a 390px:

| | EN | DE | ES |
|---|---|---|---|
| `#cv` existe y es visible | sí | sí | sí |
| Orden de secciones | …education > **cv** > contact | …ausbildung > **cv** > kontakt | …formacion > **cv** > contacto |
| `href` del botón | `/Jorge_Aguilar_CV.pdf` | idem | idem |
| Etiqueta | `Download CV ↓` | `Lebenslauf herunterladen ↓` | `Descargar currículum ↓` |
| Fondo del CTA | `rgb(16,185,129)` | idem | idem |
| Alto del CTA | 50px | 50px | 50px |
| Ancho del CTA a 390px (tarjeta de 350px) | 158px | 241px | 213px |
| Anclas rotas en el índice | 0 | 0 | 0 |

Ninguna etiqueta parte en dos líneas, ni siquiera la alemana, que es la larga.
El alto de 50px supera el mínimo táctil de 44px del resto del sitio.

`.section[id]{scroll-margin-top:100px}` ya existía y la sección nueva lo hereda
por ser `.section` con `id`: el salto a `#cv` deja la sección **15px por debajo**
del borde inferior de la barra de 85px, igual en los tres idiomas.

El PDF responde `200 application/pdf`, 300356 bytes, los mismos que en disco.

### 5.3 Menú móvil

Abierto con clic real en `#navToggle` a 390px en `/`, `/de/` y `/es/about/`:
abre, `.mobile-menu-actions` contiene **un** enlace (el CTA del idioma
correspondiente) y **cero** enlaces al PDF.

## 6. Prueba cross-language — el ancho **no** mejoró

La instrucción preveía que, quitado el botón, "el desplazamiento es mucho menor".
**No lo es. Es exactamente el mismo.** Se midió el ancho del grupo derecho
(desde el borde izquierdo del selector de idioma hasta el borde derecho del CTA)
en nueve páginas por idioma, en el commit anterior y en el actual:

| Viewport | | EN | DE | ES | **Variación entre idiomas** |
|---|---|---|---|---|---|
| 1440 / 1100 / 1001px | antes | 404px | 435px | 377px | **58px** |
| 1440 / 1100 / 1001px | **después** | 247px | 293px | 235px | **58px** |

El grupo adelgaza 157px en EN y 142px en DE/ES, pero **la diferencia entre
idiomas sigue siendo 58px, al píxel.**

El desglose por pieza, a 1440px, explica por qué:

| Pieza | EN | DE | ES | Variación |
|---|---|---|---|---|
| Selector de idioma | 110px | 110px | 110px | **0px** |
| Botón CV (antes) | 129px | 114px | 114px | 15px |
| CTA | 109px | **155px** | 97px | **58px** |

El botón del CV medía **lo mismo en DE que en ES** (114px), así que al quitarlo
restó la misma cantidad a los dos extremos de la horquilla y la horquilla no se
movió. Solo variaba entre EN y DE/ES (15px), y EN nunca fue un extremo.

**Toda la variación cross-language del extremo derecho es, y era ya, el CTA:**
"Get in touch" (109px) contra "Kontakt aufnehmen" (155px) contra "Hablemos"
(97px). El CV era ancho, no era el que variaba.

Lo que sí hizo esta instrucción por el ancho: la fila entera tiene 142–157px más
de aire, lo que deja sin motivo el truco de encoger la etiqueta a 1000px, y el
corte de 900px a hamburguesa ahora va sobrado en vez de justo.

**El selector de idioma mide 110px en los tres idiomas, antes y después.** La
comprobación que pedía la instrucción pasa, y pasa por construcción: muestra
siempre `EN · DE · ES`, nunca el nombre del idioma actual, así que su ancho no
puede depender de dónde estés.

Qué haría falta para cerrar el problema del ancho, si se quiere cerrar: §8.2.

## 7. Prueba cross-repo — Motion

No se pudo comparar a ojo en el navegador, así que se comparó la fuente servida:
se descargó `jorgeag.com/motion/` (y `/de/`, `/es/`) con su `style.css` y su
`nav.css`.

**La estructura de la mitad derecha es ahora idéntica.** Las dos barras son
marca · cinco enlaces · `.lang-switch` · `.nav-cta`, y se acabó. Motion no
menciona el CV en ninguna parte de la página, en ningún idioma (0 coincidencias
de `cv`, `Lebenslauf`, `Currículum`, `_CV.pdf`).

Y es idéntica también en geometría, no solo en estructura:

| Propiedad | Portafolio | Motion |
|---|---|---|
| `.nav-links` gap | 28px (16px ≤1000px) | 28px (16px ≤1000px) |
| `.nav-cta` padding / tamaño / peso | 10px 18px · 12.5px · 600 | 10px 18px · 12.5px · 600 |
| `.lang-switch` padding / gap / borde | 3px · 2px · 1px | 3px · 2px · 1px |
| `.lang-switch a` padding / tamaño / tracking | 5px 9px · 10.5px · .1em · mayúsculas | idéntico |
| Etiqueta del CTA EN / DE / ES | Get in touch / Kontakt aufnehmen / Hablemos | **las mismas tres** |

Mismas etiquetas y mismas cajas: el extremo derecho de la barra se pinta igual
en los dos repos, y el salto visual al cruzar a `/motion/` desaparece. Los 58px
de §6 siguen ahí, pero están en los dos sitios por igual, que es la clase de
diferencia que no se nota al navegar.

Queda una divergencia, y es de fichero: §8.3.

## 8. Pendientes conocidos

### 8.1 El CV sigue en el cuerpo de las tres páginas 404
`404.html`, `de/404.html` y `es/404.html` ofrecen el PDF como botón secundario
**dentro del contenido**, junto a las salidas de recuperación. No se tocó: no es
navegación, el alcance de la instrucción no lo listaba, y quitarlo recorta una
vía de recuperación sin que nadie lo haya pedido. Si "el CV vive solo en
`/about/`" se quiere leer en sentido estricto, estas tres son lo que falta —
decisión tuya, es una línea por fichero.

### 8.2 Los 58px del CTA siguen ahí
Es el hallazgo de §6 y el problema 2 de la instrucción sigue abierto. Dos vías:

- **Igualar la caja.** Un `min-width` en `.nav-cta` dentro de `/nav.css` (155px,
  el ancho alemán) clava el extremo derecho en los tres idiomas. Es la vía
  robusta y va donde vive la geometría, pero ensancha visualmente el CTA en EN
  (+46px) y en ES (+58px): deja de ajustarse a su texto y pasa a ser un botón de
  ancho fijo. Es una decisión de diseño sobre 38 páginas × 3 idiomas, no una
  corrección, así que no se tomó aquí.
- **Acortar la etiqueta alemana.** "Kontakt aufnehmen" (155px) → "Kontakt"
  bajaría DE cerca de EN y la variación a ~15px, sin tocar geometría. Más barato,
  pero cambia copy en los dos repos a la vez (Motion usa la misma etiqueta).

### 8.3 `/motion/nav.css` conserva la geometría muerta del CV
La copia de Motion todavía trae `.nav-dl-short{display:none;}` y el swap
`.nav-dl-long` / `.nav-dl-short` en su `@media` de 1000px, además del comentario
que lo explica — reglas que nunca pintaron nada allí, porque Motion jamás tuvo el
botón, y que desde hoy discrepan de este repo. Es justo la deriva entre copias
que `nav.css` se escribió para impedir, aparecida ahora entre repos en vez de
entre páginas. **Está fuera de este repo y no se pudo tocar**: hay que borrar ese
bloque de `/motion/nav.css` y dejar el `@media` solo con `.nav-links{gap:16px}`,
igual que aquí.

### 8.4 El ancla es `#cv` en los tres idiomas
Las páginas DE y ES traducen sus anclas (`#ansatz`, `#ausbildung`, `#enfoque`,
`#formacion`). La del CV no: es `#cv` en las tres, contra esa convención. A
cambio, `/about/#cv` funciona igual en los tres idiomas y cualquier enlace
externo al CV no necesita saber el idioma. Si se prefiere la convención,
`#lebenslauf` y `#curriculum` son un cambio de dos líneas por página.

### 8.5 `/cv/` sigue inalcanzable en producción
Sin cambios respecto al informe del 27 oct: está en `.assetsignore`, así que
`jorgeag.com/cv/` devuelve 404 y su barra solo se ve sirviendo el repo en local.
Es la fuente del PDF, no un destino. Se le quitó el botón del CV como a las
demás, por coherencia del componente.

---

## 8 bis. Addendum — subrayado de la barra (28 oct, posterior)

### 8bis.1 La causa no era la que decía el parte
El parte pedía "quitar el `text-decoration: underline` general de `nav a`" de
`/nav.css`. Ese `underline` no existe: `/nav.css` no tenía **ninguna**
declaración `text-decoration` antes de este cambio, y las páginas tampoco la
ponen sobre `.nav-links a`. El subrayado que Console veía en los cinco enlaces
no lo pintaba nuestra hoja, lo pintaba el navegador — es el estilo de user-agent
de `<a href>`, que nadie estaba reseteando.

Eso explica el otro dato del parte: `.lang-switch a` era el único con
`text-decoration: none` porque es el único sitio del componente donde alguien lo
escribió. No era un override contra una regla nuestra; era el único reset que
había.

Consecuencia práctica: el paso 1 de la instrucción quedó en nada (no había nada
que quitar) y el arreglo es el reset que faltaba, no una retirada.

### 8bis.2 El selector de idioma también lleva `aria-current="page"`
La regla pedida — `nav a[aria-current="page"] { text-decoration: underline; }` —
tal cual **rompe** el chip de idioma, y hay que anotarlo porque no es evidente
leyendo el parte. Dos hechos del marcado se juntan:

- el chip de la lengua activa lleva `class="is-current"` **y**
  `aria-current="page"` (`work/index.html:486`), igual que el enlace de la
  página;
- `.lang-switch` vive **dentro** de `nav.nav-links`, no al lado.

Así que `nav a[aria-current="page"]` (0,2,1) alcanza al chip EN y le gana por
especificidad al `.lang-switch a{text-decoration:none}` de la página (0,1,1):
el EN saldría subrayado dentro de su pastilla de acento. Por eso la regla final
excluye el selector de idioma con una tercera declaración de la misma
especificidad (0,2,1) puesta después, que gana por orden. El punto 4 de la
instrucción ("mantener el override de `.lang-switch`") solo se cumple si se
añade esa línea.

### 8bis.3 El diff

`/nav.css`, 33 líneas añadidas al final, ningún borrado:

```css
.nav a,
.mobile-menu a{text-decoration:none;}

.nav-links a[aria-current="page"],
.mobile-menu-links a[aria-current="page"]{
  text-decoration:underline;
  text-underline-offset:4px;
}

.lang-switch a[aria-current="page"]{text-decoration:none;}
```

Tres decisiones, cada una comentada en la hoja:

- **El reset va sobre `.nav` y `.mobile-menu` enteros**, no sobre `.nav-links`:
  la marca y el CTA también son `<a>` y también llevaban el subrayado del UA.
- **Vive en `/nav.css` aunque sea apariencia**, contra la regla del encabezado
  del fichero. El motivo es el mismo que trajo la hoja: el reset en una página
  deja el bug en las otras 37, y esta hoja la cargan todas al final del `<head>`.
  Es el único sitio donde se apaga una vez.
- **El marcador es `aria-current`, no `.is-active`**, aunque el marcado lleve
  los dos. Lo visible y lo anunciado salen del mismo atributo y no pueden
  derivar uno del otro.

### 8bis.4 Verificación
No hubo Chrome disponible en esta sesión, así que se corrió el snippet del parte
tal cual en Chromium real vía el puppeteer que ya es devDependency del repo
(`node_modules/puppeteer`, 1440×900), sobre el repo servido en local. Salida por
página, `nav a` → `textDecorationLine`:

| Página | `nav a` | subrayados | cuáles | violaciones |
|---|---|---|---|---|
| `/work/` | 15 | 2 | Work (desktop), Work02 (móvil) | 0 |
| `/` | 15 | 2 | Home, Home01 | 0 |
| `/about/` | 15 | 2 | About, About03 | 0 |
| `/leadership-framework/` | 22 | 2 | Framework, Framework05 | 0 |
| `/contact/` | 14 | 1 | Contact06 (móvil) | 0 |
| `/de/work/` | 15 | 2 | Arbeiten, Arbeiten02 | 0 |
| `/es/about/` | 15 | 2 | Sobre, Sobre03 | 0 |
| `/de/` | 15 | 2 | Start, Start01 | 0 |

"Violaciones" = enlaces subrayados **sin** `aria-current="page"`, más cualquier
chip de idioma subrayado. Cero en las ocho páginas. Los tres chips EN/DE/ES
devuelven `none` en todas, incluido el EN que lleva `aria-current="page"`.

Detalle de `/work/`, que es la página del parte:

```
desktop Home         -> none      | aria-current: null
desktop Work         -> underline | aria-current: page
desktop About        -> none      | aria-current: null
desktop Motion       -> none      | aria-current: null
desktop Framework    -> none      | aria-current: null
desktop EN           -> none      | aria-current: page [lang-switch]
desktop DE           -> none      | aria-current: null [lang-switch]
desktop ES           -> none      | aria-current: null [lang-switch]
desktop Get in touch -> none      | aria-current: null
mobile  Home01       -> none      | aria-current: null
mobile  Work02       -> underline | aria-current: page
mobile  About03      -> none      | aria-current: null
mobile  Motion04     -> none      | aria-current: null
mobile  Framework05  -> none      | aria-current: null
mobile  Contact06    -> none      | aria-current: null
```

### 8bis.5 Son dos subrayados por página, no uno
El parte esperaba "exactamente UNO". Salen dos y es correcto: las dos barras
—la fila de escritorio y el menú móvil— están en el DOM a la vez en todas las
páginas, y cada una lleva su propio enlace con `aria-current="page"`. El punto 3
de la instrucción pedía precisamente que la regla cubriera las dos. Visible solo
hay uno a cualquier ancho: por encima de 901px el menú móvil es
`display:none`, y por debajo de 900px lo es `.nav-links`. Si se quiere contar
uno solo, el snippet tiene que filtrar por visibilidad (`offsetParent`), no
cambiar el CSS.

### 8bis.6 `/contact/` no marca la página en la barra de escritorio
Cae de la tabla de §8bis.4: `/contact/` devuelve **un** subrayado, el del menú
móvil. En escritorio, Contact no es un enlace de `.nav-links` sino el CTA
`.nav-cta`, y no lleva `aria-current="page"` — de hecho ninguno de los enlaces
de escritorio lo lleva en esa página. Es un hueco del marcado anterior a este
cambio, no algo que haya causado: con el CSS de antes tampoco se distinguía,
porque los cinco salían subrayados igual. No se tocó, está fuera del alcance del
parte. Si se quiere marcar, es `aria-current="page"` en el `.nav-cta` de
`/contact/` × 3 idiomas, y entonces hay que decidir si el CTA (fondo de acento,
pastilla) debe además subrayarse o quedar fuera como el selector de idioma.

### 8bis.7 `/motion/` no se pudo verificar y no se tocó
No está en este repo (`ls motion` → no existe), es la publicación aparte. Según
la nota del parte, este cambio de `/nav.css` llega a su `site/nav.css` por el
canary siguiente o por sync manual; no se entró a su repo. Queda por comprobar
allí, cuando propague, que su marcado cumple las dos condiciones de las que
depende la regla: que el enlace activo lleve `aria-current="page"` y que su chip
de idioma activo no quede subrayado si también lo lleva.

## 9. Qué conviene mirar a mano

Todo lo de §5 son medidas del DOM y capturas de Chromium headless. Lo que no
cubre, y conviene pasar por Chrome de incógnito:

- La descarga en sí. Se verificó que el `href` es correcto y que el PDF responde
  `200 application/pdf` con sus 300356 bytes, pero no que el clic dispare la
  descarga en un navegador real con su gestor de descargas.
- El recorrido home → about → work → framework → caso → contacto a ojo, por si
  algo del extremo derecho de la barra canta en una página concreta.
- `jorgeag.com` → Motion con el cambio ya desplegado. §7 compara fuentes y
  reglas, no dos pantallas puestas una al lado de la otra.

---

## Capturas

`\.reports/2026-10-28-cv-consolidation/`

| Fichero | Qué |
|---|---|
| `about-{en,de,es}-desktop.png` | `/about/#cv` a 1440px, con el rail marcando 06 |
| `cv-{en,de,es}-mobile.png` | la sección a 390px, sin el banner de consentimiento |
| `mobile-menu-de.png` | menú móvil abierto, un solo CTA, sin CV |

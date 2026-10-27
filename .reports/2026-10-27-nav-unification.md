# Nav — unificación a un solo componente canónico

**Fecha:** 2026-10-27
**Commits:** `559c739`, `8a32177`, `cdba2ef`
**Alcance:** 41 ficheros (38 páginas HTML + `nav.css` + `nav.js` + `contact/form.css`)
**Total:** 2746 inserciones, 1696 borrados

El 27 oct 2026 se dejó `/nav.css` como única fuente de la geometría de la barra
(altura, sticky, corte de 900px), pero se conservaron **dos variantes
estructurales** porque la instrucción de entonces descartaba el rediseño. Hoy esa
decisión se revierte: una sola estructura en todas las páginas, marca
"Jorge Aguilar" en lugar de la flecha de volver.

---

## 1. Auditoría previa

Variante B (flecha de volver) esperada en 28 páginas. **Verificado: exactamente 28.**

| Página | Variante | Diferencias de markup respecto a la canónica | Notas |
|---|---|---|---|
| `/work/` | B | envoltorio, slot izquierdo, contenedor, clase de enlace, menú móvil | `is-active` en Work |
| `/about/` | **A** | — | ya canónica |
| `/nexio/` | B | idem | sin `is-active` |
| `/bliq/` | B | idem | sin `is-active` |
| `/bolt/` | B | idem | sin `is-active` |
| `/wolt/` | B | idem | sin `is-active` |
| `/alcorte/` | B | idem | sin `is-active` |
| `/leadership-framework/` | B | idem | `is-active` en Framework |
| `/contact/` | B | idem + **CSS en `/contact/form.css`**, no inline | sin CTA (enlazaría a sí misma) |
| `/privacy/` | B | idem | sin `is-active` |
| `/impressum/` | B | idem | `lang="de"` con etiquetas y rutas **EN** |
| `/datenschutz/` | B | idem | `lang="de"` con etiquetas y rutas **EN** |
| `/de/work/` | B | idem | `is-active` en Arbeiten |
| `/de/about/` | **A** | — | ya canónica |
| `/de/nexio/` `/de/bliq/` `/de/bolt/` `/de/wolt/` `/de/alcorte/` | B | idem | sin `is-active` |
| `/de/leadership-framework/` | B | idem + **bloque CSS de cola duplicado** | `is-active` en Framework |
| `/de/contact/` | B | idem + CSS en `form.css` | sin CTA |
| `/es/work/` | B | idem | `is-active` en Trabajo |
| `/es/about/` | **A** | — | ya canónica |
| `/es/nexio/` `/es/bliq/` `/es/bolt/` `/es/wolt/` `/es/alcorte/` | B | idem | sin `is-active` |
| `/es/leadership-framework/` | B | idem + **bloque CSS de cola duplicado** | `is-active` en Framework |
| `/es/contact/` | B | idem + CSS en `form.css` | sin CTA |
| `/es/privacidad/` | B | idem | `Motion` sin atributo `title` |
| `/` `/de/` `/es/` | **A** | — | fuente canónica |
| `/404.html` `/de/404.html` `/es/404.html` | A parcial | marca + idioma, **sin enlaces, sin hamburguesa, sin menú** | — |
| `/cv/` | **ninguna** | sin barra, sin `nav.css`, sin `nav.js` | fuente del PDF |
| `/343ride-landing.html` | **ninguna** | sin barra | otra marca, fuera de alcance |

**La divergencia no era solo la flecha.** Siete diferencias estructurales:

| | Variante A (6) | Variante B (28) |
|---|---|---|
| envoltorio | `<header class="nav" id="nav">` | `<nav class="nav">` |
| slot izquierdo | `.nav-brand` | `.back-link` (← Portfolio) |
| contenedor | `<nav class="nav-links">` gap 28px | `.nav-actions` gap 14px |
| clase de enlace | `<a>` suelto | `.nav-pagelink` |
| enlace Home | sí | no |
| menú móvil | `.mobile-menu-links` numerado | `.mobile-menu-actions` con píldoras |
| corte de enlaces | 900px | 1100px (**regla muerta**, ver §5) |

---

## 2. Definición canónica

Fuente: markup de `/index.html`. Orden de enlaces **tal cual está en
`/index.html`** (decisión tomada en sesión; ver §7).

```html
<header class="nav" id="nav">
  <div class="nav-inner">
    <a href="{raíz}" class="nav-brand">Jorge Aguilar</a>
    <nav class="nav-links">
      <a href="{raíz}">Home</a>
      <a href="{raíz}work/">Work</a>
      <a href="{raíz}about/">About</a>
      <a href="{raíz}motion/" title="…">Motion</a>
      <a href="{raíz}leadership-framework/">Framework</a>
      <div class="lang-switch" role="group" aria-label="Language">…</div>
      <a href="/Jorge_Aguilar_CV.pdf" download class="nav-download">…</a>
      <a href="{raíz}contact/" class="nav-cta">Get in touch</a>
    </nav>
    <button class="nav-toggle" id="navToggle" …><span class="bars"></span></button>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu" …>
  <div class="mobile-menu-head">  <!-- marca, no flecha -->
  <nav class="mobile-menu-links"> <!-- Home 01 … Contact 06, numerado -->
  <div class="mobile-menu-lang">  <!-- selector de idioma -->
  <div class="mobile-menu-actions"><!-- CTA + CV -->
  <div class="mobile-menu-foot">Berlin · EMEA</div>
</div>
```

- **Altura:** 85px a ≥901px, 73px a ≤900px (sin cambios, ya era canónico).
- **Posición:** sticky, `top:0`.
- **Geometría:** solo en `/nav.css`. No se ha re-dividido.
- **Sin flecha de volver en ningún sitio.** La vuelta atrás es el botón del
  navegador y el clic en la marca.

**Raíz por idioma**, derivada de los enlaces que ya tenía cada página (no del
atributo `lang`, ver §6):

| Idioma | Raíz | Etiquetas | CTA | CV |
|---|---|---|---|---|
| EN | `/` | Home · Work · About · Motion · Framework · Contact | Get in touch | Download CV |
| DE | `/de/` | Start · Arbeiten · Über · Motion · Framework · Kontakt | Kontakt aufnehmen | Lebenslauf |
| ES | `/es/` | Inicio · Trabajo · Sobre · Motion · Framework · Contacto | Hablemos | Currículum |

---

## 3. Ficheros tocados

**`559c739` — variante canónica en las 28 interiores** (29 ficheros, +1867 −1624)

Las 28 de la tabla anterior, más `contact/form.css` (las 3 páginas de contacto
tienen su CSS de barra ahí, sin indentar, no en un `<style>` inline).

**`8a32177` — borrado del componente de flecha** (8 ficheros, +34 −42)

`index.html`, `about/`, `de/`, `de/about/`, `es/`, `es/about/`, `nav.css`, `nav.js`.

**`cdba2ef` — barra canónica en 404 y cv** (4 ficheros, +845 −30)

`404.html`, `de/404.html`, `es/404.html`, `cv/index.html`.

---

## 4. CSS borrado (limpieza del componente de flecha)

**598 líneas distintas** referencian los tres selectores muertos. Por regla:

| Regla borrada | Instancias |
|---|---|
| `.nav-pagelink{…}` (declaración + áreas táctiles) | 127 |
| `.back-link,.nav-brand{min-height:44px;…}` | 36 |
| `@media (min-width:801px){.mobile-menu{display:none}}` → 901px | 32 |
| `.nav-pagelink.is-active{…}` | 28 |
| `@media (max-width:1100px){.nav-pagelink{display:none}}` | 28 |
| `.back-link{…}` | 27 |
| `.back-link:hover`, `.nav-pagelink:hover`, `.nav-actions{display:flex…}`, `.nav-actions a{…}`, `.nav-actions{display:none}` | 26 cada una |
| `.back-link,.nav-pagelink,.nav-download{…}` (`form.css`) | 1 |
| `window.innerWidth > 800` → 900 (JS) | 34 |

Comprobación final: **0 apariciones** de `back-link`, `nav-actions` y
`nav-pagelink` en todo el repo (excluyendo `.reports/`, que es registro
histórico). `nav.js` pasa de `'header.nav, nav.nav'` a `'header.nav'`.

---

## 5. Rotura encontrada en la banda 801–1100px

Se pidió explícitamente revisar esa banda. Se encontraron dos cosas, ambas
**anteriores a este cambio**:

### 5.1 La hamburguesa no abría nada entre 801 y 900px — *corregido*

En las **38 páginas**, incluidas las 6 que ya eran canónicas:

- `.nav-toggle` aparece a `max-width:900px`.
- `.mobile-menu` tenía `@media (min-width:801px){display:none}`.
- el guardia de resize del script cerraba el menú con `innerWidth > 800`.

Resultado medido en el árbol original: a 900px, 880px, 802px y 801px el botón
se veía, los enlaces de escritorio estaban ocultos y **el menú no abría**
(`display:none`). Cien píxeles de ancho sin navegación posible.

Corregido en los tres sitios: `901px` en el CSS y `> 900` en el JS de las 34
páginas que lo llevan. Medido después: el menú abre en **38/38 páginas** a
900, 880, 802 y 390px.

### 5.2 La regla de 1100px nunca se aplicó — *borrada*

Las páginas interiores declaraban:

```css
@media (max-width:1100px){ .nav-pagelink{display:none;} }
```

con la intención de pasar a hamburguesa por debajo de 1100px. Pero más abajo,
en el bloque de áreas táctiles, venía `.nav-pagelink{min-height:44px;display:inline-flex;…}`
— misma especificidad, posterior en el documento, así que ganaba. Medido en el
árbol original: a 1100, 1050, 1000, 950 y 901px los cuatro enlaces interiores
**se veían**.

Por eso unificar el corte en 900px **no cambia nada de lo que se ve**: era ya
el comportamiento real. La regla se borra como código muerto.

**No se encontró ningún desbordamiento** en la banda tras el cambio, tampoco en
DE con `Kontakt aufnehmen` (el CTA más ancho) ni a 901px, donde `/nav.css`
reduce el gap a 16px y acorta la etiqueta del CV.

---

## 6. Verificación

Medida con Puppeteer (Chrome headless) sobre el repo servido en local, **38
páginas × 9 anchos** = 342 mediciones por criterio. Anchos: 1440, 1100, 1000,
950, 901 | 900, 880, 802, 390.

| Criterio | Resultado |
|---|---|
| Altura 85px a ≥901px / 73px a ≤900px | ✅ 38/38 en los 9 anchos |
| `position:sticky` con `top:0` | ✅ 38/38 |
| Marca "Jorge Aguilar" visible | ✅ 38/38 |
| Marca enlaza a la raíz de su idioma | ✅ 14 × `/`, 10 × `/de/`, 11 × `/es/`, 3 × `#top` (ver §7) |
| Enlaces de escritorio visibles solo a ≥901px | ✅ 38/38 |
| Hamburguesa visible solo a ≤900px | ✅ 38/38 |
| El menú móvil **abre** donde hay hamburguesa | ✅ 38/38 a 900/880/802/390px |
| Marca en la cabecera del menú móvil | ✅ 38/38 |
| Sin desbordamiento horizontal (barra y body) | ✅ (excepto §8.3) |
| Orden de enlaces de escritorio | ✅ 15 EN + 11 DE + 12 ES, idéntico dentro de cada idioma |
| Orden del menú móvil | ✅ idem, 6 ítems numerados |
| Todos los enlaces del nav resuelven 200 | ✅ 36/39 (los 3 `/motion/` son otro proyecto, §8.1) |
| PDF del CV sin la barra | ✅ hash idéntico al commiteado tras descartar el `/ID` |

Los tres idiomas quedan cubiertos por las filas de orden de enlaces y de raíz
de la marca.

---

## 7. Decisiones tomadas en sesión

Dos puntos del encargo se contradecían y se resolvieron contigo antes de tocar
nada:

1. **Orden de enlaces.** El encargo nombraba `/index.html` como fuente de
   verdad y a la vez pedía el orden `About · Work · Framework · Motion ·
   Contact`, que no es el que tiene. Decisión: **mantener `/index.html` tal
   cual** (`Home · Work · About · Motion · Framework` + idioma + CV + CTA). No
   hay cambio de IA en ninguna página.
2. **Profundidad de la unificación.** Decisión: **unificación estructural
   completa**, aceptando que en las 28 interiores cambian el gap (14→28px), el
   corte efectivo y el tratamiento del menú móvil (píldoras → lista numerada).
3. **Páginas borde:** 404 y cv dentro; `343ride-landing.html` fuera.

**`#top` en las 3 portadas.** La opción de cambiar el `href` de la marca en
`/`, `/de/` y `/es/` de `#top` a la raíz del idioma no se seleccionó, así que
siguen con `#top`: en la propia portada la marca hace scroll suave arriba en
vez de recargar. Es el único punto donde el `href` de la marca no es la raíz, y
es intencionado. Por eso el commit 3 no es el `fix(nav): adjust brand href per
language root` del plan: los `href` por idioma ya van en el commit 1, dentro
del markup, y no quedaba nada que ajustar aparte. El commit 3 cubre las páginas
borde.

---

## 8. Pendientes y hallazgos no tocados

### 8.1 `/motion/` no está en este repo
Los tres enlaces `Motion` dan 404 sirviendo el repo en local. La publicación
vive en otro proyecto y sirve su propia barra — `nav.js` tiene un `return`
temprano para esas rutas. No verificable desde aquí.

### 8.2 `/cv/` no se despliega
`cv/` está en `.assetsignore`, así que `jorgeag.com/cv/` devuelve 404 y la
barra que se le acaba de añadir solo se ve sirviendo el repo en local. Se añadió
porque se pidió; conviene saber que en producción no es alcanzable. Además es la
fuente del PDF, por lo que la barra va envuelta en `@media print{display:none}`
y se verificó que el PDF re-renderizado es idéntico al commiteado.

### 8.3 `/cv/` desborda 404px a 390px
La hoja A4 mide 794px fijos; a 390px de viewport el body desborda 404px. Es
anterior a este cambio e inherente al layout de impresión, no viene de la barra
(la fila de la barra no desborda a ningún ancho). No se tocó.

### 8.4 Selector de idioma omitido en el nav de `/cv/`
Hay un solo CV, sin variantes DE/ES a las que apuntar. Es la única pieza del
componente canónico que falta ahí, igual que las páginas de contacto son las
únicas sin CTA.

### 8.5 `/datenschutz/` e `/impressum/`: `lang="de"` con nav en inglés
Ambas son `lang="de"`, viven en la raíz (no bajo `/de/`) y sus enlaces de nav
apuntan a rutas EN con etiquetas EN, mientras su etiqueta de idioma del menú
móvil dice "Sprache". Se conservó tal cual: las etiquetas concuerdan con el
destino real de los enlaces. Es una inconsistencia anterior, no introducida
aquí. Decidir si deben pasar a `/de/` o traducir su nav queda pendiente.

### 8.6 Bloque CSS duplicado en `/de/leadership-framework/` y `/es/leadership-framework/`
Ambas llevan el bloque de cola (áreas táctiles + reglas de nav) **dos veces**,
por copia-pega anterior. La transformación sustituyó las dos copias, así que
siguen duplicadas pero coherentes. Limpieza pendiente.

### 8.7 El script del menú móvil sigue duplicado en 35 páginas
Igual que pasaba con el CSS de la barra antes de `/nav.css`, el IIFE que abre y
cierra el overlay está copiado inline en cada página. Es la cuarta copia del
mismo componente y el próximo candidato a extraer a un fichero compartido —
este cambio tuvo que editar las 34 copias a la vez solo para mover un `800` a
`900` (§5.1). No entraba en el alcance.

### 8.8 `.nav` sigue con apariencia por página
Por diseño (`/nav.css` solo gobierna geometría). `contact/form.css` usa
`rgba(11,11,13,0.95)` y `blur(12px)`; el resto `0.85` y `blur(8px)`. Y `/cv/`
nombra sus tokens distinto (`--line`), por lo que necesitó un alias `--border`
para que el borde inferior de la barra se pintara y midiera 85px. Sin tocar.

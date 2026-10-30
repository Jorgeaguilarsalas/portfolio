# Ejecución P0 del portafolio, a partir de la auditoría

**Fecha:** 2026-10-30
**Rama:** `main`
**Commits:** `f1e7371` → `13b0603` (11 commits, sobre `7b1677f`)
**Origen:** `.reports/2026-10-30-portfolio-audit.md` (N1, N2, N4, N6, N7,
N8 y N9) con las tres decisiones de Jorge.
**Evidencia:** `.reports/2026-10-30-portfolio-p0/verify-p0.js`

Todo se verificó en Chrome 156 headless contra el sitio servido en local
(`python3 -m http.server`). Cada edición se aplicó con un script que exige el
número exacto de coincidencias, y si no coincide no escribe nada.

---

## Resumen

| # | Sección | Commit | Ficheros | Estado |
|---|---|---|---|---|
| 1 | Cifras (Bliq 4.7×, €3M ARR, liderazgo de equipo, retención) | `f1e7371` | 9 + PDF del CV | Hecho, con 1 desviación (§1.3) |
| 2 | Fechas de Wolt y Bolt | `c96aa4d` | 9 | Hecho, con 2 extras necesarios (§2) |
| 3 | Hero de posicionamiento senior + línea "Previously" | `41bb62a` | 3 | Hecho |
| 4 | "Next case study" + CTA al final de los 5 casos | `5d39915` | 15 + `/case-end.css` | Hecho |
| 5 | Inter autoalojada (DSGVO) | `5a54d95` | 37 + `/fonts/` + 3 páginas legales | Hecho, **sin JetBrains Mono** (§5.1) |
| 6 | Cadenas "lime" | `b5a92e6` | 3 | Hecho |
| 7 | Skip link (WCAG 2.4.1) | `7ba8965` | 37 + **`/nav.css`** | Hecho; **requiere espejo a Motion** |
| 8 | `.reveal` con compuerta `html.js` y fuera de los H1 | `351f785` | 12 | Hecho |
| 9 | Enlace de Privacy en /contact/ y eyebrow de /alcorte/ | `baa1bcb` | 5 | Hecho, + /es/contact/ (§9) |
| 10 | JSON-LD `Person` | `635933f` | 6 + script + `package.json` | Hecho, generado desde el CV |
| 11 | Un solo CTA principal en el cierre de la home | `13b0603` | 3 | Hecho |

**Espejo a Motion:** solo el commit 7 toca `/nav.css`. Hay que copiarlo byte a
byte al repo de Motion; las reglas nuevas van al final de la hoja, y en la
tabla de z-index del comentario hay una línea más (§7). `/nav.js` no se ha
tocado.

---

## 1. Cifras: `f1e7371`

### 1.1 Crecimiento de drivers en Bliq → 4.7×

| Sitio | Antes | Después |
|---|---|---|
| Home, tarjeta de Bliq (EN/DE/ES) | 4.6× / 4,6-fache / 4,6× | 4.7× / 4,7-fache / 4,7× |
| /work/, tarjeta de Bliq (EN) | 4.6× | 4.7× |
| /bliq/ ×3 (métrica, cuerpo y lede) | 4.6 / 4,6 (8 apariciones) | 4.7 / 4,7 |
| CV (`cv/index.html`) + PDF regenerado | 4.6× | 4.7×, 2 páginas |

Se mantiene la atribución "company-level" del caso. Cada idioma conserva su
formato decimal (DE y ES con coma en el texto).

```
$ grep -rnE "4[.,]6(×|&times;|-fach|-Fach)" (37 páginas servidas + cv) → 0
```

### 1.2 / 1.4 €3M ARR y retención <50% → >80% en "What I owned"

Se añadieron dos ítems a la lista "What I owned" de /bliq/, ×3. La
redacción se adaptó a la lista, que está escrita con sustantivos:

- EN: *Delivery of the €3M ARR cross-functional pilot, in four months* /
  *Redesign of the fleet partner model: partner retention from <50% to >80%*
- DE: *Umsetzung des cross-funktionalen Piloten mit €3M ARR, in vier
  Monaten* / *Neugestaltung des Flottenpartner-Modells: Partnerbindung von
  <50% auf >80%*
- ES: *Ejecución del piloto multidisciplinario de €3M de ARR, en cuatro
  meses* / *Rediseño del modelo de socios de flota: retención de <50% a
  >80%*

Home y /about/ quedan como estaban, según lo pedido.

### 1.3 "6 direct reports" → liderazgo compartido: **desviación**

| Sitio | Antes | Después |
|---|---|---|
| Home EN | Direct reports across supply operations in German mobility markets | Partnered on operations leadership for a 6-person supply operations team |
| Home DE | Direkt unterstellte Mitarbeitende in den Supply Operations … | Operative Führung eines 6-köpfigen Supply-Operations-Teams, gemeinsam mit einer Co-Leitung |
| Home ES | Colaboradores a mi cargo directo en Supply Operations … | Liderazgo operativo compartido de un equipo de Supply Operations de 6 personas |
| /bliq/ "What I owned" ×3 | — | ítem nuevo con la misma redacción |

**Desviación:** el parte listaba también /about/ y el PDF del CV, pero **en
ninguno de los dos existía la afirmación** (ni en EN, DE o ES), así que no
había nada que reformular. No se añadió como línea nueva: en /about/ habría
sido contenido nuevo y en el CV, un cambio de contenido más allá de alinear
cifras, que el parte excluye. Si Jorge la quiere en el CV, es una línea más en
la entrada de Bliq y `npm run cv`.

---

## 2. Fechas de Wolt y Bolt: `c96aa4d`

**Wolt.** La cabecera y la nota final del caso (×3) pasan de
`Feb 2021 — Jan 2022` a `Feb 2021 — Feb 2023`. Además:

- **No se tocaron las ventanas de medición.** "Feb 2021 – Jan 2022" aparece
  también como **línea base** del 30% (frente a Feb 2022 – Jan 2023). Eso no
  es la fecha del rol y sigue igual.
- **Extra necesario:** una viñeta decía *"The procurement comparison extends
  past the role"*. Con el rol hasta Feb 2023 eso deja de ser cierto. Ahora
  dice que la comparación usa dos ventanas de 12 meses, **ambas dentro del
  rol** (×3).
- **Extra necesario:** la tarjeta de Wolt en /work/ decía `2021 — 2022` (×3).
  Ahora dice `2021 — 2023`.

**Bolt.** `August–September` → `August–September 2023` (2 apariciones por
idioma). En ES una de las dos estaba redactada distinto ("entre agosto y
septiembre") y se corrigió igual.

---

## 3. Hero: `41bb62a`

| | Antes (EN) | Después (EN) |
|---|---|---|
| Eyebrow | Founder + Advisor · Berlin · EMEA | Senior Operations · Berlin · EMEA |
| Tagline | Translating marketplace operations into systems thinking. | Senior operations leader for marketplaces and mobility. |
| Sub | Across mobility, logistics and technology — from frontline operations to strategy and execution. | Co-founder of Nexio Fleet, whose compliance platform covers 800+ drivers across 8 fleet operators in Berlin and Brandenburg. |
| Nueva | — | Previously: Bliq · Bolt · Wolt (texto mono; cada nombre enlaza a su caso) |
| Tooltip del cursor | Founder + Advisor | Senior Operations |

- **DE:** *Senior Operations Leader für Marktplätze und Mobilität.* /
  *Mitgründer von Nexio Fleet, dessen Compliance-Plattform 800+ Fahrer bei 8
  Flottenbetreibern in Berlin und Brandenburg abdeckt.* / *Zuvor: …*. El
  cargo se deja en inglés, que es lo habitual en el mercado tech alemán.
- **ES:** *Líder sénior de operaciones para marketplaces y movilidad.* /
  *Cofundador de Nexio Fleet, cuya plataforma de cumplimiento normativo
  cubre a más de 800 conductores de 8 operadores de flota en Berlín y
  Brandeburgo.* / *Antes: …*.

La cifra de escala es la de Nexio (800+ / 8) porque es la única "propia" y ya
verificada en todos los sitios. El 4.7× de Bliq es *company-level* y no
encaja en una frase sobre uno mismo. Los CTA del hero no cambian. Se revisó en
capturas a 1440 px (EN y DE) y a 390 px (DE y ES): nada se desborda.

---

## 4. Cierre de los casos: `5d39915`

Los 15 casos (5 × 3 idiomas) terminan ahora con dos tarjetas:

- **Contacto en contexto.** Una pregunta por caso, por ejemplo *"Similar
  supply problem? Let's talk."* en Bliq o *"A funnel nobody can see inside?"*
  en Bolt. Lleva `mailto:hello@jorgeag.com` con asunto por caso
  (`Re: Bliq case study`).
- **Siguiente caso.** Cadena Wolt → Bolt → Bliq → Alcorte → Nexio → Wolt
  dentro de cada idioma, con el título del caso destino tal como sale en
  /work/.

Los estilos van en **`/case-end.css`**, un fichero nuevo compartido, y no
copiados en el `<style>` de cada página. Es justo el tipo de deriva de 15
copias que costó arreglar en el nav. Usa tokens que ya declaran las 15
páginas, todos verificados.

**Verificación anti-deriva:**

```
distinct skeletons: 1 -> pages per skeleton: [15]     (marcado sin textos ni hrefs)
wolt -> /bolt/ … nexio -> /wolt/   (×3 idiomas)   exists=True ×15
```

---

## 5. Fuentes autoalojadas: `5a54d95`

### 5.1 Qué se hizo y qué no

- **Inter** se sirve ahora desde `/fonts/`: `inter-latin.woff2` (48 KB) e
  `inter-latin-ext.woff2` (85 KB). Son los mismos ficheros y el mismo
  `unicode-range` que entrega Google Fonts (Inter v20). Es variable, así que
  un fichero cubre los pesos 400–900. La licencia OFL está en
  `/fonts/OFL.txt`.
- En las **37 páginas servidas** se sustituyeron los dos `preconnect` y la
  hoja de Google por `<link rel="preload" … inter-latin.woff2>` y
  `/fonts/inter.css`, con `font-display:swap`.
- **JetBrains Mono no se añadió.** Ninguna página servida la usa: su
  `--mono` es la pila monoespaciada del sistema (`ui-monospace, SFMono…`) y
  la hoja de Google solo pedía Inter. Añadirla cambiaría la tipografía mono
  de todo el sitio, que es una decisión de diseño y no de cumplimiento. Solo
  `/cv/` (no servido) carga JetBrains Mono desde Google, y se dejó así porque
  el parte excluye cambios en /cv/ más allá de las cifras y no hay exposición
  legal (no se sirve). **El commit se tituló "self-host Inter font"** en
  lugar del título propuesto, para que el historial no diga algo que no pasó.
  Mi auditoría anterior decía "Inter + JetBrains Mono"; era un error mío.

### 5.2 CLS y tiempos, antes y después

Máximo de 3 cargas en frío por página; "fuentes listas" es el `responseEnd`
de la última petición de fuente (servidor local, solo sirve para comparar):

| Página | Ancho | CLS antes | CLS después | Fuentes listas antes → después |
|---|---|---|---|---|
| / | 1440 | 0.0000 | 0.0000 | 108 → 12 ms |
| /about/ | 1440 | 0.0020 | 0.0000 | 92 → 8 ms |
| /wolt/ | 1440 | **0.0142** | 0.0000 | 119 → 7 ms |
| /de/bliq/ | 1440 | 0.0043 | 0.0000 | 92 → 9 ms |
| /es/leadership-framework/ | 1440 | 0.0000 | 0.0000 | 140 → 10 ms |
| /contact/ | 1440 | 0.0000 | 0.0000 | 95 → 7 ms |
| /impressum/ | 1440 | 0.0001 | 0.0000 | 95 → 8 ms |
| / | 390 | 0.0000 | 0.0000 | 89 → 8 ms |
| /about/ | 390 | 0.0000 | 0.0000 | 101 → 8 ms |
| /wolt/ | 390 | 0.0001 | 0.0000 | 100 → 11 ms |
| /de/bliq/ | 390 | **0.0052** | 0.0000 | 118 → 8 ms |
| /es/leadership-framework/ | 390 | 0.0000 | 0.0000 | 108 → 7 ms |
| /contact/ | 390 | 0.0002 | 0.0000 | 130 → 9 ms |
| /impressum/ | 390 | 0.0002 | 0.0000 | 119 → 9 ms |

Después: **0 peticiones a `fonts.googleapis.com` / `fonts.gstatic.com`** en
las 37 páginas, e Inter cargada en todas (`document.fonts.check`).

### 5.3 Textos legales

En Datenschutz, Privacy y Privacidad se reescribió la §10: Inter se sirve en
local, sin transmisión a terceros y sin conexión con Google Fonts. Se mantuvo
el número de sección para no romper las referencias cruzadas. También se
cambió la frase del resumen inicial que decía que la IP iba "a Google al
cargar las fuentes" (×3). No queda ninguna referencia al título antiguo de la
§10.

**Pendiente para Jorge:** el pie dice "Stand: Oktober 2026", que sigue siendo
correcto. Como la DE es el texto vinculante, conviene que lo relea él (o su
asesor) antes de dar el cambio por cerrado. El cambio solo **quita** un
tratamiento de datos, así que el riesgo es bajo.

---

## 6. Cadenas "lime": `b5a92e6`

`the lime path` → `the emerald path` (×2), `limettenfarbene Pfad` →
`smaragdfarbene Pfad` (×2), `trazo lima` → `trazo esmeralda` (×2). Son 6
cadenas, como se esperaba.

```
texto visible (sin <style>, <script> ni comentarios) de las 37 páginas
servidas, /\b(lime|lima|limette\w*)\b/i → 0 coincidencias
```

---

## 7. Skip link: `7ba8965` **(toca `/nav.css`)**

- Es el primer hijo del `<body>` en las 37 páginas servidas: "Skip to
  content" / "Zum Inhalt springen" / "Saltar al contenido", con destino
  `<main id="main" tabindex="-1">`.
- Seis `<main>` tenían `id="top"` (home y /about/, ×3) y pasan a `id="main"`.
  Los enlaces de marca de la home apuntan a `#top`, que según el estándar
  HTML lleva al inicio del documento aunque no exista el id. Verificado:
  `scrollY 3000 → 0` en /, /de/ y /es/.
- El CSS va al final de `/nav.css`, que es la única hoja que cargan todas las
  páginas. Tiene z-index 100: por encima de la barra (20) y del menú móvil
  (60), y por debajo del banner de cookies. La tabla de apilado del
  comentario de `/nav.css` se actualizó.

**Prueba de teclado** (37 páginas × 1440/390 px, visitante que ya decidió las
cookies): Tab → skip link visible y encima de todo; Enter → foco en `<main>`;
Tab → primer enlace dentro de `<main>`.

```
pages x widths: 74  fails: 0
PASS 1440 /about/   tab1="Skip to content" visible=true onTop=true enter->#main tab2-> A "01 Approach" inMain=true
```

**Compromiso.** En la **primera visita**, `consent.js` pone el foco en el
banner de cookies (es su diseño), así que el primer Tab va al banner y no al
skip link. Tras decidir, el skip link es la primera parada. Se dejó así
porque cambiarlo implica tocar el banner (fuera de alcance), y es el mismo
patrón modal ya documentado en `/nav.css`.

**Espejo:** Motion tiene que recibir el `/nav.css` nuevo. Sin el marcado
`<a class="skip-link">` en sus páginas, el CSS no tiene efecto allí, así que
no rompe nada. Si se quiere el skip link también en Motion, falta añadir ese
marcado y el `id="main"`.

---

## 8. Reveal: `351f785`

- Un `<script>` inline al principio del `<head>` añade `.js` a `<html>` antes
  del primer pintado. `.reveal`, `.reveal.visible` y la regla de
  `prefers-reduced-motion` pasan a `.js .reveal…` en las 12 páginas que lo
  usan (home, /about/, /work/ y /leadership-framework/, ×3).
- Los H1 de /about/ y /leadership-framework/ (×3) ya no aparecen con fundido.

| Página | Bloques reveal | Sin JS: ocultos | Con JS: ocultos al cargar | Reduced motion: ocultos |
|---|---|---|---|---|
| / ×3 | 31 | 0 | 24 | 0 |
| /about/ ×3 | 55 | 0 | 50 | 0 |
| /work/ | 6 (5 en DE/ES) | 0 | 5 (4) | 0 |
| /leadership-framework/ | 57 (56 en DE/ES) | 0 | 51 | 0 |

Antes, sin JS, los 149 bloques quedaban a `opacity:0`. Con JS todos aparecen
al hacer scroll. La única excepción es `.toc-wrap` de /LF/, que está en
`display:none` a 1440 px y nunca entra en pantalla; ya pasaba igual antes.

LCP en local (mediana de 5): **/about/ 84 → 72 ms**, **/LF/ 96 → 64 ms**.

**No se tocó el H1 de la home** porque el parte limitaba esto a /about/ y /LF/.
Sigue con fundido de entrada, igual que el resto del hero. Queda como
pendiente.

---

## 9. Enlace de Privacy y eyebrow de /alcorte/: `baa1bcb`

- **/contact/**: el pie enlazaba Privacy a `/datenschutz/` y ahora va a
  `/privacy/`. **/es/contact/** tenía el mismo fallo y ahora va a
  `/es/privacidad/`; se arregló a la vez para que los tres idiomas sigan la
  convención (EN `/privacy/`, DE `/datenschutz/`, ES `/es/privacidad/`).
- **No se tocaron** los enlaces de la casilla de consentimiento del
  formulario, que llevan a `/datenschutz/` en los tres idiomas. El texto EN
  nombra literalmente la "Datenschutzerklärung" vinculante, y parece
  intencionado.
- **/alcorte/**: la tarjeta de cabecera repetía "Case study · Product &
  engineering" del lateral. En lugar de dejar la tarjeta sin eyebrow, ahora
  muestra las **fechas** (`2025 — Present` / `heute` / `actualidad`, según
  /work/), que es el patrón de los otros cuatro casos.

---

## 10. JSON-LD `Person`: `635933f`

Lo genera **`scripts/build_jsonld.js`** (`npm run jsonld`), que lee
`cv/index.html` y escribe el bloque entre marcadores en el `<head>` de la
home y de /about/ (×3). Si el CV cambia, se vuelve a correr y ya está.

| Campo | Origen |
|---|---|
| `name`, `sameAs` (LinkedIn) | Cabecera del CV |
| `worksFor` | Entradas de Experience con "Present": Nexio Fleet GmbH (`url` nexiofleet.de), Salas UG (haftungsbeschränkt) |
| `alumniOf` | Entradas de Education **terminadas**: Ironhack (`EducationalOrganization`), Rhine-Waal University (HSRW) y Universidad La Salle (`CollegeOrUniversity`). El MSc de la HWR, en curso, queda fuera |
| `jobTitle` | "Senior Operations Leader", el posicionamiento del hero; no está en el CV |
| `address`, `email`, `image`, `url` | Datos ya públicos en el sitio |

**Desviación menor:** `nexiofleet.de` va como `url` de la organización y no
en `sameAs`. `sameAs` es para URLs que identifican *a la persona*; la web de la
empresa ahí se considera un mal uso.

**Validación contra el vocabulario oficial de schema.org**
(`schemaorg-current-https.jsonld`): cada `@type` existe y cada propiedad está
permitida en su tipo o en uno de sus padres.

```
pages: 6  identical blocks: True  errors: none
```

Además se ejecutó dos veces seguidas y el bloque no se duplica.

---

## 11. Un solo CTA principal: `13b0603`

| | Antes | Después |
|---|---|---|
| Pastillas | Start a conversation · hello@jorgeag.com · Copy · Connect on LinkedIn · Book a 30-min call | **Start a conversation →** (primaria esmeralda) |
| Secundarios | (las cuatro pastillas de arriba) | "Or directly: hello@jorgeag.com · LinkedIn · Book a 30-min call", en texto |

×3 idiomas, con los mismos destinos que antes. Se quitaron de las tres homes
el botón Copy, su función `copyEmail()` y los estilos `.btn-copy`. Las copias
de /about/ no se tocaron. Los enlaces de texto llevan `white-space:nowrap`,
porque a 390 px "30-Minuten-Gespräch buchen" se partía por el guion. No hay
errores de JS.

---

## 12. Verificación final y coherencia entre idiomas

`verify-p0.js` sobre las 37 páginas servidas:

```
runtime: 37 pages, problems: 3
ok  Bliq 4.6 anywhere served: 0 (want 0)
ok  Wolt role Feb 2023 (case header): 3 (want 3)
ok  Bolt year 2023 (2 per page): 2/2/2 (want 2/2/2)
ok  Hero "Previously" line: 3 (want 3)
ok  Case-end blocks: 15 (want 15)
ok  Visible lime strings (wolt x3): 0 (want 0)
ok  JSON-LD Person blocks: 6 (want 6)
ok  Home close pills (btn-secondary in #contact): 0/0/0 (want 0/0/0)
ok  Bliq owned: €3M + retention + team (x3): 3 (want 3)
```

Los 3 "problems" son /contact/, /de/contact/ y /es/contact/, por
`TurnstileError 110200`. Es el código de "dominio desconocido": la clave de
Turnstile solo admite jorgeag.com, así que en `localhost` falla siempre. No
viene de este lote. En las 37 páginas: skip link presente, `main#main`,
Inter cargada y 0 peticiones a Google Fonts.

---

## 13. Compromisos

- **El reposicionamiento del hero no llega a los metadatos.** `<title>`,
  `meta description` y `og:*` de la home siguen diciendo "Marketplace
  operations into systems thinking". El parte pedía solo el hero; conviene
  alinearlos en un lote corto, porque es lo que se ve al compartir el enlace.
- **El cierre de la home sigue hablando de asesoría e inversores**
  ("Founder of Salas UG advisory … investors"). Es coherente con §2.4 del
  parte (contexto secundario más abajo), pero contrasta con el hero.
- **`scripts/build_vcard.js` sigue con `TITLE:Founder + Advisor`.** No estaba
  en el alcance.
- **`/case-end.css` es una hoja nueva**, una petición más en los casos. Se
  eligió eso frente a 15 copias inline por la deriva.
- **Skip link en la primera visita:** el banner de cookies recibe el foco
  primero (§7).

## 14. Pendientes

1. **Espejo a Motion** de `/nav.css` (commit `7ba8965`), con `cp` byte a byte.
2. Revisión legal de la §10 de Datenschutz por parte de Jorge (§5.3).
3. Alinear `<title>`, `description` y `og:*` de la home ×3 con el hero nuevo.
4. **/de/work/ y /es/work/ no tienen tarjeta de Bliq** (EN sí). Ya pasaba
   antes y es un hueco de contenido.
5. El H1 y el hero de la home siguen con reveal (§8).
6. "Partnered on operations leadership for 6-person team" no está en /about/
   ni en el CV (§1.3). Decidir si se añade.
7. `TITLE` del vCard.
8. `npm run cv` necesita `cv:setup` o `PUPPETEER_EXECUTABLE_PATH`, que se usó
   aquí.

---

# Anexo: correcciones previas al push (2026-10-30)

**Commits:** `4ee1e76`, `7aabc9b`, `fd6f7ac` (sobre `d10b462`)

Este anexo cierra los dos pendientes que tenían que salir con el lote P0: los
restos del posicionamiento anterior y la tarjeta de Bliq que faltaba en
/de/work/ y /es/work/. No se tocó nada más; lo demás que salió en el barrido
está listado en §A.4 para un lote posterior.

## A.1 Metadatos de la home: `4ee1e76`

| Campo | Antes | Después |
|---|---|---|
| **EN** `<title>` | Jorge Aguilar — Marketplace operations into systems thinking · Berlin | Jorge Aguilar — Senior Operations Leader · Berlin |
| EN description | … Translating marketplace operations into systems thinking. Berlin-based operator and founder with case studies from … | Jorge Aguilar — senior operations leader for marketplaces and mobility, based in Berlin. Co-founder of Nexio Fleet; previously Bliq, Bolt and Wolt. Case studies with measured outcomes. |
| EN og:/twitter:title | … Marketplace operations into systems thinking | Jorge Aguilar — Senior Operations Leader, Marketplaces &amp; Mobility |
| EN og:/twitter:description | Translating marketplace operations into systems thinking. Berlin. Co-founder @ Nexio Fleet. | Senior operations leader for marketplaces and mobility. Co-founder @ Nexio Fleet. Previously Bliq, Bolt, Wolt. Berlin. |
| **DE** `<title>` | … Marketplace-Operations in Systems Thinking · Berlin | Jorge Aguilar — Senior Operations Leader · Berlin |
| DE description | … in Systems Thinking übersetzen. Operator und Gründer in Berlin … | Jorge Aguilar — Senior Operations Leader für Marktplätze und Mobilität in Berlin. Mitgründer von Nexio Fleet, zuvor bei Bliq, Bolt und Wolt. Fallstudien mit messbaren Ergebnissen. |
| DE og:/twitter:title | … Marketplace-Operations in Systems Thinking | Jorge Aguilar — Senior Operations Leader für Marktplätze &amp; Mobilität |
| DE og:/twitter:description | … in Systems Thinking übersetzen. Berlin. Mitgründer @ Nexio Fleet. | Senior Operations Leader für Marktplätze und Mobilität. Mitgründer @ Nexio Fleet. Zuvor Bliq, Bolt, Wolt. Berlin. |
| **ES** `<title>` | … Operaciones de marketplace en pensamiento sistémico · Berlín | Jorge Aguilar — Líder sénior de operaciones · Berlín |
| ES description | … Traduciendo operaciones de marketplace en pensamiento sistémico. Operador y fundador … | Jorge Aguilar — líder sénior de operaciones para marketplaces y movilidad, con base en Berlín. Cofundador de Nexio Fleet; antes en Bliq, Bolt y Wolt. Casos de estudio con resultados medibles. |
| ES og:/twitter:title | … Operaciones de marketplace en pensamiento sistémico | Jorge Aguilar — Líder sénior de operaciones, marketplaces y movilidad |
| ES og:/twitter:description | Traduciendo … pensamiento sistémico. Berlín. Cofundador @ Nexio Fleet. | Líder sénior de operaciones para marketplaces y movilidad. Cofundador @ Nexio Fleet. Antes en Bliq, Bolt y Wolt. Berlín. |

- Los `<title>` se acortaron a nombre + rol + ciudad (unos 50 caracteres)
  para que Google no los corte. La frase larga va en og:title, que no tiene
  ese límite.
- **og:image:** `og-card-1200x630.png` no tiene texto, así que no lleva ningún
  lema desfasado. Sigue dibujada con el **acento lima** de antes del cambio a
  esmeralda; queda como pendiente visual (§A.5).

## A.2 vCard y cierre de la home: `7aabc9b`

- **vCard** (`scripts/build_vcard.js` → `npm run vcard`): `TITLE:Founder +
  Advisor` → `TITLE:Senior Operations Leader`. La `NOTE` decía también
  "Translating marketplace operations into systems thinking" y ahora dice
  "Senior operations leader for marketplaces and mobility. Co-founder, Nexio
  Fleet GmbH. Based in Berlin." Se regeneraron `jorge-aguilar.vcf` y
  `contact/vcard-qr.svg` (524 bytes, QR versión 15, nivel L).
- **Párrafo de cierre de la home**: se mantienen el titular y el CTA único.

| | Antes | Después |
|---|---|---|
| EN | Founder of Salas UG advisory. Co-founder of Nexio Fleet. Open to strategic conversations with operators, founders, and investors in mobility and logistics. | Looking for a senior operations leader for a marketplace or mobility business? I'm based in Berlin and work across EMEA — tell me about the team and where operations needs to go next. |
| DE | Founder von Salas UG Advisory. Co-Founder von Nexio Fleet. Offen für strategische Gespräche mit Operators, Gründern und Investoren … | Sie suchen eine Senior-Operations-Führungskraft für einen Marktplatz oder ein Mobilitätsunternehmen? Ich sitze in Berlin und arbeite EMEA-weit — erzählen Sie mir vom Team und davon, wohin sich Ihre Operations entwickeln sollen. |
| ES | Founder de Salas UG Advisory. Co-founder de Nexio Fleet. Abierto a conversaciones estratégicas con operadores, fundadores e inversores … | ¿Busca un líder sénior de operaciones para un marketplace o una empresa de movilidad? Estoy en Berlín y trabajo en toda EMEA: cuénteme sobre el equipo y hacia dónde necesitan llegar sus operaciones. |

## A.3 Tarjeta de Bliq en /de/work/ y /es/work/: `fd6f7ac`

- La tarjeta (copia, diagrama del flywheel traducido y botón "Diagramm
  ansehen" / "Ver diagrama") es **la misma que ya estaba en la home DE/ES**,
  así que no hay una tercera traducción. La versión EN de home y /work/ es
  idéntica salvo por la codificación de entidades, lo que confirma que la
  tarjeta de /work/ es la de la home.
- Va como **02**, detrás de Nexio y como en EN. Las demás se renumeran 03–06.
- Los ledes ahora cuentan **seis** proyectos ("Zwei wurden gebaut, vier
  repariert" / "Dos se construyeron, cuatro se arreglaron"). En la meta
  description, og y twitter, "fünf/cinco" pasa a "sechs/seis" y se añade Bliq
  a la lista de proyectos.
- **Coherencia:** la tarjeta "Next case study" de /de/bolt/ y /es/bolt/
  (lote anterior) usaba un título de Bliq inventado por mí. Ahora usa el
  mismo título que la home y /work/.

**Verificación:**

```
work:    6 cards | 01 02 03 04 05 06 | bliq-cta: /bliq/
de/work: 6 cards | 01 02 03 04 05 06 | bliq-cta: /de/bliq/
es/work: 6 cards | 01 02 03 04 05 06 | bliq-cta: /es/bliq/
order EN: /nexio/ /bliq/ (solo) /wolt/ /bolt/ /alcorte/      same order in DE/ES: true
/de/work/ link /de/bliq/ -> 200 "Fleet Supply bei Bliq neu aufbauen — Jorge Aguilar"
/es/work/ link /es/bliq/ -> 200 "Reconstruir la oferta de flotas en Bliq — Jorge Aguilar"
toggle móvil: none/0 -> block/240 (DE), block/257 (ES); aria-expanded=true
etiquetas del SVG sin desbordar; 0 errores de JS
```

## A.4 Barrido de cadenas desfasadas (después de estos commits)

`git grep` sobre todo el repo, sin `.reports/` ni `node_modules/`.

**"systems thinking" / "Systems Thinking" / "pensamiento sistémico":**

| Dónde | Qué | Valoración |
|---|---|---|
| `manifest.json` | `"description": "Founder + Advisor, Berlin. Translating marketplace operations into systems thinking."` | **Desfasado.** Metadato de la PWA; es lo único que queda con "Founder + Advisor" |
| `work/`, `de/work/`, `es/work/` meta description + og + twitter (×3 cada uno) | "Translating marketplace operations into systems thinking — six projects …" | **Desfasado.** Mismo patrón que tenía la home |
| `about/` ×3 meta description | "… operator and founder translating marketplace operations into systems thinking" | **Desfasado** (y dice "founder") |
| `cv/index.html` tagline | "Translating marketplace operations into systems thinking — Berlin." | **Desfasado** en el PDF del CV. El parte excluía tocar /cv/ más allá de cifras |
| Home ×3, lede de "How I work" | "the principles that turn marketplace operations into systems thinking" | **Legítimo.** Describe el método, no el rol |

**"Founder + Advisor":** solo queda `manifest.json`.

**"advisor / advisory / Beratung / asesoría":**

| Dónde | Qué | Valoración |
|---|---|---|
| `contact/` ×3 meta + og + twitter | "advisory, investment, speaking or collaboration …" / "Beratung, Investment, Vortrag …" / "asesoría, inversión, conferencias …" | **Desfasado** frente al foco de contratación |
| `contact/` ×3 lede | "Founder of Salas UG advisory. Co-founder of Nexio Fleet. …" | **Desfasado.** Es el mismo texto que se cambió en la home |
| `about/` ×3, párrafo de cierre | "Founder of Salas UG advisory … investors …" | **Desfasado.** Copia del antiguo cierre de la home |
| `contact/` ×3, opción del formulario | `<option value="advisory">Advisory / Consulting</option>` | **Discutible.** Es un tipo de consulta que alguien puede seguir queriendo hacer |
| `about/` ×3, experiencia | "independent advisory", "Advisory engagements in compliance system design …" | **Legítimo.** Describe Salas UG con exactitud |
| `cv/index.html` | "Advisory vehicle for fleet operations …" (Salas UG) | **Legítimo** |
| Datenschutz / Privacidad / alcorte / nexio (DE/ES) | "steuerliche … Beratung", "asesoramiento jurídico", "Steuerberater" | **Legítimo.** Otro sentido de la palabra |

## A.5 Pendientes que deja este anexo

1. Alinear los restos de §A.4: `manifest.json`, los metadatos de /work/,
   /about/ y /contact/ (×3), el lede de /contact/ (×3), el párrafo de cierre de
   /about/ (×3) y, si Jorge lo decide, el tagline del CV.
2. `og-card-1200x630.png` sigue con el acento lima.
3. **Fallo previo**, detectado al verificar: en /de/work/ y /es/work/, el
   script del botón del diagrama cambia la etiqueta a inglés al pulsarlo
   ("Hide diagram" / "View diagram"). Afecta a todas las tarjetas, no solo a la
   nueva.
4. Siguen en pie los de la ejecución P0: espejo de `/nav.css` a Motion
   (`7ba8965`) y revisión legal de la §10 de Datenschutz.

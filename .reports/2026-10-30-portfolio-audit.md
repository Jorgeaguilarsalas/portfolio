# Auditoría del portafolio + benchmark: jorgeag.com

**Fecha:** 2026-10-30
**Rama:** `main` (sobre `f6699f0`)
**Alcance:** solo auditoría y recomendaciones. **Cero cambios en producción y
cero mockups.** Los mockups los generará otro chat a partir de este informe.
**Referencia de entrada:** `.reports/2026-10-30-portfolio-audit/koray-inventory.md`

**Cómo se midió.** Las páginas se sirvieron en local (`python3 -m http.server`)
y se recorrieron con Chrome 156 headless a 1440 px y a 390 px: capturas, DOM
computado, métricas de carga y conteos de SVG, CTA y reveals. Las cifras salen
del HTML de este repo, no de suposiciones. Los benchmarks externos se
consultaron en la web el mismo día (§2). Lo que es inferencia está marcado como
tal.

---

## 0. Resumen ejecutivo

**Nota global: 7/10.** El fondo está por encima de la media de portafolios de
operaciones: casos con atribución explícita, diagramas propios bien
etiquetados, tres idiomas completos y trabajo serio de accesibilidad. Lo que le
separa de "world-class" no es visual. Es **coherencia de las cifras** y
**claridad de a quién le habla**.

- **Las cifras no cuadran entre páginas, y eso es lo más urgente.** La home
  dice 4.7× y 4.6× para el mismo dato. "€3M ARR" y "6 direct reports" (Bliq)
  solo están en home y /about/: no aparecen ni en el caso de Bliq ni en el CV.
  Las fechas de Wolt difieren entre el caso y el CV (§1.2). Para un perfil
  senior, una cifra que no resiste el cruce vale menos que ninguna.
- **El público objetivo no está decidido.** El hero dice "Founder + Advisor",
  /contact/ habla de "advisory, investment, speaking" y el objetivo de este
  parte es "senior ops leader". Cada lector (contratación, cliente de
  asesoría, inversor) necesita un primer pantallazo distinto.
- **La lista de adopción de Koray importa patrones de diseñador freelance.**
  Dos de los siete ítems ya existen (hover en acento y reveal al hacer scroll).
  Otros dos son identidad de marca personal (monograma, retrato a color) que no
  aportan evidencia. La mayor parte del valor está en lo que Koray **no** tiene.
- **Los diagramas son buenos, pero hay menos de los que se creía.** En /nexio/
  hay 3 diagramas más 8 iconos (no 12), y en /wolt/ hay 2 más 4 iconos (no 6).
  La página que más necesita un diagrama, el framework de 7 capas, no tiene
  ninguno: sus 26 SVG son chevrons de acordeón.

**Top 3 por ROI**

1. **Auditoría de cifras y una sola fuente de verdad** (P0, ~3 h + decisiones de
   Jorge). Cada número del sitio enlazado a su caso, con la misma redacción y
   el mismo nivel de atribución.
2. **Hero orientado a un público** (P0, ~2 h de copy + 1 h de implementación).
   Rol, dominio y una prueba, en una frase que un hiring manager entienda en
   5 segundos.
3. **Diagrama del modelo de 7 capas, más navegación al final de cada caso**
   (P0/P1, ~6 h). Es la pieza diferencial del sitio y hoy es texto plegado. Los
   casos terminan sin "siguiente caso" ni CTA.

---

## 1. Hallazgos por dimensión

### 1.1 Diseño visual: 7.5/10

**Lo que funciona**

- **Sistema de tokens coherente.** Fondo `#0B0B0D`, `--muted #B4B4BB` (ya
  unificado, incluido /cv/ desde `f92a82d`), acento `#10B981`, Inter + JetBrains
  Mono. Nav, overlay móvil y pie son idénticos en las 38 páginas (verificado en
  los lotes #1–#3).
- **Tipografía con jerarquía clara.** Titulares en mayúsculas de peso 900 con
  la segunda mitad en gris, eyebrows en mono y cuerpo en Inter regular. Se lee
  rápido.
- **Los diagramas de caso** (Nexio, Wolt, Bliq, Bolt) son lo mejor del sitio
  visualmente (§1.4).

**Lo que no funciona**

- **El mismo tratamiento en todos los titulares.** Seis H2 seguidos en la home
  con la misma fórmula (mayúsculas, 900, mitad gris, punto final). Cuando todo
  grita, nada destaca. Además el copy es genérico: *"The measurable outcomes of
  my work."*, *"Building something interesting?"*.
- **La mitad derecha del hero está vacía a 1440 px.** Koray también deja
  espacio negativo, pero lo compensa con el monograma. Aquí no hay nada: ni
  retrato, ni cifra, ni artefacto.
- **Ocho cifras antes de la primera historia.** La franja del hero (800+, 8,
  €3M, 6) y "Selected impact" (60–70%, 30%, >80%, 4.7×) van una detrás de otra.
  Dos de las ocho repiten Nexio y la densidad diluye la cifra fuerte.
- **Esmeralda y crema.** El esmeralda trabaja: CTA, cifras, trazos de diagrama
  y estado activo, y es la única señal de "acción" del sitio. El crema
  (`--accent-secondary:#E8DFC7`) está declarado en 35 ficheros, pero **solo se
  usa en las citas destacadas** (borde y texto) de /wolt/, /bliq/ y del
  "working principle" de /LF/. Ahí funciona como voz de cita, distinta de la
  voz de acción, y ese es un buen uso. Fuera de eso es decorativo. Si los
  testimonios (ítem 7) se hacen, el crema es su color natural, y eso le daría
  un papel claro.
- **La tarjeta de Bliq en home y /work/** deja un hueco vacío de ~150 px sobre
  el diagrama de la columna izquierda (visible en ambas capturas).

### 1.2 Estrategia de contenido: 6.5/10

**Posicionamiento.** *"Translating marketplace operations into systems
thinking."* es una buena frase de método, pero no dice qué rol, ni para quién,
ni con qué prueba. Para un hiring manager, "systems thinking" es la etiqueta
más común en perfiles de operaciones. La prueba está en los casos, no en la
frase. El eyebrow "FOUNDER + ADVISOR · BERLIN · EMEA" empuja hacia consultoría,
no hacia un rol senior.

**Densidad de evidencia.** Es alta en los casos y débil en la portada:

| Cifra | Home | /about/ | Caso | CV | Estado |
|---|---|---|---|---|---|
| Crecimiento de drivers en Bliq | **4.7×** (stats) y **4.6×** (tarjeta) | 4.7× | 4.6× "company-level" | 4.6× | ✗ contradicción en la misma página |
| €3M ARR, piloto de 4 meses (Bliq) | sí | sí | **no** | **no** | ✗ sin respaldo en el caso |
| 6 direct reports (Bliq) | sí | no | **no** | **no** | ✗ sin respaldo |
| Retención de partners <50% → >80% (Bliq) | sí | sí | **no** | **no** | ✗ sin respaldo |
| Wolt, fechas del rol | Feb 2021 – Feb 2023 | — | **Feb 2021 – Jan 2022** | Feb 2021 – Feb 2023 | ✗ difieren |
| Bolt 25% → 58% | sí | sí | sí, "August–September" sin año | sí | ~ año ambiguo |
| Nexio 800+ / 8 / 60–70% | sí | sí | sí | sí | ✓ |

El caso de Bliq tiene una sección modélica de atribución ("What I owned / what
I didn't"). Por eso pesa tanto que la home ponga encima la cifra más grande del
sitio (€3M ARR) sin esa atribución y sin fuente. Un lector senior cruza
exactamente esto. **No se puede saber desde el repo cuál es la cifra
correcta**; la decisión es de Jorge.

Del parte también hay que aclarar dos cosas. Dice "consulting Wolt/Bolt", pero
el sitio y el CV las presentan como **empleo** (Operations Associate,
Operations Specialist). Y "co-founder 33% Nexio Fleet" no aparece en ninguna
página, lo cual está bien: el porcentaje de equity no tiene por qué ser
público.

**Señales de confianza.** Hay tres cartas de referencia (Nexio CEO, Bliq y
Wolt), y la de Nexio es pública como PDF. Los certificados van a un enlace de
Google Drive. No hay logos, testimonios ni citas. El material para testimonios
**ya existe** en las cartas (§3, ítem 7).

**Arco narrativo de la home:** hero → cifras → cifras → 2 casos → publicación
(1 field note) → enfoque → experiencia → contacto. Es correcto pero plano: no
hay un momento en el que el lector entienda *por qué este perfil y no otro*.
Esa es la función del bloque "manifiesto" en Koray y de las "questions" o el
"about" en los benchmarks (§2).

**CTA.** El hero está bien (uno primario y uno secundario). El cierre tiene
**cinco CTA de igual peso**: Start a conversation, email, Copy, LinkedIn y
Book a 30-min call. Los casos **no tienen CTA final** (solo el pie con
Impressum y Privacy): quien termina de leer Bolt no tiene ningún paso
siguiente.

**Tono EN/DE/ES.** Es coherente. Alemán con "Sie" en todo el sitio, español
con "usted" ("¿Está construyendo…?") y los mismos titulares traducidos con
cuidado (`&shy;` en compuestos alemanes). Hay una incidencia concreta: **copy
desfasado del acento lima** en los tres /wolt/ ("the lime path",
"limettenfarbene Pfad", "trazo lima"; 6 cadenas). El trazo ya es esmeralda.

### 1.3 Integridad estructural: 7.5/10

| Aspecto | Medido | Valoración |
|---|---|---|
| Navegación | 5 entradas + idioma + CTA, idéntica en 38 páginas; estado activo subrayado en acento | ✓ |
| Longitud de página (1440 px) | home 6.4k px · /about/ 7.0k · /bliq/ 7.9k · /alcorte/ 11.0k · /leadership-framework/ 11.5k · **/wolt/ 13.2k** (17.7k en móvil) | Wolt y LF piden un TL;DR al inicio |
| Móvil | Overlay con trampa de foco (lote #1); nav y pie con contraste AA | ✓ |
| Peso (390 px, servidor local sin compresión) | home 13 req / 378 KB · /about/ 13 / 304 KB · /wolt/ 12 / 74 KB · /LF/ 12 / 121 KB | ✓ ligero; ningún framework JS |
| Fuentes | **Google Fonts desde `fonts.googleapis.com` en 39 HTML, antes del consentimiento** | ✗ riesgo legal en DE (LG München I, 20.01.2022, 3 O 17493/20) aunque esté declarado en §10 de Datenschutz; además es un salto de red extra |
| CLS | 0 en las cuatro páginas medidas | ✓ |
| LCP | /LF/ 792 ms en local frente a 76–340 ms el resto: su H1 lleva `.reveal`, así que el LCP espera al observer y a la transición de .7 s | ~ |
| Reveal sin JS | `.reveal{opacity:0}` sin compuerta `html.js`: si el JS falla, **149 bloques quedan invisibles** (home 30, /about/ 56, /work/ 6, /LF/ 58) | ✗ |
| Skip link | 0 páginas | ✗ (WCAG 2.4.1) |
| Datos estructurados | Sin JSON-LD `Person` | ✗ oportunidad SEO para búsquedas por nombre |
| Alt / aria | 0 `<img>` sin alt; diagramas con `role="img"` y `aria-label` descriptivo | ✓ |
| hreflang / canonical / og:image | Presentes en todas las páginas | ✓ |
| Enlaces legales | `/contact/` enlaza Privacy a `/datenschutz/`; el resto del sitio, a `/privacy/` | ~ inconsistencia menor |

### 1.4 Diagramas: 7.5/10

**Inventario real** (SVG con `viewBox` mayor de 24×24 y `aria-label`):

| Página | Diagramas | Iconos | Nota | Comentario |
|---|---|---|---|---|
| /nexio/ | 3 (pipeline con variante móvil vertical, mock de tabla de turnos, arquitectura de ingesta) | 8 | **8.5** | El pipeline con su variante móvil es lo mejor del sitio. El pie "Rebuilt for this case study" da honestidad. |
| /wolt/ | 2 (bucle de método y ciclo del material) + 5 fotos reales | 4 | **8** | La única página con fotografía real; el bucle del material cuenta la historia por sí solo. Copy "lime" desfasado. |
| /bliq/ | 2 (ciclo de churn y flywheel) | 0 | **8** | El par "bucle vicioso → flywheel" es narrativa visual de verdad: antes y después en la misma gramática. |
| /bolt/ | 1 (embudo de 5 etapas) | 0 | **7** | Correcto; le falta marcar dónde estaban las 5 fricciones sobre el propio embudo. |
| /alcorte/ | 1 | 0 | **6.5** | Página de 11k px con un solo diagrama para una arquitectura agéntica. |
| /leadership-framework/ | **0** | 26 (chevrons) | **4** | El "layered operating model" se describe en texto. Es el hueco más caro del sitio. |
| home y /work/ | 2–5 miniaturas 480×330 | — | **7** | Coherentes entre sí; la de Bliq deja un hueco arriba. |

**Planos frente a animados.** Los diagramas actuales son estáticos, legibles y
accesibles. Que no se muevan no es su problema. Los patrones animados de
referencia (Koray: nube de puntos que se ensambla en diagrama) son **ilustración
decorativa**, no diagramas de información, y no hay nada que leer en ellos. En
un diagrama de información, la animación solo se justifica si **enseña orden o
dirección** que el estático no enseña (un flujo, un bucle o un embudo que se
estrecha). Ver §3, ítem 5.

---

## 2. Benchmark

### 2.1 Qué se observó

Consultado el 2026-10-30 con WebFetch y el HTML en crudo. Se ven sin JS, así
que la motion se infiere del marcado.

| Referencia | Primer pantallazo | Prueba | Visual | CTA |
|---|---|---|---|---|
| **Patrick Collison** (patrickcollison.com) | Solo el nombre y 15 enlaces; `#content` vacío | Instituciones que fundó; /questions y /fast con datos y fuentes | Helvetica 13 px, sin animación | Email en texto plano |
| **Julie Zhuo** (juliezhuo.com) | Nombre + 4 roles en una línea cada uno ("Founder at Sundial", "Author of…") | Libro, ensayos en HBR y Substack | Una foto de fondo a sangre | Ninguno |
| **Lenny Rachitsky** (lennyrachitsky.com) | "Hi, I'm Lenny 👋", qué hace, "1,000,000+ subscribers" | Una cifra de audiencia; ni menciona Airbnb | Framer, microanimación de texto | Uno solo: Subscribe |
| **Shishir Mehrotra** (shishir.co no resuelve DNS; su home está en Coda/Superhuman) | "Welcome to my homepage…" + newsletter | Frameworks con nombre (Eigenquestions, *Rituals of Great Teams*, libro con 1,000+ entrevistas) + log fechado "Latest Highlights" | Documento de su producto | Newsletter + "contribuye al borrador" |
| **First Round** (firstround.com/team) | Ficha: cita en primera persona → 3 cifras destacadas → bio en tercera persona con empleadores y fechas → "Hear more from…" | Cifras de escala ("200 million users", "75+ founders") dentro de frases | Diseñado, con fotografía | Por ficha, contenido relacionado |

Comparables de operaciones de verdad, verificados:

| Referencia | Primer pantallazo | Prueba |
|---|---|---|
| **Molly Graham** (mollygraham.com; operaciones en CZI, Quip y Lambda School; ex-Facebook) | "Scaled organizations from 5 to 5,000" + newsletter | Frameworks con nombre ("Give Away Your Legos", "Waterline Model") **publicados por terceros** (First Round Review, Lenny's). Servicio de speaking con formulario, sin precios |
| **Josh Mohrer** (joshmohrer.com; ex-GM de Uber New York) | "I build things…" / "Previously, General Manager of Uber New York." | El rol de Uber en una línea; el resto es personalidad (carreras con datos GPS) |
| **Brie Wolfson** (briewolfson.com; ex-Stripe, planificación y M&A) | "Hello! I'm Brie. weird but warm" + email | Proyectos de operaciones descritos por **mecanismo** ("created a process that fit our organizational structure…"), ensayos en First Round Review |

No se encontró ningún sitio personal de líderes de operaciones europeos de
marketplace o movilidad (Bolt, Wolt, Delivery Hero, Glovo). Esa ausencia
también es un dato: **el nicho está vacío**.

### 2.2 Qué hacen distinto los portafolios senior de operaciones frente a los de diseño o UX

1. **La prueba es el pensamiento escrito, no la galería.** Todos los
   operadores ponen en el centro textos propios (preguntas, ensayos,
   frameworks). Koray pone en el centro sus servicios.
2. **El artefacto estrella es un framework con nombre, y validado fuera.** Los
   de Graham y Shishir están publicados por First Round Review, Lenny's o un
   libro. Que un tercero lo haya publicado vale más que el propio sitio.
3. **Cero testimonios en los 8 sitios.** La credibilidad la dan dónde ha salido
   el trabajo y los empleadores con nombre. El único bloque de logos está en la
   página de servicios de pago de Graham, no en la home.
4. **Pocas cifras, grandes y de escala, dentro de frases.** "5 to 5,000",
   "200 million users". Ningún sitio usa una rejilla de KPI. First Round usa
   como mucho 3 cifras destacadas.
5. **Los empleadores van en una línea**, no en un timeline: "Previously, General
   Manager of Uber New York."
6. **Lo visual es sobrio.** Ningún sitio de operador tiene partículas ni
   marquesina de logos. Cuando hay diseño, es foto, mapa o ilustración.
7. **El CTA es una relación, no un precio.** Newsletter, email o nada. Nadie
   publica un producto con precio cerrado.
8. **Personalidad y presente.** Un "now" fechado (Shishir), aficiones con datos
   (Mohrer), aforismos (Wolfson). Sustituye al bloque de testimonios.
9. **El trabajo de operaciones se describe por mecanismo**, no por pantallas.

### 2.3 Dónde está jorgeag.com frente a esto

**Por delante de casi todos:** en profundidad de caso (atribución explícita,
diagramas propios, fechas, cifras con fuente) y en lo multilingüe. Ningún
benchmark tiene un caso como /bliq/. Eso es una ventaja real y hay que
protegerla, sobre todo haciendo que las cifras de la home estén a la altura del
caso (§1.2).

**Por detrás:**

- **Escritura.** Hay una sola field note (Motion FN01, 2026-09-20).
- **Validación externa del framework.** Las 7 capas solo viven en este sitio.
- **Presente.** No hay "now" ni disponibilidad.
- **Primer pantallazo.** Dice método ("systems thinking") en lugar de rol y
  escala.

**La lección para la lista de Koray:** los patrones de Koray (marquesina,
bocadillos, partículas, monograma, servicio con precio) son exactamente los
que **ningún** operador del benchmark usa. Eso no los convierte en malos. Sí
indica que no son lo que distingue a un perfil senior de operaciones.

---

## 3. Veredicto sobre la lista preliminar

### Propuestos para adoptar

**1. Subrayado al pasar el ratón en el nav, en esmeralda: alternativa (casi
hecho).** El hover ya cambia el color a acento (`.nav-links a:hover
{color:var(--accent)}`) y la página activa ya lleva subrayado esmeralda. Lo
único que falta es el subrayado en hover, que es cosmético. Si se hace, que
sea en `/nav.css` y aplicado igual a `:focus-visible`, para que teclado y ratón
vean lo mismo. **Ojo:** `/nav.css` es canónico y lo comparte Motion, así que el
cambio se lleva a mano a su repo. **Esfuerzo:** 0.5 h + sincronizar Motion.
**Impacto:** mínimo.

**2. Fade-in de secciones al hacer scroll: en desacuerdo con ampliarlo; arreglar
lo que hay.** Ya está implementado con IntersectionObserver en home, /about/,
/work/ y /LF/ (149 elementos, con `prefers-reduced-motion` respetado).
Problemas actuales: (a) sin compuerta JS, el contenido es invisible si el
script falla; (b) los H1 de /about/ y /LF/ llevan `.reveal`, lo que retrasa el
LCP y hace que lo primero que se ve sea un hueco. Recomendación: gate con
`html.js .reveal`, sacar todo lo que esté por encima del pliegue y **no**
extenderlo a los casos de estudio, que son lectura larga donde el fade-in
estorba. **Esfuerzo:** 1.5 h (×3 idiomas, mecánico). **Impacto:** medio
(robustez y LCP).

**3. Franja de logos de empleadores (Wolt, Bolt, Bliq, Nexio Fleet, GYG, Uber
Bavaria): alternativa.** En Koray es "VERTRAUEN VON", es decir, *clientes*. En
un perfil empleado, una franja de logos dice "trusted by" donde la verdad es
"worked at", y eso lo detecta un lector senior. Además:

- **GYG y Uber Bavaria no aparecen en ningún sitio**, ni en el CV ni en el
  portafolio. Uber solo sale como plataforma integrada en Nexio. Un logo sin
  rastro en el CV es justo el tipo de afirmación que no resiste el cruce
  (§1.2).
- Los logos de terceros tienen guías de marca. Usarlos para promoción personal
  sin permiso es un riesgo menor pero real.

Alternativa: mantener la línea de texto "Previously: Bliq · Bolt · Wolt", que
ya existe en la sección de experiencia, y **subirla al hero** como línea de
credenciales, con cada nombre enlazado a su caso. Si se quieren wordmarks, que
sean monocromos, solo empresas presentes en el CV y con el rótulo "Operated at".
**Esfuerzo:** 1 h la versión de texto; 4 h la de logos. **Impacto:** alto en
la versión de texto (credencial en los 5 primeros segundos).

**4. Monograma "JA" grande en hero y pie (bookend): en desacuerdo.** El
monograma de Koray es identidad de un diseñador; su oficio *es* la marca. En un
perfil de operaciones, crear un logotipo propio no aporta evidencia y consume
el espacio del hero que hoy está vacío y que debería llevar prueba. El
"bookend" sí es buena idea **como estructura**: abrir y cerrar con la misma
afirmación. Alternativa: que el cierre retome la tesis del hero con la prueba
ya leída ("…y así es como se ve en Bolt, Bliq y Nexio"). **Esfuerzo del
monograma:** 6–10 h (diseño + 38 páginas). **Impacto:** bajo.

**5. Revelado de diagramas con `stroke-dashoffset` (12 de Nexio + 6 de Wolt):
alternativa acotada.** Son 8 diagramas reales en todo el sitio, no 18, y el
resto son iconos. Animar por animar resta. Hacerlo solo donde el trazo enseña
dirección:

- **Bliq**, churn → flywheel. El bucle se dibuja en su sentido de giro.
- **Wolt**, ciclo del material. El trazo esmeralda recorre el bucle una vez y
  el material "vuelve".
- **Nexio**, pipeline. Las cinco etapas se encienden en orden y el corchete
  "runs unattended" aparece al final.

Una sola vez por vista, con etiquetas visibles desde el principio (solo se
anima el trazo), y desactivado con `prefers-reduced-motion`. **Esfuerzo:**
2–3 h por diagrama, ~8 h los tres. **Impacto:** medio. Es el único ítem de
motion que añade comprensión.

**6. Retrato a color en /about/: neutral, más bien en desacuerdo con el
color.** El retrato B/N en círculo encaja con la interfaz monocroma, igual que
el de Koray, que también es oscuro. Que sea en color no cambia nada para un
reclutador. Lo que sí cambia es que **la home no tiene ninguna cara**: el
retrato solo está en /about/. Alternativa: llevar ese mismo retrato, más
pequeño, al hero de la home o al bloque de cierre. **Esfuerzo:** 1–2 h.
**Impacto:** medio.

**7. Testimonios en tarjetas tipo bocadillo (requiere pedir citas): de acuerdo
con los testimonios, en desacuerdo con el bocadillo y con salir a pedirlas ya.**
El bocadillo es un recurso juguetón de portafolio de diseño; en senior, una
cita sobria con nombre, cargo y **relación** ("CEO de Nexio Fleet, cofundador")
pesa más. Y **las citas ya existen**: hay cartas de referencia de Nexio, Bliq y
Wolt. Primer paso, sin outreach: pedir permiso para citar 1–2 frases de cada
carta y enlazar la fuente. **Cuidado con las cartas alemanas
(Arbeitszeugnis):** usan lenguaje codificado y una frase sacada de contexto
puede leerse distinto. Mejor una cita nueva y corta de los mismos firmantes, o
su recomendación de LinkedIn. Dos o tres citas bastan; más parece relleno.
**Esfuerzo:** 3 h de implementación + tiempo de Jorge para los permisos.
**Impacto:** alto.

### Rechazados como antipatrón

| # | Ítem | Veredicto | Matiz |
|---|---|---|---|
| 8 | Red de partículas ambiental | **De acuerdo con rechazarlo** | Coste de CPU y batería en móvil, ruido detrás de texto y cero información. Es la firma de Koray; copiarla se notaría. |
| 9 | Tarifas públicas | **De acuerdo para el público de contratación** | Si Salas UG asesora de verdad, un bloque de "cómo trabajo en una asesoría" (formatos, duración, entregable), *sin precio*, sí ayuda a ese otro público. Depende de la decisión de §4 N2. |
| 10 | Name-dropping de herramientas de IA | **Parcialmente en desacuerdo** | Rechazar los sellos tipo "AI-accelerated", sí. Pero en /alcorte/ Claude + Supabase es la **arquitectura** del sistema construido; nombrarla ahí es evidencia, no adorno. Regla: herramientas solo dentro de un caso y con lo que hicieron. |
| 11 | Modelo freelance por niveles | **De acuerdo** | Contradice el posicionamiento senior. |
| 12 | Segunda rejilla numerada de proceso | **De acuerdo, y más** | El sitio ya tiene muchas listas numeradas (7 principios, 7 capas, fases 01–07 en cada caso, 5 pasos de soporte…). Lo que conviene es **reducir**, no añadir. |

---

## 4. Propuestas nuevas

Cada propuesta lleva motivo, referencia, impacto (alto/medio/bajo) y esfuerzo
en horas. Las horas cuentan los tres idiomas cuando aplica.

**N1. Registro de cifras: una sola fuente de verdad.** Una tabla (cifra →
redacción exacta → atribución → fuente → páginas donde aparece) y todas las
cifras del sitio alineadas con ella. Resuelve 4.6×/4.7×, €3M ARR, 6 reports,
>80%, fechas de Wolt y el año de Bolt (§1.2). *Ref.:* las fichas de First
Round, que ponen cada cifra dentro de una frase con contexto. **Impacto:**
alto, porque protege la ventaja principal del sitio. **Esfuerzo:** 3 h + las
decisiones de Jorge.

**N2. Decidir el público principal y reescribir el hero para él.** Hoy
conviven tres audiencias: contratación senior, clientes de asesoría (Salas UG)
e inversores ("investment" en /contact/). Propuesta: la home le habla a una (el
parte apunta a "senior ops leader") y las otras tienen su bloque secundario.
Hero tipo Zhuo/Mohrer: rol + dominio + una prueba de escala en una frase, y
la línea "Previously: Bliq · Bolt · Wolt" justo debajo. El eyebrow "Founder +
Advisor" pasa a ser coherente con esa decisión. *Ref.:* Zhuo (roles en una
línea), Mohrer ("Previously, GM of Uber New York"), Graham ("5 to 5,000").
**Impacto:** alto. **Esfuerzo:** 2 h de copy + 1 h de implementación.

**N3. Diagrama del modelo de 7 capas en /leadership-framework/.** La página
(11.5k px, ~30 acordeones plegados) explica en texto un modelo por capas. Un
solo diagrama arriba (las 7 capas, qué entra y qué sale de cada una) y el
recorrido "One problem, moving through the system" dibujado. Esto convierte
los ~4,500 palabras en algo que un hiring manager entiende en 30 s, y es el
mejor candidato del sitio para el diagrama animado bien hecho (las capas se
encienden en orden). *Ref.:* Shishir (*Rituals* como pestaña propia), Graham
("Waterline Model" con diagrama). **Impacto:** alto. **Esfuerzo:** 6–8 h.

**N4. Final de cada caso: siguiente caso + CTA.** Los 5 casos (×3 idiomas)
terminan en el pie legal. Añadir "Next case study →" y una línea de contacto
contextual ("¿Un problema de supply parecido? Hablemos"). *Ref.:* First Round
("Hear more from…"). **Impacto:** alto (hoy es un callejón sin salida).
**Esfuerzo:** 2 h.

**N5. TL;DR al inicio de cada caso.** Una caja con rol, alcance, equipo,
periodo, resultado y **qué fue mío**. Lo de Bliq §06, en 5 líneas y arriba.
/wolt/ mide 13k px en escritorio y 17.7k en móvil. *Ref.:* las 3 cifras
destacadas de First Round. **Impacto:** alto para lectores con prisa.
**Esfuerzo:** 3 h.

**N6. Fuentes autoalojadas.** Inter + JetBrains Mono servidas desde
jorgeag.com, sin `fonts.googleapis.com`. Quita el riesgo de la sentencia de
Múnich, quita la §10 de Datenschutz y ahorra la conexión a terceros.
**Impacto:** medio (legal) / bajo (rendimiento). **Esfuerzo:** 2 h (39 HTML,
mecánico) + revisar Datenschutz y Privacy.

**N7. Arreglos rápidos de calidad.**

- Copy "lime" en los 3 /wolt/ (6 cadenas).
- Skip link en las 38 páginas (WCAG 2.4.1).
- Compuerta `html.js` para `.reveal` y sacar los H1 del reveal (ítem 2).
- Enlace de Privacy en /contact/.
- Duplicado del eyebrow en /alcorte/ ("CASE STUDY · PRODUCT & ENGINEERING" dos
  veces).

**Impacto:** medio en conjunto. **Esfuerzo:** 3 h.

**N8. JSON-LD `Person`** con `jobTitle`, `worksFor`, `alumniOf` y `sameAs`
(LinkedIn), en la home y /about/ ×3. Mejora el resultado al buscar "Jorge
Aguilar" frente a homónimos. **Impacto:** medio. **Esfuerzo:** 1 h.

**N9. Cierre de la home con un CTA principal.** Hoy son cinco botones de igual
peso. Propuesta: uno primario (conversación o llamada) y el resto como enlaces
de texto. *Ref.:* Lenny (uno solo), Graham (newsletter + formulario).
**Impacto:** medio. **Esfuerzo:** 1 h.

**N10. Una sola franja de cifras en la home.** Fusionar la franja del hero y
"Selected impact" en una fila de 3–4 cifras verificadas (N1), cada una con
enlace a su caso. *Ref.:* §2.2 punto 4: pocas cifras, grandes y con contexto.
**Impacto:** medio. **Esfuerzo:** 1.5 h.

**N11. Escritura con cadencia, y el framework publicado fuera.** Es el mayor
diferencial del benchmark (§2.2, puntos 1–2). Motion tiene una nota. Propuesta:
una field note al mes y **un** texto del framework (por ejemplo "Diagnose
before levering") ofrecido a una publicación de terceros del sector (First
Round Review, Lenny's, o un medio alemán de movilidad o logística). El nicho de
"operaciones de marketplace de movilidad en Europa" no tiene a nadie
publicando (§2.1). **Impacto:** el más alto a largo plazo. **Esfuerzo:** 6–10 h
por texto, sostenido.

**N12. Bloque "Now".** Una línea fechada: en qué está, qué busca y desde
cuándo está disponible. Evita que el lector tenga que adivinar si el
cofundador de Nexio está buscando rol. *Ref.:* Shishir ("Latest Highlights"),
Mohrer ("Currently building…"). **Impacto:** medio. **Esfuerzo:** 1 h + 10 min
al mes.

**N13. Certificados en el sitio en lugar de Google Drive.** Una lista con
nombre, emisor y año, y el PDF alojado (como ya se hace con la carta de
Nexio). Un enlace genérico a Drive pierde la información y depende de un
permiso de compartición. **Impacto:** bajo-medio. **Esfuerzo:** 1.5 h.

---

## 5. Pila de prioridades

### P0: bajo riesgo, alto impacto, cuanto antes

| Ítem | Qué | Horas |
|---|---|---|
| N1 | Registro de cifras + alinear todas las páginas | 3 + Jorge |
| N2 | Público principal + hero | 3 |
| N4 | Siguiente caso + CTA al final de cada caso | 2 |
| N7 | Arreglos rápidos (lime, skip link, gate de reveal, enlace de Privacy, eyebrow duplicado) | 3 |
| N6 | Fuentes autoalojadas | 2 |
| N8 | JSON-LD `Person` | 1 |
| N9 | Un CTA principal en el cierre | 1 |
| 3 (alt.) | "Previously: Bliq · Bolt · Wolt" en el hero, en texto | 1 |
| **Total** | | **~16 h** |

### P1: inversión media, mejora clara

| Ítem | Qué | Horas |
|---|---|---|
| N3 | Diagrama de las 7 capas en /LF/ | 6–8 |
| N5 | TL;DR en cada caso | 3 |
| N10 | Una sola franja de cifras | 1.5 |
| 7 (alt.) | 2–3 citas sobrias de los firmantes de las cartas, en crema | 3 + permisos |
| 5 (acotado) | Trazo animado en 3 diagramas (Bliq, Wolt, Nexio) | 8 |
| 6 (alt.) | Retrato en la home | 1.5 |
| N12 | Bloque "Now" | 1 |
| N13 | Certificados en el sitio | 1.5 |
| 2 | (Cubierto en N7) | — |
| 1 | Subrayado en hover + `:focus-visible` en `/nav.css` | 0.5 + sincronizar Motion |
| **Total** | | **~29 h** |

### P2: gran inversión, decidir más adelante

| Ítem | Qué | Horas |
|---|---|---|
| N11 | Cadencia de escritura + framework publicado por un tercero | 6–10 por texto, sostenido |
| 3 (logos) | Wordmarks monocromos "Operated at", solo empleadores del CV | 4 + revisar permisos de marca |
| — | Bloque de asesoría (formatos, sin precio), solo si N2 decide que Salas UG es público principal | 4 |

**No hacer:** 4 (monograma), 8, 9 (con precio), 11, 12 y el reveal en los
casos de estudio.

---

## 6. Riesgos por cambio

| Cambio | Riesgo | Mitigación |
|---|---|---|
| N1 cifras | Bajar o quitar una cifra (€3M) reduce el impacto aparente de la home | Una cifra menor pero verificable vale más ante un lector que cruza datos. Si €3M es cierto, ponerlo **en el caso** con su atribución y no solo en la home |
| N2 hero | Que el reposicionamiento hacia contratación ahuyente leads de asesoría de Salas UG | Bloque secundario explícito para asesoría; /contact/ mantiene las opciones |
| N2 hero | Hay 3 idiomas: el copy nuevo tiene que sonar nativo en DE y ES, no traducido | Redactar los tres a la vez y revisar el DE con un nativo |
| N3 diagrama /LF/ | Simplificar de más el framework; un diagrama malo resta más que el texto | Partir de "The layered operating model", que ya existe, y validar con 2 lectores |
| N4/N5 casos | 15 páginas (5 casos × 3 idiomas): riesgo de deriva entre copias, como pasó con nav.css | Un mismo bloque de marcado copiado tal cual, verificado por script como en los lotes #1–#3 |
| N6 fuentes | FOUT/CLS distinto al cambiar de origen; licencia | Inter y JetBrains Mono son OFL. `font-display:swap` + `preload` del peso del H1, y medir CLS antes y después |
| N7 gate de reveal | Un fallo en el gate deja el contenido visible sin animar, o al revés | Probar con JS desactivado y con `prefers-reduced-motion` |
| N8 JSON-LD | Datos que contradigan el CV (cargos, fechas) | Generarlo desde N1/CV, no a mano |
| Ítem 1 hover | `/nav.css` es canónico y compartido con Motion | Llevarlo a mano al repo de Motion en el mismo día (patrón espejo) |
| Ítem 3 logos | Uso de marcas de terceros sin permiso; "trusted by" implica clientes; GYG y Uber Bavaria sin respaldo | Solo texto, o wordmarks con rótulo "Operated at" y solo lo que está en el CV |
| Ítem 5 trazo animado | Distraer o retrasar la lectura; romper la accesibilidad si las etiquetas se ocultan | Solo el trazo se anima, una vez y con reduced-motion; etiquetas siempre visibles |
| Ítem 7 citas | Arbeitszeugnis citado fuera de contexto (lenguaje codificado); citar sin permiso | Citas nuevas y cortas de los mismos firmantes, con permiso por escrito |
| N11 escritura | Una cadencia que no se sostiene deja un "último texto: hace 8 meses" visible | Comprometer un ritmo realista (1 al mes) y no mostrar fechas en la home si se para |
| N12 "Now" | Se queda desfasado | Fecha visible + recordatorio mensual |

---

## 7. Límites de esta auditoría

- **No se ha verificado la verdad de ninguna cifra.** Solo su coherencia entre
  páginas. Cuál es la buena (4.6× o 4.7×; si €3M ARR, 6 reports o >80% son
  ciertos y atribuibles) lo decide Jorge con sus fuentes.
- Rendimiento medido en local, sin red ni compresión. Los valores de LCP sirven
  para comparar páginas entre sí, no como cifra absoluta de producción.
- Accesibilidad revisada a mano y por script (skip link, alt, aria, foco,
  contraste ya medido en los lotes #1–#3). No se ha pasado axe ni un lector de
  pantalla real.
- Los benchmarks externos se observaron en un único momento, y sus webs pueden
  cambiar.
- Las páginas DE y ES se revisaron por muestreo (titulares, registro, cadenas
  desfasadas), no frase a frase.
- El agente de benchmark no podía ejecutar JS, así que la motion de los sitios
  de referencia en Framer, Next.js y Webflow se infiere del marcado. shishir.co
  no resuelve DNS y se usó su página en Coda/Superhuman.

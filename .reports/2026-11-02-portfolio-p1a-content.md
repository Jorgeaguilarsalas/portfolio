# Portfolio P1a — Content & UX (2026-11-02)

Nine items: eight from the P1a brief plus one P0 cleanup item deferred
from the previous session. Eight commits, 42 files, +642/−393.

| # | Item | Commit |
|---|---|---|
| 1 | Intro animation on home hero | `ab323d4` |
| 2 | Currently block, home + /about/ | `de3e775` |
| 3 | "What I do differently" on home | `a2e7837` |
| 4 | /leadership-framework/ chevrons → essay | `5c2aa01` |
| 5 | Case share images in emerald (×9) | `f6f8e5a` |
| 6 | driver → unit economics in /about/ | `18e6e7e` |
| 7 | Diagram button label on DE/ES | `11e64cf` |
| 8 | Remove unused og-card-1200x630.png | `39f1d48` |
| 9 | "Systems thinking" on home — no change | — |

Two items in the brief described the repo inaccurately and were put back to
you before any edit; both were decided and are recorded under their sections.

---

## 1. Intro animation on home hero

Staggered entrance on `/`, `/de/` and `/es/`, CSS-only.

| Element | Delay | Duration | Motion |
|---|---|---|---|
| `.hero-eyebrow` | 200ms | 400ms | fade + translateY 8px → 0 |
| `.hero-name` | 400ms | 500ms | fade + translateY 12px → 0 |
| `.hero-tagline` | 700ms | 400ms | fade + translateY 8px → 0 |
| `.hero-prev`, `.hero-actions` | 1000ms | 400ms | fade only |

Easing `cubic-bezier(.4, 0, .2, 1)` throughout; last element settles at 1400ms.

**The four elements were taken out of `.reveal`.** That was the one structural
decision here. `.reveal` is gated on `html.js` and driven by an
IntersectionObserver — fine for content below the fold, wrong for the hero,
where there is nothing to reveal on scroll and the gate only delays first
paint. They now animate from their own rule, which runs with or without
JavaScript.

**Measured opacity on first load** (headless Chrome, three languages):

```
   t(ms)     eyebrow     name  tagline     prev  actions
       0        0.00     0.00     0.00     0.00     0.00
     300        0.56     0.00     0.00     0.00     0.00
     650        1.00     0.78     0.00     0.00     0.00
     950        1.00     1.00     0.96     0.00     0.00
    1150        1.00     1.00     1.00     0.97     0.97
    1500        1.00     1.00     1.00     1.00     1.00
```

- `prefers-reduced-motion: reduce` → all five read `1` at DOMContentLoaded.
- JavaScript disabled → all five read `1`.

---

## 2. Currently block — home + /about/

Six instances. On home between the hero and the metrics band; on /about/
inside the experience accordion, above the first role entry.

Stacked short paragraphs, not a `<ul>` — these are independent statements read
at a glance, not an enumeration. Verified `0` `<ul>`/`<ol>` inside `.now` on
all six. The label reuses the site's `.section-label`, so the accent bar
matches every other section head; "Available immediately." carries the accent
colour.

**Rendered text, read back from the DOM:**

| | Home | /about/ |
|---|---|---|
| EN | Currently · Open to Senior Operations Manager roles. · Marketplace & mobility preferred · open to any scale-up. · Berlin · remote EU · open to relocation. · Full-time or senior contract. · Available immediately. | identical |
| DE | Derzeit · Offen für Senior Operations Manager Rollen. · Marktplatz & Mobilität bevorzugt · offen für andere Scale-ups. · Berlin · remote EU · offen für Umzug. · Vollzeit oder Senior-Vertrag. · Sofort verfügbar. | identical |
| ES | Actualmente · Abierto a roles de Senior Operations Manager. · Marketplace y movilidad preferidos · abierto a cualquier scale-up. · Berlin · remote EU · abierto a reubicación. · Tiempo completo o contrato senior. · Disponible inmediatamente. | identical |

Copy is verbatim from the brief. "Berlin" (not "Berlín") in the ES block is
deliberate and matches the existing ES hero eyebrow, `Berlin · EMEA` — the
site already uses the unaccented form in these terse dotted lines and the
accented form in prose.

---

## 3. "What I do differently" — home

New section directly below Currently on all three home pages. Section order is
now hero → `.now-section` → `.diff-section` → `.hero-metrics`, confirmed in
each file.

Pulled-quote treatment: accent rule down the left edge, ~54ch measure, type a
step above body copy but below an `h2`. `.section-label`'s own `::before`
accent bar is suppressed inside `.diff` so the accent is not doubled.

Copy verbatim from the brief, with typographic apostrophes in EN.

---

## 4. /leadership-framework/ — chevrons → dense essay

**The brief's premise did not match the page.** There are no `›` chevrons and
nothing sits between the seven layers. What the page had was ten
`<ul class="flow">` chip-rows using 46 `▸` separators, scattered inside the
layers — which is the thing the review was reacting to: a row of pills reads
as a diagram the page does not have.

Put back to you with the finding; **"convert the 2 unique rows to prose"** was
chosen. Eight of the ten were redundant, restating text immediately adjacent:

| Chip row | Restated by |
|---|---|
| Direction ▸ Support ▸ Accountability ▸ Development | `.layer-sub` directly above |
| Translate ▸ Assign ▸ Track ▸ Act | `.layer-sub` directly above |
| Diagnose ▸ Prioritize ▸ Build ▸ Own | `.layer-sub` directly above |
| Understand ▸ Question ▸ Challenge ▸ Commit ▸ Review | `.steps` list directly below |
| Observe ▸ Explain ▸ Listen ▸ Agree ▸ Follow up | `.steps` list directly below |
| Promise ▸ Measure ▸ Communicate ▸ Improve | `.steps` list directly below |
| Understand ▸ Discuss ▸ Translate | `.steps` list directly below |
| Detect & assess ▸ … ▸ Learn | the `.principle` and tiles that follow |

Two carried sequences found nowhere else and became prose, matching the
arrow-in-prose idiom the page already uses in its tiles ("Receive → Assess →
Coordinate → Communicate → Resolve."):

| Before | After |
|---|---|
| `Contract signed ▸ Onboarding ▸ Order management ▸ Logistics ▸ Technical setup ▸ Activation ▸ Go-live ▸ Clean handover` | Contract signed, onboarding, order management, logistics, technical setup, activation, go-live, clean handover. |
| `Receive ▸ Update ▸ Verify` | Receive, update, verify. |

Both sit as `<p class="why">`, the class already used for the prose around
them. The lifecycle one keeps its `Typical lifecycle` label and now runs
straight into the ownership sentence that follows it.

**Those two rows were English on the DE/ES pages** — the chips were never
localized, while the prose around them was. As prose they are translated:
*Vertrag unterschrieben, Onboarding, Auftragsmanagement, …* /
*Contrato firmado, onboarding, gestión de pedidos, …*, and
*Empfangen, aktualisieren, verifizieren.* / *Recibir, actualizar, verificar.*

**Dead CSS removed with them**: the `.flow` rule block, `.flow li`,
`.flow .step`, `.flow .arrow`, `.flow li:last-child .arrow`,
`.flow.is-tight .step`, `.pillar-content .flow`, `.pillar-content .flow > li`,
and `.layer > .layer-head + .flow`. Two shared selectors were narrowed rather
than deleted, because `.steps` is still in use:

```
.pillar-content :is(.flow,.steps) > li          →  .pillar-content .steps > li
.pillar-content :is(.flow,.steps) > li::before  →  .pillar-content .steps > li::before
:is(.flow,.pillars,…)                           →  :is(.pillars,…)
:is(.flow,.grid-2,…)                            →  :is(.grid-2,…)
```

Two comments referring to the removed class were reworded.

After: `.steps` still renders 17 items per language, all `display:grid`, all
numbered — checked explicitly because of the selector narrowing.

---

## 5. Case share images — Bliq, Bolt, Wolt (×9)

**The brief's premise did not match the repo.** It listed nine files at
`/bliq/og.png`, `/de/bliq/og.png` and so on. The repo had **three**, one per
case, shared by all three languages, under different names — and one of them a
JPG in a subfolder:

```
bliq/og-bliq-1200x630.png
bolt/og-bolt-1200x630.png
wolt/images/og-wolt-1200x630.jpg
```

So "9 total" and "keep filenames identical" could not both hold. Put back to
you; **"9 files, translated"** was chosen.

The real defect was the one the brief named: all three were still on the **old
lime accent**, left behind by the lime→emerald migration. The 2026-10-30 P0
report had flagged the same thing about `og-card`.

**Now generated, not hand-made.** `scripts/og-case.html` +
`scripts/build_og_cases.js`, run with `npm run og:cases`, following
`scripts/og-image.html`: black ground, emerald rule, white Inter name, cream
subtitle. The byline is kept so a shared card still carries attribution. To
change a card, edit the template or the table in the build script — never the
PNG.

| Case | EN subtitle | DE | ES |
|---|---|---|---|
| Bliq | Case study · €3M ARR pilot + 4.7× driver growth | Fallstudie · €3M ARR-Pilot + 4,7× Fahrerwachstum | Caso de estudio · piloto de €3M ARR + 4,7× crecimiento de conductores |
| Bolt | Case study · activation 25% → 58% in six weeks | Fallstudie · Aktivierung 25% → 58% in sechs Wochen | Caso de estudio · activación 25% → 58% en seis semanas |
| Wolt | Case study · 30% procurement savings · Feb 2021–Feb 2023 | Fallstudie · 30% Einkaufsersparnis · Feb. 2021–Feb. 2023 | Caso de estudio · 30% de ahorro en compras · feb. 2021–feb. 2023 |

**Two figures in the brief were wrong and were corrected against the case
pages**, since these go on a public share card:

- Brief: *"Bolt: supply 25% → 58% in 2 months"*. The case page says
  **activation**, not supply — "a registered driver completing their first
  ride within 7 days of registration" — and the move took **six weeks**, over
  August–September 2023, not two months.
- Brief: *"Wolt: 30% savings"*. The page scopes it as **procurement** cost
  reduction, measured as a 12-month baseline (Feb 2021 – Jan 2022) against the
  12 months after implementation. `Feb 2021 – Feb 2023` is the role period and
  is kept as such.

Bliq's `€3M ARR pilot + 4.7× driver growth` matches how the home page's own
impact band states it.

**Paths and meta.** Each language keeps its own PNG beside its page, under the
existing `og-<case>-1200x630.png` convention:

```
bliq/og-bliq-1200x630.png      de/bliq/…      es/bliq/…
bolt/og-bolt-1200x630.png      de/bolt/…      es/bolt/…
wolt/og-wolt-1200x630.png      de/wolt/…      es/wolt/…
```

Wolt moved out of `wolt/images/` to sit beside its page like the other two,
and from JPG to PNG so the text stays sharp; `og:image:type` followed, and the
old JPG was deleted. `og:image` and `twitter:image` were repointed on the six
DE/ES pages and the three Wolt pages — 17 meta tags in total.

**Verified by decoding each PNG** (dimensions from IHDR, pixels after
un-filtering):

```
file                               size        #10B981 px   rule sample  bg
bliq/og-bliq-1200x630.png          1200x630           388       #10B981  #000000
bolt/og-bolt-1200x630.png          1200x630           388       #10B981  #000000
de/bliq/og-bliq-1200x630.png       1200x630           388       #10B981  #000000
de/bolt/og-bolt-1200x630.png       1200x630           388       #10B981  #000000
de/wolt/og-wolt-1200x630.png       1200x630           388       #10B981  #000000
es/bliq/og-bliq-1200x630.png       1200x630           388       #10B981  #000000
es/bolt/og-bolt-1200x630.png       1200x630           388       #10B981  #000000
es/wolt/og-wolt-1200x630.png       1200x630           388       #10B981  #000000
wolt/og-wolt-1200x630.png          1200x630           388       #10B981  #000000
```

Every `og:image` URL returns 200 over a local server.

---

## 6. /about/ closing — driver → unit economics

| | Before | After |
|---|---|---|
| EN | Three things I think about most: **driver economics**, operational leverage, and whether a team is actually learning. | …most: **unit economics**, operational leverage… |
| DE | Drei Dinge beschäftigen mich am meisten: **Fahrer-Ökonomie**, operativer Hebel… | …am meisten: **Unit Economics**, operativer Hebel… |
| ES | Las tres cosas en las que más pienso: **la economía del driver**, el apalancamiento operativo… | …más pienso: **las unit economics**, el apalancamiento… |

ES takes the English term in the plural, as it is normally used there, so the
article moved with it — a literal swap would have left "la unit economics".

The Bliq case study keeps "driver economics" / "Fahrer-Ökonomie" in its loop
diagram and callout: there it names the actual mechanism of that case, not a
general interest.

```
$ grep -rn "driver economics" about/ de/about/ es/about/
0 hits
```

---

## 7. Diagram button label — DE/ES

The button started localized but the click handler wrote a hardcoded English
string, so opening a case diagram on `/de/work/` or `/es/work/` switched the
label to "Hide diagram".

It was not in `form.js` as the brief guessed — it is an inline script carried
by each page. Nine copies exist; the home pages were already translated, the
two `/work/` pages were not, and `/about/` carries a dead copy with no buttons
on the page.

All nine now read from one dictionary keyed on `<html lang>`, so the three
language builds cannot drift again:

```js
const LABELS = {
  en: { view: 'View diagram ', hide: 'Hide diagram ' },
  de: { view: 'Diagramm ansehen ', hide: 'Diagramm ausblenden ' },
  es: { view: 'Ver diagrama ', hide: 'Ocultar diagrama ' },
};
const T = LABELS[document.documentElement.lang] || LABELS.en;
```

**Click-tested at 390px**, where the button exists (above 900px the CSS shows
diagrams permanently and the button is not rendered):

```
/work/       lang=en | initial: "View diagram"      | opened: "Hide diagram"        | re-closed: "View diagram"      | aria: true/false
/de/work/    lang=de | initial: "Diagramm ansehen"  | opened: "Diagramm ausblenden" | re-closed: "Diagramm ansehen"  | aria: true/false
/es/work/    lang=es | initial: "Ver diagrama"      | opened: "Ocultar diagrama"    | re-closed: "Ver diagrama"      | aria: true/false
/            lang=en | initial: "View diagram"      | opened: "Hide diagram"        | re-closed: "View diagram"      | aria: true/false
/de/         lang=de | initial: "Diagramm ansehen"  | opened: "Diagramm ausblenden" | re-closed: "Diagramm ansehen"  | aria: true/false
/es/         lang=es | initial: "Ver diagrama"      | opened: "Ocultar diagrama"    | re-closed: "Ver diagrama"      | aria: true/false
```

---

## 8. Remove unused og-card-1200x630.png

```
$ grep -rn "og-card" --include="*.html" --include="*.js" --include="*.css" \
       --include="*.json" --include="*.xml" . | grep -v node_modules
0 hits
```

The only remaining mentions anywhere were prose in the 2026-10-30 P0 report,
which had already flagged it for deletion once nothing else used it. Deleted.

---

## 9. "Systems thinking" on home — no change

Kept as written, in the `#approach` section: *"These are the principles that
turn marketplace operations into systems thinking — how I diagnose, plan, and
execute."* Recorded here so the next review does not re-flag it.

---

## Verification

| Check | Result |
|---|---|
| `grep "driver economics"` in /about/ ×3 | 0 hits ✅ |
| Case images 1200×630 | 9/9 ✅ |
| Case images emerald `#10B981` | 9/9, exact pixel match on the rule ✅ |
| Every `og:image` resolves | 9/9 → 200 ✅ |
| Diagram button label matches page language | 6/6 pages with buttons ✅ |
| Intro animation on first load | staggered 200→1400ms in all 3 languages ✅ |
| Intro animation, `prefers-reduced-motion` | static and visible at DOMContentLoaded ✅ |
| Intro animation, JS disabled | all elements visible ✅ |
| Currently renders ×6 | exact copy, 0 `<ul>` inside ✅ |
| "What I do differently" renders ×3 | correct section order ✅ |
| /leadership-framework/ chip rows | 0 `.flow`, 0 `.step`, 0 `.arrow`, 0 `▸` ×3 ✅ |
| `.steps` intact after selector narrowing | 17 items, all grid, all numbered ×3 ✅ |
| og-card file + references | deleted, 0 references ✅ |

**Full-site sweep — 21 pages, 3 languages**, each loaded in headless Chrome
and checked for status, JS errors, failed requests, horizontal overflow and
leftover chip markup:

```
all 21 pages clean
```

(Turnstile `110200` and the analytics beacon are filtered — both are
localhost-only and predate this session.)

---

## After push

**Social preview refresh is needed for all nine case URLs** — a stronger
reason than the brief anticipated. No meta description or title changed
anywhere this session:

```
$ git diff 49e55ec..HEAD -- '*.html' | grep -E '^[+-].*(og:description|name="description"|og:title|twitter:description|twitter:title)'
(no output)
```

But the share image changed on all nine:

- **Seven pages changed `og:image` URL** (the six DE/ES pages, plus `/wolt/`
  moving from `.jpg` to `.png`). A scraper holding the old URL will keep
  serving the old lime card until re-scraped.
- **`/bliq/` and `/bolt/` kept their URL but the bytes changed** — the worse
  case, since the cached URL still resolves and nothing signals the change.

Re-scrape: `/bliq/`, `/de/bliq/`, `/es/bliq/`, `/bolt/`, `/de/bolt/`,
`/es/bolt/`, `/wolt/`, `/de/wolt/`, `/es/wolt/`.

The main `og-image.png` is untouched and needs nothing.

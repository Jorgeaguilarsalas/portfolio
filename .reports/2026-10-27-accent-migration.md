# Report: Accent migration — lima → emerald + cream

**Date:** 2026-10-27
**Task:** Migrate the accent from `#B8FF3D` (lima neón) to a dual system: `#10B981` emerald (primary) + `#E8DFC7` cream (secondary)
**Session:** Claude Code
**Status:** SHIPPED to branch `feat/accent-emerald-cream` (not merged, not deployed — see §9)
**Commits:** `fb04e36`, `c294549`, `c110a4c`, `a6b81d3`, `2a4c172`

---

## 1. Audit (before any replacement)

Whole repo, excluding `node_modules/`, `.git/`, `.wrangler/`, `.reports/`.

### Totals by pattern

| Pattern | Count | Note |
|---|---|---|
| `#B8FF3D` | **317** | canonical portfolio accent |
| `#C6FF00` | **5** | CV + 343ride (2 of them prose comments) |
| `rgba(184,255,61,*)` | **233** | 21 distinct alpha literals, `0` → `.6` |
| `#B8FF3F` | 0 | does not exist |
| `#CCFF00` | 0 | does not exist |
| `#A8E82E` | 0 | does not exist |
| `#D4FF66` | 0 | does not exist |
| `rgb/rgba(198,255,0,*)` | 0 | does not exist |
| `--accent` definitions | 37 | 35 × `#B8FF3D`, 2 × `#C6FF00` |
| `--accent` *usages* | 1390 | already tokenised |
| `--accent-hover` / `-dark` / `-light` | 0 | did not exist |
| any `--color-*` token | 0 | none in the codebase |
| **Total lima literals** | **555** | across **43 files** |

### Per file

| File | `#B8FF3D` | `#C6FF00` | `rgba()` | Total | mask-icon | `--accent` def |
|---|---|---|---|---|---|---|
| `work/index.html` | 31 | 0 | 14 | 45 | 1 | 1 |
| `de/work/index.html` | 22 | 0 | 12 | 34 | 1 | 1 |
| `es/work/index.html` | 22 | 0 | 12 | 34 | 1 | 1 |
| `index.html` | 17 | 0 | 21 | 38 | 1 | 1 |
| `de/index.html` | 17 | 0 | 21 | 38 | 1 | 1 |
| `es/index.html` | 17 | 0 | 21 | 38 | 1 | 1 |
| `wolt/index.html` | 19 | 0 | 4 | 23 | 1 | 1 |
| `de/wolt/index.html` | 19 | 0 | 4 | 23 | 1 | 1 |
| `es/wolt/index.html` | 19 | 0 | 4 | 23 | 1 | 1 |
| `bliq/index.html` | 14 | 0 | 8 | 22 | 1 | 1 |
| `de/bliq/index.html` | 14 | 0 | 8 | 22 | 1 | 1 |
| `es/bliq/index.html` | 14 | 0 | 8 | 22 | 1 | 1 |
| `about/index.html` | 2 | 0 | 15 | 17 | 1 | 1 |
| `de/about/index.html` | 2 | 0 | 15 | 17 | 1 | 1 |
| `es/about/index.html` | 2 | 0 | 15 | 17 | 1 | 1 |
| `bolt/index.html` | 4 | 0 | 7 | 11 | 1 | 1 |
| `de/bolt/index.html` | 4 | 0 | 7 | 11 | 1 | 1 |
| `es/bolt/index.html` | 4 | 0 | 7 | 11 | 1 | 1 |
| `nexio/index.html` | 8 | 0 | 2 | 10 | 1 | 1 |
| `de/nexio/index.html` | 8 | 0 | 2 | 10 | 1 | 1 |
| `es/nexio/index.html` | 8 | 0 | 2 | 10 | 1 | 1 |
| `alcorte/index.html` | 6 | 0 | 1 | 7 | 1 | 1 |
| `de/alcorte/index.html` | 6 | 0 | 1 | 7 | 1 | 1 |
| `es/alcorte/index.html` | 6 | 0 | 1 | 7 | 1 | 1 |
| `leadership-framework/index.html` | 2 | 0 | 4 | 6 | 1 | 1 |
| `de/leadership-framework/index.html` | 2 | 0 | 4 | 6 | 1 | 1 |
| `es/leadership-framework/index.html` | 2 | 0 | 4 | 6 | 1 | 1 |
| `contact/form.css` | 2 | 1 | 2 | 5 | 0 | 1 |
| `privacy/index.html` | 2 | 0 | 2 | 4 | 1 | 1 |
| `es/privacidad/index.html` | 2 | 0 | 2 | 4 | 1 | 1 |
| `cv/index.html` | 1 | 2 | 0 | 3 | 0 | 1 |
| `consent.js` | 2 | 1 | 0 | 3 | 0 | 0 |
| `favicon.svg` | 3 | 0 | 0 | 3 | — | — |
| `impressum/index.html` | 2 | 0 | 1 | 3 | 1 | 1 |
| `datenschutz/index.html` | 2 | 0 | 1 | 3 | 1 | 1 |
| `404.html` | 2 | 0 | 0 | 2 | 1 | 1 |
| `de/404.html` | 2 | 0 | 0 | 2 | 1 | 1 |
| `es/404.html` | 2 | 0 | 0 | 2 | 1 | 1 |
| `vcard.js` | 1 | 0 | 1 | 2 | 0 | 0 |
| `contact/index.html` | 1 | 0 | 0 | 1 | 1 | 0 |
| `de/contact/index.html` | 1 | 0 | 0 | 1 | 1 | 0 |
| `es/contact/index.html` | 1 | 0 | 0 | 1 | 1 | 0 |
| `343ride-landing.html` | 0 | 1 | 0 | 1 | 0 | 1 |
| **TOTAL (43 files)** | **317** | **5** | **233** | **555** | **37** | **37** |

### What the 317 hex hits actually were

| Context | Count |
|---|---|
| `stroke="#B8FF3D"` in inline SVG (flow diagrams, charts) | 123 |
| `fill="#B8FF3D"` in inline SVG | 117 |
| `<link rel="mask-icon" … color="#B8FF3D">` | 37 |
| `--accent:#B8FF3D;` token definitions | 35 |
| prose comments explaining the colour choice | 3 |
| `--cc-accent` (consent.js), `--vc-accent` (vcard.js) | 2 |

### Three audit targets had nothing to migrate

- **`icon-mask.svg`** — monochrome `#000`, zero lima. Safari's `mask-icon` requires a flat silhouette; the colour lives in the HTML `color=` attribute, not in the file.
- **`contact/vcard-qr.svg`** — pure `#FFFFFF` / `#0B0B0D` QR, carries no accent.
- **`manifest.json` + 37 `<meta name="theme-color">`** — all `#0B0B0D`, the page background, not the old accent. See §4.

---

## 2. New token system

Added to all 35 portfolio `:root` blocks (34 pages + `contact/form.css`):

```css
--accent:#10B981;
--accent-hover:#0d9668;
--accent-dark:#047857;
--accent-secondary:#E8DFC7;
--accent-secondary-ghost:rgba(232,223,199,0.07);
```

`--accent-fg` (`#09090B`) is unchanged — it scores 7.84:1 on the new emerald, still AAA, so filled buttons keep their near-black label.

The 1390 existing `var(--accent)` call sites picked the new value up with no edit.

---

## 3. Files touched

56 files, +712 / −533.

| Commit | Scope | Files | Lines |
|---|---|---|---|
| `fb04e36` | token definitions in `:root` | 35 | +175 / −35 |
| `c294549` | hardcoded hex → `var(--accent)`, rgba → emerald | 34 | +419 / −419 |
| `c110a4c` | icon SVG + raster derivatives + 37 mask-icon attrs | 48 | +50 / −41 |
| `a6b81d3` | cream applied to `.callout` + `.principle` | 20 | +66 / −36 |
| `2a4c172` | CV + 343ride + regenerated PDF | 3 | +5 / −5 |

By type: 39 `.html`, 9 `.png`, 2 `.svg`, 2 `.js`, 2 `.ico`, 1 `.pdf`, 1 `.css`.

### Replacement counts

| Change | Count |
|---|---|
| `fill="#B8FF3D"` → `fill="var(--accent)"` | 116 |
| `stroke="#B8FF3D"` → `stroke="var(--accent)"` | 121 |
| `rgba(184,255,61,A)` → `rgba(16,185,129,A)` | 233 |
| `--accent:` token definitions | 37 |
| `mask-icon color=` attributes | 37 |
| `--cc-accent` / `--vc-accent` | 2 |
| prose comments rewritten | 3 |

**Verification that `var()` works in SVG presentation attributes.** 237 diagram paints now resolve through the token. Confirmed in Chrome 153 that `fill`/`stroke` accept `var()` on `rect`, `path`, `polygon`, `text` and `line` — including a `<polygon>` inside a `<marker>` inside `<defs>`, because custom properties inherit down the DOM tree regardless of where the marker is painted. Probed every page: all 237 compute to `rgb(16, 185, 129)`, none fall back to black.

---

## 4. Icons

`favicon.svg`: the three lima literals → `#10B981`. Diffing the file with the colours masked out shows **no coordinate change at all** — only a comment rewrap.

`favicon.ico` (16/32/48), `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` were **recoloured, not re-rendered**. `gen.js` was never committed, and the PNGs are not plain rasterisations of `favicon.svg` — `apple-touch-icon` carries the symbol at 78%, `icon-192/512` at 62% to fit the maskable safe circle. Re-rendering would have meant guessing those scales.

Instead: each raster is provably a two-colour image — every pixel sits on the `#0B0B0D → #B8FF3D` line to within 0.8/255 — so solving for coverage `t` per pixel and re-emitting `bg + t·(emerald − bg)` moves the hue while preserving antialiasing and the `stroke-opacity` ramps exactly.

Measured against the originals:

| File | max \|t_before − t_after\| | alpha channel |
|---|---|---|
| `apple-touch-icon.png` | 0.0028 | bit-identical |
| `icon-192.png` | 0.0028 | bit-identical |
| `icon-512.png` | 0.0028 | bit-identical |
| `favicon.ico` 16 | 0.0029 | bit-identical |
| `favicon.ico` 32 | 0.0028 | bit-identical |
| `favicon.ico` 48 | 0.0028 | bit-identical |

0.0028 is 8-bit rounding. The geometry is preserved.

**Before/after at every size, on dark and light tabs:** `.reports/2026-10-27-accent-migration/icon-sheet.png`

### Unchanged, deliberately

- `icon-mask.svg` — monochrome `#000`; Safari requires a flat silhouette.
- `contact/vcard-qr.svg` — pure black/white QR.
- `manifest.json` `theme_color` + `background_color`, and the 37 `<meta name="theme-color">`, all stay `#0B0B0D`. **These were never lima** — they are the page background, set so the mobile address bar blends into the page. Emerald there would paint the browser chrome and the PWA splash green above a dark page. Confirmed with Jorge before leaving them.

---

## 5. Cream secondary

Applied to:

| Selector | Where | Change |
|---|---|---|
| `.callout` | 15 case-study pages, 48 instances | left rule + body text → `--accent-secondary` |
| `.principle` | 3 leadership-framework pages | left rule → `--accent-secondary`, 5% emerald wash → `--accent-secondary-ghost` |
| `.principle .plabel` | 3 leadership-framework pages | label → `--accent-secondary` |

`.callout span` (the attribution) stays `--muted`. `.principle p` stays `--fg`. The `.is-ask` variant keeps its neutral override.

Screenshots: `secondary-callout-wolt.png`, `secondary-principle-lf.png`.

### Not applied

- **`.principle` in `alcorte`** is a *different component that happens to share the class name* — a grid card on `--surface-2` with no accent at all. Left untouched; verified it still computes to `rgb(247, 247, 248)`.
- **The 01–07 numerals** (`.toc-num`, `.layer-num`, `.pillar-num`, `.approach-num`, `.pnum`, `.sn`, `.pn`, `.mn`, `.rail-toc .n`) stay emerald. See §8.
- Eyebrow labels, metadata, body text and CTAs stay as they were, per brief.

---

## 6. Contrast (WCAG, measured)

Against the `#0B0B0D` canvas:

| Pair | Ratio | Grade |
|---|---|---|
| old `#B8FF3D` on `#0B0B0D` | 16.30 | AAA |
| old `#C6FF00` on `#0B0B0D` | 16.58 | AAA |
| **`#10B981` on `#0B0B0D`** | **7.75** | **AAA** ✅ |
| **`#E8DFC7` on `#0B0B0D`** | **14.81** | **AAA** ✅ |
| `#10B981` on `#141417` surface | 7.25 | AAA ✅ |
| `#E8DFC7` on `#141417` surface | 13.84 | AAA ✅ |
| `--accent-fg #09090B` **on** `#10B981` | 7.84 | AAA ✅ |
| `#0d9668` (`--accent-hover`) on `#0B0B0D` | 5.22 | AA only |
| `#047857` (`--accent-dark`) on `#0B0B0D` | 3.59 | AA-large only |
| `#09090B` on `#047857` | 3.63 | ⚠️ fails AA for text |

Both tokens actually in use clear AAA. The emerald is dimmer than the lima was (7.75 vs 16.30) but comfortably above the AAA threshold of 7.

Nothing became illegible, so no element needed adjusting.

---

## 7. Verification

Local static server, Chrome 153 headless, every page in the brief, at **1440×900** and **390×844**.

Per page the harness asserted: HTTP status, resolved `--accent`, `theme-color`, `mask-icon` colour, **a full computed-style sweep of every element for any surviving lima**, horizontal overflow, and console/page errors.

| Page | 1440 | 390 | accent | mask | lima found | h-overflow |
|---|---|---|---|---|---|---|
| `/` · `/de/` · `/es/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/about/` · `/de/about/` · `/es/about/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/work/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/leadership-framework/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/wolt/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/bolt/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/bliq/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/alcorte/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/nexio/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/contact/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/cv/` | ✅ | ⚠️ | `#10B981` | — | 0 | 794px — see §8 |
| `/343ride-landing.html` | ✅ | ✅ | `#10B981` | — | 0 | none |
| `/impressum/` · `/datenschutz/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/privacy/` · `/es/privacidad/` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |
| `/404.html` · `/de/404.html` · `/es/404.html` | ✅ | ✅ | `#10B981` | `#10B981` | 0 | none |

**23 pages × 2 breakpoints = 46 renders, zero lima pixels, zero regressions.**

### Component checks

| Component | Result |
|---|---|
| Nav active | `rgb(16,185,129)` |
| Nav link hover | → emerald |
| "Download CV" border hover | `#262626` → `rgb(16,185,129)` |
| "Get in touch" CTA | emerald bg, `#09090B` label |
| Back-link hover | → emerald |
| Scroll rail | `rgb(16,185,129)` |
| Framework TOC numerals | emerald |
| Layer / pillar / rail numerals | emerald |
| Flow diagrams + markers | emerald, incl. arrowheads |
| Chart alpha fills (`0.06`–`0.45`) | emerald |
| Consent banner Accept | emerald bg |
| FAB QR button | emerald, 56px desktop / 48px mobile |
| vCard modal | emerald top rule + close ring; QR untouched |
| Pull quotes (`.callout`) | `rgb(232,223,199)` cream |
| Framework callout (`.principle`) | cream rule + 7% cream wash |
| `.principle` in alcorte (different component) | untouched |

The only console noise was Google Analytics `collect` beacons and a Cloudflare Turnstile error — both because the sandbox has no outbound network. Unrelated to this change.

### Icons

- All eight icon assets serve 200 with correct byte counts.
- `manifest.json` parses; all five icon entries resolve 200.
- Head block confirmed as served: `favicon.svg`, `favicon.ico`, `apple-touch-icon`, `mask-icon color="#10B981"`, `manifest`, `theme-color #0B0B0D`.
- Rendered comparison at 16/32/48/180/192/512 on dark **and** light tabs: `icon-sheet.png`.
- **Not verified:** real iOS "Add to Home Screen" and a real Safari pinned tab — no device in this environment. Same gap as the 2026-10-26 report.

### CV PDF

`Jorge_Aguilar_CV.pdf` is a Puppeteer print of `cv/index.html`, and **71 links across the site point at it**, so leaving it lime would have shipped a green site handing out a lime CV. Regenerated with `npm run cv`. Verified by decompressing the PDF content streams: the fill operator moved from `0.776 1 0` to `0.063 0.726 0.506`, and the palette is otherwise the same five colours.

### Final repo state

```
#B8FF3D       0
#C6FF00       0
#CCFF00       0
#B8FF3F       0
#A8E82E       0
#D4FF66       0
184,255,61    0
198,255,0     0
```

No lima literal in any form remains anywhere in the repository.

---

## 8. Trade-offs and deviations

**1. The 01–07 numerals were not ghosted to 7%.** The brief asked for "section numerals ghosted, ~7% opacity." In this codebase those numerals are not decorative background figures — they are live TOC links, layer markers and step indices, currently rendered as full-strength mono accent text. Cream at 7% on `#0B0B0D` is about 1.1:1, which would have erased them. Raised before implementing; Jorge chose to keep them emerald. `--accent-secondary-ghost` is still defined and is used for the `.principle` wash, which is the one genuinely decorative surface.

**2. There are no `<blockquote>` elements.** Zero in the repo. The pull-quote role is played by `.callout`, which is what received the cream.

**3. `theme-color` and `manifest.theme_color` stay `#0B0B0D`.** They were never lima. Changing them to emerald would paint the mobile address bar and PWA splash green above a dark page — a new design decision, not part of this migration. Confirmed before skipping.

**4. The 233 `rgba()` alphas are literal emerald, not tokenised.** `rgba()` cannot consume a hex custom property, and `color-mix()` would raise the browser baseline (Chrome 111+, Safari 16.2+) for no visual gain. If a future migration is likely, a `--accent-rgb: 16, 185, 129` token consumed as `rgba(var(--accent-rgb), .35)` would collapse all 233 to one source. Not added here — it was outside the token set in the brief.

**5. `--accent-hover` and `--accent-dark` are defined but unconsumed.** The existing hover design does not use a darker tint — it swaps to full accent, moves a border, or translates the element. Retrofitting tinted hovers would be a design change beyond a colour migration. Worth knowing before adopting them: `#0d9668` is AA but not AAA as text, and `#047857` fails AA for normal text — if `--accent-dark` is ever used as a button background it needs white text (5.48:1), not `--accent-fg` (3.63:1).

**6. `consent.js` and `vcard.js` keep literal hex** rather than `var(--accent)`. Both inject their own component scope and must paint correctly even if the page stylesheet never arrives.

**7. CV and 343ride lost their separate brand lime.** Both carried `#C6FF00` deliberately, with comments explaining that they were distinct surfaces. Per the brief both moved to `#10B981` and those comments were rewritten to record the new rationale.

**8. `/cv/` overflows horizontally at 390px (794px wide).** Pre-existing and by design: `.page { width: 210mm }` because the file is the A4 print source for the PDF, and `cv/` is in `.assetsignore` so it is not deployed. My diff to `cv/index.html` is colour + comment only. Out of scope, flagged for the record.

---

## 9. Known pending

- **Not merged, not deployed.** The work is on `feat/accent-emerald-cream`, five commits ahead of `main`. Nothing has reached Cloudflare.
- **Real-device icon checks** — iOS Add to Home Screen and a Safari pinned tab remain unverified, as in the previous icon report.
- **Not in scope, still lima:** the Operations in Motion repo (`/motion/`), which is separate and was explicitly excluded.

---

## 10. Screenshots

| File | What |
|---|---|
| `icon-sheet.png` | before/after, 6 sizes × dark + light tabs |
| `home-1440.png` / `home-390.png` | home EN |
| `leadership-framework-1440.png` | full framework page |
| `wolt-1440.png` / `wolt-390.png` | case study |
| `contact-fab-1440.png` | contact with the FAB QR button |
| `contact-modal-390.png` | vCard modal, mobile |
| `cv-1440.png` | CV |
| `343ride-1440.png` | 343ride landing |
| `diagram-wolt-flow.png` | flow diagram, emerald markers |
| `diagram-home-supplywheel.png` | supply wheel, emerald curved markers + alpha fills |
| `secondary-callout-wolt.png` | cream pull quote |
| `secondary-principle-lf.png` | cream framework callout |
| `before-*.{svg,ico,png}` | original icon assets |

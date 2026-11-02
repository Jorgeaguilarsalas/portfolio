# Portfolio repositioning — remove Salas UG, update Nexio role

**Date:** 2026-11-02
**Branch:** main
**Commits:** 8 (`b500189` … `e871709`), on top of `dc8ca35`

Removes Salas UG from the public-facing portfolio, changes the Nexio Fleet
role from Co-founder to Senior Strategy & Operations Manager, strips the
remaining advisory/investment signal, and removes 343ride.

---

## Process note — the first pass was built on a stale base

The working tree was **32 commits behind `origin/main`** when this started.
A full set of edits was made, committed and only caught at `git push`, which
was rejected as non-fast-forward.

Nothing was force-pushed. The stale work is parked on the local branch
`repositioning-stale-base`, `main` was reset to `origin/main`, and every
change was redone against the real tree.

This mattered, because the remote carried a "P0 execution" that had already
moved the same surfaces:

| The brief said | Stale base | Real base (`dc8ca35`) |
|---|---|---|
| "After P0 the secondary paragraph (smaller grey)…" | no such element | `.lede-aside` on /contact/, exactly as described |
| "JSON-LD Person worksFor" | no structured data at all | `Person` block on 6 pages + a generator |
| "Hero ends with Co-founder Nexio Fleet" | no matching sentence | `.hero-sub` ending the hero, `.hero-prev` after it |
| `Founder + Advisor` top line | present, needed replacing | already `Senior Operations`, nothing to do |

Every oddity flagged while reading the brief resolved once the real base was
in place. The brief was accurate; the checkout was not.

Two defects in the stale pass were caught and avoided in the redo:

- **vCard written by hand** stripped the CRLF line endings RFC 2426 requires
  (`file` reported the card malformed). The redo uses `npm run vcard`.
- **`contact/vcard-qr.svg` was never regenerated.** The QR encodes the vCard,
  so it would have shipped still carrying `ORG:Salas UG`. The generator
  rebuilds both.

---

## Two titles, deliberately distinct

| Surface | String |
|---|---|
| Hero eyebrow, status badge, JSON-LD `jobTitle`, taglines, `manifest.json` | **Senior Operations Leader** (positioning) |
| /about/ entry, /work/, /nexio/, CV, vCard `TITLE`, email signature | **Senior Strategy & Operations Manager** (employment) |

P0 had already set the positioning side, including `jobTitle: "Senior
Operations Leader"` in the JSON-LD — which independently matches the
positioning choice made for this work. Those surfaces were left alone.

English title kept across EN/DE/ES, per the brief.

---

## Before / after by surface

### Home (`/`, `/de/`, `/es/`)

| Element | Before | After |
|---|---|---|
| Hero closing sentence | `Co-founder of Nexio Fleet, whose compliance platform covers 800+ drivers across 8 fleet operators in Berlin and Brandenburg.` | **removed** — hero ends at `Previously: Bliq · Bolt · Wolt` |
| Status tooltip | `Currently: Co-founder @ Nexio Fleet` | `Currently: Senior Strategy & Operations Manager @ Nexio Fleet` |
| Experience line | `Currently: Co-founder @ Nexio Fleet.` | `Currently: Senior Strategy & Operations Manager @ Nexio Fleet.` |
| Nexio case-meta | `2025 — Present · Co-founder · 6+ months` | `… · Senior Strategy & Operations Manager · 6+ months` |
| `description` | `… Co-founder of Nexio Fleet; previously Bliq, Bolt and Wolt.` | `… Senior Strategy & Operations Manager at Nexio Fleet; previously …` |
| `og:` / `twitter:description` | `… Co-founder @ Nexio Fleet. Previously Bliq, Bolt, Wolt. Berlin.` | `… Senior Strategy & Operations Manager @ Nexio Fleet. Previously …` |
| Hero eyebrow / badge | `Senior Operations · Berlin · EMEA` | unchanged (already clean) |

DE used `Mitgründer`, ES used `Cofundador`; replaced on the same pattern.

Hero spacing after removing the sentence is the tagline's own
`margin-bottom` (18px desktop / 14px mobile), verified rendered at both
breakpoints — no collapsed or doubled gap. The 800+ drivers / 8 operators
proof remains on the page in the metrics band and the Nexio case card.

### /about/ (×3)

| Element | Before | After |
|---|---|---|
| Bio sentence | `Currently co-founder at Nexio Fleet (Berlin)…` | `Currently Senior Strategy & Operations Manager at Nexio Fleet (Berlin)…` |
| Experience preview | `Five roles across marketplace operations, fleet compliance and independent advisory.` | `Four roles across marketplace operations, fleet compliance and product.` |
| Company chips | Nexio · **Salas UG** · Bliq · Bolt · Wolt | Nexio · Bliq · Bolt · Wolt |
| Nexio entry `<h3>` | `Co-founder · Strategy, Operations & Product` | `Senior Strategy & Operations Manager` |
| Salas UG entry | `Founder & Managing Director` + context + 2 bullets | **removed entirely** |

### /work/ (×3)

Nexio case-meta retitled. Boski's reference-letter credit untouched.

### /nexio/ case study (×3)

| Element | Before | After |
|---|---|---|
| Header card role | `Co-founder · Strategy, Operations & Product` | `Senior Strategy & Operations Manager` |

**The narrative needed no reframing.** The brief anticipated ownership
language to rewrite (`"I co-founded"` → `"I led strategy and operations
for"`). None exists, in any language. The case is already written in
operator voice — `"I mapped the audit obligation backwards…"`,
`"I specified an ingestion layer…"`, `"Restructured the offer…"`:

```
$ grep -rinE "I co-?found|co-?founded|as a founder|my company|our startup|ich gründete|mi empresa" nexio/ de/nexio/ es/nexio/
(no matches — two DE hits were "erfunden", a false positive on fund[ée])
```

The role line was the only founder-perspective element, and it is covered by
commit 2. The brief's commit 4 therefore has no diff.

### /contact/ (×3)

| Element | Before | After |
|---|---|---|
| `.lede-aside` | `I also run Salas UG and co-founded Nexio Fleet, and I stay open to a few advisory, investment or speaking conversations.` | **removed** |
| `description` / `og:` / `twitter:` | `… Also open to selective advisory, investment and speaking enquiries.` | sentence dropped |
| `contact/form.css` | `.lede-aside` rule + its comment | removed as dead CSS |

The page now carries no bio: kicker → heading → hiring invitation → direct
email → vCard CTA → form. The `.lede` was already repositioned by P0 and is
unchanged.

### Other surfaces

| File | Before | After |
|---|---|---|
| `jorge-aguilar.vcf` | `ORG:Salas UG` / `TITLE:Senior Operations Leader` / `NOTE:… Co-founder, Nexio Fleet GmbH …` | `ORG:Nexio Fleet GmbH` / `TITLE:Senior Strategy & Operations Manager` / `NOTE:… Currently at Nexio Fleet GmbH …` |
| `contact/vcard-qr.svg` | encoded the old card | regenerated |
| `worker-contact.js` | `["Jorge Aguilar", "Founder @ Salas UG", "Co-founder @ Nexio Fleet", INBOX]` | `["Jorge Aguilar", "Senior Strategy & Operations Manager @ Nexio Fleet", INBOX]` |
| `leadership-framework/` ×3 | `…(Nexio Fleet, Salas UG)` | `…(Nexio Fleet)` |

`TITLE` now pairs with `ORG:Nexio Fleet GmbH`, so it carries the employment
title; `NOTE` keeps the positioning sentence and drops the role clause
`TITLE` already states.

---

## CV

- Salas UG entry deleted (`Founder & Managing Director`, `100% owner of
  pre-revenue … venture`, advisory-vehicle bullet).
- Nexio entry retitled; dates, context and all three bullets preserved.
- **No profile/summary scrub needed.** The header carries only the tagline,
  which has no founder language. The sole surviving `owner` string is
  `Product Ownership` in the skills line — a competency, not a claim.

**PDF: 2 pages before → 2 pages after.** 298.2 KB → 291.7 KB.

Format note: the CV is **not** a reflowing document. It is two fixed A4
`.sheet` containers — sheet 1 Experience, sheet 2 Education & Training +
Skills — each hard-set to 1119px. It cannot collapse to one page, so the
brief's "do not force 2 pages if it fits in 1" does not apply. Removing the
entry leaves **~236px of extra whitespace** at the foot of page 1. Format
preserved; nothing padded to fill the gap.

---

## JSON-LD

`scripts/build_jsonld.js` **generates** the `Person` block on 6 pages from
`cv/index.html` — `worksFor` is derived from Experience entries dated
"Present". So removing the Salas UG CV entry and running `npm run jsonld`
updates all six pages; hand-editing the JSON would be overwritten on the
next run.

| Field | Before | After |
|---|---|---|
| `worksFor` | `[Nexio Fleet GmbH, Salas UG (haftungsbeschränkt)]` | `[Nexio Fleet GmbH]` |
| `jobTitle` | `Senior Operations Leader` | unchanged — see below |

**Deviation from the brief, flagged:** the brief asked for `jobTitle:
"Senior Strategy & Operations Manager"`. It was left as `Senior Operations
Leader`, because the generator documents `jobTitle` as the hero positioning
line, explicitly not an employer-scoped role:

> *"Lo unico que no sale del CV es el posicionamiento (jobTitle), que es el
> del hero de la home"*

That matches the positioning/employment split agreed for this work. The
employment title is carried by `worksFor`'s organisation plus the /about/ and
/nexio/ role lines, the CV and the vCard. Say the word and it's a one-line
change to `JOB_TITLE` in the generator.

Validated on all six pages: parses as JSON, `@type` Person, required fields
present, no Salas UG.

---

## 343ride — removed

| Host | Before | After |
|---|---|---|
| `343ride.de/` | landing page (placeholder) | 301 → `jorgeag.com/` |
| `343ride.de/<path>` | 301 → `jorgeag.com/<path>` | unchanged |
| `www.343ride.de/*` | 301 → `343ride.de/*` | 301 → `jorgeag.com/*` |

The landing carried `© 2026 Salas UG (haftungsbeschränkt)` and a
`Portfolio of the founder` CTA. Deleting it removes both. Path-to-path
redirects are retained so external references to old 343ride.de paths
(`/wolt/`, `/impressum/`, `/Jorge_Aguilar_CV.pdf`) keep resolving — what the
domain did before the landing existed.

Also removed: the `LANDING_HTML` import and root branch in `worker.js`, the
stale `.assetsignore` entry, the `343ride.de` label in `package.json`, and
README's claim that the redirect is temporary.

**`fleet@343ride.de` is untouched** — an email address on the domain's MX
records, independent of what the Worker serves, and the legal contact in all
four legal pages.

Verified: `npx wrangler deploy --dry-run` bundles clean without the import.

---

## Verification

### 1. `grep -riE "Salas\s*UG" .`
```
privacy/index.html:<meta name="description" content="Privacy policy under the GDPR &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
privacy/index.html:<meta property="og:description" content="Privacy policy under the GDPR &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
privacy/index.html:        Salas UG (haftungsbeschr&auml;nkt)<br>
privacy/index.html:        (Salas UG (haftungsbeschr&auml;nkt)). For the technical transmission
datenschutz/index.html:<meta name="description" content="Datenschutzerkl&auml;rung nach DSGVO &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
datenschutz/index.html:<meta property="og:description" content="Datenschutzerkl&auml;rung nach DSGVO &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
datenschutz/index.html:        Salas UG (haftungsbeschr&auml;nkt)<br>
datenschutz/index.html:        (Salas UG (haftungsbeschr&auml;nkt)). Zur technischen &Uuml;bermittlung und
impressum/index.html:<meta name="description" content="Impressum gem&auml;&szlig; &sect; 5 DDG &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
impressum/index.html:<meta property="og:description" content="Impressum gem&auml;&szlig; &sect; 5 DDG &mdash; Salas UG (haftungsbeschr&auml;nkt), Berlin">
impressum/index.html:        Salas UG (haftungsbeschr&auml;nkt)<br>
es/privacidad/index.html:<meta name="description" content="Pol&iacute;tica de privacidad conforme al RGPD &mdash; Salas UG (haftungsbeschr&auml;nkt), Berl&iacute;n">
es/privacidad/index.html:<meta property="og:description" content="Pol&iacute;tica de privacidad conforme al RGPD &mdash; Salas UG (haftungsbeschr&auml;nkt), Berl&iacute;n">
es/privacidad/index.html:        Salas UG (haftungsbeschr&auml;nkt)<br>
es/privacidad/index.html:        Aguilar (Salas UG (haftungsbeschr&auml;nkt)). Para la transmisi&oacute;n
```

**15 hits, all legally required.** Salas UG is the operator under TMG/DDG § 5
and the named controller under GDPR Art. 13, so it must appear in
`/impressum/`, `/datenschutz/`, `/privacy/` and `/es/privacidad/`.
**Zero hits outside those four.**

### 2. `grep -riE "co.?founder|cofundador" .`
```
index.html:            <p class="case-note">Reference letter on file from Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH.</p>
work/index.html:            <p class="case-note">Reference letter on file from Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH.</p>
es/index.html:            <p class="case-note">Carta de referencia de Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH, disponible.</p>
es/nexio/index.html:        <p>De Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH. Acredita la responsabilidad sobre el producto, la contribución estratégica y el alcance operativo durante la construcción temprana de la plataforma.</p>
es/work/index.html:            <p class="case-note">Carta de referencia de Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH, disponible.</p>
nexio/index.html:        <p>From Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH. Attesting to product ownership, strategic contribution, and operational scope during the platform's early-stage build.</p>
```

**6 hits, all Aleksander Boski** — `CEO and co-founder of Nexio Fleet GmbH`,
author of Jorge's reference letter. A third party's founder status, correctly
retained. **Zero hits present Jorge as co-founder.**

### 3. `grep -riE "founder|fundador|gründer" .`
```
index.html:            <p class="case-note">Reference letter on file from Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH.</p>
work/index.html:            <p class="case-note">Reference letter on file from Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH.</p>
de/work/index.html:            <p class="case-note">Referenzschreiben von Aleksander Boski, CEO und Mitgründer der Nexio Fleet GmbH, liegt vor.</p>
de/index.html:            <p class="case-note">Referenzschreiben von Aleksander Boski, CEO und Mitgründer der Nexio Fleet GmbH, liegt vor.</p>
es/index.html:            <p class="case-note">Carta de referencia de Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH, disponible.</p>
nexio/index.html:        <p>From Aleksander Boski, CEO and co-founder of Nexio Fleet GmbH. Attesting to product ownership, strategic contribution, and operational scope during the platform's early-stage build.</p>
de/nexio/index.html:        <p>Von Aleksander Boski, CEO und Mitgründer der Nexio Fleet GmbH. Bestätigt Produktverantwortung, strategischen Beitrag und operativen Verantwortungsbereich während des frühen Aufbaus der Plattform.</p>
es/nexio/index.html:        <p>De Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH. Acredita la responsabilidad sobre el producto, la contribución estratégica y el alcance operativo durante la construcción temprana de la plataforma.</p>
es/work/index.html:            <p class="case-note">Carta de referencia de Aleksander Boski, CEO y cofundador de Nexio Fleet GmbH, disponible.</p>
```

**9 hits, all Boski** (the 6 above plus 3 German `Mitgründer` variants of the
same credit). Filtering the list for any hit *not* mentioning Boski returns
nothing. Manually inspected: **Jorge appears as founder nowhere**, including
the Impressum, where he is `Geschäftsführer` — an office, not a founding
claim.

### 4. `grep -ril "Senior Strategy & Operations Manager" .` — 16 files
```
jorge-aguilar.vcf
index.html
worker-contact.js
about/index.html
de/index.html
de/about/index.html
work/index.html
de/nexio/index.html
de/work/index.html
scripts/build_vcard.js
es/index.html
cv/index.html
es/work/index.html
nexio/index.html
es/about/index.html
es/nexio/index.html
```

### 5. `grep -ri "Senior Operations Leader" .` — 63 hits

Positioning line, mostly pre-existing from P0 (taglines, meta, JSON-LD on
home + /about/ ×3, `manifest.json`, the og-image template, the vCard NOTE).
Unchanged by this work.

### 6. Render check — 19 pages, 3 languages

Headless Chrome, `document.body.innerText` scanned for
`salas ug|co-?founder|cofundador|mitgründer`:

```
BOSKI index.html             CLEAN about/index.html      CLEAN contact/index.html
BOSKI nexio/index.html       BOSKI work/index.html       CLEAN cv/index.html
BOSKI de/index.html          CLEAN de/about/index.html   CLEAN de/contact/index.html
BOSKI de/nexio/index.html    BOSKI de/work/index.html    BOSKI es/index.html
CLEAN es/about/index.html    CLEAN es/contact/index.html BOSKI es/nexio/index.html
BOSKI es/work/index.html     CLEAN leadership-framework/index.html
CLEAN de/leadership-framework/index.html
CLEAN es/leadership-framework/index.html

ALL PAGES CLEAN
```

`BOSKI` = only the reference-letter credit matched. The only JS errors are
`TurnstileError 110200` on the three /contact/ pages — Cloudflare Turnstile
rejecting a `file://` origin. Expected locally, unrelated to these changes.

### 7. Build verification

| Check | Result |
|---|---|
| `npx wrangler deploy --dry-run` | bundles clean without the landing import |
| `npm run cv` | 2 pages, 291.7 KB |
| `npm run vcard` | 544 bytes, `file` confirms valid vCard 3.0 (CRLF intact) |
| `npm run jsonld` | 6 pages, all parse, worksFor = Nexio only |

---

## Ambiguous mentions found, and how they were resolved

**1. "Salas" is also Jorge's surname.** Kept as personal-name /
infrastructure references:

- `Jorge Luis Aguilar Salas` — managing director in the legal pages
- `portfolio.j-l-aguilar-salas.workers.dev` — Cloudflare preview host
- `Jorgeaguilarsalas/portfolio` — GitHub handle in `docs/pec/`
- `Referenzschreiben_Jorge_Aguilar_Salas_Nexio_Fleet.pdf` — his full name;
  linked from all three /nexio/ pages, renaming would break the asset
- `Universidad La Salle` in the CV and JSON-LD `alumniOf` — different word

**2. Privacy pages keep Salas UG.** `/privacy/`, `/datenschutz/` and
`/es/privacidad/` name Salas UG as controller. The brief allowed for "any
datenschutz cross-reference that legally requires it"; GDPR Art. 13 requires
controller identity, so all three retain it alongside `/impressum/`.

**3. The hero sentence ordering in the brief.** The brief said the hero ends
with the Nexio sentence and should then end at "Previously Bliq, Bolt, Wolt".
On the real base that is exactly true — `.hero-sub` is the last prose line
before `.hero-prev`. Applied literally.

**4. `.lede-aside` left dead CSS behind.** Removing the paragraph orphaned
its rule and explanatory comment in `contact/form.css`; both removed.

**5. JSON-LD `jobTitle`** — deviation from the brief, documented above.

---

## Open items

**1. /contact/ enquiry-type dropdown — left unchanged, needs a decision.**
The form still offers:

```
Advisory / Consulting
Investment / Partnership
Speaking / Media
Job opportunity
Other
```

The brief removed advisory/investment language, but these options are not
claims Jorge makes about himself — they let a visitor categorise their own
enquiry, and the value is passed through to the contact Worker's email
subject. Changing them alters form behaviour, so nothing was touched. If the
advisory and investment options should go, it is a small follow-up to the
three `/contact/` pages.

**2. JSON-LD `jobTitle`** — currently the positioning line. One-line change
if the employment title is wanted there instead.

**3. `README.md`** retains one Salas UG mention, documenting that
`fleet@343ride.de` is the legal contact in Impressum and Datenschutz. Repo
documentation of a legal fact, not portfolio signal, and still true.

**4. Local branch `repositioning-stale-base`** holds the discarded first
pass. Safe to delete once this is confirmed good:
`git branch -D repositioning-stale-base`.

---

## Post-push

- [ ] Refresh social previews — meta descriptions changed on `/`, `/about/`
      and `/contact/` in all three languages:
      LinkedIn Post Inspector + Facebook Sharing Debugger
- [ ] Jorge updates LinkedIn separately

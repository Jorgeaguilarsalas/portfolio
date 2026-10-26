# Report: Custom Icon + vCard QR Feature

**Date:** 2026-10-26
**Task:** Icono custom + Modal QR vCard
**Session:** Claude Code
**Status:** SHIPPED (real-device and dashboard checks pending, see §9)
**Commit:** 4b7e45c (feature) · report finalized in the follow-up commit

## 1. Context

Two features for jorgeag.com:

1. A custom icon (favicon, Apple touch icon, Android/PWA icons plus manifest) so the portfolio can be added to a phone's home screen with a branded icon.
2. A "Save my contact" modal on `/contact/` (EN/DE/ES) with a QR code that imports Jorge's contact card on iPhone/Android, plus a direct `.vcf` download.

Out of scope as requested: `/motion/` (separate repo) and `/343ride-landing.html`. `/cv/` was not touched: it has its own head and is not deployed (`cv/` is in `.assetsignore`).

## 2. Icono design decisions

- **SVG approach:** three nodes in a triangle (top, bottom-left, bottom-right) joined by edges, i.e. connected parts forming one system. Solid lime nodes (r = 7.5 in a 64 viewBox) and edges at 55% opacity (stroke 5), so the nodes read first and the shape holds at 16px. No text or letters. It replaces the previous "JA" monogram.
- **Colors used:** background `#0B0B0D` (canonical bg), symbol `#B8FF3D` (canonical accent). The favicon keeps the faint lime ring (38%) from the previous icon so it doesn't blend into dark browser tabs. The mask icon is monochrome black, as Safari requires.
- **Sizes generated:** all from one geometry (`gen.js`, rendered with headless Chrome):
  | File | Size | Notes |
  |---|---|---|
  | `/favicon.svg` | vector | rounded square + ring; browser tab |
  | `/favicon.ico` | 16, 32, 48 | PNG-in-ICO, legacy fallback |
  | `/apple-touch-icon.png` | 180×180 | full-bleed (iOS rounds its own corners), symbol at 78% |
  | `/icon-192.png` | 192×192 | full-bleed, symbol at 62% (fits the 80% maskable safe circle) |
  | `/icon-512.png` | 512×512 | same as 192 |
  | `/icon-mask.svg` | vector | monochrome silhouette, Safari pinned tab (`mask-icon`) |
- Legibility check: `.reports/2026-10-26-icon-vcard/icon-sheet.png` (16px ×6, 32px ×3, 1:1 on dark and light tabs, iOS squircle mask, Android circle mask).

## 3. Changes applied

### Files created:
- `favicon.svg`, `favicon.ico` (overwrite the existing ones, as allowed), `apple-touch-icon.png` (overwritten), `icon-192.png`, `icon-512.png`, `icon-mask.svg`
- `manifest.json`: name and short_name "Jorge Aguilar", `start_url /`, `display standalone`, background and theme `#0B0B0D`, icons (SVG any, 192/512 any, 192/512 maskable)
- `jorge-aguilar.vcf`: the vCard, served at `/jorge-aguilar.vcf`
- `contact/vcard-qr.svg`: the same vCard as a QR code (static, 12 KB)
- `contact/vcard.js`: modal behaviour and events
- `scripts/build_vcard.js`: single source for the vCard data. `npm run vcard` regenerates the `.vcf` and the QR. `scripts/` is not deployed.
- `.reports/2026-10-26-icon-vcard.md` (this file) and `.reports/2026-10-26-icon-vcard/*.png`

### Files modified:
- All 37 portfolio pages (home, about, work, leadership-framework, contact, 5 case studies, 404, in EN/DE/ES, plus impressum, datenschutz, privacy, es/privacidad): head icon block replaced (see below).
- `contact/index.html`, `de/contact/index.html`, `es/contact/index.html`: "Save my contact" button under the "Prefer email?" line, `<dialog>` modal, `vcard.js` script tag.
- `contact/form.css`: button and modal styles. `.direct` margin 44 → 20px so the button sits under it; the button carries the old 44px gap to the form.
- `worker.js`: `.vcf` responses get `Content-Type: text/vcard; charset=utf-8`.
- `datenschutz/index.html`, `privacy/index.html`, `es/privacidad/index.html`: one sentence in section 14a (Umami) disclosing the two contact-card events (see §5).
- `package.json` / `package-lock.json`: devDependency `qrcode@^1.5.4` and script `vcard`.

### Meta tags added:
Replaces the previous three icon tags on every page:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/icon-mask.svg" color="#B8FF3D">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0B0B0D">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Jorge Aguilar">
```

## 4. vCard implementation

- **QR library used:** `qrcode` 1.5.4 (npm), **at build time** (`npm run vcard`). The contact data is fixed, so the QR is generated once as a static SVG and served from jorgeag.com. The page ships no QR library and loads nothing from a CDN.
- **Format / compliance:** vCard **3.0 (RFC 2426)**, as in the brief's sample (`VERSION:3.0`). Note that RFC 6350 is vCard **4.0**. 3.0 is what the iOS and Android camera importers handle most reliably. Lines end in CRLF and commas in values are escaped. Final content (519 bytes):
  ```
  BEGIN:VCARD
  VERSION:3.0
  N:Aguilar;Jorge;;;
  FN:Jorge Aguilar
  ORG:Salas UG
  TITLE:Founder + Advisor
  EMAIL;TYPE=INTERNET,WORK:hello@jorgeag.com
  TEL;TYPE=CELL:+4915734551124
  URL;TYPE=WORK:https://jorgeag.com
  URL:https://www.linkedin.com/in/jorge-aguilar-ops
  X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/jorge-aguilar-ops
  ADR;TYPE=WORK:;;Jessnerstraße 6;Berlin;;10247;Germany
  NOTE:Translating marketplace operations into systems thinking. Co-founder\, Nexio Fleet GmbH. Based in Berlin.
  END:VCARD
  ```
  The address and phone number are the ones already published in the Impressum. Nothing new is made public.
- **Round trip verified:** the QR, rendered at 300px and decoded with jsQR 1.4.0, matches `jorge-aguilar.vcf` byte for byte.
- **Error correction level:** **L**. At this payload size, M produces version 18 (89×89 modules) and L produces version 15 (77×77), so each module is about 17% larger at 300px. Error correction protects printed or damaged codes; this one is shown clean on a screen. The brief allowed L if M was too dense.
- **Display:** dark modules on a white panel, with a 4-module quiet zone. A light-on-dark (inverted) QR scans worse on many phone cameras.
- **Fallback .vcf served from:** `https://jorgeag.com/jorge-aguilar.vcf`, with `Content-Type: text/vcard; charset=utf-8` set by the Worker. The "Save my contact" button is itself a link to the `.vcf`: without JavaScript, or in a browser without `<dialog>`, it downloads the card directly.

## 5. Analytics events

- `vcard_modal_open` with `{page_language, source: 'contact_page'}` (+ `page_type`, added automatically by `consent.js`): fires (verified locally, see §6).
- `vcard_download` with `{page_language}` (+ `page_type`): fires.
- Both go to GA4 through `window.__consent.track` (the existing gate) and to Umami through `umami.track`. Both are sent **only when `__consent.granted()` is true**, as specified. Without consent, nothing is sent to either (verified). With `?noga=1`, neither script is loaded, so nothing is sent.
- Privacy policy: section 13 (GA4) already covers events in general terms. Section 14a (Umami) only mentioned page views and visits, so one sentence was added in DE/EN/ES: only with consent, the contact page also tells Umami that the contact card was opened or downloaded (event name and page language, nothing else).

## 6. Verification

### Desktop:
- Favicon visible: new `favicon.svg` and `favicon.ico` are served and render correctly at 16 and 32px (icon sheet).
- Modal responsive: at 1440×900, a 420px card centred, QR at 300px, page width unchanged. Closes with Escape, backdrop click and the × button, and focus returns to the button. Passes in EN/DE/ES. Screenshot: `modal-en-1440.png`.
- .vcf download works: the link has `download="jorge-aguilar.vcf"`; Chrome downloads it. Production serves it as `text/vcard; charset=utf-8` (the Worker override works), identical to the repo file.

### iPhone:
- Add to Home Screen icon correct: **not verified on a device** (no iPhone in this environment). `apple-touch-icon.png` (180×180, full bleed) and `apple-mobile-web-app-title` are in place on all pages.
- QR scan prompts native Contacts: **not verified on a device.** The QR decodes exactly to a valid vCard 3.0 (jsQR round trip), which is what the iOS camera hands to Contacts.
- Modal responsive 390px: card 358px wide (16px margins), QR 300px, no horizontal scroll. On touch screens the ".vcf" link becomes a lime full-width button (see §7). Screenshots: `modal-de-390.png`, `modal-es-390.png`.

### Android:
- QR scan via Camera/Lens: **not verified on a device.**
- Contact import works: **not verified on a device.**

### Analytics:
- GA4 events firing: verified locally in headless Chrome with consent granted (`gtag('event', 'vcard_modal_open' | 'vcard_download', …)` in `dataLayer`, with the correct `page_language` per language). Not yet checked in the GA4 dashboard (DebugView or Realtime).
- Umami tracking: verified locally with a stubbed `umami.track` (the same calls and parameters). No events without consent. Not yet checked in the Umami dashboard.

## 7. Decisions

- **The QR is built ahead of time, not in the browser.** Same result for visitors, no runtime library, no CDN, and one source of truth in `scripts/build_vcard.js`.
- **On a phone, the download is the main action.** A phone can't scan a QR shown on its own screen, so on touch screens ≤600px the ".vcf" link is styled as the lime primary button. On iOS, tapping it opens the native "New Contact" sheet (hence `text/vcard` in the Worker).
- **Button style:** outline pill with a small CSS QR glyph in lime, the same treatment as "Download CV" in the nav. It's a secondary action and shouldn't compete with the form's lime "Send message" button.
- **Modal = native `<dialog>`:** the browser handles Escape, focus trapping and making the rest of the page inert. The backdrop copies the cookie banner (dark plus 10px blur). The card has a lime top border, also echoing the banner. Page scroll is locked while open.
- **Status bar style `black`** (see §8).
- **`display: standalone`** in the manifest, consistent with `apple-mobile-web-app-capable=yes`. Launched from the home screen, the site opens without browser chrome. External links (LinkedIn, the CV PDF) open in the in-app browser or a browser tab.
- **`mobile-web-app-capable` added next to the Apple tag:** Chrome deprecates the Apple-only tag and warns in the console without the standard one.
- **No "Get in touch" anywhere in the modal:** it's already on the contact page.

## 8. Deviations from spec

- **vCard TITLE / NOTE / ORG:**
  - `TITLE` is "Founder + Advisor", and the tagline "Translating marketplace operations into systems thinking" moved to `NOTE`. Contacts apps show TITLE as the job title under the name, where a tagline reads oddly.
  - The brief had **two `ORG` lines**. In vCard 3.0 ORG appears once and apps keep only one, so `ORG:Salas UG` stays and "Co-founder, Nexio Fleet GmbH" moved to `NOTE`.
  - `URL;TYPE=LINKEDIN` is not a standard type. It became a plain `URL` (Android) plus `X-SOCIALPROFILE;TYPE=linkedin` (iOS shows it as a LinkedIn profile).
  - LinkedIn uses `https://www.linkedin.com/...`, the same handle the site already links 11 times.
- **"RFC 6350":** kept the brief's `VERSION:3.0`, which is RFC 2426 (see §4). Switching to 4.0 would match the RFC name but import worse on iOS.
- **QR not via an inline qrcode.js:** generated at build time into a same-origin SVG (§4, §7). The goal (no CDN, works without third parties) is met with zero runtime code.
- **Error correction L instead of M:** the brief allowed it (§4).
- **`apple-mobile-web-app-status-bar-style`: `black` instead of `black-translucent`.** With translucent, a home-screen launch draws the page under the iOS status bar and notch, so the sticky nav (top: 0) would sit under the clock. Fixing that properly needs `viewport-fit=cover` plus `env(safe-area-inset-top)` padding in the nav CSS of all 37 pages, which is the duplicated nav CSS flagged in the nav-fix report. `black` keeps the nav intact; the bar is #000 against the site's #0B0B0D.
- **Added a `mask-icon` tag** (the brief listed `icon-mask.svg` as optional but no tag for it). Without the tag the file is unused.
- **Privacy policy sentence (§5):** not in the brief. It's needed because section 14a described Umami as page views and visits only.
- **`package.json` / lock:** `qrcode` added as a devDependency (installed with `--ignore-scripts`, so Puppeteer did not download Chrome).

## 9. For next session

### Pending:
- **Real-device checks (Jorge):**
  1. iPhone Safari → jorgeag.com → Share → Add to Home Screen. Check the icon, the "Jorge Aguilar" title, and that the nav isn't under the status bar.
  2. Desktop `/contact/` → "Save my contact" → scan with the iPhone camera. Check that the "Add contact" prompt shows the name, the Salas UG company, Founder + Advisor, phone, email, two URLs and the LinkedIn profile, the address, and the note.
  3. The same with the Android camera or Google Lens.
  4. On the phone itself: `/contact/` → button → lime ".vcf" button. On iOS this should open the "New Contact" sheet.
- **Dashboards (Jorge):** accept the banner, open and close the modal, download the `.vcf`. Then check GA4 Realtime/DebugView for `vcard_modal_open` and `vcard_download`, and Umami → Events.
- Optional: register `source` and `page_language` as custom dimensions in GA4 if they aren't already (`page_language` probably is).

### Follow-up:
- If the iOS status bar should be translucent (content edge to edge), do it together with centralizing the nav CSS (`/nav.css`), then add the safe-area padding once.
- If the contact data changes (phone, address, title), edit `scripts/build_vcard.js` and run `npm run vcard`. The `.vcf` and the QR regenerate together. Keep them in step with the Impressum.
- The mobile download button text starts with "Or …" ("Oder …", "O …") because it's the same string as the desktop fallback link. If it bothers you, give touch screens their own label ("Add to contacts").

## 10. Metrics

- Lines changed: +963 / −92 in site and build files (52 files, report excluded). Most of it is the 10-line icon block × 37 pages, the modal and menu markup × 3, `form.css` and `package-lock.json` (+~325, qrcode dependency tree).
- Files touched: 52 outside `.reports/`: 37 HTML pages, 13 new files (6 icons, manifest, .vcf, QR SVG, vcard.js, build_vcard.js and others), plus form.css, worker.js, package.json and package-lock.json. Report: 1 .md + 4 .png.
- Time elapsed: 00:08 (18:16 → 18:24)
- Deploy status: confirmed on production (about 50s after push). `/jorge-aguilar.vcf` returns 200 with `text/vcard; charset=utf-8` and is byte-identical to the repo. `manifest.json` is valid (5 icons). All icon files return 200 with correct types, and the new `favicon.svg` is live. The manifest and meta block is present on every page sampled (EN/DE/ES, legal, real 404 responses). The modal is present on `/contact/`, `/de/contact/` and `/es/contact/`. `343ride.de` and `/motion/` are unchanged (no manifest tag).

/**
 * Genera las nueve imagenes para compartir de los casos (3 casos x 3 idiomas):
 *
 *   npm run og:cases
 *
 * Renderiza scripts/og-case.html a 1200x630 con el Chrome de Puppeteer, igual
 * que `npm run og`. Para cambiar una imagen se edita la plantilla o esta tabla,
 * nunca el PNG.
 *
 * Las cifras salen de la propia pagina de cada caso: Bolt es "activacion", no
 * "supply", y el salto 25% -> 58% ocurrio en seis semanas (ago-sep 2023), no en
 * dos meses. Si un numero cambia en el caso, cambia aqui tambien.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TEMPLATE = path.resolve(__dirname, 'og-case.html');
const ROOT = path.resolve(__dirname, '..');

const CASES = {
  bliq: {
    en: 'Case study · €3M ARR pilot + 4.7× driver growth',
    de: 'Fallstudie · €3M ARR-Pilot + 4,7× Fahrerwachstum',
    es: 'Caso de estudio · piloto de €3M ARR + 4,7× crecimiento de conductores',
  },
  bolt: {
    en: 'Case study · activation 25% → 58% in six weeks',
    de: 'Fallstudie · Aktivierung 25% → 58% in sechs Wochen',
    es: 'Caso de estudio · activación 25% → 58% en seis semanas',
  },
  wolt: {
    en: 'Case study · 30% procurement savings · Feb 2021–Feb 2023',
    de: 'Fallstudie · 30% Einkaufsersparnis · Feb. 2021–Feb. 2023',
    es: 'Caso de estudio · 30% de ahorro en compras · feb. 2021–feb. 2023',
  },
};

// Cada idioma guarda su propio PNG junto a su pagina, con el mismo nombre.
const outPath = (name, lang) =>
  path.join(ROOT, lang === 'en' ? '' : lang, name, `og-${name}-1200x630.png`);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const written = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.goto(`file://${TEMPLATE}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => document.fonts.check('600 128px Inter'));
    if (!ok) throw new Error('Inter no cargo: la imagen saldria con la fuente de sistema');

    for (const [name, subs] of Object.entries(CASES)) {
      for (const [lang, sub] of Object.entries(subs)) {
        await page.evaluate((n, s, l) => {
          document.documentElement.lang = l;
          document.getElementById('name').textContent = n;
          document.getElementById('sub').textContent = s;
        }, name[0].toUpperCase() + name.slice(1), sub, lang);

        const out = outPath(name, lang);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
        written.push(out);
      }
    }
  } finally {
    await browser.close();
  }
  for (const f of written) {
    console.log(`${path.relative(ROOT, f)}  (${(fs.statSync(f).size / 1024).toFixed(1)} KB)`);
  }
  console.log(`\n${written.length} case share images generated`);
})().catch((err) => { console.error(err); process.exit(1); });

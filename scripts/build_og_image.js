/**
 * Genera /og-image.png, la imagen que se ve al compartir un enlace del sitio:
 *
 *   npm run og
 *
 * Renderiza scripts/og-image.html a 1200x630 (estandar Open Graph) a densidad 2x
 * (archivo de 2400x1260) para que el texto se vea nitido en pantallas retina, con el
 * Chrome de Puppeteer, igual que `npm run cv`. Para cambiar la imagen se
 * edita la plantilla, no el PNG.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TEMPLATE = path.resolve(__dirname, 'og-image.html');
const OUT = path.resolve(__dirname, '../og-image.png');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    await page.goto(`file://${TEMPLATE}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => document.fonts.check('800 96px Inter'));
    if (!ok) throw new Error('Inter no cargo: la imagen saldria con la fuente de sistema');
    await page.screenshot({ path: OUT, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  } finally {
    await browser.close();
  }
  console.log(`og-image generated: ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);
})().catch((err) => { console.error(err); process.exit(1); });

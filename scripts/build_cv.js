/**
 * Genera Jorge_Aguilar_CV.pdf a partir de cv/index.html.
 *
 *   npm run cv
 *
 * El PDF es el mismo render que el HTML: el diseno vive en cv/index.html y
 * aqui solo se imprime. Se usa el tamano de pagina declarado en el CSS
 * (@page { size:A4; margin:0 }) via preferCSSPageSize, y los margenes reales
 * son el padding de .page, para que la pantalla y el PDF coincidan.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HTML = path.resolve(__dirname, '../cv/index.html');
const PDF = path.resolve(__dirname, '../Jorge_Aguilar_CV.pdf');

(async () => {
  if (!fs.existsSync(HTML)) {
    throw new Error(`No existe el source del CV: ${HTML}`);
  }

  // headless:true ya es el headless "new" desde Puppeteer 22; el valor 'new'
  // quedo deprecado y se removio en v23.
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    // networkidle0 espera tambien el CSS de Google Fonts.
    await page.goto(`file://${HTML}`, { waitUntil: 'networkidle0' });

    // Sin esto el PDF puede imprimirse con la fuente de fallback.
    await page.evaluate(() => document.fonts.ready);

    await page.pdf({
      path: PDF,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }

  const kb = (fs.statSync(PDF).size / 1024).toFixed(1);
  console.log(`PDF generated: ${PDF} (${kb} KB)`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

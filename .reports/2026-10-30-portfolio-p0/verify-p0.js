// Verificacion final del lote P0 (2026-10-30). Uso, desde la raiz del repo:
//   python3 -m http.server 8765 &   # en otra terminal
//   PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//     node .reports/2026-10-30-portfolio-p0/verify-p0.js
// Recorre las 37 paginas servidas: errores JS, peticiones fallidas, Google Fonts,
// skip link y Inter cargada. Luego comprueba la coherencia entre idiomas.
const puppeteer = require(process.cwd() + '/node_modules/puppeteer');
const fs = require('fs'); const { execSync } = require('child_process');
const served = execSync("git ls-files '*.html'").toString().trim().split('\n')
  .filter(f => !/^(cv\/|\.reports\/|343ride-landing\.html$)/.test(f));
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  let problems = 0;
  for (const f of served) {
    const u = '/' + f.replace(/index\.html$/, '');
    const p = await b.newPage(); const errs = [], failed = [], gf = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('requestfailed', r => failed.push(r.url()));
    p.on('response', r => { if (r.status() >= 400 && new URL(r.url()).host === 'localhost:8765') failed.push(r.status() + ' ' + r.url()); });
    p.on('request', r => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) gf.push(r.url()); });
    await p.evaluateOnNewDocument(() => localStorage.setItem('consent_decision', JSON.stringify({ analytics: false, ts: Date.now(), v: 1 })));
    await p.goto('http://localhost:8765' + u, { waitUntil: 'networkidle0' });
    const m = await p.evaluate(async () => { await document.fonts.ready; return { skip: document.querySelectorAll('a.skip-link[href="#main"]').length, main: !!document.querySelector('main#main'), inter: document.fonts.check('700 16px Inter') }; });
    const bad = errs.length || failed.filter(x => !/umami|google|cloudflare/.test(x)).length || gf.length || m.skip !== 1 || !m.main || !m.inter;
    if (bad) { problems++; console.log('PROBLEM', u, { errs, failed, gf, ...m }); }
    await p.close();
  }
  console.log(`runtime: ${served.length} pages, problems: ${problems}`);
  await b.close();
  // Coherencia entre idiomas (texto fuente)
  const rd = f => fs.readFileSync(f, 'utf8');
  const L = ['', 'de/', 'es/'];
  const rows = [
    ['Bliq 4.6 anywhere served', served.filter(f => /4[.,]6(×|&times;|-fach|-Fach)/.test(rd(f))).length, 0],
    ['Wolt role Feb 2023 (case header)', L.filter(l => /Feb 2021 &mdash; Feb 2023 &middot; Operations Associate/.test(rd(l + 'wolt/index.html'))).length, 3],
    ['Bolt year 2023 (2 per page)', L.map(l => (rd(l + 'bolt/index.html').match(/(September|septiembre) (de )?2023/g) || []).length).join('/'), '2/2/2'],
    ['Hero "Previously" line', L.filter(l => /class="hero-prev/.test(rd(l + 'index.html'))).length, 3],
    ['Case-end blocks', ['wolt', 'bolt', 'bliq', 'alcorte', 'nexio'].flatMap(c => L.map(l => l + c)).filter(x => /class="case-end"/.test(rd(x + '/index.html'))).length, 15],
    ['Visible lime strings (wolt x3)', L.filter(l => /lime path|limettenfarbene|trazo lima/.test(rd(l + 'wolt/index.html'))).length, 0],
    ['JSON-LD Person blocks', ['', 'about/'].flatMap(p => L.map(l => l + p + 'index.html')).filter(f => /application\/ld\+json/.test(rd(f))).length, 6],
    ['Home close pills (btn-secondary in #contact)', L.map(l => (rd(l + 'index.html').split('id="contact"')[1].split('</section>')[0].match(/btn-secondary|btn-copy/g) || []).length).join('/'), '0/0/0'],
    ['Bliq owned: €3M + retention + team (x3)', L.filter(l => { const s = rd(l + 'bliq/index.html'); return /&euro;3M/.test(s) && /&lt;50%/.test(s) && /6-köpfig|6-person|6 personas/.test(s); }).length, 3],
  ];
  for (const [k, got, want] of rows) console.log(`${String(got) === String(want) ? 'ok ' : 'BAD'} ${k}: ${got} (want ${want})`);
})();

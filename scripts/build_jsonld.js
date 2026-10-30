/**
 * Genera el JSON-LD `Person` de la home y de /about/ (x3 idiomas) a partir
 * del CV:
 *
 *   npm run jsonld
 *
 * Origen de datos: cv/index.html, el mismo HTML que se imprime como
 * Jorge_Aguilar_CV.pdf. De ahi salen el nombre, el perfil de LinkedIn, los
 * puestos actuales (worksFor = entradas de Experience con "Present") y la
 * formacion terminada (alumniOf = entradas de Education sin "Present"). Si el
 * CV cambia, se vuelve a correr esto y las seis paginas quedan al dia; no hay
 * que tocar el JSON a mano.
 *
 * Lo unico que no sale del CV es el posicionamiento (jobTitle), que es el del
 * hero de la home, y los datos de contacto que ya son publicos en el sitio.
 *
 * El bloque se escribe entre dos marcadores en el <head>; si no estan, se
 * insertan antes de </head>. Correrlo dos veces deja el mismo resultado.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CV = path.join(ROOT, 'cv/index.html');
const PAGES = [
  'index.html', 'de/index.html', 'es/index.html',
  'about/index.html', 'de/about/index.html', 'es/about/index.html',
];
const START = '<!-- JSON-LD:PERSON (generado por scripts/build_jsonld.js desde cv/index.html; no editar a mano) -->';
const END = '<!-- /JSON-LD:PERSON -->';

// Posicionamiento: el del hero de la home ("Senior operations leader for
// marketplaces and mobility"). No esta en el CV, que lista puestos.
const JOB_TITLE = 'Senior Operations Leader';
const SITE = 'https://jorgeag.com/';

const decode = (s) => s
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/&middot;/g, '·').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

function sections(html) {
  // Cada seccion del CV empieza con <div class="kicker">Titulo</div>.
  const out = {};
  const re = /<div class="kicker">([^<]+)<\/div>([\s\S]*?)(?=<div class="kicker">|<\/body>)/g;
  let m;
  while ((m = re.exec(html))) out[decode(m[1])] = m[2];
  return out;
}

function entries(block) {
  const out = [];
  const re = /<span class="dates">([^<]*)<\/span>[\s\S]*?<div class="role-title">([\s\S]*?)<\/div>\s*<div class="org">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(block))) out.push({ dates: decode(m[1]), role: decode(m[2]), org: decode(m[3]) });
  return out;
}

function build() {
  const html = fs.readFileSync(CV, 'utf8');
  const name = decode(html.match(/<h1 class="name">([\s\S]*?)<\/h1>/)[1]);
  const slug = html.match(/href="https?:\/\/(?:www\.)?linkedin\.com\/in\/([^"/]+)\/?"/)[1];
  const nexioUrl = (html.match(/href="(https?:\/\/(?:www\.)?nexiofleet\.de\/?)"/) || [])[1];

  const sec = sections(html);
  const exp = entries(sec['Experience'] || '');
  const edu = entries(sec['Education & Training'] || '');
  if (!exp.length || !edu.length) throw new Error('No se encontraron Experience/Education en el CV');

  const worksFor = exp
    .filter((e) => /present/i.test(e.dates))
    .map((e) => {
      const o = { '@type': 'Organization', name: e.org };
      // nexiofleet.de identifica a la empresa, no a la persona: va como url
      // de la organizacion y no en sameAs.
      if (/^Nexio/i.test(e.org) && nexioUrl) o.url = nexioUrl;
      return o;
    });

  const seen = new Set();
  const alumniOf = edu
    .filter((e) => !/present/i.test(e.dates))           // terminada, no en curso
    .map((e) => e.org.split(' — ')[0].trim())            // "Universidad La Salle — Erasmus ..." -> la universidad
    .filter((org) => (seen.has(org) ? false : seen.add(org)))
    .map((org) => ({
      '@type': /universi|hochschule/i.test(org) ? 'CollegeOrUniversity' : 'EducationalOrganization',
      name: org,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: SITE,
    image: SITE + 'photo.jpg',
    email: 'mailto:hello@jorgeag.com',
    jobTitle: JOB_TITLE,
    worksFor,
    alumniOf,
    address: { '@type': 'PostalAddress', addressLocality: 'Berlin', addressCountry: 'DE' },
    sameAs: [`https://www.linkedin.com/in/${slug}/`],
  };
}

function inject(file, json) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  const block = `${START}\n<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>\n${END}`;
  const a = s.indexOf(START);
  if (a !== -1) {
    const b = s.indexOf(END, a);
    if (b === -1) throw new Error(`Marcador de cierre ausente en ${file}`);
    s = s.slice(0, a) + block + s.slice(b + END.length);
  } else {
    if (s.split('</head>').length !== 2) throw new Error(`</head> no es unico en ${file}`);
    s = s.replace('</head>', `${block}\n</head>`);
  }
  fs.writeFileSync(p, s);
}

const json = build();
for (const f of PAGES) inject(f, json);
console.log(JSON.stringify(json, null, 2));
console.log(`JSON-LD Person escrito en ${PAGES.length} paginas.`);

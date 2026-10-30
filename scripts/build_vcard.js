/**
 * Genera la tarjeta de contacto digital a partir de un solo origen de datos:
 *
 *   npm run vcard
 *
 *   jorge-aguilar.vcf       descarga directa (enlace del modal en /contact/)
 *   contact/vcard-qr.svg    el mismo vCard codificado como QR
 *
 * El QR se genera aqui, una vez, y no en el navegador: el contenido es fijo,
 * asi que la pagina no necesita ninguna libreria de QR ni ningun CDN, y el
 * SVG se sirve desde el propio dominio.
 *
 * Formato: vCard 3.0 (RFC 2426), no 4.0 (RFC 6350). Es la version que la
 * camara de iOS y la de Android importan sin problemas desde un QR; con 4.0
 * iOS falla en algunos campos. Lineas terminadas en CRLF, como pide el RFC.
 *
 * Los datos son los del Impressum (direccion, telefono): no se publica nada
 * que no estuviera ya publicado alli. Si cambian alli, cambian aqui.
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const ROOT = path.resolve(__dirname, '..');

const LINES = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Aguilar;Jorge;;;',
  'FN:Jorge Aguilar',
  // Un solo ORG: en 3.0 es una propiedad unica y las agendas ignoran el
  // segundo. Nexio Fleet va en la nota.
  'ORG:Salas UG',
  'TITLE:Senior Operations Leader',
  'EMAIL;TYPE=INTERNET,WORK:hello@jorgeag.com',
  'TEL;TYPE=CELL:+4915734551124',
  'URL;TYPE=WORK:https://jorgeag.com',
  // URL simple para Android; X-SOCIALPROFILE hace que iOS lo muestre como
  // perfil de LinkedIn y no como una web mas.
  'URL:https://www.linkedin.com/in/jorge-aguilar-ops',
  'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/jorge-aguilar-ops',
  'ADR;TYPE=WORK:;;Jessnerstraße 6;Berlin;;10247;Germany',
  'NOTE:Senior operations leader for marketplaces and mobility. Co-founder\\, Nexio Fleet GmbH. Based in Berlin.',
  'END:VCARD',
];

const VCARD = LINES.join('\r\n') + '\r\n';

(async () => {
  fs.writeFileSync(path.join(ROOT, 'jorge-aguilar.vcf'), VCARD, 'utf8');

  // Nivel L (~7% de redundancia). Con ~520 bytes, M da version 18 (89x89
  // modulos) y L version 15 (77x77): modulos un 17% mas grandes a 300px. La
  // redundancia sirve para codigos impresos y danados; este se muestra en
  // pantalla, limpio, asi que se prioriza el tamano del modulo.
  const svg = await QRCode.toString(VCARD, {
    type: 'svg',
    errorCorrectionLevel: 'L',
    margin: 4,
    color: { dark: '#0B0B0D', light: '#FFFFFF' },
  });
  fs.writeFileSync(path.join(ROOT, 'contact', 'vcard-qr.svg'), svg, 'utf8');

  const qr = QRCode.create(VCARD, { errorCorrectionLevel: 'L' });
  console.log(`vCard: ${Buffer.byteLength(VCARD)} bytes`);
  console.log(`QR: version ${qr.version}, ${qr.modules.size}x${qr.modules.size} modulos, nivel L`);
})();

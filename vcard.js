/**
 * Tarjeta de contacto digital: modal con QR + boton flotante (FAB).
 *
 * Unico sitio donde vive el modal. Se incluye en todas las paginas del
 * portafolio con una linea, despues de consent.js:
 *   <script src="/vcard.js" defer></script>
 *
 * Dos disparadores abren el mismo <dialog>:
 *   - el FAB, en todas las paginas (source: 'fab'). Caso de uso: alguien pide
 *     el contacto en persona, un toque y se le ensena el QR en la pantalla.
 *   - cualquier .vcard-open de la pagina, hoy el boton "Save my contact" de
 *     /contact/ (source: 'contact_page'). Es un enlace real al .vcf: sin JS o
 *     sin <dialog> descarga la tarjeta directamente.
 *
 * Autocontenido como consent.js (inyecta su CSS): las paginas no comparten
 * hoja de estilos y cada una nombra sus variables a su manera, asi que aqui
 * los colores van con prefijo propio (--vc-*).
 *
 * Banner de cookies: consent.js pone data-cc-banner en <html> mientras el
 * banner esta abierto, y el FAB se oculta por CSS mientras exista. Comparten
 * la esquina inferior derecha; el banner va primero.
 *
 * Datos: jorge-aguilar.vcf y contact/vcard-qr.svg, generados juntos por
 * `npm run vcard` (scripts/build_vcard.js).
 *
 * Eventos (solo con consentimiento, a GA4 via __consent.track y a Umami):
 *   vcard_modal_open  { page_language, source, page_type }
 *   vcard_download    { page_language, source, page_type }
 * Documentado en la Datenschutzerklarung, seccion 14a.
 */
(function () {
  'use strict';

  // La publicacion es otro proyecto; si alguna vez incluyera este archivo,
  // no le tocaria a este decidir que botones lleva.
  if (/^\/(?:de\/|es\/)?motion(\/|$)/.test(location.pathname)) return;

  var dlgSupported = typeof HTMLDialogElement === 'function' &&
    typeof document.createElement('dialog').showModal === 'function';
  if (!dlgSupported) return;   // los .vcard-open siguen descargando el .vcf

  var VCF = '/jorge-aguilar.vcf';
  var QR = '/contact/vcard-qr.svg';

  var COPY = {
    en: {
      fab: 'Open my digital business card',
      title: 'Save my contact',
      desc: 'Scan with your phone camera to add me to your contacts.',
      dl: 'Or download .vcf directly',
      close: 'Close',
      alt: 'QR code with Jorge Aguilar’s contact card'
    },
    de: {
      fab: 'Meine Visitenkarte öffnen',
      title: 'Kontakt speichern',
      desc: 'Mit der Handykamera scannen, um mich zu Ihren Kontakten hinzuzufügen.',
      dl: 'Oder .vcf direkt herunterladen',
      close: 'Schließen',
      alt: 'QR-Code mit der Kontaktkarte von Jorge Aguilar'
    },
    es: {
      fab: 'Abrir mi tarjeta de contacto',
      title: 'Guardar contacto',
      desc: 'Escanea con la cámara de tu móvil para añadirme a tus contactos.',
      dl: 'O descarga el .vcf directamente',
      close: 'Cerrar',
      alt: 'Código QR con la tarjeta de contacto de Jorge Aguilar'
    }
  };

  // Idioma de la pagina (no del navegador): el modal es parte de la pagina.
  function lang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0 || p === '/de') return 'de';
    if (p.indexOf('/es/') === 0 || p === '/es') return 'es';
    var l = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    return COPY[l] ? l : 'en';
  }
  var L = lang();
  var T = COPY[L];

  /* ------------------------------------------------------------ estilos */

  var CSS = [
    ':root{--vc-bg:#14141a;--vc-fg:#F7F7F8;--vc-muted:#B4B4BB;--vc-line:#303036;',
    '--vc-accent:#B8FF3D;--vc-accent-fg:#0B0B0D;}',
    '.vc-lock{overflow:hidden;}',

    /* FAB. Por debajo del menu movil (z 60) y del banner; por encima del
       contenido, de la barra (20) y del riel de lectura (40). */
    '.vc-fab{position:fixed;z-index:50;',
    'right:calc(24px + env(safe-area-inset-right,0px));bottom:calc(24px + env(safe-area-inset-bottom,0px) + var(--vc-lift,0px));',
    'width:56px;height:56px;padding:0;border:1px solid rgba(11,11,13,.35);border-radius:50%;',
    'background:var(--vc-accent);color:var(--vc-accent-fg);cursor:pointer;',
    'display:inline-flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 12px rgba(0,0,0,.3);-webkit-tap-highlight-color:transparent;',
    'opacity:1;visibility:visible;',
    'transition:transform .2s ease,filter .2s ease,opacity .3s ease,visibility .3s ease;}',
    '.vc-fab svg{width:22px;height:22px;display:block;}',
    '@media (hover:hover){.vc-fab:hover{transform:scale(1.05);filter:brightness(1.06);}}',
    '.vc-fab:active{transform:scale(.95);}',
    '.vc-fab:focus{outline:none;}',
    '.vc-fab:focus-visible{outline:2px solid var(--vc-accent);outline-offset:3px;',
    'box-shadow:0 4px 12px rgba(0,0,0,.3),0 0 0 7px rgba(184,255,61,.28);}',
    /* Mientras el banner de cookies o el menu movil estan abiertos, fuera. */
    'html[data-cc-banner] .vc-fab,body.menu-open .vc-fab{opacity:0;visibility:hidden;pointer-events:none;}',
    '@media (max-width:800px){.vc-fab{width:48px;height:48px;',
    'right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px) + var(--vc-lift,0px));}',
    '.vc-fab svg{width:20px;height:20px;}}',
    '@media print{.vc-fab{display:none;}}',

    /* Modal. <dialog> sin padding: un clic cuyo target es el dialogo solo
       puede venir del backdrop. Velo como el del banner: oscuro y difuso. */
    '.vc{padding:0;border:0;background:transparent;color:var(--vc-fg);',
    'width:min(420px,calc(100% - 32px));max-width:none;max-height:calc(100% - 32px);margin:auto;overflow:visible;',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-transform:none;}',
    '.vc::backdrop{background:rgba(11,11,13,.62);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);}',
    '.vc *{box-sizing:border-box;}',
    '.vc-card{position:relative;background:var(--vc-bg);border:1px solid var(--vc-line);',
    'border-top:1px solid var(--vc-accent);border-radius:20px;padding:32px 28px 26px;text-align:center;',
    'box-shadow:0 24px 64px rgba(0,0,0,.5);max-height:calc(100vh - 32px);overflow-y:auto;}',
    '.vc-title{font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin:0 36px 8px;',
    'color:var(--vc-fg);text-transform:none;font-family:inherit;}',
    '.vc-desc{color:var(--vc-muted);font-size:14.5px;line-height:1.5;margin:0 auto 22px;max-width:30ch;}',
    '.vc-qr{background:#fff;border-radius:14px;width:min(320px,100%);margin:0 auto 20px;overflow:hidden;}',
    '.vc-qr img{display:block;width:100%;height:auto;aspect-ratio:1;}',
    '.vc-dl{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;',
    'font-size:14px;color:var(--vc-muted);text-decoration:underline;text-underline-offset:3px;}',
    '.vc-dl:hover{color:var(--vc-accent);}',
    '.vc-close{position:absolute;top:14px;right:14px;width:44px;height:44px;padding:0;',
    'display:inline-flex;align-items:center;justify-content:center;background:transparent;',
    'border:1px solid var(--vc-line);border-radius:999px;color:var(--vc-fg);',
    'font-family:inherit;font-size:22px;line-height:1;cursor:pointer;transition:border-color .2s ease,color .2s ease;}',
    '.vc-close:hover{border-color:var(--vc-accent);color:var(--vc-accent);}',
    '.vc-close:focus-visible,.vc-dl:focus-visible{outline:2px solid var(--vc-accent);outline-offset:3px;}',
    /* En el movil hay dos usos opuestos. Desde el FAB, Jorge ensena el QR en
       su pantalla: el QR manda y la descarga queda discreta. Desde /contact/,
       quien lo pulsa es la visita, que no puede escanear su propia pantalla:
       ahi la descarga pasa a boton principal. */
    '@media (pointer:coarse) and (max-width:600px){',
    '.vc-card{padding:28px 20px 22px;}',
    '.vc[data-source="contact_page"] .vc-dl{display:flex;width:100%;padding:14px 20px;border-radius:999px;',
    'background:var(--vc-accent);color:var(--vc-accent-fg);font-weight:600;text-decoration:none;}',
    '.vc[data-source="contact_page"] .vc-dl:hover{color:var(--vc-accent-fg);}}',
    '@media (prefers-reduced-motion:no-preference){',
    '.vc[open] .vc-card{animation:vc-in .22s ease-out;}',
    '@keyframes vc-in{from{opacity:0;transform:translateY(8px) scale(.98);}to{opacity:1;transform:none;}}}',
    '@media (prefers-reduced-motion:reduce){.vc-fab{transition:opacity .3s ease,visibility .3s ease;}',
    '.vc-fab:hover,.vc-fab:active{transform:none;}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'vc-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ------------------------------------------------------------- markup */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var dlg = document.createElement('dialog');
  dlg.id = 'vcard-modal';
  dlg.className = 'vc';
  dlg.setAttribute('aria-labelledby', 'vc-title');
  dlg.setAttribute('aria-describedby', 'vc-desc');
  dlg.innerHTML =
    '<div class="vc-card">' +
      '<button type="button" class="vc-close" aria-label="' + esc(T.close) + '">&times;</button>' +
      '<h2 class="vc-title" id="vc-title">' + esc(T.title) + '</h2>' +
      '<p class="vc-desc" id="vc-desc">' + esc(T.desc) + '</p>' +
      '<div class="vc-qr"><img src="' + QR + '" width="300" height="300" alt="' + esc(T.alt) +
        '" loading="lazy" decoding="async"></div>' +
      '<a class="vc-dl" href="' + VCF + '" download="jorge-aguilar.vcf">' + esc(T.dl) +
        ' <span aria-hidden="true">&rarr;</span></a>' +
    '</div>';

  // Tres esquinas de busqueda y unos modulos sueltos: se lee "QR" a 20px.
  var ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">' +
      '<path fill-rule="evenodd" d="M3 3h8v8H3zm2 2v4h4V5zM13 3h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4z"/>' +
      '<path d="M13 13h3v3h-3zM18 13h3v3h-3zM13 18h3v3h-3zM18 18h3v3h-3zM16 16h2v2h-2z"/>' +
    '</svg>';

  // <button> nativo: rol, foco con Tab y Enter/Espacio sin codigo extra.
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'vc-fab';
  fab.setAttribute('aria-label', T.fab);
  fab.setAttribute('aria-haspopup', 'dialog');
  fab.setAttribute('aria-controls', 'vcard-modal');
  fab.innerHTML = ICON;

  document.body.appendChild(dlg);
  document.body.appendChild(fab);

  /* Al llegar al pie, el FAB sube lo que asome el pie para no tapar sus
     enlaces (Impressum, Datenschutz: tienen que poder pulsarse). Se mide el
     ultimo <footer> de la pagina; sin pie no hace nada. */
  var footers = document.getElementsByTagName('footer');
  var foot = footers.length ? footers[footers.length - 1] : null;
  if (foot) {
    var queued = false;
    var syncLift = function () {
      queued = false;
      var over = Math.max(0, Math.round(window.innerHeight - foot.getBoundingClientRect().top));
      fab.style.setProperty('--vc-lift', over + 'px');
    };
    var schedule = function () {
      if (!queued) { queued = true; window.requestAnimationFrame(syncLift); }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    syncLift();
  }

  /* ------------------------------------------------------------ eventos */

  function send(name, extra) {
    var c = window.__consent;
    if (!c || typeof c.granted !== 'function' || !c.granted()) return;
    var params = { page_language: L };
    for (var k in extra) params[k] = extra[k];
    // page_type lo anade track(); Umami no pasa por ahi, asi que lo lleva aqui.
    if (typeof c.track === 'function') c.track(name, params);
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        var u = { page_type: pageTypeGuess() };
        for (var j in params) u[j] = params[j];
        window.umami.track(name, u);
      }
    } catch (e) { /* un fallo de medicion no puede romper el modal */ }
  }

  // Misma clasificacion que consent.js (pageType), reducida a lo necesario.
  function pageTypeGuess() {
    var p = location.pathname.replace(/index\.html$/, '').replace(/^\/(?:de|es)(?=\/|$)/, '') || '/';
    if (p === '/') return 'home';
    var m = p.match(/^\/([a-z-]+)/);
    var s = m ? m[1] : '';
    if (s === 'leadership-framework') return 'framework';
    if (['about', 'work', 'contact'].indexOf(s) > -1) return s;
    if (['wolt', 'bolt', 'bliq', 'nexio', 'alcorte'].indexOf(s) > -1) return 'case_study';
    return 'other';
  }

  var opener = null;
  var source = null;

  function openModal(src, from) {
    if (dlg.open) return;
    opener = from || null;
    source = src;
    dlg.setAttribute('data-source', src);
    dlg.showModal();
    document.documentElement.classList.add('vc-lock');
    send('vcard_modal_open', { source: src });
  }

  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('vc-lock');
    if (opener && typeof opener.focus === 'function') opener.focus();
    opener = null;
  });

  dlg.querySelector('.vc-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
  dlg.querySelector('.vc-dl').addEventListener('click', function () {
    send('vcard_download', { source: source || 'unknown' });
  });

  fab.addEventListener('click', function () { openModal('fab', fab); });

  var triggers = document.querySelectorAll('.vcard-open');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (ev) {
      ev.preventDefault();
      openModal('contact_page', this);
    });
  }
})();

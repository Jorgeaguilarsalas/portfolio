/**
 * Cookie banner + Google Consent Mode v2 + carga condicional de GA4.
 *
 * Se incluye en todas las paginas de jorgeag.com con una sola linea:
 *   <script src="/consent.js" defer></script>
 *
 * El archivo es autocontenido a proposito (inyecta su propio CSS): el sitio no
 * tiene bundle ni hoja compartida, y una segunda peticion solo para el banner
 * haria que apareciera sin estilos durante un instante.
 *
 * Modelo de consentimiento: Consent Mode basico. gtag.js no se carga hasta que
 * el visitante acepta. Antes de esa aceptacion no sale ni una peticion hacia
 * Google —tampoco un ping sin cookies—, de modo que su IP no llega a los
 * servidores de Google. Al aceptar, un 'consent update' pasa analytics_storage
 * a granted y solo entonces se inyecta gtag.js.
 *
 * Los defaults en denied se siguen fijando al arrancar, antes que nada. Con el
 * modelo basico nada puede llegar a gtag.js por delante de ellos, pero dejarlos
 * cuesta cero y cubre el dia en que algo vuelva a cargar la etiqueta antes de
 * tiempo: la cola ya estaria en denied.
 *
 * Contrapartida asumida a proposito: GA4 pierde el modelado de la parte no
 * consentida del trafico, porque deja de recibir los pings sin cookies que lo
 * alimentaban. GA4 pasa a contar solo a quien acepta.
 */
(function () {
  'use strict';

  var GA_ID = 'G-4XMR36K6W9';
  var STORAGE_KEY = 'consent_decision';
  var OPTOUT_KEY = 'ga_opt_out';
  var TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 ano

  /* Exclusion del propio autor, por dispositivo y no por IP: la IPv6 de una
     linea residencial rota a diario y no cubre el movil en datos. Con
     ?noga=1 este navegador deja de cargar GA para siempre; ?noga=0 lo
     deshace. No toca el consentimiento: el banner se sigue viendo igual que
     lo ve cualquiera. */
  function optedOut() {
    try { return localStorage.getItem(OPTOUT_KEY) === '1'; } catch (e) { return false; }
  }

  var noga = null;
  try { noga = new URLSearchParams(location.search).get('noga'); } catch (e) {}
  if (noga === '1' || noga === '0') {
    try {
      if (noga === '1') localStorage.setItem(OPTOUT_KEY, '1');
      else localStorage.removeItem(OPTOUT_KEY);
    } catch (e) {}
  }
  var EXCLUDED = optedOut();

  /* ----------------------------------------------------------------- gtag */

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  /* Defaults denied para todos los visitantes, sin distincion regional: una
     sola ruta de codigo que auditar, y la region nunca se infiere mal.
     functionality_storage y security_storage quedan granted porque cubren lo
     que el sitio necesita para funcionar y no sirven para perfilar. */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });

  /* -------------------------------------------------------------- idioma */

  var COPY = {
    en: {
      title: 'Cookies & Analytics',
      desc: 'This site uses necessary cookies to function and optional analytics cookies (Google Analytics) to understand how visitors use this website. Analytics helps improve content and user experience. You can change your preference anytime via the Datenschutzerklärung.',
      accept: 'Accept analytics',
      decline: 'Decline',
      more: 'Learn more →',
      label: 'Cookie preferences'
    },
    de: {
      title: 'Cookies & Analytics',
      desc: 'Diese Website nutzt notwendige Cookies zur Funktion und optionale Analyse-Cookies (Google Analytics), um zu verstehen, wie Besucher diese Website nutzen. Analytics hilft, Inhalte und Benutzererfahrung zu verbessern. Sie können Ihre Einstellung jederzeit über die Datenschutzerklärung ändern.',
      accept: 'Analytics akzeptieren',
      decline: 'Ablehnen',
      more: 'Mehr erfahren →',
      label: 'Cookie-Einstellungen'
    },
    es: {
      title: 'Cookies y Analytics',
      desc: 'Este sitio utiliza cookies necesarias para funcionar y cookies opcionales de analytics (Google Analytics) para entender cómo los visitantes usan este sitio web. Analytics ayuda a mejorar el contenido y la experiencia. Puedes cambiar tu preferencia en cualquier momento vía la Política de Privacidad.',
      accept: 'Aceptar analytics',
      decline: 'Rechazar',
      more: 'Más información →',
      label: 'Preferencias de cookies'
    }
  };

  /* El idioma de la pagina: el prefijo de la ruta manda, y si no lo hay, el
     atributo lang del documento. Sirve de respaldo del banner y vale igual
     para /de/motion/ que para /de/wolt/. */
  function pageLang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/es/') === 0) return 'es';
    var htmlLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    return COPY[htmlLang] ? htmlLang : null;
  }

  /* El banner lo lee una persona, no la pagina: manda el idioma que pide su
     navegador. Se recorre navigator.languages en orden de preferencia y gana
     el primero de los tres que tenemos; se compara solo el prefijo, asi que
     de-AT es 'de' y es-MX es 'es'. Si no pide ninguno de los tres (fr-FR),
     se le habla en el idioma de la pagina que esta leyendo.

     Los eventos NO usan esto: langFromPath() sigue saliendo de la ruta,
     porque ahi lo que interesa medir es que version se leyo, no quien la
     leia. */
  function pickLang() {
    var list = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || '').slice(0, 2).toLowerCase();
      if (COPY[code]) return code;
    }
    return pageLang() || 'en';
  }

  var T = COPY[pickLang()];

  /* ------------------------------------------------------------ decision */

  function readDecision() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (typeof d !== 'object' || d === null) return null;
      if (typeof d.ts !== 'number' || Date.now() - d.ts > TTL_MS) return null;
      if (typeof d.analytics !== 'boolean') return null;
      return d;
    } catch (e) {
      // Modo privado o storage bloqueado: sin decision recuperable, se vuelve
      // a preguntar. Nunca se asume consentimiento.
      return null;
    }
  }

  function writeDecision(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        analytics: analytics,
        ts: Date.now(),
        v: 1
      }));
    } catch (e) { /* sin persistencia: se volvera a preguntar */ }
  }

  /* --------------------------------------------------------------- GA4 */

  var gaLoaded = false;

  /* Se llama una sola vez, desde applyGrant y nunca antes. En el modelo basico
     esta carga ES la decision: si el visitante no acepta, gtag.js no existe en
     la pagina. */
  function loadGA() {
    if (EXCLUDED || gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    // GA4 trunca la IP antes de almacenarla, no hace falta anonymize_ip (es un
    // parametro de Universal Analytics que GA4 ignora).
    gtag('config', GA_ID);
  }

  /* Al revocar no basta con dejar de medir: las cookies _ga que quedaron de un
     consentimiento anterior tienen que irse. Se borran en el dominio exacto y
     en el punteado, que es donde GA las escribe. */
  function dropGaCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0 && name.indexOf('_gid') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  /* Los eventos personalizados miran esta bandera, no el localStorage: asi una
     decision tomada a mitad de visita vale de inmediato. */
  var granted = false;

  function applyGrant() {
    granted = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    // El update entra en dataLayer antes de inyectar el script, asi que cuando
    // gtag.js arranca encuentra la cola ya en granted: no hay ventana en denied.
    loadGA();
  }

  /* Tras un rechazo no queda nada corriendo: con el modelo basico gtag.js solo
     se carga desde applyGrant, asi que quien rechaza de entrada nunca lo tuvo en
     la pagina. El update a denied importa en el otro caso, el de revocar a mitad
     de visita: ahi gtag.js ya esta cargado y hay que pararlo en el acto. Las _ga
     que quedaran de aquel consentimiento se borran, porque revocar tiene que
     vaciar lo ya escrito; en la siguiente pagina el script ya no se carga. */
  function applyDeny() {
    granted = false;
    gtag('consent', 'update', { analytics_storage: 'denied' });
    dropGaCookies();
  }

  /* ----------------------------------------------------------- estilos */

  var CSS = [
    /* --cc-accent es el acento canonico de jorgeag.com (#B8FF3D, 262 usos).
       #C6FF00 es el lima del CV y de 343ride.de, otra marca. */
    ':root{--cc-bg:#14141a;--cc-accent:#B8FF3D;--cc-accent-fg:#0B0B0D;--cc-fg:#FFFFFF;--cc-muted:#8A8A8F;}',
    /* El velo solo enfoca la atencion: no intercepta clics ni bloquea el
       scroll. Un banner que tapa el sitio hasta obtener un si seria un cookie
       wall, y el consentimiento dejaria de ser libre. */
    '.cc-veil{position:fixed;inset:0;z-index:2147483646;pointer-events:none;',
    'background:linear-gradient(to bottom,rgba(11,11,13,0) 40%,rgba(11,11,13,.55) 100%);}',
    '.cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;',
    'background:var(--cc-bg);border-top:1px solid var(--cc-accent);',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    'box-shadow:0 -18px 48px rgba(0,0,0,.45);',
    /* El foco se mueve aqui por codigo al abrir, para que un lector de
       pantalla anuncie el dialogo. El anillo por defecto sobraria: no es un
       control, y enmarcaria el banner entero. */
    'outline:none;}',
    /* Cada pagina del sitio trae su propio CSS (no hay hoja compartida) y
       varias ponen en mayusculas todos los h2. Sin estos resets el banner
       hereda tipografia ajena y se ve distinto en cada seccion. */
    '.cc-banner,.cc-banner *{box-sizing:border-box;text-transform:none;',
    'font-style:normal;text-shadow:none;}',
    '.cc-inner{display:flex;gap:28px;align-items:center;justify-content:space-between;',
    'flex-wrap:wrap;padding:24px 32px;max-width:1180px;margin:0 auto;}',
    '.cc-text{flex:1 1 420px;min-width:0;}',
    '.cc-title{margin:0 0 6px;font-family:inherit;font-size:15px;font-weight:600;',
    'line-height:1.35;color:var(--cc-fg);letter-spacing:-.01em;}',
    '.cc-desc{margin:0;font-family:inherit;font-size:13px;font-weight:400;',
    'line-height:1.6;color:var(--cc-muted);max-width:720px;letter-spacing:normal;}',
    '.cc-link{display:inline-block;margin:8px 0 0;padding:0;font-family:inherit;',
    'font-size:13px;font-weight:500;line-height:1.4;letter-spacing:normal;',
    'color:var(--cc-accent);text-decoration:none;border-bottom:0;}',
    '.cc-link:hover{text-decoration:underline;}',
    '.cc-actions{display:flex;gap:12px;flex:0 0 auto;}',
    /* Mismo tamano en ambos botones: la diferencia es de estilo, no de peso.
       Si rechazar costara mas que aceptar, el consentimiento no seria libre. */
    '.cc-btn{font-family:inherit;font-size:13.5px;font-weight:600;line-height:1.2;',
    'letter-spacing:normal;border-radius:28px;margin:0;',
    'padding:12px 26px;cursor:pointer;white-space:nowrap;transition:opacity .18s ease;}',
    '.cc-btn:hover{opacity:.85;}',
    '.cc-btn:focus-visible{outline:2px solid var(--cc-accent);outline-offset:3px;}',
    '.cc-accept{background:var(--cc-accent);color:var(--cc-accent-fg);border:1.5px solid var(--cc-accent);}',
    '.cc-decline{background:transparent;color:var(--cc-accent);border:1.5px solid var(--cc-accent);}',
    '@media(max-width:720px){',
    '.cc-inner{padding:16px 20px;gap:16px;align-items:stretch;}',
    '.cc-actions{width:100%;}',
    '.cc-btn{flex:1 1 0;padding:13px 16px;}',
    '}',
    '.cc-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);',
    'z-index:2147483647;max-width:calc(100vw - 32px);',
    'background:var(--cc-bg);border:1px solid var(--cc-accent);border-radius:999px;',
    'padding:10px 20px;color:var(--cc-fg);font-family:inherit;font-size:13px;',
    'font-weight:500;letter-spacing:normal;text-align:center;',
    'box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .4s ease;}',
    '.cc-toast.is-out{opacity:0;}',
    '@media(prefers-reduced-motion:no-preference){',
    '.cc-banner{animation:cc-up .32s cubic-bezier(.22,.61,.36,1) both;}',
    '@keyframes cc-up{from{transform:translateY(100%)}to{transform:translateY(0)}}',
    '}'
  ].join('');

  /* ------------------------------------------------------------ banner */

  var nodes = null;
  var lastFocus = null;

  function close() {
    if (!nodes) return;
    nodes.veil.remove();
    nodes.banner.remove();
    nodes = null;
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  }

  function decide(analytics) {
    writeDecision(analytics);
    if (analytics) applyGrant();
    else applyDeny();
    close();
    // Si la decision se tomo desde el control del Datenschutz, el texto de
    // estado que hay en esa pagina tiene que reflejarla ya.
    refreshStatus();
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function estilos() {
    var style = document.getElementById('cc-style');
    if (!style) {
      style = el('style');
      style.id = 'cc-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return style;
  }

  function show() {
    if (nodes) return;
    lastFocus = document.activeElement;

    var style = document.getElementById('cc-style');
    if (!style) {
      style = el('style');
      style.id = 'cc-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    var veil = el('div', 'cc-veil');
    veil.setAttribute('aria-hidden', 'true');

    var banner = el('div', 'cc-banner');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', T.label);
    // aria-modal queda en false a proposito: el resto de la pagina sigue
    // navegable, asi que anunciarla como modal seria mentirle al lector.
    banner.setAttribute('aria-modal', 'false');
    banner.tabIndex = -1;

    var inner = el('div', 'cc-inner');
    var text = el('div', 'cc-text');
    var title = el('h2', 'cc-title', T.title);
    var desc = el('p', 'cc-desc', T.desc);
    var link = el('a', 'cc-link', T.more);
    link.href = '/datenschutz/#analytics';
    text.appendChild(title);
    text.appendChild(desc);
    text.appendChild(link);

    var actions = el('div', 'cc-actions');
    var decline = el('button', 'cc-btn cc-decline', T.decline);
    decline.type = 'button';
    decline.addEventListener('click', function () { decide(false); });
    var accept = el('button', 'cc-btn cc-accept', T.accept);
    accept.type = 'button';
    accept.addEventListener('click', function () { decide(true); });
    actions.appendChild(decline);
    actions.appendChild(accept);

    inner.appendChild(text);
    inner.appendChild(actions);
    banner.appendChild(inner);

    document.body.appendChild(veil);
    document.body.appendChild(banner);
    nodes = { veil: veil, banner: banner };
    banner.focus();
  }

  /* ---------------------------------------------------------- aviso */

  var TOAST = {
    en: { on: "This browser no longer counts in Analytics",
          off: "This browser counts in Analytics again" },
    de: { on: "Dieser Browser zählt nicht mehr in Analytics",
          off: "Dieser Browser zählt wieder in Analytics" },
    es: { on: "Este navegador ya no cuenta en Analytics",
          off: "Este navegador vuelve a contar en Analytics" }
  };

  /* Va arriba y no abajo para no pisar el banner de cookies, que ocupa el
     borde inferior y puede estar visible a la vez. */
  function aviso(texto) {
    var el = document.createElement('div');
    el.className = 'cc-toast';
    el.setAttribute('role', 'status');
    el.textContent = texto;
    var poner = function () {
      document.body.appendChild(el);
      setTimeout(function () { el.classList.add('is-out'); }, 4200);
      setTimeout(function () { el.remove(); }, 4800);
    };
    if (document.body) poner();
    else document.addEventListener('DOMContentLoaded', poner);
  }

  /* ------------------------------------------------------------ eventos */

  var CASE_STUDIES = ['wolt', 'bolt', 'bliq', 'nexio', 'alcorte'];
  var ENGAGED_AFTER_MS = 30000;

  /* Para los eventos el idioma sale solo de la ruta, no de navigator: lo que
     interesa medir es que version de la pagina se estaba leyendo.
     Va como 'page_language' y no como 'language': GA4 reserva ese nombre para
     el idioma del navegador y descarta en silencio el parametro homonimo, asi
     que el evento llegaba sin el y la dimension quedaba siempre vacia. */
  function langFromPath() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/es/') === 0) return 'es';
    return 'en';
  }

  /* Unica puerta de salida de los eventos. Si no hay consentimiento no se
     envia nada, y el resto del codigo no tiene que acordarse de comprobarlo. */
  function track(name, params) {
    if (EXCLUDED || !granted || typeof gtag !== 'function') return;
    gtag('event', name, params || {});
  }

  var INTERNAL_HOSTS = ['jorgeag.com', 'www.jorgeag.com'];
  /* El propio host cuenta como interno ademas de los canonicos: en un preview
     de workers.dev o en local, si no, cada enlace del sitio se contaria como
     salida externa y ensuciaria el informe. */
  function isInternal(host) {
    return INTERNAL_HOSTS.indexOf(host) > -1 || host === location.hostname;
  }

  /* Cloudflare sirve la misma pagina en /wolt/ y en /wolt/index.html. Sin
     normalizar, la segunda forma no casaria con ningun patron y el evento se
     perderia sin que nada lo avisara. */
  function normalizePath(path) {
    return (path || '').replace(/index\.html?$/i, '');
  }

  /* /motion/ -> index, /motion/fn01-... -> fn01. Sirve para las notas que
     vengan despues sin tocar esto. */
  function motionDestination(path) {
    var p = normalizePath(path);
    if (/^\/(?:de\/|es\/)?motion\/?$/.test(p)) return 'index';
    var m = p.match(/\/(fn\d{2})/);
    return m ? m[1] : 'unknown';
  }

  /* Tipo de pagina para los eventos. Desde la arquitectura hibrida hay
     secciones con el mismo id en el home y en /about/ (#approach, #experience,
     #contact): sin este calificador GA4 mezcla las dos en el mismo bucket. */
  function pageType(path) {
    var p = normalizePath(path || location.pathname);
    p = p.replace(/^\/(?:de|es)(?=\/|$)/, '') || '/';
    if (p === '/') return 'home';
    if (p.indexOf('/about') === 0) return 'about';
    if (p.indexOf('/leadership-framework') === 0) return 'framework';
    if (p.indexOf('/motion') === 0) return 'motion';
    if (p.indexOf('/work') === 0) return 'work';
    if (p.indexOf('/contact') === 0) return 'contact';
    if (caseStudyOf(path || location.pathname)) return 'case_study';
    return 'other';
  }

  function caseStudyOf(path) {
    var m = normalizePath(path).match(/^\/(?:de\/|es\/)?([a-z-]+)\/?$/);
    if (!m) return null;
    return CASE_STUDIES.indexOf(m[1]) > -1 ? m[1] : null;
  }

  /* Un solo listener en document, en fase de captura para que se vea el clic
     aunque otro handler llame a stopPropagation. */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;

    var raw = a.getAttribute('href') || '';
    var enNav = !!a.closest('.nav-links, .mobile-menu, .rail-toc, nav');

    /* Navegacion medida en toda la barra, no solo en las anclas. Con la
       arquitectura hibrida la mitad del nav apunta a paginas reales, y esos
       clics no casaban con ninguna rama: se perdian sin avisar. */
    if (enNav) {
      var tipo = raw.charAt(0) === '#'
        ? 'anchor'
        : (a.protocol === 'http:' || a.protocol === 'https:')
            ? (isInternal(a.hostname) ? 'internal' : 'external')
            : 'other';
      track('nav_click', {
        destination: raw.charAt(0) === '#' ? raw : (tipo === 'external' ? a.href : normalizePath(a.pathname) || raw),
        nav_type: tipo,
        source_page: location.pathname,
        // se conserva para no romper los informes que ya agrupan por seccion
        section: raw.charAt(0) === '#' ? raw.slice(1) : ''
      });
    }
    // Las anclas no son navegacion, y ya quedaron medidas arriba.
    if (raw.charAt(0) === '#') return;
    var proto = (a.protocol || '').toLowerCase();
    if (proto === 'mailto:' || proto === 'tel:') return;
    if (proto !== 'http:' && proto !== 'https:') return;

    var host = a.hostname;
    var path = a.pathname || '';

    if (/\/Jorge_Aguilar_CV\.pdf$/i.test(path)) {
      track('cv_download', { page_language: langFromPath() });
      return;
    }
    if (isInternal(host) && path.indexOf('/motion') > -1) {
      /* Mide la entrada a la publicacion desde el portafolio. Dentro de
         /motion/ la navegacion entre notas es navegacion interna y ya la
         cuenta page_view: contarla tambien aqui inflaria el evento. */
      if (/^\/(?:de\/|es\/)?motion(\/|$)/.test(location.pathname)) return;
      track('motion_click', { page_language: langFromPath(), destination: motionDestination(path) });
      return;
    }
    if (/(^|\.)linkedin\.com$/i.test(host)) {
      track('linkedin_click', { source_page: location.pathname });
      return;
    }
    if (/(^|\.)calendly\.com$/i.test(host)) {
      track('calendly_click', { source_page: location.pathname });
      return;
    }
    // Resto de salidas. LinkedIn y Calendly ya salieron arriba, por eso no se
    // cuentan dos veces.
    if (!isInternal(host)) {
      track('external_link_click', { url: a.href, source_page: location.pathname });
    }
  }, true);

  /* Secciones vistas. El umbral no puede ser solo "el 50% de la seccion":
     work, experience y approach son mas altas que la ventana (a 390px work
     mide 2495px contra 844 de alto util), asi que ese 50% es inalcanzable y
     el evento no se dispararia nunca, en silencio. Cuenta como vista si se
     ve media seccion O si la seccion ocupa media pantalla, que es lo que de
     verdad significa "la estoy mirando". */
  var SECCION_MS = 1000;

  (function secciones() {
    if (!('IntersectionObserver' in window)) return;
    var arranca = function () {
      var secs = document.querySelectorAll('main section[id], section[id]');
      if (!secs.length) return;
      var vistas = {};   // una vez por seccion y por visita
      var timers = {};

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var id = e.target.id;
          if (!id || vistas[id]) return;
          var medioAlto = (window.innerHeight || 0) / 2;
          var dentro = e.isIntersecting &&
            (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= medioAlto);
          if (dentro) {
            if (timers[id]) return;
            timers[id] = setTimeout(function () {
              timers[id] = null;
              if (vistas[id]) return;
              vistas[id] = true;
              track('section_view', { section: id, page_type: pageType(location.pathname) });
              io.unobserve(e.target);
            }, SECCION_MS);
          } else if (timers[id]) {
            // salio antes de cumplir el segundo: no cuenta
            clearTimeout(timers[id]); timers[id] = null;
          }
        });
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

      for (var i = 0; i < secs.length; i++) io.observe(secs[i]);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
    else arranca();
  })();

  /* Lectura de un case study: 30 s de permanencia real. Si la pestana se
     oculta antes, el temporizador se cancela y no se reprograma, que es lo que
     evita contar pestanas abiertas de fondo. */
  (function engagement() {
    var study = caseStudyOf(location.pathname);
    if (!study) return;
    var timer = setTimeout(function () {
      track('case_study_engaged', {
        case_study: study,
        page_language: langFromPath(),
        duration: ENGAGED_AFTER_MS / 1000
      });
    }, ENGAGED_AFTER_MS);
    function cancel() {
      if (timer) { clearTimeout(timer); timer = null; }
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') cancel();
    });
    // pagehide cubre la navegacion; en moviles beforeunload no siempre llega.
    window.addEventListener('pagehide', cancel);
  })();

  /* --------------------------------------------------------------- init */

  /* Orden deliberado: defaults (arriba) -> update -> gtag.js. gtag.js solo se
     carga desde applyGrant, asi que quien no ha decidido todavia, quien rechazo
     y quien lleva ?noga=1 no generan una sola peticion hacia Google. */

  // El aviso va aqui y no junto a la lectura del parametro porque necesita
  // que CSS ya este asignado.
  if (noga === '1' || noga === '0') {
    estilos();
    var t = TOAST[pickLang()] || TOAST.en;
    aviso(noga === '1' ? t.on : t.off);
  }

  var decision = readDecision();
  if (decision) {
    // Decision vigente: se aplica en silencio, sin volver a preguntar.
    if (decision.analytics) applyGrant();
    else applyDeny();
  } else if (document.body) {
    show();
  } else {
    document.addEventListener('DOMContentLoaded', show);
  }

  /* API para el control de la Datenschutzerklarung, que permite cambiar la
     preferencia despues de haberla dado (lo que promete el texto del banner). */
  window.__consent = {
    open: show,
    set: decide,
    // El formulario de contacto lo usa para su propio evento: solo el sabe si
    // el Worker respondio 200.
    track: track,
    granted: function () { return granted; },
    current: function () {
      var d = readDecision();
      return d ? d.analytics : null;
    }
  };

  /* Enlaza cualquier control marcado en la pagina, sin que esa pagina
     necesite JS propio. */
  function refreshStatus() {
    var status = document.getElementById('consent-status');
    if (!status) return;
    var d = readDecision();
    status.textContent = status.getAttribute(
      d === null ? 'data-none' : d.analytics ? 'data-on' : 'data-off'
    ) || '';
  }

  function wire() {
    var open = document.querySelectorAll('[data-consent-open]');
    for (var i = 0; i < open.length; i++) {
      open[i].addEventListener('click', function (ev) { ev.preventDefault(); show(); });
    }
    refreshStatus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();

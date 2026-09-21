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
 * Modelo de consentimiento: el patron recomendado por Google. gtag.js se carga
 * siempre, pero solo despues de fijar los defaults de Consent Mode v2 en
 * denied. Con analytics_storage en denied, gtag no escribe cookies ni envia
 * identificadores: manda pings sin cookies que permiten a GA4 modelar la
 * parte no consentida del trafico. Al aceptar, un 'consent update' pasa
 * analytics_storage a granted y desde ahi si hay cookies _ga.
 *
 * El orden importa y es lo unico fragil del archivo: el push de 'default'
 * tiene que ocurrir antes de que gtag.js se ejecute. Por eso el script se
 * inyecta desde aqui y no con una etiqueta suelta en el <head> de cada
 * pagina, que podria adelantarsele.
 *
 * Contrapartida asumida a proposito: bajo este modelo la IP del visitante
 * llega a Google antes de que haya consentimiento, cosa que el modelo
 * anterior evitaba. Queda reflejado en la seccion 13 del Datenschutz.
 */
(function () {
  'use strict';

  var GA_ID = 'G-4XMR36K6W9';
  var STORAGE_KEY = 'consent_decision';
  var TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 ano

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
      desc: 'This site uses necessary cookies to function and optional analytics cookies (Google Analytics) to understand how visitors use the portfolio. Analytics helps improve content and user experience. You can change your preference anytime via the Datenschutzerklärung.',
      accept: 'Accept analytics',
      decline: 'Decline',
      more: 'Learn more →',
      label: 'Cookie preferences'
    },
    de: {
      title: 'Cookies & Analytics',
      desc: 'Diese Website nutzt notwendige Cookies zur Funktion und optionale Analyse-Cookies (Google Analytics), um zu verstehen, wie Besucher das Portfolio nutzen. Analytics hilft, Inhalte und Benutzererfahrung zu verbessern. Sie können Ihre Einstellung jederzeit über die Datenschutzerklärung ändern.',
      accept: 'Analytics akzeptieren',
      decline: 'Ablehnen',
      more: 'Mehr erfahren →',
      label: 'Cookie-Einstellungen'
    },
    es: {
      title: 'Cookies y Analytics',
      desc: 'Este sitio utiliza cookies necesarias para funcionar y cookies opcionales de analytics (Google Analytics) para entender cómo los visitantes usan el portafolio. Analytics ayuda a mejorar el contenido y la experiencia. Puedes cambiar tu preferencia en cualquier momento vía la Política de Privacidad.',
      accept: 'Aceptar analytics',
      decline: 'Rechazar',
      more: 'Más información →',
      label: 'Preferencias de cookies'
    }
  };

  /* La ruta manda: en este sitio el idioma de la pagina es el del prefijo, y
     es lo que la persona esta leyendo. navigator.language solo decide si la
     ruta no lo dice (solo pasaria en una pagina suelta sin prefijo). */
  function pickLang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/es/') === 0) return 'es';
    var htmlLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (COPY[htmlLang]) return htmlLang;
    var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || '')
      .slice(0, 2).toLowerCase();
    return COPY[nav] ? nav : 'en';
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

  /* Se llama una sola vez, en el arranque y con los defaults ya fijados. Lo que
     decide si hay medicion real no es esta carga, sino el valor de
     analytics_storage. */
  function loadGA() {
    if (gaLoaded) return;
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

  function applyGrant() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  /* gtag.js sigue corriendo tras un rechazo, pero en modo denied: sin cookies y
     sin identificadores. Las _ga que hubieran quedado de un consentimiento
     anterior se borran, porque revocar tiene que vaciar lo ya escrito. */
  function applyDeny() {
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

  /* --------------------------------------------------------------- init */

  /* Orden deliberado: defaults (arriba) -> gtag.js -> update. El update de una
     decision ya guardada entra dentro de la ventana de wait_for_update, asi que
     gtag no llega a enviar nada en denied para quien ya habia aceptado. */
  loadGA();

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

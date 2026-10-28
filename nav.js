/**
 * Auto-ocultar la barra de navegacion.
 *
 * Va aparte de consent.js y de tab.js por la misma razon que ellos estan
 * separados: aquel decide si se puede medir y tiene que cargar igual en todas
 * partes, y esto es comportamiento de interfaz del portafolio.
 *
 * Reglas, en orden de prioridad:
 *   1. arriba del todo, o menu movil abierto, o foco dentro de la barra  -> visible
 *   2. puntero cerca del borde superior                                  -> visible
 *   3. scroll hacia abajo pasado el umbral                               -> oculta
 *   4. scroll hacia arriba                                               -> visible
 *
 * El umbral evita que la barra parpadee con el rebote de scroll de iOS y con
 * los saltos de ancla, que mueven cientos de pixeles de golpe.
 */
(function () {
  'use strict';

  /* La publicacion vive en otro proyecto y sirve su propia barra; si alguna
     vez incluyera este archivo, no deberia gobernarsela desde aqui. */
  if (/^\/(?:de\/|es\/)?motion(\/|$)/.test(location.pathname)) return;

  /* Un solo selector desde la unificacion: todas las paginas abren la barra
     con <header class="nav" id="nav">. Antes hacia falta tambien nav.nav, que
     era el envoltorio de la variante con flecha de volver; ya no existe. */
  var nav = document.querySelector('header.nav');
  if (!nav) return;

  var TOP_ZONE = 90;    // franja superior en la que el puntero revela la barra
  var THRESHOLD = 140;  // por encima de esto la barra nunca se oculta
  var DELTA = 6;        // ruido de scroll que no cuenta como direccion
  var MIN_SCROLL = 700; // por debajo de esto la pagina no da recorrido para ocultarla

  var lastY = window.scrollY || 0;
  var pointerUp = false;
  var queued = false;

  function show() { nav.classList.remove('nav-hidden'); }
  function hide() { nav.classList.add('nav-hidden'); }

  function sync() {
    queued = false;
    var y = window.scrollY || 0;

    // El menu movil desplegado y el foco de teclado mandan sobre todo lo demas:
    // esconder la barra dejaria el foco en un elemento fuera de pantalla.
    if (document.body.classList.contains('menu-open') || nav.contains(document.activeElement)) {
      show(); lastY = y; return;
    }
    if (y <= THRESHOLD || pointerUp) { show(); lastY = y; return; }

    /* En una pagina que apenas se desplaza (aviso legal, 404) esconder la
       barra deja poco recorrido para recuperarla con el propio scroll. */
    var scrollable = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
    if (scrollable < MIN_SCROLL) { show(); lastY = y; return; }

    var diff = y - lastY;
    if (Math.abs(diff) > DELTA) {
      if (diff > 0) hide(); else show();
      lastY = y;
    }
  }

  window.addEventListener('scroll', function () {
    if (!queued) { queued = true; window.requestAnimationFrame(sync); }
  }, { passive: true });

  document.addEventListener('mousemove', function (ev) {
    var up = ev.clientY <= TOP_ZONE;
    if (up === pointerUp) return;      // solo al cruzar la franja, no en cada pixel
    pointerUp = up;
    if (up) show(); else sync();
  }, { passive: true });

  // Al salir el puntero por arriba la barra se queda visible; al salir por
  // cualquier otro lado se recalcula.
  document.addEventListener('mouseleave', function () { pointerUp = false; });

  // Tabular hacia la barra la trae de vuelta aunque este oculta.
  nav.addEventListener('focusin', show);

  window.addEventListener('resize', sync, { passive: true });
  sync();
})();

/**
 * Foco del menu movil desplegable.
 *
 * El abrir/cerrar sigue en el <script> de cada pagina; lo que vive aqui es solo
 * el foco, y vive aqui porque estaba roto en las 38 copias a la vez.
 *
 * El bug: openMenu() llamaba a closeBtn.focus() en la misma vuelta en que
 * anade .open, y en ese instante el overlay sigue en visibility:hidden (la
 * transicion de .3s no ha empezado a avanzar), asi que el navegador ignora el
 * focus() sin avisar. El foco se quedaba detras del dialogo: tabular despues de
 * abrir recorria la pagina de debajo. Medido con sondas a 0/50/350/600ms: a 0ms
 * no entra, a 350ms si.
 *
 * Asi que el foco no se pide una vez y a ver si cuela: se reintenta fotograma
 * a fotograma hasta que entra de verdad. El unico momento correcto es "cuando
 * el overlay ya acepta foco", y eso no lo dice bien ningun reloj. transitionend
 * se adelanta --- con prefers-reduced-motion la transicion dura .01ms y el
 * evento llega antes de que visibility haya resuelto, asi que el focus() se
 * pierde igual que antes --- y un temporizador fijo o se queda corto o hace
 * esperar de mas. Comprobar document.activeElement despues de cada intento es
 * la unica senal que no miente, y ademas mete el foco en el primer fotograma en
 * que es posible, no al final de la animacion.
 *
 * El limite lo marca la duracion leida del CSS computado, no un 300 a mano que
 * se desincroniza en cuanto alguien toca la hoja.
 *
 * Y una vez dentro, se queda dentro: aria-modal="true" se lo promete al lector
 * de pantalla, pero Tab no lo cumple solo. Escape no esta aqui: el handler de
 * cada pagina ya cierra y devuelve el foco a la hamburguesa.
 */
(function () {
  if (/^\/(?:de\/|es\/)?motion(\/|$)/.test(location.pathname)) return;

  var menu = document.getElementById('mobileMenu');
  var close = document.getElementById('menuClose');
  if (!menu || !close) return;

  var raf = 0;
  var deadline = 0;

  function isOpen() { return menu.classList.contains('open'); }

  /* Los enlaces del overlay entran con opacity/transform, que no cambian el
     layout, asi que el filtro de visibilidad solo descarta lo que de verdad no
     esta ahi (el selector de idioma falta en alguna pagina). */
  function focusables() {
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; }
    );
  }

  /* La duracion efectiva sale del CSS computado, no de una constante: la hoja
     declara dos propiedades (opacity y visibility) y las reduce a .01ms con
     prefers-reduced-motion. Manda la mas larga, delay incluido. */
  function transitionMs(el) {
    var cs = getComputedStyle(el);
    var dur = (cs.transitionDuration || '0s').split(',');
    var delay = (cs.transitionDelay || '0s').split(',');
    var max = 0;
    for (var i = 0; i < dur.length; i++) {
      max = Math.max(max, (parseFloat(dur[i]) || 0) + (parseFloat(delay[i]) || 0));
    }
    return max * 1000;
  }

  function cancel() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function settle() {
    raf = 0;
    if (!isOpen()) return;

    /* Si el foco ya esta dentro no se toca: puede haberlo movido quien navega,
       y robarselo de vuelta al boton de cerrar seria peor que el bug. */
    if (menu.contains(document.activeElement)) return;

    close.focus();
    if (document.activeElement === close) return;   // entro

    /* No era enfocable todavia. Se reintenta mientras quede plazo; pasado el
       plazo se deja estar, que la trampa de Tab de abajo recoge el caso. */
    if (Date.now() < deadline) raf = requestAnimationFrame(settle);
  }

  /* Se observa la clase en vez de engancharse al click de la hamburguesa: el
     estado abierto es .open, y asi da igual quien lo haya puesto. */
  new MutationObserver(function () {
    if (!isOpen()) { cancel(); return; }
    deadline = Date.now() + transitionMs(menu) + 400;
    if (!raf) raf = requestAnimationFrame(settle);
  }).observe(menu, { attributes: true, attributeFilter: ['class'] });

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Tab' || !isOpen()) return;
    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;

    // Si el foco se quedo fuera (transicion a medias, click en el fondo), entra.
    if (!menu.contains(active)) {
      ev.preventDefault();
      (ev.shiftKey ? last : first).focus();
      return;
    }
    if (ev.shiftKey && active === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && active === last) { ev.preventDefault(); first.focus(); }
  });
})();

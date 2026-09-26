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

  var nav = document.querySelector('header.nav, nav.nav');
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

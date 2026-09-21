/**
 * Titulo de la pestana cuando el visitante se va a otra.
 *
 * Va aparte de consent.js a proposito: aquel decide si se puede medir y tiene
 * que cargar igual en todas partes; esto es un detalle de tono que solo aplica
 * al portafolio.
 *
 * Al ocultarse la pestana el titulo alterna dos veces con el mensaje y se
 * queda en el. Al volver se restaura el original de inmediato, sin esperar a
 * ningun temporizador pendiente.
 */
(function () {
  'use strict';

  /* La publicacion vive en otro proyecto y carga /consent.js de este origen;
     si alguna vez incluyera tambien este archivo, no deberia cambiarle el
     titulo. Se comprueba aqui y no solo al no incluirlo. */
  if (/^\/(?:de\/|es\/)?motion(\/|$)/.test(location.pathname)) return;

  var MSG = {
    en: '👋 Come back anytime',
    de: '👋 Bis gleich',
    es: '👋 Vuelve cuando quieras'
  };

  var STEP_MS = 1000;
  var ALTERNATIONS = 2;

  /* Misma logica que el banner: manda el idioma que pide el navegador, y si no
     pide ninguno de los tres, el de la pagina que se esta leyendo. */
  function pageLang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/es/') === 0) return 'es';
    var h = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    return MSG[h] ? h : null;
  }

  function pickLang() {
    var list = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || '').slice(0, 2).toLowerCase();
      if (MSG[code]) return code;
    }
    return pageLang() || 'en';
  }

  var away = MSG[pickLang()];
  var original = document.title;
  var timer = null;
  var running = false;

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
    running = false;
  }

  function alternate(step) {
    // Pasos: mensaje, original, mensaje. Termina en el mensaje.
    document.title = step % 2 === 0 ? away : original;
    if (step >= ALTERNATIONS) { timer = null; return; }
    timer = setTimeout(function () { alternate(step + 1); }, STEP_MS);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (running) return;
      running = true;
      // Se relee por si la pagina cambio su propio titulo desde la carga.
      if (document.title !== away) original = document.title;
      if (reduced()) document.title = away;
      else alternate(0);
    } else {
      stop();
      document.title = original;
    }
  });
})();

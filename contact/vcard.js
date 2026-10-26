/**
 * Tarjeta de contacto digital en /contact/ (EN/DE/ES).
 *
 * El boton es un enlace real a /jorge-aguilar.vcf: sin JS, o en un navegador
 * sin <dialog>, descarga la tarjeta directamente. Con JS abre el modal con el
 * QR (contact/vcard-qr.svg, generado por `npm run vcard`).
 *
 * <dialog> nativo con showModal(): Esc, foco atrapado e inercia del resto de
 * la pagina los da el navegador. Clic fuera de la tarjeta lo cierra: el
 * dialogo no tiene padding, asi que un clic cuyo target es el propio <dialog>
 * solo puede venir del backdrop.
 *
 * Eventos: vcard_modal_open y vcard_download, a GA4 (via __consent.track, que
 * ya exige consentimiento) y a Umami, tambien solo con consentimiento.
 * Documentado en la Datenschutzerklarung, secciones 13 y 14a.
 */
(function () {
  'use strict';

  var dlg = document.getElementById('vcard-modal');
  var open = document.querySelector('.vcard-open');
  if (!dlg || !open || typeof dlg.showModal !== 'function') return;

  var closeBtn = dlg.querySelector('.vcard-close');
  var dl = dlg.querySelector('.vcard-dl');
  var root = document.documentElement;

  function lang() {
    var p = location.pathname;
    if (p.indexOf('/de/') === 0) return 'de';
    if (p.indexOf('/es/') === 0) return 'es';
    return 'en';
  }

  function send(name, extra) {
    var c = window.__consent;
    if (!c || !c.granted || !c.granted()) return;
    var params = { page_language: lang() };
    for (var k in extra) params[k] = extra[k];
    if (c.track) c.track(name, params);
    try {
      if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, params);
    } catch (e) { /* un fallo de medicion no puede romper el modal */ }
  }

  open.addEventListener('click', function (ev) {
    ev.preventDefault();
    dlg.showModal();
    root.classList.add('vcard-lock');
    send('vcard_modal_open', { source: 'contact_page' });
  });

  closeBtn.addEventListener('click', function () { dlg.close(); });

  dlg.addEventListener('click', function (ev) {
    if (ev.target === dlg) dlg.close();
  });

  dlg.addEventListener('close', function () {
    root.classList.remove('vcard-lock');
    open.focus();
  });

  dl.addEventListener('click', function () { send('vcard_download', {}); });
})();

/* Validacion y envio del formulario de contacto.
   Los textos vienen del <script id="i18n" type="application/json"> de cada
   pagina, asi este archivo se comparte entre EN/DE/ES. */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;

  var T = JSON.parse(document.getElementById('i18n').textContent);
  var result = document.getElementById('result');
  var btn = form.querySelector('.submit');
  var otherWrap = document.getElementById('other-wrap');
  var inquiry = form.elements.inquiry_type;

  /* "Sonstiges/Otro" revela el campo libre */
  function syncOther() {
    var on = inquiry.value === 'other';
    otherWrap.hidden = !on;
  }
  if (inquiry && otherWrap) { inquiry.addEventListener('change', syncOther); syncOther(); }

  function fieldOf(el) { return el.closest('.field') || el.closest('.consent'); }
  function clearErrors() {
    form.querySelectorAll('.has-error').forEach(function (n) { n.classList.remove('has-error'); });
  }
  function fail(el, msg) {
    var f = fieldOf(el);
    if (!f) return;
    f.classList.add('has-error');
    var slot = f.querySelector('.err');
    if (slot && msg) slot.textContent = msg;
  }

  function show(kind, html) {
    result.className = 'result ' + kind;
    result.innerHTML = html;
    result.setAttribute('role', kind === 'is-err' ? 'alert' : 'status');
  }

  /* Si el backend no puede enviar, no se pierde el lead: se ofrece un mailto
     ya redactado con lo que la persona escribio. */
  function mailtoFallback(d) {
    var lines = [];
    ['name', 'email', 'phone', 'company', 'role', 'inquiry_type', 'other_specify', 'timeline', 'budget', 'how_found']
      .forEach(function (k) { if (d[k]) lines.push(k + ': ' + d[k]); });
    lines.push('', d.message || '');
    return 'mailto:' + T.mailbox + '?subject=' + encodeURIComponent(T.mailSubject) +
           '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function collect() {
    var d = {};
    new FormData(form).forEach(function (v, k) { d[k] = typeof v === 'string' ? v.trim() : v; });
    d.consent = form.elements.consent.checked;
    return d;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    clearErrors();
    var d = collect();

    /* (email O telefono) Y mensaje Y consentimiento */
    var ok = true;
    if (!d.email && !d.phone) {
      fail(form.elements.email, T.errContact);
      fail(form.elements.phone, T.errContact);
      ok = false;
    } else if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
      fail(form.elements.email, T.errEmail); ok = false;
    }
    if (!d.message || d.message.length < 20) { fail(form.elements.message, T.errMessage); ok = false; }
    if (!d.consent) { fail(form.elements.consent, T.errConsent); ok = false; }
    if (!ok) {
      show('is-err', T.errFix);
      var first = form.querySelector('.has-error input,.has-error textarea,.has-error select');
      if (first) first.focus();
      return;
    }

    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = T.sending;
    result.className = 'result';

    fetch('/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, d, { lang: T.lang }))
    })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); })
      .then(function (res) {
        if (res.body && res.body.ok) {
          form.hidden = true;
          show('is-ok', '<span class="mark">&#10003;</span>' + T.success);
          return;
        }
        var code = (res.body && res.body.code) || 'error';
        if (code === 'not_configured' || res.status >= 500) {
          show('is-err', T.unavailable.replace('{link}',
            '<a href="' + mailtoFallback(d) + '">' + T.unavailableLink + '</a>'));
        } else if (code === 'rate_limited') {
          show('is-err', T.rateLimited);
        } else if (code === 'captcha') {
          show('is-err', T.captcha);
        } else {
          show('is-err', (res.body && res.body.message) || T.errFix);
        }
      })
      .catch(function () {
        show('is-err', T.unavailable.replace('{link}',
          '<a href="' + mailtoFallback(d) + '">' + T.unavailableLink + '</a>'));
      })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });
})();

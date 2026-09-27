/**
 * POST /contact/submit — backend del formulario de contacto.
 *
 * Deliberadamente no se declara ningun binding nuevo en wrangler.toml. Un
 * `[[send_email]]` cuyo destination_address no este verificado en Email
 * Routing hace fallar `wrangler deploy`, y eso congelaria los deploys de todo
 * el portafolio. Aqui todo se lee de `env` a la defensiva: sin configurar, el
 * endpoint responde `not_configured` y el frontend ofrece un mailto ya
 * redactado, asi que ningun lead se pierde mientras falte el setup.
 *
 * Configuracion (ver README):
 *   TURNSTILE_SECRET_KEY  secret — si existe, el token pasa a ser obligatorio
 *   RESEND_API_KEY        secret — via de envio que si alcanza a terceros,
 *                         necesaria para el auto-reply
 *   MAIL                  binding send_email — alternativa para el aviso a
 *                         Jorge; Email Workers solo entrega a direcciones
 *                         verificadas de la cuenta, asi que no sirve para el
 *                         auto-reply a un desconocido
 *   CONTACT_KV            binding KV — rate limiting real entre isolates
 *   CONTACT_FROM          var — remitente del aviso (default contact@jorgeag.com)
 *   CONTACT_REPLY_FROM    var — remitente del auto-reply (default hello@jorgeag.com)
 *   CONTACT_INBOX         var — destino del aviso (default hello@jorgeag.com)
 */

const INBOX = "hello@jorgeag.com";
const FROM_DEFAULT = "contact@jorgeag.com";
/* El auto-reply sale como la direccion que la persona ya conoce del sitio, para
   que una respuesta suya caiga en la bandeja real y no en un buzon tecnico. */
const REPLY_FROM_DEFAULT = "hello@jorgeag.com";
const MAX_PER_WINDOW = 3;
const WINDOW_SECONDS = 3600;
/* Por debajo de tres segundos no hay persona: nadie lee, rellena y envia este
   formulario en ese tiempo. Entre tres y ocho es plausible pero raro, asi que
   no se rechaza, se marca. */
const MIN_FILL_MS = 3000;
const GREY_FILL_MS = 8000;
/* Un token de Turnstile emitido hace mucho suele venir de una sesion
   automatizada que lo guardo y lo reutiliza mas tarde. */
const STALE_TOKEN_MS = 15 * 60 * 1000;

/* Fallback de rate limiting cuando no hay KV: vive en el isolate y se reinicia
   con el. No es robusto, pero encarece el abuso sin pedir configuracion. */
const memHits = new Map();

const AUTOREPLY = {
  en: {
    subject: "Thanks for reaching out — Jorge Aguilar",
    greet: (n) => `Hi ${n || "there"},`,
    body: [
      "Thanks for your message. I've received it and will get back to you as soon as possible.",
      "",
      "In the meantime, you might enjoy:",
      "— Case studies at https://jorgeag.com/work/",
      "— Operations in Motion (research publication) at https://jorgeag.com/motion/",
      "",
      "Best,",
    ],
  },
  de: {
    subject: "Danke für Ihre Nachricht — Jorge Aguilar",
    greet: (n) => `Hallo ${n || ""}`.trim() + ",",
    body: [
      "Vielen Dank für Ihre Nachricht. Ich habe sie erhalten und melde mich so bald wie möglich.",
      "",
      "In der Zwischenzeit könnte Sie interessieren:",
      "— Case Studies auf https://jorgeag.com/de/work/",
      "— Operations in Motion (Rechercheveröffentlichung) auf https://jorgeag.com/de/motion/",
      "",
      "Beste Grüße,",
    ],
  },
  es: {
    subject: "Gracias por tu mensaje — Jorge Aguilar",
    greet: (n) => `Hola ${n || ""}`.trim() + ",",
    body: [
      "Gracias por tu mensaje. Lo he recibido y te respondo tan pronto como sea posible.",
      "",
      "Mientras tanto, puede que te interesen:",
      "— Case studies en https://jorgeag.com/es/work/",
      "— Operations in Motion (publicación de investigación) en https://jorgeag.com/es/motion/",
      "",
      "Saludos,",
    ],
  },
};

const SIGNATURE = ["Jorge Aguilar", "Founder @ Salas UG", "Co-founder @ Nexio Fleet", INBOX];

const CTRL = new RegExp("[\\u0000-\\u001f\\u007f]", "g");
const PRINTABLE_ASCII = new RegExp("^[\\u0020-\\u007e]*$");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CRLF = "\r\n";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

const clean = (v, max = 400) =>
  String(v == null ? "" : v).replace(CTRL, " ").trim().slice(0, max);

async function checkTurnstile(secret, token, ip) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const out = await r.json();
    /* Los error-codes distinguen "token gastado o falso" (invalid-input-response,
       el caso normal de un bot) de un problema de configuracion nuestro
       (invalid-input-secret). Sin esto, ambos se ven igual desde fuera: un 400. */
    if (out.success !== true) {
      console.warn("contact: turnstile rejected", JSON.stringify(out["error-codes"] || []));
    }
    /* Se devuelve el objeto y no un booleano: challenge_ts y hostname son dos
       de las pocas senales que Turnstile expone y alimentan la revision.
       Turnstile no da una puntuacion 0-1 como reCAPTCHA v3: no existe tal
       campo, asi que no se puede filtrar por umbral. */
    return { ok: out.success === true, ts: out.challenge_ts || null, host: out.hostname || null };
  } catch (err) {
    console.error("contact: turnstile unreachable", err && err.message);
    return { ok: false, ts: null, host: null, unreachable: true };
  }
}

const RATE_MSG = {
  en: "Please wait before submitting another message. If urgent, email hello@jorgeag.com directly.",
  de: "Bitte warten Sie, bevor Sie eine weitere Nachricht senden. Bei Dringlichkeit senden Sie eine E-Mail direkt an hello@jorgeag.com.",
  es: "Espera antes de enviar otro mensaje. Si es urgente, envía email directo a hello@jorgeag.com.",
};

/* Aviso a Telegram solo para lo que se marca para revision. Es opcional: sin
   las dos variables el envio no se intenta y el correo sale igual. */
async function notifyTelegram(env, lines) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join("\n"),
                             parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (err) {
    console.error("contact: telegram failed", err && err.message);
  }
}

async function rateLimited(env, ip) {
  const key = `contact:${ip}`;
  if (env.CONTACT_KV) {
    const n = parseInt((await env.CONTACT_KV.get(key)) || "0", 10);
    if (n >= MAX_PER_WINDOW) return true;
    // El TTL no se extiende al incrementar: la ventana corre desde el primer envio.
    await env.CONTACT_KV.put(key, String(n + 1), { expirationTtl: WINDOW_SECONDS });
    return false;
  }
  const now = Date.now();
  const hits = (memHits.get(ip) || []).filter((t) => now - t < WINDOW_SECONDS * 1000);
  if (hits.length >= MAX_PER_WINDOW) {
    memHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  memHits.set(ip, hits);
  if (memHits.size > 5000) memHits.clear();
  return false;
}

/* La IP completa se usa para rate limiting, pero no hace falta guardarla entera
   en un buzon: en el aviso viaja truncada (ultimo octeto IPv4 / ultimos cuatro
   grupos IPv6), que basta para reconocer un patron de abuso. */
function maskIp(ip) {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, Math.max(1, parts.length - 4)).join(":") + ":x";
  }
  const octets = ip.split(".");
  if (octets.length !== 4) return "unknown";
  return `${octets[0]}.${octets[1]}.${octets[2]}.x`;
}

function noticeText(d, ip) {
  const or = (v) => v || "not provided";
  const type = d.inquiry_type + (d.other_specify ? ` (${d.other_specify})` : "");
  return [
    `From: ${or(d.name)} <${or(d.email)}>`,
    `Phone: ${or(d.phone)}`,
    `Company: ${or(d.company)}`,
    `Role: ${or(d.role)}`,
    `Inquiry type: ${d.inquiry_type ? type : "not specified"}`,
    `Timeline: ${d.timeline || "not specified"}`,
    `Budget: ${d.budget || "not specified"}`,
    `How found: ${d.how_found || "not specified"}`,
    "",
    "Message:",
    d.message,
    "",
    "---",
    `Submitted at: ${new Date().toISOString()}`,
    `IP: ${maskIp(ip)} (masked, for spam detection only)`,
    `Language: ${d.lang}`,
  ].join("\n");
}

function autoreplyText(d) {
  const t = AUTOREPLY[d.lang] || AUTOREPLY.en;
  return {
    subject: t.subject,
    text: [t.greet(d.name), "", ...t.body, ...SIGNATURE].join("\n"),
  };
}

const b64utf8 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));

/* Cabeceras con no-ASCII se codifican (RFC 2047) para que asunto y nombre no
   lleguen roto. */
function mimeHeader(s) {
  return PRINTABLE_ASCII.test(s) ? s : `=?UTF-8?B?${b64utf8(s)}?=`;
}

function rfc822({ from, to, subject, text, replyTo }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${mimeHeader(subject)}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Message-ID: <${crypto.randomUUID()}@jorgeag.com>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  const body = b64utf8(text).replace(/(.{76})/g, `$1${CRLF}`);
  return headers.join(CRLF) + CRLF + CRLF + body;
}

async function sendViaResend(env, { to, subject, text, replyTo, from }) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Jorge Aguilar <${from || env.CONTACT_FROM || FROM_DEFAULT}>`,
      to: [to],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

async function sendViaEmailBinding(env, { to, subject, text, replyTo }) {
  // Import dinamico: si el modulo no estuviera disponible, falla solo esta via
  // y no el Worker entero.
  const { EmailMessage } = await import("cloudflare:email");
  const from = env.CONTACT_FROM || FROM_DEFAULT;
  await env.MAIL.send(new EmailMessage(from, to, rfc822({ from, to, subject, text, replyTo })));
}

export async function handleContactSubmit(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, code: "method", message: "POST only" }, 405);
  }

  let d;
  try {
    d = await request.json();
  } catch {
    return json({ ok: false, code: "bad_json", message: "Malformed body" }, 400);
  }

  // Honeypot: se responde 200 para no ensenarle al bot que fue detectado.
  if (clean(d.website)) {
    console.warn("contact: honeypot filled");
    return json({ ok: true, message: "Thanks." });
  }

  /* Tiempo entre el pintado del formulario y el envio. Solo se descarta por
     debajo del minimo, que es donde no cabe una persona; la franja gris se
     marca mas abajo, no se bloquea. Un reloj adelantado o un valor ausente
     dan NaN y entonces no se juzga. */
  const elapsed = Number(d.form_ms);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    console.warn("contact: submitted in", elapsed, "ms");
    return json({ ok: true, message: "Thanks." });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  /* La verificacion va antes de validar campos: es la puerta, y asi el trafico
     automatizado no llega siquiera a usar el endpoint como oraculo de
     validacion. El token se consume al comprobarlo, asi que el frontend pide
     uno nuevo (turnstile.reset) despues de cada respuesta de error. */
  let turn = { ok: true, ts: null, host: null };
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(d["cf-turnstile-response"] || d.turnstile_token, 2048);
    turn = token ? await checkTurnstile(env.TURNSTILE_SECRET_KEY, token, ip) : { ok: false };
    if (!turn.ok) {
      /* Se mantiene un 400 con mensaje reintentable en lugar del 429 generico:
         una persona real tambien falla aqui (token caducado, pestana abierta
         media hora), y decirle que espere una hora la pierde. El texto no
         nombra a Turnstile. */
      return json(
        { ok: false, code: "captcha", message: "We could not verify your browser. Please try again." },
        400
      );
    }
  }

  const data = {
    name: clean(d.name, 120),
    email: clean(d.email, 200).toLowerCase(),
    phone: clean(d.phone, 60),
    company: clean(d.company, 160),
    role: clean(d.role, 120),
    inquiry_type: clean(d.inquiry_type, 40),
    other_specify: clean(d.other_specify, 160),
    timeline: clean(d.timeline, 40),
    budget: clean(d.budget, 40),
    how_found: clean(d.how_found, 200),
    message: clean(d.message, 5000),
    lang: ["en", "de", "es"].includes(d.lang) ? d.lang : "en",
  };

  if (!data.email && !data.phone) {
    return json(
      { ok: false, code: "missing_contact", message: "Provide an email address or a phone number." },
      400
    );
  }
  if (data.email && !EMAIL_RE.test(data.email)) {
    return json({ ok: false, code: "bad_email", message: "Invalid email address." }, 400);
  }
  if (data.message.length < 20) {
    return json(
      { ok: false, code: "missing_message", message: "Message must be at least 20 characters." },
      400
    );
  }
  if (d.consent !== true && d.consent !== "1" && d.consent !== "on") {
    return json({ ok: false, code: "missing_consent", message: "Consent is required." }, 400);
  }

  if (await rateLimited(env, ip)) {
    return json({ ok: false, code: "rate_limited", message: RATE_MSG[data.lang] || RATE_MSG.en }, 429);
  }

  const hasResend = Boolean(env.RESEND_API_KEY);
  const hasBinding = Boolean(env.MAIL);
  if (!hasResend && !hasBinding) {
    return json({ ok: false, code: "not_configured", message: "Mail transport is not configured yet." }, 503);
  }

  /* Revision manual. Criterio deliberadamente conservador: una sola senal
     nunca marca nada, hacen falta dos. Y marcar no es filtrar — el correo sale
     igual a la bandeja, solo con el prefijo y el motivo, porque perder un
     mensaje legitimo cuesta mucho mas que revisar uno de mas. */
  const flags = [];
  if (Number.isFinite(elapsed) && elapsed >= MIN_FILL_MS && elapsed < GREY_FILL_MS) {
    flags.push(`filled in ${(elapsed / 1000).toFixed(1)}s`);
  }
  if (turn.ts) {
    const age = Date.now() - Date.parse(turn.ts);
    if (Number.isFinite(age) && age > STALE_TOKEN_MS) {
      flags.push(`verification token ${Math.round(age / 60000)} min old`);
    }
  }
  const links = (data.message.match(/https?:\/\//gi) || []).length;
  if (links >= 3) flags.push(`${links} links in the message`);
  if (data.message.length >= 20 && !/\s/.test(data.message.trim())) {
    flags.push("message has no spaces");
  }
  if (turn.host && !/(^|\.)jorgeag\.com$/.test(turn.host)) {
    flags.push(`token issued for ${turn.host}`);
  }
  const suspicious = flags.length >= 2;
  if (suspicious) console.warn("contact: flagged for review", JSON.stringify(flags));

  const notice = {
    to: env.CONTACT_INBOX || INBOX,
    subject: `${suspicious ? "[REVIEW] " : ""}[Contact form ${data.lang.toUpperCase()}] ${
      data.inquiry_type || "general"
    } — ${data.name || "Anonymous"}`,
    text: suspicious
      ? `FLAGGED FOR REVIEW — ${flags.join("; ")}\n` +
        `This message was delivered, not blocked. Check it before replying.\n\n` +
        noticeText(data, ip)
      : noticeText(data, ip),
    replyTo: data.email || undefined,
  };

  try {
    if (hasResend) await sendViaResend(env, notice);
    else await sendViaEmailBinding(env, notice);
  } catch (err) {
    console.error("contact: notice failed", err && err.message);
    return json({ ok: false, code: "send_failed", message: "Could not send right now." }, 502);
  }

  if (suspicious) {
    await notifyTelegram(env, [
      "\u26A0\uFE0F <b>Contact form flagged for review</b>",
      `From: ${data.name || "Anonymous"} &lt;${data.email || data.phone || "no contact"}&gt;`,
      `Why: ${flags.join("; ")}`,
      "The email was delivered to the inbox with a [REVIEW] prefix.",
    ]);
  }

  // Auto-reply: solo por Resend. El binding send_email no entrega a direcciones
  // sin verificar, y quien escribe nunca lo estara.
  if (data.email && hasResend) {
    try {
      const ar = autoreplyText(data);
      await sendViaResend(env, {
        to: data.email,
        subject: ar.subject,
        text: ar.text,
        from: env.CONTACT_REPLY_FROM || REPLY_FROM_DEFAULT,
      });
    } catch (err) {
      console.error("contact: autoreply failed", err && err.message);
    }
  }

  return json({ ok: true, message: "Thanks." });
}

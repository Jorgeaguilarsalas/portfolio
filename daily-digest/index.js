/**
 * Resumen diario de jorgeag.com por Telegram.
 *
 * Cron a las 08:00 de Berlin. Cloudflare solo programa en UTC, asi que hay dos
 * disparadores (06:00 y 07:00 UTC) y aqui se descarta el que no corresponde al
 * horario vigente: uno sobra en verano y el otro en invierno.
 *
 * Secretos (wrangler secret put, nunca en el repo):
 *   TELEGRAM_BOT_TOKEN   token del bot
 *   TELEGRAM_CHAT_ID     chat al que escribir
 *   GA_SA_EMAIL          client_email de la cuenta de servicio
 *   GA_SA_PRIVATE_KEY    private_key de la cuenta de servicio (PEM PKCS#8)
 *   TRIGGER_KEY          clave para lanzarlo a mano por HTTP
 *
 * Variables (wrangler.toml): GA_PROPERTY_ID, TZ_NAME
 */

const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API = "https://analyticsdata.googleapis.com/v1beta";

/* ───────────────────────────── fechas ───────────────────────────── */

/* La fecha civil en una zona horaria dada, como YYYY-MM-DD. Se usa Intl y no
   aritmetica de offsets para que el cambio de hora lo resuelva la tzdata del
   runtime y no una constante escrita a mano. */
function ymdIn(tz, date) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const g = (t) => p.find((x) => x.type === t).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}

function hourIn(tz, date) {
  return parseInt(new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", hour12: false
  }).format(date), 10);
}

/* Resta dias sobre la fecha civil, no sobre el instante: evita que un dia de
   23 o 25 horas desplace el rango. */
function minusDays(ymd, n) {
  const d = new Date(ymd + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fechaLarga(ymd) {
  const d = new Date(ymd + "T12:00:00Z");
  const nombre = DIAS[d.getUTCDay()];
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

/* ───────────────────────── autenticacion ───────────────────────── */

const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function pemToPkcs8(pem) {
  // El secreto puede llegar con \n literales si se pego a mano.
  const body = pem.replace(/\\n/g, "\n")
    .replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
  const raw = atob(body);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out.buffer;
}

async function accessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claims = b64url(new TextEncoder().encode(JSON.stringify({
    iss: env.GA_SA_EMAIL, scope: GA_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600
  })));
  const signing = `${header}.${claims}`;

  const key = await crypto.subtle.importKey(
    "pkcs8", pemToPkcs8(env.GA_SA_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key,
    new TextEncoder().encode(signing));

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signing}.${b64url(sig)}`
    })
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).access_token;
}

/* ─────────────────────────── consultas ─────────────────────────── */

async function runReport(env, token, body) {
  const res = await fetch(`${DATA_API}/properties/${env.GA_PROPERTY_ID}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`runReport ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const num = (r, i = 0) => Number(r?.metricValues?.[i]?.value || 0);
const dim = (r, i = 0) => r?.dimensionValues?.[i]?.value || "";
const totals = (rep, i = 0) => Number(rep?.rows?.[0]?.metricValues?.[i]?.value || 0);

async function gather(env, token, ayer) {
  const desde7 = minusDays(ayer, 7);
  const hasta7 = minusDays(ayer, 1);
  const METRICS = [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }];
  const rango = [{ startDate: ayer, endDate: ayer }];

  /* La dimension personalizada "section" hay que registrarla a mano en GA4 y
     solo existe a partir de ese momento. Si aun no esta, la API responde con
     un error de campo invalido: se omite la linea en vez de tumbar el
     resumen entero. */
  const secciones = runReport(env, token, {
    dateRanges: rango, dimensions: [{ name: "customEvent:section" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "section_view" } }
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }], limit: 5
  }).catch((e) => {
    console.log("secciones no disponibles:", e && e.message);
    return null;
  });

  const [hoy, semana, paginas, origenes, motion, form, paises] = await Promise.all([
    runReport(env, token, { dateRanges: rango, metrics: METRICS }),
    runReport(env, token, { dateRanges: [{ startDate: desde7, endDate: hasta7 }], metrics: METRICS }),
    runReport(env, token, {
      dateRanges: rango, dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 3
    }),
    runReport(env, token, {
      dateRanges: rango,
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }, { name: "sessionCampaignName" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 3
    }),
    /* Solo Motion: el resto del sitio sale por diferencia con el total.
       Tiene que ser una expresion y no "empieza por /motion", porque las
       versiones traducidas viven en /de/motion/ y /es/motion/ y quedaban
       contadas como portafolio. */
    runReport(env, token, {
      dateRanges: rango, metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "FULL_REGEXP", value: "^/(de/|es/)?motion(/.*)?$" }
        }
      }
    }),
    runReport(env, token, {
      dateRanges: rango, metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "contact_form_submit" } }
      }
    }),
    runReport(env, token, {
      dateRanges: rango, dimensions: [{ name: "countryId" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }], limit: 3
    })
  ]);

  return {
    usuarios: totals(hoy, 0), sesiones: totals(hoy, 1), vistas: totals(hoy, 2),
    media: {
      usuarios: totals(semana, 0) / 7, sesiones: totals(semana, 1) / 7, vistas: totals(semana, 2) / 7
    },
    paginas: (paginas.rows || []).map((r) => ({ ruta: dim(r), vistas: num(r) })),
    origenes: (origenes.rows || []).map((r) => ({
      fuente: dim(r, 0), medio: dim(r, 1), campana: dim(r, 2), sesiones: num(r)
    })),
    motionVistas: totals(motion, 0),
    envios: totals(form, 0),
    paises: (paises.rows || []).map((r) => ({ pais: dim(r), usuarios: num(r) })),
    secciones: ((await secciones)?.rows || [])
      .map((r) => ({ id: dim(r), vistas: num(r) }))
      .filter((x) => x.id && x.id !== "(not set)")
  };
}

/* ──────────────────────────── mensaje ──────────────────────────── */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const corta = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/* Comparacion contra la media de los 7 dias previos. Sin base con la que
   comparar no se inventa un porcentaje: se dice que es el primer dato. */
function comparar(hoy, media) {
  if (!media) return hoy > 0 ? " (primer dato)" : "";
  const pct = Math.round(((hoy - media) / media) * 100);
  if (pct === 0) return " (igual que la media 7d)";
  return ` (${pct > 0 ? "+" : ""}${pct}% vs media 7d)`;
}

const NOMBRE_MEDIO = { organic: "búsqueda", referral: "referido", none: "directo", "(none)": "directo" };

/* GA4 rellena con marcadores propios cuando aun no ha atribuido la sesion o no
   tiene el dato. Mostrarlos tal cual ("(not set) · (not set)") no dice nada;
   se traducen a algo legible o se omiten. */
const RELLENO = new Set(["(not set)", "(none)", "(direct)", "(organic)",
  "(cross-network)", "(data not available)", "(other)", ""]);

function componer(d, ayer) {
  const cab = `📊 <b>jorgeag.com</b>\n${fechaLarga(ayer)}`;

  if (!d.usuarios && !d.sesiones && !d.vistas) {
    return `${cab}\n\nSin visitas ayer.`;
  }

  const L = [cab, ""];
  L.push(`👥 ${d.usuarios} visitantes${comparar(d.usuarios, d.media.usuarios)}`);
  L.push(`🔁 ${d.sesiones} sesiones · 👁 ${d.vistas} páginas`);

  if (d.paginas.length) {
    L.push("", "📄 <b>Páginas</b>");
    d.paginas.forEach((p, i) => L.push(` ${i + 1}. ${esc(corta(p.ruta, 30))} — ${p.vistas}`));
  }

  if (d.origenes.length) {
    L.push("", "🌍 <b>Orígenes</b>");
    d.origenes.forEach((o, i) => {
      let etiqueta;
      if (o.fuente === "(direct)") etiqueta = "directo";
      else if (RELLENO.has(o.fuente)) etiqueta = "sin atribuir";
      else {
        const medio = RELLENO.has(o.medio) ? "" : (NOMBRE_MEDIO[o.medio] || o.medio);
        etiqueta = medio ? `${o.fuente} · ${medio}` : o.fuente;
      }
      L.push(` ${i + 1}. ${esc(corta(etiqueta, 30))} — ${o.sesiones}`);
      // La campana solo aparece si es una de verdad: es lo que dice que post
      // trajo gente. Los marcadores de GA4 serian ruido cada dia.
      if (o.campana && !RELLENO.has(o.campana)) {
        L.push(`    campaña: ${esc(corta(o.campana, 28))}`);
      }
    });
  }

  // Absolutos y porcentaje juntos, para que no haya que deducir nada.
  const motion = d.motionVistas;
  const porta = Math.max(0, d.vistas - motion);
  if (d.vistas > 0) {
    // Se redondea uno y el otro sale por diferencia: redondeando los dos por
    // separado la suma daba 101% y parecia un error de cuentas.
    const pcMotion = Math.round((motion / d.vistas) * 100);
    L.push("", `📚 Portafolio ${porta} (${100 - pcMotion}%) · Motion ${motion} (${pcMotion}%)`);
  }

  // Solo si hubo envios: una linea a cero cada dia seria ruido.
  if (d.envios > 0) {
    L.push(`✉️ ${d.envios} ${d.envios === 1 ? "envío" : "envíos"} del formulario`);
  }

  if (d.secciones.length) {
    L.push("", "🧭 <b>Secciones</b>");
    L.push(" " + d.secciones.map((x) => `${esc(x.id)} ${x.vistas}`).join(" · "));
  }

  if (d.paises.length) {
    L.push("", `🗺 ${d.paises.map((p) => `${esc(p.pais)} ${p.usuarios}`).join(" · ")}`);
  }

  return L.join("\n");
}

/* ──────────────────────────── telegram ─────────────────────────── */

async function enviar(env, texto) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID, text: texto,
      parse_mode: "HTML", disable_web_page_preview: true
    })
  });
  if (!res.ok) throw new Error(`telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/* ───────────────────────────── worker ──────────────────────────── */

async function ejecutar(env, fecha) {
  const tz = env.TZ_NAME || "Europe/Berlin";
  const ayer = fecha || minusDays(ymdIn(tz, new Date()), 1);
  const token = await accessToken(env);
  const datos = await gather(env, token, ayer);
  const texto = componer(datos, ayer);
  await enviar(env, texto);
  return { ayer, texto };
}

export default {
  async scheduled(event, env, ctx) {
    const tz = env.TZ_NAME || "Europe/Berlin";
    // De los dos crons solo uno cae a las 08:00 de Berlin segun la epoca del
    // ano; el otro se descarta aqui sin hacer ninguna llamada.
    const h = hourIn(tz, new Date(event.scheduledTime));
    if (h !== 8) {
      console.log(`descartado: en ${tz} son las ${h}:00, no las 08:00`);
      return;
    }
    ctx.waitUntil(ejecutar(env).then(
      (r) => console.log("enviado", r.ayer),
      async (e) => {
        console.error("fallo", e && e.message);
        // Un fallo silencioso pareceria un dia sin visitas. Mejor avisar.
        try { await enviar(env, `⚠️ El resumen de hoy no se pudo generar.\n\n${esc(String(e && e.message).slice(0, 300))}`); } catch (_) {}
      }
    ));
  },

  /* Disparo manual, para probar y para pedirlo fuera de hora.
     Requiere TRIGGER_KEY: sin ella el endpoint no hace nada. */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/run") return new Response("ok", { status: 200 });
    if (!env.TRIGGER_KEY || url.searchParams.get("key") !== env.TRIGGER_KEY) {
      return new Response("no", { status: 403 });
    }
    try {
      const r = await ejecutar(env, url.searchParams.get("date") || undefined);
      return new Response(`enviado (${r.ayer})\n\n${r.texto}`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    } catch (e) {
      return new Response(`error: ${e && e.message}`, { status: 500 });
    }
  }
};

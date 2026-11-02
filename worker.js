/**
 * Enrutamiento por hostname. El portafolio vive en jorgeag.com; 343ride.de
 * redirige entero al portafolio.
 *
 *   jorgeag.com/*                  assets del portafolio (canonico)
 *   343ride.de/*                   301 a jorgeag.com/*
 *   www.343ride.de/*               301 a jorgeag.com/*
 *   www.jorgeag.com/*              301 a jorgeag.com/* (canonico sin www)
 *   portfolio.*.workers.dev/*      301 a jorgeag.com/*
 *
 * Hay referencias externas a rutas viejas en 343ride.de (/wolt/, /impressum/,
 * /Jorge_Aguilar_CV.pdf), por eso el dominio sigue redirigiendo path a path
 * en vez de apagarse: asi esas referencias no se rompen.
 */

import { handleContactSubmit } from "./worker-contact.js";

const PORTFOLIO_ORIGIN = "https://jorgeag.com";

/* Hosts que solo redirigen, y a donde. Los previews de Cloudflare
   (<version>-portfolio.j-l-aguilar-salas.workers.dev) quedan fuera a proposito,
   para poder revisar un deploy antes de promoverlo. */
const REDIRECT_TO = new Map([
  ["www.jorgeag.com", PORTFOLIO_ORIGIN],
  ["portfolio.j-l-aguilar-salas.workers.dev", PORTFOLIO_ORIGIN],
  ["343ride.de", PORTFOLIO_ORIGIN],
  ["www.343ride.de", PORTFOLIO_ORIGIN],
]);

/* Se conservan path y query; el fragmento nunca llega al servidor. */
function redirect(origin, url) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: origin + url.pathname + url.search,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;

    const target = REDIRECT_TO.get(host);
    if (target) return redirect(target, url);

    // El formulario del portafolio postea aqui. Va antes de los assets porque
    // /contact/submit no es un archivo: solo existe como ruta del Worker.
    if (url.pathname === "/contact/submit") {
      return handleContactSubmit(request, env);
    }

    // La tarjeta de contacto: con text/vcard, Safari en iOS abre la ficha de
    // "Nuevo contacto" en vez de descargar un archivo opaco. El servidor de
    // assets no garantiza ese tipo para .vcf, asi que se fija aqui.
    if (url.pathname.endsWith(".vcf")) {
      const res = await env.ASSETS.fetch(request);
      if (!res.ok) return res;
      const headers = new Headers(res.headers);
      headers.set("Content-Type", "text/vcard; charset=utf-8");
      return new Response(res.body, { status: res.status, headers });
    }

    return env.ASSETS.fetch(request);
  },
};

/**
 * Enrutamiento por hostname. El portafolio vive en jorgeag.com; 343ride.de
 * sirve su propia landing en la raiz y redirige todo lo demas.
 *
 *   jorgeag.com/*                  assets del portafolio (canonico)
 *   343ride.de/                    landing de 343ride (placeholder)
 *   343ride.de/<path>              301 a jorgeag.com/<path>
 *   www.343ride.de/*               301 a 343ride.de/* (canonico sin www)
 *   www.jorgeag.com/*              301 a jorgeag.com/* (canonico sin www)
 *   portfolio.*.workers.dev/*      301 a jorgeag.com/*
 *
 * 343ride.de estuvo redirigido por completo a jorgeag.com, y hay referencias
 * externas a rutas viejas (/wolt/, /impressum/, /Jorge_Aguilar_CV.pdf). Solo
 * la raiz cambia de comportamiento: los deep links siguen resolviendo al
 * portafolio para no romper esas referencias.
 *
 * El HTML de la landing se importa como modulo de texto (regla [[rules]] en
 * wrangler.toml) y queda dentro del bundle del Worker, no en los assets. Con
 * `directory = "./"` un asset seria alcanzable tambien en
 * jorgeag.com/343ride-landing.html, es decir una copia indexable en el dominio
 * que acabamos de canonicalizar.
 */

import LANDING_HTML from "./343ride-landing.html";

const PORTFOLIO_ORIGIN = "https://jorgeag.com";
const RIDE_ORIGIN = "https://343ride.de";

/* Hosts que solo redirigen, y a donde. Los previews de Cloudflare
   (<version>-portfolio.j-l-aguilar-salas.workers.dev) quedan fuera a proposito,
   para poder revisar un deploy antes de promoverlo. */
const REDIRECT_TO = new Map([
  ["www.jorgeag.com", PORTFOLIO_ORIGIN],
  ["portfolio.j-l-aguilar-salas.workers.dev", PORTFOLIO_ORIGIN],
  // A la raiz propia, no directo al portafolio: separa "quitar www" de "que
  // sirve 343ride.de", asi la landing tambien aplica para www.
  ["www.343ride.de", RIDE_ORIGIN],
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

    if (host === "343ride.de") {
      if (url.pathname === "/") {
        return new Response(LANDING_HTML, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      }
      return redirect(PORTFOLIO_ORIGIN, url);
    }

    return env.ASSETS.fetch(request);
  },
};

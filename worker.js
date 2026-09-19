/**
 * El portafolio vive en jorgeag.com. El mismo Worker esta atado a varios
 * hostnames, y todos devolvian el mismo HTML: como los enlaces internos son
 * relativos, cada copia se enlazaba a si misma y competia en indexacion con el
 * dominio canonico.
 *
 * Aqui solo jorgeag.com sirve contenido. El resto responde 301 al mismo path en
 * jorgeag.com:
 *
 *   - 343ride.de / www.343ride.de  redirect temporal: el dominio se retoma
 *     como proyecto 343ride y entonces deja de apuntar a este Worker.
 *   - www.jorgeag.com             canonico sin www.
 *   - portfolio.*.workers.dev     URL por defecto del Worker.
 *
 * El email legal de Salas UG (fleet@343ride.de) no depende de esto: es un
 * registro MX, no una ruta del Worker, y sigue vigente en Impressum.
 */

const CANONICAL_ORIGIN = "https://jorgeag.com";

/* Todo lo demas se redirige. Los previews de Cloudflare
   (<version>-portfolio.j-l-aguilar-salas.workers.dev) quedan fuera a proposito,
   para poder revisar un deploy antes de promoverlo. */
const REDIRECT_HOSTS = new Set([
  "343ride.de",
  "www.343ride.de",
  "www.jorgeag.com",
  "portfolio.j-l-aguilar-salas.workers.dev",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      // Se conservan path y query; el fragmento nunca llega al servidor.
      const target = CANONICAL_ORIGIN + url.pathname + url.search;
      return new Response(null, {
        status: 301,
        headers: {
          Location: target,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

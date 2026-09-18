/**
 * El portafolio se sirve en tres endpoints: 343ride.de (canonico),
 * www.343ride.de y la URL por defecto del Worker en workers.dev. Los tres
 * devolvian el mismo HTML, y como los enlaces internos son relativos, la copia
 * de workers.dev se enlazaba a si misma: una segunda version indexable del
 * sitio compitiendo con el dominio propio.
 *
 * Aqui workers.dev deja de servir contenido y responde 301 al mismo path en
 * 343ride.de. Los dominios propios siguen sirviendo los assets igual que antes.
 */

const CANONICAL_ORIGIN = "https://343ride.de";

/* Solo el host de produccion del Worker. Los previews de Cloudflare
   (<version>-portfolio.j-l-aguilar-salas.workers.dev) quedan fuera a proposito,
   para poder revisar un deploy antes de promoverlo. */
const REDIRECT_HOSTS = new Set(["portfolio.j-l-aguilar-salas.workers.dev"]);

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

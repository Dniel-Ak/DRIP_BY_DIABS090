/**
 * Configuration centrale du site, utilisée par les métadonnées (SEO,
 * Open Graph, Twitter Card), le sitemap et le robots.txt.
 */

// URL publique du site, utilisée pour construire des URLs absolues
// (sitemap.xml, robots.txt, données structurées, images Open Graph).
// Configurable via NEXT_PUBLIC_SITE_URL (voir .env.local.example) — met à
// jour cette variable dès que le site est déployé sur son vrai nom de
// domaine, sinon le sitemap et les partages sur les réseaux pointeront
// vers ce nom de domaine provisoire.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dripbydiabs.com"
).replace(/\/+$/, "");

export const SITE_NAME = "DRIP BY DIABS";

export const SITE_DESCRIPTION =
  "DRIP BY DIABS — streetwear premium né à Abidjan : polos, bonnets et pièces à l'identité africaine contemporaine, conçus en petites séries.";

// Utilisé pour `openGraph.locale` (Facebook/Meta) — français, Côte d'Ivoire.
export const SITE_LOCALE = "fr_CI";

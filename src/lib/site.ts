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

/**
 * Locale au format `openGraph.locale` (Facebook/Meta), déduite de la locale
 * du site : français de Côte d'Ivoire pour la version par défaut, anglais
 * international pour la version `/en`.
 */
export function ogLocaleFor(locale: string): string {
  return locale === "en" ? "en_US" : "fr_CI";
}

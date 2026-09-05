import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/**
 * Chemins interdits à l'indexation, déclinés dans TOUTES les locales : le
 * panier et la confirmation de paiement existent aussi bien à la racine
 * française (`/panier`) que sous le préfixe anglais (`/en/panier`), et il
 * faut exclure les deux.
 */
function disallowInAllLocales(path: string): string[] {
  return routing.locales.map((locale) => getPathname({ href: path, locale }));
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Routes API (jamais du contenu à indexer, non localisées), panier
        // (personnel à chaque visiteur) et confirmation de paiement
        // (transactionnelle, référence de commande dans l'URL) — voir
        // metadata `robots` de ces pages pour le détail.
        disallow: [
          "/api/",
          ...disallowInAllLocales("/panier"),
          // Slash final rajouté ici : `getPathname()` normalise et retire
          // les slashs de fin, alors qu'on veut bien exclure tout le
          // sous-arbre `/paiement/…`.
          ...disallowInAllLocales("/paiement").map((path) => `${path}/`),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

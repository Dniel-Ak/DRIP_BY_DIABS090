import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Routes API (jamais du contenu à indexer), panier (personnel à
        // chaque visiteur) et confirmation de paiement (transactionnelle,
        // référence de commande dans l'URL) — voir metadata `robots` de
        // ces pages pour le détail.
        disallow: ["/api/", "/panier", "/paiement/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

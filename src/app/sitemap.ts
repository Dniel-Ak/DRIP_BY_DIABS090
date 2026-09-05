import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap généré à partir du catalogue (voir src/data/products.ts) : toute
 * nouvelle fiche produit y apparaît automatiquement, sans mise à jour
 * manuelle.
 *
 * Chaque page est listée UNE fois (dans sa version française, la locale par
 * défaut) avec ses variantes linguistiques déclarées en `alternates.languages`
 * — c'est la forme recommandée par Google pour un site multilingue : une
 * entrée par contenu, chaque entrée pointant vers toutes ses traductions.
 * Les URLs par locale sont calculées par next-intl (`/produits` en français,
 * `/en/produits` en anglais), jamais concaténées à la main.
 *
 * Le panier et la page de confirmation de paiement en sont volontairement
 * absents (voir leurs métadonnées `robots: { index: false }` et
 * src/app/robots.ts).
 */
function entry(
  path: string,
  changeFrequency: "weekly" | "yearly",
  priority: number
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}${getPathname({ href: path, locale })}`;
  }

  return {
    url: `${SITE_URL}${getPathname({ href: path, locale: routing.defaultLocale })}`,
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", "weekly", 1),
    entry("/produits", "weekly", 0.9),
    entry("/a-propos", "yearly", 0.4),
    entry("/contact", "yearly", 0.4),
  ];

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((product) =>
    entry(`/produits/${product.slug}`, "weekly", 0.8)
  );

  return [...staticRoutes, ...productRoutes];
}

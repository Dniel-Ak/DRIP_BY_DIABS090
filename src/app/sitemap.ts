import type { MetadataRoute } from "next";

import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap généré à partir du catalogue (voir src/data/products.ts) : toute
 * nouvelle fiche produit y apparaît automatiquement, sans mise à jour
 * manuelle. Le panier et la page de confirmation de paiement en sont
 * volontairement absents (voir leur métadonnées `robots: { index: false }`
 * et src/app/robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/produits`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map(
    (product) => ({
      url: `${SITE_URL}/produits/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...productRoutes];
}

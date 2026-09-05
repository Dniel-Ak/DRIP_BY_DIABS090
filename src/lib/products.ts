import { cache } from "react";

import { categories, products } from "@/data/products";
import type { Product, ProductCategory } from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

// `cache()` déduplique les appels avec le même argument au sein d'un même
// rendu serveur. Utile ici car `generateMetadata` et la page elle-même
// (src/app/produits/[slug]/page.tsx) appellent tous les deux
// `getProductBySlug(slug)` pour la même requête — sans ça, React refait
// le travail deux fois. Le catalogue est petit aujourd'hui (recherche en
// mémoire, quasi gratuite), mais c'est le bon réflexe dès qu'une de ces
// fonctions ira un jour chercher les produits dans une vraie base de
// données ou une API externe.
export const getProductBySlug = cache(function getProductBySlug(
  slug: string
): Product | undefined {
  return products.find((product) => product.slug === slug);
});

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function getCategories() {
  return categories;
}

export function getCategoryLabel(category: ProductCategory): string {
  return categories.find((c) => c.value === category)?.label ?? category;
}

export function formatPrice(price: number | null): string {
  if (price === null) {
    return "Prix à venir";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

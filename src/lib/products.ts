import { cache } from "react";

import { categories, products } from "@/data/products";
import { productCopyEn } from "@/data/products.en";
import type { Product, ProductCategory, ProductCopy } from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

// `cache()` déduplique les appels avec le même argument au sein d'un même
// rendu serveur. Utile ici car `generateMetadata` et la page elle-même
// (src/app/[locale]/produits/[slug]/page.tsx) appellent tous les deux
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

export function getCategories(): ProductCategory[] {
  return categories;
}

/**
 * Textes descriptifs du produit dans la locale demandée.
 *
 * Le catalogue porte la version française ; l'anglais vient de
 * src/data/products.en.ts. Si un produit n'a pas (encore) de traduction, on
 * retombe silencieusement sur le français plutôt que d'afficher un trou :
 * mieux vaut une description française sur la page anglaise qu'une page
 * vide. Les autres champs (nom, prix, images, coloris, tailles) ne sont
 * jamais traduits — voir src/data/products.en.ts.
 */
export function getProductCopy(product: Product, locale: string): ProductCopy {
  if (locale === "en") {
    const translated = productCopyEn[product.slug];
    if (translated) return translated;
  }
  return {
    shortDescription: product.shortDescription,
    description: product.description,
  };
}

/**
 * Formate un prix en francs CFA selon la locale affichée :
 * « 15 000 F CFA » en français, « F CFA 15,000 » en anglais.
 *
 * ⚠️ Le paramètre `locale` a une valeur par défaut française volontaire :
 * cette fonction sert aussi à composer le message de commande
 * WhatsApp/e-mail (src/components/CartView.tsx), qui doit rester en
 * français quelle que soit la langue affichée.
 */
export function formatPrice(price: number, locale: string = "fr"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

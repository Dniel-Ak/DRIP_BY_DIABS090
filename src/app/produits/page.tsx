import type { Metadata } from "next";
import { Suspense } from "react";

import ProductsExplorer from "@/components/ProductsExplorer";
import ProductsExplorerWithUrlFilter from "@/components/ProductsExplorerWithUrlFilter";
import { getAllProducts, getCategories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Boutique",
  description:
    "Découvrez tous les polos, bonnets, hoodies, t-shirts, vestes et accessoires DRIP BY DIABS.",
  path: "/produits",
});

// Page volontairement synchrone et sans `searchParams` : le catalogue est
// statique, donc cette page est entièrement pré-rendue au build et servie
// depuis le cache (voir ProductsExplorerWithUrlFilter pour le détail du
// filtre initial `?categorie=...`, géré côté client dans le Suspense
// ci-dessous plutôt qu'ici).
export default function ProduitsPage() {
  const categories = getCategories();
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <p className="font-signature text-eyebrow uppercase text-accent">
          Boutique
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          Toute la collection
        </h1>
      </div>

      <Suspense
        fallback={
          <ProductsExplorer products={products} categories={categories} />
        }
      >
        <ProductsExplorerWithUrlFilter
          products={products}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}

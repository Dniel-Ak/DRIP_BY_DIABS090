import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import ProductsExplorer from "@/components/ProductsExplorer";
import ProductsExplorerWithUrlFilter from "@/components/ProductsExplorerWithUrlFilter";
import { getAllProducts, getCategories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/produits">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildMetadata({
    title: t("productsTitle"),
    description: t("productsDescription"),
    path: "/produits",
    locale,
  });
}

// Page volontairement synchrone côté données et sans `searchParams` : le
// catalogue est statique, donc cette page est entièrement pré-rendue au
// build (dans les deux langues) et servie depuis le cache — voir
// ProductsExplorerWithUrlFilter pour le détail du filtre initial
// `?categorie=...`, géré côté client dans le Suspense ci-dessous plutôt
// qu'ici.
export default async function ProduitsPage(
  props: PageProps<"/[locale]/produits">
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Products" });
  const categories = getCategories();
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <p className="font-signature text-eyebrow uppercase text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          {t("title")}
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

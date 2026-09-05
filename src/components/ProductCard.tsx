"use client";

import { useLocale, useTranslations } from "next-intl";

import ProductImage from "@/components/ProductImage";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";

/**
 * Carte produit de la grille (accueil, boutique, "vous aimerez aussi").
 *
 * Composant client : il est rendu aussi bien depuis des pages serveur que
 * depuis `ProductsExplorer` (qui est, lui, un composant client à cause de
 * ses filtres interactifs). Un composant sans directive ne peut pas
 * utiliser de hook dans le second cas ; on le marque donc "use client" une
 * fois pour toutes, ce qui permet de lire les traductions et la locale
 * courante avec `useTranslations()`/`useLocale()` dans les deux situations.
 */
export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const tCategories = useTranslations("Categories");
  const tColors = useTranslations("Colors");

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-4 rounded-2xl p-3 transition-colors hover:bg-surface"
    >
      <div className="relative">
        <ProductImage
          images={product.images}
          slug={product.slug}
          name={product.name}
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="aspect-[4/5] w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            {t("new")}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-signature text-eyebrow uppercase text-muted">
          {tCategories(product.category)}
        </span>
        {/* Le nom du produit n'est jamais traduit (nom propre de marque). */}
        <h3 className="font-medium text-foreground">{product.name}</h3>
        <p className="text-sm text-muted">
          {product.colors
            .map((color) => (tColors.has(color) ? tColors(color) : color))
            .join(", ")}
        </p>
        <p className="mt-1 font-display text-display-sm text-accent">
          {product.price === null
            ? t("priceToBeAnnounced")
            : formatPrice(product.price, locale)}
        </p>
      </div>
    </Link>
  );
}

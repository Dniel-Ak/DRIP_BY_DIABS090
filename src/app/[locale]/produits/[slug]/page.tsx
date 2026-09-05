import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getPathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  formatPrice,
  getAllProducts,
  getProductBySlug,
  getProductCopy,
  getProductsByCategory,
} from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getProductStock } from "@/lib/stock";
import type { Product } from "@/types/product";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllProducts().map((product) => ({ locale, slug: product.slug }))
  );
}

// Le stock affiché sur cette page vient d'un fichier lu à chaque requête
// (src/lib/stock.ts) : on force donc un rendu dynamique (par requête)
// plutôt qu'un HTML statique généré une fois au build, pour que les
// tailles épuisées restent à jour en temps réel.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/[locale]/produits/[slug]">
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return { title: t("productNotFound"), robots: { index: false } };
  }

  const copy = getProductCopy(product, locale);

  return buildMetadata({
    // Le nom du produit est un nom propre de marque : identique en fr et
    // en en, seule la description est traduite.
    title: product.name,
    description: copy.shortDescription,
    path: `/produits/${product.slug}`,
    locale,
    // Vraie photo du produit plutôt que le visuel de marque générique
    // (src/app/[locale]/opengraph-image.tsx) — bien plus parlant pour un partage
    // sur les réseaux sociaux.
    images:
      product.images.length > 0
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
  });
}

/**
 * Données structurées schema.org (JSON-LD) décrivant le produit : nom,
 * description, image(s), prix et disponibilité. Aide Google à afficher des
 * résultats enrichis (prix, stock) dans les résultats de recherche —
 * validable avec https://search.google.com/test/rich-results.
 *
 * Le contenu suit la langue de la page (description et libellé de
 * catégorie traduits) : chaque version linguistique décrit donc le produit
 * dans sa propre langue, ce qui est ce qu'attendent les moteurs.
 */
function buildProductJsonLd(
  product: Product,
  stock: Record<string, number>,
  description: string,
  categoryLabel: string,
  locale: string
) {
  const totalStock = Object.values(stock).reduce((sum, n) => sum + n, 0);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    sku: product.slug,
    category: categoryLabel,
    brand: { "@type": "Brand", name: "DIABS" },
  };

  if (product.images.length > 0) {
    jsonLd.image = product.images.map((image) => `${SITE_URL}${image}`);
  }

  // Un prix pas encore fixé ("à venir") ne peut pas être décrit par une
  // Offer valide (le prix y est obligatoire) : on omet simplement le
  // champ plutôt que d'inventer un prix.
  if (product.price !== null) {
    jsonLd.offers = {
      "@type": "Offer",
      url: `${SITE_URL}${getPathname({ href: `/produits/${product.slug}`, locale })}`,
      priceCurrency: "XOF",
      price: product.price,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }

  return jsonLd;
}

export default async function ProductPage(
  props: PageProps<"/[locale]/produits/[slug]">
) {
  const { locale, slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ProductDetail" });
  const tProduct = await getTranslations({ locale, namespace: "Product" });
  const tCategories = await getTranslations({ locale, namespace: "Categories" });
  const tColors = await getTranslations({ locale, namespace: "Colors" });

  const copy = getProductCopy(product, locale);
  const categoryLabel = tCategories(product.category);

  const related = getProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  const stock = await getProductStock(product.slug);
  const productJsonLd = buildProductJsonLd(
    product,
    stock,
    copy.shortDescription,
    categoryLabel,
    locale
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="mb-8 text-sm text-muted">
        <Link href="/produits" className="hover:text-accent">
          {t("breadcrumbShop")}
        </Link>
        <span className="mx-2">/</span>
        {/* La valeur du paramètre reste la clé technique (`polos`), commune
            aux deux langues — seul le libellé affiché est traduit. */}
        <Link
          href={`/produits?categorie=${product.category}`}
          className="hover:text-accent"
        >
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          slug={product.slug}
          name={product.name}
        />

        <div>
          <span className="font-signature text-eyebrow uppercase text-muted">
            {categoryLabel}
          </span>
          <h1 className="mt-2 font-display text-display-lg uppercase leading-none text-foreground">
            {product.name}
          </h1>
          {product.colors.length <= 1 && (
            <p className="mt-2 text-sm text-muted">
              {t("singleColor", {
                color: product.colors
                  .map((color) => (tColors.has(color) ? tColors(color) : color))
                  .join(", "),
              })}
            </p>
          )}
          <p className="mt-4 font-display text-display text-accent">
            {product.price === null
              ? tProduct("priceToBeAnnounced")
              : formatPrice(product.price, locale)}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">
            {copy.description}
          </p>

          {product.details && product.details.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {detail}
                </li>
              ))}
            </ul>
          )}

          <AddToCartPanel
            slug={product.slug}
            sizes={product.sizes}
            colors={product.colors}
            price={product.price}
            stock={stock}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="mb-8 font-display text-display-lg uppercase text-foreground">
            {t("relatedTitle")}
          </h2>
          {/* `flex-wrap` avec une largeur fixe par carte plutôt qu'une
              grille à 4 colonnes fixes : le catalogue actuel n'a souvent
              qu'un seul produit "apparenté" par catégorie (2 produits par
              catégorie - le produit courant) — avec `grid-cols-4`, cette
              unique carte se serait étirée sur toute la largeur (ou,
              laissée à sa taille naturelle par la grille, aurait laissé un
              grand vide à droite sur desktop). Ici, chaque carte garde la
              même taille qu'elle aurait dans une grille à 4 colonnes,
              qu'il y ait 1 ou 4 produits apparentés. */}
          <div className="flex flex-wrap gap-4">
            {related.map((item) => (
              <div
                key={item.slug}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)]"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

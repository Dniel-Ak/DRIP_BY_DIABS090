import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import {
  formatPrice,
  getAllProducts,
  getCategoryLabel,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getProductStock } from "@/lib/stock";
import type { Product } from "@/types/product";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

// Le stock affiché sur cette page vient d'un fichier lu à chaque requête
// (src/lib/stock.ts) : on force donc un rendu dynamique (par requête)
// plutôt qu'un HTML statique généré une fois au build, pour que les
// tailles épuisées restent à jour en temps réel.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/produits/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Produit introuvable", robots: { index: false } };
  }

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/produits/${product.slug}`,
    // Vraie photo du produit plutôt que le visuel de marque générique
    // (src/app/opengraph-image.tsx) — bien plus parlant pour un partage
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
 */
function buildProductJsonLd(product: Product, stock: Record<string, number>) {
  const totalStock = Object.values(stock).reduce((sum, n) => sum + n, 0);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.slug,
    category: getCategoryLabel(product.category),
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
      url: `${SITE_URL}/produits/${product.slug}`,
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
  props: PageProps<"/produits/[slug]">
) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  const stock = await getProductStock(product.slug);
  const productJsonLd = buildProductJsonLd(product, stock);

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
          Boutique
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/produits?categorie=${product.category}`}
          className="hover:text-accent"
        >
          {getCategoryLabel(product.category)}
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
            {getCategoryLabel(product.category)}
          </span>
          <h1 className="mt-2 font-display text-display-lg uppercase leading-none text-foreground">
            {product.name}
          </h1>
          {product.colors.length <= 1 && (
            <p className="mt-2 text-sm text-muted">
              Coloris {product.colors.join(", ")}
            </p>
          )}
          <p className="mt-4 font-display text-display text-accent">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">
            {product.description}
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
            Vous aimerez aussi
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

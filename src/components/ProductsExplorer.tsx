"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import type { CategoryInfo, Product, ProductCategory } from "@/types/product";

type SortOrder = "pertinence" | "prix-asc" | "prix-desc";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

/** Ordre d'affichage privilégié pour les tailles connues ; les autres
 * valeurs (ex. "Taille unique") sont ajoutées ensuite, triées par ordre
 * alphabétique. */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a);
    const indexB = SIZE_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b, "fr");
  });
}

export default function ProductsExplorer({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: CategoryInfo[];
  initialCategory?: ProductCategory;
}) {
  const [activeCategory, setActiveCategory] = useState<
    ProductCategory | undefined
  >(initialCategory);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("pertinence");

  const availableSizes = useMemo(
    () => sortSizes(Array.from(new Set(products.flatMap((p) => p.sizes)))),
    [products]
  );

  function toggleSize(size: string) {
    setActiveSizes((current) =>
      current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size]
    );
  }

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => activeSizes.includes(size))
      );
    }

    if (sortOrder !== "pertinence") {
      const priced = result.filter((p) => p.price !== null);
      const unpriced = result.filter((p) => p.price === null);
      priced.sort((a, b) =>
        sortOrder === "prix-asc"
          ? (a.price ?? 0) - (b.price ?? 0)
          : (b.price ?? 0) - (a.price ?? 0)
      );
      result = [...priced, ...unpriced];
    }

    return result;
  }, [products, activeCategory, activeSizes, sortOrder]);

  const hasActiveFilters =
    activeCategory !== undefined ||
    activeSizes.length > 0 ||
    sortOrder !== "pertinence";

  // Comme sur la page d'accueil (voir src/app/page.tsx) : avec la classe
  // fixe `lg:grid-cols-4` d'origine, filtrer sur une catégorie qui ne
  // contient que 1 à 3 produits laissait les cartes plaquées à gauche
  // avec un grand vide à droite sur desktop. On limite donc les colonnes
  // au nombre de résultats affichés (jusqu'à 4) pour garder une grille
  // équilibrée quel que soit le filtre actif.
  const filteredGridCols =
    filtered.length >= 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : filtered.length === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : filtered.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  function resetFilters() {
    setActiveCategory(undefined);
    setActiveSizes([]);
    setSortOrder("pertinence");
  }

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-8">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Catégorie
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(undefined)}
              aria-pressed={!activeCategory}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !activeCategory
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground/80 hover:border-accent hover:text-accent"
              }`}
            >
              Tout
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() =>
                  setActiveCategory((current) =>
                    current === category.value ? undefined : category.value
                  )
                }
                aria-pressed={activeCategory === category.value}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.value
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-foreground/80 hover:border-accent hover:text-accent"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {availableSizes.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
              Taille
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  aria-pressed={activeSizes.includes(size)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeSizes.includes(size)
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-foreground/80 hover:border-accent hover:text-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm text-foreground/80">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Trier par
            </span>
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="rounded-full border border-border bg-transparent px-4 py-2 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-background text-foreground"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      <p className="mb-6 mt-8 text-sm text-muted">
        {filtered.length} produit{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className={`grid gap-4 ${filteredGridCols}`}>
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Aucun produit ne correspond à ces filtres pour le moment.
        </p>
      )}
    </div>
  );
}

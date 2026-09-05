"use client";

import { useSearchParams } from "next/navigation";

import ProductsExplorer from "@/components/ProductsExplorer";
import type { Product, ProductCategory } from "@/types/product";

/**
 * Fine couche client au-dessus de `ProductsExplorer` : lit la catégorie
 * initiale depuis l'URL (`?categorie=...`) via `useSearchParams`, plutôt
 * que via le prop `searchParams` de la page serveur.
 *
 * Pourquoi : lire `searchParams` dans la page (`src/app/[locale]/produits/page.tsx`)
 * forçait tout le rendu de cette page à devenir dynamique (recalculé à
 * chaque requête) alors que le catalogue est statique et ne change qu'au
 * redéploiement. En déplaçant cette seule lecture ici, côté client, la
 * page reste entièrement statique — générée une fois au build, servie
 * ensuite depuis le cache pour toutes les requêtes — tout en gardant le
 * lien `/produits?categorie=polos` fonctionnel (pré-sélectionne le filtre
 * dès l'hydratation).
 *
 * Doit être rendu à l'intérieur d'un <Suspense> (voir la page) : c'est ce
 * qu'exige `useSearchParams` pour qu'une page statique puisse quand même
 * être envoyée pré-rendue, avec seulement cette petite partie recalculée
 * côté client.
 */
export default function ProductsExplorerWithUrlFilter({
  products,
  categories,
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  const searchParams = useSearchParams();
  const categorieParam = searchParams.get("categorie");

  // Le nom du paramètre (`categorie`) et ses valeurs (`polos`, `bonnets`...)
  // sont IDENTIQUES dans les deux langues : ce sont des clés techniques, pas
  // du texte affiché. Un lien `/produits?categorie=polos` partagé en
  // français fonctionne donc tel quel sur `/en/produits?categorie=polos`.
  const initialCategory = categories.some(
    (category) => category === categorieParam
  )
    ? (categorieParam as ProductCategory)
    : undefined;

  return (
    <ProductsExplorer
      products={products}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}

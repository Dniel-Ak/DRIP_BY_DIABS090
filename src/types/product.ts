export type ProductCategory =
  | "polos"
  | "bonnets"
  | "hoodies"
  | "t-shirts"
  | "vestes"
  | "accessoires";

/**
 * Texte descriptif d'un produit, dans UNE langue donnée. Le catalogue
 * (src/data/products.ts) porte la version française ; les traductions
 * anglaises vivent dans src/data/products.en.ts, indexées par slug.
 * Voir `getProductCopy()` dans src/lib/products.ts.
 */
export interface ProductCopy {
  shortDescription: string;
  description: string;
}

export interface Product {
  slug: string;
  /** Nom commercial — JAMAIS traduit : c'est un nom propre de marque
   * ("Young Rich Papi FC", "Bonnet DIABS 090"...), identique en fr et en en. */
  name: string;
  category: ProductCategory;
  /** Prix en francs CFA (XOF). `null` = prix pas encore fixé ("à préciser"). */
  price: number | null;
  colors: string[];
  sizes: string[];
  shortDescription: string;
  description: string;
  /** Photos produit, chemins sous /public. Vide → visuel placeholder généré. */
  images: string[];
  details?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export type ProductCategory =
  | "polos"
  | "bonnets"
  | "hoodies"
  | "t-shirts"
  | "vestes"
  | "accessoires";

export interface CategoryInfo {
  value: ProductCategory;
  label: string;
}

export interface Product {
  slug: string;
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

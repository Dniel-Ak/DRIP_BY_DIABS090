import type { ProductCopy } from "@/types/product";

/**
 * Traductions anglaises des textes descriptifs du catalogue, indexées par
 * slug produit.
 *
 * Pourquoi un fichier séparé plutôt qu'un champ `descriptionEn` dans
 * src/data/products.ts, ou une entrée dans messages/en.json :
 *
 * - Le catalogue (src/data/products.ts) reste la source de vérité
 *   STRUCTURELLE du produit (slug, nom, prix, images, coloris, tailles) —
 *   des données identiques dans toutes les langues, qu'on ne veut surtout
 *   pas dupliquer ni risquer de désynchroniser en les recopiant par locale.
 *   Ici on n'ajoute QUE les deux champs réellement traduisibles.
 *
 * - Ces textes ne vivent pas dans messages/en.json parce que l'intégralité
 *   des dictionnaires est sérialisée vers le client par
 *   `NextIntlClientProvider` : y mettre les descriptions longues de tout le
 *   catalogue alourdirait chaque page, alors qu'elles ne sont lues que par
 *   des composants serveur (fiche produit + `generateMetadata`).
 *
 * Un slug absent de cette table retombe automatiquement sur le texte
 * français (voir `getProductCopy()` dans src/lib/products.ts), donc ajouter
 * un produit au catalogue ne casse jamais la version anglaise.
 *
 * ⚠️ On ne traduit JAMAIS le nom du produit : "Young Rich Papi FC",
 * "Bonnet DIABS 090"... sont des noms propres de marque.
 */
export const productCopyEn: Record<string, ProductCopy> = {
  "young-rich-papi-fc": {
    shortDescription:
      "Jersey polo inspired by the Young Rich 090 mindset — ambition, confidence and streetwear culture.",
    description:
      "Young Rich Papi FC stands for the Young Rich 090 mindset: aim higher, move with ambition and build your own path. Its football-inspired look, crossed with the DIABS codes, makes it a statement piece designed for those who carry that mentality every day.",
  },
  "fc-diabs-golden-era": {
    shortDescription:
      "The FC DIABS signature jersey polo, inspired by football culture and the DIABS universe.",
    description:
      "FC DIABS blends the codes of football with the label's visual identity, in a black, white and gold palette. The Golden Era wording marks this new chapter for DIABS and asserts a vision rooted in culture, ambition and Ivorian heritage.",
  },
  "bonnet-diabs-090": {
    shortDescription:
      "Signature DIABS crochet beanie, marked by the 090 identity and its gold details.",
    description:
      "Hand-crocheted, this beanie carries the strong DIABS identity with a black, white and gold contrast. The shining details and the DIABS 090 lettering give it a distinctive finish, designed to complete a streetwear look.",
  },
  "bonnet-diabs-090-beige": {
    shortDescription:
      "Crochet beanie in beige and white tones, designed within the premium DIABS universe.",
    description:
      "A crochet piece in natural shades, lifted by subtle details that keep the DIABS identity intact. Its minimal, textured look brings a premium and versatile touch to the silhouette.",
  },
};

import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

const DEFAULT_OG_IMAGE: SeoImage[] = [
  { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME },
];

/**
 * Construit les métadonnées d'une page (title, description, URL canonique,
 * Open Graph) de façon cohérente, sans dupliquer cette logique dans
 * chaque page.
 *
 * `twitter` n'est volontairement PAS renseigné ici : quand une page définit
 * `openGraph` mais pas `twitter`, Next.js remplit automatiquement la
 * Twitter Card (titre, description, image) à partir d'`openGraph` — voir
 * la doc Next.js sur `twitter` ("The Twitter specification is used for
 * more than just X") et `resolve-metadata.js`. Le type de carte
 * (`summary_large_image`) est défini une seule fois dans le layout racine
 * et s'applique déjà à toutes les pages.
 */
export function buildMetadata({
  title,
  description,
  path,
  images = DEFAULT_OG_IMAGE,
}: {
  /** Titre court de la page (ex. "Boutique") — le suffixe "· DRIP BY DIABS"
   * est ajouté automatiquement à la fois pour <title> (via le template du
   * layout racine) et pour Open Graph (composé ici). */
  title: string;
  description: string;
  /** Chemin de la page, ex. "/produits" — résolu en URL absolue via
   * `metadataBase` (voir src/app/layout.tsx). */
  path: string;
  /** Images Open Graph spécifiques à la page (ex. la photo du produit).
   * Par défaut : le visuel de marque généré (src/app/opengraph-image.tsx). */
  images?: SeoImage[];
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images,
    },
  };
}

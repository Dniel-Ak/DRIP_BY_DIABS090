import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME, ogLocaleFor } from "@/lib/site";

interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

/**
 * Visuel Open Graph par défaut d'une page, dans la bonne locale.
 *
 * L'image est générée par la convention `opengraph-image` du segment
 * `[locale]` (src/app/[locale]/opengraph-image.tsx). On la référence
 * explicitement, plutôt que de laisser Next.js l'attacher tout seul, parce
 * que Next.js écrirait alors systématiquement l'URL PRÉFIXÉE
 * (`/fr/opengraph-image`) — or, en `localePrefix: "as-needed"`, cette URL
 * redirige (307) vers `/opengraph-image`. En la calculant avec
 * `getPathname()`, les robots des réseaux sociaux tombent directement sur
 * l'URL finale, sans redirection.
 */
function defaultOgImage(locale: string): SeoImage[] {
  return [
    {
      url: getPathname({ href: "/opengraph-image", locale }),
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ];
}

/**
 * Construit les URLs alternées (hreflang) d'une même page : la version
 * française et la version anglaise du chemin donné, plus `x-default` qui
 * pointe sur le français (locale par défaut du site).
 *
 * Les chemins sont calculés par `getPathname()` de next-intl à partir du
 * chemin neutre — donc `/produits` en français (pas de préfixe) et
 * `/en/produits` en anglais, conformément à `localePrefix: "as-needed"`.
 * On ne concatène jamais "/en" à la main.
 */
export function buildAlternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = getPathname({ href: path, locale });
  }
  languages["x-default"] = getPathname({
    href: path,
    locale: routing.defaultLocale,
  });

  return languages;
}

/**
 * Construit les métadonnées d'une page (title, description, URL canonique,
 * alternates hreflang, Open Graph) de façon cohérente, sans dupliquer cette
 * logique dans chaque page.
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
  locale,
  images,
}: {
  /** Titre court de la page (ex. "Boutique") — le suffixe "· DRIP BY DIABS"
   * est ajouté automatiquement à la fois pour <title> (via le template du
   * layout racine) et pour Open Graph (composé ici). */
  title: string;
  description: string;
  /** Chemin NEUTRE de la page, sans préfixe de locale, ex. "/produits" —
   * la variante par locale est calculée ici, puis résolue en URL absolue
   * via `metadataBase` (voir src/app/[locale]/layout.tsx). */
  path: string;
  /** Locale de la page rendue, telle que fournie par le segment `[locale]`. */
  locale: string;
  /** Images Open Graph spécifiques à la page (ex. la photo du produit).
   * Par défaut : le visuel de marque généré pour la locale courante
   * (src/app/[locale]/opengraph-image.tsx). */
  images?: SeoImage[];
}): Metadata {
  const canonical = getPathname({ href: path, locale });

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildAlternateLanguages(path),
    },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocaleFor(locale),
      type: "website",
      images: images ?? defaultOgImage(locale),
    },
  };
}

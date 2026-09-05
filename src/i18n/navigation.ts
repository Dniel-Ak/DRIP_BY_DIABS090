import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/**
 * Versions « conscientes de la locale » des APIs de navigation Next.js.
 *
 * À utiliser PARTOUT dans le code de rendu à la place de `next/link` et
 * `next/navigation` : ces helpers ajoutent (ou omettent) automatiquement le
 * préfixe `/en` selon la locale active, donc on écrit toujours des chemins
 * « neutres » (`/produits`, `/panier`...) sans jamais concaténer de préfixe
 * à la main.
 *
 * - `Link`         : <Link href="/produits"> → `/produits` en fr, `/en/produits` en en.
 * - `usePathname`  : renvoie le chemin SANS préfixe de locale (`/produits`),
 *                    ce qui permet au sélecteur de langue de basculer la page
 *                    courante d'une locale à l'autre.
 * - `useRouter`    : `router.replace(pathname, {locale})` pour ce basculement.
 * - `getPathname`  : version serveur, utilisée pour construire les URLs
 *                    alternées (hreflang) et le sitemap.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Proxy (ex-« middleware ») next-intl.
 *
 * ⚠️ Nom du fichier : à partir de Next.js 16, la convention `middleware.ts`
 * est dépréciée et renommée `proxy.ts` (même emplacement — à côté de
 * `app/`, donc ici `src/proxy.ts` — même signature, seul le nom change ;
 * voir node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * On utilise donc `proxy.ts` plutôt que le `middleware.ts` des guides
 * next-intl écrits pour Next.js 15. La fonction renvoyée par
 * `createMiddleware` est exportée telle quelle : c'est bien un
 * `(request: NextRequest) => NextResponse`, ce qu'attend la convention.
 *
 * Rôle : réécrire les URLs sans préfixe vers le segment `[locale]`
 * (`/produits` → `/fr/produits`) et laisser passer `/en/...` tel quel.
 * Aucune redirection basée sur la langue du navigateur : voir
 * `localeDetection: false` dans src/i18n/routing.ts.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Le proxy ne doit tourner QUE sur les pages localisées. Sont exclus :
   * - `/api/...`      : routes API (checkout Paystack, formulaire contact),
   *                     jamais localisées (voir README) ;
   * - `/_next/...`    : assets internes Next.js ;
   * - `/_vercel/...`  : endpoints de la plateforme ;
   * - tout chemin contenant un point (`/favicon.ico`, `/robots.txt`,
   *   `/sitemap.xml`, `/products/xxx/photo.jpg`...) : fichiers statiques et
   *   routes de métadonnées, qui vivent hors du segment `[locale]`.
   */
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

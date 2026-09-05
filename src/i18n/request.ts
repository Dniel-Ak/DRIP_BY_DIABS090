import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "@/i18n/routing";

/**
 * Configuration next-intl résolue à chaque rendu serveur : détermine la
 * locale courante (segment `[locale]` de l'URL) et charge le dictionnaire
 * de traductions correspondant (`messages/fr.json` ou `messages/en.json`).
 *
 * Ce fichier est câblé à next-intl par le plugin déclaré dans
 * `next.config.ts` (chemin par défaut : `./src/i18n/request.ts`).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // `requestLocale` peut valoir n'importe quoi : le segment `[locale]` se
  // comporte comme un catch-all pour les URLs inconnues (`/robots.txt.bak`,
  // `/toto`...). On retombe donc systématiquement sur le français plutôt
  // que de laisser passer une locale invalide.
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Le site vend en Côte d'Ivoire : on fige le fuseau et la devise côté
    // formatage pour que les dates/nombres soient identiques quel que soit
    // le fuseau du serveur de rendu.
    timeZone: "Africa/Abidjan",
  };
});

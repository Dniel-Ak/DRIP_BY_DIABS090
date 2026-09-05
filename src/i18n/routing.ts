import { defineRouting } from "next-intl/routing";

/**
 * Configuration de routage next-intl — source unique de vérité pour les
 * locales du site, partagée par le proxy (src/proxy.ts), les helpers de
 * navigation (src/i18n/navigation.ts) et la résolution des messages
 * (src/i18n/request.ts).
 *
 * Choix structurants (décidés côté marque, ne pas changer sans validation) :
 *
 * - `defaultLocale: "fr"` + `localePrefix: "as-needed"` : le français reste
 *   à la RACINE, sans préfixe (`/`, `/produits`, `/contact`...). Toutes les
 *   URLs déjà partagées (QR codes, bio Instagram, liens WhatsApp) continuent
 *   donc de fonctionner à l'identique. L'anglais, lui, vit sous `/en`
 *   (`/en`, `/en/produits`, `/en/contact`...).
 *
 * - `localeDetection: false` : on NE redirige JAMAIS un visiteur en fonction
 *   de son en-tête `Accept-Language` ni de sa géolocalisation. Tout le monde
 *   arrive en français ; l'anglais s'obtient uniquement en cliquant le
 *   sélecteur de langue du Header (src/components/LocaleSwitcher.tsx).
 *   Ça désactive aussi la lecture du cookie de locale par le proxy.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

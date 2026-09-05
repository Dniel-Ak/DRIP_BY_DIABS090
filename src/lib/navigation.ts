export interface NavLink {
  /** Chemin « neutre », SANS préfixe de locale : le préfixe `/en` est
   * ajouté automatiquement par le <Link> de src/i18n/navigation.ts. */
  href: string;
  /** Clé de traduction dans le namespace `Nav` (messages/*.json). */
  key: string;
}

/**
 * Source unique de la navigation principale : utilisée par le Header
 * (desktop + menu mobile), par la colonne "Navigation" du Footer et par le
 * sitemap. Ajoute une entrée ici (plus sa clé dans le namespace `Nav` des
 * dictionnaires) pour qu'elle apparaisse partout.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/produits", key: "products" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
];

/** Liens utiles additionnels affichés uniquement dans le footer. */
export const FOOTER_LINKS: NavLink[] = [
  ...NAV_LINKS,
  { href: "/panier", key: "cart" },
];

export type SocialPlatform = "instagram" | "tiktok" | "snapchat";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
  handle: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    href: "https://instagram.com/Diabsssss_ig",
    label: "Instagram",
    handle: "@Diabsssss_ig",
  },
  {
    platform: "tiktok",
    href: "https://tiktok.com/@diabs_090",
    label: "TikTok",
    handle: "@diabs_090",
  },
  {
    platform: "snapchat",
    href: "https://snapchat.com/add/Diabsssssss",
    label: "Snapchat",
    handle: "Diabsssssss",
  },
];

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Source unique de la navigation principale : utilisée par le Header
 * (desktop + menu mobile) et par la colonne "Navigation" du Footer.
 * Ajoute une entrée ici pour qu'elle apparaisse partout.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

/** Liens utiles additionnels affichés uniquement dans le footer. */
export const FOOTER_LINKS: NavLink[] = [...NAV_LINKS, { href: "/panier", label: "Panier" }];

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

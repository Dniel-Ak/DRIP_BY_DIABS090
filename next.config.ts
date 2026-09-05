import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Formats modernes : AVIF est essayé en premier (fichiers ~20 % plus
    // légers que WebP à qualité égale), avec repli automatique sur WebP
    // pour les navigateurs qui ne supportent pas AVIF, puis sur le format
    // d'origine (JPEG) si aucun des deux n'est supporté. Next.js choisit
    // le format via l'en-tête `Accept` de la requête — aucune action côté
    // composant, ça s'applique à tous les <Image> du site.
    formats: ["image/avif", "image/webp"],
    // Les photos produit ne changent qu'au redéploiement (nouvelle image =
    // nouveau fichier dans public/products/<slug>/) : on peut donc les
    // garder en cache bien plus longtemps que les 4h par défaut de
    // Next.js, ce qui évite de les ré-optimiser à chaque expiration pour
    // les visiteurs récurrents. 31 jours, comme recommandé dans la doc
    // Next.js pour des images qui ne sont pas remplacées à chemin égal.
    minimumCacheTTL: 2678400,
  },
};

// Branche next-intl sur le build : le plugin crée l'alias `next-intl/config`
// vers `./src/i18n/request.ts` (emplacement par défaut), qui résout la locale
// et le dictionnaire de messages à chaque rendu serveur.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

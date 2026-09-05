import localFont from "next/font/local";

/**
 * Polices de marque, auto-hébergées via `next/font/local` — les fichiers
 * réels vivent dans `src/fonts/` (licence SIL OFL, voir
 * `src/fonts/LICENSE-OFL.txt`), remplaçant les paquets `@fontsource/*`
 * utilisés précédemment.
 *
 * Pourquoi ce changement (retour du rapport Lighthouse) : `next/font`
 * injecte lui-même les balises de préchargement optimales et une police de
 * secours ajustée aux mêmes métriques (`adjustFontFallback`, activé par
 * défaut) pour éviter tout décalage visuel au chargement — deux choses
 * qu'on gérait manuellement (ou pas) avec les imports CSS Fontsource.
 * Concrètement, ça réduit les requêtes bloquant l'affichage relevées par
 * Lighthouse.
 *
 * `next/font/local` (fichiers fournis à la main) plutôt que
 * `next/font/google` (téléchargement automatique) : ce dernier a besoin
 * d'accéder à `fonts.googleapis.com` AU MOMENT DU BUILD pour récupérer les
 * fichiers, ce qui a échoué dans l'environnement utilisé pour préparer ce
 * projet (réseau restreint) — `next/font/local` n'a besoin d'aucun accès
 * réseau pendant le build, seulement des fichiers déjà présents dans le
 * dépôt, donc ça fonctionne de façon fiable partout (CI, hébergeurs avec
 * un réseau de build restreint, etc.).
 *
 * `variable` définit le nom de la variable CSS exposée sur l'élément
 * portant la classe correspondante (voir layout.tsx, appliquée sur <html>)
 * — utilisée ensuite dans src/styles/theme.css pour alimenter les
 * utilitaires Tailwind `font-display`/`font-signature`.
 */
export const bebasNeue = localFont({
  src: "../fonts/bebas-neue-latin-400.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

export const cinzel = localFont({
  // L'ancien import Fontsource chargeait aussi la graisse 600, jamais
  // utilisée nulle part dans le code (toutes les classes `font-signature`
  // du site restent en graisse par défaut, 400) — un poids mort que
  // Lighthouse aurait signalé en police inutilisée. On ne garde donc que
  // la graisse réellement utilisée.
  src: "../fonts/cinzel-latin-400.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-cinzel",
});

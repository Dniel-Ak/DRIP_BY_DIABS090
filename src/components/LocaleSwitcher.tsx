"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Sélecteur de langue « FR / EN » du Header.
 *
 * Bascule la PAGE COURANTE d'une langue à l'autre, pas vers l'accueil :
 * `usePathname()` de next-intl renvoie le chemin sans préfixe de locale
 * (`/produits/bonnet-diabs-090` aussi bien depuis `/produits/...` que depuis
 * `/en/produits/...`), et `router.replace(pathname, {locale})` le
 * re-préfixe pour la langue cible (`/en/produits/bonnet-diabs-090`, ou
 * `/produits/bonnet-diabs-090` en français puisque la locale par défaut
 * n'a pas de préfixe). Aucune concaténation d'URL à la main ici.
 *
 * `replace` plutôt que `push` : changer de langue n'est pas une étape de
 * navigation, on ne veut pas polluer le bouton « retour » du navigateur.
 */
export default function LocaleSwitcher({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const t = useTranslations("Header");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: string) {
    onNavigate?.();
    if (locale === activeLocale) return;

    // La query string est relue depuis le navigateur au moment du clic
    // plutôt que via `useSearchParams()` : ce hook forcerait tout le layout
    // (le Header est monté dans le layout racine) à sortir du rendu
    // statique. Ça permet de conserver un filtre actif, ex.
    // `/produits?categorie=polos` → `/en/produits?categorie=polos`.
    const search = typeof window === "undefined" ? "" : window.location.search;

    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale });
    });
  }

  return (
    <div
      className="flex items-center gap-1 text-xs font-medium"
      role="group"
      aria-label={t("language")}
    >
      {/* Icône globe : rend le groupe compréhensible sans lire les libellés */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="mr-0.5 text-muted"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
      </svg>

      {routing.locales.map((locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="px-1 text-muted/60">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => switchTo(locale)}
              disabled={isPending}
              aria-current={isActive ? "true" : undefined}
              lang={locale}
              // `aria-label` explicite : "FR"/"EN" seuls ne disent pas à un
              // lecteur d'écran ce que fait le bouton.
              aria-label={t("switchTo", {
                language: locale === "en" ? t("languageEn") : t("languageFr"),
              })}
              className={`rounded px-1 py-0.5 uppercase tracking-wide transition-colors disabled:opacity-60 ${
                isActive
                  ? "text-accent"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              {locale}
            </button>
          </span>
        );
      })}
    </div>
  );
}

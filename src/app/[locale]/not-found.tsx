import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

/**
 * Page 404 des routes localisées. Rendue aussi bien pour une URL inconnue
 * sous `/en/...` que sous la racine française — le proxy (src/proxy.ts)
 * réécrit toute URL non préfixée vers le segment `[locale]`, donc les deux
 * cas passent par ici et le Header/Footer restent affichés dans la bonne
 * langue.
 *
 * `useTranslations` (et non `getTranslations`) : Next.js rend `not-found`
 * de façon synchrone, ce composant ne peut donc pas être `async`. La locale
 * provient du contexte déjà établi par le layout.
 */
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
        {t("title")}
      </h1>
      <p className="mt-4 text-muted">{t("text")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
      >
        {t("cta")}
      </Link>
    </div>
  );
}

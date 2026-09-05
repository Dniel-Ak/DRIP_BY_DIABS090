import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/a-propos">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildMetadata({
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    path: "/a-propos",
    locale,
  });
}

/** Années du parcours : donnée factuelle, identique dans les deux langues.
 * Le texte associé vient du namespace `About` (clé `timeline<année>`). */
const TIMELINE_YEARS = ["2025"] as const;

/** Clés des 3 piliers de marque dans le namespace `About`. */
const PILLAR_KEYS = ["pillarUniverse", "pillarIdentity", "pillarSignature"] as const;

export default async function AProposPage(
  props: PageProps<"/[locale]/a-propos">
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase leading-none text-foreground sm:text-display-xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
        {t("paragraph1")}
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
        {t("paragraph2")}
      </p>

      <div className="mt-14">
        <h2 className="font-display text-display-lg uppercase text-foreground">
          {t("timelineTitle")}
        </h2>
        <ol className="mt-8 flex flex-col gap-8 border-l border-border pl-6">
          {TIMELINE_YEARS.map((year) => (
            <li key={year} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-accent" />
              <span className="font-display text-display-sm text-accent">
                {year}
              </span>
              <p className="mt-1 text-sm text-muted sm:text-base">
                {t(`timeline${year}`)}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {PILLAR_KEYS.map((key) => (
          <div key={key} className="rounded-2xl border border-border p-6">
            <p className="font-display text-display-sm uppercase text-accent">
              {t(`${key}Value`)}
            </p>
            <p className="mt-1 font-signature text-eyebrow uppercase text-muted">
              {t(`${key}Label`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

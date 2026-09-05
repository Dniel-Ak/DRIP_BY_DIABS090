import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import CartView from "@/components/CartView";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/panier">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    ...buildMetadata({
      title: t("cartTitle"),
      description: t("cartDescription"),
      path: "/panier",
      locale,
    }),
    // Page personnelle (contenu propre à chaque visiteur, pas de contenu à
    // indexer) : on demande explicitement aux moteurs de recherche de ne
    // pas la référencer.
    robots: { index: false, follow: false },
  };
}

export default async function PanierPage(props: PageProps<"/[locale]/panier">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CartView />;
}

import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Pré-génère l'image au build pour chaque locale, plutôt qu'à la demande. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Image Open Graph / Twitter Card par défaut du site, générée en JSX/CSS
 * (aucune photo requise — reprend les couleurs de marque définies dans
 * src/styles/theme.css). Next.js l'attache automatiquement à toutes les
 * pages du segment qui n'ont pas leur propre image (ex. les fiches produit
 * utilisent la vraie photo du produit à la place, voir
 * src/app/[locale]/produits/[slug]/page.tsx).
 *
 * Placée DANS le segment `[locale]` (et non à la racine de `app/`) pour
 * deux raisons : elle ne concerne que les pages du site, et la garder à la
 * racine l'attachait aussi à la 404 interne de Next.js (`/_not-found`),
 * qui n'a aucun layout — donc aucun `metadataBase` — ce qui déclenchait un
 * avertissement au build. Le visuel étant purement graphique, il est
 * identique dans les deux langues.
 *
 * Générée une seule fois au build (aucune donnée dynamique ici) et mise en
 * cache — voir la doc Next.js sur `opengraph-image`.
 */
// Next.js ne génère pas d'assistant `ImageProps` (contrairement à
// `PageProps`/`LayoutProps`) pour les fichiers de convention d'image : on
// type donc les paramètres de route à la main.
export default async function Image(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Brand" });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#191817",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: 9999,
            backgroundColor: "#ecae44",
            opacity: 0.16,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -180,
            width: 480,
            height: 480,
            borderRadius: 9999,
            backgroundColor: "#ecae44",
            opacity: 0.12,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              color: "#ecae44",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {t("since")}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#f2f3f5",
              textTransform: "uppercase",
            }}
          >
            Drip By
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 170,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#ecae44",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Diabs
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#f2f3f5",
              opacity: 0.75,
            }}
          >
            {t("ogTagline")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

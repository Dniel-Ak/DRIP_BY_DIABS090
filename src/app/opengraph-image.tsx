import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image Open Graph / Twitter Card par défaut du site, générée en JSX/CSS
 * (aucune photo requise — reprend les couleurs de marque définies dans
 * src/styles/theme.css). S'applique à toutes les pages qui n'ont pas
 * leur propre image (ex. les fiches produit utilisent la vraie photo du
 * produit à la place, voir src/app/produits/[slug]/page.tsx).
 *
 * Générée une seule fois au build (aucune donnée dynamique ici) et mise en
 * cache — voir la doc Next.js sur `opengraph-image`.
 */
export default function Image() {
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
            Depuis 2025 · Abidjan
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
            Streetwear premium · identité africaine contemporaine
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

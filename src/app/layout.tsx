import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/cart-context";
import { bebasNeue, cinzel } from "@/lib/fonts";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  // Base pour résoudre en URLs absolues tous les chemins relatifs utilisés
  // dans les métadonnées (images Open Graph, canonical...) — voir
  // src/lib/site.ts pour la configuration de l'URL réelle du site.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DRIP BY DIABS — Streetwear",
    template: "%s · DRIP BY DIABS",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "streetwear",
    "vêtements",
    "polo",
    "mode urbaine",
    "Abidjan",
    "Côte d'Ivoire",
    "DRIP BY DIABS",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "DRIP BY DIABS — Streetwear",
    description:
      "Découvrez les collections DIABS : polos, bonnets et pièces streetwear premium conçues en petites séries à Abidjan.",
    url: "/",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  // Type de Twitter Card commun à toutes les pages. Le titre, la
  // description et l'image ne sont volontairement pas répétés ici :
  // Next.js les complète automatiquement à partir de l'Open Graph de
  // chaque page (voir src/lib/seo.ts pour le détail).
  twitter: { card: "summary_large_image" },
};

// Données structurées schema.org décrivant la marque elle-même (pas un
// produit) : aide les moteurs de recherche à associer le site, le nom et
// les réseaux sociaux à une même entité ("Organization").
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  sameAs: SOCIAL_LINKS.map((social) => social.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`h-full antialiased ${bebasNeue.variable} ${cinzel.variable}`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* JSON-LD : recommandation officielle Next.js pour les données
            structurées (voir node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
            Le `<` est échappé ci-dessous pour éviter toute injection. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        {/* Lien d'évitement (skip link) : invisible tant qu'il n'a pas le
            focus clavier, il permet à une personne naviguant au clavier ou
            au lecteur d'écran de sauter directement au contenu principal
            sans devoir retraverser toute la navigation du Header à chaque
            page. Doit rester le tout premier élément focusable du document. */}
        <a
          href="#contenu-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
          Aller au contenu principal
        </a>
        <CartProvider>
          <Header />
          <main id="contenu-principal" className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

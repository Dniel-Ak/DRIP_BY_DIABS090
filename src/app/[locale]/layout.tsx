import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/cart-context";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { bebasNeue, cinzel } from "@/lib/fonts";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { buildAlternateLanguages } from "@/lib/seo";
import { SITE_NAME, SITE_URL, ogLocaleFor } from "@/lib/site";

import "../globals.css";

/**
 * Pré-rend les deux versions du site au build (`/...` pour le français,
 * `/en/...` pour l'anglais) plutôt qu'à la demande.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    // Base pour résoudre en URLs absolues tous les chemins relatifs utilisés
    // dans les métadonnées (images Open Graph, canonical...) — voir
    // src/lib/site.ts pour la configuration de l'URL réelle du site.
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("siteTitleDefault"),
      template: t("siteTitleTemplate"),
    },
    description: t("siteDescription"),
    keywords: t("keywords")
      .split(",")
      .map((keyword) => keyword.trim()),
    alternates: {
      canonical: getPathname({ href: "/", locale }),
      languages: buildAlternateLanguages("/"),
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: t("siteTitleDefault"),
      description: t("homeOgDescription"),
      url: getPathname({ href: "/", locale }),
      siteName: SITE_NAME,
      locale: ogLocaleFor(locale),
      type: "website",
      // URL calculée par next-intl plutôt que laissée à Next.js : voir
      // `defaultOgImage()` dans src/lib/seo.ts pour le pourquoi.
      images: [
        {
          url: getPathname({ href: "/opengraph-image", locale }),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    // Type de Twitter Card commun à toutes les pages. Le titre, la
    // description et l'image ne sont volontairement pas répétés ici :
    // Next.js les complète automatiquement à partir de l'Open Graph de
    // chaque page (voir src/lib/seo.ts pour le détail).
    twitter: { card: "summary_large_image" },
  };
}

// Données structurées schema.org décrivant la marque elle-même (pas un
// produit) : aide les moteurs de recherche à associer le site, le nom et
// les réseaux sociaux à une même entité ("Organization").
function buildOrganizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}${getPathname({ href: "/", locale })}`,
    logo: `${SITE_URL}${getPathname({ href: "/opengraph-image", locale })}`,
    sameAs: SOCIAL_LINKS.map((social) => social.href),
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  // Le segment `[locale]` se comporte comme un catch-all : une URL inconnue
  // non réécrite par le proxy (src/proxy.ts) arrive ici avec n'importe quoi
  // comme "locale". On répond 404 plutôt que de rendre le site dans une
  // langue inexistante.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Active le rendu statique : sans ça, la moindre lecture de traduction
  // dans un composant serveur passerait par les en-têtes de la requête et
  // basculerait toutes les pages en rendu dynamique.
  setRequestLocale(locale);

  // Messages passés une seule fois au provider client : ils alimentent
  // `useTranslations()` dans tous les composants client (Header, panier,
  // filtres boutique, formulaires...).
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: "Header" });

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${bebasNeue.variable} ${cinzel.variable}`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* JSON-LD : recommandation officielle Next.js pour les données
            structurées (voir node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
            Le `<` est échappé ci-dessous pour éviter toute injection. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd(locale)).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
        {/* Lien d'évitement (skip link) : invisible tant qu'il n'a pas le
            focus clavier, il permet à une personne naviguant au clavier ou
            au lecteur d'écran de sauter directement au contenu principal
            sans devoir retraverser toute la navigation du Header à chaque
            page. Doit rester le tout premier élément focusable du document.
            L'ancre `#contenu-principal` est un identifiant technique : elle
            reste identique dans les deux langues, seul le libellé change. */}
        <a
          href="#contenu-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <Header />
            <main id="contenu-principal" className="flex-1">
              {props.children}
            </main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

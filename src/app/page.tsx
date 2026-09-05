import Link from "next/link";

import HeroVisual from "@/components/HeroVisual";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

const STORY_POINTS = [
  {
    title: "Petites séries",
    text: "Chaque drop est produit en quantité limitée pour garder de la valeur à chaque pièce.",
  },
  {
    title: "Matières épaisses",
    text: "Molleton 420g/m² minimum, coton peigné, doublures satin : rien de fin, rien de fragile.",
  },
  {
    title: "Fabriqué avec soin",
    text: "Impressions et broderies réalisées en petits ateliers partenaires à Abidjan.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  // Nombre de colonnes de la grille "Pièces phares" adapté au nombre réel
  // de produits mis en avant : avec la classe fixe `lg:grid-cols-4`
  // d'origine, 2 ou 3 produits vedettes se retrouvaient plaqués à gauche
  // avec un grand vide à droite sur les écrans desktop (repéré lors de
  // l'audit responsive). En limitant les colonnes au nombre de produits
  // (jusqu'à 4), la grille reste toujours équilibrée, sans espace mort —
  // y compris quand la sélection "coup de cœur" ne compte que 1 à 3 pièces.
  const featuredGridCols =
    featured.length >= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : featured.length === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : featured.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  return (
    <>
      {/* ---------- Hero : grand visuel + accroche ---------- */}
      <section className="relative flex min-h-[85svh] items-end overflow-hidden sm:min-h-[90svh]">
        <HeroVisual className="absolute inset-0" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20">
          <p className="font-signature text-eyebrow uppercase text-accent">
            Nouvelle collection
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-display-lg uppercase leading-[0.95] tracking-wide text-foreground sm:text-display-xl">
            Le streetwear qui coule dans les rues,{" "}
            <span className="text-accent">pas en rayon.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm text-muted sm:text-base lg:max-w-lg lg:text-lg">
            Depuis Abidjan, DIABS conçoit un streetwear premium à
            l&apos;identité africaine contemporaine : silhouettes oversize,
            coupes boxy, finitions soignées.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/produits"
              className="rounded-full bg-accent px-6 py-3 text-center font-display uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Voir la boutique
            </Link>
            <Link
              href="#histoire"
              // border-foreground/50 plutôt que /30 : à 30%, le contour de ce
              // bouton (seul repère de sa forme cliquable) tombait à 2.57:1
              // sur le fond, sous le seuil WCAG de 3:1 pour un composant
              // d'interface.
              className="rounded-full border border-foreground/50 px-6 py-3 text-center font-display uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Notre histoire
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Produits phares ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent">
              Sélection
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase text-foreground">
              Pièces phares
            </h2>
          </div>
          <Link
            href="/produits"
            className="hidden shrink-0 text-sm font-medium text-accent hover:underline sm:inline"
          >
            Tout voir →
          </Link>
        </div>
        <div className={`grid gap-4 sm:gap-6 ${featuredGridCols}`}>
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <Link
          href="/produits"
          className="mt-8 block text-center text-sm font-medium text-accent hover:underline sm:hidden"
        >
          Tout voir →
        </Link>
      </section>

      {/* ---------- Notre histoire (courte) ---------- */}
      <section id="histoire" className="scroll-mt-20 border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent">
              Notre histoire
            </p>
            <h2 className="mt-3 font-display text-display-lg uppercase leading-none text-foreground">
              Né à Abidjan, pensé pour durer.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              Depuis 2025, DIABS habille la jeunesse ivoirienne avec des
              pièces conçues en petites séries plutôt qu&apos;en production
              de masse. Pas de tendance à suivre : juste des coupes
              franches, des matières qui tiennent, et des drops pensés avec
              des ateliers indépendants.
            </p>
            <Link
              href="/a-propos"
              className="mt-6 inline-flex items-center gap-2 font-display uppercase tracking-wide text-accent hover:underline"
            >
              Découvrir notre histoire →
            </Link>
          </div>

          <ul className="flex flex-col gap-6 sm:gap-8">
            {STORY_POINTS.map((point) => (
              <li key={point.title} className="border-l-2 border-accent pl-4">
                <h3 className="font-medium text-foreground">{point.title}</h3>
                <p className="mt-1 text-sm text-muted">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CTA boutique ---------- */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16">
          <h2 className="max-w-md font-display text-display-lg uppercase leading-none text-foreground">
            Prêt·e pour le prochain drop&nbsp;?
          </h2>
          <Link
            href="/produits"
            className="w-full flex-shrink-0 rounded-full bg-accent px-8 py-4 text-center font-display uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
          >
            Voir toute la collection
          </Link>
        </div>
      </section>

      {/* ---------- Newsletter ---------- */}
      <section className="bg-accent">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent-foreground/70">
              Newsletter
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase leading-none text-accent-foreground">
              Ne rate aucun drop.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-accent-foreground/80">
              Accès prioritaire aux nouvelles collections et aux séries
              limitées, directement dans ta boîte mail.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

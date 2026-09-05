import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroVisual from "@/components/HeroVisual";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/products";

/** Clés du namespace `Home` pour les 3 points de la section "Notre histoire". */
const STORY_POINT_KEYS = ["storyPoint1", "storyPoint2", "storyPoint3"] as const;

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Home" });
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
      <section className="relative flex min-h-[85svh] items-end sm:min-h-[90svh]">
        {/* `overflow-hidden` n'est PAS mis ici : si le contenu (accroche +
            texte + boutons) a besoin de plus de hauteur que le
            min-h-[85svh]/90svh sur un écran large mais peu haut (fenêtre non
            maximisée, zoom navigateur élevé...), la section doit s'agrandir
            en conséquence plutôt que de couper le haut du texte, invisible
            et silencieux. Le halo doré/DIABS ci-dessous gère déjà son propre
            `overflow-hidden` interne pour rester bien cadré. */}
        <HeroVisual className="absolute inset-0" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20">
          <p className="font-signature text-eyebrow uppercase text-accent">
            {t("heroEyebrow")}
          </p>
          {/* Accroche en deux temps : la fin de phrase passe en doré sur sa
              propre ligne visuelle. L'espace insécable typographique entre
              les deux morceaux est rendu par le `{" "}` explicite, sinon JSX
              le supprimerait au retour à la ligne du code. */}
          <h1 className="mt-4 max-w-3xl font-display text-display-lg uppercase leading-[0.95] tracking-wide text-foreground sm:text-display-xl">
            {t("heroTitleLead")}{" "}
            <span className="text-accent">{t("heroTitleAccent")}</span>
          </h1>
          <p className="mt-5 max-w-md text-sm text-muted sm:text-base lg:max-w-lg lg:text-lg">
            {t("heroText")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/produits"
              className="rounded-full bg-accent px-6 py-3 text-center font-display uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {t("heroCtaShop")}
            </Link>
            <Link
              href="#histoire"
              // border-foreground/50 plutôt que /30 : à 30%, le contour de ce
              // bouton (seul repère de sa forme cliquable) tombait à 2.57:1
              // sur le fond, sous le seuil WCAG de 3:1 pour un composant
              // d'interface.
              className="rounded-full border border-foreground/50 px-6 py-3 text-center font-display uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {t("heroCtaStory")}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Produits phares ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent">
              {t("featuredEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase text-foreground">
              {t("featuredTitle")}
            </h2>
          </div>
          <Link
            href="/produits"
            className="hidden shrink-0 text-sm font-medium text-accent hover:underline sm:inline"
          >
            {t("seeAll")}
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
          {t("seeAll")}
        </Link>
      </section>

      {/* ---------- Notre histoire (courte) ---------- */}
      <section id="histoire" className="scroll-mt-20 border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent">
              {t("storyEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-display-lg uppercase leading-none text-foreground">
              {t("storyTitle")}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              {t("storyText")}
            </p>
            <Link
              href="/a-propos"
              className="mt-6 inline-flex items-center gap-2 font-display uppercase tracking-wide text-accent hover:underline"
            >
              {t("storyCta")}
            </Link>
          </div>

          <ul className="flex flex-col gap-6 sm:gap-8">
            {STORY_POINT_KEYS.map((key) => (
              <li key={key} className="border-l-2 border-accent pl-4">
                <h3 className="font-medium text-foreground">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-1 text-sm text-muted">{t(`${key}Text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CTA boutique ---------- */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16">
          <h2 className="max-w-md font-display text-display-lg uppercase leading-none text-foreground">
            {t("ctaTitle")}
          </h2>
          <Link
            href="/produits"
            className="w-full flex-shrink-0 rounded-full bg-accent px-8 py-4 text-center font-display uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>

      {/* ---------- Newsletter ---------- */}
      <section className="bg-accent">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16">
          <div>
            <p className="font-signature text-eyebrow uppercase text-accent-foreground/70">
              {t("newsletterEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase leading-none text-accent-foreground">
              {t("newsletterTitle")}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-accent-foreground/80">
              {t("newsletterText")}
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

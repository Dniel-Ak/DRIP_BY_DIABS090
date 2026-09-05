import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/products";
import {
  verifyPaystackTransaction,
  type VerifyTransactionResult,
} from "@/lib/paystack";
import { commitReservation, releaseReservation } from "@/lib/stock";

export async function generateMetadata(
  props: PageProps<"/[locale]/paiement/confirmation">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("paymentTitle"),
    // Page transactionnelle propre à chaque commande (référence de
    // paiement dans l'URL) : aucune valeur de référencement, à ne pas
    // indexer.
    robots: { index: false, follow: false },
  };
}

function Panel({
  eyebrow,
  title,
  children,
  cta,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  cta: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
        {title}
      </h1>
      <div className="mt-4 text-muted">{children}</div>
      <div className="mt-8">{cta}</div>
    </div>
  );
}

function BoutiqueLink({ label }: { label: string }) {
  return (
    <Link
      href="/produits"
      className="rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
    >
      {label}
    </Link>
  );
}

function PanierLink({ label }: { label: string }) {
  return (
    <Link
      href="/panier"
      className="rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
    >
      {label}
    </Link>
  );
}

export default async function PaiementConfirmationPage(
  props: PageProps<"/[locale]/paiement/confirmation">
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Payment" });
  const boutiqueLink = <BoutiqueLink label={t("ctaShop")} />;
  const panierLink = <PanierLink label={t("ctaCart")} />;

  const searchParams = await props.searchParams;
  const referenceParam = Array.isArray(searchParams.reference)
    ? searchParams.reference[0]
    : searchParams.reference;

  if (!referenceParam) {
    return (
      <Panel
        eyebrow={t("eyebrow")}
        title={t("noPaymentTitle")}
        cta={boutiqueLink}
      >
        <p>{t("noPaymentText")}</p>
      </Panel>
    );
  }

  // La vérification Paystack ne doit faire que récupérer des données ici :
  // construire du JSX à l'intérieur d'un try/catch n'est pas fiable (le
  // rendu React est différé, l'erreur ne serait pas rattrapée par ce
  // catch) — on isole donc l'appel réseau, puis on construit le JSX après,
  // en dehors du bloc try/catch.
  let result: VerifyTransactionResult | null = null;
  try {
    result = await verifyPaystackTransaction(referenceParam);
  } catch (error) {
    console.error(
      "[paiement/confirmation] Échec de la vérification Paystack :",
      error
    );
  }

  if (!result) {
    // Vérification impossible : on NE touche pas au stock réservé (on ne
    // sait pas si le paiement a réellement abouti côté Paystack) — il sera
    // relâché automatiquement au bout de 30 minutes si le paiement n'a
    // effectivement pas eu lieu (voir src/lib/stock.ts).
    return (
      <Panel
        eyebrow={t("eyebrow")}
        title={t("verifyFailedTitle")}
        cta={panierLink}
      >
        <p>
          {t("verifyFailedText")}{" "}
          <span className="text-foreground">{referenceParam}</span>.
        </p>
      </Panel>
    );
  }

  // Met à jour le stock réservé au démarrage du paiement : on confirme (le
  // stock reste décrémenté) si le paiement a réussi, sinon on le relâche
  // (remis à son niveau initial). Idempotent — un rechargement de cette
  // page ne décrémente/réajuste jamais deux fois.
  try {
    if (result.status === "success") {
      await commitReservation(result.reference);
    } else {
      await releaseReservation(result.reference);
    }
  } catch (error) {
    console.error(
      "[paiement/confirmation] Échec de la mise à jour du stock :",
      error
    );
  }

  if (result.status === "success") {
    return (
      <>
        <ClearCartOnSuccess />
        <Panel
          eyebrow={t("successEyebrow")}
          title={t("successTitle")}
          cta={boutiqueLink}
        >
          <p>
            {t("successText", {
              amount: formatPrice(result.amount / 100, locale),
            })}
          </p>
          <p className="mt-2 text-sm">
            {t("reference")}{" "}
            <span className="text-foreground">{result.reference}</span>
          </p>
          <p className="mt-4 text-sm">{t("successFollowUp")}</p>
        </Panel>
      </>
    );
  }

  return (
    <Panel
      eyebrow={t("eyebrow")}
      title={
        result.status === "abandoned" ? t("abandonedTitle") : t("failedTitle")
      }
      cta={panierLink}
    >
      <p>
        {result.status === "abandoned" ? t("abandonedText") : t("failedText")}
      </p>
      <p className="mt-2 text-sm">{t("retryText")}</p>
    </Panel>
  );
}

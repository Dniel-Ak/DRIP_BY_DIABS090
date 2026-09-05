import Link from "next/link";
import type { Metadata } from "next";

import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";
import { formatPrice } from "@/lib/products";
import {
  verifyPaystackTransaction,
  type VerifyTransactionResult,
} from "@/lib/paystack";
import { commitReservation, releaseReservation } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  // Page transactionnelle propre à chaque commande (référence de
  // paiement dans l'URL) : aucune valeur de référencement, à ne pas
  // indexer.
  robots: { index: false, follow: false },
};

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

const BOUTIQUE_LINK = (
  <Link
    href="/produits"
    className="rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
  >
    Voir la boutique
  </Link>
);

const PANIER_LINK = (
  <Link
    href="/panier"
    className="rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
  >
    Retourner au panier
  </Link>
);

export default async function PaiementConfirmationPage(
  props: PageProps<"/paiement/confirmation">
) {
  const searchParams = await props.searchParams;
  const referenceParam = Array.isArray(searchParams.reference)
    ? searchParams.reference[0]
    : searchParams.reference;

  if (!referenceParam) {
    return (
      <Panel
        eyebrow="Commande"
        title="Aucun paiement à confirmer"
        cta={BOUTIQUE_LINK}
      >
        <p>Cette page confirme un paiement Paystack après redirection.</p>
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
        eyebrow="Commande"
        title="Impossible de vérifier ce paiement"
        cta={PANIER_LINK}
      >
        <p>
          Une erreur est survenue pendant la vérification. Si le montant a
          été prélevé, contacte-nous avec la référence{" "}
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
          eyebrow="Commande confirmée"
          title="Paiement réussi ✓"
          cta={BOUTIQUE_LINK}
        >
          <p>
            Merci, ta commande de {formatPrice(result.amount / 100)} est
            confirmée.
          </p>
          <p className="mt-2 text-sm">
            Référence : <span className="text-foreground">{result.reference}</span>
          </p>
          <p className="mt-4 text-sm">
            Nous te recontactons rapidement pour organiser la livraison.
          </p>
        </Panel>
      </>
    );
  }

  return (
    <Panel
      eyebrow="Commande"
      title={
        result.status === "abandoned" ? "Paiement abandonné" : "Paiement échoué"
      }
      cta={PANIER_LINK}
    >
      <p>
        {result.status === "abandoned"
          ? "Le paiement a été interrompu avant la fin."
          : "Le paiement n'a pas pu être finalisé."}
      </p>
      <p className="mt-2 text-sm">
        Ton panier est toujours disponible — tu peux réessayer, ou passer
        commande via WhatsApp/e-mail depuis le panier.
      </p>
    </Panel>
  );
}

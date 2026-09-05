/**
 * Petit client pour l'API Paystack (https://paystack.com/docs/api/transaction/),
 * utilisé pour le paiement en ligne du panier. Paystack est utilisé à la
 * place de Stripe car Stripe ne permet pas d'activer un compte marchand
 * pour une entreprise basée en Côte d'Ivoire — Paystack (même groupe que
 * Stripe) le permet, avec un principe de "Checkout" hébergé identique.
 *
 * Toutes les fonctions ici tournent uniquement côté serveur (route API) :
 * la clé secrète Paystack ne doit jamais atteindre le navigateur.
 */

const PAYSTACK_API_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY manquante dans les variables d'environnement."
    );
  }
  return key;
}

interface InitializeTransactionParams {
  email: string;
  /** Montant réel en francs CFA (ex. 15000 pour 15 000 F CFA). */
  amountXOF: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializePaystackTransaction(
  params: InitializeTransactionParams
): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
    method: "POST",
    // Chaque appel doit produire une nouvelle transaction Paystack avec sa
    // propre URL de paiement : mis explicitement en "no-store" pour ne
    // jamais dépendre du comportement de cache par défaut de `fetch` dans
    // Next.js (qui peut changer d'une version à l'autre — voir AGENTS.md).
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      // Le XOF n'a pas de sous-unité, mais l'API Paystack impose quand
      // même de multiplier le montant par 100 (voir doc "Supported
      // Currencies") : 15 000 F CFA doit être envoyé comme 1 500 000.
      amount: String(Math.round(params.amountXOF * 100)),
      currency: "XOF",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const json = await response.json();

  if (!response.ok || !json.status) {
    throw new Error(
      json.message || "Impossible d'initialiser le paiement Paystack."
    );
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export type PaystackTransactionStatus =
  | "success"
  | "failed"
  | "abandoned"
  | string;

export interface VerifyTransactionResult {
  status: PaystackTransactionStatus;
  /** Montant confirmé par Paystack, en sous-unité (÷100 pour F CFA). */
  amount: number;
  currency: string;
  reference: string;
  customerEmail: string | null;
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<VerifyTransactionResult> {
  const response = await fetch(
    `${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      // Le statut d'un paiement ne doit jamais être servi depuis un cache
      // (même comportement/raison que ci-dessus, pour initializePaystackTransaction).
      cache: "no-store",
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    }
  );

  const json = await response.json();

  if (!response.ok || !json.status) {
    throw new Error(
      json.message || "Impossible de vérifier ce paiement Paystack."
    );
  }

  return {
    status: json.data.status,
    amount: json.data.amount,
    currency: json.data.currency,
    reference: json.data.reference,
    customerEmail: json.data.customer?.email ?? null,
  };
}

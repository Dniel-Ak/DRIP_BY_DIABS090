import { getProductBySlug } from "@/lib/products";
import { initializePaystackTransaction } from "@/lib/paystack";
import { releaseReservation, reserveStock } from "@/lib/stock";

interface CheckoutLine {
  slug: string;
  size: string;
  color: string;
  quantity: number;
}

interface CheckoutRequestBody {
  email?: string;
  lines?: CheckoutLine[];
}

/**
 * Démarre un paiement Paystack pour le panier courant : reçoit uniquement
 * (slug, taille, couleur, quantité) depuis le client et recalcule le total
 * ici à partir du catalogue — on ne fait jamais confiance à un prix envoyé
 * par le navigateur. Renvoie l'URL de la page Paystack hébergée vers
 * laquelle rediriger le client.
 */
export async function POST(request: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    // Clé absente : erreur de configuration, pas une erreur du client.
    // On log le détail pour le développeur et on renvoie un message neutre.
    console.error(
      "[api/checkout] PAYSTACK_SECRET_KEY manquante — ajoute-la dans .env.local (voir README)."
    );
    return Response.json(
      {
        error:
          "Le paiement en ligne est temporairement indisponible. Utilise WhatsApp ou e-mail pour passer commande.",
      },
      { status: 503 }
    );
  }

  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 }
    );
  }

  const requestedLines = Array.isArray(body.lines) ? body.lines : [];

  let total = 0;
  const orderItems: {
    slug: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[] = [];

  for (const line of requestedLines) {
    const product = getProductBySlug(line?.slug ?? "");
    const quantity =
      Number.isFinite(line?.quantity) && line.quantity > 0
        ? Math.floor(line.quantity)
        : 0;

    if (!product || quantity === 0) continue;

    if (product.price === null) {
      return Response.json(
        {
          error: `"${product.name}" n'a pas encore de prix fixé et ne peut pas être payé en ligne. Retire-le du panier ou commande-le via WhatsApp/e-mail.`,
        },
        { status: 400 }
      );
    }

    total += product.price * quantity;
    orderItems.push({
      slug: product.slug,
      name: product.name,
      size: line.size,
      color: line.color,
      quantity,
      unitPrice: product.price,
    });
  }

  if (total <= 0 || orderItems.length === 0) {
    return Response.json({ error: "Le panier est vide." }, { status: 400 });
  }

  const reference = `diabs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const origin = new URL(request.url).origin;

  // On réserve (décrémente) le stock dès le démarrage du paiement, avant
  // même d'appeler Paystack : ça évite qu'un autre client achète le dernier
  // article pendant que celui-ci est en train de payer. Si le paiement
  // échoue/est abandonné, le stock est remis à son niveau initial depuis
  // /paiement/confirmation (voir src/lib/stock.ts).
  const reservation = await reserveStock(
    reference,
    orderItems.map((item) => ({
      slug: item.slug,
      size: item.size,
      quantity: item.quantity,
    }))
  );

  if (!reservation.ok) {
    const shortage = reservation.shortages[0];
    const product = getProductBySlug(shortage.slug);
    return Response.json(
      {
        error:
          product && shortage.available > 0
            ? `Il ne reste que ${shortage.available} article(s) en taille ${shortage.size} pour "${product.name}". Réduis la quantité dans le panier pour continuer.`
            : `"${product?.name ?? shortage.slug}" n'est plus disponible en taille ${shortage.size}. Retire-le du panier, ou commande-le via WhatsApp/e-mail pour vérifier une réassorte.`,
      },
      { status: 409 }
    );
  }

  try {
    const { authorizationUrl } = await initializePaystackTransaction({
      email,
      amountXOF: total,
      reference,
      callbackUrl: `${origin}/paiement/confirmation?reference=${reference}`,
      metadata: { items: orderItems },
    });

    return Response.json({ url: authorizationUrl });
  } catch (error) {
    console.error("[api/checkout] Échec de l'initialisation Paystack :", error);
    // Le stock avait été réservé pour cette tentative : comme Paystack n'a
    // jamais créé de transaction valide, on relâche immédiatement plutôt
    // que d'attendre l'expiration automatique de 30 minutes.
    await releaseReservation(reference);
    return Response.json(
      {
        error:
          "Le paiement en ligne n'a pas pu démarrer. Réessaie, ou utilise WhatsApp/e-mail pour passer commande.",
      },
      { status: 502 }
    );
  }
}

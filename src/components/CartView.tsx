"use client";

import Link from "next/link";
import { useState } from "react";

import ProductImage from "@/components/ProductImage";
import { useCart, type CartLine } from "@/context/cart-context";
import { formatPrice, getProductBySlug } from "@/lib/products";
import type { Product } from "@/types/product";

/** Numéro WhatsApp pour les commandes (Karam), format international sans
 * "+" ni espaces, prêt pour un lien wa.me. */
const ORDER_WHATSAPP_NUMBER = "225797821052";
const ORDER_EMAIL = "contact.diabs090@gmail.com";

type CartLineWithProduct = CartLine & { product: Product };

function buildOrderMessage(
  lines: CartLineWithProduct[],
  subtotal: number
): string {
  const itemLines = lines.map((line) => {
    const colorPart = line.color ? ` · ${line.color}` : "";
    return `• ${line.product.name} — Taille ${line.size}${colorPart} — Qté ${line.quantity} — ${formatPrice(
      (line.product.price ?? 0) * line.quantity
    )}`;
  });

  return [
    "Bonjour DIABS, je souhaite passer la commande suivante :",
    "",
    ...itemLines,
    "",
    `Sous-total : ${formatPrice(subtotal)}`,
    "",
    "Merci de me confirmer la disponibilité ainsi que les modalités de livraison et de paiement.",
  ].join("\n");
}

export default function CartView() {
  const { items, updateQuantity, removeItem, clearCart, itemCount } =
    useCart();

  const [email, setEmail] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const lines = items
    .map((item) => {
      const product = getProductBySlug(item.slug);
      return product ? { ...item, product } : null;
    })
    .filter((line): line is CartLineWithProduct => line !== null);

  const subtotal = lines.reduce(
    (sum, line) => sum + (line.product.price ?? 0) * line.quantity,
    0
  );

  const orderMessage = buildOrderMessage(lines, subtotal);
  const whatsappHref = `https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;
  const mailHref = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("Nouvelle commande — DIABS")}&body=${encodeURIComponent(orderMessage)}`;

  const hasUnpricedItems = lines.some((line) => line.product.price === null);
  const isEmailValid = /^\S+@\S+\.\S+$/.test(email);

  async function handlePaystackCheckout() {
    setCheckoutError(null);
    setIsRedirecting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lines: lines.map((line) => ({
            slug: line.slug,
            size: line.size,
            color: line.color,
            quantity: line.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Le paiement en ligne n'est pas disponible pour le moment."
        );
      }
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      setIsRedirecting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="font-signature text-eyebrow uppercase text-accent">
          Panier
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          Ton panier est vide.
        </h1>
        <p className="mt-4 text-muted">
          Ajoute une pièce depuis la boutique pour commencer ta sélection.
        </p>
        <Link
          href="/produits"
          className="mt-8 rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        Panier
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
        {itemCount} article{itemCount > 1 ? "s" : ""}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li
              key={`${line.slug}-${line.size}-${line.color}`}
              className="flex gap-4 py-6"
            >
              <Link
                href={`/produits/${line.slug}`}
                className="flex-shrink-0"
              >
                <ProductImage
                  images={line.product.images}
                  slug={line.slug}
                  name={line.product.name}
                  sizes="96px"
                  className="h-24 w-24"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/produits/${line.slug}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      Taille {line.size}
                      {line.color ? ` · ${line.color}` : ""}
                    </p>
                  </div>
                  <p className="font-display text-display-sm text-accent">
                    {formatPrice((line.product.price ?? 0) * line.quantity)}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          line.slug,
                          line.size,
                          line.color,
                          line.quantity - 1
                        )
                      }
                      className="px-3 py-1 text-foreground transition-colors hover:text-accent"
                      aria-label={`Diminuer la quantité de ${line.product.name}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-foreground">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          line.slug,
                          line.size,
                          line.color,
                          line.quantity + 1
                        )
                      }
                      className="px-3 py-1 text-foreground transition-colors hover:text-accent"
                      aria-label={`Augmenter la quantité de ${line.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.slug, line.size, line.color)}
                    className="text-xs text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-display-sm uppercase text-foreground">
            Résumé
          </h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">Sous-total</span>
            <span className="font-display text-display-sm text-foreground">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            Livraison et modalités de paiement confirmées directement avec
            toi après ta commande.
          </p>

          <p className="mt-6 text-sm font-medium text-foreground">
            Paiement en ligne
          </p>
          <label htmlFor="checkout-email" className="mt-3 block">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              E-mail
            </span>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setCheckoutError(null);
              }}
              placeholder="ton@email.com"
              className="mt-2 w-full rounded-full border border-border bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          {hasUnpricedItems && (
            <p className="mt-2 text-xs text-accent">
              Le paiement en ligne n&apos;est pas disponible tant que ton
              panier contient un article dont le prix n&apos;est pas encore
              fixé — commande-le plutôt via WhatsApp ou e-mail ci-dessous.
            </p>
          )}
          {checkoutError && (
            <p role="alert" className="mt-2 text-xs text-accent">
              {checkoutError}
            </p>
          )}

          <button
            type="button"
            disabled={!isEmailValid || hasUnpricedItems || isRedirecting}
            onClick={handlePaystackCheckout}
            className="mt-3 w-full rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {isRedirecting ? "Redirection…" : "Payer en ligne — Paystack"}
          </button>
          <p className="mt-2 text-xs text-muted">
            Paiement sécurisé via Paystack (mobile money, carte bancaire).
          </p>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            ou sans payer en ligne
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-accent px-6 py-3 text-center font-display uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Commander via WhatsApp
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
            <a
              href={mailHref}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-center font-display uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Commander par e-mail
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">
            Un message récapitulatif pré-rempli s&apos;ouvre avec ta
            commande — il ne reste plus qu&apos;à l&apos;envoyer. Paiement
            organisé directement avec toi ensuite.
          </p>

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
          >
            Vider le panier
          </button>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import ProductImage from "@/components/ProductImage";
import { useCart, type CartLine } from "@/context/cart-context";
import { Link } from "@/i18n/navigation";
import { formatPrice, getProductBySlug } from "@/lib/products";
import type { Product } from "@/types/product";

/** Numéro WhatsApp pour les commandes (Karam), format international sans
 * "+" ni espaces, prêt pour un lien wa.me. */
const ORDER_WHATSAPP_NUMBER = "2250797821052";
const ORDER_EMAIL = "contact.diabs090@gmail.com";

/** Objet de l'e-mail de commande — en français, voir `buildOrderMessage`. */
const ORDER_EMAIL_SUBJECT = "Nouvelle commande — DIABS";

type CartLineWithProduct = CartLine & { product: Product };

/**
 * Récapitulatif de commande envoyé via WhatsApp ou e-mail.
 *
 * ⚠️ CE MESSAGE EST TOUJOURS EN FRANÇAIS, quelle que soit la langue
 * affichée sur le site — c'est volontaire et il ne faut pas le traduire.
 * Il n'est pas lu par le client : il est lu par l'équipe DIABS à Abidjan,
 * francophone, qui traite la commande. Un client anglophone envoie donc un
 * récapitulatif en français (nom du produit, taille, coloris, quantité,
 * sous-total — des données qu'il reconnaît de toute façon depuis son
 * panier), et l'équipe le reçoit dans SA langue de travail, sans avoir à
 * le traduire ni risquer un contresens sur une commande.
 *
 * Seuls les libellés des BOUTONS qui ouvrent WhatsApp/l'e-mail sont
 * traduits (voir le namespace `Cart` des dictionnaires) — pas le contenu
 * du message lui-même.
 *
 * Concrètement : `formatPrice` est appelé ici sans locale, ce qui applique
 * le format français par défaut (« 15 000 F CFA »), et aucun `t()` n'est
 * utilisé dans cette fonction.
 */
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

  const locale = useLocale();
  const t = useTranslations("Cart");
  const tColors = useTranslations("Colors");
  const tSizes = useTranslations("Sizes");

  // Libellés affichés seulement : les valeurs stockées dans le panier
  // (taille, coloris) restent les valeurs françaises du catalogue, qui
  // servent de clés de stock et alimentent le message de commande.
  const sizeLabel = (size: string) => (tSizes.has(size) ? tSizes(size) : size);
  const colorLabel = (color: string) =>
    tColors.has(color) ? tColors(color) : color;

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
  const mailHref = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(ORDER_EMAIL_SUBJECT)}&body=${encodeURIComponent(orderMessage)}`;

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
          // Langue courante : sert uniquement à ce que Paystack nous
          // redirige vers la page de confirmation de la BONNE version du
          // site (`/paiement/confirmation` ou `/en/paiement/confirmation`).
          locale,
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
        // `data.error` vient de l'API (src/app/api/checkout/route.ts), qui
        // répond volontairement en français — hors périmètre de la
        // traduction. Le repli, lui, est traduit.
        throw new Error(data.error || t("checkoutUnavailable"));
      }
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : t("genericError")
      );
      setIsRedirecting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="font-signature text-eyebrow uppercase text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          {t("emptyTitle")}
        </h1>
        <p className="mt-4 text-muted">{t("emptyText")}</p>
        <Link
          href="/produits"
          className="mt-8 rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
        {t("itemCount", { count: itemCount })}
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
                      {t("size", { size: sizeLabel(line.size) })}
                      {line.color ? ` · ${colorLabel(line.color)}` : ""}
                    </p>
                  </div>
                  <p className="font-display text-display-sm text-accent">
                    {formatPrice(
                      (line.product.price ?? 0) * line.quantity,
                      locale
                    )}
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
                      aria-label={t("decrease", { name: line.product.name })}
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
                      aria-label={t("increase", { name: line.product.name })}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.slug, line.size, line.color)}
                    className="text-xs text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-display-sm uppercase text-foreground">
            {t("summary")}
          </h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">{t("subtotal")}</span>
            <span className="font-display text-display-sm text-foreground">
              {formatPrice(subtotal, locale)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">{t("deliveryNote")}</p>

          <p className="mt-6 text-sm font-medium text-foreground">
            {t("onlinePayment")}
          </p>
          <label htmlFor="checkout-email" className="mt-3 block">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {t("emailLabel")}
            </span>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setCheckoutError(null);
              }}
              placeholder={t("emailPlaceholder")}
              className="mt-2 w-full rounded-full border border-border bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          {hasUnpricedItems && (
            <p className="mt-2 text-xs text-accent">{t("unpricedWarning")}</p>
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
            {isRedirecting ? t("redirecting") : t("payOnline")}
          </button>
          <p className="mt-2 text-xs text-muted">{t("secureCaption")}</p>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            {t("orWithoutOnlinePayment")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-accent px-6 py-3 text-center font-display uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("orderWhatsApp")}
              <span className="sr-only"> {t("newTab")}</span>
            </a>
            <a
              href={mailHref}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-center font-display uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {t("orderEmail")}
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">{t("orderMessageNote")}</p>

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
          >
            {t("clearCart")}
          </button>
        </aside>
      </div>
    </div>
  );
}

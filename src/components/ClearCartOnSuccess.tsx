"use client";

import { useEffect, useRef } from "react";

import { useCart } from "@/context/cart-context";

/**
 * Vide le panier une fois affichée la confirmation d'un paiement Paystack
 * réussi. N'affiche rien — composant purement comportemental, monté à côté
 * du contenu visible de la page de confirmation.
 */
export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
  }, [clearCart]);

  return null;
}

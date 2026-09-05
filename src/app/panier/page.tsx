import type { Metadata } from "next";

import CartView from "@/components/CartView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Panier",
    description: "Ton panier DRIP BY DIABS.",
    path: "/panier",
  }),
  // Page personnelle (contenu propre à chaque visiteur, pas de contenu à
  // indexer) : on demande explicitement aux moteurs de recherche de ne
  // pas la référencer.
  robots: { index: false, follow: false },
};

export default function PanierPage() {
  return <CartView />;
}

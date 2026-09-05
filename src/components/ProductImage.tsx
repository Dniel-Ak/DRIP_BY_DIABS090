import Image from "next/image";

import ProductVisual from "@/components/ProductVisual";

/**
 * Affiche la première vraie photo produit (si disponible) en `fill` dans un
 * conteneur positionné ; sinon retombe sur le visuel placeholder généré en
 * CSS/SVG (`ProductVisual`). `className` DOIT fixer une taille/un ratio
 * connu à l'avance (ex. `aspect-[4/5] w-full`, ou `h-24 w-24`) — c'est ce
 * qui réserve l'espace de l'image avant son chargement et évite tout
 * décalage de mise en page (CLS) ; ne pas y mettre `relative` ou
 * `absolute`, c'est géré ici.
 *
 * Chargement paresseux par défaut (comportement natif de `next/image`) :
 * ne passe `preload` à `true` que pour l'image la plus probablement visible
 * immédiatement à l'écran (ex. le visuel principal d'une fiche produit).
 */
export default function ProductImage({
  images,
  slug,
  name,
  className = "",
  sizes,
  preload = false,
}: {
  images: string[];
  slug: string;
  name: string;
  className?: string;
  sizes: string;
  preload?: boolean;
}) {
  const src = images[0];

  if (!src) {
    return <ProductVisual slug={slug} name={name} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className}`}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}

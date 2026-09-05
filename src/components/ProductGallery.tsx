"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";

import ProductVisual from "@/components/ProductVisual";

/**
 * Galerie de la fiche produit : grande image + bande de vignettes
 * cliquables. Retombe sur le visuel placeholder généré en CSS/SVG
 * (`ProductVisual`) quand le produit n'a pas encore de vraie photo.
 */
export default function ProductGallery({
  images,
  slug,
  name,
}: {
  images: string[];
  slug: string;
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("ProductDetail");

  if (images.length === 0) {
    return <ProductVisual slug={slug} name={name} className="aspect-square w-full" />;
  }

  const activeSrc = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface">
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          // Visuel principal de la fiche produit : quasi toujours visible
          // dès le chargement de la page (candidat LCP), donc on le
          // précharge plutôt que de le charger paresseusement.
          preload
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={t("galleryThumb", {
                index: index + 1,
                total: images.length,
                name,
              })}
              aria-current={index === activeIndex}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                index === activeIndex
                  ? "border-accent"
                  : "border-border hover:border-accent/60"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

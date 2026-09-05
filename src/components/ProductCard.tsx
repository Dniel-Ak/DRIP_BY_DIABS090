import Link from "next/link";

import ProductImage from "@/components/ProductImage";
import { formatPrice, getCategoryLabel } from "@/lib/products";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-4 rounded-2xl p-3 transition-colors hover:bg-surface"
    >
      <div className="relative">
        <ProductImage
          images={product.images}
          slug={product.slug}
          name={product.name}
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="aspect-[4/5] w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            Nouveau
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-signature text-eyebrow uppercase text-muted">
          {getCategoryLabel(product.category)}
        </span>
        <h3 className="font-medium text-foreground">{product.name}</h3>
        <p className="text-sm text-muted">{product.colors.join(", ")}</p>
        <p className="mt-1 font-display text-display-sm text-accent">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

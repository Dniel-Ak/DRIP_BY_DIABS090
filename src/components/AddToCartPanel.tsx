"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useCart } from "@/context/cart-context";

export default function AddToCartPanel({
  slug,
  sizes,
  colors,
  price,
  stock,
}: {
  slug: string;
  sizes: string[];
  colors: string[];
  /** Prix du produit ; `null` = pas encore fixé, achat désactivé. */
  price: number | null;
  /** Stock disponible par taille (ex. { S: 4, M: 0, L: 2 }). Taille absente ou à 0 = épuisée. */
  stock: Record<string, number>;
}) {
  const { addItem } = useCart();
  const t = useTranslations("AddToCart");
  const tColors = useTranslations("Colors");
  const tSizes = useTranslations("Sizes");

  // Libellés affichés des coloris et des tailles. La VALEUR stockée dans le
  // panier (et utilisée comme clé de stock) reste toujours la valeur
  // française du catalogue — seul l'affichage change de langue.
  const colorLabel = (color: string) =>
    tColors.has(color) ? tColors(color) : color;
  const sizeLabel = (size: string) => (tSizes.has(size) ? tSizes(size) : size);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // Un seul coloris disponible : pas de choix à faire, on le pré-sélectionne.
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length === 1 ? colors[0] : null
  );
  const [added, setAdded] = useState(false);

  const isSizeAvailable = (size: string) => (stock[size] ?? 0) > 0;
  const allSizesSoldOut = sizes.every((size) => !isSizeAvailable(size));

  if (price === null) {
    return (
      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">{t("size")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/50"
            >
              {sizeLabel(size)}
            </span>
          ))}
        </div>
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-full bg-accent px-6 py-3 font-display text-lg uppercase tracking-wide text-accent-foreground opacity-40 sm:w-auto sm:px-10"
        >
          {t("comingSoon")}
        </button>
        <p className="mt-4 text-xs text-muted">{t("comingSoonNote")}</p>
      </div>
    );
  }

  if (allSizesSoldOut) {
    return (
      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">{t("size")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/50 line-through"
            >
              {sizeLabel(size)}
            </span>
          ))}
        </div>
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-full bg-accent px-6 py-3 font-display text-lg uppercase tracking-wide text-accent-foreground opacity-40 sm:w-auto sm:px-10"
        >
          {t("soldOut")}
        </button>
        <p className="mt-4 text-xs text-muted">{t("soldOutNote")}</p>
      </div>
    );
  }

  const canAdd = Boolean(
    selectedSize && selectedColor && isSizeAvailable(selectedSize)
  );

  return (
    <div className="mt-8">
      {colors.length > 1 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground">
            {selectedColor
              ? t("colorWithValue", { color: colorLabel(selectedColor) })
              : t("color")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setSelectedColor(color);
                  setAdded(false);
                }}
                aria-pressed={selectedColor === color}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-foreground/80 hover:border-accent hover:text-accent"
                }`}
              >
                {colorLabel(color)}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm font-medium text-foreground">{t("size")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const available = isSizeAvailable(size);
          return (
            <button
              key={size}
              type="button"
              disabled={!available}
              onClick={() => {
                setSelectedSize(size);
                setAdded(false);
              }}
              aria-pressed={selectedSize === size}
              title={available ? undefined : t("soldOut")}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !available
                  ? "cursor-not-allowed border-border text-foreground/30 line-through"
                  : selectedSize === size
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-foreground/80 hover:border-accent hover:text-accent"
              }`}
            >
              {sizeLabel(size)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          if (!selectedSize || !selectedColor) return;
          addItem(slug, selectedSize, selectedColor);
          setAdded(true);
        }}
        // aria-live : le focus reste sur ce bouton après le clic, donc sans
        // ça un lecteur d'écran n'annoncerait jamais le changement de
        // libellé "Ajouté ✓" (seul le contenu visuel changerait).
        aria-live="polite"
        className="mt-6 w-full rounded-full bg-accent px-6 py-3 font-display text-lg uppercase tracking-wide text-accent-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
      >
        {added ? t("added") : t("addToCart")}
      </button>

      {!canAdd && (
        <p className="mt-2 text-xs text-muted">
          {colors.length > 1 && !selectedColor
            ? t("selectColorAndSize")
            : t("selectSize")}
        </p>
      )}
    </div>
  );
}

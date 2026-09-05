"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  slug: string;
  size: string;
  /** Couleur choisie. En pratique toujours un vrai nom de coloris (ex.
   * "Noir") : `AddToCartPanel` présélectionne automatiquement l'unique
   * coloris d'un produit qui n'en a qu'un — jamais une chaîne vide. */
  color: string;
  quantity: number;
}

interface CartContextValue {
  items: CartLine[];
  addItem: (
    slug: string,
    size: string,
    color: string,
    quantity?: number
  ) => void;
  removeItem: (slug: string, size: string, color: string) => void;
  updateQuantity: (
    slug: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "drip-by-diabs:cart";

function sameLine(
  line: CartLine,
  slug: string,
  size: string,
  color: string
): boolean {
  return line.slug === slug && line.size === size && line.color === color;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charge le panier sauvegardé au premier rendu côté client. On lit
  // volontairement localStorage après le montage (et pas dans un
  // initialiseur de useState) pour que le rendu serveur et le premier
  // rendu client restent identiques (pas de mismatch d'hydratation) ;
  // le panier apparaît juste après, comme sur la plupart des boutiques.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Normalise les paniers sauvegardés avant l'ajout du champ
          // `color` (versions précédentes du site) pour éviter tout plantage.
          const normalized: CartLine[] = parsed.map(
            (item: Partial<CartLine>) => ({
              slug: String(item.slug ?? ""),
              size: String(item.size ?? ""),
              color: String(item.color ?? ""),
              quantity: Number(item.quantity ?? 1),
            })
          );
          // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation ponctuelle depuis localStorage (système externe) au montage, pas une boucle de rendu.
          setItems(normalized);
        }
      }
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on ignore.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sauvegarde à chaque changement, une fois l'hydratation initiale faite.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // idem : on n'interrompt pas l'expérience si le stockage échoue.
    }
  }, [items, isHydrated]);

  function addItem(slug: string, size: string, color: string, quantity = 1) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((line) =>
        sameLine(line, slug, size, color)
      );
      if (existingIndex === -1) {
        return [...prev, { slug, size, color, quantity }];
      }
      return prev.map((line, index) =>
        index === existingIndex
          ? { ...line, quantity: line.quantity + quantity }
          : line
      );
    });
  }

  function removeItem(slug: string, size: string, color: string) {
    setItems((prev) => prev.filter((line) => !sameLine(line, slug, size, color)));
  }

  function updateQuantity(
    slug: string,
    size: string,
    color: string,
    quantity: number
  ) {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => !sameLine(line, slug, size, color));
      }
      return prev.map((line) =>
        sameLine(line, slug, size, color) ? { ...line, quantity } : line
      );
    });
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.");
  }
  return context;
}

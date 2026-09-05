"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/context/cart-context";
import { NAV_LINKS } from "@/lib/navigation";

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-display text-2xl tracking-wide text-foreground">
            DRIP
          </span>
          <span className="font-signature text-xs uppercase tracking-[0.2em] text-accent">
            by Diabs
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CartLink itemCount={itemCount} onClick={() => setIsOpen(false)} />

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground sm:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 pb-4 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-foreground/90 hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/panier"
            onClick={() => setIsOpen(false)}
            className="rounded-lg px-2 py-3 text-sm font-medium text-foreground/90 hover:bg-surface"
          >
            Panier{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
}

function CartLink({
  itemCount,
  onClick,
}: {
  itemCount: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/panier"
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:text-accent"
      aria-label={
        itemCount > 0
          ? `Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`
          : "Panier"
      }
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-display text-[10px] leading-none text-accent-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

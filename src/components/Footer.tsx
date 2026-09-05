import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { FOOTER_LINKS, SOCIAL_LINKS, type SocialPlatform } from "@/lib/navigation";

const SOCIAL_ICONS: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.5 3.5c.3 1.9 1.6 3.4 3.5 3.7v2.7a6.6 6.6 0 0 1-3.5-1.1v6.4a5.3 5.3 0 1 1-5.3-5.3c.2 0 .4 0 .6.03v2.8a2.5 2.5 0 1 0 1.9 2.42V3.5h2.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  snapchat: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.2c2.4 0 3.9 1.9 3.9 4.1 0 1.1-.1 2-.1 2.6.5.2 1 .1 1.4-.1.4-.2.9-.1 1 .3.1.4-.1.7-.6 1-.4.2-1.1.5-1.5.9-.2.2-.2.4-.1.7.4 1.1 1.6 1.9 2.8 2.1.3 0 .5.3.4.6-.2.6-1.2.9-2 1-.1.3-.2.6-.3.8-.1.3-.4.4-.8.3-.5-.1-1-.2-1.7-.1-.7.1-1.2.5-2.4.5-1.2 0-1.7-.4-2.4-.5-.7-.1-1.2 0-1.7.1-.4.1-.7 0-.8-.3-.1-.2-.2-.5-.3-.8-.8-.1-1.8-.4-2-1-.1-.3.1-.6.4-.6 1.2-.2 2.4-1 2.8-2.1.1-.3.1-.5-.1-.7-.4-.4-1.1-.7-1.5-.9-.5-.3-.7-.6-.6-1 .1-.4.6-.5 1-.3.4.2.9.3 1.4.1 0-.6-.1-1.5-.1-2.6 0-2.2 1.5-4.1 3.9-4.1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default async function Footer() {
  const year = new Date().getFullYear();
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tHeader = await getTranslations("Header");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-wide text-foreground">
              DRIP
            </span>
            <span className="font-signature text-xs uppercase tracking-[0.2em] text-accent">
              {tHeader("brandSuffix")}
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{t("tagline")}</p>
        </div>

        <div>
          <p className="font-signature text-eyebrow uppercase text-foreground">
            {t("navigation")}
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
            {FOOTER_LINKS.filter((link) => link.href !== "/").map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-signature text-eyebrow uppercase text-foreground">
            {t("contact")}
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <li>
              <a
                href="mailto:contact.diabs090@gmail.com"
                className="hover:text-accent"
              >
                contact.diabs090@gmail.com
              </a>
            </li>
            <li>{t("location")}</li>
          </ul>
        </div>

        <div>
          <p className="font-signature text-eyebrow uppercase text-foreground">
            {t("followUs")}
          </p>
          <ul className="mt-3 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} ${t("newTab")}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <span className="h-4 w-4">{SOCIAL_ICONS[social.platform]}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <p className="mx-auto max-w-6xl text-xs text-muted">
          {/* `String(year)` : passé en nombre, ICU le formaterait avec un
              séparateur de milliers (« 2 026 »). */}
          {t("rights", { year: String(year) })}
        </p>
      </div>
    </footer>
  );
}

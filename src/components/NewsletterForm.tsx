"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("Newsletter");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p
        role="status"
        className="font-display text-display-sm uppercase text-accent-foreground"
      >
        {t("success")}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="newsletter-email">
        {t("emailLabel")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder={t("emailPlaceholder")}
        // Bordure et placeholder à opacité relevée par rapport à l'origine
        // (30%/50%) : sur le fond doré (--accent) de cette section, ces
        // valeurs tombaient sous le seuil WCAG (respectivement 3:1 pour un
        // contour d'UI, 4.5:1 pour du texte). Le focus utilise
        // --accent-foreground (fond doré = pas de doré possible sur doré).
        className="w-full rounded-full border border-accent-foreground/60 bg-transparent px-5 py-3 text-sm text-accent-foreground placeholder:text-accent-foreground/75 focus:border-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
      />
      <button
        type="submit"
        className="flex-shrink-0 rounded-full bg-accent-foreground px-6 py-3 font-display uppercase tracking-wide text-accent transition-opacity hover:opacity-90"
      >
        {t("submit")}
      </button>
    </form>
  );
}

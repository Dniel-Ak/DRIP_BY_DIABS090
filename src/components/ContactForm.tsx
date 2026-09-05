"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

/**
 * Sujets du formulaire : la VALEUR envoyée à l'API (et donc reprise dans
 * l'e-mail reçu par l'équipe DIABS à Abidjan) reste toujours en français,
 * seul le libellé affiché est traduit — même logique que le message de
 * commande WhatsApp/e-mail (voir src/components/CartView.tsx).
 */
const SUBJECT_OPTIONS = [
  { value: "Question sur une commande", labelKey: "subjectOrder" },
  { value: "Question sur un produit", labelKey: "subjectProduct" },
  { value: "Partenariat / presse", labelKey: "subjectPress" },
  { value: "Autre", labelKey: "subjectOther" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("ContactForm");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    setIsSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        // `result.error` vient de l'API (src/app/api/contact/route.ts), qui
        // répond volontairement en français — hors périmètre de la
        // traduction. Le repli, lui, est traduit.
        throw new Error(result.error || t("sendError"));
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    } finally {
      setIsSending(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent/40 bg-surface p-6 text-sm text-foreground"
      >
        {t("success")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-foreground">
          {t("name")}
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-foreground">
          {t("email")}
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        {t("subject")}
        <select
          name="subject"
          defaultValue={SUBJECT_OPTIONS[0].value}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        {t("message")}
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="mt-2 w-full rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
      >
        {isSending ? t("sending") : t("send")}
      </button>
    </form>
  );
}

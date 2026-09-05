"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(
          result.error || "Le message n'a pas pu être envoyé."
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
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
        Merci pour ton message ! Nous te répondons sous 48h ouvrées.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-foreground">
          Nom
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-foreground">
          E-mail
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        Sujet
        <select
          name="subject"
          defaultValue="Question sur une commande"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <option>Question sur une commande</option>
          <option>Question sur un produit</option>
          <option>Partenariat / presse</option>
          <option>Autre</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        Message
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
        {isSending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}

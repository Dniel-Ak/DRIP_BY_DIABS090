import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        Erreur 404
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-4 text-muted">
        La page que tu cherches a peut-être été déplacée ou n&apos;a jamais
        existé.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 font-display uppercase tracking-wide text-accent-foreground"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

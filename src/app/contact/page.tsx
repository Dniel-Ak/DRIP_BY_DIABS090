import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contacte l'équipe DIABS pour toute question.",
  path: "/contact",
});

const PHONE_CONTACTS = [
  { name: "Habib Ouattara", number: "01 60 99 77 75" },
  { name: "Karam", number: "07 97 82 10 52" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-signature text-eyebrow uppercase text-accent">
          Contact
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          Une question&nbsp;?
        </h1>
        <p className="mt-4 text-base text-muted">
          Notre équipe te répond sous 48h ouvrées, du lundi au vendredi.
        </p>

        <dl className="mt-10 flex flex-col gap-6 text-sm">
          <div>
            <dt className="font-medium text-foreground">E-mail</dt>
            <dd className="mt-1 text-muted">
              <a
                href="mailto:contact.diabs090@gmail.com"
                className="hover:text-accent"
              >
                contact.diabs090@gmail.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Téléphone</dt>
            <dd className="mt-1 flex flex-col gap-1 text-muted">
              {PHONE_CONTACTS.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number.replace(/\s+/g, "")}`}
                  className="hover:text-accent"
                >
                  {contact.name} — {contact.number}
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Réseaux</dt>
            <dd className="mt-1 flex flex-col gap-1 text-muted">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {social.label} · {social.handle}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Showroom</dt>
            <dd className="mt-1 text-muted">
              Abidjan, Côte d&apos;Ivoire — sur rendez-vous
            </dd>
          </div>
        </dl>
      </div>

      <ContactForm />
    </div>
  );
}

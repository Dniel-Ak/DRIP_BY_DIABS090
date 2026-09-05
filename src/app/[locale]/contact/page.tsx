import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ContactForm from "@/components/ContactForm";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildMetadata({
    title: t("contactTitle"),
    description: t("contactDescription"),
    path: "/contact",
    locale,
  });
}

const PHONE_CONTACTS = [
  { name: "Habib Ouattara", number: "01 60 99 77 75" },
  { name: "Karam", number: "07 97 82 10 52" },
];

export default async function ContactPage(
  props: PageProps<"/[locale]/contact">
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-signature text-eyebrow uppercase text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-display-lg uppercase text-foreground">
          {t("title")}
        </h1>
        <p className="mt-4 text-base text-muted">{t("intro")}</p>

        <dl className="mt-10 flex flex-col gap-6 text-sm">
          <div>
            <dt className="font-medium text-foreground">{t("emailLabel")}</dt>
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
            <dt className="font-medium text-foreground">{t("phoneLabel")}</dt>
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
            <dt className="font-medium text-foreground">{t("socialsLabel")}</dt>
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
                  <span className="sr-only"> {t("newTab")}</span>
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              {t("showroomLabel")}
            </dt>
            <dd className="mt-1 text-muted">{t("showroomValue")}</dd>
          </div>
        </dl>
      </div>

      <ContactForm />
    </div>
  );
}

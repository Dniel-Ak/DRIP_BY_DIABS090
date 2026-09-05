import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos",
  description:
    "L'histoire de DIABS, marque de streetwear premium née à Abidjan en 2025.",
  path: "/a-propos",
});

const TIMELINE = [
  {
    year: "2025",
    text: "Naissance de DIABS à Abidjan : nouvelle direction artistique et premiers drops streetwear premium.",
  },
];

const PILLARS = [
  { label: "Univers", value: "Streetwear premium" },
  { label: "Identité", value: "Afrique contemporaine" },
  { label: "Signature", value: "Oversize & coupes boxy" },
];

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-signature text-eyebrow uppercase text-accent">
        Notre histoire
      </p>
      <h1 className="mt-4 font-display text-display-lg uppercase leading-none text-foreground sm:text-display-xl">
        Né à Abidjan, pensé pour durer.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
        La nouvelle direction artistique de DIABS s&apos;inscrit dans un
        univers streetwear premium mêlant créativité, exclusivité de luxe
        et identité africaine contemporaine. Inspirée par l&apos;esprit
        d&apos;une nouvelle génération déterminée, elle associe des
        silhouettes oversize, des coupes boxy et des visuels puissants.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
        Entre esthétique sombre, détails raffinés et influence de la
        jeunesse ivoirienne, DIABS affirme une vision moderne où chaque
        pièce devient un signe d&apos;appartenance — et brise toutes les
        règles.
      </p>

      <div className="mt-14">
        <h2 className="font-display text-display-lg uppercase text-foreground">
          Le parcours
        </h2>
        <ol className="mt-8 flex flex-col gap-8 border-l border-border pl-6">
          {TIMELINE.map((step) => (
            <li key={step.year} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-accent" />
              <span className="font-display text-display-sm text-accent">
                {step.year}
              </span>
              <p className="mt-1 text-sm text-muted sm:text-base">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="rounded-2xl border border-border p-6"
          >
            <p className="font-display text-display-sm uppercase text-accent">
              {pillar.value}
            </p>
            <p className="mt-1 font-signature text-eyebrow uppercase text-muted">
              {pillar.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

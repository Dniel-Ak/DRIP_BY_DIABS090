import { useTranslations } from "next-intl";
import { useId } from "react";

/**
 * Grand visuel de marque pour le hero — composition graphique bold en
 * SVG/CSS (aucune photo requise) : bloc doré diagonal + wordmark
 * surdimensionné. Remplace-le par une vraie image de campagne dès que tu
 * en as une : garde le conteneur `absolute inset-0` pour que le texte du
 * hero, superposé par-dessus, reste lisible.
 */
export default function HeroVisual({ className = "" }: { className?: string }) {
  const grainId = `hero-grain-${useId()}`;
  const t = useTranslations("Brand");

  return (
    <div className={`overflow-hidden bg-background ${className}`}>
      {/* Bloc doré diagonal — la signature graphique du hero. Peu profond
          sur mobile (le texte est haut, sous la barre de nav) et plus
          généreux à partir de lg, où le hero a plus de hauteur libre. */}
      <div
        className="absolute inset-0 bg-accent [clip-path:polygon(0%_0%,100%_0%,100%_14%,0%_22%)] sm:[clip-path:polygon(0%_0%,100%_0%,100%_18%,0%_28%)] lg:[clip-path:polygon(0%_0%,100%_0%,100%_28%,0%_46%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/20 [clip-path:polygon(0%_0%,100%_0%,100%_14%,0%_22%)] sm:[clip-path:polygon(0%_0%,100%_0%,100%_18%,0%_28%)] lg:[clip-path:polygon(0%_0%,100%_0%,100%_28%,0%_46%)]"
        aria-hidden="true"
      />

      {/* Repère de collection, posé sur le bloc doré */}
      <div className="absolute left-4 top-6 flex items-center gap-2 sm:left-6 sm:top-8">
        <span className="font-display text-display-sm text-accent-foreground">
          N°06
        </span>
        <span className="h-1 w-1 rounded-full bg-accent-foreground/60" />
        <span className="font-signature text-eyebrow uppercase text-accent-foreground/80">
          {t("since")}
        </span>
      </div>

      {/* Wordmark fantôme surdimensionné, sous le bloc doré */}
      <div
        className="absolute inset-0 flex items-center justify-center pt-[20%]"
        aria-hidden="true"
      >
        <span className="select-none whitespace-nowrap font-display text-[30vw] leading-none text-foreground/[0.09] sm:text-[19vw] lg:text-[12vw]">
          DIABS
        </span>
      </div>

      {/* Grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden="true">
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Voile bas pour garantir la lisibilité du texte superposé */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

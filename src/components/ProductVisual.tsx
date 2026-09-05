// Variations sobres autour de la palette de marque (noir / or) : le
// contraste vient de l'intensité du dégradé doré, pas de teintes hors charte.
const GRADIENTS = [
  "from-accent/20 via-surface-2 to-surface",
  "from-accent/10 via-surface-2 to-surface",
  "from-accent-soft via-surface-2 to-surface",
  "from-surface-2 via-surface to-background",
  "from-accent/25 via-surface to-background",
];

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % GRADIENTS.length;
  }
  return Math.abs(hash);
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export default function ProductVisual({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const gradient = GRADIENTS[hashSlug(slug)];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${gradient} ${className}`}
      aria-hidden="true"
    >
      <span className="font-display text-5xl tracking-widest text-foreground/20 sm:text-7xl">
        {initialsOf(name)}
      </span>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,rgba(236,174,68,0.1)_50%,transparent_55%)]" />
    </div>
  );
}

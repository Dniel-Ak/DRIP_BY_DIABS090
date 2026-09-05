import { notFound } from "next/navigation";

/**
 * Attrape-tout des URLs inconnues À L'INTÉRIEUR du segment `[locale]`
 * (`/nimporte-quoi`, `/en/nimporte-quoi`...) et déclenche le rendu de
 * `src/app/[locale]/not-found.tsx`.
 *
 * Pourquoi c'est nécessaire : Next.js ne remonte à un `not-found.tsx` de
 * segment que lorsqu'une route a été trouvée puis a appelé `notFound()`.
 * Pour une URL qui ne correspond à AUCUNE route, il affiche la page 404
 * interne par défaut ("404: This page could not be found."), non traduite
 * et sans Header/Footer. Comme tout le site vit sous `[locale]` (il n'y a
 * volontairement pas de `app/layout.tsx` racine : le `<html lang>` doit
 * connaître la locale), ce petit attrape-tout est la façon recommandée par
 * next-intl de rebrancher la vraie page 404 du site.
 *
 * Les routes réelles restent prioritaires : un segment dynamique
 * attrape-tout n'est utilisé par Next.js que si rien de plus spécifique ne
 * correspond.
 */
export default function CatchAllPage() {
  notFound();
}

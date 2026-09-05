# DRIP BY DIABS

[![CI](https://github.com/Dniel-Ak/DRIP_BY_DIABS090/actions/workflows/ci.yml/badge.svg)](https://github.com/Dniel-Ak/DRIP_BY_DIABS090/actions/workflows/ci.yml)

Site vitrine et boutique en ligne (catalogue) de la marque de streetwear **DRIP BY DIABS**, construit avec Next.js (App Router), TypeScript et Tailwind CSS.

## Démarrer en local

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — sert le build de production
- `npm run lint` — vérifie le code avec ESLint

## Thème (couleurs, polices, tailles de texte)

Tout le thème est centralisé dans **`src/styles/theme.css`**, importé une seule fois dans `src/app/globals.css`. C'est le seul fichier à modifier pour changer l'identité visuelle du site :

- **Couleurs de marque** : noir `#191817`, blanc `#f2f3f5`, or `#ecae44`, disponibles comme utilitaires Tailwind sémantiques (`bg-background`, `text-foreground`, `text-accent`, `bg-surface`, `border-border`, `text-muted`…) et comme couleurs brutes (`bg-noir`, `text-blanc`, `text-or`).
- **Polices** : `font-display` (Bebas Neue — titres et numéros) et `font-signature` (Cinzel — signature et détails dorés), en plus de `font-sans` (texte courant). Les deux polices de marque sont auto-hébergées via `next/font/local` (`src/lib/fonts.ts`, fichiers dans `src/fonts/`) : aucune requête vers Google Fonts, ni au build ni en runtime, avec préchargement et police de secours ajustée automatiquement (évite tout décalage de mise en page pendant le chargement).
- **Échelle de texte** : `text-display-xl`, `text-display-lg`, `text-display`, `text-display-sm` pour les titres/numéros, et `text-eyebrow` pour les petits libellés en majuscules dorées (ex. "Boutique", "Contact").

Ces classes sont déjà utilisées dans toutes les pages existantes (accueil, boutique, fiche produit, à propos, contact) — réutilise-les telles quelles pour toute nouvelle page ou section.

## Navigation

Les liens du header et du footer viennent d'une seule source, **`src/lib/navigation.ts`** (`NAV_LINKS`, `FOOTER_LINKS`, `SOCIAL_LINKS`) : ajoute une page à cette liste pour qu'elle apparaisse automatiquement au bon endroit.

Pages disponibles : Accueil (`/`), Boutique (`/produits`), Fiche produit (`/produits/[slug]`, une page par produit), Panier (`/panier`), À propos (`/a-propos`), Contact (`/contact`).

## Langues (français / anglais)

Le site est bilingue via **next-intl** (App Router) :

- **Le français est la langue par défaut et reste à la racine, sans préfixe** : `/`, `/produits`, `/contact`… — toutes les URLs déjà partagées (QR codes, bio Instagram) continuent de fonctionner à l'identique. **L'anglais vit sous `/en`** : `/en`, `/en/produits`, `/en/contact`…
- **Aucune détection automatique** : personne n'est redirigé selon la langue de son navigateur ou son pays. Tout le monde arrive en français ; l'anglais s'obtient uniquement via le sélecteur **FR / EN** du header (`src/components/LocaleSwitcher.tsx`), qui bascule la page courante — pas l'accueil.
- **Textes traduits** : `messages/fr.json` et `messages/en.json`. Pour changer un libellé, modifie la clé correspondante dans les deux fichiers.
- **Configuration** : `src/i18n/routing.ts` (locales, préfixe, détection désactivée), `src/i18n/request.ts` (chargement des dictionnaires), `src/i18n/navigation.ts` (`Link`, `useRouter`, `usePathname`, `getPathname` conscients de la locale — à utiliser à la place de `next/link` / `next/navigation`) et `src/proxy.ts` (le « proxy » de Next.js 16, ex-`middleware.ts`).
- **Ce qui n'est JAMAIS traduit** :
  - les **noms de produits** ("Young Rich Papi FC", "Bonnet DIABS 090"…) — ce sont des noms propres de marque ;
  - les **slugs et clés de catégorie** (`/produits/bonnet-diabs-090`, `?categorie=polos`) — identiques dans les deux langues, seuls les libellés affichés changent (`Bonnets` → `Beanies`, `Vestes` → `Jackets`…) ;
  - le **message de commande WhatsApp / e-mail** (`buildOrderMessage` dans `src/components/CartView.tsx`) et l'**objet du formulaire de contact** : ils sont lus par l'équipe DIABS à Abidjan, donc toujours en français, même quand le client navigue en anglais ;
  - les **messages d'erreur des routes API** (`/api/checkout`, `/api/contact`), restés en français.
- **Descriptions produit** : le français est dans `src/data/products.ts`, l'anglais dans `src/data/products.en.ts` (indexé par slug). Un produit sans traduction retombe automatiquement sur le texte français.
- **SEO** : chaque page déclare son `canonical` et ses `alternates.languages` (hreflang `fr`, `en`, `x-default`) ; le `sitemap.xml` liste chaque page une fois avec ses deux variantes linguistiques.

## Panier

Le panier (`src/context/cart-context.tsx`) est un vrai state partagé dans toute l'app : ajout depuis une fiche produit (taille + couleur), compteur dans le header, page `/panier` avec quantités, suppression et persistance dans `localStorage` (survit à un rechargement, avec migration automatique des anciens paniers enregistrés avant l'ajout de la couleur).

Depuis le panier, le client a le choix entre trois façons de commander (voir section "Paiement en ligne (Paystack)" ci-dessous pour le détail du paiement en ligne) :

- **Paiement en ligne via Paystack** (carte bancaire, mobile money) — redirection vers la page de paiement hébergée Paystack, puis retour sur `/paiement/confirmation`.
- **WhatsApp** — ouvre `wa.me` avec un message pré-rempli récapitulant la commande, envoyé au numéro configuré dans `src/components/CartView.tsx` (`ORDER_WHATSAPP_NUMBER`).
- **E-mail** — ouvre un brouillon `mailto:` pré-rempli vers `contact.diabs090@gmail.com`.

Le paiement en ligne est désactivé automatiquement si le panier contient un article dont le prix n'est pas encore fixé (`price: null` dans le catalogue) ; ces articles restent commandables via WhatsApp/e-mail.

## Paiement en ligne (Paystack)

Le paiement en ligne passe par [Paystack](https://paystack.com) (propriété de Stripe), et non par Stripe directement : Stripe ne permet pas de créer un compte marchand pour une entreprise basée en Côte d'Ivoire, alors que Paystack le permet, avec un principe de paiement hébergé ("Checkout") identique.

**Où mettre ta clé API en toute sécurité :**

1. Copie `.env.local.example` vers un nouveau fichier `.env.local` à la racine du projet (`cp .env.local.example .env.local`).
2. Récupère ta clé secrète sur le [dashboard Paystack](https://dashboard.paystack.com) → **Settings → API Keys & Webhooks** → clé **Secret Key** (utilise la clé `sk_test_...` pour développer/tester, la clé `sk_live_...` seulement quand le site est prêt à encaisser de vrais paiements).
3. Colle-la dans `.env.local` : `PAYSTACK_SECRET_KEY=sk_test_...`.

`.env.local` n'est **jamais** commité dans git (voir `.gitignore`, règle `.env*`) — c'est l'endroit prévu pour tout secret. La clé n'est utilisée que côté serveur (`src/lib/paystack.ts`, `src/app/api/checkout/route.ts`) : elle n'atteint jamais le navigateur du client. Redémarre `npm run dev` après avoir créé ou modifié `.env.local`.

**Comment ça marche (flux complet) :**

1. Le client renseigne son e-mail dans le panier et clique sur "Payer en ligne — Paystack".
2. Le panier envoie au serveur uniquement `(slug, taille, couleur, quantité)` par article — jamais de prix. La route `POST /api/checkout` (`src/app/api/checkout/route.ts`) recalcule le total à partir du catalogue (`src/data/products.ts`) : le prix affiché côté client n'est jamais utilisé pour l'encaissement, pour éviter toute manipulation.
3. Le serveur appelle l'API Paystack (`src/lib/paystack.ts`, `POST /transaction/initialize`) et renvoie l'URL de la page de paiement hébergée Paystack ; le navigateur y est redirigé.
4. Une fois le paiement terminé (réussi, échoué ou abandonné), Paystack redirige vers `/paiement/confirmation?reference=...`, qui vérifie le paiement côté serveur (`GET /transaction/verify/:reference`) et affiche le résultat.
5. Si le paiement est confirmé réussi, le panier est automatiquement vidé (`src/components/ClearCartOnSuccess.tsx`).

**À savoir :** le franc CFA (XOF) n'a pas de sous-unité, mais l'API Paystack impose quand même de multiplier les montants envoyés par 100 (documenté ainsi côté Paystack) — c'est déjà géré dans `src/lib/paystack.ts`, aucune action requise.

Sans `PAYSTACK_SECRET_KEY` configurée, le bouton de paiement en ligne renvoie une erreur explicite et invite à commander via WhatsApp/e-mail à la place — le site reste utilisable sans clé Paystack.

## Formulaire de contact (Resend)

Le formulaire de la page `/contact` (`src/components/ContactForm.tsx`) envoie un vrai e-mail à la marque via [Resend](https://resend.com), une API d'envoi d'e-mails transactionnels.

**Où mettre ta clé API en toute sécurité :**

1. Crée un compte sur [resend.com](https://resend.com) **avec l'adresse `contact.diabs090@gmail.com`** — voir l'encadré ci-dessous, c'est important.
2. Dans le dashboard Resend → **API Keys** → **Create API Key**.
3. Copie `.env.local.example` vers `.env.local` si ce n'est pas déjà fait (voir section Paystack ci-dessus), puis ajoute la ligne : `RESEND_API_KEY=re_...`.

`.env.local` n'est jamais commité dans git — la clé n'est utilisée que côté serveur (`src/lib/resend.ts`, `src/app/api/contact/route.ts`), jamais côté navigateur. Redémarre `npm run dev` après avoir modifié `.env.local`.

**Pourquoi créer le compte Resend avec l'adresse `contact.diabs090@gmail.com` précisément :** sans nom de domaine personnalisé vérifié (ce qui demande d'acheter un domaine et de configurer des enregistrements DNS), Resend limite l'expéditeur partagé `onboarding@resend.dev` à n'envoyer des e-mails **qu'à l'adresse du compte Resend lui-même** (mesure anti-spam de Resend). Comme ce formulaire envoie justement tous les messages vers l'adresse de contact de la marque, ça fonctionne parfaitement si le compte Resend est créé avec cette même adresse — sans avoir besoin d'acheter ni de vérifier un domaine. Si tu préfères utiliser une autre adresse d'expéditeur (ex. `contact@dripbydiabs.com`) plus tard, il faudra vérifier un domaine dans Resend et mettre à jour `FROM_ADDRESS` dans `src/lib/resend.ts`.

**Comment ça marche (flux complet) :**

1. Le client remplit le formulaire (nom, e-mail, sujet, message) sur `/contact` et clique sur "Envoyer".
2. Le formulaire envoie ces données à `POST /api/contact` (`src/app/api/contact/route.ts`), qui valide le nom, l'e-mail et le message côté serveur.
3. La route appelle `sendContactEmail()` (`src/lib/resend.ts`), qui envoie l'e-mail via l'API Resend vers `contact.diabs090@gmail.com`, avec comme adresse de réponse ("Reply-To") l'e-mail du client — tu peux donc répondre directement depuis ta boîte mail.
4. Le formulaire affiche un message de confirmation une fois l'e-mail parti, ou un message d'erreur clair en cas d'échec.

Sans `RESEND_API_KEY` configurée, le formulaire affiche une erreur explicite et invite à contacter la marque directement par e-mail ou WhatsApp à la place — le site reste utilisable sans clé Resend.

## Gestion des stocks

Le stock est suivi **par produit et par taille** (ex. le polo Young Rich Papi FC a un stock séparé pour S, M, L, XL, XXL). Il vit dans **`data/stock.json`**, à la racine du projet — un simple fichier texte, pas une base de données, volontairement facile à modifier à la main.

### Comment ça fonctionne automatiquement

- **Quand un client paie en ligne via Paystack** : dès qu'il clique sur "Payer en ligne", le stock de chaque article est immédiatement réservé (décrémenté) — avant même d'arriver sur la page Paystack. Ça évite qu'un deuxième client achète le dernier article pendant que le premier est en train de payer.
- **Si le paiement réussit** : le stock reste décrémenté, rien d'autre à faire — la vente est actée.
- **Si le paiement échoue ou est annulé** (le client clique "Annuler", ou la carte est refusée) : le stock réservé est automatiquement remis à son niveau d'avant la commande dès qu'il revient sur la page de confirmation.
- **Si le client ferme l'onglet Paystack sans jamais revenir sur le site** : la réservation reste "en attente" au maximum 30 minutes (la durée de vie d'une session de paiement Paystack), puis est relâchée automatiquement toute seule à la prochaine tentative de paiement d'un autre client. Tu n'as rien à faire.
- **Tailles épuisées** : sur la fiche produit, une taille à 0 en stock s'affiche barrée et non cliquable ("Épuisé"). Si toutes les tailles d'un produit sont à 0, le bouton "Ajouter au panier" est remplacé par "Épuisé".
- **Sécurité anti-survente** : même si quelqu'un tente de commander plus que le stock disponible (bug d'affichage, deux onglets ouverts, etc.), la route `/api/checkout` (`src/app/api/checkout/route.ts`) revérifie toujours le stock réel avant d'accepter le paiement et refuse avec un message clair si ce n'est pas possible.

Toute cette logique vit dans **`src/lib/stock.ts`**.

### Ce qui n'est PAS automatique : les commandes WhatsApp et e-mail

Une commande passée via WhatsApp ou e-mail ne décrémente **pas** le stock automatiquement — il n'y a aucun moyen technique de savoir si tu as réellement confirmé et honoré cette commande. **Après avoir traité une commande WhatsApp/e-mail, mets à jour `data/stock.json` toi-même** (voir ci-dessous), sinon le site continuera d'afficher un article comme disponible alors qu'il ne l'est plus.

### Mettre à jour les stocks (nouvel arrivage, réassort, vente manuelle)

1. Ouvre `data/stock.json` dans VS Code (ou n'importe quel éditeur de texte).
2. Le fichier ressemble à ça :

   ```json
   {
     "young-rich-papi-fc": { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 },
     "fc-diabs-golden-era": { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 },
     "bonnet-diabs-090": { "Taille unique": 10 },
     "bonnet-diabs-090-beige": { "Taille unique": 10 }
   }
   ```

3. Repère le produit par son `slug` (le même identifiant que dans l'URL de la fiche produit, ex. `young-rich-papi-fc`), puis change le chiffre de la taille concernée. Par exemple, un nouvel arrivage de 20 polos "Young Rich Papi FC" en taille M :

   ```json
   "young-rich-papi-fc": { "S": 10, "M": 30, "L": 10, "XL": 10, "XXL": 10 },
   ```

4. Enregistre le fichier (`Ctrl+S`). **C'est tout** — pas besoin de redémarrer `npm run dev`, le nouveau stock est pris en compte immédiatement au prochain chargement du site.

Pour ajouter un **nouveau produit** au catalogue : il doit avoir une entrée dans `src/data/products.ts` (le catalogue, voir section "Catalogue produits" ci-dessous) ET une entrée dans `data/stock.json` avec le même `slug` et les mêmes tailles — sans entrée dans `stock.json`, un produit est considéré comme ayant 0 en stock partout (donc "Épuisé" partout).

### Limite à connaître si tu déploies le site en ligne

`data/stock.json` fonctionne très bien en local (`npm run dev`) et sur un hébergement classique avec un disque persistant (un VPS, par exemple). En revanche, sur un hébergement "serverless" comme Vercel, le système de fichiers est réinitialisé à chaque déploiement et n'est pas partagé entre les instances du site — les stocks ne se mettraient pas à jour de façon fiable dans ce cas. Si tu déploies un jour sur ce type d'hébergement, il faudra remplacer ce fichier par une vraie base de données (ce sera une évolution à prévoir, pas un chantier immédiat).

## Page d'accueil

`src/app/[locale]/page.tsx` suit cinq sections, mobile-first : hero (grand visuel de marque + accroche, `src/components/HeroVisual.tsx`), pièces phares (4 produits), notre histoire (courte, avec lien vers `/a-propos`), un bandeau CTA vers la boutique, puis la bannière newsletter (`src/components/NewsletterForm.tsx`, démo sans backend). Le hero visuel est généré entièrement en CSS/SVG (bloc doré diagonal + wordmark surdimensionné) — à remplacer par une vraie photo de campagne dès que vous en avez une, en gardant le même conteneur `absolute inset-0`.

## Catalogue produits

Les produits sont dans `src/data/products.ts` (type `Product` défini dans `src/types/product.ts`). Chaque produit a : `slug`, `name`, `category`, `price` (en francs CFA, XOF — formaté par `formatPrice()` dans `src/lib/products.ts`), `colors` (tableau), `sizes`, `shortDescription`, `description`, `images` (tableau de chemins sous `/public/products/<slug>/…`) et un `details` optionnel.

Les photos produit réelles sont affichées via `src/components/ProductImage.tsx` (composant `next/image`) ; si un produit n'a pas encore de photo (`images: []`), il retombe automatiquement sur le visuel placeholder généré en CSS (`ProductVisual.tsx`). Pour ajouter un nouveau produit : dépose ses photos dans `public/products/<slug>/`, puis ajoute une entrée dans `src/data/products.ts`.

Catalogue actuel : 2 polos réels de la collection Polos (Young Rich Papi FC, Golden Era) à 15 000 FCFA chacun, et 2 bonnets réels de la collection Bonnets (Bonnet DIABS 090, Bonnet DIABS 090 — Édition Beige) à 6 000 FCFA chacun.

## Boutique et fiche produit

- `/produits` (`src/app/[locale]/produits/page.tsx` + `src/components/ProductsExplorer.tsx`) : grille produits avec filtres par catégorie et par taille, tri par prix (croissant/décroissant), à partir des données de `src/data/products.ts`.
- `/produits/[slug]` : galerie d'images (`src/components/ProductGallery.tsx`), sélection de taille et de couleur, ajout au panier, description détaillée, section produits similaires.

## Performance

Quelques choix faits spécifiquement pour la vitesse du site :

- **Pages statiques par défaut** : `/`, `/a-propos`, `/contact`, `/panier` et `/produits` sont pré-générées au build et servies depuis le cache (aucun calcul serveur à chaque visite). `/produits` lit la catégorie initiale (`?categorie=...`) côté client via `useSearchParams` (`src/components/ProductsExplorerWithUrlFilter.tsx`, dans un `<Suspense>`) plutôt que côté serveur, justement pour rester statique malgré ce paramètre d'URL.
- **`/produits/[slug]` reste dynamique** (recalculée à chaque visite) : c'est volontaire, pour que le stock affiché (tailles épuisées) soit toujours à jour — voir "Gestion des stocks" ci-dessus.
- **Composants client réduits au strict nécessaire** : seuls les composants qui ont besoin d'interactivité (formulaires, filtres, panier, galerie photo) sont marqués `"use client"` ; tout le reste (pages, mise en page, contenu) est un Server Component, ce qui réduit le JavaScript envoyé au navigateur.
- **Appels réseau critiques jamais mis en cache** : les appels à l'API Paystack (`src/lib/paystack.ts`) sont explicitement en `cache: "no-store"` — un statut de paiement ne doit jamais être servi depuis un cache.
- **Images** : formats modernes (AVIF/WebP), chargement paresseux par défaut, mise en cache longue (31 jours) des versions optimisées — voir "Boutique et fiche produit" et le composant `ProductImage.tsx`.

## SEO

**Où configurer l'URL réelle du site :** toutes les métadonnées ci-dessous (URLs canoniques, sitemap, robots.txt, images de partage) sont construites à partir d'une seule variable, `NEXT_PUBLIC_SITE_URL` (voir `.env.local.example` et `src/lib/site.ts`) — une valeur provisoire (`https://www.dripbydiabs.com`) est utilisée tant qu'elle n'est pas définie. **Mets-la à jour avec le vrai nom de domaine dès que le site est déployé**, sinon les liens partagés sur les réseaux et le sitemap pointeront vers ce nom provisoire.

- **Title, description, Open Graph, Twitter Card** sur chaque page, construits par `src/lib/seo.ts` (`buildMetadata()`) pour rester cohérents sans dupliquer le travail : `/`, `/produits`, `/produits/[slug]`, `/a-propos`, `/contact`. La Twitter Card n'a volontairement pas de titre/description/image répétés à la main : Next.js les complète automatiquement à partir de l'Open Graph de la page (comportement documenté de Next.js).
- **Image de partage par défaut** générée en code (`src/app/[locale]/opengraph-image.tsx`, sans photo requise) aux couleurs de la marque ; les fiches produit utilisent à la place la vraie photo du produit.
- **Pages exclues du référencement** (`robots: { index: false }`) : `/panier` (contenu personnel à chaque visiteur) et `/paiement/confirmation` (page transactionnelle avec référence de commande dans l'URL) — voir `src/app/robots.ts`, qui les bloque aussi explicitement au crawl.
- **`sitemap.xml`** (`src/app/sitemap.ts`) généré à partir du catalogue : toute nouvelle fiche produit y apparaît automatiquement dès qu'elle est ajoutée à `src/data/products.ts`, sans mise à jour manuelle.
- **`robots.txt`** (`src/app/robots.ts`) : autorise tout sauf `/api/`, `/panier` et `/paiement/`, référence le sitemap.
- **Données structurées schema.org (JSON-LD)** : une fiche `Organization` (nom, logo, réseaux sociaux) dans `src/app/[locale]/layout.tsx`, et une fiche `Product` complète (prix, devise XOF, disponibilité en stock, image) sur chaque `/produits/[slug]` (`src/app/[locale]/produits/[slug]/page.tsx`) — la disponibilité (`InStock`/`OutOfStock`) est calculée automatiquement à partir du stock réel. Validable avec le [Rich Results Test de Google](https://search.google.com/test/rich-results).

## Accessibilité

Un audit couvrant contrastes, textes alternatifs, navigation clavier et `aria-label` a été fait et les problèmes trouvés corrigés directement :

- **Contrastes** : le gris `--muted` (texte secondaire) est passé de `#8a8a8a` à `#9e9e9e` (`src/styles/theme.css`) — l'ancienne valeur échouait le seuil WCAG AA (4.5:1) sur les fonds `--surface` et `--surface-2`. Plusieurs bordures et textes semi-transparents utilisés comme seul repère visuel d'un bouton (bouton "Notre histoire" en accueil, champ de la newsletter) avaient aussi une opacité trop faible et ont été relevées.
- **Attributs alt** : déjà corrects partout à l'audit (photos produits avec le nom du produit, vignettes décoratives en `alt=""` quand un bouton porte déjà l'information via `aria-label`, visuels de remplacement en `aria-hidden` quand un texte adjacent identifie le produit).
- **Navigation clavier** : ajout d'un lien d'évitement ("Aller au contenu principal", premier élément focusable de chaque page) et d'un indicateur de focus visible cohérent sur tout le site (`:focus-visible` dans `src/app/globals.css`) — plusieurs champs de formulaire (contact, panier, newsletter, tri de la boutique) supprimaient l'indicateur de focus du navigateur (`outline-none`) sans le remplacer ; chacun a maintenant son propre contour visible au clavier.
- **`aria-label` / annonces** : ajout d'`aria-pressed` manquant sur les boutons de filtre par catégorie (`ProductsExplorer.tsx`), `role="alert"` sur les messages d'erreur des formulaires (contact, paiement), `role="status"` sur les confirmations (message envoyé, inscription newsletter), `aria-live` sur le bouton "Ajouter au panier" (son libellé change en "Ajouté ✓" sans déplacer le focus), libellé du bouton menu mobile qui reflète maintenant son état ("Fermer le menu" une fois ouvert), et mention "(nouvel onglet)" sur les liens WhatsApp/réseaux sociaux qui s'ouvrent dans un nouvel onglet.

## Rapport Lighthouse (Performance 97, Accessibilité/Bonnes pratiques/SEO 100)

Suite à un audit Lighthouse (Performance : 97/100), les points signalés ont été examinés :

- **Corrigé** : les polices de marque (Bebas Neue, Cinzel) sont passées de `@fontsource` (imports CSS classiques) à `next/font/local` (voir "Polices" ci-dessus) — préchargement automatique, police de secours aux métriques ajustées (moins de décalage visuel), et suppression d'une graisse Cinzel (600) chargée mais jamais utilisée nulle part dans le code.
- **Vérifié, non modifié — sans risque réel** : Lighthouse signale ~13 Ko de "JavaScript hérité" (`legacy-javascript`). Il s'agit du script `polyfill-nomodule.js` que Next.js inclut lui-même pour les très vieux navigateurs (marqué `nomodule` dans le HTML) : tout navigateur récent — y compris celui utilisé par Lighthouse — l'ignore et ne le télécharge jamais. C'est un faux positif connu de cet audit sur les projets Next.js, pas un problème réel pour les visiteurs.
- **Probablement lié à l'environnement de test** : "Forced reflow" apparaît souvent quand le rapport est généré avec des extensions Chrome actives plutôt qu'en navigation privée (une extension peut lire/modifier la page pendant le chargement). Aucun code du site ne lit la mise en page de façon synchrone (pas de `getBoundingClientRect`/`offsetWidth` dans les composants). Si ça persiste en navigation privée, ça vaut la peine de relancer l'audit et de nous montrer le détail ("Forced reflow" dans l'onglet Lighthouse → la ligne est cliquable et montre le fichier en cause).
- **Non traité, gain négligeable** : "Reduce unused JavaScript" (~27 Ko) et "Network dependency tree" pointent en grande partie vers le code interne de Next.js/React lui-même (framework, hydratation) plutôt que du code du site — les métriques qui comptent réellement pour l'expérience utilisateur (LCP 2.3 s, TBT 140 ms, CLS 0.042) sont déjà toutes dans le vert.

## Responsive (mobile / tablette / desktop)

Le site a été audité aux trois formats (mobile ~375 px, tablette ~768 px, desktop ~1440 px) sur toutes les pages (accueil, boutique avec filtres, fiche produit, panier, contact, à propos) : menu mobile, formulaires, galerie produit et grilles de cartes s'affichent correctement sans débordement horizontal à aucun de ces formats.

- **Corrigé** : la grille "Pièces phares" de l'accueil et la grille de résultats de la boutique (`ProductsExplorer.tsx`) utilisaient un nombre de colonnes fixe (jusqu'à 4 sur desktop) indépendant du nombre réel de produits affichés. Résultat : dès qu'il y a moins de produits vedettes/filtrés que de colonnes (par exemple les 2 produits actuellement marqués `isFeatured`, ou une catégorie qui ne contient qu'1 ou 2 pièces), les cartes restaient plaquées à gauche avec un grand vide à droite sur les écrans larges. Les deux grilles adaptent maintenant leur nombre de colonnes au nombre de produits affichés (`featuredGridCols` dans `src/app/[locale]/page.tsx`, `filteredGridCols` dans `src/components/ProductsExplorer.tsx`), pour rester équilibrées quel que soit le nombre de résultats.
- **Vérifié, aucun problème trouvé** : en-tête et menu mobile (liens et zone de clic confortables), grilles produits à 2/3/4 colonnes selon le format, bascule fiche produit (galerie + infos empilées jusqu'à `lg`, côte à côte ensuite — comportement voulu), formulaires (contact, panier, newsletter) qui passent d'une colonne à deux selon la largeur, pied de page.

## Revue de code

Une revue complète du code a été faite : lint (`npm run lint`), vérification des types (`tsc --noEmit`) et `npm run build` passent tous les trois sans erreur ni avertissement. La console du navigateur a aussi été vérifiée (chargement de chaque page + interactions : filtres boutique, tri, sélection taille/couleur, ajout au panier, quantité, menu mobile) : aucune erreur, avertissement ni requête en échec.

- **Corrigé — stock pouvant devenir négatif** : `reserveStock` (`src/lib/stock.ts`) vérifiait la disponibilité de chaque ligne de commande indépendamment, contre le même stock de départ. Un produit à plusieurs coloris (ex. "Bonnet DIABS 090") n'a qu'un seul compteur de stock par taille (pas par couleur) : commander la même taille en 2 coloris différents dans le même panier créait 2 lignes qui passaient chacune la vérification isolément, alors que leur somme pouvait dépasser le stock réel — le stock finissait alors négatif après paiement. La quantité est maintenant agrégée par produit + taille avant de vérifier et décrémenter le stock.
- **Corrigé — grille de la section "Vous aimerez aussi"** : sur une fiche produit, cette grille était prévue pour 4 colonnes fixes ; avec le catalogue actuel (2 produits par catégorie), il n'y a toujours qu'un seul produit "apparenté" à afficher, qui se retrouvait donc étiré ou entouré d'un grand vide selon la largeur d'écran. Chaque carte garde maintenant une taille cohérente avec une grille à 4 colonnes, qu'il y ait 1 ou 4 produits apparentés (voir aussi la section "Responsive" ci-dessus pour le même correctif sur les grilles Accueil/Boutique).
- **Supprimé — code mort** : la fonction `getNewProducts()` (`src/lib/products.ts`), qui filtrait les produits marqués `isNew`, n'était appelée nulle part (le badge "Nouveau" affiché sur les cartes lit directement `product.isNew`, sans passer par cette fonction).
- **Corrigé — commentaire trompeur** : la documentation du champ `CartLine.color` (`src/context/cart-context.tsx`) affirmait qu'il valait une chaîne vide pour un produit à un seul coloris ; en pratique `AddToCartPanel` présélectionne toujours le nom réel de l'unique coloris, jamais une chaîne vide. Commentaire corrigé pour refléter le comportement réel.
- **Vérifié, non modifié** : le reste du code (contexte panier, appels Paystack/Resend, génération de métadonnées/JSON-LD, gestion des réservations de stock) a été relu en détail sans trouver d'autre bug ni de code mort.
- **Repéré, hors du champ de cette revue** : le produit "Bonnet DIABS 090" propose 3 coloris (Noir, Blanc, Doré) mais une seule photo existe (`bonnet-090-noir.jpg`) — choisir un autre coloris que Noir affiche donc quand même la photo noire. Corriger ça demande de nouvelles photos par coloris (pas seulement du code) ; fais-le moi savoir si tu veux qu'on mette ça en place dès que les photos sont disponibles.

## État actuel

- Catalogue produits en dur dans `src/data/products.ts` (à remplacer par un CMS / une base de données / Shopify, etc. quand vous serez prêts).
- Visuel hero : placeholder généré en CSS (`src/components/HeroVisual.tsx`) en attendant une vraie photo de campagne.
- Newsletter : UI et logique front fonctionnelles mais sans backend branché (aucun e-mail stocké).
- Formulaire de contact : envoie un vrai e-mail à la marque via Resend — voir "Formulaire de contact (Resend)" ci-dessus pour la configuration de la clé API.
- SEO : métadonnées, sitemap, robots.txt et données structurées en place — voir "SEO" ci-dessus. **Pense à définir `NEXT_PUBLIC_SITE_URL` avec le vrai nom de domaine avant/au moment du déploiement.**
- Paiement en ligne (Paystack), commande WhatsApp et commande e-mail : fonctionnels — voir "Paiement en ligne (Paystack)" ci-dessus pour la configuration de la clé API.
- Stock par produit/taille dans `data/stock.json`, décrémenté/relâché automatiquement autour d'un paiement Paystack — voir "Gestion des stocks" ci-dessus. Les commandes WhatsApp/e-mail demandent une mise à jour manuelle du fichier.

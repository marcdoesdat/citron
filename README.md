# Alex Diotte Photographie

Site web de photographe (portrait et événementiel), construit avec [Astro](https://astro.build) 6 en mode statique et [Tailwind CSS](https://tailwindcss.com) 4, déployé sur Netlify.

## Prérequis

Node.js 22.12 ou plus récent (voir `engines` dans `package.json`).

## Commandes

| Commande | Action |
|---|---|
| `npm install` | Installe les dépendances (`npm ci` pour une installation à l'identique du `package-lock.json`) |
| `npm run dev` | Serveur de développement sur `http://localhost:4321` |
| `npm run build` | Génère le site dans `dist/` |
| `npm run preview` | Sert le contenu de `dist/` en local (lancer `build` d'abord) |
| `npm run check` | Vérification des types et des composants Astro |
| `npm run brand` | Régénère les icônes et l'image de partage (voir « Icônes et image de partage ») |

Le premier `build` après l'ajout de photos est plus long : les images sont optimisées (AVIF, WebP) puis mises en cache dans `node_modules/.astro`.

## Déploiement

Le site est déployé sur Netlify (`netlify.toml` : commande `npm run build`, dossier publié `dist`, Node 22). Chaque push sur la branche de production redéploie le site.

`netlify.toml` définit aussi les en-têtes HTTP (sécurité et cache long pour `/_astro/*`). Ils ne s'appliquent qu'une fois déployé : `npm run preview` les ignore.

Le formulaire de contact est géré par Netlify Forms (`data-netlify` dans `src/pages/contact.astro`), puis redirige vers `/merci/`. Les demandes arrivent dans le tableau de bord Netlify ; la notification par courriel se configure là-bas, pas dans le code.

## Modifier le contenu

### Ajouter ou retirer une photo du portfolio

1. Déposer le fichier JPEG dans `src/assets/portfolio/`. N'y mettre que des photos du portfolio : toute image de ce dossier est traitée au build.
2. Ajouter une entrée dans le tableau `photos` de `src/data/photos.ts` : `file` (nom du fichier), `category`, `alt` (description pour les lecteurs d'écran), `caption` (légende), `shotAt` (`AAAA-MM-JJTHH:MM`), `shutter`, `iso` et, si on veut, `lieu`.

L'ordre du tableau est l'ordre d'affichage et fixe le numéro de planche (01, 02, …). Les dimensions sont lues dans le fichier. La même source alimente la page Portfolio, sa visionneuse plein écran et les quatre photos tirées au hasard sur l'accueil.

Les catégories sont `Portrait` et `Événementiel` (type `Category` dans `photos.ts`). Pour en ajouter une, l'ajouter à ce type et à la liste `categories` de `src/pages/portfolio.astro`, qui produit les boutons de filtre.

Pour retirer une photo, supprimer son entrée et son fichier.

### Photo de couverture et photo de bio (accueil)

- Couverture : deux fichiers sources dans `src/assets/hero/`, cadrés à la main — `hero.jpg` (16:9, 2400×1350, écrans larges) et `hero-mobile.webp` (vertical, 900×1600, écrans de moins de 768 px). Ils sont importés dans `src/pages/index.astro` et déclinés au build en AVIF et WebP à plusieurs largeurs. Pour changer la photo, remplacer ces deux fichiers en gardant leurs noms et leurs proportions ; avec des dimensions différentes, ajuster les listes `HERO_WIDTHS` et `HERO_MOBILE_WIDTHS` et les attributs `width`/`height` de la balise `<picture>`. `hero.jpg` sert aussi de base à l'image de partage (voir plus bas).
- Photo de bio : `src/assets/alex-diotte.jpg`, importée dans `src/pages/index.astro` (optimisée au build). Le texte de la bio est dans le même fichier.

### Modifier un prix ou un forfait

Dans `src/data/services.ts`, les forfaits sont répartis en trois familles : `portraitRaw`, `eventRaw` et `corporateRaw`. Chaque forfait a un `title`, un `amount` (nombre, en dollars canadiens) ou un `priceLabel` (texte, quand il n'y a pas de montant), `showStartingFrom`, `description`, `features`, etc.

- Changer un prix : modifier `amount` à un seul endroit. Il se répercute sur la page Services, sur les cartes de l'accueil et sur les données structurées (SEO) des pages.
- Les forfaits marqués `featured: true` s'affichent aussi en carte sur l'accueil, avec leur `summary`.
- La FAQ de la page Services est le tableau `faq` du même fichier.

### Modifier les coordonnées

Dans `src/data/site.ts` : nom du site, nom de la personne, courriel (`email`), téléphone (`phone` et `phoneE164`), ville affichée (`city`), Instagram (`instagram.handle` et `instagram.url`), YouTube (`youtube`), titre et description de l'accueil. Ces valeurs alimentent l'en-tête, le pied de page, la page Contact, les mentions légales, la section Instagram et les données structurées.

Les textes des pages (accueil, mentions légales, politique de confidentialité) restent dans leurs fichiers de `src/pages/`.

### Publications Instagram de l'accueil

Les trois publications intégrées sont la liste `posts` passée à `<InstagramFeed>` dans `src/pages/index.astro` (adresses publiques des publications). Le script d'Instagram ne se charge que lorsque la section approche de l'écran ; tant qu'il n'est pas chargé, ou s'il est bloqué, chaque publication s'affiche comme un lien « Voir cette publication sur Instagram ».

### Changer de domaine

Mettre à jour l'adresse à trois endroits : `site` dans `astro.config.mjs`, `url` dans `src/data/site.ts` et la ligne `Sitemap:` de `public/robots.txt`. Régénérer ensuite le site.

## Couleurs et polices

Dans `src/styles/global.css`, bloc `@theme` : `--color-ink` (fond), `--color-surface`, `--color-fg` (texte), `--color-muted`, `--color-subtle`, `--color-line` (bordures) et `--color-citron` (l'accent, `#e4ff1a`). Dans les composants, ces couleurs s'utilisent avec les classes Tailwind (`text-citron`, `bg-ink`, `border-line`, etc.).

Les polices (Anton, Inter, JetBrains Mono) sont hébergées avec le site via les paquets `@fontsource` : aucune requête vers un service tiers.

## Icônes et image de partage

`npm run brand` exécute `scripts/generate-brand-assets.mjs` et écrit dans `public/` : `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` et `og-default.jpg` (1200×630, utilisée pour l'aperçu des liens partagés). Le favicon est un citron sur une tuile sombre ; l'image de partage reprend `src/assets/hero/hero.jpg` avec le logo ruban. Les fichiers générés sont versionnés : relancer le script seulement si la marque ou la photo de couverture change, puis commiter le résultat.

`public/site.webmanifest` décrit le site pour les navigateurs (nom, icônes, couleur de thème).

## Structure du projet

```
.
├── astro.config.mjs        # URL du site, barres obliques finales, plan du site
├── netlify.toml            # Build, version de Node, en-têtes HTTP
├── scripts/
│   └── generate-brand-assets.mjs   # npm run brand
├── public/                 # Servi tel quel : icônes, manifeste, robots.txt,
│                           # image de partage
└── src/
    ├── assets/
    │   ├── alex-diotte.jpg # Photo de bio
    │   ├── hero/           # Photo de couverture (sources bureau et mobile)
    │   └── portfolio/      # Photos du portfolio (optimisées au build)
    ├── components/
    │   ├── Button.astro
    │   ├── Footer.astro
    │   ├── Header.astro    # Navigation et menu mobile
    │   ├── InstagramFeed.astro
    │   ├── Logo.astro
    │   ├── PhotoGallery.astro   # Grille du portfolio + liens vers les grandes images
    │   ├── SEO.astro       # Balises meta et données structurées
    │   ├── ServiceCard.astro
    │   └── SwipeGallery.astro   # Aperçu de l'accueil (4 photos au hasard)
    ├── data/
    │   ├── photos.ts       # Photos du portfolio
    │   ├── services.ts     # Forfaits et FAQ
    │   └── site.ts         # Nom, coordonnées, réseaux
    ├── layouts/
    │   └── Layout.astro    # Structure HTML commune à toutes les pages
    ├── pages/
    │   ├── index.astro     # Accueil
    │   ├── portfolio.astro # Portfolio, filtres et visionneuse plein écran
    │   ├── services.astro
    │   ├── contact.astro
    │   ├── merci.astro     # Confirmation après envoi du formulaire (hors plan du site)
    │   ├── mentions-legales.astro
    │   ├── politique-de-confidentialite.astro
    │   └── 404.astro
    └── styles/
        └── global.css      # Thème, couleurs, polices
```

## Bon à savoir

- **Liens internes** : le site utilise des barres obliques finales (`trailingSlash: 'always'`). Écrire `/portfolio/`, pas `/portfolio`.
- **Images** : pour qu'une image soit optimisée, il faut l'importer depuis `src/` (ou la charger via `src/assets/portfolio/` comme le fait `photos.ts`). Une image référencée par un chemin texte vers `public/` est servie telle quelle, sans optimisation.
- **Visionneuse du portfolio** : PhotoSwipe, initialisée dans `src/pages/portfolio.astro`. Les grandes versions (WebP, 2000 px) sont générées au build dans `PhotoGallery.astro`. Son module principal ne se télécharge qu'au premier clic sur une photo.
- **Plan du site** : généré par `@astrojs/sitemap` au build (`sitemap-index.xml`), sans la page `/merci/`.

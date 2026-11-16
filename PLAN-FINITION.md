# Plan de finition — site Alex Diotte Photographie

Document de passation destiné à l'agent qui exécutera le travail. Il se lit seul :
tout le contexte nécessaire est ici. Audit réalisé le 2026-11-16 sur le commit `4600920`
(branche `main`), par build local et mesures dans un navigateur sans tête.

## 1. Mission

Le site (Astro 6 statique + Tailwind 4, déployé sur Netlify à
`https://citronphoto.netlify.app`) est visuellement abouti, mais il lui manque la couche
de finition. Le propriétaire du dépôt (Marc) a signalé l'absence de favicons et demande
tout ce qu'il faut pour que le site soit « 100 % sur la coche ».

L'audit a trouvé un problème bien plus grave que les favicons : **les photos sont servies
en pleine résolution, sans aucune optimisation**. La page Portfolio pèse 260 Mo. C'est la
priorité absolue, avant tout le reste.

Le résultat attendu : même apparence, même ton, mêmes contenus — mais un site rapide,
correctement référencé, accessible au clavier, avec une identité complète (icônes, image
de partage) et un dépôt propre.

## 2. Règles de travail

- **Ne pas toucher à l'identité visuelle ni aux textes** (couleurs, typographies, mise en
  page, formulations) au-delà de ce que ce plan demande explicitement. Le design est validé.
- **Ne rien inventer** : pas de témoignages, de noms de clients, d'adresse, de mentions
  juridiques factuelles non confirmées. Ce qui demande une information réelle est listé en
  section 6 avec une valeur par défaut à appliquer en attendant.
- **Un commit par lot**, message clair en français. Après chaque lot :
  `npm run check && npm run build`, puis vérifier le critère d'acceptation du lot.
- **Ne pas réécrire l'historique git**, ne pas forcer de push, ne pas ouvrir de pull request
  sans que Marc le demande.
- Exécuter les lots **dans l'ordre** : les premiers débloquent les suivants.
- Le site en ligne n'est pas forcément joignable depuis un environnement cloud (il ne
  l'était pas pendant l'audit). Tout vérifier en local avec `npm run build && npm run preview`.
  Ce qui dépend de Netlify (formulaire, en-têtes HTTP, redirections) ne peut être confirmé
  qu'après déploiement : le signaler à Marc dans le compte rendu final plutôt que de le
  déclarer vérifié.
- Rester sur Astro 6.x : pas de montée de version majeure dans ce chantier.

## 3. État mesuré et cibles

Mesures prises sur le build local, navigateur sans tête, défilement complet de la page.
La colonne « Cible » correspond à ce qu'un prototype jetable a réellement atteint avec les
techniques décrites plus bas — ces chiffres sont donc atteignables, pas théoriques.

| Mesure | Avant | Cible |
|---|---|---|
| Portfolio, poids total transféré | **259,9 Mo** | ≤ 2 Mo (prototype : 1,3 Mo mobile, 0,33 Mo bureau) |
| Accueil, poids total (hors Instagram) | **79 Mo** bureau / **51 Mo** mobile | ≤ 1 Mo (prototype : 0,45 / 0,64 Mo) |
| Photo la plus lourde servie | 33 Mo (6000 px, affichée à ~320 px) | ≤ ~300 Ko |
| Taille de `dist/` | 251 Mo | ≤ 40 Mo (prototype : 19 Mo) |
| `og:image` (`/og-default.jpg`) | 404 sur toutes les pages | 200, 1200×630 |
| Favicons | 1 SVG hors marque, rien d'autre | jeu complet aux couleurs de la marque |
| État actif du menu sur Portfolio / Services / Contact | absent (0 `aria-current`) | présent |
| Liens du menu mobile atteignables au clavier menu fermé | 6 | 0 |
| Requêtes vers Google Fonts | sur chaque page | 0 |
| `sitemap`, `robots.txt`, page 404, page de remerciement | absents | présents |
| Fichiers suivis par git dans `node_modules/`, `dist/`, `.astro/` | 13 437 / 34 / 6 | 0 |

## 4. Pièges déjà rencontrés pendant l'audit

Chacun de ces points a coûté un essai. Les connaître évite de les redécouvrir.

1. **`<Image src="/images/…">` avec un chemin texte vers `public/` n'optimise rien.**
   Astro ne traite que les images *importées* depuis `src/`. C'est la cause racine du poids
   actuel : le build ne génère aucune image (il dure 1,5 s).
2. **`<Picture>` sans prop `width` produit un JPEG de secours en pleine résolution**
   (2 à 4 Mo par photo, `dist/` à 55 Mo). Toujours fixer `width`.
3. **Utiliser `image.src` d'une image importée dans un `<img>` brut recopie l'original dans
   `dist/`** (essai : `dist/` remonté à 267 Mo). Toujours passer par `<Image>`, `<Picture>`
   ou `getImage()`.
4. **Une image attrapée par `import.meta.glob` mais jamais rendue reste dans `dist/` en
   version originale.** Ne mettre dans `src/assets/portfolio/` que les photos du portfolio.
5. **L'API `fonts` d'Astro avec un fournisseur distant échoue en silence** quand le réseau
   de build est restreint : le build réussit avec un simple avertissement
   (`No data found for font family`) et le site sort sans ses polices. Utiliser les paquets
   npm `@fontsource` (lot 2), déterministes et hors ligne.
6. **Le `node_modules/` suivi par git ne contient que des binaires Windows**
   (`esbuild.exe`, `rollup-win32-*`, `sharp-win32-x64`). Sous Linux, le build ne peut pas
   fonctionner tant que `rm -rf node_modules && npm ci` n'a pas été lancé. Le
   `package-lock.json` est sain : `npm ci` passe sous Linux.
7. **`opentype.js` lit le `.woff`, pas le `.woff2`.**
8. Le premier build avec optimisation des images dure environ une minute ; les suivants
   quelques secondes grâce au cache dans `node_modules/.astro`.
9. Astro 6 exige Node ≥ 22.12.

---

## 5. Les lots

Priorités : **P0** = bloquant, **P1** = important, **P2** = finition.

### Lot 0 — Assainir le dépôt (P0, prérequis)

**Constat.** Pas de `.gitignore`. `node_modules/` (13 437 fichiers), `dist/` et `.astro/`
sont suivis par git. C'est ce qui a imposé le contournement
`node ./node_modules/astro/bin/astro.mjs` dans les scripts npm (commit `3799b94`). Le paquet
s'appelle encore `sophie-moreau-photographie`, vestige du gabarit d'origine.
`src/components/Header.astro` commence par un BOM UTF-8 (`EF BB BF`).

**À faire.**
1. Créer `.gitignore` : `node_modules/`, `dist/`, `.astro/`, `.netlify/`, `.env`, `.env.*`,
   `.DS_Store`, `npm-debug.log*`.
2. `git rm -r --cached --quiet node_modules dist .astro` (retire de l'index, pas du disque).
3. `rm -rf node_modules && npm ci`.
4. `package.json` :
   - `name` → `alex-diotte-photographie` ;
   - scripts → `"dev": "astro dev"`, `"build": "astro build"`, `"preview": "astro preview"`,
     `"check": "astro check"` ;
   - ajouter `"engines": { "node": ">=22.12.0" }` ;
   - déplacer `@astrojs/check` et `typescript` dans `devDependencies`.
5. `netlify.toml` : ajouter `[build.environment]` avec `NODE_VERSION = "22"`.
6. Retirer le BOM en tête de `Header.astro`.
7. Supprimer dans `astro.config.mjs` le commentaire « NOTE : en production… picsum », devenu faux.

**Hors périmètre.** L'historique git gardera environ 300 Mo d'anciens objets. Le purger
exige une réécriture d'historique et un push forcé sur `main` : décision de Marc, à ne pas
faire ici.

**Acceptation.** `git ls-files | grep -c -E '^(node_modules|dist|\.astro)/'` renvoie `0` ;
`npm ci && npm run check && npm run build` passent.

### Lot 1 — Optimiser les images (P0)

**Constat.** 23 JPEG de 1,8 à 33 Mo (jusqu'à 6000×4000) dans `public/images/portfolio/`,
servis tels quels et affichés à 240–340 px de large. `PhotoGallery.astro` utilise
`<Image>` avec un chemin texte (piège 1) ; `SwipeGallery.astro` utilise des `<img>` bruts
et rend en plus chaque photo deux fois (un rail mobile et une grille bureau). La photo de
bio de l'accueil fait 1,8 Mo. `public/alex-bio.jpg` n'est référencé nulle part.

**À faire.**

1. Déplacer les fichiers (avec `git mv`) :
   - `public/images/portfolio/AlexDiotteBlackandWhite.jpg` → `src/assets/alex-diotte.jpg`
     (hors du dossier portfolio, voir piège 4) ;
   - le reste de `public/images/portfolio/` → `src/assets/portfolio/` ;
   - supprimer `public/alex-bio.jpg`.

2. `src/data/photos.ts` : résoudre chaque fichier en image importée. Retirer les champs
   `width` et `height` de l'interface et des 22 entrées (Astro les lit dans le fichier),
   et retirer `photoSrc`. Ajout testé :

   ```ts
   import type { ImageMetadata } from 'astro';

   const files = import.meta.glob<{ default: ImageMetadata }>(
     '../assets/portfolio/*.{jpg,jpeg,png,webp}',
     { eager: true },
   );

   /** Image source (optimisée par astro:assets) à partir du nom de fichier */
   export const photoImage = (file: string): ImageMetadata => {
     const mod = files[`../assets/portfolio/${file}`];
     if (!mod) throw new Error(`Photo introuvable dans src/assets/portfolio : ${file}`);
     return mod.default;
   };
   ```

3. `src/components/PhotoGallery.astro` : `src` devient un `ImageMetadata` ; supprimer
   `TARGET_WIDTH` et `targetDims`. La branche « grille » (non masonry) et la prop `columns`
   ne servent nulle part : les supprimer. Balise testée :

   ```astro
   <Picture
     src={img.src}
     alt={img.alt}
     width={800}
     widths={[400, 800, 1200]}
     sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
     formats={['avif', 'webp']}
     loading={i === 0 ? 'eager' : 'lazy'}
     decoding="async"
     fetchpriority={i === 0 ? 'high' : undefined}
     class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
   />
   ```

   Vérifier que les classes atterrissent bien sur l'`<img>` (sinon utiliser `pictureAttributes`).

4. `src/components/SwipeGallery.astro` : une seule liste, qui est un rail à défilement sur
   mobile et une grille à partir de `md`. Le recadrage 4:5 se fait au build (`fit="cover"`),
   sinon les photos horizontales seraient floues dans un cadre vertical. Les points de
   navigation passent à une zone tactile de 24 px (ils faisaient 10 px). Dans l'en-tête du
   composant, importer `Image` depuis `astro:assets` et typer `src` en `ImageMetadata`.
   Gabarit testé, qui remplace les deux blocs actuels (rail mobile + grille bureau) :

   ```astro
   <div id={galleryId} class="-mx-6 px-6 md:mx-0 md:px-0">
     <div
       class="swipe-gallery-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0"
       data-swipe-rail
     >
       {images.map((image) => (
         <figure class="snap-center shrink-0 w-[85vw] md:w-auto" data-swipe-item>
           <Image
             src={image.src}
             alt={image.alt}
             width={640}
             height={800}
             fit="cover"
             widths={[320, 640, 960]}
             sizes="(min-width: 1024px) 240px, (min-width: 768px) 50vw, 85vw"
             loading="lazy"
             decoding="async"
             class="w-full aspect-[4/5] object-cover"
           />
           {image.caption && (
             <figcaption class="mt-3 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.06em]">
               <span class="text-fg">{image.caption}</span>
               {image.meta && <span class="shrink-0 text-subtle">{image.meta}</span>}
             </figcaption>
           )}
         </figure>
       ))}
     </div>

     <div class="flex items-center justify-center pt-2 md:hidden" data-swipe-dots>
       {images.map((_, index) => (
         <button
           type="button"
           class="group grid h-6 w-6 place-items-center"
           data-swipe-dot={index}
           aria-label={`Voir la photo ${index + 1}`}
           aria-current={index === 0 ? 'true' : 'false'}
         >
           <span class={`block h-2.5 w-2.5 transition-colors duration-200 ${index === 0 ? 'bg-citron' : 'bg-subtle'}`}></span>
         </button>
       ))}
     </div>
   </div>
   ```

   Dans le script du composant : supprimer le bloc « Desktop : cacher les figures non
   choisies » (il n'y a plus de grille séparée) et, dans `setActiveDot`, basculer les
   classes `bg-citron` / `bg-subtle` sur `dot.firstElementChild` au lieu de `dot`.
   Le comportement (4 photos tirées au hasard côté client) ne change pas.

5. `src/pages/index.astro` :
   - `previewImages` utilise `photoImage(p.file)` ;
   - la photo de bio passe par un import :
     `import alexPortrait from '../assets/alex-diotte.jpg';` puis
     `<Image src={alexPortrait} width={600} height={800} fit="cover" widths={[400, 600, 900, 1200]} sizes="(min-width: 768px) 480px, 100vw" …>`.
     Le fichier est en 2:3 (3269×4892) mais l'affichage actuel le recadre en 3:4 :
     `fit="cover"` conserve ce rendu.

6. `src/pages/portfolio.astro` : passer `photoImage(p.file)` au lieu de `photoSrc(p)` et
   retirer `width` / `height` de l'objet.

7. **Image de couverture : ne pas y toucher.** `hero.webp` (276 Ko) et `hero-mobile.webp`
   (172 Ko) sont déjà raisonnables et le cadrage est réglé à la main.

**Acceptation.**
- `du -sh dist` ≤ 40 Mo ; `find dist -type f -size +1M` ne renvoie rien.
- Le journal de build affiche l'étape `generating optimized images`.
- Portfolio : ≤ 2 Mo transférés après défilement complet en émulation mobile ; les images
  chargées sont en AVIF.
- Accueil : 4 photos visibles dans la galerie, sur une seule rangée en bureau (1440 px),
  en rail défilant avec 4 points de 24 px en mobile ; aucun débordement horizontal.
- Comparer visuellement avant/après. Neuf fichiers portent un profil ProPhoto RGB
  (`sharp` les convertit en sRGB) : vérifier que leurs couleurs ne sortent ni ternes ni
  saturées. Elles étaient correctes sur le prototype.

### Lot 2 — Auto-héberger les polices (P1)

**Constat.** Anton, Inter et JetBrains Mono viennent de Google Fonts, chargées en différé
(`preload` + `onload`). Conséquences : une requête vers un tiers sur chaque page (l'adresse
IP du visiteur part chez Google — un point de plus à couvrir dans la politique de
confidentialité), et un saut visible : les grands titres s'affichent d'abord en Arial ou
Impact, puis basculent en Anton, beaucoup plus étroite.

**À faire** (approche testée, voir piège 5).
1. `npm i @fontsource/anton @fontsource-variable/inter @fontsource-variable/jetbrains-mono`
2. `src/styles/global.css`, juste après `@import "tailwindcss";` :
   ```css
   @import "@fontsource/anton/latin-400.css";
   @import "@fontsource-variable/inter/wght.css";
   @import "@fontsource-variable/jetbrains-mono/wght.css";
   ```
   et dans `@theme`, les familles variables portent un autre nom :
   ```css
   --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
   --font-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
   ```
   (`--font-display` ne change pas.)
3. `src/layouts/Layout.astro` : supprimer les deux `preconnect`, le `preload` Google et le
   bloc `<noscript>`. Précharger les deux polices visibles dès le premier écran :
   ```astro
   ---
   import antonWoff2 from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
   import interWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
   ---
   <link rel="preload" as="font" type="font/woff2" href={antonWoff2} crossorigin />
   <link rel="preload" as="font" type="font/woff2" href={interWoff2} crossorigin />
   ```

**Acceptation.** `grep -rc "fonts.googleapis.com\|fonts.gstatic.com" dist --include=*.html`
donne 0 partout ; des `.woff2` existent dans `dist/_astro/` ; dans le navigateur, aucun hôte
externe n'est contacté sur Services et Contact ; les titres sont bien en Anton, y compris
les capitales accentuées (« ÉVÉNEMENT »).

### Lot 3 — Favicons, manifeste et image de partage (P0 — demande explicite de Marc)

**Constat.** Le seul favicon est `public/favicon.svg` : un objectif gris (`#94a3b8` sur
`#171717`) hérité du gabarit, sans rapport avec la marque citron. Aucun `favicon.ico`,
aucune icône Apple, aucun manifeste, pas de `theme-color`. Et `/og-default.jpg`, référencé
par `og:image`, `twitter:image` et le JSON-LD de toutes les pages, n'existe pas : un lien
partagé sur Messenger, iMessage, LinkedIn ou Slack s'affiche sans aperçu.

**Direction retenue.** Monogramme « AD » en Anton, encre `#0a0a0a` sur fond citron
`#e4ff1a` — le logo ruban réduit à l'essentiel. Vérifié lisible à 16 px. L'image de partage
reprend la photo de couverture, assombrie en bas, avec le logo ruban et la mention
« Photographe et vidéaste · Montréal ».

**À faire.**
1. `npm i -D opentype.js` (`@fontsource/anton` est déjà là depuis le lot 2).
2. Créer `scripts/generate-brand-assets.mjs` avec le contenu de l'**annexe A** (script
   testé tel quel), ajouter le script npm `"brand": "node scripts/generate-brand-assets.mjs"`,
   lancer `npm run brand`. Il écrit dans `public/` : `favicon.svg` (remplace l'ancien),
   `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`,
   `icon-maskable-512.png`, `og-default.jpg` (1200×630, ~90 Ko). Commiter les fichiers générés.
3. Créer `public/site.webmanifest` :
   ```json
   {
     "name": "Alex Diotte Photographie",
     "short_name": "Alex Diotte",
     "lang": "fr-CA",
     "start_url": "/",
     "display": "browser",
     "background_color": "#0a0a0a",
     "theme_color": "#0a0a0a",
     "icons": [
       { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
       { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
     ]
   }
   ```
4. `Layout.astro`, à la place de la ligne `<link rel="icon" …>` actuelle :
   ```html
   <link rel="icon" href="/favicon.ico" sizes="32x32" />
   <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   <meta name="theme-color" content="#0a0a0a" />
   ```
5. `SEO.astro` : ajouter `og:image:width` (1200), `og:image:height` (630), `og:image:alt`
   et `twitter:image:alt`.

**Acceptation.** Les sept fichiers et le manifeste sont dans `dist/` ; chaque URL référencée
dans le `<head>` répond 200 en prévisualisation ; ouvrir `og-default.jpg` et les icônes
pour un contrôle visuel (texte net, rien de coupé) ; l'onglet du navigateur montre le
monogramme citron.

### Lot 4 — URL, référencement et données structurées (P1)

**Constat.**
- **Menu : l'état actif ne fonctionne qu'en accueil.** `Header.astro` compare
  `Astro.url.pathname` (`/portfolio/` au build) à `href` (`/portfolio`). Résultat mesuré :
  0 `aria-current="page"` sur Portfolio, Services et Contact.
- Les URL canoniques finissent par `/`, les liens internes non : chaque clic interne mène
  à une URL différente de la canonique.
- Titre de l'accueil : « Photographe Professionnelle | Alex Diotte Photographie » —
  générique, et au féminin alors que le reste du site écrit « photographe professionnel ».
- JSON-LD : prix faux (199 et 299 $, alors que les forfaits sont à 150, 300, 450, 600 $…),
  une offre « Photographie de mariage » qui n'existe pas dans les services, un champ
  `description` qui change selon la page, une `image` en 404.
- `og:type` vaut `business.business` (non standard). `lang="fr"` au lieu de `fr-CA`.
- Ni `sitemap`, ni `robots.txt`.
- Le courriel est écrit en dur à 5 endroits, le téléphone et les réseaux à plusieurs autres ;
  les prix sont dupliqués entre `index.astro` et `services.astro`.

**À faire.**
1. **Sources uniques de données.**
   - `src/data/site.ts` : nom du site, nom de la personne, URL, courriel, téléphone (affiché
     et E.164), ville affichée, Instagram (identifiant + URL), YouTube. Remplacer les valeurs
     en dur dans `Header`, `Footer`, `InstagramFeed`, `SEO`, `contact.astro`,
     `mentions-legales.astro`.
   - `src/data/services.ts` : y déplacer `portraitServices`, `eventServices`,
     `corporateServices` et `faq` depuis `services.astro`. Ajouter à chaque forfait un
     montant numérique optionnel (`amount`) et, pour les trois forfaits `featured`, le court
     résumé affiché en accueil. Les trois cartes de l'accueil se génèrent à partir de ces
     forfaits `featured` (ce sont exactement ceux affichés aujourd'hui : Forfait de base
     150 $, Forfait 6h 450 $, Forfait Banque d'images 550 $ « à partir de »).
2. **Barres obliques finales.** Dans `astro.config.mjs` : `trailingSlash: 'always'`. Mettre
   à jour tous les liens internes : `/portfolio/`, `/services/`, `/contact/`,
   `/mentions-legales/` (dans `Header`, `Footer`, `ServiceCard`, `index.astro`,
   `portfolio.astro`, `services.astro`). `/` et `/#instagram` ne changent pas. La comparaison
   du menu fonctionne alors telle quelle.
3. **Plan du site.** `npm i @astrojs/sitemap`, puis
   `integrations: [sitemap({ filter: (page) => !page.includes('/merci/') })]`
   (testé avec Astro 6.1.5 : génère `sitemap-index.xml`). Créer `public/robots.txt` :
   ```
   User-agent: *
   Allow: /

   Sitemap: https://citronphoto.netlify.app/sitemap-index.xml
   ```
4. **`SEO.astro`.**
   - Nouvelle prop `noindex?: boolean` (→ `<meta name="robots" content="noindex, follow">`),
     relayée par `Layout`.
   - Permettre un titre complet imposé ; accueil :
     `Alex Diotte | Photographe et vidéaste à Montréal` (formulation épicène, reprise du
     `<h1>` existant).
   - `og:type` → `website`.
   - JSON-LD : `description` fixe (celle de l'accueil), `@id` stable
     (`${siteUrl}#business`), ajouter `email` et `logo` (`/icon-512.png`). Générer
     `hasOfferCatalog` à partir de `services.ts` (forfaits qui ont un `amount`) au lieu des
     valeurs en dur — l'offre mariage sans prix disparaît donc du JSON-LD.
   - Ajouter `is:inline` sur la balise `<script type="application/ld+json">`
     (supprime l'avertissement d'`astro check`).
5. `Layout.astro` : `<html lang="fr-CA">`.

**Acceptation.** `aria-current="page"` présent une fois dans chaque navigation de
`dist/{portfolio,services,contact}/index.html` ; `dist/sitemap-index.xml` et
`dist/robots.txt` existent ; plus aucun `href="/portfolio"` sans barre finale dans `dist/` ;
le JSON-LD de chaque page est un JSON valide, identique d'une page à l'autre, avec les prix
réels ; `npm run check` sans erreur ni avertissement.

### Lot 5 — Menu mobile et accessibilité (P1)

**Constat (testé au clavier, viewport iPhone).**
- Menu fermé : les 6 liens du panneau restent dans l'ordre de tabulation. Le panneau est
  masqué par `opacity: 0`, donc le focus disparaît à l'écran pendant 6 pressions de Tab.
- Menu ouvert : Échap ne ferme pas ; la page défile derrière le panneau ; le hamburger ne
  se transforme pas en croix (le commentaire l'annonce, aucun style ne le fait) ; la case à
  cocher n'expose ni nom ni état ouvert/fermé aux lecteurs d'écran.
- Accueil : les trois cartes de forfaits sont des `<div>` cliquables en JavaScript — pas
  atteignables au clavier, pas annoncées comme des liens.
- Champs du formulaire : `focus:outline-none` retire le contour de focus global au profit
  d'un simple changement de couleur d'une bordure de 1 px.

Ce qui est déjà bon et ne doit pas bouger : lien d'évitement, hiérarchie des titres (aucun
saut de niveau), textes alternatifs, contrastes, `prefers-reduced-motion`.

**À faire.**
1. **Menu mobile** (`Header.astro`). Remplacer la case à cocher par un vrai bouton :
   - `<button type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Ouvrir le menu">`
     avec les trois barres ; à l'ouverture, `aria-expanded="true"`, libellé « Fermer le menu »,
     et les barres forment une croix ;
   - panneau fermé : `visibility: hidden` en plus de l'opacité (transition sur
     `opacity, visibility`), ce qui sort les liens de l'ordre de tabulation ;
   - à l'ouverture : bloquer le défilement de la page (`overflow: hidden` sur `<html>`) et
     rendre `<main>` et `<footer>` `inert` ; tout rétablir à la fermeture ;
   - Échap ferme et rend le focus au bouton ; un clic sur un lien ferme (déjà le cas) ;
     passer au-dessus de 768 px ferme.
   Sans JavaScript, la navigation reste disponible dans le pied de page.
2. **Cartes de forfaits** (`index.astro`) : chaque carte devient un
   `<a href="/services/" class="service-card-item block …">`. Supprimer le `<script>` de fin
   de page. Le voile « en savoir plus » s'affiche aussi sur `:focus-visible`.
3. **Champs de formulaire** (`contact.astro`) : retirer `focus:outline-none` des `input`,
   `select` et `textarea` pour laisser agir le contour citron global.

**Acceptation.** En viewport mobile : Tab depuis le haut de page ne passe par aucun lien de
`#mobile-nav` tant que le menu est fermé ; menu ouvert, Échap le ferme et la molette ne fait
pas défiler la page ; les barres forment une croix. En bureau : les trois cartes de forfaits
sont atteignables au Tab et s'activent avec Entrée.

### Lot 6 — Formulaire de contact (P1)

**Constat.** Après l'envoi, le visiteur tombe sur la page de confirmation générique de
Netlify, en anglais et hors charte. Deux champs ont un accent dans leur `name` et leur `id`
(`budget-estimé`), source d'ennuis dans les exports et notifications. Rien n'empêche de
choisir une date passée.

**À faire.**
1. Ajouter `action="/merci/"` au `<form>`. Conserver `data-netlify`, le champ caché
   `form-name` et le pot de miel tels quels.
2. Créer `src/pages/merci.astro` (prop `noindex`) : titre « Message envoyé », une phrase
   confirmant une réponse sous 24 h (c'est l'engagement déjà affiché), liens vers le
   portfolio et l'accueil. Même gabarit visuel que les autres pages.
3. Renommer `budget-estimé` → `budget-estime` (`id`, `name` et `for` du libellé).
4. Fixer la date minimale à aujourd'hui :
   `document.getElementById('date').min = new Date().toLocaleDateString('en-CA');`
5. Sous le bouton, faire pointer la phrase sur les données personnelles vers la politique
   de confidentialité (lot 7).

**Acceptation.** `dist/merci/index.html` existe, contient `noindex` et n'apparaît pas dans
le plan du site ; le HTML du formulaire contient `action="/merci/"`. L'envoi réel ne peut
être testé qu'après déploiement (section 7).

### Lot 7 — Page 404 et confidentialité (P1)

**Constat.** Une URL inconnue affiche la page 404 brute de l'hébergeur. Le site recueille
des renseignements personnels (nom, courriel) par formulaire mais ne publie pas de politique
de confidentialité, seulement des « mentions légales » de tradition française. Au Québec, la
Loi 25 demande à une entreprise qui recueille des renseignements personnels par un moyen
technologique de publier une politique de confidentialité en termes simples, et de publier
le titre et les coordonnées de la personne responsable de la protection de ces
renseignements. Par ailleurs, les mentions légales affirment que le site « peut utiliser des
cookies […] de mesure d'audience » alors qu'aucun outil de mesure n'est installé.

**À faire.**
1. `src/pages/404.astro` (prop `noindex`) : « 404 » en grand titre, « Cette page n'existe
   pas ou a été déplacée. », boutons vers l'accueil et le portfolio. Astro génère
   `dist/404.html`, que Netlify sert automatiquement.
2. `src/pages/politique-de-confidentialite.astro`, sur le modèle de la page des mentions
   légales, limitée aux **faits vérifiables dans le code** :
   - renseignements recueillis : ceux du formulaire (nom, courriel, type de séance, date,
     message, champs conditionnels) ;
   - finalité : répondre à la demande ; aucune vente ni cession (déjà affirmé sur le site) ;
   - hébergement et traitement du formulaire par Netlify, aux États-Unis — donc hors Québec ;
   - contenus Instagram intégrés sur l'accueil, qui peuvent déposer des témoins de Meta ;
   - pas d'outil de mesure d'audience ; polices hébergées sur le site (après le lot 2) ;
   - droits d'accès, de rectification et de retrait, et à qui écrire ;
   - responsable de la protection des renseignements personnels : voir décision D5.
3. Corriger le paragraphe « Cookies » des mentions légales pour qu'il décrive la réalité
   (pas de mesure d'audience ; témoins tiers possibles via Instagram) et mettre à jour la
   date de la page.
4. Lien « Politique de confidentialité » dans le pied de page, à côté de « Mentions légales ».

Ce texte n'est pas un avis juridique : le signaler à Marc pour validation avec Alex avant
mise en ligne.

**Acceptation.** `dist/404.html` existe et une URL inconnue l'affiche en prévisualisation ;
la politique est accessible depuis le pied de page et le formulaire ; aucune affirmation du
texte ne contredit le code.

### Lot 8 — Intégration Instagram (P2)

**Constat.** `https://www.instagram.com/embed.js` se charge à chaque visite de l'accueil,
même si le visiteur ne descend jamais jusqu'à la section. Et quand le script est bloqué
(bloqueur de publicité, Brave, réseau d'entreprise — c'était le cas pendant l'audit), les
trois `<blockquote>` sont vides : il reste un titre « Instagram » au-dessus d'un vide.

**À faire** (`InstagramFeed.astro`).
1. Contenu de repli dans chaque `<blockquote>` : un lien vers la publication (« Voir cette
   publication sur Instagram », `target="_blank" rel="noopener noreferrer"`), présenté comme
   une carte bordée de hauteur minimale, pour que la section reste propre sans le script.
2. Charger `embed.js` seulement quand la section approche de l'écran
   (`IntersectionObserver`, `rootMargin: '600px'`), puis appeler
   `window.instgrm?.Embeds.process()`.

**Acceptation.** Aucune requête vers `instagram.com` tant qu'on ne défile pas vers la
section ; avec `instagram.com` bloqué, trois liens de repli visibles et lisibles.

### Lot 9 — En-têtes et cache Netlify (P2)

**À faire** (`netlify.toml`).
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```
Les fichiers de `/_astro/` portent une empreinte dans leur nom : le cache long est sûr.
Pas de Content-Security-Policy dans ce chantier : le site utilise des scripts en ligne et
l'intégration Instagram, une CSP mal réglée casserait les deux.

**Acceptation.** Non vérifiable en local (`astro preview` ignore `netlify.toml`). À faire
confirmer par Marc après déploiement avec `curl -I` (section 7).

### Lot 10 — Visionneuse plein écran du portfolio (P2, recommandé)

**Constat.** On ne peut pas agrandir une photo : sur un site de photographe, c'est le manque
fonctionnel le plus visible. Les vignettes plafonnent à ~320 px de large en bureau.

**À faire.** Cette partie n'a pas été prototypée : s'appuyer sur la documentation de
PhotoSwipe 5 (`photoswipe.com/getting-started`) et vérifier dans le navigateur.
1. `npm i photoswipe`.
2. `PhotoGallery.astro` : envelopper chaque image dans un lien vers une grande version
   générée au build —
   `const large = await getImage({ src: img.src, width: Math.min(2000, img.src.width), format: 'webp', quality: 80 })` —
   avec `href={large.src}`, `data-pswp-width`, `data-pswp-height` et `target="_blank"`.
   Sans JavaScript, le lien ouvre simplement la grande image.
3. `portfolio.astro` : initialiser `PhotoSwipeLightbox` (import dynamique du module
   principal pour ne rien charger avant le premier clic), restreint aux photos visibles.
   Pour cela, faire basculer l'attribut `hidden` par le filtre de catégories au lieu de
   `style.display`, et cibler `figure:not([hidden]) a`.
4. Reprendre la légende et la ligne de méta dans la visionneuse si l'API le permet
   simplement ; sinon s'en tenir au texte alternatif.

**Acceptation.** Clic ou Entrée sur une photo ouvre la visionneuse ; flèches et balayage
naviguent ; Échap ferme et rend le focus à la vignette ; avec le filtre « Portrait » actif,
la visionneuse ne parcourt que les portraits ; chaque grande image ≤ ~700 Ko (baisser la
qualité sinon) ; `dist/` reste ≤ 40 Mo.

### Lot 11 — README et nettoyage (P2)

**Constat.** Le README décrit un site qui n'existe plus : couleur d'accent dorée
(`--color-accent: #b8860b`), tableaux `previewImages` et `allImages`, catégories « Mariage »
et « Corporatif », numéros de ligne, prix à 199 $.

**À faire.** Réécrire le README pour qu'il corresponde au code final : ajouter une photo
(déposer le fichier dans `src/assets/portfolio/`, ajouter l'entrée dans `photos.ts`),
modifier un prix (`services.ts`), modifier les coordonnées (`site.ts`), couleur d'accent
(`--color-citron`), régénérer les icônes (`npm run brand`), arborescence à jour, commandes
(`dev`, `build`, `preview`, `check`, `brand`).

---

## 6. Décisions à faire trancher par Marc ou Alex

Appliquer la valeur par défaut, ne pas bloquer, et lister ces points dans le compte rendu final.

| # | Question | Valeur par défaut |
|---|---|---|
| D1 | Titre de l'accueil : « Photographe Professionnelle » (féminin) contredit le reste du site (masculin). | Nouveau titre épicène du lot 4. |
| D2 | Mariage : le formulaire le propose (avec lieu de réception et budget), mais aucun forfait ni photo de mariage n'existe. Offert ou non ? | Garder l'option du formulaire ; retirer l'offre du JSON-LD. |
| D3 | Localisation : le JSON-LD et les balises géo disent Terrebonne, le site affiche « Montréal, Québec ». | Ne rien changer. |
| D4 | Heures d'ouverture déclarées aux moteurs : 9 h – 23 h 59, 7 jours sur 7. Exact ? | Ne rien changer. |
| D5 | Qui est responsable de la protection des renseignements personnels ? | Alex Diotte, au courriel du site (déjà nommé éditeur dans les mentions légales). À valider. |
| D6 | Vocabulaire : « Email » plutôt que « Courriel », et mélange « devis » / « soumission ». | Ne pas modifier les textes sans accord. |
| D7 | Instagram : garder les publications intégrées, ou les remplacer par une grille de photos maison liée au compte (zéro tiers) ? | Garder l'intégration, améliorée par le lot 8. |
| D8 | Mesure d'audience : aucune aujourd'hui. | Ne rien installer. |

**Contenus que seul Alex peut fournir** (ne pas inventer) : témoignages de clients, noms ou
logos de clients et de salles, extraits vidéo — le site se présente comme « photographe et
vidéaste » sans montrer de vidéo —, et le champ `lieu` des photos (prévu dans `photos.ts`,
vide partout).

## 7. Actions manuelles pour Marc, hors code

1. **Formulaires Netlify** : vérifier que la détection des formulaires est activée, puis
   configurer une notification par courriel vers Alex. Sans cela, les demandes restent dans
   le tableau de bord sans que personne soit prévenu. Faire un envoi de test après
   déploiement et confirmer l'arrivée sur `/merci/`.
2. **Après déploiement** : `curl -I https://citronphoto.netlify.app/` pour confirmer les
   en-têtes du lot 9 ; tester l'aperçu de partage en collant le lien dans une messagerie.
3. **Nom de domaine** : un domaine propre à la place de `citronphoto.netlify.app` est le
   signal de sérieux le plus rentable. Une fois acheté, changer `site` dans
   `astro.config.mjs`, l'URL de `src/data/site.ts` et celle de `robots.txt`.
4. **Google Search Console** : déclarer le site et soumettre `sitemap-index.xml`.
   **Fiche d'établissement Google** : la créer ou la relier au site.
5. Facultatif : purger l'historique git des anciens `node_modules/` et des photos brutes
   (réécriture d'historique — à décider en connaissance de cause).

## 8. Vérification finale

```bash
npm ci && npm run check && npm run build

git ls-files | grep -c -E '^(node_modules|dist|\.astro)/'       # 0
du -sh dist                                                      # ≤ 40 Mo
find dist -type f -size +1M                                      # vide
grep -rc "fonts.googleapis.com" dist --include=*.html            # 0 partout
grep -c 'aria-current="page"' dist/portfolio/index.html          # ≥ 1
for f in favicon.ico favicon.svg apple-touch-icon.png icon-192.png icon-512.png \
         icon-maskable-512.png site.webmanifest og-default.jpg robots.txt \
         sitemap-index.xml 404.html merci/index.html politique-de-confidentialite/index.html; do
  test -f "dist/$f" && echo "ok      $f" || echo "MANQUE  $f"
done
```

Puis, avec `npm run preview` et un navigateur sans tête, en bureau (1440×900) et en mobile :
- poids transféré après défilement complet : accueil ≤ 1 Mo (hors Instagram), portfolio ≤ 2 Mo ;
- aucun débordement horizontal, aucune erreur dans la console ;
- captures d'écran des cinq pages comparées à l'état d'origine : l'apparence ne doit pas
  avoir changé, hormis les titres qui ne « sautent » plus au chargement ;
- parcours clavier complet : lien d'évitement, menu, cartes de forfaits, filtres,
  visionneuse, formulaire ;
- si Lighthouse est disponible : viser ≥ 95 en Performance, Accessibilité, Bonnes pratiques
  et SEO sur l'accueil et le portfolio, en mobile.

Le compte rendu final à Marc doit distinguer trois choses : ce qui est fait et vérifié en
local, ce qui reste à confirmer après déploiement (formulaire, en-têtes), et les décisions
de la section 6 prises par défaut.

---

## Annexe A — `scripts/generate-brand-assets.mjs`

Script testé pendant l'audit (Node 22, `sharp` fourni par Astro, `opentype.js` 2.0,
`@fontsource/anton` 5.3). À copier tel quel.

```js
/**
 * generate-brand-assets.mjs — Génère les icônes et l'image de partage du site
 * à partir de la marque (Anton, encre sur citron).
 *
 *   npm run brand
 *
 * Sorties dans public/ : favicon.svg, favicon.ico, apple-touch-icon.png,
 * icon-192.png, icon-512.png, icon-maskable-512.png, og-default.jpg
 * Les fichiers générés sont commités : relancer le script seulement si la marque
 * ou la photo de couverture change.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import opentype from 'opentype.js';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const CITRON = '#e4ff1a';
const INK = '#0a0a0a';
const FG = '#f3f3ef';
const OUT = new URL('../public/', import.meta.url);
const HERO = new URL('../public/hero.jpg', import.meta.url); // adapter si la photo de couverture est déplacée

const buf = fs.readFileSync(require.resolve('@fontsource/anton/files/anton-latin-400-normal.woff'));
const anton = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Tracé SVG d'un texte en Anton dont la hauteur de capitale vaut `capHeight`, coin haut-gauche en (x, y). */
function textPath(text, x, y, capHeight) {
  const b = anton.getPath(text, 0, 0, 100).getBoundingBox();
  const k = capHeight / (b.y2 - b.y1);
  return {
    d: anton.getPath(text, x - b.x1 * k, y - b.y1 * k, 100 * k).toPathData(2),
    width: (b.x2 - b.x1) * k,
  };
}

/** Icône carrée : monogramme « AD » occupant `fill` (0–1) de la hauteur. */
function iconSvg({ size, fill, radius = 0 }) {
  const cap = size * fill;
  const { width } = textPath('AD', 0, 0, cap);
  const { d } = textPath('AD', (size - width) / 2, (size - cap) / 2, cap);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${CITRON}"/><path d="${d}" fill="${INK}"/></svg>\n`;
}

const png = (svg, px) => sharp(Buffer.from(svg), { density: 600 }).resize(px, px).png().toBuffer();

/** Conteneur ICO minimal à charges utiles PNG. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/** Image de partage 1200×630 : photo de couverture assombrie + logo ruban + accroche. */
async function ogImage() {
  const W = 1200, H = 630, M = 64;
  const cap = 64, padX = 30, padY = 20;
  const logo = textPath('ALEX DIOTTE', 0, 0, cap);
  const tapeW = logo.width + padX * 2, tapeH = cap + padY * 2;
  const tapeY = H - M - 150;
  const name = textPath('ALEX DIOTTE', M + padX, tapeY + padY, cap);
  const tag = textPath('PHOTOGRAPHE ET VIDÉASTE · MONTRÉAL', M, H - M - 34, 34);
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.25" stop-color="${INK}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity="0.92"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <g transform="rotate(-2 ${M} ${tapeY + tapeH})"><rect x="${M}" y="${tapeY}" width="${tapeW}" height="${tapeH}" fill="${CITRON}"/><path d="${name.d}" fill="${INK}"/></g>
    <path d="${tag.d}" fill="${FG}"/>
  </svg>`;
  return sharp(fs.readFileSync(HERO))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: Buffer.from(overlay) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const write = (name, data) => fs.writeFileSync(new URL(name, OUT), data);
const tab = iconSvg({ size: 64, fill: 0.62, radius: 8 });   // onglet de navigateur
const flat = iconSvg({ size: 512, fill: 0.56 });            // iOS / Android (coins arrondis par l'OS)
const safe = iconSvg({ size: 512, fill: 0.4 });             // maskable : contenu dans la zone sûre

write('favicon.svg', tab);
write('favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })))));
write('apple-touch-icon.png', await png(flat, 180));
write('icon-192.png', await png(flat, 192));
write('icon-512.png', await png(flat, 512));
write('icon-maskable-512.png', await png(safe, 512));
write('og-default.jpg', await ogImage());
console.log('Icônes et image de partage générées dans public/');
```

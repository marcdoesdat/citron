# Alex Diotte Photographie

Site web professionnel de photographe — construit avec [Astro](https://astro.build) et [Tailwind CSS v4](https://tailwindcss.com).

## Lancer le site en local

```bash
npm install
npm run dev
```

Le site est accessible sur `http://localhost:4321`.

## Déployer sur Netlify

```bash
git add .
git commit -m "Description du changement"
git push
```

Netlify détecte le push et redéploie automatiquement le site.

## Changer les photos

### Photos locales (recommandé)

1. Placez vos images dans `src/assets/`
2. Importez-les dans la page correspondante :

```astro
---
import maPhoto from '../assets/ma-photo.jpg';
---
<img src={maPhoto.src} alt="Description" />
```

### Photo de couverture (pleine page)

Dans `src/pages/index.astro`, ligne 29 :

```astro
<img src="VOTRE_URL_OU_IMPORT" alt="..." />
```

### Photo de bio

Dans `src/pages/index.astro`, ligne 46 :

```astro
<img src="VOTRE_URL_OU_IMPORT" alt="Alex Diotte" />
```

### Galerie d'aperçu (page d'accueil)

Dans `src/pages/index.astro`, modifiez le tableau `previewImages` (6 photos).

### Galerie complète (page Portfolio)

Dans `src/pages/portfolio.astro`, modifiez le tableau `allImages` (12 photos).  
Chaque entrée a un `category` : `Portrait`, `Mariage`, `Événementiel`, `Corporatif`.

## Modifier les informations de contact

| Information | Fichier |
|---|---|
| Email, téléphone, ville | `src/pages/contact.astro` |
| Email, ville (pied de page) | `src/components/Footer.astro` |
| Texte de la bio | `src/pages/index.astro` |

## Structure du projet

```
src/
├── assets/          # Vos photos (à créer)
├── components/
│   ├── Footer.astro
│   ├── Header.astro
│   ├── PhotoGallery.astro
│   ├── SEO.astro
│   └── ServiceCard.astro
├── layouts/
│   └── Layout.astro  # Structure HTML commune à toutes les pages
├── pages/
│   ├── index.astro   # Page d'accueil
│   ├── portfolio.astro
│   ├── services.astro
│   └── contact.astro
└── styles/
    └── global.css    # Thème et variables de couleurs
```

## Modifier les tarifs

Dans `src/pages/services.astro`, modifiez le tableau `services` :

```js
{
  title: 'Portrait',
  price: '199$',
  description: 'Description du forfait',
  features: [
    'Élément 1',
    'Élément 2',
  ],
}
```

## Modifier les couleurs

Dans `src/styles/global.css`, section `@theme` :

```css
@theme {
  --color-accent: #b8860b;  /* couleur principale (dorée) */
}
```

## Commandes utiles

| Commande | Action |
|---|---|
| `npm run dev` | Lance le serveur local |
| `npm run build` | Génère le site dans `dist/` |
| `npm run preview` | Prévisualise le build |

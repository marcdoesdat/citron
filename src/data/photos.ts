/**
 * photos.ts — Source unique des photos du portfolio (accueil + page Portfolio).
 *
 * `shotAt`, `shutter` et `iso` viennent des métadonnées EXIF de chaque fichier
 * (heure locale de l'appareil). `lieu` est optionnel : quand il est rempli,
 * il s'ajoute à la ligne de méta sous la photo (ex. « Club Soda »).
 */

import type { ImageMetadata } from 'astro';

export type Category = 'Portrait' | 'Événementiel';

export interface Photo {
  /** Nom du fichier dans src/assets/portfolio */
  file: string;
  category: Category;
  /** Description pour les lecteurs d'écran */
  alt: string;
  /** Légende affichée sous la photo */
  caption: string;
  /** Date et heure de prise de vue, format AAAA-MM-JJTHH:MM */
  shotAt: string;
  /** Vitesse d'obturation, ex. « 1/200 » */
  shutter: string;
  iso: number;
  /** Salle ou lieu (optionnel) */
  lieu?: string;
}

export const photos: Photo[] = [
  // ── Portrait ──────────────────────────────────────────────────────────────
  { file: 'DSC08557.jpg', category: 'Portrait',
    alt: "Homme en blouson de cuir brodé, adossé à un mur de pierre dans l'ombre",
    caption: 'Adossé au mur, regard ailleurs', shotAt: '2024-02-27T15:12', shutter: '1/160', iso: 80 },
  { file: '_DSC3143.jpg', category: 'Portrait',
    alt: 'Homme en casquette affalé sur un divan, verre à la main, éclairé au flash de nuit',
    caption: 'Un divan, un verre, la nuit', shotAt: '2025-02-22T20:40', shutter: '1/250', iso: 50 },
  { file: '_DSC1428.jpg', category: 'Portrait',
    alt: 'Homme en lunettes de soleil et chandail vert au crépuscule, au bord de la route',
    caption: 'Heure bleue, bord de route', shotAt: '2024-11-09T17:54', shutter: '1/60', iso: 160 },
  { file: '_DSC3834.jpg', category: 'Portrait',
    alt: 'Main tenant un téléphone qui cadre une jeune femme, lumières floues en arrière-plan',
    caption: 'Le portrait dans le portrait', shotAt: '2025-04-11T18:45', shutter: '1/250', iso: 800 },
  { file: '_DSC3964.jpg', category: 'Portrait',
    alt: 'Jeune femme en capuchon sous un néon, une silhouette encapuchonnée derrière elle',
    caption: 'Capuchon sous le néon', shotAt: '2025-04-11T19:16', shutter: '1/250', iso: 1000 },
  { file: '_DSC5194.jpg', category: 'Portrait',
    alt: 'Deux hommes en capuchon et lunettes devant un vieil édifice couvert de graffitis',
    caption: "Duo devant l'édifice tagué", shotAt: '2025-04-18T15:42', shutter: '1/200', iso: 125 },
  { file: '_DSC3942.jpg', category: 'Portrait',
    alt: 'Jeune femme en tuque appuyée sur une rampe, photographiée en contre-plongée',
    caption: 'Contre-plongée, main sur la rampe', shotAt: '2025-04-11T19:14', shutter: '1/250', iso: 1000 },
  { file: '_DSC6843.jpg', category: 'Portrait',
    alt: 'Homme en tuque, lunettes fumées et maillot rayé devant un mur de briques tagué',
    caption: 'Minuit passé, flash direct', shotAt: '2025-05-04T00:09', shutter: '1/200', iso: 125 },
  { file: '_DSC8007.jpg', category: 'Portrait',
    alt: "Homme en lunettes de soleil qui tend la main vers l'objectif, en contre-plongée sur fond de ciel",
    caption: "La main vers l'objectif", shotAt: '2024-07-04T10:18', shutter: '1/200', iso: 100 },

  // ── Événementiel — 17 janvier 2026 ────────────────────────────────────────
  { file: '_CTN5839.jpg', category: 'Événementiel',
    alt: 'Deux DJ derrière les platines, vues au fisheye sous une lumière rouge',
    caption: 'Derrière les platines', shotAt: '2026-01-17T00:45', shutter: '1/200', iso: 640 },
  { file: '_CTN6190.jpg', category: 'Événementiel',
    alt: 'Deux DJ tatoués lèvent les bras derrière les platines',
    caption: 'Les DJ lèvent les bras', shotAt: '2026-01-17T00:58', shutter: '1/250', iso: 640 },
  { file: '_CTN6198.jpg', category: 'Événementiel',
    alt: 'Foule en délire, bras levés, un fêtard qui crie au premier plan',
    caption: 'Six secondes plus tard, la foule répond', shotAt: '2026-01-17T00:58', shutter: '1/250', iso: 640 },
  { file: '_CTN6390.jpg', category: 'Événementiel',
    alt: "Vue d'ensemble d'une salle comble devant la cabine du DJ",
    caption: 'La salle pleine, vue du fond', shotAt: '2026-01-17T01:36', shutter: '1/200', iso: 250 },

  // ── Événementiel — 23 janvier 2026 ────────────────────────────────────────
  { file: '_CTN6791.jpg', category: 'Événementiel',
    alt: 'Chanteuse au micro avec un keytar, sous des néons',
    caption: 'Voix et keytar', shotAt: '2026-01-23T21:44', shutter: '1/200', iso: 800 },
  { file: '_CTN6835.jpg', category: 'Événementiel',
    alt: 'Chanteur à lunettes et guitariste sous un éclairage bleu',
    caption: 'Au micro, sous le bleu', shotAt: '2026-01-23T22:12', shutter: '1/200', iso: 800 },
  { file: '_CTN7110.jpg', category: 'Événementiel',
    alt: "Guitariste porté par la foule pendant qu'il joue",
    caption: 'Crowd surf, guitare en main', shotAt: '2026-01-23T22:55', shutter: '1/200', iso: 800 },
  { file: '_CTN7436.jpg', category: 'Événementiel',
    alt: 'Chanteuse bras ouverts sur scène, foule mains levées, vue au fisheye',
    caption: 'Bras ouverts, la salle répond', shotAt: '2026-01-24T00:11', shutter: '1/200', iso: 1000 },

  // ── Événementiel — 8 février 2026 ─────────────────────────────────────────
  { file: '_CTN8165.jpg', category: 'Événementiel',
    alt: "Foule mains en l'air, une fêtarde en lunettes de soleil au centre",
    caption: "Mains en l'air", shotAt: '2026-02-08T00:08', shutter: '1/160', iso: 400 },
  { file: '_CTN8171.jpg', category: 'Événementiel',
    alt: "Faisceaux de lumière bleue sur scène, un fêtard qui crie face à l'objectif au premier plan",
    caption: 'Les faisceaux, puis le cri', shotAt: '2026-02-08T00:11', shutter: '1/160', iso: 320 },
  { file: '_CTN8181.jpg', category: 'Événementiel',
    alt: "Fêtard qui crie face à l'objectif au milieu d'une foule serrée",
    caption: 'Regard caméra en plein chaos', shotAt: '2026-02-08T00:12', shutter: '1/160', iso: 250 },
  { file: '_CTN8218.jpg', category: 'Événementiel',
    alt: 'Foule bras levés sous des projecteurs violets',
    caption: '2 h du matin, toujours debout', shotAt: '2026-02-08T02:02', shutter: '1/200', iso: 500 },
  { file: '_CTN8263.jpg', category: 'Événementiel',
    alt: 'Mosh pit, fêtards torse nu qui se bousculent',
    caption: 'Le pit, neuf minutes plus tard', shotAt: '2026-02-08T02:11', shutter: '1/200', iso: 400 },
];

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

/** « 00:45 » */
export const shotTime = (p: Photo) => p.shotAt.slice(11, 16);

/** « 2026-01-17 · 00:45 · 1/200 s · ISO 640 · Lieu » */
export const shotMeta = (p: Photo) =>
  [p.shotAt.slice(0, 10), shotTime(p), `${p.shutter} s`, `ISO ${p.iso}`, p.lieu]
    .filter(Boolean)
    .join(' · ');

/**
 * services.ts — Source unique des forfaits et de la FAQ.
 * Les prix s'écrivent une seule fois, en `amount` (nombre) ou en `priceLabel`
 * (texte, quand il n'y a pas de montant). Ils alimentent la page Services,
 * les trois cartes de l'accueil et les données structurées (SEO).
 */

export type ServiceKind = 'portrait' | 'event' | 'corporate';

/** Intitulés des trois familles de forfaits */
export const serviceKinds: Record<ServiceKind, string> = {
  portrait: 'Portrait / Contenu Réseaux Sociaux',
  event: 'Événement',
  corporate: 'Corporatif & Image de marque',
};

interface ServiceInput {
  title: string;
  /** Montant en dollars canadiens (absent si le prix est sur devis) */
  amount?: number;
  /** Prix affiché quand il n'y a pas de montant */
  priceLabel?: string;
  /** Affiche « à partir de » à côté du prix */
  showStartingFrom: boolean;
  description: string;
  icon: ServiceKind;
  /** Forfait mis en avant : badge sur la page Services, carte sur l'accueil */
  featured: boolean;
  /** Court résumé affiché sur la carte de l'accueil (forfaits mis en avant) */
  summary?: string;
  ctaLabel: string;
  features: string[];
}

export interface Service extends ServiceInput {
  /** Prix tel qu'affiché (« 150 $ » ou le `priceLabel`) */
  price: string;
}

const withPrice = (list: ServiceInput[]): Service[] =>
  list.map((s) => ({ ...s, price: s.amount !== undefined ? `${s.amount} $` : (s.priceLabel ?? '') }));

const portraitRaw: ServiceInput[] = [
  {
    title: 'Forfait de base',
    amount: 150,
    showStartingFrom: false,
    description: 'Portrait / contenu réseaux sociaux - formule essentielle.',
    icon: 'portrait',
    featured: true,
    summary: '1h30, 10 photos retouchées, livraison en 5 jours.',
    ctaLabel: 'Réserver ma séance',
    features: [
      'Durée : 1h30',
      '10 photos retouchées',
      'Livraison : 5 jours',
      '1 emplacement',
    ],
  },
  {
    title: 'Forfait intermédiaire',
    amount: 225,
    showStartingFrom: false,
    description: 'Portrait / contenu réseaux sociaux - plus de temps et de variété.',
    icon: 'portrait',
    featured: false,
    ctaLabel: 'Réserver ma séance',
    features: [
      'Durée : 2h30',
      '20 photos retouchées',
      'Livraison : 5 jours',
      '1-2 emplacements',
    ],
  },
  {
    title: 'Forfait ultime',
    amount: 300,
    showStartingFrom: false,
    description: 'Portrait / contenu réseaux sociaux - expérience complète.',
    icon: 'portrait',
    featured: false,
    ctaLabel: 'Réserver ma séance',
    features: [
      'Durée : 3h30',
      '30 photos retouchées',
      'Livraison rapide : 2-3 jours',
      '1-3 emplacements',
    ],
  },
];

const eventRaw: ServiceInput[] = [
  {
    title: 'Forfait 3h',
    amount: 300,
    showStartingFrom: false,
    description: 'Événement (anniversaire, corporatif, etc.) - format court.',
    icon: 'event',
    featured: false,
    ctaLabel: 'Réserver ma séance',
    features: [
      'Environ 100 photos livrées',
      'Retouche incluse',
      'Livraison sous 7 jours',
    ],
  },
  {
    title: 'Forfait 6h',
    amount: 450,
    showStartingFrom: false,
    description: 'Événement (anniversaire, corporatif, etc.) - couverture complète.',
    icon: 'event',
    featured: true,
    summary: 'Environ 200 photos livrées, retouche incluse, livraison sous 7 jours.',
    ctaLabel: 'Réserver ma séance',
    features: [
      'Environ 200 photos livrées',
      'Retouche incluse',
      'Livraison sous 7 jours',
    ],
  },
  {
    title: 'Forfait 8h',
    amount: 600,
    showStartingFrom: false,
    description: 'Événement (anniversaire, corporatif, etc.) - journée longue.',
    icon: 'event',
    featured: false,
    ctaLabel: 'Réserver ma séance',
    features: [
      'Environ 300 photos livrées',
      'Retouche incluse',
      'Livraison sous 7 jours',
    ],
  },
];

const corporateRaw: ServiceInput[] = [
  {
    title: 'Forfait Portrait d\'affaires',
    amount: 200,
    showStartingFrom: true,
    description: 'L\'essentiel - idéal pour les travailleurs autonomes ou la mise à jour d\'une équipe.',
    icon: 'corporate',
    featured: false,
    ctaLabel: 'Réserver ma séance',
    features: [
      'Durée : 1h',
      'Installation d\'un studio mobile dans vos bureaux ou en extérieur',
      '5 photos retouchées en haute résolution',
      'Licence d\'utilisation commerciale incluse',
    ],
  },
  {
    title: 'Forfait Banque d\'images',
    amount: 550,
    showStartingFrom: true,
    description: 'Le plus populaire 🌟 - idéal pour refondre un site web ou alimenter vos réseaux sociaux pendant plusieurs mois.',
    icon: 'corporate',
    featured: true,
    summary: 'Demi-journée (~4h), 40+ photos retouchées.',
    ctaLabel: 'Réserver ma séance',
    features: [
      'Durée : demi-journée (environ 4h)',
      'Mix de portraits de l\'équipe et de photos lifestyle en action',
      '40+ photos retouchées',
      'Licence d\'utilisation commerciale étendue',
    ],
  },
  {
    title: 'Forfait Production',
    priceLabel: 'Sur devis',
    showStartingFrom: false,
    description: 'Sur mesure - pour les grandes campagnes, le lancement de produits ou la couverture complète d\'une entreprise.',
    icon: 'corporate',
    featured: false,
    ctaLabel: 'Demander une soumission',
    features: [
      'Journée complète ou multi-jours',
      'Direction artistique complète (planification en amont)',
      'Retouches complexes (détourage, nettoyage de produits)',
      'Cession de droits complète',
    ],
  },
];

export const faq = [
  {
    q: 'Vous déplacez-vous à l\'extérieur de Montréal ?',
    a: 'Oui ! Bien que je sois principalement actif dans la grande région de Montréal, je me déplace avec plaisir partout ailleurs, selon mes disponibilités. Des frais de kilométrage ou de déplacement peuvent s\'appliquer selon la distance.',
  },
  {
    q: 'Comment se déroule une séance portrait ?',
    a: 'Tout commence par une discussion pour bien cerner vos attentes et votre vision. La séance photo est dirigée avec un accompagnement sur les poses et l\'éclairage. Finalement, on fait la sélection et la retouche minutieuse des meilleures photos.',
  },
  {
    q: 'Puis-je ajouter des filtres aux photos reçues ?',
    a: 'Chaque image que je vous livre est le résultat d\'un travail de retouche méticuleux qui reflète mon identité photographique. Afin de préserver cette intégrité artistique et la qualité optimale des images, je demande de ne pas appliquer de filtres supplémentaires (comme ceux d\'Instagram) par la suite.',
  },
];

export const portraitServices = withPrice(portraitRaw);
export const eventServices = withPrice(eventRaw);
export const corporateServices = withPrice(corporateRaw);

export const allServices: Service[] = [...portraitServices, ...eventServices, ...corporateServices];

/** Forfaits mis en avant, dans l'ordre portrait, événement, corporatif (cartes de l'accueil) */
export const featuredServices = allServices.filter((s) => s.featured);

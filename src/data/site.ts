/**
 * site.ts — Source unique des informations du site (nom, coordonnées, réseaux).
 * Pour changer un courriel, un téléphone ou un lien de réseau social, c'est ici.
 * Si le domaine change, mettre aussi à jour `site` dans astro.config.mjs
 * et l'URL du plan du site dans public/robots.txt.
 */
export const site = {
  /** Nom commercial */
  name: 'Alex Diotte Photographie',
  /** Nom de la personne */
  person: 'Alex Diotte',
  /** URL publique, sans barre finale */
  url: 'https://citronphoto.netlify.app',
  /** Titre complet de la page d'accueil (formulation épicène) */
  homeTitle: 'Alex Diotte | Photographe et vidéaste à Montréal',
  /** Description de l'accueil, reprise par les données structurées de toutes les pages */
  description:
    'Alex Diotte, photographe professionnel à Montréal et sur la Rive-Nord (Terrebonne, Laval, Repentigny). Spécialisé en portrait et événementiel.',
  email: 'alexdiottephoto@gmail.com',
  /** Téléphone tel qu'affiché */
  phone: '438-812-6026',
  /** Téléphone au format E.164 (liens tel: et données structurées) */
  phoneE164: '+14388126026',
  /** Ville telle qu'affichée */
  city: 'Montréal, Québec',
  instagram: {
    handle: '_citronnnade_',
    url: 'https://www.instagram.com/_citronnnade_/',
  },
  youtube: {
    url: 'https://www.youtube.com/channel/UCz7TYiKkP3mUXyYoNa0P09g',
    /** Lien qui propose l'abonnement (page Contact) */
    subscribeUrl:
      'https://www.youtube.com/channel/UCz7TYiKkP3mUXyYoNa0P09g?app=desktop&sub_confirmation=1',
  },
} as const;

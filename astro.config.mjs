import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://sophiemoreau.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
  // NOTE : en production, les vraies photos du photographe seront stockées dans
  // src/assets/ et importées avec <Image /> d'astro:assets pour l'optimisation complète.
  // Les images distantes (ex: picsum) utilisent des redirects incompatibles avec l'optimiseur Astro.
});

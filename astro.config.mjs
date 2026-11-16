import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://citronphoto.netlify.app',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/merci/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});

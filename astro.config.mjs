import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://milo-ideas.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api') && !page.includes('/404'),
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
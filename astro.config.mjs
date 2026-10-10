// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed as a GitHub Pages project site at https://cediborn.github.io/LA-MUSA/
export default defineConfig({
  site: 'https://cediborn.github.io',
  base: '/LA-MUSA',
  trailingSlash: 'always',
  integrations: [sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});

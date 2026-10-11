// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// One codebase, two deployment targets:
// - Vercel: served from the domain root (process.env.VERCEL is set during build).
// - GitHub Pages: project site under /GET-LABOUR (local builds for gh-pages).
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  site: onVercel
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'get-labour.vercel.app'}`
    : 'https://cediborn.github.io',
  ...(onVercel ? {} : { base: '/GET-LABOUR' }),
  trailingSlash: 'always',
  integrations: [sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});

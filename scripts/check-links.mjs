// Link/structure checker for the built site (dist/).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const errors = [];
const warnings = [];

// Base path the checked build was produced with (see astro.config.mjs):
// local builds use the GitHub Pages base, Vercel builds use the root ('').
const BASE = (process.env.ASTRO_BASE ?? '/GET-LABOUR').replace(/\/$/, '');

const walk = (dir) => {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
};

const pages = walk(dist);
console.log(`Pages: ${pages.length}`);

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const rel = page.slice(dist.length);

  // Internal hrefs
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('data:'))
      continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const hasPrefix = BASE === '' ? clean.startsWith('/') : clean.startsWith(`${BASE}/`);
    if (!hasPrefix) {
      errors.push(`${rel}: non-base-prefixed internal link "${href}" (expected base "${BASE || '/'}")`);
      continue;
    }
    const target = join(dist, clean.slice(BASE.length));
    // trailing slash -> index.html
    const asDir = join(target, 'index.html');
    if (clean.endsWith('/')) {
      if (!existsSync(asDir)) errors.push(`${rel}: missing target ${href}`);
    } else if (!existsSync(target) && !existsSync(asDir)) {
      errors.push(`${rel}: missing target ${href}`);
    }
  }

  // src/href asset references
  const srcs = [...html.matchAll(/(?:src|srcset)="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]));
  for (const src of srcs) {
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    const clean = src.split('?')[0];
    const hasPrefix = BASE === '' ? clean.startsWith('/') : clean.startsWith(`${BASE}/`);
    if (!hasPrefix) {
      errors.push(`${rel}: non-base-prefixed asset "${src}" (expected base "${BASE || '/'}")`);
      continue;
    }
    const target = join(dist, clean.slice(BASE.length));
    if (!existsSync(target)) errors.push(`${rel}: missing asset ${src}`);
  }

  // Basic structure checks
  if (!html.includes('<h1')) errors.push(`${rel}: no <h1>`);
  if ((html.match(/<h1/g) || []).length > 1) warnings.push(`${rel}: multiple h1`);
  if (!html.includes('name="description"')) errors.push(`${rel}: no meta description`);
  if (!html.includes('rel="canonical"')) warnings.push(`${rel}: no canonical`);
  if (!html.includes('skip-link')) warnings.push(`${rel}: no skip link`);
}

console.log(`\nErrors: ${errors.length}`);
errors.forEach((e) => console.log('  ✗', e));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((w) => console.log('  !', w));
process.exit(errors.length ? 1 : 0);

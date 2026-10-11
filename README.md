# GET Labour Company Limited (GLCL) — website

Corporate website for GLCL, a maritime and industrial labour supply company based in
Tema, Ghana. Built with Astro (static output). Two conversion journeys:

- **Request Labour** — businesses ask for workers (`/request-labour/`)
- **Apply for Work** — job seekers register interest (`/apply/`)

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/GET-LABOUR/
npm run build      # static output in dist/
```

`npm run preview` serves the built site on port 4321 with the `/GET-LABOUR/` base path.

## Structure

- `src/config/site.ts` — single source of truth: verified company data (address,
  phones, email, founding date, social links), navigation, service content, FAQs,
  labour/apply categories, EmailJS settings. Edit this file to change any copy or
  contact detail; do not hard-code company facts elsewhere.
- `src/pages/` — home, about, services (+ 4 dynamic detail pages), request-labour,
  careers, apply, contact, privacy.
- `src/components/` — Header, Footer, PageHero, CtaBand, FaqList, RequestForm,
  ApplyForm, EnquiryForm.
- `src/scripts/forms.js` — form handling: honeypot + minimum-time bot trap,
  inline validation, EmailJS delivery, honest fallback to a pre-filled `mailto:`
  link when delivery fails or is unconfigured. Success is never faked.
- `src/styles/global.css` — design system.
- `scripts/` — QA tooling: `check-links.mjs` (internal link crawl), `screenshots.mjs`
  (Playwright/Edge visual capture), `test-journeys.mjs` (end-to-end form/navigation
  tests with EmailJS intercepted), image processing scripts.

## Deployment

Two hosts, one codebase — the base path is chosen automatically at build time by
`astro.config.mjs`:

| Host | Base path | Live URL |
|---|---|---|
| Vercel (`VERCEL` env set) | root (`/`) | https://get-labour.vercel.app/ |
| GitHub Pages | `/GET-LABOUR` | https://cediborn.github.io/GET-LABOUR/ |

- **Vercel**: deploys automatically from the `main` branch (Vercel runs
  `npm run build`; no config needed — the site is fully static, output `dist/`).
  Canonical/OG/sitemap URLs use `VERCEL_PROJECT_PRODUCTION_URL`, so a custom
  domain added later is picked up without code changes.
- **GitHub Pages**: serves the **built** site from the `gh-pages` branch. The
  `main` branch holds the Astro source only. Redeploy:

  ```bash
  npm run build                          # builds with base /GET-LABOUR
  # copy dist/* onto the gh-pages branch (temp clone + commit), then push
  ```

- **`.nojekyll` is required** at the root of `gh-pages`. Without it, GitHub Pages
  runs Jekyll, which silently excludes any `_`-prefixed folder — so `_astro/`
  (all CSS, JS, fonts, images) 404s and the site loads unstyled.
- `robots.txt` is generated per host by `src/pages/robots.txt.ts` so the
  sitemap URL always matches the deployment.
- Sitemap: `dist/sitemap-index.xml`.

## Forms / EmailJS

Forms send through EmailJS using the same service/template the old GLCL site used
(keys in `src/config/site.ts`). The templates are the legacy ones, so the payload
maps to their existing variables (`fullname`, `company`, `labourType`, …) plus a
full formatted `message` body.

If EmailJS is unavailable or misconfigured, visitors see an honest message and a
pre-filled email to `getlabourcompanylimited@gmail.com` — never a fake success.

To rotate keys later: update `emailjs` in `src/config/site.ts` only.

## QA (before any release)

```bash
node scripts/check-links.mjs      # 0 errors expected
node scripts/test-journeys.mjs    # requires preview server on :4321
node scripts/screenshots.mjs      # visual pass; review shots/
```

## Known limitations / review items

- **Privacy policy** (`/privacy/`) is a draft written from the forms actually on the
  site — requires management/legal review before launch.
- **Careers page** shows no vacancies ("No vacancies are advertised at this time");
  it links to the application form instead. No listings were invented.
- All copy uses only verified facts from GLCL's previous site (founded July 2013,
  Tema Meridian Road / Community 2, phone/email as configured). No certifications,
  workforce sizes, clients or testimonials were fabricated — add them to
  `src/config/site.ts` when GLCL supplies them.
- Wikimedia Tema terminal photo is credited in the footer (CC BY-SA 3.0,
  SteKrueBe). Replace with GLCL-owned photography when available and drop the credit.
- No CMS: content edits are code edits in `src/`.
- Forms are email-based (no database/CRM); submissions land in the GLCL inbox.

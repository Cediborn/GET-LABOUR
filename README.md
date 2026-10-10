# GET Labour Company Limited (GLCL) — website

Corporate website for GLCL, a maritime and industrial labour supply company based in
Tema, Ghana. Built with Astro (static output). Two conversion journeys:

- **Request Labour** — businesses ask for workers (`/request-labour/`)
- **Apply for Work** — job seekers register interest (`/apply/`)

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/LA-MUSA/
npm run build      # static output in dist/
```

`npm run preview` serves the built site on port 4321 with the `/LA-MUSA/` base path.

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

- Target: GitHub Pages at `https://cediborn.github.io/LA-MUSA/`.
- `astro.config.mjs` sets `site: 'https://cediborn.github.io'` and `base: '/LA-MUSA'`
  — if the domain or repo changes, update both and the hardcoded absolute URLs in
  `src/components/EnquiryForm.astro`.
- Build command: `npm run build`. Publish directory: `dist/`. Branch: `main`,
  root path (no Actions workflow needed — Pages can build from branch or use the
  prebuilt output; this repo is set to serve `dist` via branch settings or upload).
- Sitemap: `dist/sitemap-index.xml` (registered via `robots.txt`).

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

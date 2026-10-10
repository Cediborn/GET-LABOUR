// End-to-end journey tests against the local preview server.
// EmailJS delivery is intercepted — no real emails are sent.
import { chromium } from 'playwright-core';

const EDGE =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = 'http://localhost:4321/LA-MUSA';

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const results = [];
const check = (name, cond, extra = '') => {
  results.push({ name, pass: Boolean(cond), extra });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const newPage = async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  return { ctx, page };
};

// ---- Journey A: business visitor — homepage → services → request form ----
{
  const { ctx, page } = await newPage();
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  check('A1 home loads with hero CTA', await page.locator('.hero .btn--accent').isVisible());
  await page.click('.hero .btn--accent');
  await page.waitForURL('**/request-labour/');
  check('A2 hero CTA opens request page', page.url().includes('request-labour'));

  // Empty submit → validation errors
  await page.waitForTimeout(1600);
  await page.click('form[data-glcl-form="request"] button[type="submit"]');
  const invalidCount = await page.locator('form[data-glcl-form="request"] .field.is-invalid').count();
  check('A3 empty submit shows validation errors', invalidCount >= 4, `${invalidCount} invalid fields`);

  // Category conditional fields
  await page.selectOption('#req-category', 'General / non-skilled labour');
  check(
    'A4 general labour shows gang type options',
    await page.locator('[data-when-category="general"]').isVisible()
  );
  await page.selectOption('#req-category', 'Skilled labour');
  check(
    'A5 skilled labour shows role options',
    await page.locator('[data-when-category*="skilled"]').isVisible()
  );

  // Mock EmailJS failure → honest error + mailto fallback
  await page.route('https://api.emailjs.com/**', (route) => route.abort('failed'));
  await page.fill('#req-fullname', 'Kwame Test');
  await page.fill('#req-company', 'Test Shipping Ltd');
  await page.fill('#req-phone', '0244000000');
  await page.fill('#req-email', 'kwame@example.com');
  await page.selectOption('#req-category', 'Equipment operators');
  await page.fill('#req-description', 'Need two forklift operators for a week in Tema.');
  await page.click('form[data-glcl-form="request"] button[type="submit"]');
  await page.waitForSelector('.form-alert--error.is-visible', { timeout: 10000 });
  const mailto = await page.locator('.form-alert--error a[href^="mailto:"]').getAttribute('href');
  check('A6 failed delivery shows honest error', true);
  check('A7 error state offers pre-filled email', mailto.includes('getlabourcompanylimited@gmail.com'));
  check(
    'A8 error state keeps the form visible (nothing lost)',
    await page.locator('form[data-glcl-form="request"]').isVisible()
  );

  // Mock EmailJS success → truthful success panel
  await page.unroute('https://api.emailjs.com/**');
  await page.route('https://api.emailjs.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );
  await page.click('form[data-glcl-form="request"] button[type="submit"]');
  await page.waitForSelector('[data-success-for="request"].is-visible', { timeout: 10000 });
  check('A9 successful send shows success panel', true);
  check(
    'A10 success panel offers call-back numbers',
    (await page.locator('[data-success-for="request"]').textContent()).includes('+233 30 396 1288')
  );
  await ctx.close();
}

// ---- Journey B: job seeker — careers → apply form ----
{
  const { ctx, page } = await newPage();
  await page.goto(`${base}/careers/`, { waitUntil: 'networkidle' });
  await page.click('a.btn--accent[href$="/apply/"]');
  await page.waitForURL('**/apply/');
  check('B1 careers leads to application form', page.url().includes('apply'));

  // Conditional equipment fields
  await page.selectOption('#app-category', 'Equipment operator');
  check(
    'B2 equipment category shows equipment checkboxes',
    await page.locator('[data-when-work="Equipment operator"]').isVisible()
  );

  // Validation: consent required
  await page.waitForTimeout(1600);
  await page.fill('#app-name', 'Ama Test');
  await page.fill('#app-phone', '0200000000');
  await page.fill('#app-location', 'Tema');
  await page.selectOption('#app-category', 'General labour');
  await page.fill('#app-skills', 'Two years warehouse work.');
  await page.click('form[data-glcl-form="apply"] button[type="submit"]');
  check(
    'B3 submit blocked without consent',
    await page.locator('#app-consent').evaluate((el) => !el.checkValidity())
  );

  // Successful mocked submission
  await page.check('#app-consent');
  await page.route('https://api.emailjs.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );
  await page.click('form[data-glcl-form="apply"] button[type="submit"]');
  await page.waitForSelector('[data-success-for="apply"].is-visible', { timeout: 10000 });
  check('B4 application success panel appears', true);
  await ctx.close();
}

// ---- Journey C: general visitor — contact links + mobile menu + FAQ ----
{
  const { ctx, page } = await newPage();
  await page.goto(`${base}/contact/`, { waitUntil: 'networkidle' });
  const tel = await page.locator('a[href="tel:+233303961288"]').first().getAttribute('href');
  const mail = await page.locator(`a[href^="mailto:getlabourcompanylimited"]`).first().getAttribute('href');
  check('C1 contact page has tel: links', tel === 'tel:+233303961288');
  check('C2 contact page has mailto: link', mail.startsWith('mailto:getlabourcompanylimited@gmail.com'));
  const maps = await page.locator('a[href*="maps.app.goo.gl"]').getAttribute('href');
  check('C3 map directions link present', maps.includes('maps.app.goo.gl'));
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.click('.nav-toggle');
  check('D1 mobile menu opens', await page.locator('#mobile-nav.is-open').isVisible());
  check(
    'D2 mobile menu has request CTA',
    await page.locator('#mobile-nav a.btn--accent').isVisible()
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('D3 Escape closes mobile menu', !(await page.locator('#mobile-nav').isVisible()));
  await ctx.close();
}

{
  const { ctx, page } = await newPage();
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const faq = page.locator('.faq-item').nth(1);
  await faq.locator('summary').click();
  check('D4 FAQ accordion opens on click', await faq.evaluate((el) => el.open));
  await ctx.close();
}

// ---- Journey E: sitemap + robots ----
{
  const { ctx, page } = await newPage();
  const res = await page.goto(`${base}/robots.txt`);
  check('E1 robots.txt served', res.status() === 200);
  const sm = await page.goto(`${base}/sitemap-index.xml`);
  check('E2 sitemap index served', sm.status() === 200);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('Failed:');
  failed.forEach((f) => console.log('  ✗', f.name, f.extra));
  process.exit(1);
}

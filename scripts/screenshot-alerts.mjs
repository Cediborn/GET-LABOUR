import { chromium } from 'playwright-core';

const EDGE =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = 'http://localhost:4321/GET-LABOUR';

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${base}/request-labour/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1600);
await page.click('form[data-glcl-form="request"] button[type="submit"]');
await page.waitForTimeout(400);
await page.screenshot({ path: 'shots/01-validation-alert.png' });

await page.route('https://api.emailjs.com/**', (r) => r.abort('failed'));
await page.fill('#req-fullname', 'Kwame Mensah');
await page.fill('#req-company', 'Meridian Shipping');
await page.fill('#req-phone', '0244123456');
await page.fill('#req-email', 'kwame@meridian.example');
await page.selectOption('#req-category', 'General / non-skilled labour');
await page.fill('#req-description', 'Stevedoring gang of 10 needed for berth 3, night shifts.');
await page.click('form[data-glcl-form="request"] button[type="submit"]');
await page.waitForSelector('.form-alert--error.is-visible');
await page.screenshot({ path: 'shots/02-delivery-fallback-alert.png' });

await browser.close();
console.log('alert shots done');

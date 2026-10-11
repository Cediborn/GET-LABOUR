// Visual QA screenshots via Playwright (uses system Edge).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const EDGE =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const base = 'http://localhost:4321/GET-LABOUR';
const shots = [
  { name: 'home-01-hero', url: `${base}/`, w: 1440, h: 900 },
  { name: 'home-02-intro', url: `${base}/`, w: 1440, h: 900, scroll: 900 },
  { name: 'home-03-services', url: `${base}/`, w: 1440, h: 900, scroll: 1800 },
  { name: 'home-04-services2', url: `${base}/`, w: 1440, h: 900, scroll: 2900 },
  { name: 'home-05-why', url: `${base}/`, w: 1440, h: 900, scroll: 4200 },
  { name: 'home-06-steps', url: `${base}/`, w: 1440, h: 900, scroll: 5100 },
  { name: 'home-07-employment', url: `${base}/`, w: 1440, h: 900, scroll: 6000 },
  { name: 'home-08-faq-cta', url: `${base}/`, w: 1440, h: 900, scroll: 8200 },
  { name: 'home-mobile-01', url: `${base}/`, w: 390, h: 844 },
  { name: 'home-mobile-02', url: `${base}/`, w: 390, h: 844, scroll: 800 },
  { name: 'home-mobile-03', url: `${base}/`, w: 390, h: 844, scroll: 1700 },
  { name: 'home-mobile-menu', url: `${base}/`, w: 390, h: 844, action: 'menu' },
  { name: 'services-desktop', url: `${base}/services/`, w: 1440, h: 900 },
  { name: 'service-detail', url: `${base}/services/equipment-operators/`, w: 1440, h: 900 },
  { name: 'service-detail-2', url: `${base}/services/equipment-operators/`, w: 1440, h: 900, scroll: 900 },
  { name: 'request-desktop', url: `${base}/request-labour/`, w: 1440, h: 900, scroll: 500 },
  { name: 'request-mobile', url: `${base}/request-labour/`, w: 390, h: 844, scroll: 600 },
  { name: 'apply-mobile', url: `${base}/apply/`, w: 390, h: 844, scroll: 700 },
  { name: 'careers-desktop', url: `${base}/careers/`, w: 1440, h: 900 },
  { name: 'contact-desktop', url: `${base}/contact/`, w: 1440, h: 900 },
  { name: 'about-desktop', url: `${base}/about/`, w: 1440, h: 900 },
  { name: 'about-desktop-2', url: `${base}/about/`, w: 1440, h: 900, scroll: 1600 },
  { name: 'privacy-desktop', url: `${base}/privacy/`, w: 1440, h: 900 },
];

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const errors = [];

for (const shot of shots) {
  const ctx = await browser.newContext({
    viewport: { width: shot.w, height: shot.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${shot.name}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${shot.name}: ${err.message}`));
  page.on('requestfailed', (req) =>
    errors.push(`[requestfailed] ${shot.name}: ${req.url()} — ${req.failure()?.errorText}`)
  );
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 45000 });
  if (shot.action === 'menu') {
    await page.click('.nav-toggle');
    await page.waitForTimeout(400);
  }
  if (shot.scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `shots/${shot.name}.png` });
  console.log('shot:', shot.name);
  await ctx.close();
}

await browser.close();
if (errors.length) {
  console.log('\nIssues:');
  [...new Set(errors)].forEach((e) => console.log('  !', e));
} else {
  console.log('\nNo console/network errors.');
}

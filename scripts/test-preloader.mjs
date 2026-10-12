/* Preloader QA: frames, session gating, reduced-motion, breakpoints. */
import { chromium } from 'playwright-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://localhost:4321/GET-LABOUR';
const OUT = 'C:/Users/damie/Desktop/RANDOM SHI/LA MUSA/shots';

const run = async () => {
  const browser = await chromium.launch({ executablePath: EDGE });
  const errors = [];

  // --- Desktop: capture animation frames on first visit ---
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });

  // Frame 1: early (wheel rotating in)
  await page.waitForTimeout(350);
  const pre1 = await page.$('#glcl-preloader');
  console.log('t=350ms preloader present:', !!pre1);
  if (pre1) await pre1.screenshot({ path: `${OUT}/preloader-1-wheel.png` });

  // Frame 2: mid (worker revealing)
  await page.waitForTimeout(700); // ~1050ms total
  const pre2 = await page.$('#glcl-preloader');
  if (pre2) await pre2.screenshot({ path: `${OUT}/preloader-2-worker.png` });

  // Frame 3: wordmark visible
  await page.waitForTimeout(800); // ~1850ms total
  const pre3 = await page.$('#glcl-preloader');
  if (pre3) await pre3.screenshot({ path: `${OUT}/preloader-3-wordmark.png` });

  // Wait for dismissal (max 3.1s + fade)
  await page.waitForTimeout(2000); // ~3850ms total
  const preGone = await page.$('#glcl-preloader');
  console.log('t~3.9s preloader removed:', !preGone);

  // sessionStorage flag set
  const flag = await page.evaluate(() => sessionStorage.getItem('glcl-preloader'));
  console.log('sessionStorage flag:', flag);

  // Full page screenshot after dismissal (desktop)
  await page.screenshot({ path: `${OUT}/preloader-after-desktop.png` });

  // --- Internal navigation: preloader must NOT reappear ---
  await page.click('a[href="/GET-LABOUR/services/"]');
  await page.waitForLoadState('domcontentloaded');
  const navPre = await page.$('#glcl-preloader');
  console.log('internal nav preloader absent:', !navPre);

  // --- Fresh context + reduced motion: preloader hidden ---
  const ctxRM = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    reducedMotion: 'reduce',
  });
  const pageRM = await ctxRM.newPage();
  await pageRM.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await pageRM.waitForTimeout(300);
  const rmPre = await pageRM.$('#glcl-preloader');
  const rmVisible = rmPre ? await rmPre.isVisible() : false;
  console.log('reduced-motion preloader hidden:', !rmVisible);
  await ctxRM.close();

  // --- Mobile first visit: frames + dismissal ---
  const ctxM = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const pageM = await ctxM.newPage();
  pageM.on('console', (m) => { if (m.type() === 'error') errors.push(`m-console: ${m.text()}`); });
  pageM.on('pageerror', (e) => errors.push(`m-pageerror: ${e.message}`));
  await pageM.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await pageM.waitForTimeout(1600);
  const preM = await pageM.$('#glcl-preloader');
  console.log('mobile mid-animation present:', !!preM);
  if (preM) await pageM.screenshot({ path: `${OUT}/preloader-mobile-mid.png` });
  await pageM.waitForTimeout(2300);
  const preMGone = await pageM.$('#glcl-preloader');
  console.log('mobile preloader removed:', !preMGone);
  await pageM.screenshot({ path: `${OUT}/preloader-after-mobile.png` });

  // --- No-JS simulation: preloader must not block (noscript style) ---
  const ctxNJ = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1366, height: 900 } });
  const pageNJ = await ctxNJ.newPage();
  await pageNJ.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const njPre = await pageNJ.$('#glcl-preloader');
  const njVisible = njPre ? await njPre.isVisible() : false;
  console.log('no-JS preloader hidden:', !njVisible);
  await ctxNJ.close();

  console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });

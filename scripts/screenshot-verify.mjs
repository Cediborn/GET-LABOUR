import { chromium } from 'playwright-core';

const EDGE =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = 'http://localhost:4321/LA-MUSA';

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${base}/services/general-labour/`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'shots/03-general-labour-hero.png' });

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: 'shots/04-home-footer.png' });

await browser.close();
console.log('done');

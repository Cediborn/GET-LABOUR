import { chromium } from 'playwright-core';

const EDGE =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = 'http://localhost:4321/GET-LABOUR';

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

const shot = async (url, selector, path) => {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path });
  console.log('shot', path);
};

await shot(`${base}/`, 'text=What guides us', 'shots/new-home-values.png');
await shot(`${base}/`, 'text=A workforce that is prepared', 'shots/new-home-welfare.png');
await shot(`${base}/about/`, 'text=What the company was built to do', 'shots/new-about-mission.png');
await shot(`${base}/about/`, 'text=An earlier company document', 'shots/new-about-history.png');
await shot(`${base}/about/`, 'text=Responsible labour supply', 'shots/new-about-welfare.png');
await shot(`${base}/services/`, 'text=Other documented business activities', 'shots/new-services-activities.png');

await browser.close();
console.log('done');

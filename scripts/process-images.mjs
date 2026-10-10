// One-off asset pipeline: converts downloaded source photos into optimized
// site assets (WebP images, logo mark, favicons, Open Graph image).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('assets-dl');
const OUT = path.resolve('src/assets/img');
const PUB = path.resolve('public');
await mkdir(OUT, { recursive: true });
await mkdir(PUB, { recursive: true });

const cropWebp = async (src, out, extract, resize, quality = 74) => {
  let pipeline = sharp(path.join(SRC, src));
  if (extract) pipeline = pipeline.extract(extract);
  if (resize) pipeline = pipeline.resize(resize.w, resize.h, { fit: 'cover', position: 'attention' });
  await pipeline.webp({ quality, effort: 5 }).toFile(path.join(OUT, out));
  console.log('webp:', out);
};

// --- Photographic assets -------------------------------------------------
// Hero: authentic Tema container terminal at night (Wikimedia, CC BY-SA 3.0)
await cropWebp('wm1.jpg', 'hero-tema-terminal.webp',
  { left: 0, top: 210, width: 1920, height: 1120 },
  { w: 1920, h: 1180 }, 72);

// Open Graph share image (1200x630)
await sharp(path.join(SRC, 'wm1.jpg'))
  .extract({ left: 0, top: 260, width: 1920, height: 1010 })
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .webp({ quality: 78 })
  .toFile(path.join(PUB, 'og-image.webp'));
console.log('og-image done');

await cropWebp('u2.jpg', 'container-yard-aerial.webp', null, { w: 1400 }, 72);
await cropWebp('u1.jpg', 'ships-at-berth.webp', null, { w: 1400 }, 72);
await cropWebp('u4.jpg', 'vessel-at-sea.webp', null, { w: 1300 }, 72);
await cropWebp('u3.jpg', 'gantry-cranes.webp', null, { w: 1300 }, 72);
await cropWebp('fork.jpg', 'forklift-operations.webp', null, { w: 1200 }, 76);
await cropWebp('about.jpg', 'glcl-team.webp', null, { w: 1240 }, 76);
await cropWebp('labo.jpg', 'labour-muster.webp', null, { w: 1100 }, 76);
await cropWebp('ref.jpg', 'supervisor-vests.webp', null, { w: 600 }, 78);
await cropWebp('NS1.jpg', 'warehouse-loading.webp', null, { w: 1100 }, 74);
await cropWebp('NS2.jpg', 'warehouse-sacks.webp', null, { w: 720 }, 76);
await cropWebp('ship.jpg', 'vessel-aerial.webp', null, { w: 735 }, 76);
await cropWebp('container.jpg', 'crane-lift.webp', null, { w: 640 }, 76);

// --- Logo mark: crop the wheel emblem from the official logo lockup -------
await sharp(path.join(SRC, 'laga.jpg'))
  .extract({ left: 24, top: 12, width: 560, height: 570 })
  .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'logo-mark.png'));
console.log('logo-mark done');

await sharp(path.join(OUT, 'logo-mark.png'))
  .resize(180, 180)
  .png()
  .toFile(path.join(PUB, 'apple-touch-icon.png'));

// --- Favicons ------------------------------------------------------------
const iconBase = sharp(path.join(SRC, 'icon.jpg')).flatten({ background: '#ffffff' });
await iconBase.clone().resize(512, 512, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(PUB, 'favicon-512.png'));
await iconBase.clone().resize(192, 192, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(PUB, 'favicon-192.png'));
await iconBase.clone().resize(32, 32, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(PUB, 'favicon-32.png'));
console.log('favicons done');

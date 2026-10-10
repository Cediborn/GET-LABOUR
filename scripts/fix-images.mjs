// Re-generate the three port images with the correct source mapping
// (earlier run had shifted file assignments).
import sharp from 'sharp';
import path from 'node:path';

const SRC = path.resolve('assets-dl');
const OUT = path.resolve('src/assets/img');

const cropWebp = async (src, out, extract, resize, quality = 74) => {
  let pipeline = sharp(path.join(SRC, src));
  if (extract) pipeline = pipeline.extract(extract);
  if (resize) pipeline = pipeline.resize(resize.w, resize.h, { fit: 'cover', position: 'attention' });
  await pipeline.webp({ quality, effort: 5 }).toFile(path.join(OUT, out));
  console.log('webp:', out);
};

// u2 = ships berthed under gantry cranes
await cropWebp('u2.jpg', 'ships-at-berth.webp', null, { w: 1400 }, 72);
// u1 = aerial view of a container yard
await cropWebp('u1.jpg', 'container-yard-aerial.webp', null, { w: 1400 }, 72);
// u3 = container vessel under way
await cropWebp('u3.jpg', 'vessel-at-sea.webp', null, { w: 1300 }, 72);
console.log('done');

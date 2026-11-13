// Copies only the catalog assets used by the UI into public/assets/revo-ui/catalog,
// preserving ORIGINAL filenames and never touching assets/source (originals stay unmodified).
// Also converts the generated station sheets' atlases into Phaser JSON-hash atlases.
// Usage: node scripts/ui-assets/sync-ui-assets.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/assets/asset-catalog.json'), 'utf8'));
const out = path.join(root, 'public/assets/revo-ui/catalog');

// "index" = 1-based position of the asset inside its category in asset-catalog.json.
const WANT = {
  Tools_Equipment: [1, 4, 5, 6, 7, 9, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 28, 29, 36, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
  UI_Icons: [2, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 20, 21, 22, 29, 31, 32, 39, 42, 44, 46, 47, 48, 49, 50],
  Buildings: [1, 2, 3, 4, 5, 6, 7]
};

const manifest = {};
fs.mkdirSync(out, { recursive: true });
for (const [cat, idxs] of Object.entries(WANT)) {
  const list = catalog.filter((a) => a.category === cat);
  for (const i of idxs) {
    const a = list[i - 1];
    if (!a) throw new Error(`Missing ${cat} #${i}`);
    const dir = path.join(out, cat);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(path.join(root, a.sourceFolder), path.join(dir, a.originalFilename));
    manifest[`${cat}:${i}`] = { file: `assets/revo-ui/catalog/${cat}/${a.originalFilename}`, assetId: a.assetId, w: a.dimensions.width, h: a.dimensions.height, license: a.licenseStatus, approval: a.approvalStatus };
  }
}
fs.writeFileSync(path.join(root, 'src/features/ui/catalogManifest.json'), JSON.stringify(manifest, null, 1));

// Station sheets -> Phaser JSON hash atlases
const sd = path.join(root, 'public/assets/revo-ui/stations');
for (const f of fs.readdirSync(sd).filter((n) => n.endsWith('_atlas_native.json'))) {
  const a = JSON.parse(fs.readFileSync(path.join(sd, f), 'utf8'));
  const slug = f.replace('_atlas_native.json', '');
  const png = `${slug}.png`;
  const frames = {};
  for (const [name, r] of Object.entries(a)) frames[name] = { frame: { x: r.x, y: r.y, w: r.w, h: r.h }, rotated: false, trimmed: false, spriteSourceSize: { x: 0, y: 0, w: r.w, h: r.h }, sourceSize: { w: r.w, h: r.h } };
  fs.writeFileSync(path.join(sd, `${slug}.json`), JSON.stringify({ frames, meta: { image: png, format: 'RGBA8888', size: { w: 0, h: 0 }, scale: '1' } }));
}
console.log('synced', Object.keys(manifest).length, 'catalog assets');

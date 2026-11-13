// Small pixel-art icons drawn from character maps (no extra image files needed).
// Original catalog icons are used wherever a suitable one exists (see assetKeys.js).
import { COLORS as C } from './tokens.js';

const PAL = { O: 0x0a1020, W: C.white, C: C.cyan, c: C.cyanLo, R: C.orange, r: C.orangeLo, G: 0x7f8da3, Y: C.warning, g: C.success, B: 0x3a5a8c };

const MAPS = {
  drop: [
    '....OO......', '....OCCO....', '....OCCO....', '...OCCCCO...', '...OCWCCO...', '..OCWCCCCO..', '..OCWCCCCO..',
    '.OCCCCCCCCO.', '.OCCCCCCccO.', '.OCCCCCCccO.', '.OCCCCCcccO.', '..OCCCcccO..', '...OCCccO...', '....OOOO....'
  ],
  battery: [
    'OOOOOOOOOOOO..', 'OGGGGGYGGGGO..', 'OGGGGYYGGGGOOO', 'OGGGYYYYGGGOGO', 'OGGGGGYYGGGOGO', 'OGGGGGYGGGGOOO', 'OOOOOOOOOOOO..'
  ],
  food: [
    '............', '..OOO..OOO..', '.OggGO.OGggO', '.OgGGOOOGGgO', '..OgGGOGGgO.', '...OOOOOOO..', '.....OgO....',
    '.....OgO....', '.....OgO....', '....OOgOO...', '...OBBBBBO..', '...OBBBBBO..', '....OOOOO...'
  ],
  oxygen: [
    '...OO...', '..OCCO..', '...OO...', '..OOOO..', '.OWWWWO.', '.OWCCWO.', '.OWCCWO.', '.OWWWWO.',
    '.OWWWWO.', '.ORRRRO.', '.ORRRRO.', '.OWWWWO.', '..OOOO..'
  ],
  solar: [
    '.OOOOOOOOOO.', 'OBBOBBOBBOBO', 'OBBOBBOBBOBO', 'OOOOOOOOOOOO', 'OBBOBBOBBOBO', 'OBBOBBOBBOBO', 'OOOOOOOOOOOO', '.....OO.....', '...OOOOOO...'
  ],
  clock: [
    '..OOOOOO..', '.OWWWWWWO.', 'OWWWWRWWWO', 'OWWWWRWWWO', 'OWWWWRRWWO', 'OWWWWWWWWO', '.OWWWWWWO.', '..OOOOOO..'
  ],
  star: [
    '.....OO.....', '.....OYO....', '....OYYO....', 'OOOOOYYOOOOO', '.OYYYYYYYYO.', '..OYYYYYYO..', '..OYYYYYYO..', '.OYYYOOYYYO.', '.OYYO..OYYO.', '.OOO....OOO.'
  ]
};

export function iconSize(name) {
  const m = MAPS[name];
  return m ? { w: m[0].length, h: m.length } : { w: 12, h: 12 };
}

// Draws the icon as filled rectangles into a Phaser Graphics object. `px` = pixels per icon pixel.
export function drawPixelIcon(g, name, x, y, px = 2, tint = null) {
  const m = MAPS[name];
  if (!m) return;
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      const ch = m[r][c];
      if (ch === '.') continue;
      g.fillStyle(tint && ch !== 'O' ? tint : PAL[ch], 1);
      g.fillRect(x + c * px, y + r * px, px, px);
    }
  }
}

export function pixelIcon(scene, name, x, y, px = 2, tint = null) {
  const g = scene.add.graphics();
  drawPixelIcon(g, name, 0, 0, px, tint);
  g.setPosition(x, y);
  const s = iconSize(name);
  g.iconW = s.w * px; g.iconH = s.h * px;
  return g;
}
export const hasPixelIcon = (n) => Object.hasOwn(MAPS, n);

import * as Phaser from 'phaser';
import { UI_FONT, AR_FONT } from '../config/constants.js';
import { drawMarsBg, makeButton, goTo, clamp } from '../utils/ui.js';
import { AudioFX } from '../utils/audio.js';
import { INSTRUCTION_PAGES, BRIEFING_PAGES } from '../data/pagesData.js';

export class PagedScene extends Phaser.Scene {
  constructor(key, tag, pages) { super(key); this.tag = tag; this.pages = pages; }

  create() {
    this.page = 0; this._leaving = false;
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.build();
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.build, this));
    const kb = this.input.keyboard;
    kb.on('keydown-LEFT',  () => this.turn(1));
    kb.on('keydown-RIGHT', () => this.turn(-1));
    kb.on('keydown-ESC',   () => goTo(this, 'Menu'));
  }

  turn(d) {
    const n = clamp(this.page + d, 0, this.pages.length - 1);
    if (n === this.page) return;
    this.page = n; AudioFX.blip(560, 0.06, 'square', 0.07); this.build();
  }

  build() {
    this._leaving = false;
    this.tweens.killAll();
    this.children.removeAll(true);
    drawMarsBg(this);
    const w = this.scale.width, h = this.scale.height;
    const pw = Math.min(w - 24, 920), px = (w - pw) / 2, py = 12, ph = h - 24;

    const g = this.add.graphics();
    g.fillStyle(0x12060a, 0.88); g.fillRect(px, py, pw, ph);
    g.lineStyle(3, 0xff8a3d, 1); g.strokeRect(px, py, pw, ph);
    g.lineStyle(1, 0x7c2d12, 1); g.strokeRect(px + 6, py + 6, pw - 12, ph - 12);

    const pg = this.pages[this.page];
    const fsT = clamp(Math.floor(pw / 22), 18, 30);
    this.add.text(px + 22, py + 16, this.tag + '  ' + (this.page + 1) + '/' + this.pages.length,
      { fontFamily: UI_FONT, fontSize: '14px', color: '#c2561f', fontStyle: 'bold' });
    const title = this.add.text(px + pw - 22, py + 40, pg.t,
      { fontFamily: AR_FONT, fontSize: fsT + 'px', color: '#ffd23d', fontStyle: 'bold', rtl: true, align: 'right' }).setOrigin(1, 0);

    const top = py + 40 + title.height + 18;
    const footerH = 64;
    const maxH = py + ph - footerH - top - 8;
    let fs = clamp(Math.floor(pw / 28), 14, 22), body;
    do {
      if (body) body.destroy();
      body = this.add.text(px + pw - 26, top, pg.b.join('\n\n'), {
        fontFamily: AR_FONT, fontSize: fs + 'px', color: '#ffe9c7', rtl: true, align: 'right',
        wordWrap: { width: pw - 60, useAdvancedWrap: true }, lineSpacing: Math.round(fs * 0.35)
      }).setOrigin(1, 0);
      fs--;
    } while (body.height > maxH && fs >= 11);

    const fy = py + ph - 34, bh = 40;
    const small = Math.max(14, Math.min(18, Math.floor(pw / 40)));
    makeButton(this, px + 22 + 75, fy, 150, bh, 'MENU', () => goTo(this, 'Menu'), { fs: small, back: true });
    const nextB = makeButton(this, px + pw - 22 - 55, fy, 110, bh, 'التالي ▶', () => this.turn(1), { fs: small, font: AR_FONT });
    const prevB = makeButton(this, px + pw - 22 - 55 - 120, fy, 110, bh, '◀ السابق', () => this.turn(-1), { fs: small, font: AR_FONT });
    if (this.page === this.pages.length - 1) nextB.setAlpha(0.35);
    if (this.page === 0) prevB.setAlpha(0.35);
  }
}

export class InstructionsScene extends PagedScene { constructor() { super('Instructions', 'INSTRUCTIONS', INSTRUCTION_PAGES); } }
export class BriefingScene extends PagedScene { constructor() { super('Briefing', 'MISSION BRIEFING', BRIEFING_PAGES); } }

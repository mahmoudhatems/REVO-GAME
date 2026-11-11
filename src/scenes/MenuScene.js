import * as Phaser from 'phaser';
import { UI_FONT } from '../config/constants.js';
import { drawMarsBg, addLogo, makeButton, addSoundControls, goTo, clamp } from '../utils/ui.js';
import { AudioFX } from '../utils/audio.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this._leaving = false;
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.build();
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.build, this));

    const kick = () => { AudioFX.init(); AudioFX.startMusic(); };
    this.input.once('pointerdown', kick);
    this.input.keyboard.once('keydown', kick);
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    if (AudioFX.ctx && AudioFX.ctx.state === 'running') AudioFX.startMusic();
  }

  startGame() { AudioFX.init(); AudioFX.stopMusic(); goTo(this, 'Intro'); }

  build() {
    this._leaving = false;
    this.tweens.killAll();
    this.children.removeAll(true);
    drawMarsBg(this);
    const w = this.scale.width, h = this.scale.height;

    const logoH = h * 0.3;
    const logo = addLogo(this, w / 2, 14 + logoH / 2, Math.min(w * 0.8, 640), logoH);
    this.tweens.add({ targets: logo, y: logo.y + 5, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const remaining = h - logoH - 90;
    const bh = clamp(remaining / 3.5, 38, 62), gap = bh * 0.28;
    const bw = clamp(w * 0.7, 240, 400);
    let y = 14 + logoH + 22 + bh / 2;
    const items = [
      ['START GAME', () => this.startGame()],
      ['INSTRUCTIONS', () => goTo(this, 'Instructions')],
      ['MISSION BRIEFING', () => goTo(this, 'Briefing')]
    ];
    items.forEach(([label, cb], i) => {
      const b = makeButton(this, w / 2, y, bw, bh, label, cb);
      if (i === 0) this.tweens.add({ targets: b, scale: 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      y += bh + gap;
    });

    this.add.text(14, h - 26, 'NASA Space Apps 2026 · Junior Astronaut Mission Trainer', { fontFamily: UI_FONT, fontSize: '12px', color: '#c2561f' });
    addSoundControls(this);
  }
}

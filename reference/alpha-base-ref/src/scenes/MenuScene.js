
import { UI_FONT } from '../config/constants.js';

import {
  drawMarsBg,
  addLogo,
  makeButton,
  addSoundControls,
  goTo,
  clamp
} from '../utils/ui.js';

import { AudioFX } from '../utils/audio.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this._leaving = false;

    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.build();

    // إعادة ترتيب عناصر القائمة عند تغيير الشاشة
    this.scale.on('resize', this.build, this);

    this.events.once('shutdown', () => {
      this.scale.off('resize', this.build, this);
    });

    const kick = () => {
      AudioFX.init();
      AudioFX.startMusic();
    };

    this.input.once('pointerdown', kick);
    this.input.keyboard.once('keydown', kick);

    this.input.keyboard.on('keydown-ENTER', () => {
      this.startGame();
    });

    if (AudioFX.ctx && AudioFX.ctx.state === 'running') {
      AudioFX.startMusic();
    }
  }

  startGame() {
    AudioFX.init();
    AudioFX.stopMusic();

    goTo(this, 'Intro');
  }

  build() {
    this.tweens.killAll();
    this.children.removeAll(true);

    drawMarsBg(this);

    const w = this.scale.width;
    const h = this.scale.height;

    // ارتفاع الشعار حسب الشاشة
    const logoH = clamp(
      h * 0.25,
      70,
      190
    );

    const logoW = Math.min(
      w * 0.8,
      640
    );

    const logo = addLogo(
      this,
      w / 2,
      12 + logoH / 2,
      logoW,
      logoH
    );

    // حركة بسيطة للشعار
    this.tweens.add({
      targets: logo,
      y: logo.y + 5,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // أحجام الأزرار حسب ارتفاع الشاشة
    const bh = clamp(
      (h - logoH - 100) / 3.5,
      34,
      62
    );

    const gap = bh * 0.2;

    const bw = Math.min(
      w - 32,
      clamp(w * 0.7, 240, 400)
    );

    let y = 10 + logoH + 6 + bh / 2;

    const items = [
      ['START GAME', () => this.startGame()],
      ['INSTRUCTIONS', () => goTo(this, 'Instructions')],
      ['MISSION BRIEFING', () => goTo(this, 'Briefing')]
    ];

    items.forEach(([label, cb], i) => {
      const b = makeButton(
        this,
        w / 2,
        y,
        bw,
        bh,
        label,
        cb
      );

      if (i === 0) {
        this.tweens.add({
          targets: b,
          scale: 1.04,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      y += bh + gap;
    });

    // النص السفلي
    this.add.text(
      14,
      h - 26,
      'NASA Space Apps 2026 · Junior Astronaut Mission Trainer',
      {
        fontFamily: UI_FONT,
        fontSize: w < 500 ? '9px' : '12px',
        color: '#c2561f'
      }
    );

    // أزرار الصوت
    addSoundControls(this);
  }
}

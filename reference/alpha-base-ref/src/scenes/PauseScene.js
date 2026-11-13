
import { UI_FONT, AR_FONT } from '../config/constants.js';

import {
  makeButton,
  clamp
} from '../utils/ui.js';

import { AudioFX } from '../utils/audio.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause');
  }

  create() {
    this.confirming = false;

    this.build();

    // تحديث شاشة الإيقاف عند تغيير أبعاد الشاشة
    this.scale.on('resize', this.build, this);

    this.events.once('shutdown', () => {
      this.scale.off('resize', this.build, this);
    });
  }

  handleEsc() {
    if (this.confirming) {
      this.confirming = false;
      this.build();
    } else {
      this.resume();
    }
  }

  resume() {
    this.scene.resume('Game');
    this.scene.stop();
  }

  exitToMenu() {
    this.sound.stopAll();

    AudioFX.stopMusic();

    this.scene.stop('UI');
    this.scene.stop('Game');

    this.scene.start('Menu');
  }

  build() {
    this.children.removeAll(true);

    const w = this.scale.width;
    const h = this.scale.height;

    // خلفية شفافة تغطي الشاشة بالكامل
    this.add.rectangle(
      0,
      0,
      w,
      h,
      0x000000,
      0.7
    )
      .setOrigin(0)
      .setInteractive();

    // حجم لوحة الإيقاف
    const pw = Math.min(
      w - 24,
      440
    );

    const ph = Math.min(
      h - 24,
      this.confirming ? 260 : 300
    );

    const cx = w / 2;
    const cy = h / 2;

    // رسم اللوحة
    const g = this.add.graphics();

    g.fillStyle(0x12060a, 0.95);

    g.fillRect(
      cx - pw / 2,
      cy - ph / 2,
      pw,
      ph
    );

    g.lineStyle(3, 0xff8a3d, 1);

    g.strokeRect(
      cx - pw / 2,
      cy - ph / 2,
      pw,
      ph
    );

    // أحجام الأزرار
    const bh = clamp(
      ph * 0.17,
      38,
      52
    );

    const bw = Math.min(
      pw * 0.72,
      pw - 24
    );

    if (!this.confirming) {

      // عنوان الشاشة
      this.add.text(
        cx,
        cy - ph / 2 + 36,
        'PAUSED',
        {
          fontFamily: UI_FONT,
          fontSize: clamp(w * 0.075, 24, 30) + 'px',
          color: '#ffd23d',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5);

      // العنوان العربي
      this.add.text(
        cx,
        cy - ph / 2 + 68,
        'إيقاف مؤقت',
        {
          fontFamily: AR_FONT,
          fontSize: '18px',
          color: '#ff8a3d'
        }
      ).setOrigin(0.5);

      // زر الاستئناف
      makeButton(
        this,
        cx,
        cy + 4,
        bw,
        bh,
        'RESUME',
        () => this.resume()
      );

      // زر القائمة الرئيسية
      makeButton(
        this,
        cx,
        cy + 4 + bh + 16,
        bw,
        bh,
        'MAIN MENU',
        () => {
          this.confirming = true;
          this.build();
        },
        {
          back: true
        }
      );

    } else {

      // رسالة التأكيد
      this.add.text(
        cx,
        cy - ph / 2 + 40,
        'الرجوع للقائمة الرئيسية؟',
        {
          fontFamily: AR_FONT,
          fontSize: clamp(w * 0.06, 17, 22) + 'px',
          color: '#ffd23d',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5);

      // توضيح فقدان التقدم
      this.add.text(
        cx,
        cy - ph / 2 + 84,
        'هتخرج من المرحلة الحالية\nوالتقدم اللي وصلتله هيتفقد.',
        {
          fontFamily: AR_FONT,
          fontSize: clamp(w * 0.045, 14, 16) + 'px',
          color: '#ffe9c7',
          align: 'center',
          rtl: true
        }
      ).setOrigin(0.5, 0);

      // زر YES
      makeButton(
        this,
        cx - bw * 0.26,
        cy + ph / 2 - 46,
        bw * 0.48,
        bh,
        'YES',
        () => this.exitToMenu(),
        {
          back: true
        }
      );

      // زر NO
      makeButton(
        this,
        cx + bw * 0.26,
        cy + ph / 2 - 46,
        bw * 0.48,
        bh,
        'NO',
        () => {
          this.confirming = false;
          this.build();
        }
      );
    }
  }
}

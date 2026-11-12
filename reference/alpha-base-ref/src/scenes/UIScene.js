
import { makeButton, clamp } from '../utils/ui.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.isMobile =
      !this.sys.game.device.os.desktop ||
      navigator.userAgent.match(/Android|iPhone|iPad/i) !== null;

    this.input.addPointer(2);

    // زر الإيقاف المؤقت
    this.btn = makeButton(
      this,
      this.scale.width - 40,
      40,
      46,
      40,
      'II',
      () => this.togglePause(),
      { fs: 20 }
    );

    // أزرار التحكم باللمس
    this.pad = {};

    if (this.isMobile) {
      const vpad = () => this.game.vpad || {};

      const make = (key, label, size, fill, txtColor) => {
        // خلفية الزر
        const rect = this.add.rectangle(
          0,
          0,
          size,
          size,
          fill,
          0.75
        );

        rect
          .setStrokeStyle(2, 0xffffff, 0.7)
          .setInteractive()
          .setDepth(10);

        // نص الزر
        const txt = this.add.text(
          0,
          0,
          label,
          {
            fontFamily: 'Arial',
            fontSize: `${Math.round(size * 0.55)}px`,
            color: txtColor,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
          }
        )
          .setOrigin(0.5)
          .setDepth(11);

        let visualScale = 1;

        // تغيير شكل الزر عند الضغط
        const press = (on) => {
          const v = vpad();

          v[key] = on;

          rect.setFillStyle(
            fill,
            on ? 0.95 : 0.75
          );

          rect.setStrokeStyle(
            on ? 3 : 2,
            on ? 0xffd23d : 0xffffff,
            1
          );

          txt.setScale(
            visualScale * (on ? 0.9 : 1)
          );
        };

        rect.on('pointerdown', () => press(true));

        rect.on('pointerover', (pointer) => {
          if (pointer.isDown) press(true);
        });

        rect.on('pointerup', () => press(false));

        rect.on('pointerout', () => press(false));

        this.pad[key] = {
          rect,
          txt,
          size,

          // تغيير حجم الزر مع الحفاظ على مساحة الضغط
          setVisualScale: (scale) => {
            visualScale = scale;

            rect.setScale(scale);
            txt.setScale(scale);
          }
        };
      };

      // أزرار الاتجاهات
      make('up', '↑', 54, 0x263747, '#ffffff');
      make('down', '↓', 54, 0x263747, '#ffffff');
      make('left', '←', 54, 0x263747, '#ffffff');
      make('right', '→', 54, 0x263747, '#ffffff');

      // زر التفاعل
      make('action', 'E', 66, 0xffd23d, '#171717');
    }

    this.place();

    // تحديث الأماكن عند تغيير حجم الشاشة
    this.scale.on('resize', this.place, this);

    // تنظيف الأزرار عند إغلاق المشهد
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.place, this);

      const v = this.game.vpad;

      if (v) {
        Object.keys(v).forEach(key => {
          v[key] = false;
        });
      }
    });

    // اختصارات الكيبورد
    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });

    this.input.keyboard.on('keydown-P', () => {
      this.togglePause();
    });
  }

  // تحديد أماكن الأزرار حسب أبعاد الشاشة
  place() {
    const w = this.scale.width;
    const h = this.scale.height;

    // زر Pause
    this.btn.setPosition(
      w - 42,
      42
    );

    if (!this.isMobile) return;

    // مسافات آمنة من أطراف الشاشة
    const margin = Math.max(
      22,
      Math.min(w, h) * 0.055
    );

    // حجم مجموعة الاتجاهات
    const buttonSize = clamp(
      Math.min(w, h) * 0.14,
      48,
      68
    );

    const off = buttonSize + 8;

    // تحديد مكان مجموعة الاتجاهات
    const px = margin + buttonSize * 1.5;
    const py = h - margin - buttonSize * 1.5;

    // وضع كل زر
    const put = (key, x, y) => {
      const item = this.pad[key];

      item.rect.setPosition(x, y);
      item.txt.setPosition(x, y);
    };

    // تكبير وتصغير أزرار الاتجاهات
    ['up', 'down', 'left', 'right'].forEach(key => {
      const item = this.pad[key];

      item.setVisualScale(buttonSize / item.size);
    });

    put('up', px, py - off);
    put('down', px, py + off);
    put('left', px - off, py);
    put('right', px + off, py);

    // زر التفاعل في الجهة اليمنى
    const action = this.pad.action;

    const actionSize = clamp(
      Math.min(w, h) * 0.17,
      64,
      82
    );

    action.setVisualScale(actionSize / action.size);

    const actionX = w - margin - actionSize / 2;
    const actionY = h - margin - actionSize / 2;

    put('action', actionX, actionY);
  }

  update() {
    const paused = this.scene.isPaused('Game');

    this.btn.setVisible(!paused);

    if (this.isMobile) {
      Object.values(this.pad).forEach(({ rect, txt }) => {
        rect.setVisible(!paused);
        txt.setVisible(!paused);
      });
    }
  }

  togglePause() {
    if (this.scene.isPaused('Game')) {
      const p = this.scene.get('Pause');

      if (p && p.handleEsc) {
        p.handleEsc();
      }

    } else if (this.scene.isActive('Game')) {
      this.scene.pause('Game');
      this.scene.launch('Pause');
    }
  }
}

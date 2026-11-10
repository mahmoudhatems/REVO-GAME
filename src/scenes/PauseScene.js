import { UI_FONT, AR_FONT } from '../config/constants.js';
import { makeButton, clamp } from '../utils/ui.js';
import { AudioFX } from '../utils/audio.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  create() {
    this.confirming = false;
    this.build();
    this.scale.on('resize', this.build, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.build, this));
  }

  handleEsc() { if (this.confirming) { this.confirming = false; this.build(); } else this.resume(); }

  resume() { this.scene.resume('Game'); this.scene.stop(); }

  exitToMenu() {
    this.sound.stopAll();
    AudioFX.stopMusic();
    this.scene.stop('UI');
    this.scene.stop('Game');
    this.scene.start('Menu');
  }

  build() {
    this.children.removeAll(true);
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(0, 0, w, h, 0x000000, 0.7).setOrigin(0).setInteractive();
    const pw = Math.min(w - 24, 440), ph = Math.min(h - 24, this.confirming ? 260 : 300);
    const cx = w / 2, cy = h / 2;
    const g = this.add.graphics();
    g.fillStyle(0x12060a, 0.95); g.fillRect(cx - pw / 2, cy - ph / 2, pw, ph);
    g.lineStyle(3, 0xff8a3d, 1); g.strokeRect(cx - pw / 2, cy - ph / 2, pw, ph);

    const bh = clamp(ph * 0.17, 38, 52), bw = pw * 0.72;
    if (!this.confirming) {
      this.add.text(cx, cy - ph / 2 + 36, 'PAUSED', { fontFamily: UI_FONT, fontSize: '30px', color: '#ffd23d', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(cx, cy - ph / 2 + 68, 'إيقاف مؤقت', { fontFamily: AR_FONT, fontSize: '18px', color: '#ff8a3d' }).setOrigin(0.5);
      makeButton(this, cx, cy + 4, bw, bh, 'RESUME', () => this.resume());
      makeButton(this, cx, cy + 4 + bh + 16, bw, bh, 'MAIN MENU', () => { this.confirming = true; this.build(); }, { back: true });
    } else {
      this.add.text(cx, cy - ph / 2 + 40, 'الرجوع للقائمة الرئيسية؟', { fontFamily: AR_FONT, fontSize: '22px', color: '#ffd23d', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(cx, cy - ph / 2 + 84, 'هتخرج من المرحلة الحالية\nوالتقدم اللي وصلتله هيتفقد.', {
        fontFamily: AR_FONT, fontSize: '16px', color: '#ffe9c7', align: 'center', rtl: true
      }).setOrigin(0.5, 0);
      makeButton(this, cx - bw * 0.26, cy + ph / 2 - 46, bw * 0.48, bh, 'YES', () => this.exitToMenu(), { back: true });
      makeButton(this, cx + bw * 0.26, cy + ph / 2 - 46, bw * 0.48, bh, 'NO', () => { this.confirming = false; this.build(); });
    }
  }
}
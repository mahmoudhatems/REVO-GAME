import { ASTRONAUT_PATH, UI_FONT } from '../config/constants.js';
import { addLogo, goTo } from '../utils/ui.js';

export class PreloadScene extends Phaser.Scene {
  constructor() { 
    super('Preload'); 
  }

  preload() {
    this.started = this.time.now;
    this.layout();
    this.scale.on('resize', this.layout, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.layout, this));

    this.load.on('progress', (p) => { 
      this.progress = p; 
      this.drawBar(); 
    });
    this.load.on('loaderror', (f) => console.warn('Asset failed to load:', f.src));
    
    // ==========================================================
    // 1. تحميل صور رائد الفضاء بالخوذة (من 001 لـ 012)
    // ==========================================================
    const astroOutFiles = [
      'Astronaut_001_36x61.png', 'Astronaut_002_36x61.png', 'Astronaut_003_31x61.png',
      'Astronaut_004_36x61.png', 'Astronaut_005_30x61.png', 'Astronaut_006_31x61.png',
      'Astronaut_007_35x60.png', 'Astronaut_008_36x60.png', 'Astronaut_009_32x60.png',
      'Astronaut_010_31x59.png', 'Astronaut_011_31x59.png', 'Astronaut_012_31x60.png'
    ];

    astroOutFiles.forEach((filename, index) => {
      this.load.image(`astro_out_${index + 1}`, ASTRONAUT_PATH + filename);
    });

    // ==========================================================
    // 2. تحميل صور رائد الفضاء بدون خوذة (من 013 لـ 024)
    // ==========================================================
    const astroInFiles = [
      'Astronaut_013_37x67.png', 'Astronaut_014_37x67.png', 'Astronaut_015_29x67.png',
      'Astronaut_016_37x67.png', 'Astronaut_017_29x67.png', 'Astronaut_018_29x67.png',
      'Astronaut_019_34x58.png', 'Astronaut_020_31x58.png', 'Astronaut_021_28x57.png',
      'Astronaut_022_29x57.png', 'Astronaut_023_28x57.png', 'Astronaut_024_29x57.png'
    ];

    astroInFiles.forEach((filename, index) => {
      this.load.image(`astro_in_${index + 13}`, ASTRONAUT_PATH + filename);
    });

    // ==========================================================
    // 3. صورة القاعدة الكاملة
    // ==========================================================
    this.load.image('base_map', 'assets/base_map.png');
  }

  create() {
    // الصور pixel-art، فنمنع التنعيم لما بتتكبّر أو بتتصغّر
    this.textures.getTextureKeys().forEach(k => {
      if (/^(astro_|base_map)/.test(k)) this.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

    this.progress = 1;
    this.drawBar();
    const wait = Math.max(0, 1400 - (this.time.now - this.started));
    this.time.delayedCall(wait + 250, () => goTo(this, 'Menu'));
  }

  layout() {
    this.tweens.killAll();
    this.children.removeAll(true);
    const w = this.scale.width, h = this.scale.height;
    
    this.cameras.main.setBackgroundColor('#1b0b07');
    for (let i = 0; i < 50; i++) {
      this.add.rectangle(Math.random() * w, Math.random() * h, 2, 2, 0xff8a3d, 0.15 + Math.random() * 0.3);
    }

    this.logo = addLogo(this, w / 2, h * 0.4, Math.min(w * 0.75, 700), h * 0.38);
    this.tweens.add({ targets: this.logo, alpha: 0.65, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.barW = Math.min(w * 0.6, 420);
    this.barX = w / 2 - this.barW / 2; 
    this.barY = h * 0.68;
    this.barG = this.add.graphics();
    this.pctText = this.add.text(w / 2, this.barY + 34, '0%', { fontFamily: UI_FONT, fontSize: '18px', color: '#ffd23d', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(w / 2, this.barY - 22, 'LOADING', { fontFamily: UI_FONT, fontSize: '14px', color: '#ff8a3d' }).setOrigin(0.5);
    
    this.drawBar();
  }

  drawBar() {
    if (!this.barG) return;
    const p = this.progress || 0;
    this.barG.clear();
    this.barG.fillStyle(0x000000, 0.5); 
    this.barG.fillRect(this.barX, this.barY, this.barW, 16);
    this.barG.fillStyle(0xff8a3d, 1);
    const filled = Math.floor((this.barW - 6) * p / 8) * 8;
    this.barG.fillRect(this.barX + 3, this.barY + 3, filled, 10);
    this.barG.lineStyle(3, 0x7c2d12, 1); 
    this.barG.strokeRect(this.barX, this.barY, this.barW, 16);
    this.pctText.setText(Math.round(p * 100) + '%');
  }
}
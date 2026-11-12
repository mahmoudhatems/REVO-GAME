import { LOGO_CANDIDATES } from '../config/constants.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    this.cameras.main.setBackgroundColor('#1b0b07');
    this.idx = 0;
    const attempt = () => {
      if (this.textures.exists('logo') || this.idx >= LOGO_CANDIDATES.length) { this.scene.start('Preload'); return; }
      this.load.image('logo', LOGO_CANDIDATES[this.idx++]);
      this.load.once('complete', attempt);
      this.load.start();
    };
    attempt();
  }
}
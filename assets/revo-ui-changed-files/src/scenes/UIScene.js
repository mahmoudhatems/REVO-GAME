import * as Phaser from 'phaser';

// Keyboard owner for pause toggling. The visible pause button now lives in the global HUD (HudScene).
export class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
  }

  togglePause() {
    // A full-screen overlay (station, mission flow, logbook...) owns ESC; never resume the world under it.
    if (this.registry.get('overlay')) return;
    if (this.scene.isPaused('Game')) {
      const p = this.scene.get('Pause');
      if (p && p.handleEsc) p.handleEsc();
    } else if (this.scene.isActive('Game')) {
      this.scene.pause('Game');
      this.scene.launch('Pause');
      this.scene.bringToTop('Pause');
    }
  }
}

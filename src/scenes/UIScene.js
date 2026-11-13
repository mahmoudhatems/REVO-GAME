import * as Phaser from 'phaser';
import { NeilDialogueBubble } from '../features/communication/neil/presentation/NeilDialogueBubble.js';

// Keyboard owner for pause toggling. The visible pause button now lives in the global HUD (HudScene).
export class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  init(data) { this.neilContext = data.neilContext ?? null; }

  create() {
    this.cameras.main.setZoom(1).setScroll(0, 0);
    if (this.neilContext) this.setNeilContext(this.neilContext);
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.events.once('shutdown', () => this.clearNeilContext());
  }

  setNeilContext(context) {
    this.clearNeilContext();
    if (!context?.companion || !context?.dialogue || !context?.worldScene) return;
    this.neilContext = context;
    this.neilBubble = new NeilDialogueBubble(this, context);
  }

  clearNeilContext() {
    this.neilBubble?.destroy();
    this.neilBubble = null;
    this.neilContext = null;
  }

  togglePause() {
    if (this.registry.get('overlay')) return;
    const targetScene = this.scene.isActive('Interior') ? 'Interior' : 'Game';
    if (this.scene.isPaused(targetScene)) {
      const p = this.scene.get('Pause');
      if (p && p.handleEsc) p.handleEsc();
    } else if (this.scene.isActive(targetScene)) {
      this.scene.pause(targetScene);
      this.scene.launch('Pause', { targetScene });
      this.scene.bringToTop('Pause');
    }
  }
}
